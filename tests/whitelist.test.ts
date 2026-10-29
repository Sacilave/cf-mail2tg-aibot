import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from '../src/index';
import {
  getWhitelist,
  setWhitelist,
  appendWhitelist,
  resetWhitelist,
  isSenderWhitelisted,
  WHITELIST_KV_KEY,
} from '../src/router';

function createMockKv() {
  const store = new Map<string, string>();
  return {
    store,
    get: vi.fn(async (key: string) => store.get(key) || null),
    put: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    delete: vi.fn(async (key: string) => {
      store.delete(key);
    }),
  };
}

describe('Whitelist System Unit & Integration Tests', () => {
  let mockKv: ReturnType<typeof createMockKv>;

  beforeEach(() => {
    mockKv = createMockKv();
    vi.clearAllMocks();
  });

  describe('Whitelist Storage Layer (router.ts)', () => {
    it('getWhitelist 初始为空时应返回默认备份邮箱基线', async () => {
      const list = await getWhitelist(mockKv, 'backup@example.com');
      expect(list).toEqual(['backup@example.com']);
    });

    it('setWhitelist 应去重、转小写并过滤无效项与注释', async () => {
      const input = [
        '  VIP@Partner.COM  ',
        '# 注释项',
        'vip@partner.com',
        '@company.com',
        '',
      ];
      const ok = await setWhitelist(mockKv, input);
      expect(ok).toBe(true);
      expect(mockKv.put).toHaveBeenCalledTimes(1);

      const list = await getWhitelist(mockKv);
      expect(list).toEqual(['vip@partner.com', '@company.com']);
    });

    it('setWhitelist 幂等性防御: 若内容完全未变，应跳过 kv.put 节省写额度', async () => {
      await setWhitelist(mockKv, ['me@gmail.com']);
      expect(mockKv.put).toHaveBeenCalledTimes(1);

      // Repeat with same items
      await setWhitelist(mockKv, ['me@gmail.com']);
      expect(mockKv.put).toHaveBeenCalledTimes(1); // Not called again
    });

    it('appendWhitelist 应安全增量合并，绝不覆盖已有项', async () => {
      await setWhitelist(mockKv, ['first@test.com']);
      const res = await appendWhitelist(mockKv, ['first@test.com', 'Second@test.com']);
      expect(res.success).toBe(true);
      expect(res.addedCount).toBe(1);
      expect(res.totalCount).toBe(2);
      expect(res.allItems).toContain('first@test.com');
      expect(res.allItems).toContain('second@test.com');
    });

    it('resetWhitelist 应彻底清空 KV 覆盖并恢复默认', async () => {
      await setWhitelist(mockKv, ['custom@domain.com']);
      expect(mockKv.store.has(WHITELIST_KV_KEY)).toBe(true);

      const resetOk = await resetWhitelist(mockKv);
      expect(resetOk).toBe(true);
      expect(mockKv.store.has(WHITELIST_KV_KEY)).toBe(false);
    });

    it('isSenderWhitelisted 精确邮箱与通配泛域名匹配检测', () => {
      const wl = ['backup@example.com', '@trusted-company.com', 'partner.org'];

      // Exact match
      expect(isSenderWhitelisted('backup@example.com', wl)).toBe(true);
      expect(isSenderWhitelisted('  BACKUP@EXAMPLE.COM  ', wl)).toBe(true);
      expect(isSenderWhitelisted('other@gmail.com', wl)).toBe(false);

      // Domain match with @ prefix
      expect(isSenderWhitelisted('alice@trusted-company.com', wl)).toBe(true);
      expect(isSenderWhitelisted('bob@trusted-company.com', wl)).toBe(true);

      // Domain match without @ prefix
      expect(isSenderWhitelisted('ceo@partner.org', wl)).toBe(true);
      expect(isSenderWhitelisted('ceo@other-partner.org', wl)).toBe(false);

      // Empty or invalid inputs
      expect(isSenderWhitelisted('', wl)).toBe(false);
      expect(isSenderWhitelisted('test@test.com', [])).toBe(false);
    });
  });

  describe('Telegram Webhook Whitelist Commands (/whitelist & /addwhitelist)', () => {
    const defaultEnv = {
      TELEGRAM_BOT_TOKEN: 'test_token',
      TELEGRAM_ADMIN_CHAT_ID: '123456',
      FORWARD_TO_EMAIL: 'backup@example.com',
      EMAIL_DOMAIN: 'example.com',
      DEFAULT_LANGUAGE: 'zh-CN',
    };

    it('发送 /whitelist 应返回包含信任名单的卡片与 <pre><code> 方便手机复制', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      vi.stubGlobal('fetch', fetchMock);

      const env = { ...defaultEnv, MAIL_ROUTES_KV: mockKv };
      await setWhitelist(mockKv, ['backup@example.com', 'friend@abc.com']);

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 123456 },
            text: '/whitelist',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('信任白名单库');
      expect(body.text).toContain('<pre><code>');
      expect(body.text).toContain('backup@example.com');
      expect(body.text).toContain('friend@abc.com');
    });

    it('发送 /addwhitelist 新增项应增量合并至白名单', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      vi.stubGlobal('fetch', fetchMock);

      const env = { ...defaultEnv, MAIL_ROUTES_KV: mockKv };
      await setWhitelist(mockKv, ['existing@test.com']);

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 123456 },
            text: '/addwhitelist new@partner.com\n@client.com',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      const list = await getWhitelist(mockKv);
      expect(list).toContain('existing@test.com');
      expect(list).toContain('new@partner.com');
      expect(list).toContain('@client.com');

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('增量白名单添加成功');
    });

    it('发送 /resetwhitelist 应清空自定义白名单并恢复基线', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      vi.stubGlobal('fetch', fetchMock);

      const env = { ...defaultEnv, MAIL_ROUTES_KV: mockKv };
      await setWhitelist(mockKv, ['temp@test.com']);

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 123456 },
            text: '/resetwhitelist',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(mockKv.store.has(WHITELIST_KV_KEY)).toBe(false);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('信任白名单已重置为默认基线');
    });

    it('长按引用回复 (Reply) 白名单消息卡片时，应自动识别并全量更新白名单', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      vi.stubGlobal('fetch', fetchMock);

      const env = { ...defaultEnv, MAIL_ROUTES_KV: mockKv };

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 123456 },
            text: 'alpha@company.com\nbeta@company.com',
            reply_to_message: {
              text: '⭐ 【 邮件信任白名单库 】\n当前生效白名单条目共 1 条。',
            },
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      const list = await getWhitelist(mockKv);
      expect(list).toEqual(['alpha@company.com', 'beta@company.com']);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('信任白名单库已成功更新');
    });
  });

  describe('Email Worker Pipeline Level 0 Whitelist Short-Circuit', () => {
    it('白名单中的发件人来信时，应触发 Level 0 短路：免调 AI、不静音通知、标记白名单特免', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      vi.stubGlobal('fetch', fetchMock);

      const env = {
        TELEGRAM_BOT_TOKEN: 'test_bot_token',
        TELEGRAM_ADMIN_CHAT_ID: '123456',
        FORWARD_TO_EMAIL: 'backup@example.com',
        EMAIL_DOMAIN: 'example.com',
        MAIL_ROUTES_KV: mockKv,
        AI_PROVIDER: 'minimax',
        MINIMAX_API_KEY: 'test_minimax_key',
      };

      // Set user's personal email to whitelist
      await setWhitelist(mockKv, ['backup@example.com']);

      const mockMessage = {
        from: 'backup@example.com',
        to: 'support@example.com',
        headers: new Headers({
          'list-unsubscribe': '<https://example.com/unsub>', // normally triggers RFC marketing!
        }),
        raw: new TextEncoder().encode(
          'From: backup@example.com\r\nTo: support@example.com\r\nSubject: Important Update\r\n\r\nThis is a notification from me.'
        ),
        forward: vi.fn().mockResolvedValue(undefined),
        setReject: vi.fn(),
      };

      await worker.email(mockMessage as any, env as any, {} as any);

      // Verify telegram message sent
      expect(fetchMock).toHaveBeenCalled();
      const tgCalls = fetchMock.mock.calls.filter((call) =>
        call[0].includes('api.telegram.org')
      );
      expect(tgCalls.length).toBeGreaterThan(0);

      const body = JSON.parse(tgCalls[0][1].body);
      // Even with list-unsubscribe header, whitelist bypasses marketing mute
      expect(body.disable_notification).toBeFalsy();
      expect(body.text).toContain('白名单特免');
    });
  });
});
