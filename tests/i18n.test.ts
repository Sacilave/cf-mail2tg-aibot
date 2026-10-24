import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import worker, {
  normalizeLanguage,
  resolveLanguage,
  getTranslation,
  getLanguageKeyboard,
  getCommandsPayload,
  SUPPORTED_LANGUAGES,
} from '../src/index';

describe('i18n System - 8 种主流语言与国际化核心架构测试', () => {
  it('SUPPORTED_LANGUAGES 数组应包含 8 种主流语言元数据', () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toEqual([
      'zh-CN',
      'en-US',
      'zh-TW',
      'ja-JP',
      'ru-RU',
      'es-ES',
      'fr-FR',
      'de-DE',
    ]);
    expect(SUPPORTED_LANGUAGES.length).toBe(8);
  });

  it('normalizeLanguage 应正确标准化各种语言代号变体与简写', () => {
    expect(normalizeLanguage('zh')).toBe('zh-CN');
    expect(normalizeLanguage('zh-cn')).toBe('zh-CN');
    expect(normalizeLanguage('zh_CN')).toBe('zh-CN');
    expect(normalizeLanguage('zh-Hans')).toBe('zh-CN');

    expect(normalizeLanguage('zh-tw')).toBe('zh-TW');
    expect(normalizeLanguage('zh-hk')).toBe('zh-TW');
    expect(normalizeLanguage('zh-Hant')).toBe('zh-TW');

    expect(normalizeLanguage('en')).toBe('en-US');
    expect(normalizeLanguage('en-us')).toBe('en-US');
    expect(normalizeLanguage('en-GB')).toBe('en-US');

    expect(normalizeLanguage('ja')).toBe('ja-JP');
    expect(normalizeLanguage('ja-jp')).toBe('ja-JP');

    expect(normalizeLanguage('ru')).toBe('ru-RU');
    expect(normalizeLanguage('ru-ru')).toBe('ru-RU');

    expect(normalizeLanguage('es')).toBe('es-ES');
    expect(normalizeLanguage('es-es')).toBe('es-ES');

    expect(normalizeLanguage('fr')).toBe('fr-FR');
    expect(normalizeLanguage('fr-fr')).toBe('fr-FR');

    expect(normalizeLanguage('de')).toBe('de-DE');
    expect(normalizeLanguage('de-de')).toBe('de-DE');

    expect(normalizeLanguage('unknown-lang')).toBeNull();
    expect(normalizeLanguage('')).toBeNull();
    expect(normalizeLanguage(null as any)).toBeNull();
  });

  it('getTranslation 应为全部 8 种语言返回完整且结构一致的词典', () => {
    for (const meta of SUPPORTED_LANGUAGES) {
      const dict = getTranslation(meta.code);
      expect(dict).toBeDefined();
      expect(dict.langCode).toBe(meta.code);
      expect(dict.langName).toBeTruthy();
      expect(dict.flag).toBeTruthy();

      // Verify essential sections exist
      expect(dict.startCommand).toBeDefined();
      expect(dict.helpCommand).toBeDefined();
      expect(dict.configCommand).toBeDefined();
      expect(dict.langCommand).toBeDefined();
      expect(dict.setupCommand).toBeDefined();
      expect(dict.emailCard).toBeDefined();
      expect(dict.securityAlerts).toBeDefined();
      expect(dict.routesCommand).toBeDefined();
      expect(dict.keywordsCommand).toBeDefined();

      // Verify email card localized tags
      expect(dict.emailCard.intentTags['业务']).toBeDefined();
      expect(dict.emailCard.personaTags['通用']).toBeDefined();
    }
  });

  it('getTranslation 传入未知语言时应保底回退至 zh-CN', () => {
    const fallbackDict = getTranslation('unknown' as any);
    expect(fallbackDict.langCode).toBe('zh-CN');
    expect(fallbackDict.flag).toBe('🇨🇳');
  });

  it('resolveLanguage 应遵循严格优先级: KV动态配置 > 环境变量默认 > TG客户端上报 > zh-CN保底', async () => {
    const store = new Map<string, string>();
    const mockKv = {
      get: vi.fn(async (key: string) => store.get(key) || null),
      put: vi.fn(async (key: string, val: string) => {
        store.set(key, val);
      }),
      delete: vi.fn(async (key: string) => {
        store.delete(key);
      }),
    } as any;

    // 1. All empty => zh-CN
    expect(await resolveLanguage(mockKv, undefined, undefined)).toBe('zh-CN');

    // 2. Telegram user language provided => maps to that language
    expect(await resolveLanguage(mockKv, undefined, 'ja')).toBe('ja-JP');

    // 3. Env DEFAULT_LANGUAGE overrides Telegram user language
    expect(await resolveLanguage(mockKv, 'ru-RU', 'ja')).toBe('ru-RU');

    // 4. Dynamic KV overrides Env DEFAULT_LANGUAGE
    store.set('config:sys:system_language', 'es-ES');
    expect(await resolveLanguage(mockKv, 'ru-RU', 'ja')).toBe('es-ES');
  });

  it('getLanguageKeyboard 应生成 4x2 网格并包含所有 8 种语言的回调按钮', () => {
    const rows = getLanguageKeyboard('en-US');
    expect(rows).toBeDefined();
    expect(rows.length).toBe(4); // 4 rows
    expect(rows[0].length).toBe(2); // 2 columns

    const allButtons = rows.flat();
    expect(allButtons.length).toBe(8);

    // Selected language should have a checkmark
    const enButton = allButtons.find((btn) => btn.callback_data === 'lang:en-US');
    expect(enButton).toBeDefined();
    expect(enButton?.text).toContain('✓');

    const zhButton = allButtons.find((btn) => btn.callback_data === 'lang:zh-CN');
    expect(zhButton).toBeDefined();
    expect(zhButton?.text).not.toContain('✓');
  });

  it('getCommandsPayload 应生成符合 Telegram Bot API 规范的多语言指令菜单', () => {
    const payload = getCommandsPayload('ja-JP');
    expect(payload.commands).toBeDefined();
    expect(payload.commands.length).toBeGreaterThan(5);

    const langCmd = payload.commands.find((c) => c.command === 'lang');
    expect(langCmd).toBeDefined();
    expect(langCmd?.description).toContain('言語');
  });
});

describe('Telegram Webhook - 多语言交互与即时切换测试', () => {
  let fetchMock: any;
  let store: Map<string, string>;
  let env: any;

  beforeEach(() => {
    store = new Map<string, string>();
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    env = {
      TELEGRAM_BOT_TOKEN: '123456:mock_token',
      TELEGRAM_ADMIN_CHAT_ID: '987654321',
      FORWARD_TO_EMAIL: 'backup@example.com',
      MAIL_ROUTES_KV: {
        get: vi.fn(async (key: string) => store.get(key) || null),
        put: vi.fn(async (key: string, val: string) => {
          store.set(key, val);
        }),
        delete: vi.fn(async (key: string) => {
          store.delete(key);
        }),
      },
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('发送 /lang 指令应返回 8 种语言的选择卡片与内联键盘', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: '/lang',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('语言偏好设置');
    expect(body.reply_markup?.inline_keyboard).toBeDefined();
    expect(body.reply_markup.inline_keyboard.flat().length).toBe(8);
  });

  it('直接发送 /lang ja 应直接切换为日语并持久化存入 KV', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: '/lang ja',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);

    // KV should be updated
    expect(store.get('config:sys:system_language')).toBe('ja-JP');

    // Should call setMyCommands (1st call) and sendMessage (2nd call)
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const setMyCommandsCall = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(setMyCommandsCall.commands).toBeDefined();

    const msgCall = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(msgCall.text).toContain('言語設定を更新しました');
    expect(msgCall.text).toContain('日本語');
  });

  it('点击语言选择内联按钮 (lang:ru-RU) 应答复回调、更新 KV 并编辑卡片为俄语', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query: {
          id: 'cb_lang_123',
          from: { id: 987654321 },
          data: 'lang:ru-RU',
          message: { message_id: 777 },
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);

    // KV should have saved ru-RU
    expect(store.get('config:sys:system_language')).toBe('ru-RU');

    // 1: answerCallbackQuery, 2: editMessageText, 3: setMyCommands
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const answerCall = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(answerCall.callback_query_id).toBe('cb_lang_123');
    expect(answerCall.text).toContain('Русский');

    const editCall = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(editCall.message_id).toBe(777);
    expect(editCall.text).toContain('Настройки языка обновлены');
  });

  it('切换为英文后，后续发送 /help 应输出全英文控制面板', async () => {
    store.set('config:sys:system_language', 'en-US');

    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: '/help',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);

    const body = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(body.text).toContain('Full Control Panel');
    expect(body.text).toContain('/setup');
    expect(body.text).toContain('interactive configuration wizard');
  });

  it('切换为德语后，入站邮件推送的 Telegram 通知卡片应完全本地化为德语', async () => {
    store.set('config:sys:system_language', 'de-DE');

    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const mockMessage = {
      from: 'billing@service.de',
      to: 'account@mycustomdomain.com',
      forward: forwardMock,
      headers: {
        get: (k: string) => (k === 'subject' ? 'Monatsabrechnung' : null),
      },
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('Ihre Rechnung für diesen Monat ist fertig.'));
          c.close();
        },
      }),
    };

    await worker.email(mockMessage, env, null);

    expect(forwardMock).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const tgCallBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(tgCallBody.text).toContain('Neue E-Mail');
    expect(tgCallBody.text).toContain('Empfänger-Domain');
    expect(tgCallBody.text).toContain('Weiterleitungsstatus');
    expect(tgCallBody.text).toContain('E-Mail-Auszug');
  });
});
