import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getEmailReplyKeyboard,
  renderEmailSummaryCard,
  renderEmailTranslationCard,
  renderFullEmailWebPage,
} from '../src/card-renderer';
import {
  saveEmailReplyMeta,
  getEmailReplyMeta,
  updateEmailReplyMeta,
} from '../src/router';
import app from '../src/index';
import { getTranslation } from '../src/i18n';
import { formatTelegramSafeHtml } from '../src/sanitizer';
import { isSenderWhitelisted } from '../src/router';

describe('Inbound Email Action Buttons & Features', () => {
  const dict = getTranslation('zh');
  let mockKvStore: Record<string, string>;
  let mockKv: any;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockKvStore = {};
    mockKv = {
      get: vi.fn(async (key: string) => mockKvStore[key] || null),
      put: vi.fn(async (key: string, val: string) => {
        mockKvStore[key] = val;
      }),
      delete: vi.fn(async (key: string) => {
        delete mockKvStore[key];
      }),
    };
  });

  describe('getEmailReplyKeyboard layout', () => {
    it('should generate 5 interactive buttons across 3 rows', () => {
      const replyId = 'test_reply_123';
      const keyboard = getEmailReplyKeyboard(dict, replyId);

      expect(keyboard.length).toBe(3);
      // Row 1
      expect(keyboard[0].length).toBe(2);
      expect(keyboard[0][0].callback_data).toBe(`rep:${replyId}`);
      expect(keyboard[0][1].text).toContain('AI 总结');
      expect(keyboard[0][1].callback_data).toBe(`ai:sum:${replyId}`);

      // Row 2
      expect(keyboard[1].length).toBe(2);
      expect(keyboard[1][0].text).toContain('AI 翻译');
      expect(keyboard[1][0].callback_data).toBe(`ai:tr:${replyId}`);
      expect(keyboard[1][1].text).toContain('复制正文');
      expect(keyboard[1][1].callback_data).toBe(`act:copy:${replyId}`);

      // Row 3
      expect(keyboard[2].length).toBe(1);
      expect(keyboard[2][0].text).toContain('查看完整原文');
      expect(keyboard[2][0].callback_data).toBe(`act:view:${replyId}`);
    });
  });

  describe('updateEmailReplyMeta caching', () => {
    it('should update metadata with AI summary and translation cache', async () => {
      const replyId = await saveEmailReplyMeta(mockKv, {
        from: 'boss@company.com',
        to: 'service@example.com',
        subject: 'Quarterly Review',
        bodyText: 'Please review Q3 earnings by tomorrow 5pm.',
      });

      const updated = await updateEmailReplyMeta(mockKv, replyId, {
        aiSummary: '• 请在明天下午5点前审核Q3财务收益情况。',
        aiTranslation: '请在明天下午5点前审查第三季度收益。',
        aiTranslatedSubject: '季度审查',
      });

      expect(updated).toBe(true);

      const meta = await getEmailReplyMeta(mockKv, replyId);
      expect(meta?.aiSummary).toBe('• 请在明天下午5点前审核Q3财务收益情况。');
      expect(meta?.aiTranslation).toBe('请在明天下午5点前审查第三季度收益。');
      expect(meta?.aiTranslatedSubject).toBe('季度审查');
      expect(meta?.bodyText).toBe('Please review Q3 earnings by tomorrow 5pm.');
    });
  });

  describe('renderFullEmailWebPage (Web Reader)', () => {
    it('should render clean responsive HTML and neutralize malicious scripts', () => {
      const html = renderFullEmailWebPage({
        subject: 'Security Alert <script>alert("hacked")</script>',
        from: 'security@example.com',
        to: 'service@example.com',
        createdAt: Date.now(),
        bodyHtml: '<p>Click <a href="https://example.com" onclick="alert(1)">here</a></p><script>evil()</script>',
      });

      expect(html).toContain('Security Alert &lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;');
      expect(html).not.toContain('<script>evil()</script>');
      expect(html).not.toContain('onclick="alert(1)"');
      expect(html).toContain('端到端安全视图');
      expect(html).toContain('复制全文文本');
    });

    it('should fallback to plain text if HTML body is absent', () => {
      const html = renderFullEmailWebPage({
        subject: 'Text Only',
        from: 'sender@example.com',
        to: 'me@example.com',
        createdAt: Date.now(),
        bodyText: 'Line 1\nLine 2',
      });

      expect(html).toContain('class="pre-text"');
      expect(html).toContain('Line 1\nLine 2');
    });
  });

  describe('HTTP GET /view/:replyId route', () => {
    it('should return 404 if email does not exist in KV', async () => {
      const res = await app.fetch(
        new Request('https://cf-mail2tg-aibot.yoursubdomain.workers.dev/view/non_existent_id'),
        {
          MAIL_ROUTES_KV: mockKv,
          TELEGRAM_BOT_TOKEN: '123456:ABC',
          TELEGRAM_ADMIN_CHAT_ID: '987654321',
        } as any
      );

      expect(res.status).toBe(404);
      const text = await res.text();
      expect(text).toContain('404 Not Found');
    });

    it('should serve full email web reader when replyId exists', async () => {
      const replyId = await saveEmailReplyMeta(mockKv, {
        from: 'partner@corp.com',
        to: 'support@example.com',
        subject: 'Confidential Proposal',
        bodyText: 'This is the long detailed proposal content exceeding 4096 characters...',
      });

      const res = await app.fetch(
        new Request(`https://cf-mail2tg-aibot.yoursubdomain.workers.dev/view/${replyId}`),
        {
          MAIL_ROUTES_KV: mockKv,
          TELEGRAM_BOT_TOKEN: '123456:ABC',
          TELEGRAM_ADMIN_CHAT_ID: '987654321',
        } as any
      );

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('text/html');
      const html = await res.text();
      expect(html).toContain('Confidential Proposal');
      expect(html).toContain('partner@corp.com');
      expect(html).toContain('support@example.com');
    });
  });

  describe('Telegram Callback Handlers', () => {
    it('act:copy should send <pre><code> block for 1-tap copy', async () => {
      const replyId = await saveEmailReplyMeta(mockKv, {
        from: 'service@github.com',
        to: 'service@example.com',
        subject: 'Verification Code',
        bodyText: 'Your verification code is 849201.',
      });

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ ok: true, result: {} }))
      );

      const res = await app.fetch(
        new Request('https://cf-mail2tg-aibot.yoursubdomain.workers.dev/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query: {
              id: 'cb_test_copy',
              from: { id: 987654321, language_code: 'zh-CN' },
              data: `act:copy:${replyId}`,
            },
          }),
        }),
        {
          MAIL_ROUTES_KV: mockKv,
          TELEGRAM_BOT_TOKEN: 'mock_bot_token',
          TELEGRAM_ADMIN_CHAT_ID: '987654321',
        } as any
      );

      expect(res.status).toBe(200);
      expect(fetchSpy).toHaveBeenCalled();
      const calls = fetchSpy.mock.calls.map((c) => JSON.parse(c[1]?.body as string || '{}'));
      const sendMsgCall = calls.find((c) => c.text?.includes('邮件正文拷贝板'));
      expect(sendMsgCall).toBeDefined();
      expect(sendMsgCall.text).toContain('<pre><code>Your verification code is 849201.</code></pre>');
    });

    it('act:view should send reader card with online reader URL', async () => {
      const replyId = await saveEmailReplyMeta(mockKv, {
        from: 'news@daily.com',
        to: 'service@example.com',
        subject: 'Daily Tech Newsletter',
        bodyText: 'Here is today top 10 tech breakthroughs...',
      });

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ ok: true, result: {} }))
      );

      const res = await app.fetch(
        new Request('https://cf-mail2tg-aibot.yoursubdomain.workers.dev/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query: {
              id: 'cb_test_view',
              from: { id: 987654321, language_code: 'zh-CN' },
              data: `act:view:${replyId}`,
            },
          }),
        }),
        {
          MAIL_ROUTES_KV: mockKv,
          TELEGRAM_BOT_TOKEN: 'mock_bot_token',
          TELEGRAM_ADMIN_CHAT_ID: '987654321',
        } as any
      );

      expect(res.status).toBe(200);
      const calls = fetchSpy.mock.calls.map((c) => JSON.parse(c[1]?.body as string || '{}'));
      const viewMsgCall = calls.find((c) => c.text?.includes('邮件完整原文阅读器'));
      expect(viewMsgCall).toBeDefined();
      expect(viewMsgCall.reply_markup.inline_keyboard[0][0].url).toContain(`/view/${replyId}`);
    });

    it('ai:sum should return cached summary instantly when already cached', async () => {
      const replyId = await saveEmailReplyMeta(mockKv, {
        from: 'client@domain.com',
        to: 'service@example.com',
        subject: 'Project Update',
        bodyText: 'We deployed v2.0 successfully today.',
        aiSummary: '• 今日已成功部署 v2.0 版本，系统运行平稳。',
      });

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ ok: true, result: {} }))
      );

      const res = await app.fetch(
        new Request('https://cf-mail2tg-aibot.yoursubdomain.workers.dev/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query: {
              id: 'cb_test_sum_cache',
              from: { id: 987654321, language_code: 'zh-CN' },
              data: `ai:sum:${replyId}`,
            },
          }),
        }),
        {
          MAIL_ROUTES_KV: mockKv,
          TELEGRAM_BOT_TOKEN: 'mock_bot_token',
          TELEGRAM_ADMIN_CHAT_ID: '987654321',
        } as any
      );

      expect(res.status).toBe(200);
      const calls = fetchSpy.mock.calls.map((c) => JSON.parse(c[1]?.body as string || '{}'));
      const sumMsgCall = calls.find((c) => c.text?.includes('AI 智能速读总结'));
      expect(sumMsgCall).toBeDefined();
      expect(sumMsgCall.text).toContain('今日已成功部署 v2.0 版本');
      expect(sumMsgCall.text).toContain('AI速读 (缓存)');
    });
  });

  describe('formatTelegramSafeHtml security & formatting', () => {
    it('should preserve allowed Telegram HTML tags while escaping dangerous characters', () => {
      const input = '📌 <b>核心主旨:</b> 价格 < $100 且 质量 & 速度 > 预期';
      const output = formatTelegramSafeHtml(input);
      expect(output).toContain('<b>核心主旨:</b>');
      expect(output).toContain('&lt; $100');
      expect(output).toContain('&amp; 速度 &gt;');
      expect(output).not.toContain('< $100');
    });

    it('should convert markdown **bold** and inline code to HTML tags', () => {
      const input = '**关键行动**: 请在明天前访问 `https://example.com` 完成配置';
      const output = formatTelegramSafeHtml(input);
      expect(output).toContain('<b>关键行动</b>: 请在明天前访问 <code>https://example.com</code> 完成配置');
    });

    it('should escape rogue/unknown HTML tags to prevent Telegram 400 Bad Request', () => {
      const input = '包含未知标签 <custom-tag>测试</custom-tag> 和 <script>alert(1)</script>';
      const output = formatTelegramSafeHtml(input);
      expect(output).toContain('&lt;custom-tag&gt;测试&lt;/custom-tag&gt;');
      expect(output).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    });

    it('should truncate oversized text to avoid Telegram 4096 character limits', () => {
      const hugeInput = 'A'.repeat(5000);
      const output = formatTelegramSafeHtml(hugeInput, 500);
      expect(output.length).toBeLessThan(600);
      expect(output).toContain('...(内容过长已折叠)');
    });
  });

  describe('renderFullEmailWebPage Advanced Security Hardening', () => {
    it('should neutralize unquoted on* handlers, meta redirects, javascript: URIs and iframes', () => {
      const maliciousHtml = [
        '<meta http-equiv="refresh" content="0;url=https://evil.com">',
        '<base href="https://evil.com">',
        '<img src=x onerror=alert(1)>',
        '<div onmouseover=steal()>Hover me</div>',
        '<iframe src="https://evil.com/phishing"></iframe>',
        '<object data="exploit.swf"></object>',
        '<embed src="exploit.swf">',
        '<a href="javascript:alert(document.cookie)">Click me</a>',
      ].join('\n');

      const rendered = renderFullEmailWebPage({
        subject: 'Malicious Email Simulation',
        from: 'attacker@evil.com',
        to: 'service@example.com',
        createdAt: Date.now(),
        bodyHtml: maliciousHtml,
      });

      expect(rendered).not.toContain('http-equiv');
      expect(rendered).not.toContain('https://evil.com');
      expect(rendered).not.toContain('<base');
      expect(rendered).not.toContain('onerror=alert(1)');
      expect(rendered).not.toContain('onmouseover=steal()');
      expect(rendered).not.toContain('<iframe');
      expect(rendered).not.toContain('<object');
      expect(rendered).not.toContain('<embed');
      expect(rendered).not.toContain('javascript:alert');
    });
  });

  describe('HTTP GET /view/:replyId Security Headers', () => {
    it('should return strict Content-Security-Policy and protective headers', async () => {
      const replyId = await saveEmailReplyMeta(mockKv, {
        from: 'partner@corp.com',
        to: 'support@example.com',
        subject: 'Security Header Verification',
        bodyText: 'Email body text',
      });

      const res = await app.fetch(
        new Request(`https://cf-mail2tg-aibot.yoursubdomain.workers.dev/view/${replyId}`),
        {
          MAIL_ROUTES_KV: mockKv,
          TELEGRAM_BOT_TOKEN: '123456:ABC',
          TELEGRAM_ADMIN_CHAT_ID: '987654321',
        } as any
      );

      expect(res.status).toBe(200);
      const csp = res.headers.get('Content-Security-Policy');
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src 'none'");
      expect(csp).toContain("style-src 'unsafe-inline'");
      expect(csp).toContain("img-src https: data: cid:");

      expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(res.headers.get('X-Frame-Options')).toBe('DENY');
      expect(res.headers.get('Referrer-Policy')).toBe('no-referrer');
    });
  });

  describe('Cryptographic Entropy of Reply ID', () => {
    it('should generate high-entropy 64-bit random replyIds immune to enumeration', async () => {
      const id1 = await saveEmailReplyMeta(mockKv, {
        from: 'a@test.com',
        to: 'b@example.com',
        subject: 'S1',
      });
      const id2 = await saveEmailReplyMeta(mockKv, {
        from: 'a@test.com',
        to: 'b@example.com',
        subject: 'S2',
      });

      expect(id1).not.toBe(id2);
      expect(id1.startsWith('r_')).toBe(true);
      // Format: r_<timestamp36>_<16 hex chars>
      const parts = id1.split('_');
      expect(parts.length).toBe(3);
      expect(parts[2].length).toBe(16);
    });
  });

  describe('Hardened Whitelist Domain Matching', () => {
    it('should match valid domain patterns but not match accidental single-word wildcards', () => {
      const whitelist = ['@company.com', 'partner.org', 'exact@other.com'];

      expect(isSenderWhitelisted('alice@company.com', whitelist)).toBe(true);
      expect(isSenderWhitelisted('bob@partner.org', whitelist)).toBe(true);
      expect(isSenderWhitelisted('exact@other.com', whitelist)).toBe(true);

      // Single word that is not a domain should not match random domains
      const flawedWhitelist = ['com', 'org'];
      expect(isSenderWhitelisted('stranger@evil.com', flawedWhitelist)).toBe(false);
      expect(isSenderWhitelisted('attacker@phishing.org', flawedWhitelist)).toBe(false);
    });
  });
});
