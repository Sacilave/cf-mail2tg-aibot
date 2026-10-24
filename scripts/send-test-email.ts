/**
 * =============================================================================
 * Mock Email Inbound Trigger
 * Simulates receiving an incoming email and tests AI classification + TG push locally.
 *
 * Usage:
 *   npx tsx scripts/send-test-email.ts [toEmail] [intentType]
 * Examples:
 *   npx tsx scripts/send-test-email.ts support@mycorp.com verify
 *   npx tsx scripts/send-test-email.ts help@mycorp.com business
 * =============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import worker from '../src/index';
import type { Env } from '../src/types';

function loadDevVars(): Record<string, string> {
  const env: Record<string, string> = {};
  const devVarsPath = path.resolve(process.cwd(), '.dev.vars');

  if (fs.existsSync(devVarsPath)) {
    const content = fs.readFileSync(devVarsPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        env[key] = val;
      }
    }
  }

  for (const [k, v] of Object.entries(process.env)) {
    if (v && !env[k]) env[k] = v;
  }
  return env;
}

class LocalKvStorage {
  private filePath: string;
  private data: Map<string, string>;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.data = new Map();
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const obj = JSON.parse(raw);
        for (const [k, v] of Object.entries(obj)) {
          this.data.set(k, String(v));
        }
      } catch {}
    }
  }

  async get(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }
  async put(key: string, val: string): Promise<void> {
    this.data.set(key, val);
  }
  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }
  async list(opts?: { prefix?: string }): Promise<{ keys: { name: string }[] }> {
    const keys: { name: string }[] = [];
    for (const k of this.data.keys()) {
      if (!opts?.prefix || k.startsWith(opts.prefix)) keys.push({ name: k });
    }
    return { keys };
  }
}

async function main() {
  const devVars = loadDevVars();
  const botToken = devVars.TELEGRAM_BOT_TOKEN?.trim();
  const adminChatId = devVars.TELEGRAM_ADMIN_CHAT_ID?.trim();

  // Proxy support
  const proxyUrl =
    devVars.HTTPS_PROXY ||
    devVars.HTTP_PROXY ||
    devVars.ALL_PROXY ||
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY;

  if (proxyUrl) {
    try {
      const undici = await import('undici');
      undici.setGlobalDispatcher(new undici.ProxyAgent(proxyUrl));
    } catch {}
  }

  if (!botToken || !adminChatId || botToken.includes('your_bot_token')) {
    console.error(`❌ [错误] 请先在 .dev.vars 中填写 TELEGRAM_BOT_TOKEN 和 TELEGRAM_ADMIN_CHAT_ID！`);
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const targetTo = args[0] || 'support@mycorp.com';
  const testType = (args[1] || 'verify').toLowerCase();

  let subject = '';
  let content = '';

  if (testType === 'verify') {
    subject = '【GitHub】Your security verification code is 849201';
    content =
      `Hello developer,\r\n\r\n` +
      `We received a sign-in attempt from a new device.\r\n` +
      `Verification code: 849201\r\n` +
      `This code will expire in 10 minutes. If this was not you, please secure your account immediately.\r\n`;
  } else if (testType === 'marketing') {
    subject = 'Exclusive 70% Off Black Friday SaaS Deals Just for You!';
    content =
      `Hey there!\r\n\r\n` +
      `Check out our huge holiday discount! Upgrade to Pro today for only $9.99.\r\n` +
      `If you don't wish to receive marketing offers, please click unsubscribe here.\r\n`;
  } else {
    subject = '关于企业级 API 方案咨询与商务合作洽谈';
    content =
      `您好！\r\n\r\n` +
      `我是 ABC 科技的商务采购负责人，我们在调研贵司的邮件网关服务，希望进一步了解企业版定制与批量部署的方案与报价。\r\n` +
      `期待您的回复！\r\n`;
  }

  console.log(`\n📨 ========================================================`);
  console.log(`   正在模拟收信并触发 AI 分流与 Telegram 卡片推送...`);
  console.log(`========================================================\n`);
  console.log(`• 收件邮箱 (To): ${targetTo}`);
  console.log(`• 邮件主题: ${subject}`);
  console.log(`• 测试类型: ${testType}`);

  const rawMime =
    `From: "Acme Service" <noreply@service.com>\r\n` +
    `To: ${targetTo}\r\n` +
    `Subject: ${subject}\r\n` +
    `Date: ${new Date().toUTCString()}\r\n` +
    `Content-Type: text/plain; charset=utf-8\r\n\r\n` +
    content;

  const mockMessage = {
    from: 'noreply@service.com',
    to: targetTo,
    headers: {
      get: (k: string) => {
        const norm = k.toLowerCase();
        if (norm === 'subject') return subject;
        if (norm === 'date') return new Date().toUTCString();
        return null;
      },
    },
    forward: async (dest: string) => {
      console.log(`📥 [模拟备份转发] 邮件已同步投递至备份邮箱: ${dest}`);
    },
    raw: new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(rawMime));
        controller.close();
      },
    }),
  };

  const kvPath = path.resolve(process.cwd(), '.local-kv.json');
  const env: Env = {
    ...devVars,
    TELEGRAM_BOT_TOKEN: botToken,
    TELEGRAM_ADMIN_CHAT_ID: adminChatId,
    MAIL_ROUTES_KV: new LocalKvStorage(kvPath),
  };

  try {
    await worker.email(mockMessage, env, null);
    console.log(`\n✅ [模拟测试成功] 邮件卡片已成功推送至 Telegram！请在手机/电脑客户端查看。`);
  } catch (err: any) {
    console.error(`❌ [模拟测试失败]:`, err);
  }
}

main().catch(console.error);
