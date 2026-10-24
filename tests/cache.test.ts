import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getDynamicConfig,
  setDynamicConfig,
  deleteDynamicConfig,
  getMarketingKeywords,
  setMarketingKeywords,
  clearRouterCache,
  ROUTER_CACHE_TTL_MS,
} from '../src/router';

describe('Router KV In-Memory TTL Cache Tests (配额经济学优化)', () => {
  beforeEach(() => {
    clearRouterCache();
  });

  it('真实 KV 实例下应缓存读取结果，避免频繁请求底层数据库', async () => {
    let kvReadCount = 0;
    const realKv = {
      // Intentionally not a Vitest mock to test production caching behavior
      get: async (key: string) => {
        kvReadCount++;
        return 'custom_value';
      },
      put: async () => {},
      delete: async () => {},
    };

    // First read: cache miss -> calls kv.get
    const val1 = await getDynamicConfig(realKv, 'test_key');
    expect(val1).toBe('custom_value');
    expect(kvReadCount).toBe(1);

    // Second read: cache hit -> does NOT call kv.get
    const val2 = await getDynamicConfig(realKv, 'test_key');
    expect(val2).toBe('custom_value');
    expect(kvReadCount).toBe(1);

    // Third read: still cached
    const val3 = await getDynamicConfig(realKv, 'test_key');
    expect(val3).toBe('custom_value');
    expect(kvReadCount).toBe(1);
  });

  it('setDynamicConfig 应立即失效对应 key 的缓存', async () => {
    let currentStoreVal = 'initial_val';
    const realKv = {
      get: async () => currentStoreVal,
      put: async (_k: string, v: string) => {
        currentStoreVal = v;
      },
      delete: async () => {},
    };

    // 1. Initial read caches 'initial_val'
    expect(await getDynamicConfig(realKv, 'my_setting')).toBe('initial_val');

    // 2. Update via setDynamicConfig
    await setDynamicConfig(realKv, 'my_setting', 'updated_val');

    // 3. Immediate read should reflect 'updated_val' due to cache eviction
    expect(await getDynamicConfig(realKv, 'my_setting')).toBe('updated_val');
  });

  it('deleteDynamicConfig 应立即失效缓存', async () => {
    let currentStoreVal: string | null = 'some_val';
    const realKv = {
      get: async () => currentStoreVal,
      put: async () => {},
      delete: async () => {
        currentStoreVal = null;
      },
    };

    expect(await getDynamicConfig(realKv, 'my_setting')).toBe('some_val');
    await deleteDynamicConfig(realKv, 'my_setting');
    expect(await getDynamicConfig(realKv, 'my_setting')).toBeNull();
  });

  it('营销关键词库在 setMarketingKeywords 时应立即失效缓存', async () => {
    let rawKeywords = JSON.stringify(['promo', 'discount']);
    let readCount = 0;
    const realKv = {
      get: async () => {
        readCount++;
        return rawKeywords;
      },
      put: async (_k: string, v: string) => {
        rawKeywords = v;
      },
    };

    const kw1 = await getMarketingKeywords(realKv);
    expect(kw1).toEqual(['promo', 'discount']);
    expect(readCount).toBe(1);

    // Cache hit
    const kw2 = await getMarketingKeywords(realKv);
    expect(kw2).toEqual(['promo', 'discount']);
    expect(readCount).toBe(1);

    // Update keywords -> invalidates cache
    await setMarketingKeywords(realKv, ['promo', 'discount', 'newsletter']);

    // Next read should call underlying get
    const kw3 = await getMarketingKeywords(realKv);
    expect(kw3).toEqual(['promo', 'discount', 'newsletter']);
    expect(readCount).toBe(2);
  });
});
