import { describe, it, expect } from 'vitest';
import {
  EmailRouter,
  defaultEmailRouter,
  resolveRoute,
  buildForwardEmail,
} from '../src/router';

describe('EmailRouter - 产品标签与智能分流增强测试', () => {
  describe('buildForwardEmail 别名构造器', () => {
    it('正确为基础 Gmail 地址拼接别名标签', () => {
      expect(buildForwardEmail('backup@example.com', 'personal')).toBe(
        'backup+personal@example.com'
      );
      expect(buildForwardEmail('backup@example.com', 'support')).toBe(
        'backup+support@example.com'
      );
    });

    it('若无别名标签或别名为空，直接返回基础邮箱', () => {
      expect(buildForwardEmail('backup@example.com')).toBe('backup@example.com');
      expect(buildForwardEmail('backup@example.com', '')).toBe('backup@example.com');
    });

    it('若原有邮箱已带有 +tag，应优雅替换为新标签', () => {
      expect(buildForwardEmail('backup+old@example.com', 'support')).toBe(
        'backup+support@example.com'
      );
    });

    it('对于无 @ 符号的异常输入，应容错拼接', () => {
      expect(buildForwardEmail('backup', 'test')).toBe('backup+test');
    });
  });

  describe('个人生活与个人品牌来信 (Personal Persona)', () => {
    it('admin@example.com 映射至个人生活标签与 personal 别名', () => {
      const route = resolveRoute('admin@example.com', 'backup@example.com');
      expect(route.category).toBe('personal');
      expect(route.tag).toBe('个人');
      expect(route.forwardEmail).toBe('backup+personal@example.com');
    });

    it('包含昵称格式的个人邮箱也能被精准识别', () => {
      const route = resolveRoute('Admin User <me@example.com>', 'backup@example.com');
      expect(route.category).toBe('personal');
      expect(route.tag).toBe('个人');
      expect(route.forwardEmail).toBe('backup+personal@example.com');
    });

    it('通用个人前缀 (me, i, personal, blog, hi, hello) 均识别为个人来信', () => {
      expect(resolveRoute('me@otherdomain.com').category).toBe('personal');
      expect(resolveRoute('i@mydomain.org').category).toBe('personal');
      expect(resolveRoute('blog@notes.net').category).toBe('personal');
      expect(resolveRoute('hi@mydomain.com').category).toBe('personal');
      expect(resolveRoute('hello@mydomain.com').category).toBe('personal');
    });
  });

  describe('客户服务与商务来信 (Support & Business Persona)', () => {
    it('support@example.com 映射至客服标签与 support 别名', () => {
      const route = resolveRoute('support@example.com', 'backup@example.com');
      expect(route.category).toBe('commercial');
      expect(route.tag).toBe('客服');
      expect(route.forwardEmail).toBe('backup+support@example.com');
    });

    it('billing / sales 等商务前缀命中商务画像', () => {
      const route = resolveRoute('billing@example.com', 'backup@example.com');
      expect(route.category).toBe('commercial');
      expect(route.tag).toBe('商务');
      expect(route.forwardEmail).toBe('backup+business@example.com');
    });
  });

  describe('多站点通用兜底 (Generic Gateway)', () => {
    it('未命中特定规则的来信，兜底转至基础邮箱并展示通用标签', () => {
      const route = resolveRoute('random-inbox@portfolio-site.com', 'backup@example.com');
      expect(route.category).toBe('generic');
      expect(route.tag).toBe('通用');
      expect(route.forwardEmail).toBe('backup@example.com');
      expect(route.productName).toBe('Generic Gateway');
    });

    it('其他业务站点来信正确返回通用画像', () => {
      const route = resolveRoute('tool@my-tool-hub.org', 'backup@example.com');
      expect(route.category).toBe('generic');
      expect(route.tag).toBe('通用');
      expect(route.forwardEmail).toBe('backup@example.com');
    });
  });

  describe('未来产品扩展能力与多频道/Topic 参数预留', () => {
    it('支持动态注册新商业产品，并配置独立 TG chat_id 与 message_thread_id', () => {
      const customRouter = new EmailRouter();

      customRouter.addRule(
        {
          id: 'commercial-saas',
          name: 'NextSaaS',
          category: 'commercial',
          tag: '🏷️ [NextSaaS · 核心客户]',
          aliasTag: 'nextsaas',
          chatId: '-1001999999999',
          messageThreadId: 88,
          match: (toAddress, domain, username) => {
            return username === 'saas' || domain.includes('nextsaas');
          },
        },
        true
      );

      const route = customRouter.resolve('saas@example.com', 'backup@example.com');
      expect(route.category).toBe('commercial');
      expect(route.tag).toBe('🏷️ [NextSaaS · 核心客户]');
      expect(route.forwardEmail).toBe('backup+nextsaas@example.com');
      expect(route.chatId).toBe('-1001999999999');
      expect(route.messageThreadId).toBe(88);
    });
  });

  describe('动态 KV 自定义规则与标签合法性校验', () => {
    it('isValidTag 应限定为合法标签', async () => {
      const { isValidTag } = await import('../src/router');
      expect(isValidTag('个人')).toBe(true);
      expect(isValidTag('客服')).toBe(true);
      expect(isValidTag('商务')).toBe(true);
      expect(isValidTag('产品')).toBe(true);
      expect(isValidTag('通用')).toBe(true);
      expect(isValidTag('免费产品')).toBe(true);
      expect(isValidTag('付费产品')).toBe(true);
      expect(isValidTag('商业支持')).toBe(true);
      expect(isValidTag('其他')).toBe(false);
      expect(isValidTag('商业')).toBe(false);
    });

    it('基于 Mock KV 应能实现自定义规则添加、列表、解析与删除', async () => {
      const { addCustomRule, listCustomRules, getCustomRule, deleteCustomRule, resolveRouteAsync } = await import('../src/router');
      const store = new Map<string, string>();
      const mockKv = {
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

      // 1. 添加一条自定义付费产品规则
      await addCustomRule(mockKv, {
        prefix: 'myvip',
        tag: '付费产品',
        forwardEmail: 'client@domain.com',
      });

      // 2. 查询该规则
      const rule = await getCustomRule(mockKv, 'myvip');
      expect(rule).not.toBeNull();
      expect(rule?.tag).toBe('付费产品');
      expect(rule?.forwardEmail).toBe('client@domain.com');

      // 3. 异步解析命中自定义规则
      const resolved = await resolveRouteAsync('myvip@example.com', 'backup@example.com', mockKv);
      expect(resolved.tag).toBe('付费产品');
      expect(resolved.forwardEmail).toBe('client@domain.com');
      expect(resolved.isCustom).toBe(true);

      // 4. 列出全部自定义规则
      const list = await listCustomRules(mockKv);
      expect(list.length).toBe(1);
      expect(list[0].prefix).toBe('myvip');

      // 5. 删除规则
      const deleted = await deleteCustomRule(mockKv, 'myvip');
      expect(deleted).toBe(true);
      expect(await getCustomRule(mockKv, 'myvip')).toBeNull();

      // 6. 删除后再解析，回退到默认通用规则
      const fallback = await resolveRouteAsync('myvip@example.com', 'backup@example.com', mockKv);
      expect(fallback.tag).toBe('通用');
      expect(fallback.forwardEmail).toBe('backup@example.com');
    });

    it('营销关键词 KV 操作与安全追加 (appendMarketingKeywords) 应正常工作且不覆盖已有词', async () => {
      const {
        getMarketingKeywords,
        setMarketingKeywords,
        appendMarketingKeywords,
        resetMarketingKeywords,
      } = await import('../src/router');

      const store = new Map<string, string>();
      const mockKv = {
        async get(key: string) {
          return store.get(key) || null;
        },
        async put(key: string, val: string) {
          store.set(key, val);
        },
        async delete(key: string) {
          store.delete(key);
        },
      };

      const initial = await getMarketingKeywords(mockKv);
      expect(initial.length).toBeGreaterThan(10);
      expect(initial).toContain('unsubscribe');

      await setMarketingKeywords(mockKv, ['退订', '优惠券', 'appranker']);
      const customKws = await getMarketingKeywords(mockKv);
      expect(customKws).toEqual(['退订', '优惠券', 'appranker']);

      const appendRes = await appendMarketingKeywords(mockKv, ['优惠券', 'extensionbooster', 'growth strategy']);
      expect(appendRes.success).toBe(true);
      expect(appendRes.addedCount).toBe(2);
      expect(appendRes.totalCount).toBe(5);
      expect(appendRes.allKeywords).toEqual(['退订', '优惠券', 'appranker', 'extensionbooster', 'growth strategy']);

      await resetMarketingKeywords(mockKv);
      const afterReset = await getMarketingKeywords(mockKv);
      expect(afterReset).toContain('unsubscribe');
    });

    it('ensureLanguageKeywords 应自动将特定语言地道词库增量合并，且重复调用时跳过写入', async () => {
      const { ensureLanguageKeywords, getMarketingKeywords } = await import('../src/router');
      const store = new Map<string, string>();
      let putCallCount = 0;
      const mockKv = {
        async get(key: string) {
          return store.get(key) || null;
        },
        async put(key: string, val: string) {
          putCallCount++;
          store.set(key, val);
        },
      };

      // 1. 首次为 zh-CN 注入词库
      const res1 = await ensureLanguageKeywords(mockKv, 'zh-CN');
      expect(res1.success).toBe(true);
      expect(res1.addedCount).toBeGreaterThan(15);
      expect(putCallCount).toBe(1);

      const kws1 = await getMarketingKeywords(mockKv);
      expect(kws1).toContain('退订');
      expect(kws1).toContain('优惠券');
      expect(kws1).toContain('unsubscribe');

      // 2. 再次调用同一语言，触发额度防御，跳过 kv.put 写入
      const res2 = await ensureLanguageKeywords(mockKv, 'zh-CN');
      expect(res2.success).toBe(true);
      expect(res2.addedCount).toBe(0);
      expect(putCallCount).toBe(1); // 未额外增加写入操作！
    });

    it('自定义标签管理 (addCustomTag, getCustomTags, deleteCustomTag, isValidTag) 正常运作', async () => {
      const {
        getCustomTags,
        getAllActiveTags,
        addCustomTag,
        deleteCustomTag,
        isValidTag,
      } = await import('../src/router');

      const store = new Map<string, string>();
      const mockKv = {
        async get(key: string) {
          return store.get(key) || null;
        },
        async put(key: string, val: string) {
          store.set(key, val);
        },
      };

      expect(await getCustomTags(mockKv)).toEqual([]);

      // 1. 添加自定义标签
      await addCustomTag(mockKv, '财务');
      await addCustomTag(mockKv, '监控');
      const tags = await getCustomTags(mockKv);
      expect(tags).toEqual(['财务', '监控']);

      // 2. 验证有效性校验支持自定义标签
      expect(isValidTag('财务', tags)).toBe(true);
      expect(isValidTag('未知标签', tags)).toBe(false);

      // 3. 全量标签列表包含基线与自定义标签
      const allTags = await getAllActiveTags(mockKv);
      expect(allTags).toContain('个人');
      expect(allTags).toContain('财务');
      expect(allTags).toContain('监控');

      // 4. 删除自定义标签
      await deleteCustomTag(mockKv, '财务');
      expect(await getCustomTags(mockKv)).toEqual(['监控']);
    });
  });
});
