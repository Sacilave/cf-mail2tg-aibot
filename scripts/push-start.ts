import fs from 'node:fs';
import path from 'node:path';
import { getTranslation } from '../src/i18n';
import { renderStartCardHtml, getStartKeyboard } from '../src/card-renderer';
import { getEffectiveAiConfig, getDynamicConfig } from '../src/router';

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
  return env;
}

class LocalKvStorage {
  private filePath: string;
  private data: Map<string, string>;
  constructor(filePath: string) {
    this.filePath = filePath;
    this.data = new Map();
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const obj = JSON.parse(raw);
        for (const [k, v] of Object.entries(obj)) this.data.set(k, String(v));
      } catch {}
    }
  }
  async get(key: string) { return this.data.get(key) || null; }
  async put(key: string, val: string) { this.data.set(key, val); }
  async delete(key: string) { this.data.delete(key); }
  async list() { return { keys: [] }; }
}

async function main() {
  const devVars = loadDevVars();
  const botToken = devVars.TELEGRAM_BOT_TOKEN?.trim();
  const adminChatId = devVars.TELEGRAM_ADMIN_CHAT_ID?.trim();
  const proxyUrl = devVars.HTTPS_PROXY || 'http://127.0.0.1:7897';

  if (proxyUrl) {
    const undici = await import('undici');
    undici.setGlobalDispatcher(new undici.ProxyAgent(proxyUrl));
  }

  const localKv = new LocalKvStorage(path.resolve(process.cwd(), '.local-kv.json'));
  const env: any = { ...devVars, MAIL_ROUTES_KV: localKv };

  const effectiveAi = await getEffectiveAiConfig(env, localKv);
  const fwd = (await getDynamicConfig(localKv, 'forward_to_email')) || env.FORWARD_TO_EMAIL || '';
  const aliasesEnabled = String((await getDynamicConfig(localKv, 'enable_gmail_aliases')) ?? env.ENABLE_GMAIL_ALIASES ?? 'true').toLowerCase() === 'true';
  const dict = getTranslation('zh-CN');

  const startCard = renderStartCardHtml({
    dict,
    provider: effectiveAi.provider,
    model: effectiveAi.model,
    forwardEmail: fwd,
    gmailAliasesEnabled: aliasesEnabled,
  });

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: adminChatId,
      text: startCard,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: getStartKeyboard(dict),
      },
    }),
  });

  const data = await res.json() as any;
  if (data.ok) {
    console.log('✅ 已成功向 Telegram 管理员推送最新 /start 欢迎卡片与全新导航按键！');
  } else {
    console.error('❌ 推送失败:', data);
  }
}

main().catch(console.error);
