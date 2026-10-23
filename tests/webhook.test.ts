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
    expect(body.text).toContain('退订');
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
});
