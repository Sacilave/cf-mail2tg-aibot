import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from '../src/index';

describe('Telegram Webhook - 动态管理与交互指令测试', () => {
  let store: Map<string, string>;
  let mockKv: any;
  let fetchMock: any;

  const env = {
    TELEGRAM_BOT_TOKEN: '123456789:test_mock_token',
    TELEGRAM_ADMIN_CHAT_ID: '987654321',
    FORWARD_TO_EMAIL: 'backup@example.com',
    MAIL_ROUTES_KV: null as any,
  };

  beforeEach(() => {
    store = new Map<string, string>();
    mockKv = {
      async get(key: string) {
        return store.get(key) || null;
      },
      async put(key: string, val: string) {
        store.set(key, val);
      },
      async delete(key: string) {
        store.delete(key);
      },
      async list(opts?: { prefix?: string }) {
        const keys: { name: string }[] = [];
        for (const k of store.keys()) {
          if (!opts?.prefix || k.startsWith(opts.prefix)) {
            keys.push({ name: k });
          }
        }
        return { keys };
      },
    };
    env.MAIL_ROUTES_KV = mockKv;

    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  it('公网非法 GET 请求应被 403 阻断', async () => {
    const req = new Request('https://worker.dev/', { method: 'GET' });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(403);
  });

  it('/setup-webhook 端点应成功请求 Telegram 注册 webhook', async () => {
    const req = new Request('https://worker.dev/setup-webhook', { method: 'GET' });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.ok).toBe(true);
    expect(data.webhookUrl).toBe('https://worker.dev/');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0][0]).toContain('setMyCommands');
    expect(fetchMock.mock.calls[1][0]).toContain('getWebhookInfo');
    expect(fetchMock.mock.calls[2][0]).toContain('setWebhook?url=https%3A%2F%2Fworker.dev%2F');
  });

  it('非管理员发来的消息应静默忽略 (返回 200 且不回复任何内容)', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 11111111 }, // 陌生人
          text: 'add 博客 test',
        },
      }),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(store.size).toBe(0);
  });

  it('单独发送 add 时，应回复使用说明消息', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'add',
        },
      }),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('添加规则命令说明');
    expect(body.text).toContain('add &lt;标签&gt; &lt;前缀&gt;');
  });

  it('add 时若 Tag 字段不属于规范标签，应添加失败并说明原因', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'add 杂项 test',
        },
      }),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('添加失败');
    expect(body.text).toContain('标签必须为');
    expect(store.size).toBe(0);
  });

  it('add 个人 xxx 应成功将规则写入 KV，且默认转发至 backup@example.com', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'add 个人 mylife',
        },
      }),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('新路由规则添加成功');
    expect(body.text).toContain('mylife');
    expect(body.text).toContain('个人');
    expect(body.text).toContain('backup@example.com');

    const saved = JSON.parse(store.get('route:mylife') || '{}');
    expect(saved.prefix).toBe('mylife');
    expect(saved.tag).toBe('个人');
    expect(saved.forwardEmail).toBe('backup@example.com');
  });

  it('add 付费产品 pro xxx@custom.com 应支持自定义转发目标', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'add 付费产品 pro billing@custom.com',
        },
      }),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    const saved = JSON.parse(store.get('route:pro') || '{}');
    expect(saved.prefix).toBe('pro');
    expect(saved.tag).toBe('付费产品');
    expect(saved.forwardEmail).toBe('billing@custom.com');
  });

  it('routes 指令应列出当前生效的所有内置与动态规则', async () => {
    store.set(
      'route:test1',
      JSON.stringify({ prefix: 'test1', tag: '个人', forwardEmail: 'backup@example.com' })
    );

    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'routes',
        },
      }),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('当前生效的邮件路由规则库');
    expect(body.text).toContain('test1');
  });

  it('del news 应先弹出带内联按钮的二次确认，不直接删除数据库', async () => {
    store.set(
      'route:news',
      JSON.stringify({ prefix: 'news', tag: '个人', forwardEmail: 'backup@example.com' })
    );

    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'del news',
        },
      }),
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);

    expect(store.has('route:news')).toBe(true);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('请二次确认是否删除规则');
    expect(body.reply_markup?.inline_keyboard).toBeDefined();
    expect(body.reply_markup.inline_keyboard[0][0].callback_data).toBe('del_confirm:news');
    expect(body.reply_markup.inline_keyboard[0][1].callback_data).toBe('del_cancel:news');
  });

  it('点击确认删除按钮 (del_confirm:news) 时，才真正从数据库彻底删除', async () => {
    store.set(
      'route:news',
      JSON.stringify({ prefix: 'news', tag: '个人', forwardEmail: 'backup@example.com' })
    );

    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query: {
          id: 'cb_123',
          from: { id: 987654321 },
          data: 'del_confirm:news',
          message: { message_id: 888 },
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);

    expect(store.has('route:news')).toBe(false);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const answerCall = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(answerCall.callback_query_id).toBe('cb_123');

    const editCall = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(editCall.message_id).toBe(888);
    expect(editCall.text).toContain('已彻底删除规则');
  });

  it('点击取消按钮 (del_cancel:news) 时，保留数据并编辑消息取消', async () => {
    store.set(
      'route:news',
      JSON.stringify({ prefix: 'news', tag: '个人', forwardEmail: 'backup@example.com' })
    );

    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query: {
          id: 'cb_456',
          from: { id: 987654321 },
          data: 'del_cancel:news',
          message: { message_id: 888 },
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);

    expect(store.has('route:news')).toBe(true);

    const editCall = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(editCall.text).toContain('操作已取消');
  });

  it('发送 keywords 指令应返回完整关键词清单，包含 <pre><code> 方便手机一键复制', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'keywords',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('营销推广拦截关键词管理');
    expect(body.text).toContain('<pre><code>');
    expect(body.text).toContain('unsubscribe');
    expect(body.reply_markup?.force_reply).toBe(true);
  });

  it('使用 setkeywords 换行指定新关键词，应全量替换数据库中的关键词配置', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: `setkeywords\n优惠券\n退订\n限时折扣\n# 这是一行注释\n   \n专享福利`,
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('营销关键词库已成功更新');
    expect(body.text).toContain('4');

    const saved = JSON.parse(store.get('config:marketing_keywords') || '[]');
    expect(saved).toEqual(['优惠券', '退订', '限时折扣', '专享福利']);
  });

  it('直接回复关键词消息 (Reply) 时，应自动识别并全量替换关键词配置', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: `VIP特惠\n黑五抢购\n取消订阅`,
          reply_to_message: {
            text: `📋 【营销推广拦截关键词管理】\n当前生效关键词共 25 个...`,
          },
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('营销关键词库已成功更新');

    const saved = JSON.parse(store.get('config:marketing_keywords') || '[]');
    expect(saved).toEqual(['VIP特惠', '黑五抢购', '取消订阅']);
  });

  it('发送 resetkeywords 应清空自定义关键词并恢复系统默认基线', async () => {
    store.set('config:marketing_keywords', JSON.stringify(['custom1', 'custom2']));

    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'resetkeywords',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(store.has('config:marketing_keywords')).toBe(false);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('营销关键词已重置为默认基线');
  });

  it('发送 addkeywords 应安全增量追加新关键词，绝不覆盖已有关键词', async () => {
    store.set('config:marketing_keywords', JSON.stringify(['退订', 'unsubscribe']));

    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: `/addkeywords appranker\nextensionbooster\n退订`,
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('增量关键词添加成功');
    expect(body.text).toContain('本次成功新增: <b>2</b> 个');
    expect(body.text).toContain('现有生效总词数: <b>4</b> 个');

    const saved = JSON.parse(store.get('config:marketing_keywords') || '[]');
    expect(saved).toEqual(['退订', 'unsubscribe', 'appranker', 'extensionbooster']);
  });

  it('发送 /config 应返回包含脱敏密钥、备份邮箱与状态的诊断卡片', async () => {
    store.set('config:sys:minimax_api_key', 'minimax-custom-secret-key-123456');

    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'config',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('设置与密钥状态');
    expect(body.text).toContain('大模型审信 (LLM)');
    expect(body.text).toContain('min***3456'); // 验证脱敏掩码
    expect(body.text).not.toContain('minimax-custom-secret-key-123456'); // 绝不能泄露明文！
    expect(body.text).toContain('零丢信备份轨');
    expect(body.text).toContain('KV 数据库 (MAIL_ROUTES_KV)');
  });

  it('使用 /setkey minimax 换新密钥应成功持久化存入 KV 并回显脱敏掩码', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: '/setkey minimax new-secret-minimax-key-999',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('大模型 API 密钥已成功热更新');
    expect(body.text).toContain('new***-999');
    expect(body.text).not.toContain('new-secret-minimax-key-999'); // 响应卡片不泄漏完整明文

    expect(store.get('config:sys:minimax_api_key')).toBe('new-secret-minimax-key-999');
  });

  it('使用 /setkey forward 换备份邮箱应成功更新 KV', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: '/setkey forward updated-inbox@gmail.com',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(store.get('config:sys:forward_to_email')).toBe('updated-inbox@gmail.com');
  });

  it('发送 /resetkey minimax 应删除 KV 动态覆盖', async () => {
    store.set('config:sys:minimax_api_key', 'some-key');

    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: '/resetkey minimax',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(store.has('config:sys:minimax_api_key')).toBe(false);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('已重置 minimax 动态配置');
  });

  it('发送 /start 应返回精简实用主义的网关状态卡片与按键导航', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'start',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2); // 1. setMyCommands, 2. sendMessage

    const body = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(body.text).toContain('cf-mail2tg-aibot 邮件网关');
    expect(body.text).toContain('网关运行状态摘要');
    expect(body.text).toContain('正常运行 (Online)');
    expect(body.reply_markup).toBeDefined();
    expect(body.reply_markup.inline_keyboard.length).toBe(2);
    const btns = body.reply_markup.inline_keyboard.flat().map((b: any) => b.callback_data);
    expect(btns).toContain('m:main');
    expect(btns).toContain('m:guide');
    expect(btns).toContain('m:lang');
  });

  it('发送 /help 应返回全量控制面板', async () => {
    const req = new Request('https://worker.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          from: { id: 987654321 },
          text: 'help',
        },
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);

    const body = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(body.text).toContain('指令帮助');
    expect(body.text).toContain('状态与配置指令');
  });

  describe('交互式配置向导 (/setup & /cancel) 自动化测试', () => {
    it('发送 /setup 应启动向导，设置 session 步数为 1 并发送第 1 步提示卡片', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/setup',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(store.get('session:setup_step')).toBe('1');

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('交互式配置向导 (1/2)');
      expect(body.text).toContain('配置备份转发邮箱');
      expect(body.text).toContain('skip');
    });

    it('未配置 MAIL_ROUTES_KV 时发送 /setup 应提示系统错误', async () => {
      const customEnv = { ...env, MAIL_ROUTES_KV: null };
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/setup',
          },
        }),
      });

      const res = await worker.fetch(req, customEnv as any);
      expect(res.status).toBe(200);
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('未绑定 MAIL_ROUTES_KV 数据库');
    });

    it('向导第 1 步: 输入非法邮箱格式应报错并保持在第 1 步', async () => {
      store.set('session:setup_step', '1');

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: 'not-an-email',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(store.get('session:setup_step')).toBe('1');
      expect(store.has('config:sys:forward_to_email')).toBe(false);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('邮箱格式不合法');
      expect(body.text).toContain('not-an-email');
    });

    it('向导第 1 步: 输入合法邮箱应存入 KV 并进入第 2 步', async () => {
      store.set('session:setup_step', '1');

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: 'my-inbox@gmail.com',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(store.get('config:sys:forward_to_email')).toBe('my-inbox@gmail.com');
      expect(store.get('session:setup_step')).toBe('2');

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('备份邮箱绑定成功');
      expect(body.text).toContain('my-inbox@gmail.com');
      expect(body.text).toContain('交互式配置向导 (2/2)');
      expect(body.text).toContain('配置 MiniMax 大模型 API Key');
    });

    it('向导第 1 步: 输入 skip 应跳过邮箱设置并进入第 2 步', async () => {
      store.set('session:setup_step', '1');

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: 'skip',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(store.has('config:sys:forward_to_email')).toBe(false);
      expect(store.get('session:setup_step')).toBe('2');

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('已跳过备份邮箱配置');
      expect(body.text).toContain('交互式配置向导 (2/2)');
    });

    it('向导第 2 步: 输入 MiniMax API Key 应存入 KV、清除会话并返回完成总结卡片', async () => {
      store.set('session:setup_step', '2');
      store.set('config:sys:forward_to_email', 'primary@example.com');

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: 'sk-minimax-super-secret-key-999',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(store.get('config:sys:minimax_api_key')).toBe('sk-minimax-super-secret-key-999');
      expect(store.has('session:setup_step')).toBe(false);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('大模型 API Key 绑定成功');
      expect(body.text).toContain('sk-***-999');
      expect(body.text).toContain('极速配置流程已全部完成');
      expect(body.text).toContain('primary@example.com');
    });

    it('向导第 2 步: 输入 skip 应清除会话并返回完成总结卡片', async () => {
      store.set('session:setup_step', '2');

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: 'skip',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(store.has('config:sys:minimax_api_key')).toBe(false);
      expect(store.has('session:setup_step')).toBe(false);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('已跳过大模型 API Key 配置');
      expect(body.text).toContain('配置流程已顺利完成');
    });

    it('向导进行中发送 /cancel 应立即清除会话并返回退出确认', async () => {
      store.set('session:setup_step', '1');

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/cancel',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(store.has('session:setup_step')).toBe(false);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('已退出配置向导');
      expect(body.text).toContain('/setup');
    });

    it('向导进行中发送其他标准指令 (如 /config) 应自动退出向导并正常执行该指令', async () => {
      store.set('session:setup_step', '1');

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/config',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      // Session should have been cleared
      expect(store.has('session:setup_step')).toBe(false);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('设置与密钥状态');
    });
  });

  describe('Webhook Secret 签名防护与鉴权测试 (P0 安全防御)', () => {
    const secureEnv = {
      ...env,
      TELEGRAM_WEBHOOK_SECRET: 'my_ultra_secret_webhook_token_123',
    };

    it('配置 TELEGRAM_WEBHOOK_SECRET 时，缺失 Header 请求应返回 401 Unauthorized', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/config',
          },
        }),
      });

      const res = await worker.fetch(req, secureEnv);
      expect(res.status).toBe(401);
      const errText = await res.text();
      expect(errText).toContain('Invalid Telegram Webhook Secret Token');
    });

    it('配置 TELEGRAM_WEBHOOK_SECRET 时，Header 伪造或不匹配应被 401 拒之门外', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-bot-api-secret-token': 'wrong_attacker_token',
        },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/config',
          },
        }),
      });

      const res = await worker.fetch(req, secureEnv);
      expect(res.status).toBe(401);
    });

    it('携带合法 Secret Token Header 时应成功通过并执行指令', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-bot-api-secret-token': 'my_ultra_secret_webhook_token_123',
        },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/help',
          },
        }),
      });

      const res = await worker.fetch(req, secureEnv);
      expect(res.status).toBe(200);
      expect(fetchMock).toHaveBeenCalled();
    });

    it('/setup-webhook 在配置 Secret 时，若缺少 ?secret= 应被 403 拒绝', async () => {
      const req = new Request('https://worker.dev/setup-webhook', { method: 'GET' });
      const res = await worker.fetch(req, secureEnv);
      expect(res.status).toBe(403);
      const data = (await res.json()) as any;
      expect(data.ok).toBe(false);
      expect(data.error).toContain('Invalid or missing setup secret');
    });

    it('/setup-webhook 携带正确的 ?secret= 参数应顺利注册且包含 secret_token', async () => {
      const req = new Request(
        'https://worker.dev/setup-webhook?secret=my_ultra_secret_webhook_token_123',
        { method: 'GET' }
      );
      const res = await worker.fetch(req, secureEnv);
      expect(res.status).toBe(200);
      const data = (await res.json()) as any;
      expect(data.ok).toBe(true);

      // Verify secret_token was passed in fetch URL to Telegram setWebhook API
      const setWebhookCall = fetchMock.mock.calls.find((call: any[]) =>
        String(call[0]).includes('setWebhook')
      );
      expect(setWebhookCall).toBeDefined();
      expect(String(setWebhookCall[0])).toContain('secret_token=my_ultra_secret_webhook_token_123');
    });
  });

  describe('交互式大模型厂商与模型切换指令 (/provider & /model)', () => {
    it('发送 /provider 应返回 1~9 编号列表并记录 session:action 会话状态', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/provider',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('请选择大模型 API 厂商');
      expect(body.text).toContain('1️⃣ <b>Cloudflare Workers AI</b>');
      expect(body.text).toContain('2️⃣ <b>DeepSeek (深度求索)</b>');
      expect(body.text).toContain('3️⃣ <b>Groq (极速推理)</b>');
      expect(body.text).toContain('直接回复数字 <b>1~9</b> 即可完成切换');

      const sessionRaw = store.get('session:interactive_action');
      expect(sessionRaw).toBeDefined();
      const session = JSON.parse(sessionRaw!);
      expect(session.type).toBe('select_provider');
    });

    it('在 /provider 会话中直接回复数字 2 应切换为 DeepSeek 并设定默认模型 deepseek-chat', async () => {
      // 1. Simulate active session
      store.set(
        'session:interactive_action',
        JSON.stringify({ type: 'select_provider', createdAt: Date.now() })
      );

      // 2. User replies with "2"
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '2',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('API 厂商切换成功');
      expect(body.text).toContain('DeepSeek (深度求索)');
      expect(body.text).toContain('deepseek-chat');

      expect(store.get('config:sys:ai_provider')).toBe('deepseek');
      expect(store.get('config:sys:ai_model')).toBe('deepseek-chat');
      expect(store.has('session:interactive_action')).toBe(false); // 会话已成功清除
    });

    it('支持一步传参直切厂商: /provider 3 切换为 Groq', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/provider 3',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('API 厂商切换成功');
      expect(body.text).toContain('Groq (极速推理)');
      expect(body.text).toContain('llama-3.3-70b-versatile');

      expect(store.get('config:sys:ai_provider')).toBe('groq');
      expect(store.get('config:sys:ai_model')).toBe('llama-3.3-70b-versatile');
    });

    it('发送 /model 应展示当前厂商精选模型并开启交互会话', async () => {
      store.set('config:sys:ai_provider', 'deepseek');

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/model',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('请选择 DeepSeek (深度求索) 运行模型');
      expect(body.text).toContain('deepseek-chat');
      expect(body.text).toContain('deepseek-reasoner');

      const sessionRaw = store.get('session:interactive_action');
      expect(sessionRaw).toBeDefined();
      const session = JSON.parse(sessionRaw!);
      expect(session.type).toBe('select_model');
    });

    it('在 /model 会话中回复编号或自定义模型名应成功生效', async () => {
      store.set(
        'session:interactive_action',
        JSON.stringify({ type: 'select_model', provider: 'deepseek', createdAt: Date.now() })
      );

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '2', // 选择第2项: deepseek-reasoner
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('运行模型更新成功');
      expect(body.text).toContain('deepseek-reasoner');
      expect(store.get('config:sys:ai_model')).toBe('deepseek-reasoner');
    });

    it('使用 /setkey ai 可热更新通用 AI API Key', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/setkey ai sk-universal-ai-key-12345678',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.text).toContain('通用大模型 API 密钥已成功热更新');
      expect(body.text).toContain('sk-***5678');
      expect(store.get('config:sys:ai_api_key')).toBe('sk-universal-ai-key-12345678');
    });
  });

  describe('Telegram Dashboard & Button Navigation - 交互中枢与内联按键导航系统测试', () => {
    it('/menu 指令应展示主控制面板及 2x3 快捷导航按键', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/menu',
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      // fetchMock call 0 is setMyCommands, call 1 is sendTelegramMessage
      const msgCall = fetchMock.mock.calls.find((c: any) => c[0].endsWith('/sendMessage'));
      expect(msgCall).toBeDefined();
      const body = JSON.parse(msgCall[1].body);
      expect(body.text).toContain('设置');
      expect(body.reply_markup).toBeDefined();
      expect(body.reply_markup.inline_keyboard.length).toBe(4);

      const allCallbackData = body.reply_markup.inline_keyboard.flat().map((btn: any) => btn.callback_data);
      expect(allCallbackData).toContain('m:ai');
      expect(allCallbackData).toContain('m:routes');
      expect(allCallbackData).toContain('m:kw');
      expect(allCallbackData).toContain('m:fwd');
      expect(allCallbackData).toContain('m:lang');
      expect(allCallbackData).toContain('m:refresh');
      expect(allCallbackData).toContain('m:setup');
      expect(allCallbackData).toContain('m:guide');
    });

    it('点击 m:main 回调应原地刷新为主控制面板', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_main_1',
            from: { id: 987654321 },
            data: 'm:main',
            message: { message_id: 100 },
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      expect(fetchMock).toHaveBeenCalledTimes(2);
      const answerCall = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(answerCall.callback_query_id).toBe('cb_main_1');

      const editCall = JSON.parse(fetchMock.mock.calls[1][1].body);
      expect(editCall.message_id).toBe(100);
      expect(editCall.text).toContain('设置');
      expect(editCall.reply_markup.inline_keyboard.length).toBe(4);
    });

    it('点击 m:ai 回调应切换展示 AI 模型设置面板与厂商按钮', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_ai_1',
            from: { id: 987654321 },
            data: 'm:ai',
            message: { message_id: 101 },
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      const editCall = JSON.parse(fetchMock.mock.calls[1][1].body);
      expect(editCall.text).toContain('AI 审信与意图引擎设置');
      const allButtons = editCall.reply_markup.inline_keyboard.flat().map((b: any) => b.callback_data);
      expect(allButtons).toContain('p:workers-ai');
      expect(allButtons).toContain('p:deepseek');
      expect(allButtons).toContain('p:openai');
      expect(allButtons).toContain('m:models');
      expect(allButtons).toContain('m:main');
    });

    it('点击 p:deepseek 按钮应热更新厂商与默认模型并弹出 Toast', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_p_deepseek',
            from: { id: 987654321 },
            data: 'p:deepseek',
            message: { message_id: 102 },
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      expect(store.get('config:sys:ai_provider')).toBe('deepseek');
      expect(store.get('config:sys:ai_model')).toBe('deepseek-chat');

      const answerCall = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(answerCall.text).toContain('DeepSeek');

      const editCall = JSON.parse(fetchMock.mock.calls[1][1].body);
      expect(editCall.text).toContain('DeepSeek');
    });

    it('点击 m:models 与 mod:xxx 应正确展示和切换具体模型', async () => {
      store.set('config:sys:ai_provider', 'deepseek');
      store.set('config:sys:ai_model', 'deepseek-chat');

      // 1. 打开模型选择子菜单
      const req1 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_models_list',
            from: { id: 987654321 },
            data: 'm:models',
            message: { message_id: 103 },
          },
        }),
      });
      await worker.fetch(req1, env);
      const editCall1 = JSON.parse(fetchMock.mock.calls[1][1].body);
      expect(editCall1.text).toContain('deepseek-chat');

      // 2. 点击切换为 deepseek-reasoner
      fetchMock.mockClear();
      const req2 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_mod_reasoner',
            from: { id: 987654321 },
            data: 'mod:deepseek-reasoner',
            message: { message_id: 103 },
          },
        }),
      });
      await worker.fetch(req2, env);

      expect(store.get('config:sys:ai_model')).toBe('deepseek-reasoner');
      const answerCall2 = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(answerCall2.text).toContain('deepseek-reasoner');
    });

    it('两步式轻量添加分流规则: 点击分类按键后回复前缀完成绑定', async () => {
      // 步骤 1: 点击 ra:start 展开分类按键
      const req1 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_ra_start',
            from: { id: 987654321 },
            data: 'ra:start',
            message: { message_id: 104 },
          },
        }),
      });
      await worker.fetch(req1, env);
      const edit1 = JSON.parse(fetchMock.mock.calls[1][1].body);
      expect(edit1.text).toContain('业务分类标签');

      // 步骤 2: 点击 ra:tag:客服 进入前缀输入态
      fetchMock.mockClear();
      const req2 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_ra_tag',
            from: { id: 987654321 },
            data: 'ra:tag:客服',
            message: { message_id: 104 },
          },
        }),
      });
      await worker.fetch(req2, env);

      const sessionRaw = store.get('session:interactive_action');
      expect(sessionRaw).toBeDefined();
      const session = JSON.parse(sessionRaw!);
      expect(session.type).toBe('add_route_prefix');
      expect(session.tag).toBe('客服');

      // 步骤 3: 用户直接输入前缀和专属转发目标 "help support@mycorp.com"
      fetchMock.mockClear();
      const req3 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: 'help support@mycorp.com',
          },
        }),
      });
      await worker.fetch(req3, env);

      // 验证规则已成功存入 KV
      const savedRuleRaw = store.get('route:help');
      expect(savedRuleRaw).toBeDefined();
      const savedRule = JSON.parse(savedRuleRaw!);
      expect(savedRule.prefix).toBe('help');
      expect(savedRule.tag).toBe('客服');
      expect(savedRule.forwardEmail).toBe('support@mycorp.com');

      // 验证会话已清理
      expect(store.has('session:interactive_action')).toBe(false);

      // 验证回复了成功卡片与导航按键
      const msgBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(msgBody.text).toContain('分流规则添加成功');
      expect(msgBody.text).toContain('客服');
      expect(msgBody.text).toContain('support@mycorp.com');
    });

    it('点击 rd:help 按钮应一键删除该规则并刷新列表', async () => {
      store.set(
        'route:help',
        JSON.stringify({ prefix: 'help', tag: '客服', forwardEmail: 'support@mycorp.com' })
      );

      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_rd_help',
            from: { id: 987654321 },
            data: 'rd:help',
            message: { message_id: 105 },
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      expect(store.has('route:help')).toBe(false);
      const answerCall = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(answerCall.text).toContain('彻底删除');
    });

    it('点击 fwd:toggle_alias 应实时切换 Gmail 别名开关', async () => {
      // 默认开启 -> 切换为关闭
      const req1 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_toggle_alias_1',
            from: { id: 987654321 },
            data: 'fwd:toggle_alias',
            message: { message_id: 106 },
          },
        }),
      });
      await worker.fetch(req1, env);
      expect(store.get('config:sys:enable_gmail_aliases')).toBe('false');

      // 再次点击 -> 切换为开启
      fetchMock.mockClear();
      const req2 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_toggle_alias_2',
            from: { id: 987654321 },
            data: 'fwd:toggle_alias',
            message: { message_id: 106 },
          },
        }),
      });
      await worker.fetch(req2, env);
      expect(store.get('config:sys:enable_gmail_aliases')).toBe('true');
    });

    it('非法或未经授权的 Telegram 用户发出的回调请求应被安全静默忽略', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_hacker',
            from: { id: 111111111 }, // 未授权
            data: 'p:deepseek',
            message: { message_id: 999 },
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(store.has('config:sys:ai_provider')).toBe(false);
    });

    it('点击 m:guide 或发送 /guide 应返回详尽且易懂的使用指南卡片', async () => {
      // 1. 测试回调点击 m:guide
      const reqCb = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_guide',
            from: { id: 987654321 },
            data: 'm:guide',
            message: { message_id: 107 },
          },
        }),
      });

      await worker.fetch(reqCb, env);
      expect(fetchMock).toHaveBeenCalled();
      const cbBody = JSON.parse(fetchMock.mock.calls[1][1].body);
      expect(cbBody.text).toContain('使用指南');
      expect(cbBody.text).toContain('工作流程');
      expect(cbBody.text).toContain('邮件分类与验证码');
      expect(cbBody.text).toContain('垃圾拦截与静默推送');
      expect(cbBody.text).toContain('常用指令速查');

      // 验证跳转至 GitHub 详细文档按键
      expect(cbBody.reply_markup.inline_keyboard[0][0].url).toContain('github.com');

      const btns = cbBody.reply_markup.inline_keyboard.flat().map((b: any) => b.callback_data).filter(Boolean);
      expect(btns).toContain('m:start');
      expect(btns).toContain('m:main');

      // 2. 测试指令 /guide
      fetchMock.mockClear();
      const reqCmd = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '/guide',
          },
        }),
      });

      await worker.fetch(reqCmd, env);
      const cmdBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(cmdBody.text).toContain('使用指南');
      expect(cmdBody.text).toContain('常用指令速查');
    });

    it('点击 m:setup 回调应启动配置向导第一步并附带取消按钮', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_setup_1',
            from: { id: 987654321 },
            data: 'm:setup',
            message: { message_id: 105 },
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      expect(store.get('session:setup_step')).toBe('1');
      const msgCall = fetchMock.mock.calls.find((c: any) => c[0].endsWith('/sendMessage'));
      expect(msgCall).toBeDefined();
      const body = JSON.parse(msgCall[1].body);
      expect(body.text).toContain('配置备份转发邮箱');
      expect(body.reply_markup.inline_keyboard[0][0].callback_data).toBe('m:cancel');
    });

    it('点击 m:cancel 回调应清除会话并退出向导', async () => {
      store.set('session:setup_step', '1');
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_cancel_1',
            from: { id: 987654321 },
            data: 'm:cancel',
            message: { message_id: 106 },
          },
        }),
      });

      const res = await worker.fetch(req, env);
      expect(res.status).toBe(200);

      expect(store.get('session:setup_step')).toBeUndefined();
      const msgCall = fetchMock.mock.calls.find((c: any) => c[0].endsWith('/sendMessage'));
      expect(msgCall).toBeDefined();
      const body = JSON.parse(msgCall[1].body);
      expect(body.text).toContain('已退出配置向导');
    });

    it('切换语言至 zh-CN 时应自动将中文地道营销关键词追加至 KV (不覆盖已有词)', async () => {
      const req = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_lang_zh',
            from: { id: 987654321 },
            data: 'lang:zh-CN',
            message: { message_id: 108 },
          },
        }),
      });

      await worker.fetch(req, env);
      expect(store.get('config:sys:system_language')).toBe('zh-CN');

      const savedKwsRaw = store.get('config:marketing_keywords');
      expect(savedKwsRaw).toBeDefined();
      const savedKws = JSON.parse(savedKwsRaw!);
      expect(savedKws).toContain('退订');
      expect(savedKws).toContain('优惠券');
      expect(savedKws).toContain('兼职刷单');
      expect(savedKws).toContain('unsubscribe');
    });

    it('自定义业务分类标签管理完整链路 (ta:start -> 输入标签 -> m:tags -> td:删除)', async () => {
      // 1. 点击 ta:start 发起添加自定义标签
      const req1 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_ta_start',
            from: { id: 987654321 },
            data: 'ta:start',
            message: { message_id: 109 },
          },
        }),
      });
      await worker.fetch(req1, env);
      const session = JSON.parse(store.get('session:interactive_action')!);
      expect(session.type).toBe('add_custom_tag');

      // 2. 用户回复标签名称 "财务"
      fetchMock.mockClear();
      const req2 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            from: { id: 987654321 },
            text: '财务',
          },
        }),
      });
      await worker.fetch(req2, env);
      const savedTags = JSON.parse(store.get('config:sys:custom_tags')!);
      expect(savedTags).toContain('财务');
      expect(store.has('session:interactive_action')).toBe(false);

      // 3. 点击 m:tags 查看标签列表
      fetchMock.mockClear();
      const req3 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_tags_view',
            from: { id: 987654321 },
            data: 'm:tags',
            message: { message_id: 110 },
          },
        }),
      });
      await worker.fetch(req3, env);
      const tagsBody = JSON.parse(fetchMock.mock.calls[1][1].body);
      expect(tagsBody.text).toContain('财务');
      const delBtns = tagsBody.reply_markup.inline_keyboard.flat().map((b: any) => b.callback_data);
      expect(delBtns).toContain('td:财务');

      // 4. 点击 td:财务 删除该标签
      fetchMock.mockClear();
      const req4 = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: {
            id: 'cb_td_finance',
            from: { id: 987654321 },
            data: 'td:财务',
            message: { message_id: 111 },
          },
        }),
      });
      await worker.fetch(req4, env);
      const updatedTags = JSON.parse(store.get('config:sys:custom_tags')!);
      expect(updatedTags).not.toContain('财务');
    });

    it('完整的按键驱动配置闭环 (ai:setkey, ai:resetkey, kw:add_start, fwd:set_start, fwd:reset_confirm)', async () => {
      // 1. ai:setkey -> 触发会话 -> 回复 Key -> KV 持久化
      const reqAiSet = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: { id: 'cb_ai_set', from: { id: 987654321 }, data: 'ai:setkey', message: { message_id: 201 } },
        }),
      });
      await worker.fetch(reqAiSet, env);
      expect(JSON.parse(store.get('session:interactive_action')!).type).toBe('set_ai_key');

      // 回复 Key
      const reqAiReply = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: { from: { id: 987654321 }, text: 'sk-button-test-12345' },
        }),
      });
      await worker.fetch(reqAiReply, env);
      expect(store.get('config:sys:ai_api_key')).toBe('sk-button-test-12345');
      expect(store.get('session:interactive_action')).toBeUndefined();

      // 2. ai:resetkey -> 清除动态 Key
      const reqAiReset = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: { id: 'cb_ai_reset', from: { id: 987654321 }, data: 'ai:resetkey', message: { message_id: 201 } },
        }),
      });
      await worker.fetch(reqAiReset, env);
      expect(store.get('config:sys:ai_api_key')).toBeUndefined();

      // 3. kw:add_start -> 回复关键词 -> KV 增量追加
      const reqKwAdd = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: { id: 'cb_kw_add', from: { id: 987654321 }, data: 'kw:add_start', message: { message_id: 202 } },
        }),
      });
      await worker.fetch(reqKwAdd, env);
      expect(JSON.parse(store.get('session:interactive_action')!).type).toBe('add_keywords');

      const reqKwReply = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: { from: { id: 987654321 }, text: '刷单返利 投资理财' },
        }),
      });
      await worker.fetch(reqKwReply, env);
      const kws = JSON.parse(store.get('config:marketing_keywords')!);
      expect(kws).toContain('刷单返利');
      expect(kws).toContain('投资理财');
      expect(store.get('session:interactive_action')).toBeUndefined();

      // 4. fwd:set_start -> 回复邮箱 -> KV 持久化
      const reqFwdSet = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: { id: 'cb_fwd_set', from: { id: 987654321 }, data: 'fwd:set_start', message: { message_id: 203 } },
        }),
      });
      await worker.fetch(reqFwdSet, env);
      expect(JSON.parse(store.get('session:interactive_action')!).type).toBe('set_forward_email');

      const reqFwdReply = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: { from: { id: 987654321 }, text: 'custom-inbox@gmail.com' },
        }),
      });
      await worker.fetch(reqFwdReply, env);
      expect(store.get('config:sys:forward_to_email')).toBe('custom-inbox@gmail.com');
      expect(store.get('session:interactive_action')).toBeUndefined();

      // 5. fwd:reset_confirm -> 清除备份邮箱
      const reqFwdReset = new Request('https://worker.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query: { id: 'cb_fwd_reset', from: { id: 987654321 }, data: 'fwd:reset_confirm', message: { message_id: 203 } },
        }),
      });
      await worker.fetch(reqFwdReset, env);
      expect(store.get('config:sys:forward_to_email')).toBeUndefined();
    });
  });
});

