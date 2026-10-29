import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker, {
  getAvailableSenderList,
  getComposeSenderKeyboard,
  getComposeConfirmKeyboard,
  getComposeCancelKeyboard,
  renderComposeSenderPromptCard,
  renderComposeCustomPrefixPromptCard,
  renderComposeToPromptCard,
  renderComposeSubjectPromptCard,
  renderComposeBodyPromptCard,
  renderComposeConfirmCard,
  renderComposeSuccessCard,
  renderComposeErrorCard,
  renderComposeNoApiKeyCard,
  getInteractiveSession,
  addCustomRule,
  getDynamicConfig,
  getTranslation,
} from '../src/index';

class MockKV {
  private map = new Map<string, string>();
  async get(k: string) {
    return this.map.get(k) || null;
  }
  async put(k: string, v: string) {
    this.map.set(k, v);
  }
  async delete(k: string) {
    this.map.delete(k);
  }
  async list(opts?: { prefix?: string }) {
    const keys: { name: string }[] = [];
    for (const k of this.map.keys()) {
      if (!opts?.prefix || k.startsWith(opts.prefix)) {
        keys.push({ name: k });
      }
    }
    return { keys };
  }
  clear() {
    this.map.clear();
  }
}

describe('Active Email Compose & Wizard - 主动发信与路由交互系统测试', () => {
  let mockKv: MockKV;
  let env: any;
  let fetchMock: any;

  beforeEach(() => {
    mockKv = new MockKV();
    env = {
      TELEGRAM_BOT_TOKEN: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
      TELEGRAM_ADMIN_CHAT_ID: '987654321',
      MAIL_ROUTES_KV: mockKv,
      RESEND_API_KEY: 're_test_dummy_key_123',
      EMAIL_DOMAIN: 'example.com',
      DEFAULT_LANGUAGE: 'zh-CN',
    };

    fetchMock = vi.fn().mockImplementation(async (url: string, init?: any) => {
      if (url.includes('api.resend.com/emails')) {
        return new Response(
          JSON.stringify({ id: 'resend_msg_compose_999' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(JSON.stringify({ ok: true, result: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  describe('1. 路由列表与首位核心身份排序测试 (getAvailableSenderList)', () => {
    it('service@example.com 与 support@example.com 必须始终置顶为核心身份', async () => {
      const senders = await getAvailableSenderList(mockKv, 'example.com');
      expect(senders.length).toBeGreaterThanOrEqual(2);
      expect(senders[0]).toBe('service@example.com');
      expect(senders[1]).toBe('support@example.com');
      expect(senders).toContain('support@example.com');
      expect(senders).toContain('sales@example.com');
      expect(senders).toContain('admin@example.com');
    });

    it('自定义 KV 路由应与核心身份聚合去重并支持自定义域名', async () => {
      await addCustomRule(mockKv, {
        prefix: 'custom-dev',
        tag: '产品',
        forwardEmail: 'dev@custom.com',
      });

      const senders = await getAvailableSenderList(mockKv, 'mycustom.com');
      expect(senders[0]).toBe('service@mycustom.com');
      expect(senders[1]).toBe('support@mycustom.com');
      expect(senders).toContain('custom-dev@mycustom.com');
      // No duplicate service
      const count = senders.filter((s) => s.startsWith('service@')).length;
      expect(count).toBe(1);
    });
  });

  describe('2. UI 渲染与内联键盘安全规格测试', () => {
    const dict = getTranslation('zh-CN');

    it('发件身份键盘第一行必须突出呈现 service 与 support，且每个 callback_data <= 64 字节', () => {
      const senders = [
        'service@example.com',
        'support@example.com',
        'support@example.com',
        'sales@example.com',
        'admin@example.com',
      ];
      const keyboard = getComposeSenderKeyboard(senders, dict);
      expect(keyboard.length).toBeGreaterThanOrEqual(3);

      // Row 1: Core identities
      expect(keyboard[0].length).toBe(2);
      expect(keyboard[0][0].text).toContain('service@example.com');
      expect(keyboard[0][0].callback_data).toBe('comp:from:service@example.com');
      expect(keyboard[0][1].text).toContain('support@example.com');
      expect(keyboard[0][1].callback_data).toBe('comp:from:support@example.com');

      // Check all callback_data length <= 64
      for (const row of keyboard) {
        for (const btn of row) {
          expect(btn.callback_data.length).toBeLessThanOrEqual(64);
        }
      }

      // Last row must contain custom prefix & cancel
      const lastRow = keyboard[keyboard.length - 1];
      expect(lastRow[0].callback_data).toBe('comp:custom');
      expect(lastRow[1].callback_data).toBe('m:cancel');
    });

    it('二次核验键盘必须包含立即发送与放弃取消按键', () => {
      const keyboard = getComposeConfirmKeyboard(dict);
      expect(keyboard.length).toBe(1);
      expect(keyboard[0][0].callback_data).toBe('comp:send');
      expect(keyboard[0][1].callback_data).toBe('m:cancel');
    });

    it('所有卡片渲染输出应完整包含关键参数并遵循 HTML 转义', () => {
      const promptCard = renderComposeSenderPromptCard(dict);
      expect(promptCard).toContain('发信身份');
      // generic prompt verified

      const customCard = renderComposeCustomPrefixPromptCard({ dict, domain: 'example.com' });
      expect(customCard).toContain('@example.com');

      const toCard = renderComposeToPromptCard({ dict, fromAddress: 'service@example.com' });
      expect(toCard).toContain('service@example.com');

      const subCard = renderComposeSubjectPromptCard({
        dict,
        fromAddress: 'service@example.com',
        toAddress: 'alice@example.com',
      });
      expect(subCard).toContain('service@example.com');
      expect(subCard).toContain('alice@example.com');

      const bodyCard = renderComposeBodyPromptCard({
        dict,
        fromAddress: 'service@example.com',
        toAddress: 'alice@example.com',
        subject: '<script>alert(1)</script>',
      });
      expect(bodyCard).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');

      const confirmCard = renderComposeConfirmCard({
        dict,
        fromAddress: 'service@example.com',
        toAddress: 'alice@example.com',
        subject: 'Invoice 2026',
        body: 'Please check attached invoice.',
      });
      expect(confirmCard).toContain('Invoice 2026');
      expect(confirmCard).toContain('Please check attached invoice.');

      const successCard = renderComposeSuccessCard({
        dict,
        fromAddress: 'service@example.com',
        toAddress: 'alice@example.com',
        subject: 'Invoice 2026',
        body: 'Please check attached invoice.',
        messageId: 're_cert_8888',
      });
      expect(successCard).toContain('re_cert_8888');
      expect(successCard).toContain('已成功投递');

      const errorCard = renderComposeErrorCard({
        dict,
        fromAddress: 'service@example.com',
        toAddress: 'alice@example.com',
        subject: 'Invoice 2026',
        error: 'Domain not verified',
      });
      expect(errorCard).toContain('Domain not verified');

      const noKeyCard = renderComposeNoApiKeyCard({ dict });
      expect(noKeyCard).toContain('RESEND_API_KEY');
    });
  });

  describe('3. 完整多步向导 Webhook 全链路测试 (From ➔ To ➔ Subject ➔ Body ➔ Confirm ➔ Dispatched)', () => {
    it('当缺少 Resend Key 时，触发 /send 应阻断并返回绑定引导卡片', async () => {
      const emptyEnv = { ...env, RESEND_API_KEY: undefined };
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321, language_code: 'zh-CN' },
            text: '/send',
          },
        }),
      });

      const res = await worker.fetch(req, emptyEnv);
      expect(res.status).toBe(200);

      const msgCall = fetchMock.mock.calls.find((c: any) => c[0].endsWith('/sendMessage'));
      expect(msgCall).toBeDefined();
      const body = JSON.parse(msgCall[1].body);
      expect(body.text).toContain('未配置 Resend 发信服务密钥');
      expect(body.reply_markup.inline_keyboard[0][0].callback_data).toBe('resend:setkey');
    });

    it('完整体验流程: /send ➔ 选择 service ➔ 输入收件人 ➔ 输入主题 ➔ 输入正文 ➔ 点击立即发送', async () => {
      // Step 0: User types /send
      const step0Req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321, language_code: 'zh-CN' },
            text: '/send',
          },
        }),
      });
      await worker.fetch(step0Req, env);

      const step0Msg = fetchMock.mock.calls.find((c: any) => c[0].endsWith('/sendMessage'));
      const step0Body = JSON.parse(step0Msg[1].body);
      expect(step0Body.text).toContain('请选择发信路由身份');
      expect(step0Body.reply_markup.inline_keyboard[0][0].text).toContain('service@example.com');
      expect(step0Body.reply_markup.inline_keyboard[0][1].text).toContain('support@example.com');

      // Step 1: User selects service@example.com
      fetchMock.mockClear();
      const step1Req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_comp_from_1',
            from: { id: 987654321, language_code: 'zh-CN' },
            data: 'comp:from:service@example.com',
            message: { message_id: 101 },
          },
        }),
      });
      await worker.fetch(step1Req, env);

      // Session must be in input_to step
      let session = await getInteractiveSession(mockKv);
      expect(session).toBeDefined();
      expect(session?.type).toBe('compose_email');
      expect(session?.composeStep).toBe('input_to');
      expect(session?.composeFrom).toBe('service@example.com');

      // Step 2 (Validation): User inputs invalid recipient email
      fetchMock.mockClear();
      const invalidEmailReq = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321, language_code: 'zh-CN' },
            text: 'not-an-email',
          },
        }),
      });
      await worker.fetch(invalidEmailReq, env);

      const invalidMsg = fetchMock.mock.calls.find((c: any) => c[0].endsWith('/sendMessage'));
      expect(JSON.parse(invalidMsg[1].body).text).toContain('邮箱地址格式无效');
      // Step remains input_to
      session = await getInteractiveSession(mockKv);
      expect(session?.composeStep).toBe('input_to');

      // Step 2 (Success): User inputs valid recipient email
      fetchMock.mockClear();
      const validEmailReq = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321, language_code: 'zh-CN' },
            text: 'client.partner@acme.corp',
          },
        }),
      });
      await worker.fetch(validEmailReq, env);

      session = await getInteractiveSession(mockKv);
      expect(session?.composeStep).toBe('input_subject');
      expect(session?.composeTo).toBe('client.partner@acme.corp');

      // Step 3: User inputs subject (with CRLF injection attempt)
      fetchMock.mockClear();
      const subjectReq = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321, language_code: 'zh-CN' },
            text: 'Contract Proposal\r\nBcc: hacker@evil.com',
          },
        }),
      });
      await worker.fetch(subjectReq, env);

      session = await getInteractiveSession(mockKv);
      expect(session?.composeStep).toBe('input_body');
      // CRLF stripped by cleanHeaderValue
      expect(session?.composeSubject).not.toContain('\r');
      expect(session?.composeSubject).not.toContain('\n');
      expect(session?.composeSubject).toBe('Contract Proposal Bcc: hacker@evil.com');

      // Step 4: User inputs body (Direct dispatch via Resend & immediate success card)
      fetchMock.mockClear();
      const bodyReq = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321, language_code: 'zh-CN' },
            text: 'Dear partner,\nPlease find the proposal details enclosed.\nBest regards,\nCoconut Rat',
          },
        }),
      });
      await worker.fetch(bodyReq, env);

      // Verify Resend API was called directly upon body entry
      const resendCall = fetchMock.mock.calls.find((c: any) => c[0].includes('api.resend.com/emails'));
      expect(resendCall).toBeDefined();
      const resendPayload = JSON.parse(resendCall[1].body);
      expect(resendPayload.from).toBe('service@example.com');
      expect(resendPayload.to).toEqual(['client.partner@acme.corp']);
      expect(resendPayload.subject).toBe('Contract Proposal Bcc: hacker@evil.com');
      expect(resendPayload.text).toContain('Dear partner');

      // Verify Session was destroyed immediately
      const sessionAfterSend = await getInteractiveSession(mockKv);
      expect(sessionAfterSend).toBeNull();

      // Verify Telegram success message delivered directly in chat
      const successMsg = fetchMock.mock.calls.find((c: any) => c[0].endsWith('/sendMessage'));
      expect(successMsg).toBeDefined();
      const successJson = JSON.parse(successMsg[1].body);
      expect(successJson.text).toContain('邮件已成功投递');
      expect(successJson.text).toContain('resend_msg_compose_999');
    });

    it('分支测试: 自定义前缀发信流程 (comp:custom)', async () => {
      // User clicks comp:custom
      const customReq = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_comp_custom_1',
            from: { id: 987654321, language_code: 'zh-CN' },
            data: 'comp:custom',
            message: { message_id: 110 },
          },
        }),
      });
      await worker.fetch(customReq, env);

      let session = await getInteractiveSession(mockKv);
      expect(session?.type).toBe('compose_custom_prefix');

      // User replies with custom prefix "founder"
      fetchMock.mockClear();
      const prefixInputReq = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321, language_code: 'zh-CN' },
            text: 'founder',
          },
        }),
      });
      await worker.fetch(prefixInputReq, env);

      session = await getInteractiveSession(mockKv);
      expect(session?.type).toBe('compose_email');
      expect(session?.composeStep).toBe('input_to');
      expect(session?.composeFrom).toBe('founder@example.com');
    });

    it('快捷指令测试: /setresend 动态持久化配置发信密钥', async () => {
      const setKeyReq = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321, language_code: 'zh-CN' },
            text: '/setresend re_dynamic_key_abcdef123456',
          },
        }),
      });
      await worker.fetch(setKeyReq, env);

      const savedKey = await getDynamicConfig(mockKv, 'resend_api_key');
      expect(savedKey).toBe('re_dynamic_key_abcdef123456');

      const successMsg = fetchMock.mock.calls.find((c: any) => c[0].endsWith('/sendMessage'));
      expect(JSON.parse(successMsg[1].body).text).toContain('Resend API Key 配置成功');
    });

    it('安全拦截: 非管理员用户触发 /send 应静默忽略不泄露任何信息', async () => {
      const strangerReq = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 9999999 }, // stranger
            text: '/send',
          },
        }),
      });
      const res = await worker.fetch(strangerReq, env);
      expect(res.status).toBe(200);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
