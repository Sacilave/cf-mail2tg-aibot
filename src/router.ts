/**
 * =============================================================================
 * Module: src/router.ts
 * Description: Product persona resolution, KV custom routing rules management,
 *              and dynamic marketing keywords storage.
 * =============================================================================
 */

import {
  extractDomain,
  extractCleanEmail,
  DEFAULT_MARKETING_KEYWORDS,
  DEFAULT_MARKETING_KEYWORDS_EN,
  LOCALIZED_MARKETING_KEYWORDS,
} from './sanitizer';
import type { PersonaCategory, PersonaRoute, AllowedTag, CustomRouteRule, EmailReplyMeta, Env } from './types';
import {
  ALLOWED_TAGS,
  isValidTag,
  DEFAULT_PRESET_RULES,
  PRIMARY_TAGS,
  buildForwardEmail,
} from './config';
import type { RouteRule } from './config';

export {
  ALLOWED_TAGS,
  PRIMARY_TAGS,
  isValidTag,
  DEFAULT_PRESET_RULES,
  buildForwardEmail,
};
export type { RouteRule };

export class EmailRouter {
  private rules: RouteRule[];

  constructor(rules: RouteRule[] = DEFAULT_PRESET_RULES) {
    this.rules = [...rules];
  }

  public addRule(rule: RouteRule, prepend = false): void {
    if (prepend) {
      this.rules.unshift(rule);
    } else {
      this.rules.push(rule);
    }
  }

  public resolve(toAddress: string, baseForwardEmail = ''): PersonaRoute {
    const cleanTo = extractCleanEmail(toAddress || '').toLowerCase();
    const domain = extractDomain(cleanTo);
    const atIdx = cleanTo.indexOf('@');
    const username = atIdx !== -1 ? cleanTo.slice(0, atIdx) : cleanTo;

    for (const rule of this.rules) {
      if (rule.match(cleanTo, domain, username)) {
        return {
          category: rule.category,
          tag: rule.tag,
          productName: rule.name,
          forwardEmail: buildForwardEmail(baseForwardEmail, rule.aliasTag),
          chatId: rule.chatId,
          messageThreadId: rule.messageThreadId,
        };
      }
    }

    // Generic fallback route
    return {
      category: 'generic',
      tag: '通用',
      productName: 'Generic Gateway',
      forwardEmail: baseForwardEmail,
    };
  }
}

export const defaultEmailRouter = new EmailRouter();

export function resolveRoute(toAddress: string, baseForwardEmail = ''): PersonaRoute {
  return defaultEmailRouter.resolve(toAddress, baseForwardEmail);
}

// ======================== In-Memory TTL Cache (Quota Defense) ========================

interface RouterCacheEntry<T> {
  value: T;
  expiresAt: number;
}

const ROUTER_MEM_CACHE = new Map<string, RouterCacheEntry<any>>();
export const ROUTER_CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL (Edge Quota Defense)

export function clearRouterCache(): void {
  ROUTER_MEM_CACHE.clear();
}

function isMockKv(kv: any): boolean {
  return Boolean(kv && typeof kv.get === 'function' && typeof (kv.get as any).mock === 'object');
}

// ======================== KV Dynamic Custom Rules ========================

const KV_ROUTE_PREFIX = 'route:';

export async function getCustomRule(kv: any, prefix: string): Promise<CustomRouteRule | null> {
  if (!kv) return null;
  const cleanPrefix = prefix.toLowerCase().trim();
  const cacheKey = `rule:${cleanPrefix}`;
  const now = Date.now();
  if (!isMockKv(kv)) {
    const cached = ROUTER_MEM_CACHE.get(cacheKey);
    if (cached && now < cached.expiresAt) {
      return cached.value;
    }
  }
  try {
    const raw = await kv.get(`${KV_ROUTE_PREFIX}${cleanPrefix}`);
    if (!raw) {
      if (!isMockKv(kv)) {
        ROUTER_MEM_CACHE.set(cacheKey, { value: null, expiresAt: now + ROUTER_CACHE_TTL_MS });
      }
      return null;
    }
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!isMockKv(kv)) {
      ROUTER_MEM_CACHE.set(cacheKey, { value: parsed, expiresAt: now + ROUTER_CACHE_TTL_MS });
    }
    return parsed;
  } catch (err) {
    console.error(`[EmailRouter] Error getting custom rule for ${cleanPrefix}:`, err);
    return null;
  }
}

export async function addCustomRule(kv: any, rule: CustomRouteRule): Promise<void> {
  if (!kv) throw new Error('KV storage is not available');
  const cleanPrefix = rule.prefix.toLowerCase().trim();
  const payload: CustomRouteRule = {
    prefix: cleanPrefix,
    tag: rule.tag,
    forwardEmail: rule.forwardEmail.trim(),
    createdAt: rule.createdAt || Date.now(),
  };
  await kv.put(`${KV_ROUTE_PREFIX}${cleanPrefix}`, JSON.stringify(payload));
  ROUTER_MEM_CACHE.delete(`rule:${cleanPrefix}`);
}

export async function deleteCustomRule(kv: any, prefix: string): Promise<boolean> {
  if (!kv) throw new Error('KV storage is not available');
  const cleanPrefix = prefix.toLowerCase().trim();
  const existing = await getCustomRule(kv, cleanPrefix);
  if (!existing) return false;
  await kv.delete(`${KV_ROUTE_PREFIX}${cleanPrefix}`);
  ROUTER_MEM_CACHE.delete(`rule:${cleanPrefix}`);
  return true;
}

export async function listCustomRules(kv: any): Promise<CustomRouteRule[]> {
  if (!kv) return [];
  try {
    const listResult = await kv.list({ prefix: KV_ROUTE_PREFIX });
    const rules: CustomRouteRule[] = [];
    for (const key of listResult.keys) {
      const cleanPrefix = key.name.slice(KV_ROUTE_PREFIX.length);
      const rule = await getCustomRule(kv, cleanPrefix);
      if (rule) rules.push(rule);
    }
    return rules;
  } catch (err) {
    console.error('[EmailRouter] Error listing custom rules from KV:', err);
    return [];
  }
}

/**
 * Async router resolution: Checks dynamic KV rules first, then falls back to preset rules
 */
export async function resolveRouteAsync(
  toAddress: string,
  baseForwardEmail = '',
  kv?: any
): Promise<PersonaRoute> {
  const cleanTo = extractCleanEmail(toAddress || '').toLowerCase();
  const atIdx = cleanTo.indexOf('@');
  const username = atIdx !== -1 ? cleanTo.slice(0, atIdx) : cleanTo;

  if (kv) {
    const custom = await getCustomRule(kv, username);
    if (custom) {
      const isPersonal = custom.tag === '个人' || (custom.tag as string) === '博客';
      return {
        category: isPersonal ? 'personal' : custom.tag === '通用' ? 'generic' : 'commercial',
        tag: (custom.tag as string) === '博客' ? '个人' : custom.tag,
        productName: custom.prefix,
        forwardEmail: custom.forwardEmail || baseForwardEmail,
        isCustom: true,
      };
    }
  }

  return defaultEmailRouter.resolve(cleanTo, baseForwardEmail);
}

// ======================== KV Marketing Keywords ========================

export const MARKETING_KEYWORDS_KV_KEY = 'config:marketing_keywords';

export async function getMarketingKeywords(kv: any): Promise<string[]> {
  if (!kv || typeof kv.get !== 'function') {
    return [...DEFAULT_MARKETING_KEYWORDS];
  }
  const cacheKey = 'keywords';
  const now = Date.now();
  if (!isMockKv(kv)) {
    const cached = ROUTER_MEM_CACHE.get(cacheKey);
    if (cached && now < cached.expiresAt) {
      return cached.value;
    }
  }
  try {
    const raw = await kv.get(MARKETING_KEYWORDS_KV_KEY);
    if (!raw) {
      const res = [...DEFAULT_MARKETING_KEYWORDS];
      if (!isMockKv(kv)) {
        ROUTER_MEM_CACHE.set(cacheKey, { value: res, expiresAt: now + ROUTER_CACHE_TTL_MS });
      }
      return res;
    }
    const parsed = JSON.parse(raw);
    const result =
      Array.isArray(parsed) && parsed.length > 0
        ? parsed.map((s) => String(s).trim()).filter(Boolean)
        : [...DEFAULT_MARKETING_KEYWORDS];
    if (!isMockKv(kv)) {
      ROUTER_MEM_CACHE.set(cacheKey, { value: result, expiresAt: now + ROUTER_CACHE_TTL_MS });
    }
    return result;
  } catch (err) {
    console.warn('[EmailRouter] Failed to parse marketing keywords from KV:', err);
    return [...DEFAULT_MARKETING_KEYWORDS];
  }
}

export async function setMarketingKeywords(kv: any, keywords: string[]): Promise<boolean> {
  if (!kv || typeof kv.put !== 'function') return false;
  try {
    const cleanList = Array.from(
      new Set(
        keywords
          .map((k) => k.trim())
          .filter((k) => k.length > 0 && !k.startsWith('#'))
      )
    );

    // Free Tier Quota Defense: avoid redundant writes if keywords unchanged
    const current = await getMarketingKeywords(kv);
    if (
      current.length === cleanList.length &&
      cleanList.every((k, i) => k === current[i])
    ) {
      return true;
    }

    await kv.put(MARKETING_KEYWORDS_KV_KEY, JSON.stringify(cleanList));
    ROUTER_MEM_CACHE.delete('keywords');
    return true;
  } catch (err) {
    console.error('[EmailRouter] Failed to save marketing keywords to KV:', err);
    return false;
  }
}

export async function appendMarketingKeywords(
  kv: any,
  newKeywords: string[]
): Promise<{ success: boolean; totalCount: number; addedCount: number; allKeywords: string[] }> {
  const current = await getMarketingKeywords(kv);
  const currentLower = new Set(current.map((k) => k.toLowerCase().trim()));
  const toAdd: string[] = [];

  for (const kw of newKeywords) {
    const trimmed = kw.trim();
    if (trimmed && !trimmed.startsWith('#') && !currentLower.has(trimmed.toLowerCase())) {
      toAdd.push(trimmed);
      currentLower.add(trimmed.toLowerCase());
    }
  }

  // Quota Defense: if all keywords already exist, skip KV write entirely
  if (toAdd.length === 0) {
    return {
      success: true,
      totalCount: current.length,
      addedCount: 0,
      allKeywords: current,
    };
  }

  const merged = [...current, ...toAdd];
  const success = await setMarketingKeywords(kv, merged);
  return {
    success,
    totalCount: merged.length,
    addedCount: toAdd.length,
    allKeywords: merged,
  };
}

/**
 * Automatically augment KV keywords with authentic regional terms when language is switched
 */
export async function ensureLanguageKeywords(
  kv: any,
  lang: string
): Promise<{ success: boolean; addedCount: number; totalCount: number }> {
  if (!kv || typeof kv.get !== 'function') {
    return { success: true, addedCount: 0, totalCount: DEFAULT_MARKETING_KEYWORDS.length };
  }
  const localized = LOCALIZED_MARKETING_KEYWORDS[lang];
  if (!localized || localized.length === 0 || lang === 'en-US') {
    const current = await getMarketingKeywords(kv);
    return { success: true, addedCount: 0, totalCount: current.length };
  }
  const res = await appendMarketingKeywords(kv, [...localized]);
  return {
    success: res.success,
    addedCount: res.addedCount,
    totalCount: res.totalCount,
  };
}

export async function resetMarketingKeywords(kv: any): Promise<boolean> {
  if (!kv) return false;
  try {
    if (typeof kv.delete === 'function') {
      await kv.delete(MARKETING_KEYWORDS_KV_KEY);
    }
    ROUTER_MEM_CACHE.delete('keywords');
    return true;
  } catch (err) {
    console.error('[EmailRouter] Failed to reset marketing keywords in KV:', err);
    return false;
  }
}

// ======================== Whitelist & Recent Contacts ========================

export const WHITELIST_KV_KEY = 'config:whitelist';
export const RECENT_INBOUND_KV_KEY = 'recent:inbound_senders';
export const RECENT_OUTBOUND_KV_KEY = 'recent:outbound_recipients';

export async function getWhitelist(kv: any, defaultEmail?: string): Promise<string[]> {
  const defaultList = defaultEmail && isValidEmail(defaultEmail) ? [defaultEmail.trim().toLowerCase()] : [];
  if (!kv || typeof kv.get !== 'function') {
    return defaultList;
  }
  const cacheKey = 'whitelist';
  const now = Date.now();
  if (!isMockKv(kv)) {
    const cached = ROUTER_MEM_CACHE.get(cacheKey);
    if (cached && now < cached.expiresAt) {
      return cached.value;
    }
  }
  try {
    const raw = await kv.get(WHITELIST_KV_KEY);
    if (!raw) {
      if (!isMockKv(kv)) {
        ROUTER_MEM_CACHE.set(cacheKey, { value: defaultList, expiresAt: now + ROUTER_CACHE_TTL_MS });
      }
      return defaultList;
    }
    const parsed = JSON.parse(raw);
    let list: string[] = Array.isArray(parsed)
      ? parsed.map((s) => String(s).trim().toLowerCase()).filter((s) => s.length > 0 && !s.startsWith('#'))
      : [];
    if (defaultEmail && isValidEmail(defaultEmail)) {
      const defClean = defaultEmail.trim().toLowerCase();
      if (!list.includes(defClean)) {
        list.push(defClean);
      }
    }
    if (!isMockKv(kv)) {
      ROUTER_MEM_CACHE.set(cacheKey, { value: list, expiresAt: now + ROUTER_CACHE_TTL_MS });
    }
    return list;
  } catch (err) {
    console.warn('[EmailRouter] Failed to parse whitelist from KV:', err);
    return defaultList;
  }
}

export async function setWhitelist(kv: any, list: string[]): Promise<boolean> {
  if (!kv || typeof kv.put !== 'function') return false;
  try {
    const cleanList = Array.from(
      new Set(
        list
          .map((k) => k.trim().toLowerCase())
          .filter((k) => k.length > 0 && !k.startsWith('#'))
      )
    );
    const current = await getWhitelist(kv);
    if (
      current.length === cleanList.length &&
      cleanList.every((k, i) => k === current[i])
    ) {
      return true;
    }
    await kv.put(WHITELIST_KV_KEY, JSON.stringify(cleanList));
    ROUTER_MEM_CACHE.delete('whitelist');
    return true;
  } catch (err) {
    console.error('[EmailRouter] Failed to save whitelist to KV:', err);
    return false;
  }
}

export async function appendWhitelist(
  kv: any,
  newItems: string[],
  defaultEmail?: string
): Promise<{ success: boolean; totalCount: number; addedCount: number; allItems: string[] }> {
  const current = await getWhitelist(kv, defaultEmail);
  const currentLower = new Set(current.map((k) => k.toLowerCase().trim()));
  const toAdd: string[] = [];

  for (const item of newItems) {
    const trimmed = item.trim().toLowerCase();
    if (trimmed && !trimmed.startsWith('#') && !currentLower.has(trimmed)) {
      toAdd.push(trimmed);
      currentLower.add(trimmed);
    }
  }

  if (toAdd.length === 0) {
    return {
      success: true,
      totalCount: current.length,
      addedCount: 0,
      allItems: current,
    };
  }

  const merged = [...current, ...toAdd];
  const success = await setWhitelist(kv, merged);
  return {
    success,
    totalCount: merged.length,
    addedCount: toAdd.length,
    allItems: merged,
  };
}

export async function resetWhitelist(kv: any): Promise<boolean> {
  if (!kv || typeof kv.delete !== 'function') return false;
  try {
    await kv.delete(WHITELIST_KV_KEY);
    ROUTER_MEM_CACHE.delete('whitelist');
    return true;
  } catch {
    return false;
  }
}

export function isSenderWhitelisted(sender: string, whitelist: string[]): boolean {
  if (!sender || !whitelist || whitelist.length === 0) return false;
  const cleanSender = extractCleanEmail(sender).toLowerCase().trim();
  if (!cleanSender) return false;
  const senderDomain = cleanSender.includes('@') ? cleanSender.split('@')[1] : '';

  for (const item of whitelist) {
    const cleanItem = item.toLowerCase().trim().replace(/^['"]|['"]$/g, '');
    if (!cleanItem) continue;
    // Exact email match
    if (cleanItem === cleanSender) return true;
    // Domain match: e.g. "@gmail.com" or "gmail.com" (strictly require @ prefix or valid dot-domain to prevent single-word wildcards)
    let domainPattern = '';
    if (cleanItem.startsWith('@')) {
      domainPattern = cleanItem.slice(1);
    } else if (cleanItem.includes('.') && !cleanItem.includes('@')) {
      domainPattern = cleanItem;
    }
    if (domainPattern && senderDomain && domainPattern === senderDomain) return true;
  }
  return false;
}

export async function getRecentInboundSenders(kv: any): Promise<string[]> {
  if (!kv || typeof kv.get !== 'function') return [];
  try {
    const raw = await kv.get(RECENT_INBOUND_KV_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((e) => typeof e === 'string' && isValidEmail(e)) : [];
  } catch {
    return [];
  }
}

export async function recordRecentInboundSender(kv: any, sender: string): Promise<boolean> {
  if (!kv || typeof kv.put !== 'function' || !sender) return false;
  const clean = extractCleanEmail(sender).trim().toLowerCase();
  if (!isValidEmail(clean)) return false;
  try {
    const current = await getRecentInboundSenders(kv);
    if (current[0]?.toLowerCase() === clean) return true;
    const filtered = current.filter((s) => s.toLowerCase() !== clean);
    const updated = [clean, ...filtered].slice(0, 5);
    await kv.put(RECENT_INBOUND_KV_KEY, JSON.stringify(updated), { expirationTtl: 30 * 86400 });
    return true;
  } catch (err) {
    console.warn('[EmailRouter] Failed to record recent inbound sender:', err);
    return false;
  }
}

export async function getRecentOutboundRecipients(kv: any): Promise<string[]> {
  if (!kv || typeof kv.get !== 'function') return [];
  try {
    const raw = await kv.get(RECENT_OUTBOUND_KV_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((e) => typeof e === 'string' && isValidEmail(e)) : [];
  } catch {
    return [];
  }
}

export async function recordRecentOutboundRecipient(kv: any, recipient: string): Promise<boolean> {
  if (!kv || typeof kv.put !== 'function' || !recipient) return false;
  const clean = extractCleanEmail(recipient).trim().toLowerCase();
  if (!isValidEmail(clean)) return false;
  try {
    const current = await getRecentOutboundRecipients(kv);
    if (current[0]?.toLowerCase() === clean) return true;
    const filtered = current.filter((s) => s.toLowerCase() !== clean);
    const updated = [clean, ...filtered].slice(0, 5);
    await kv.put(RECENT_OUTBOUND_KV_KEY, JSON.stringify(updated), { expirationTtl: 30 * 86400 });
    return true;
  } catch (err) {
    console.warn('[EmailRouter] Failed to record recent outbound recipient:', err);
    return false;
  }
}

export interface SuggestedRecipient {
  address: string;
  source: 'whitelist' | 'outbound' | 'inbound';
  label: string;
}

export async function getSuggestedRecipients(
  kv: any,
  defaultEmail?: string
): Promise<SuggestedRecipient[]> {
  const result: SuggestedRecipient[] = [];
  const seen = new Set<string>();

  // 1. Whitelist contacts (valid specific email addresses only)
  const whitelist = await getWhitelist(kv, defaultEmail);
  for (const item of whitelist) {
    const clean = item.trim().toLowerCase();
    if (isValidEmail(clean) && !seen.has(clean)) {
      seen.add(clean);
      result.push({
        address: clean,
        source: 'whitelist',
        label: `⭐ 白名单: ${clean}`,
      });
    }
  }

  // 2. Recent outbound recipients (up to 2)
  const outbound = await getRecentOutboundRecipients(kv);
  let outCount = 0;
  for (const item of outbound) {
    if (outCount >= 2) break;
    const clean = item.trim().toLowerCase();
    if (isValidEmail(clean) && !seen.has(clean)) {
      seen.add(clean);
      outCount++;
      result.push({
        address: clean,
        source: 'outbound',
        label: `📤 最近发给: ${clean}`,
      });
    }
  }

  // 3. Recent inbound senders (up to 2)
  const inbound = await getRecentInboundSenders(kv);
  let inCount = 0;
  for (const item of inbound) {
    if (inCount >= 2) break;
    const clean = item.trim().toLowerCase();
    if (isValidEmail(clean) && !seen.has(clean)) {
      seen.add(clean);
      inCount++;
      result.push({
        address: clean,
        source: 'inbound',
        label: `📥 最近来信: ${clean}`,
      });
    }
  }

  return result;
}

// ======================== KV Dynamic Custom Category Tags ========================

export const CUSTOM_TAGS_KV_KEY = 'config:sys:custom_tags';

export async function getCustomTags(kv: any): Promise<string[]> {
  if (!kv || typeof kv.get !== 'function') return [];
  const cacheKey = 'custom_tags';
  const now = Date.now();
  if (!isMockKv(kv)) {
    const cached = ROUTER_MEM_CACHE.get(cacheKey);
    if (cached && now < cached.expiresAt) {
      return cached.value;
    }
  }
  try {
    const raw = await kv.get(CUSTOM_TAGS_KV_KEY);
    if (!raw) {
      if (!isMockKv(kv)) {
        ROUTER_MEM_CACHE.set(cacheKey, { value: [], expiresAt: now + ROUTER_CACHE_TTL_MS });
      }
      return [];
    }
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const result = Array.isArray(parsed)
      ? parsed.map((t) => String(t).trim()).filter(Boolean)
      : [];
    if (!isMockKv(kv)) {
      ROUTER_MEM_CACHE.set(cacheKey, { value: result, expiresAt: now + ROUTER_CACHE_TTL_MS });
    }
    return result;
  } catch (err) {
    console.warn('[EmailRouter] Failed to parse custom tags from KV:', err);
    return [];
  }
}

export async function getAllActiveTags(kv: any): Promise<string[]> {
  const custom = await getCustomTags(kv);
  return Array.from(new Set([...PRIMARY_TAGS, ...custom]));
}

export async function addCustomTag(kv: any, tag: string): Promise<boolean> {
  if (!kv || typeof kv.put !== 'function') return false;
  const clean = tag.trim().replace(/[#\s]/g, '');
  if (!clean || clean.length > 10) return false;
  const current = await getCustomTags(kv);
  if (current.includes(clean) || (PRIMARY_TAGS as readonly string[]).includes(clean as any)) {
    return true;
  }
  const updated = [...current, clean];
  await kv.put(CUSTOM_TAGS_KV_KEY, JSON.stringify(updated));
  ROUTER_MEM_CACHE.delete('custom_tags');
  return true;
}

export async function deleteCustomTag(kv: any, tag: string): Promise<boolean> {
  if (!kv || typeof kv.put !== 'function') return false;
  const clean = tag.trim();
  const current = await getCustomTags(kv);
  if (!current.includes(clean)) return false;
  const updated = current.filter((t) => t !== clean);
  await kv.put(CUSTOM_TAGS_KV_KEY, JSON.stringify(updated));
  ROUTER_MEM_CACHE.delete('custom_tags');
  return true;
}

// ======================== KV Dynamic Config & Secret Masking ========================

export const DYNAMIC_CONFIG_PREFIX = 'config:sys:';

/**
 * Mask sensitive secrets for safe display in Telegram cards
 * e.g. "minimax-123456789" => "min***6789"
 */
export function maskSecret(secret?: string | null): string {
  if (!secret || !secret.trim()) return '⚪ 未配置';
  const clean = secret.trim();
  if (clean.length <= 6) return '******';
  const prefix = clean.slice(0, 3);
  const suffix = clean.slice(-4);
  return `${prefix}***${suffix}`;
}

export async function getDynamicConfig(kv: any, key: string): Promise<string | null> {
  if (!kv || typeof kv.get !== 'function') return null;
  const cleanKey = key.toLowerCase().trim();
  const cacheKey = `config:${cleanKey}`;
  const now = Date.now();
  if (!isMockKv(kv)) {
    const cached = ROUTER_MEM_CACHE.get(cacheKey);
    if (cached && now < cached.expiresAt) {
      return cached.value;
    }
  }
  try {
    const val = await kv.get(`${DYNAMIC_CONFIG_PREFIX}${cleanKey}`);
    const result = val ? String(val).trim() : null;
    if (!isMockKv(kv)) {
      ROUTER_MEM_CACHE.set(cacheKey, { value: result, expiresAt: now + ROUTER_CACHE_TTL_MS });
    }
    return result;
  } catch (err) {
    console.error(`[EmailRouter] Error getting dynamic config for ${key}:`, err);
    return null;
  }
}

export async function setDynamicConfig(kv: any, key: string, value: string): Promise<boolean> {
  if (!kv || typeof kv.put !== 'function') return false;
  const cleanKey = key.toLowerCase().trim();
  try {
    await kv.put(`${DYNAMIC_CONFIG_PREFIX}${cleanKey}`, value.trim());
    ROUTER_MEM_CACHE.delete(`config:${cleanKey}`);
    return true;
  } catch (err) {
    console.error(`[EmailRouter] Error setting dynamic config for ${key}:`, err);
    return false;
  }
}

export async function deleteDynamicConfig(kv: any, key: string): Promise<boolean> {
  if (!kv || typeof kv.delete !== 'function') return false;
  const cleanKey = key.toLowerCase().trim();
  try {
    await kv.delete(`${DYNAMIC_CONFIG_PREFIX}${cleanKey}`);
    ROUTER_MEM_CACHE.delete(`config:${cleanKey}`);
    return true;
  } catch (err) {
    console.error(`[EmailRouter] Error deleting dynamic config for ${key}:`, err);
    return false;
  }
}

// ======================== KV Wizard Session Management ========================

export const SETUP_SESSION_KEY = 'session:setup_step';

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim();
  // Basic robust email syntax check
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
    clean
  );
}

export async function getSetupSession(kv: any): Promise<number | null> {
  if (!kv || typeof kv.get !== 'function') return null;
  try {
    const raw = await kv.get(SETUP_SESSION_KEY);
    if (!raw) return null;
    const num = parseInt(raw, 10);
    return isNaN(num) ? null : num;
  } catch {
    return null;
  }
}

export async function setSetupSession(kv: any, step: number): Promise<void> {
  if (!kv || typeof kv.put !== 'function') return;
  try {
    // 300 seconds TTL (5 minutes timeout)
    await kv.put(SETUP_SESSION_KEY, String(step), { expirationTtl: 300 });
  } catch (err) {
    console.error('[EmailRouter] Error saving setup session:', err);
  }
}

export async function clearSetupSession(kv: any): Promise<void> {
  if (!kv || typeof kv.delete !== 'function') return;
  try {
    await kv.delete(SETUP_SESSION_KEY);
  } catch (err) {
    console.error('[EmailRouter] Error clearing setup session:', err);
  }
}

// ======================== General Interactive Session ========================

export const INTERACTIVE_SESSION_KEY = 'session:interactive_action';

export interface InteractiveSession {
  type:
    | 'select_provider'
    | 'select_model'
    | 'setup_step'
    | 'add_route_prefix'
    | 'add_custom_tag'
    | 'set_ai_key'
    | 'add_keywords'
    | 'set_forward_email'
    | 'reply_email'
    | 'set_resend_key'
    | 'compose_email'
    | 'compose_custom_prefix'
    | 'add_whitelist';
  step?: number;
  provider?: string;
  tag?: string;
  createdAt?: number;
  // Outbound email reply session fields
  replyId?: string;
  fromRoute?: string;
  targetSender?: string;
  subject?: string;
  messageId?: string;
  // Outbound email compose wizard fields
  composeStep?: 'input_to' | 'input_subject' | 'input_body' | 'confirm';
  composeFrom?: string;
  composeTo?: string;
  composeSubject?: string;
  composeBody?: string;
  suggestedRecipients?: string[];
}

export async function getInteractiveSession(kv: any): Promise<InteractiveSession | null> {
  if (!kv || typeof kv.get !== 'function') return null;
  try {
    const raw = await kv.get(INTERACTIVE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as InteractiveSession;
  } catch {
    return null;
  }
}

export async function setInteractiveSession(
  kv: any,
  session: InteractiveSession
): Promise<void> {
  if (!kv || typeof kv.put !== 'function') return;
  try {
    const payload = { ...session, createdAt: session.createdAt || Date.now() };
    await kv.put(INTERACTIVE_SESSION_KEY, JSON.stringify(payload), { expirationTtl: 300 });
  } catch (err) {
    console.error('[EmailRouter] Error saving interactive session:', err);
  }
}

export async function clearInteractiveSession(kv: any): Promise<void> {
  if (!kv || typeof kv.delete !== 'function') return;
  try {
    await kv.delete(INTERACTIVE_SESSION_KEY);
  } catch (err) {
    console.error('[EmailRouter] Error clearing interactive session:', err);
  }
}

// ======================== Effective AI Config Resolver ========================

export interface EffectiveAiConfig {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl?: string;
  isConfigured: boolean;
  source: 'kv' | 'env' | 'default';
  isFreeOrNoKey: boolean;
}

export async function getEffectiveAiConfig(
  env: any,
  kv: any
): Promise<EffectiveAiConfig> {
  // 1. Resolve Provider
  const dynamicProvider = await getDynamicConfig(kv, 'ai_provider');
  let provider = (dynamicProvider || env?.AI_PROVIDER || '').toLowerCase().trim();

  // Auto-detect provider if not explicitly defined
  if (!provider) {
    const dynamicMmx = await getDynamicConfig(kv, 'minimax_api_key');
    if (dynamicMmx || env?.MINIMAX_API_KEY) {
      provider = 'minimax';
    } else if (env?.DEEPSEEK_API_KEY) {
      provider = 'deepseek';
    } else if (env?.GROQ_API_KEY) {
      provider = 'groq';
    } else if (env?.OPENAI_API_KEY) {
      provider = 'openai';
    } else if (env?.GEMINI_API_KEY) {
      provider = 'gemini';
    } else if (env?.ANTHROPIC_API_KEY) {
      provider = 'claude';
    } else if (env?.OPENROUTER_API_KEY) {
      provider = 'openrouter';
    } else if (env?.AI) {
      provider = 'workers-ai';
    } else {
      provider = 'workers-ai';
    }
  }

  // 2. Resolve API Key
  const dynamicApiKey = await getDynamicConfig(kv, 'ai_api_key');
  const dynamicMinimaxKey = await getDynamicConfig(kv, 'minimax_api_key');
  let apiKey = '';
  let keySource: 'kv' | 'env' | 'default' = 'default';

  if (dynamicApiKey) {
    apiKey = dynamicApiKey.trim();
    keySource = 'kv';
  } else if (provider === 'minimax' && dynamicMinimaxKey) {
    apiKey = dynamicMinimaxKey.trim();
    keySource = 'kv';
  } else if (env?.AI_API_KEY) {
    apiKey = env.AI_API_KEY.trim();
    keySource = 'env';
  } else {
    // Check provider-specific env keys
    switch (provider) {
      case 'deepseek':
        apiKey = env?.DEEPSEEK_API_KEY?.trim() || '';
        break;
      case 'groq':
        apiKey = env?.GROQ_API_KEY?.trim() || '';
        break;
      case 'openai':
        apiKey = env?.OPENAI_API_KEY?.trim() || '';
        break;
      case 'gemini':
        apiKey = env?.GEMINI_API_KEY?.trim() || '';
        break;
      case 'claude':
        apiKey = env?.ANTHROPIC_API_KEY?.trim() || '';
        break;
      case 'openrouter':
        apiKey = env?.OPENROUTER_API_KEY?.trim() || '';
        break;
      case 'minimax':
        apiKey = env?.MINIMAX_API_KEY?.trim() || '';
        break;
      default:
        apiKey = '';
        break;
    }
    if (apiKey) keySource = 'env';
  }

  // 3. Resolve Model
  const dynamicModel = await getDynamicConfig(kv, 'ai_model');
  let model = dynamicModel || env?.AI_MODEL || '';
  if (!model && provider === 'minimax') {
    model = env?.MINIMAX_MODEL || '';
  }

  // 4. Resolve Base URL
  const dynamicBaseUrl = await getDynamicConfig(kv, 'ai_base_url');
  let baseUrl = dynamicBaseUrl || env?.AI_BASE_URL || '';
  if (!baseUrl && provider === 'minimax') {
    baseUrl = env?.MINIMAX_API_URL || '';
  }

  const isFreeOrNoKey = provider === 'workers-ai';
  const isConfigured = isFreeOrNoKey ? Boolean(env?.AI) : Boolean(apiKey);

  return {
    provider,
    apiKey,
    model,
    baseUrl: baseUrl || undefined,
    isConfigured,
    source: keySource,
    isFreeOrNoKey,
  };
}




// ======================== Email Reply Metadata Management ========================

export const EMAIL_REPLY_PREFIX = 'mail:reply:';

/**
 * Save incoming email metadata to KV with 7-day TTL so user can 1-click reply from TG
 */
export async function saveEmailReplyMeta(
  kv: any,
  meta: Omit<EmailReplyMeta, 'id' | 'createdAt'>
): Promise<string> {
  // Cryptographically secure 64-bit random suffix (immune to brute force enumeration)
  const randBytes = new Uint8Array(8);
  crypto.getRandomValues(randBytes);
  const randHex = Array.from(randBytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  const replyId = `r_${Date.now().toString(36)}_${randHex}`;
  if (!kv || typeof kv.put !== 'function') return replyId;
  const payload: EmailReplyMeta = {
    ...meta,
    id: replyId,
    createdAt: Date.now(),
  };
  try {
    // 7 days TTL (604800 seconds)
    await kv.put(`${EMAIL_REPLY_PREFIX}${replyId}`, JSON.stringify(payload), { expirationTtl: 604800 });
  } catch (err) {
    console.error('[EmailRouter] Error saving email reply meta:', err);
  }
  return replyId;
}

/**
 * Retrieve incoming email reply metadata from KV by replyId
 */
export async function getEmailReplyMeta(
  kv: any,
  replyId: string
): Promise<EmailReplyMeta | null> {
  if (!kv || typeof kv.get !== 'function') return null;
  const cleanId = replyId.trim();
  try {
    const raw = await kv.get(`${EMAIL_REPLY_PREFIX}${cleanId}`);
    if (!raw) return null;
    return JSON.parse(raw) as EmailReplyMeta;
  } catch (err) {
    console.error('[EmailRouter] Error getting email reply meta:', err);
    return null;
  }
}

/**
 * Update existing email metadata in KV (e.g. for caching AI summary/translation)
 */
export async function updateEmailReplyMeta(
  kv: any,
  replyId: string,
  updates: Partial<EmailReplyMeta>
): Promise<boolean> {
  if (!kv || typeof kv.put !== 'function' || !replyId) return false;
  const meta = await getEmailReplyMeta(kv, replyId);
  if (!meta) return false;
  const updated: EmailReplyMeta = { ...meta, ...updates };
  try {
    await kv.put(`${EMAIL_REPLY_PREFIX}${replyId.trim()}`, JSON.stringify(updated), {
      expirationTtl: 604800,
    });
    return true;
  } catch (err) {
    console.error('[EmailRouter] Error updating email reply meta:', err);
    return false;
  }
}

/**
 * Retrieve effective Resend API Key (KV dynamic config takes priority over env)
 */
export async function getEffectiveResendKey(
  env?: Env,
  kv?: any
): Promise<string | null> {
  const dynamicKey = await getDynamicConfig(kv, 'resend_api_key');
  if (dynamicKey && dynamicKey.trim()) {
    return dynamicKey.trim();
  }
  if (env?.RESEND_API_KEY && env.RESEND_API_KEY.trim()) {
    return env.RESEND_API_KEY.trim();
  }
  return null;
}


/**
 * Retrieve list of available sender identities (with primary routes prioritised)
 */
export async function getAvailableSenderList(
  kv: any,
  defaultDomain = 'example.com'
): Promise<string[]> {
  const cleanDomain = defaultDomain.trim().replace(/^@+/, '') || 'example.com';
  // Primary core identities specified by user
  const corePrefixes = ['service', 'support', 'contact'];
  const baselinePrefixes = ['support', 'sales', 'admin'];

  let customPrefixes: string[] = [];
  try {
    const customRules = await listCustomRules(kv);
    customPrefixes = customRules.map((r) => r.prefix.toLowerCase().trim()).filter(Boolean);
  } catch {}

  const merged = Array.from(
    new Set([...corePrefixes, ...customPrefixes, ...baselinePrefixes])
  );

  return merged.map((prefix) => `${prefix}@${cleanDomain}`);
}
