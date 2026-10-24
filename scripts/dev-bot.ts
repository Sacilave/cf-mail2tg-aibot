/**
 * =============================================================================
 * Local Development & Testing Runner (Long Polling)
 * Allows testing cf-mail2tg-aibot with a real Telegram Bot without Cloudflare Worker.
 *
 * Usage:
 *   npx tsx scripts/dev-bot.ts
 * =============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import worker from '../src/index';
import type { Env } from '../src/types';
import { getCommandsPayload, getTranslation } from '../src/i18n';
import { renderMasterDashboardHtml, getMasterMenuKeyboard } from '../src/card-renderer';

// ======================== Environment Variables Loader ========================

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

  // Merge process.env fallback
  for (const [k, v] of Object.entries(process.env)) {
    if (v && !env[k]) {
      env[k] = v;
    }
  }

  return env;
}

// ======================== Local Persistent KV Mock ========================

class LocalKvStorage {
  private filePath: string;
  private data: Map<string, string>;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.data = new Map();
    this.load();
  }

  private load(): void {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const obj = JSON.parse(raw);
        for (const [k, v] of Object.entries(obj)) {
          this.data.set(k, String(v));
        }
      } catch {
        // ignore parse error on fresh start
      }
    }
  }

  private save(): void {
    try {
      const obj: Record<string, string> = {};
      for (const [k, v] of this.data.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(this.filePath, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (err) {
      console.error('[LocalKV] 保存数据失败:', err);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async put(key: string, val: string): Promise<void> {
    this.data.set(key, val);
    this.save();
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
    this.save();
  }

  async list(opts?: { prefix?: string }): Promise<{ keys: { name: string }[] }> {
    const keys: { name: string }[] = [];
    for (const k of this.data.keys()) {
      if (!opts?.prefix || k.startsWith(opts.prefix)) {
        keys.push({ name: k });
      }
    }
    return { keys };
  }
}

// ======================== Main Long-Polling Loop ========================

async function main() {
  console.log(`\n🤖 ========================================================`);
  console.log(`   cf-mail2tg-aibot 本地极速测试运行器 (免 Worker 部署模式)`);
  console.log(`========================================================\n`);

  const devVars = loadDevVars();
  const botToken = devVars.TELEGRAM_BOT_TOKEN?.trim();
  const adminChatId = devVars.TELEGRAM_ADMIN_CHAT_ID?.trim();

  // Proxy support (Clash / v2ray / Mihomo etc.)
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
      console.log(`🌐 [网络代理] 已成功挂载代理: ${proxyUrl}`);
    } catch (err) {
      console.warn(`⚠️ [网络代理] 代理挂载失败，将尝试直连:`, err);
    }
  }

  if (!botToken || !adminChatId || botToken.includes('your_bot_token')) {
    console.error(`❌ [配置缺失] 未检测到有效的 Telegram Bot 配置！`);
    console.log(`\n💡 【如何快速启动本地测试？】`);
    console.log(`1. 在项目根目录下打开或创建 .dev.vars 文件；`);
    console.log(`2. 填入您的 Bot Token 和 Admin Chat ID:`);
    console.log(`   TELEGRAM_BOT_TOKEN="123456789:AAHxxxxxxxxxxxxxxxxxxxx"`);
    console.log(`   TELEGRAM_ADMIN_CHAT_ID="987654321"`);
    console.log(`   # 可选：配置代理（国内网络访问 Telegram 时需要）`);
    console.log(`   # HTTPS_PROXY="http://127.0.0.1:7890"`);
    console.log(`3. 保存后重新运行本脚本即可！\n`);
    process.exit(1);
  }

  // Initialize Local Persistent KV storage
  const kvPath = path.resolve(process.cwd(), '.local-kv.json');
  const localKv = new LocalKvStorage(kvPath);

  const env: Env = {
    ...devVars,
    TELEGRAM_BOT_TOKEN: botToken,
    TELEGRAM_ADMIN_CHAT_ID: adminChatId,
    MAIL_ROUTES_KV: localKv,
  };

  // 1. Verify Bot Token & Get Bot Info (with auto-retry)
  let botUsername = '';
  let meData: any = null;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      meData = (await meRes.json()) as any;
      if (!meData.ok) {
        console.error(`❌ [认证失败] Telegram API 返回错误:`, meData.description);
        process.exit(1);
      }
      break;
    } catch (err: any) {
      if (attempt < 5) {
        console.log(`[连接重试中 (${attempt}/5)]...: ${err?.message || err}`);
        await new Promise((r) => setTimeout(r, 1500));
      } else {
        console.error(`❌ [连接失败] 无法连接到 Telegram API (api.telegram.org):`, err?.message || err);
        if (!proxyUrl) {
          console.log(`💡 提示: 若您在中国大陆地区，请在 .dev.vars 中设置代理地址，例如:`);
          console.log(`   HTTPS_PROXY="http://127.0.0.1:7890"`);
        }
        process.exit(1);
      }
    }
  }

  botUsername = meData.result.username;
  console.log(`✅ [机器人认证成功]`);
  console.log(`   • 机器人名称: ${meData.result.first_name} (@${botUsername})`);
  console.log(`   • 管理员 ID: ${adminChatId}`);
  console.log(`   • 本地数据存储: ${kvPath}`);

  // 2. Remove existing webhook to allow getUpdates long polling
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=false`);
    console.log(`🔄 [Webhook 解绑] 已临时转为本地长轮询 (getUpdates) 模式`);
  } catch {}

  // 3. Register Telegram Commands so Telegram's bottom-left [Menu] button appears
  try {
    const payload = getCommandsPayload('zh-CN');
    const setCmdRes = await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const setCmdData = (await setCmdRes.json()) as any;
    if (setCmdData.ok) {
      console.log(`📋 [菜单注册] Telegram 左下角 [Menu] 菜单按钮已激活成功！`);
    }
  } catch (err) {
    console.warn(`⚠️ [菜单注册失败]:`, err);
  }

  // 4. Proactively send Master Dashboard with 2x3 inline buttons to Admin
  try {
    const dict = getTranslation('zh-CN');
    const dashboardCard = renderMasterDashboardHtml({
      dict,
      provider: devVars.AI_PROVIDER || 'deepseek',
      model: 'deepseek-chat',
      keyConfigured: Boolean(devVars.AI_API_KEY || devVars.DEEPSEEK_API_KEY),
      forwardEmail: devVars.FORWARD_TO_EMAIL || 'backup@example.com',
      gmailAliasesEnabled: String(devVars.ENABLE_GMAIL_ALIASES ?? 'true').toLowerCase() === 'true',
      customRulesCount: 0,
      keywordsCount: 45,
      langName: dict.langName,
    });

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: dashboardCard,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: getMasterMenuKeyboard(dict),
        },
      }),
    });
    console.log(`🎛️ [控制中枢推送] 已主动向 Telegram 管理员推送主控制面板与按键！`);
  } catch (err) {
    console.warn(`⚠️ [控制中枢推送失败]:`, err);
  }

  console.log(`\n🎉 【已准备就绪！】`);
  console.log(`👉 请现在打开手机/电脑 Telegram，进入与 @${botUsername} 的对话`);
  console.log(`👉 发送 /menu 或 /start，即可开始测试所有内联按键与层级面板！\n`);
  console.log(`--------------------------------------------------------`);

  let offset = 0;
  let isRunning = true;

  process.on('SIGINT', () => {
    console.log(`\n🛑 正在停止本地测试机器人...`);
    isRunning = false;
    process.exit(0);
  });

  while (isRunning) {
    try {
      const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=20`;
      const res = await fetch(url);
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      const data = (await res.json()) as any;
      if (!data.ok || !Array.isArray(data.result)) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      for (const update of data.result) {
        offset = update.update_id + 1;

        if (update.message) {
          const from = update.message.from;
          const text = update.message.text || '';
          console.log(`💬 [收到消息] 来自: ${from?.first_name || from?.id} (ID: ${from?.id}): "${text}"`);
        } else if (update.callback_query) {
          const from = update.callback_query.from;
          const cbData = update.callback_query.data;
          console.log(`🔘 [点击按钮] 来自: ${from?.first_name || from?.id}: 触发回调 "${cbData}"`);
        }

        // Construct standard Fetch Request to feed into worker.fetch
        const req = new Request('http://localhost/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
        });

        try {
          await worker.fetch(req, env);
        } catch (err) {
          console.error(`⚠️ [处理更新异常]:`, err);
        }
      }
    } catch (err: any) {
      if (isRunning) {
        console.warn(`[网络轮询重试中...]: ${err.message}`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
