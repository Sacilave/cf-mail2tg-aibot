import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker, {
  classifyEmailWithMiniMax,
  sanitizeErrorMessage,
  defaultEmailRateLimiter,
} from '../src/index';

describe('MiniMax AI - 邮件营销意图分类器单元测试', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('未配置 apiKey 时应安全拦截并返回错误状态', async () => {
    const result = await classifyEmailWithMiniMax({
      apiKey: '',
      subject: '测试主题',
      from: 'test@example.com',
      bodySnippet: '正文',
    });
    expect(result.success).toBe(false);
    expect(result.isMarketing).toBe(false);
    expect(result.error).toContain('未配置 MINIMAX_API_KEY');
  });

  it('模型识别为营销推广时，应正确解析 isMarketing=true 与 reason', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                is_marketing: true,
                reason: 'SaaS商业推销与打折广告',
              }),
            },
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await classifyEmailWithMiniMax({
      apiKey: 'test-minimax-key',
      subject: '关于我们团队的新产品体验邀请',
      from: 'sales@saas.com',
      bodySnippet: '尊敬的开发者，诚邀体验我们最新上线的新产品...',
    });

    expect(result.success).toBe(true);
    expect(result.isMarketing).toBe(true);
    expect(result.reason).toBe('SaaS商业推销与打折广告');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer test-minimax-key');
  });

  it('模型输出包裹在 Markdown 代码块 (```json ... ```) 中时，应具备容错鲁棒性', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: '```json\n{\n  "is_marketing": false,\n  "reason": "工作业务探讨"\n}\n```',
            },
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await classifyEmailWithMiniMax({
      apiKey: 'test-minimax-key',
      subject: '关于下周一的技术方案评审',
      from: 'partner@company.com',
      bodySnippet: '请查阅附件中的架构文档并提出修改意见。',
    });

    expect(result.success).toBe(true);
    expect(result.isMarketing).toBe(false);
    expect(result.reason).toBe('工作业务探讨');
  });

  it('当 MiniMax API 返回 HTTP 500 或 401 鉴权失效时，应返回 failure 与详细错误信息', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Invalid API key provided',
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await classifyEmailWithMiniMax({
      apiKey: 'invalid-key',
      subject: '合作邀请',
      from: 'some@domain.com',
      bodySnippet: '你好',
    });

    expect(result.success).toBe(false);
    expect(result.isMarketing).toBe(false);
    expect(result.error).toContain('HTTP 401');
  });

  it('当请求发生超时或网络异常时，应安全捕获并标记失效原因', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Connection timeout'));
    vi.stubGlobal('fetch', fetchMock);

    const result = await classifyEmailWithMiniMax({
      apiKey: 'test-key',
      subject: '测试',
      from: 'test@domain.com',
      bodySnippet: '测试',
    });

    expect(result.success).toBe(false);
    expect(result.isMarketing).toBe(false);
    expect(result.error).toContain('超时');

    fetchMock.mockRejectedValueOnce(new Error('Connection refused by peer'));
    const netResult = await classifyEmailWithMiniMax({
      apiKey: 'test-key',
      subject: '测试',
      from: 'test@domain.com',
      bodySnippet: '测试',
    });
    expect(netResult.success).toBe(false);
    expect(netResult.error).toContain('Connection refused by peer');
  });
});

describe('MiniMax AI - 端到端邮件转发与静默/响铃策略集成测试', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    defaultEmailRateLimiter.reset();
  });

  it('MiniMax 判定为营销邮件：应静默推送 (disable_notification=true) 且不响铃，并同步至 Gmail 营销别名', async () => {
    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes('minimax')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    is_marketing: true,
                    reason: '冷邮件商业推销',
                  }),
                },
              },
            ],
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const mockMessage = {
      from: 'outreach@saascompany.com',
      to: 'user@example.com',
      rawSize: 1024,
      forward: forwardMock,
      headers: new Map([['subject', 'Hey, quick question regarding your tech stack']]),
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('We noticed your project and would love to introduce our new solution.'));
          c.close();
        },
      }),
    };

    const env = {
      TELEGRAM_BOT_TOKEN: 'token',
      TELEGRAM_ADMIN_CHAT_ID: 'admin',
      FORWARD_TO_EMAIL: 'backup@example.com',
      ENABLE_GMAIL_ALIASES: 'true',
      MINIMAX_API_KEY: 'mock-minimax-key',
    };

    await worker.email(mockMessage, env, null);

    expect(forwardMock).toHaveBeenCalledWith('backup+marketing@example.com');

    const tgCall = fetchMock.mock.calls.find((call) => call[0].includes('telegram'));
    expect(tgCall).toBeDefined();
    const payload = JSON.parse(tgCall![1].body);

    expect(payload.disable_notification).toBe(true);
    expect(payload.text).toContain('📢 <b>【新邮件 · 营销 · user】</b>');
    expect(payload.text).toContain('LLM 判定为营销推广 (静默免打扰)');
  });

  it('MiniMax 判定为非营销邮件：应正常消息响铃提醒 (disable_notification=false)', async () => {
    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes('minimax')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    intent: '业务',
                    code: null,
                    reason: '日常业务交流',
                  }),
                },
              },
            ],
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const mockMessage = {
      from: 'friend@company.com',
      to: 'admin@example.com',
      rawSize: 1024,
      forward: forwardMock,
      headers: new Map([['subject', '下周聚会时间确认']]),
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('周末老地方见，记得带上相机！'));
          c.close();
        },
      }),
    };

    const env = {
      TELEGRAM_BOT_TOKEN: 'token',
      TELEGRAM_ADMIN_CHAT_ID: 'admin',
      FORWARD_TO_EMAIL: 'backup@example.com',
      ENABLE_GMAIL_ALIASES: 'true',
      MINIMAX_API_KEY: 'mock-minimax-key',
    };

    await worker.email(mockMessage, env, null);

    expect(forwardMock).toHaveBeenCalledWith('backup+personal@example.com');

    const tgCall = fetchMock.mock.calls.find((call) => call[0].includes('telegram'));
    expect(tgCall).toBeDefined();
    const payload = JSON.parse(tgCall![1].body);

    expect(payload.disable_notification).toBeUndefined();
    expect(payload.text).toContain('💬 <b>【新邮件 · 业务 · admin】</b>');
    expect(payload.text).toContain('LLM 判定为重要信件 (响铃提醒)');
  });

  it('MiniMax API 失效/网络报错：应在卡片上明确标注失效原因，但“先消息提醒” (响铃提醒)', async () => {
    const forwardMock = vi.fn().mockResolvedValue(undefined);
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes('minimax')) {
        return Promise.resolve({
          ok: false,
          status: 500,
          text: async () => 'Internal Server Error in MiniMax Cluster',
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const mockMessage = {
      from: 'vip@client.com',
      to: 'support@example.com',
      rawSize: 1024,
      forward: forwardMock,
      headers: new Map([['subject', '紧急生产环境合作咨询']]),
      raw: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('我们系统遇到了重大阻碍，急需技术支持！'));
          c.close();
        },
      }),
    };

    const env = {
      TELEGRAM_BOT_TOKEN: 'token',
      TELEGRAM_ADMIN_CHAT_ID: 'admin',
      FORWARD_TO_EMAIL: 'backup@example.com',
      ENABLE_GMAIL_ALIASES: 'true',
      MINIMAX_API_KEY: 'mock-minimax-key',
    };

    await worker.email(mockMessage, env, null);

    expect(forwardMock).toHaveBeenCalledWith('backup+support@example.com');

    const tgCall = fetchMock.mock.calls.find((call) => call[0].includes('telegram'));
    expect(tgCall).toBeDefined();
    const payload = JSON.parse(tgCall![1].body);

    expect(payload.disable_notification).toBeUndefined();
    expect(payload.text).toContain('⚠️ LLM API失效: HTTP 500');
    expect(payload.text).toContain('已保底响铃');
  });

  it('验证敏感凭证脱敏函数 sanitizeErrorMessage', () => {
    const rawError = 'Request failed with Bearer 123456789abcdef and api_key="secret123"';
    const cleaned = sanitizeErrorMessage(rawError, 'secret123');
    expect(cleaned).not.toContain('123456789abcdef');
    expect(cleaned).not.toContain('secret123');
    expect(cleaned).toContain('Bearer ***');
    expect(cleaned).toContain('api_key=');
  });
});
