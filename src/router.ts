/**
 * =============================================================================
 * Module: src/router.ts
 * Description: Product persona resolution, KV custom routing rules management,
 *              and dynamic marketing keywords storage.
 * =============================================================================
 */

import { extractDomain, extractCleanEmail, DEFAULT_MARKETING_KEYWORDS } from './sanitizer';
import type { PersonaCategory, PersonaRoute, AllowedTag, CustomRouteRule } from './types';
import {
  ALLOWED_TAGS,
  isValidTag,
  DEFAULT_PRESET_RULES,
  buildForwardEmail,
} from './config';
import type { RouteRule } from './config';

export {
  ALLOWED_TAGS,
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

// ======================== KV Dynamic Custom Rules ========================

const KV_ROUTE_PREFIX = 'route:';

export async function getCustomRule(kv: any, prefix: string): Promise<CustomRouteRule | null> {
  if (!kv) return null;
  const cleanPrefix = prefix.toLowerCase().trim();
  try {
    const raw = await kv.get(`${KV_ROUTE_PREFIX}${cleanPrefix}`);
    if (!raw) return null;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
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
}

export async function deleteCustomRule(kv: any, prefix: string): Promise<boolean> {
  if (!kv) throw new Error('KV storage is not available');
  const cleanPrefix = prefix.toLowerCase().trim();
  const existing = await getCustomRule(kv, cleanPrefix);
  if (!existing) return false;
  await kv.delete(`${KV_ROUTE_PREFIX}${cleanPrefix}`);
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
  try {
    const raw = await kv.get(MARKETING_KEYWORDS_KV_KEY);
    if (!raw) return [...DEFAULT_MARKETING_KEYWORDS];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((s) => String(s).trim()).filter(Boolean);
    }
    return [...DEFAULT_MARKETING_KEYWORDS];
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
    await kv.put(MARKETING_KEYWORDS_KV_KEY, JSON.stringify(cleanList));
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

  const merged = [...current, ...toAdd];
  const success = await setMarketingKeywords(kv, merged);
  return {
    success,
    totalCount: merged.length,
    addedCount: toAdd.length,
    allKeywords: merged,
  };
}

export async function resetMarketingKeywords(kv: any): Promise<boolean> {
  if (!kv) return false;
  try {
    if (typeof kv.delete === 'function') {
      await kv.delete(MARKETING_KEYWORDS_KV_KEY);
    }
    return true;
  } catch (err) {
    console.error('[EmailRouter] Failed to reset marketing keywords in KV:', err);
    return false;
  }
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
  try {
    const val = await kv.get(`${DYNAMIC_CONFIG_PREFIX}${key.toLowerCase().trim()}`);
    return val ? String(val).trim() : null;
  } catch (err) {
    console.error(`[EmailRouter] Error getting dynamic config for ${key}:`, err);
    return null;
  }
}

export async function setDynamicConfig(kv: any, key: string, value: string): Promise<boolean> {
  if (!kv || typeof kv.put !== 'function') return false;
  try {
    await kv.put(`${DYNAMIC_CONFIG_PREFIX}${key.toLowerCase().trim()}`, value.trim());
    return true;
  } catch (err) {
    console.error(`[EmailRouter] Error setting dynamic config for ${key}:`, err);
    return false;
  }
}

export async function deleteDynamicConfig(kv: any, key: string): Promise<boolean> {
  if (!kv || typeof kv.delete !== 'function') return false;
  try {
    await kv.delete(`${DYNAMIC_CONFIG_PREFIX}${key.toLowerCase().trim()}`);
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


