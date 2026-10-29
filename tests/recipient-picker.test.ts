import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from '../src/index';
import {
  recordRecentInboundSender,
  getRecentInboundSenders,
  recordRecentOutboundRecipient,
  getRecentOutboundRecipients,
  getSuggestedRecipients,
  setWhitelist,
  getInteractiveSession,
  setInteractiveSession,
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

describe('Recipient Quick-Pick Engine Unit & Flow Tests', () => {
  let mockKv: ReturnType<typeof createMockKv>;

  beforeEach(() => {
    mockKv = createMockKv();
    vi.clearAllMocks();
  });

  describe('History Tracking & Suggested Recipients Aggregation', () => {
    it('recordRecentInboundSender should record latest senders and deduplicate', async () => {
      await recordRecentInboundSender(mockKv, 'sender1@example.com');
      await recordRecentInboundSender(mockKv, 'sender2@example.com');
      // Consecutive repeat from sender2 should be deduplicated without extra write
      await recordRecentInboundSender(mockKv, 'sender2@example.com');

      const senders = await getRecentInboundSenders(mockKv);
      expect(senders[0]).toBe('sender2@example.com');
      expect(senders[1]).toBe('sender1@example.com');
      expect(senders.length).toBe(2);
    });

    it('recordRecentOutboundRecipient should record latest outbound recipients', async () => {
      await recordRecentOutboundRecipient(mockKv, 'client1@domain.com');
      await recordRecentOutboundRecipient(mockKv, 'client2@domain.com');

      const recipients = await getRecentOutboundRecipients(mockKv);
      expect(recipients[0]).toBe('client2@domain.com');
      expect(recipients[1]).toBe('client1@domain.com');
    });

    it('getSuggestedRecipients should deduplicate and prioritize: whitelist > outbound > inbound', async () => {
      await setWhitelist(mockKv, ['backup@example.com', 'partner@firm.com']);
      await recordRecentOutboundRecipient(mockKv, 'partner@firm.com'); // Already in whitelist
      await recordRecentOutboundRecipient(mockKv, 'client@outbound.com'); // New
      await recordRecentInboundSender(mockKv, 'client@outbound.com'); // Already in outbound
      await recordRecentInboundSender(mockKv, 'stranger@inbound.com'); // New

      const suggested = await getSuggestedRecipients(mockKv, 'backup@example.com');

      // Unique addresses only
      const addresses = suggested.map((s) => s.address);
      expect(new Set(addresses).size).toBe(addresses.length);

      // Verify sources and labels
      const saci = suggested.find((s) => s.address === 'backup@example.com');
      expect(saci?.source).toBe('whitelist');
      expect(saci?.label).toContain('白名单');

      const partner = suggested.find((s) => s.address === 'partner@firm.com');
      expect(partner?.source).toBe('whitelist'); // Whitelist priority over outbound

      const client = suggested.find((s) => s.address === 'client@outbound.com');
      expect(client?.source).toBe('outbound');
      expect(client?.label).toContain('最近发给');

      const stranger = suggested.find((s) => s.address === 'stranger@inbound.com');
      expect(stranger?.source).toBe('inbound');
      expect(stranger?.label).toContain('最近来信');
    });
  });

  describe('Compose Flow - Recipient Selection via Quick-Pick Buttons', () => {
    const env = {
      TELEGRAM_BOT_TOKEN: 'test_token',
      TELEGRAM_ADMIN_CHAT_ID: '123456',
      FORWARD_TO_EMAIL: 'backup@example.com',
      EMAIL_DOMAIN: 'example.com',
      DEFAULT_LANGUAGE: 'zh-CN',
    };

    it('should render quick-pick buttons when suggested recipients exist', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      vi.stubGlobal('fetch', fetchMock);

      const workerEnv = { ...env, MAIL_ROUTES_KV: mockKv };
      await setWhitelist(mockKv, ['backup@example.com']);
      await recordRecentOutboundRecipient(mockKv, 'colleague@work.com');

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_test_1',
            from: { id: 123456 },
            data: 'comp:from:service@example.com',
          },
        }),
      });

      const res = await worker.fetch(req, workerEnv);
      expect(res.status).toBe(200);

      // Verify prompt card sent with buttons
      const sendCall = fetchMock.mock.calls.find((c) => c[0].includes('sendMessage'));
      expect(sendCall).toBeDefined();

      const body = JSON.parse(sendCall![1].body);
      expect(body.text).toContain('收件人');
      expect(body.reply_markup.inline_keyboard.length).toBeGreaterThanOrEqual(2);

      const btns = body.reply_markup.inline_keyboard.flat();
      expect(btns.some((b: any) => b.callback_data === 'comp:to_pick:0')).toBe(true);
      expect(btns.some((b: any) => b.callback_data === 'comp:cancel')).toBe(true);
    });

    it('clicking quick-pick button should update session and show subject prompt', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      vi.stubGlobal('fetch', fetchMock);

      const workerEnv = { ...env, MAIL_ROUTES_KV: mockKv };

      // Initialize session with suggested recipients
      await setInteractiveSession(mockKv, {
        type: 'compose_email',
        composeStep: 'input_to',
        composeFrom: 'service@example.com',
        suggestedRecipients: ['colleague@work.com', 'backup@example.com'],
        createdAt: Date.now(),
      });

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_test_pick',
            from: { id: 123456 },
            data: 'comp:to_pick:0',
          },
        }),
      });

      const res = await worker.fetch(req, workerEnv);
      expect(res.status).toBe(200);

      // Verify session updated to input_subject with chosen email
      const session = await getInteractiveSession(mockKv);
      expect(session?.composeStep).toBe('input_subject');
      expect(session?.composeTo).toBe('colleague@work.com');

      // Verify subject prompt card sent
      const sendCall = fetchMock.mock.calls.find((c) => c[0].includes('sendMessage'));
      expect(sendCall).toBeDefined();
      const body = JSON.parse(sendCall![1].body);
      expect(body.text).toContain('邮件主题');
      expect(body.text).toContain('colleague@work.com');
    });
  });
});
