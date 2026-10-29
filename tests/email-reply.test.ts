import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  formatReplySubject,
  sendEmailViaResend,
  cleanHeaderValue,
} from '../src/email-sender';
import {
  saveEmailReplyMeta,
  getEmailReplyMeta,
  getEffectiveResendKey,
} from '../src/router';
import app from '../src/index';

describe('Resend Email Reply System', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('formatReplySubject & cleanHeaderValue', () => {
    it('should add "Re: " to clean subject', () => {
      expect(formatReplySubject('Hello World')).toBe('Re: Hello World');
    });

    it('should not duplicate "Re: "', () => {
      expect(formatReplySubject('Re: Hello World')).toBe('Re: Hello World');
      expect(formatReplySubject('re: Hello World')).toBe('re: Hello World');
      expect(formatReplySubject('RE: Hello World')).toBe('RE: Hello World');
    });

    it('should handle empty or whitespace subject', () => {
      expect(formatReplySubject('')).toBe('Re: (No Subject)');
      expect(formatReplySubject('   ')).toBe('Re: (No Subject)');
    });

    it('should strip CRLF and control characters from header values', () => {
      expect(cleanHeaderValue('Subject\r\nBcc: evil@attacker.com')).toBe('Subject Bcc: evil@attacker.com');
      expect(cleanHeaderValue('<msg123\r\n@client.com>')).toBe('<msg123 @client.com>');
      expect(formatReplySubject('Subject\nInjected Header')).toBe('Re: Subject Injected Header');
    });
  });

  describe('sendEmailViaResend Security Hardening', () => {
    it('should fail if apiKey is missing', async () => {
      const res = await sendEmailViaResend({
        apiKey: '',
        from: 'service@example.com',
        to: 'client@example.com',
        subject: 'Test',
        text: 'Reply body',
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain('Resend API Key is missing');
    });

    it('should fail if from or to is missing', async () => {
      const res = await sendEmailViaResend({
        apiKey: 're_123',
        from: '',
        to: 'client@example.com',
        subject: 'Test',
        text: 'Reply body',
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain('missing');
    });

    it('should block malformed or invalid email addresses', async () => {
      const res1 = await sendEmailViaResend({
        apiKey: 're_123',
        from: 'not-an-email',
        to: 'client@example.com',
        subject: 'Test',
        text: 'Reply body',
      });
      expect(res1.success).toBe(false);
      expect(res1.error).toContain('Invalid sender email format');

      const res2 = await sendEmailViaResend({
        apiKey: 're_123',
        from: 'service@example.com',
        to: 'invalid-recipient@@domain',
        subject: 'Test',
        text: 'Reply body',
      });
      expect(res2.success).toBe(false);
      expect(res2.error).toContain('Invalid recipient email format');
    });

    it('should prevent sending to self in an infinite loop', async () => {
      const res = await sendEmailViaResend({
        apiKey: 're_123',
        from: 'service@example.com',
        to: 'service@example.com',
        subject: 'Test',
        text: 'Self loop text',
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain('preventing self-loop');
    });

    it('should inject In-Reply-To and References headers with CRLF neutralized', async () => {
      let capturedPayload: any = null;
      let capturedHeaders: any = null;

      globalThis.fetch = vi.fn().mockImplementation(async (url: string, opts: any) => {
        capturedPayload = JSON.parse(opts.body);
        capturedHeaders = opts.headers;
        return {
          ok: true,
          json: async () => ({ id: 'resend_msg_12345' }),
        };
      });

      const res = await sendEmailViaResend({
        apiKey: ' "re_mock_test_key" ', // test quotation/whitespace trimming
        from: 'Support <service@example.com>',
        to: 'Client Name <client@example.com>',
        subject: 'Inquiry\r\nBcc: evil@test.com',
        text: 'This is my reply text.',
        inReplyTo: '<message123\n@client.com>',
      });

      expect(res.success).toBe(true);
      expect(res.id).toBe('resend_msg_12345');
      expect(capturedPayload.subject).toBe('Re: Inquiry Bcc: evil@test.com');
      expect(capturedPayload.from).toBe('service@example.com');
      expect(capturedPayload.to).toEqual(['client@example.com']);
      expect(capturedPayload.headers['In-Reply-To']).toBe('<message123 @client.com>');
      expect(capturedPayload.headers['References']).toBe('<message123 @client.com>');
      expect(capturedHeaders['Authorization']).toBe('Bearer re_mock_test_key');
    });

    it('should handle API failure gracefully', async () => {
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        return {
          ok: false,
          status: 403,
          statusText: 'Forbidden',
          json: async () => ({ message: 'Domain not verified' }),
        };
      });

      const res = await sendEmailViaResend({
        apiKey: 're_mock_test_key',
        from: 'service@example.com',
        to: 'client@example.com',
        subject: 'Inquiry',
        text: 'Reply text',
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('Domain not verified');
    });
  });

  describe('KV Reply Metadata Management', () => {
    it('should save and get reply metadata with TTL', async () => {
      const store = new Map<string, string>();
      const mockKv = {
        put: vi.fn().mockImplementation(async (key: string, val: string) => {
          store.set(key, val);
        }),
        get: vi.fn().mockImplementation(async (key: string) => {
          return store.get(key) || null;
        }),
      };

      const replyId = await saveEmailReplyMeta(mockKv, {
        from: 'client@example.com',
        to: 'service@example.com',
        subject: 'Project inquiry',
        messageId: '<orig-msg-123@client.com>',
      });

      expect(replyId).toMatch(/^r_/);
      expect(mockKv.put).toHaveBeenCalledWith(
        expect.stringContaining(replyId),
        expect.any(String),
        { expirationTtl: 604800 }
      );

      const retrieved = await getEmailReplyMeta(mockKv, replyId);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.from).toBe('client@example.com');
      expect(retrieved?.to).toBe('service@example.com');
      expect(retrieved?.subject).toBe('Project inquiry');
      expect(retrieved?.messageId).toBe('<orig-msg-123@client.com>');
    });
  });

  describe('getEffectiveResendKey', () => {
    it('should prioritize dynamic KV config over env', async () => {
      const mockKv = {
        get: vi.fn().mockResolvedValue('re_kv_custom_key'),
      };
      const env = {
        TELEGRAM_BOT_TOKEN: 'token',
        TELEGRAM_ADMIN_CHAT_ID: '123',
        RESEND_API_KEY: 're_env_key',
      };

      const key = await getEffectiveResendKey(env, mockKv);
      expect(key).toBe('re_kv_custom_key');
    });

    it('should fallback to env if KV is not set', async () => {
      const mockKv = {
        get: vi.fn().mockResolvedValue(null),
      };
      const env = {
        TELEGRAM_BOT_TOKEN: 'token',
        TELEGRAM_ADMIN_CHAT_ID: '123',
        RESEND_API_KEY: 're_env_key',
      };

      const key = await getEffectiveResendKey(env, mockKv);
      expect(key).toBe('re_env_key');
    });
  });

  describe('Telegram Webhook Reply Workflow', () => {
    it('should clean quoted key when running /setkey resend', async () => {
      const store = new Map<string, string>();
      const mockKv = {
        put: vi.fn().mockImplementation(async (k: string, v: string) => {
          store.set(k, v);
        }),
        get: vi.fn().mockImplementation(async (k: string) => {
          return store.get(k) || null;
        }),
      };

      globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });

      const env: any = {
        TELEGRAM_BOT_TOKEN: 'test_token',
        TELEGRAM_ADMIN_CHAT_ID: '999999',
        MAIL_ROUTES_KV: mockKv,
      };

      const setkeyReq = new Request('https://worker.local/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            message_id: 200,
            from: { id: 999999 },
            text: '/setkey resend "re_clean_quoted_12345"',
          },
        }),
      });

      const res = await app.fetch(setkeyReq, env);
      expect(res.status).toBe(200);
      expect(store.get('config:sys:resend_api_key')).toBe('re_clean_quoted_12345');
    });

    it('should activate reply session and send email through Resend', async () => {
      const store = new Map<string, string>();
      const mockKv = {
        put: vi.fn().mockImplementation(async (k: string, v: string) => {
          store.set(k, v);
        }),
        get: vi.fn().mockImplementation(async (k: string) => {
          return store.get(k) || null;
        }),
        delete: vi.fn().mockImplementation(async (k: string) => {
          store.delete(k);
        }),
      };

      // Seed metadata
      await saveEmailReplyMeta(mockKv, {
        from: 'client@example.com',
        to: 'service@example.com',
        subject: 'Pricing request',
        messageId: '<client-123@test.com>',
      });

      // Get replyId from store
      let replyId = '';
      for (const k of store.keys()) {
        if (k.startsWith('mail:reply:')) {
          replyId = k.replace('mail:reply:', '');
          break;
        }
      }

      // Seed Resend Key
      store.set('config:sys:resend_api_key', 're_test_key_123');

      const tgCalls: any[] = [];
      globalThis.fetch = vi.fn().mockImplementation(async (url: string, opts: any) => {
        tgCalls.push({ url, body: opts?.body ? JSON.parse(opts.body) : null });
        return { ok: true, json: async () => ({ ok: true }) };
      });

      const env: any = {
        TELEGRAM_BOT_TOKEN: 'test_token',
        TELEGRAM_ADMIN_CHAT_ID: '999999',
        MAIL_ROUTES_KV: mockKv,
      };

      // 1. Trigger callback query
      const callbackReq = new Request('https://worker.local/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_123',
            from: { id: 999999 },
            data: `rep:${replyId}`,
          },
        }),
      });

      const cbRes = await app.fetch(callbackReq, env);
      expect(cbRes.status).toBe(200);

      // Verify interactive session saved
      const sessionRaw = store.get('session:interactive_action');
      expect(sessionRaw).toBeDefined();
      const session = JSON.parse(sessionRaw!);
      expect(session.type).toBe('reply_email');
      expect(session.fromRoute).toBe('service@example.com');
      expect(session.targetSender).toBe('client@example.com');

      // 2. Admin inputs reply text message
      const textReq = new Request('https://worker.local/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            message_id: 101,
            from: { id: 999999 },
            text: 'Hello, our price is $10/mo. Best regards!',
          },
        }),
      });

      const textRes = await app.fetch(textReq, env);
      expect(textRes.status).toBe(200);

      // Verify Resend was called
      const resendPost = tgCalls.find((c) => c.url.includes('resend.com/emails'));
      expect(resendPost).toBeDefined();
      expect(resendPost.body.from).toBe('service@example.com');
      expect(resendPost.body.to).toEqual(['client@example.com']);
      expect(resendPost.body.text).toBe('Hello, our price is $10/mo. Best regards!');
      expect(resendPost.body.headers['In-Reply-To']).toBe('<client-123@test.com>');

      // Verify session was destroyed
      expect(store.has('session:interactive_action')).toBe(false);
    });
  });
});
