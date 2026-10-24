import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker, {
  decodeQuotedPrintable,
  cleanHtmlToText,
  extractTextSnippet,
  extractCleanEmail,
  escapeHtml,
  defaultEmailRateLimiter,
  EmailRateLimiter,
  extractDomain,
  formatBytes,
  resolveRoute,
  checkAttachmentPolicy,
  detectMarketingEmail,
  DEFAULT_MARKETING_KEYWORDS,
} from '../src/index';

describe('EmailForwarder - 邮件清洗与编码鲁棒性测试', () => {
  it('应正确解码 UTF-8 Quoted-Printable 编码的中文邮件正文', () => {
    const rawMime = [
      'From: test@example.com',
      'Subject: Test',
      '',
      '=E4=BD=A0=E5=A5=BD=EF=BC=8C=E4=B8=96=E7=95=8C=EF=BC=81',
    ].join('\r\n');

    const snippet = extractTextSnippet(rawMime);
    expect(snippet).toBe('你好，世界！');
  });

  it('应成功过滤 HTML 标签与多余空格', () => {
    const rawMime = [
      'From: test@example.com',
      '',
      '<div><p>这是一封<b>重要</b>的 HTML 邮件。</p><style>body { color: red; }</style></div>',
    ].join('\r\n');

    const snippet = extractTextSnippet(rawMime);
    expect(snippet).toBe('这是一封重要的 HTML 邮件。');
  });

  it('针对 Outlook/MIME 多部分邮件 (含 boundary 与子头部)，应彻底清洗只保留纯净正文', () => {
    const rawMime = [
      'From: user@outlook.com',
      'To: admin@example.com',
      'Subject: test0101',
      'Content-Type: multipart/alternative; boundary="_000_MN0PR84MB39645011AEDA2C9D7032174EB0882MN0PR84MB3964NAMP_"',
      '',
      '--_000_MN0PR84MB39645011AEDA2C9D7032174EB0882MN0PR84MB3964NAMP_',
      'Content-Type: text/plain; charset="iso-8859-1"',
      'Content-Transfer-Encoding: quoted-printable',
      '',
      'test0101',
      '',
      '--_000_MN0PR84MB39645011AEDA2C9D7032174EB0882MN0PR84MB3964NAMP_',
      'Content-Type: text/html; charset="iso-8859-1"',
      'Content-Transfer-Encoding: quoted-printable',
      '',
      '<html><body>test0101</body></html>',
      '--_000_MN0PR84MB39645011AEDA2C9D7032174EB0882MN0PR84MB3964NAMP_--',
    ].join('\r\n');

    const snippet = extractTextSnippet(rawMime);
    expect(snippet).toBe('test0101');
    expect(snippet).not.toContain('MN0PR84MB3964');
    expect(snippet).not.toContain('Content-Type');
    expect(snippet).not.toContain('quoted-printable');
  });

  it('对于不完整的畸形字节序列应具备容错性而不抛出崩溃异常', () => {
    const malformed = 'From: a@b.com\r\n\r\n=E4=BD(残缺字节)';
    expect(() => extractTextSnippet(malformed)).not.toThrow();
  });

  it('应正确提取纯净发信人邮箱与收信域名', () => {
    expect(extractCleanEmail('Support Team <admin@example.com>')).toBe('admin@example.com');
    expect(extractCleanEmail('simple@example.com')).toBe('simple@example.com');
    expect(extractCleanEmail('')).toBe('');

    expect(extractDomain('admin@example.com')).toBe('example.com');
    expect(extractDomain('Sub Site <support@my-other-site.com>')).toBe('my-other-site.com');
    expect(extractDomain('')).toBe('unknown');
  });

  it('formatBytes 应正确格式化字节', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024 * 2.5)).toBe('2.5 MB');
  });

  it('应正确转义 Telegram 特殊字符', () => {
    expect(escapeHtml('<script>alert("xss & \'test\'")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss &amp; &#39;test&#39;&quot;)&lt;/script&gt;'
    );
  });

  it('cleanHtmlToText 应正确将 HTML 转换为自然纯文本', () => {
    const html = '<div><p>你好</p><br><p>世界 &amp; 伙伴们</p></div>';
    expect(cleanHtmlToText(html)).toBe('你好\n\n世界 & 伙伴们');
  });

  it('双轨制保底机制: 应无条件优先调用 message.forward("backup@example.com") 确保零丢信', async () => {
    defaultEmailRateLimiter.reset();

    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const mockMessage = {
      from: 'sender@example.com',
      to: 'inbox@site1.com',
      forward: forwardMock,
      headers: {
        get: (k: string) => (k === 'subject' ? '重要的业务合作' : null),
      },
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('合作意向内容'));
          c.close();
        },
      }),
    };

    const env = {
      TELEGRAM_BOT_TOKEN: '123456:mock_token',
      TELEGRAM_ADMIN_CHAT_ID: '987654321',
      FORWARD_TO_EMAIL: 'backup@example.com',
    };

    await worker.email(mockMessage, env, null);

    expect(forwardMock).toHaveBeenCalledTimes(1);
    expect(forwardMock).toHaveBeenCalledWith('backup@example.com');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('site1.com');
    expect(body.text).toContain('已同步投递至备份邮箱');
    expect(body.text).toContain('━━━━━━━━━━━━━━━━━━\n📌 <b>主　　题:</b>');

    vi.unstubAllGlobals();
  });

  it('产品标签与智能分流: support 来信应带有商业支持标签与别名', async () => {
    defaultEmailRateLimiter.reset();

    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const mockMessage = {
      from: 'client@company.com',
      to: 'support@example.com',
      forward: forwardMock,
      headers: {
        get: (k: string) => (k === 'subject' ? '企业级咨询采购' : null),
      },
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('咨询付费方案'));
          c.close();
        },
      }),
    };

    const env = {
      TELEGRAM_BOT_TOKEN: '123456:mock_token',
      TELEGRAM_ADMIN_CHAT_ID: '987654321',
      FORWARD_TO_EMAIL: 'backup@example.com',
    };

    await worker.email(mockMessage, env, null);

    expect(forwardMock).toHaveBeenCalledTimes(1);
    expect(forwardMock).toHaveBeenCalledWith('backup+support@example.com');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('【新邮件 · 业务 · support】');
    expect(body.text).toContain('业务类型:</b> <code>客服</code>');
    expect(body.text).toContain('已同步投递至备份邮箱');

    vi.unstubAllGlobals();
  });

  it('容灾回退: 若别名转发因 Cloudflare 规则抛错，自动降级保底直转基础邮箱', async () => {
    defaultEmailRateLimiter.reset();

    const forwardMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Unknown destination address: backup+personal@example.com'))
      .mockResolvedValueOnce(undefined);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const mockMessage = {
      from: 'friend@blog.com',
      to: 'admin@example.com',
      forward: forwardMock,
      headers: {
        get: (k: string) => (k === 'subject' ? '博客读后感' : null),
      },
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('写的真好！'));
          c.close();
        },
      }),
    };

    const env = {
      TELEGRAM_BOT_TOKEN: '123456:mock_token',
      TELEGRAM_ADMIN_CHAT_ID: '987654321',
      FORWARD_TO_EMAIL: 'backup@example.com',
    };

    await worker.email(mockMessage, env, null);

    expect(forwardMock).toHaveBeenCalledTimes(2);
    expect(forwardMock).toHaveBeenNthCalledWith(1, 'backup+personal@example.com');
    expect(forwardMock).toHaveBeenNthCalledWith(2, 'backup@example.com');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('已同步投递至备份邮箱 (backup@example.com)');

    vi.unstubAllGlobals();
  });

  it('完全等价模式: 若未开启别名转发 (ENABLE_GMAIL_ALIASES=false)，直接直转基础邮箱且 TG 依然附带产品画像标签', async () => {
    defaultEmailRateLimiter.reset();

    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const mockMessage = {
      from: 'reader@example.com',
      to: 'admin@example.com',
      forward: forwardMock,
      headers: {
        get: (k: string) => (k === 'subject' ? '原样直转测试' : null),
      },
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('正文内容'));
          c.close();
        },
      }),
    };

    const env = {
      TELEGRAM_BOT_TOKEN: '123456:mock_token',
      TELEGRAM_ADMIN_CHAT_ID: '987654321',
      FORWARD_TO_EMAIL: 'backup@example.com',
      ENABLE_GMAIL_ALIASES: 'false',
    };

    await worker.email(mockMessage, env, null);

    expect(forwardMock).toHaveBeenCalledTimes(1);
    expect(forwardMock).toHaveBeenCalledWith('backup@example.com');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('【新邮件 · 业务 · admin】');
    expect(body.text).toContain('业务类型:</b> <code>个人</code>');
    expect(body.text).toContain('已同步投递至备份邮箱 (backup@example.com)');

    vi.unstubAllGlobals();
  });
});

describe('EmailRateLimiter - 多站点隔离与智能防轰炸频控测试', () => {
  it('超限降级测试: 超频邮件依然执行投递，TG 仅发送首封告警卡片并静默后续', async () => {
    defaultEmailRateLimiter.reset();

    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const createMessage = (from: string, isAuth = true) => ({
      from,
      to: 'admin@example.com',
      forward: forwardMock,
      headers: {
        get: (k: string) => {
          if (k === 'subject') return '验证码';
          if (k === 'authentication-results') return isAuth ? 'spf=pass dkim=pass' : '';
          return null;
        },
      },
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('验证码 123456'));
          c.close();
        },
      }),
    });

    const env = {
      TELEGRAM_BOT_TOKEN: 'token',
      TELEGRAM_ADMIN_CHAT_ID: 'chat_id',
      FORWARD_TO_EMAIL: 'backup@example.com',
    };

    await worker.email(createMessage('service@verify.com'), env, null);
    await worker.email(createMessage('service@verify.com'), env, null);
    await worker.email(createMessage('service@verify.com'), env, null);

    expect(forwardMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    await worker.email(createMessage('service@verify.com'), env, null);
    expect(forwardMock).toHaveBeenCalledTimes(4);
    expect(fetchMock).toHaveBeenCalledTimes(4);

    const lastCallBody = JSON.parse(fetchMock.mock.calls[3][1].body);
    expect(lastCallBody.text).toContain('频控限流预警');
    expect(lastCallBody.text).toContain('backup@example.com');

    await worker.email(createMessage('service@verify.com'), env, null);
    expect(forwardMock).toHaveBeenCalledTimes(5);
    expect(fetchMock).toHaveBeenCalledTimes(4);

    vi.unstubAllGlobals();
  });
});

describe('Attachment Armor & Quota Hardening - 附件防御与额度保护测试', () => {
  it('checkAttachmentPolicy 单元测试: 全量附件禁用模式 (blockAll=true) 严格拦截所有带附件邮件', () => {
    const res = checkAttachmentPolicy([{ filename: 'contract.pdf' }], { blockAll: true });
    expect(res.allowed).toBe(false);
    expect(res.smtpRejectCode).toBe(550);
    expect(res.reason).toContain('全量附件防御策略');
  });

  it('checkAttachmentPolicy 单元测试: 允许模式下恶意后缀 (.exe, .zip) 被精准拦截', () => {
    const exeRes = checkAttachmentPolicy([{ filename: 'trojan.exe' }], { blockAll: false });
    expect(exeRes.allowed).toBe(false);
    expect(exeRes.reason).toContain('.exe');

    const zipRes = checkAttachmentPolicy([{ filename: 'payload.zip' }], { blockAll: false });
    expect(zipRes.allowed).toBe(false);
    expect(zipRes.reason).toContain('.zip');
  });

  it('checkAttachmentPolicy 单元测试: 允许模式下合法 PDF / 图片附件正常放行', () => {
    const res = checkAttachmentPolicy(
      [{ filename: 'invoice.pdf' }, { filename: 'screenshot.png' }],
      { blockAll: false }
    );
    expect(res.allowed).toBe(true);
    expect(res.detectedAttachments).toHaveLength(2);
  });

  it('HTTP 防御: 直接访问 Worker 的 fetch 接口应返回 403 Forbidden 保护 100k 配额', async () => {
    const req = new Request('https://cf-mail2tg-aibot.workers.dev/wp-login.php');
    const res = await worker.fetch(req);
    expect(res.status).toBe(403);
    const text = await res.text();
    expect(text).toContain('403 Forbidden');
  });

  it('体积熔断: 邮件 rawSize 超过 MAX_EMAIL_SIZE_BYTES 时执行 setReject 拒信且不转入备份邮箱', async () => {
    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const rejectMock = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const oversizedMessage = {
      from: 'spammer@heavy.com',
      to: 'admin@example.com',
      forward: forwardMock,
      setReject: rejectMock,
      rawSize: 10 * 1024 * 1024,
      headers: {
        get: () => null,
      },
    };

    const env = {
      TELEGRAM_BOT_TOKEN: 'token',
      TELEGRAM_ADMIN_CHAT_ID: 'chat_id',
      FORWARD_TO_EMAIL: 'backup@example.com',
      MAX_EMAIL_SIZE_BYTES: 5 * 1024 * 1024,
    };

    await worker.email(oversizedMessage, env, null);

    expect(rejectMock).toHaveBeenCalledTimes(1);
    expect(rejectMock.mock.calls[0][0]).toContain('552 Message size exceeds');

    expect(forwardMock).not.toHaveBeenCalled();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('超大容量熔断拦截');

    vi.unstubAllGlobals();
  });

  it('全量附件拦截: BLOCK_ALL_ATTACHMENTS=true 时调用 setReject 拒信且不转发备份邮箱', async () => {
    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const rejectMock = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const rawMime = [
      'From: client@test.com',
      'To: admin@example.com',
      'Subject: Attached document',
      'Content-Type: multipart/mixed; boundary="BOUNDARY"',
      '',
      '--BOUNDARY',
      'Content-Type: text/plain',
      '',
      'Please check the attached file.',
      '--BOUNDARY',
      'Content-Type: application/pdf; name="document.pdf"',
      'Content-Disposition: attachment; filename="document.pdf"',
      'Content-Transfer-Encoding: base64',
      '',
      'JVBERi0xLjQKJeLjz9MK...',
      '--BOUNDARY--',
    ].join('\r\n');

    const mockMessage = {
      from: 'client@test.com',
      to: 'admin@example.com',
      forward: forwardMock,
      setReject: rejectMock,
      rawSize: rawMime.length,
      headers: {
        get: (k: string) => (k === 'subject' ? 'Attached document' : null),
      },
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode(rawMime));
          c.close();
        },
      }),
    };

    const env = {
      TELEGRAM_BOT_TOKEN: 'token',
      TELEGRAM_ADMIN_CHAT_ID: 'chat_id',
      FORWARD_TO_EMAIL: 'backup@example.com',
      BLOCK_ALL_ATTACHMENTS: 'true',
    };

    await worker.email(mockMessage, env, null);

    expect(rejectMock).toHaveBeenCalledTimes(1);
    expect(rejectMock.mock.calls[0][0]).toContain('全量附件防御策略');

    expect(forwardMock).not.toHaveBeenCalled();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('附件安全策略拦截');
    expect(body.text).toContain('document.pdf');

    vi.unstubAllGlobals();
  });
});

describe('Anti-Marketing & Long Email - 营销过滤与长邮件体验增强测试', () => {
  it('detectMarketingEmail 应正确识别带有 RFC 8058/2369 List-Unsubscribe 头部的营销邮件', () => {
    const headers = new Map<string, string>();
    headers.set('list-unsubscribe', '<https://example.com/unsub>');

    const result = detectMarketingEmail(headers, '本周精彩推荐', '点击查看');
    expect(result.isMarketing).toBe(true);
    expect(result.reason).toContain('List-Unsubscribe');
  });

  it('detectMarketingEmail 应正确根据 Precedence: bulk 识别广播邮件', () => {
    const headers = new Map<string, string>();
    headers.set('precedence', 'bulk');

    const result = detectMarketingEmail(headers, '系统更新通知', '正文');
    expect(result.isMarketing).toBe(true);
    expect(result.reason).toContain('Precedence: bulk');
  });

  it('detectMarketingEmail 应根据主题或正文中的营销关键字精准识别', () => {
    const headers = new Map<string, string>();

    const res1 = detectMarketingEmail(headers, 'Your account received a coupon', 'Please check your balance');
    expect(res1.isMarketing).toBe(true);
    expect(res1.matchedKeyword).toBe('coupon');

    const res2 = detectMarketingEmail(headers, 'Monthly Newsletter', 'Click here to unsubscribe');
    expect(res2.isMarketing).toBe(true);
    expect(res2.matchedKeyword).toBe('unsubscribe');

    const res3 = detectMarketingEmail(headers, '技术架构评审会议通知', '请查阅附录中的架构图并在下周一准时参会');
    expect(res3.isMarketing).toBe(false);

    // 验证传入本地化多语言词库时的命中逻辑
    const zhKeywords = ['优惠券', '退订'];
    const resZh = detectMarketingEmail(headers, '您的账户已获得 50 元优惠券', '请在有效期内使用', zhKeywords);
    expect(resZh.isMarketing).toBe(true);
    expect(resZh.matchedKeyword).toBe('优惠券');
  });

  it('营销邮件应自动分流至备份邮箱营销别名且 TG 卡片静默推送 (disable_notification=true)', async () => {
    defaultEmailRateLimiter.reset();

    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const mockMessage = {
      from: 'promotions@saasplatform.com',
      to: 'admin@example.com',
      rawSize: 1024,
      forward: forwardMock,
      headers: new Map([
        ['subject', '🔥 黑五限时特惠，全场 5 折立即抢购'],
        ['list-unsubscribe', '<https://saasplatform.com/unsub>'],
      ]),
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('尊敬的用户，黑五专属优惠券已到账，点击退订可取消推送。'));
          c.close();
        },
      }),
    };

    const env = {
      TELEGRAM_BOT_TOKEN: '123456:mock_token',
      TELEGRAM_ADMIN_CHAT_ID: '987654321',
      FORWARD_TO_EMAIL: 'backup@example.com',
      ENABLE_GMAIL_ALIASES: 'true',
    };

    await worker.email(mockMessage, env, null);

    expect(forwardMock).toHaveBeenCalledWith('backup+marketing@example.com');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);

    expect(body.text).toContain('📢 <b>【新邮件 · 营销 · admin】</b>');
    expect(body.text).toContain('业务类型:</b> <code>个人</code>');
    expect(body.text).toContain('<blockquote expandable>');
    expect(body.disable_notification).toBe(true);

    vi.unstubAllGlobals();
  });

  it('长邮件体验: 超长邮件应放宽截断限制并使用 <blockquote expandable> 原位折叠包裹', async () => {
    defaultEmailRateLimiter.reset();

    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const longText = '这是一段关于技术架构深度设计方案的真实业务邮件正文。'.repeat(80);

    const mockMessage = {
      from: 'colleague@partner.com',
      to: 'admin@example.com',
      rawSize: 5000,
      forward: forwardMock,
      headers: new Map([['subject', '系统设计报告全文']]),
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode(longText));
          c.close();
        },
      }),
    };

    const env = {
      TELEGRAM_BOT_TOKEN: '123456:mock_token',
      TELEGRAM_ADMIN_CHAT_ID: '987654321',
      FORWARD_TO_EMAIL: 'backup@example.com',
      MAX_SNIPPET_LENGTH: 1200,
    };

    await worker.email(mockMessage, env, null);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);

    expect(body.text).toContain('<blockquote expandable>');
    expect(body.text).toContain('已折叠展示前 1200 字');

    vi.unstubAllGlobals();
  });
});
