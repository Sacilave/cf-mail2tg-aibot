/**
 * =============================================================================
 * Module: src/config.ts
 * Description: Universal product personas, baseline routing rules, and config helpers.
 *              Completely decoupled from any personal domain or private email.
 * =============================================================================
 */

import { ALLOWED_TAGS } from './types';
import type { PersonaCategory, AllowedTag } from './types';

export { ALLOWED_TAGS };

/** Primary tags displayed in quick-select buttons */
export const PRIMARY_TAGS: readonly AllowedTag[] = [
  '个人',
  '客服',
  '商务',
  '产品',
  '通用',
] as const;

export function isValidTag(tag: string, customTags?: string[]): boolean {
  if ((ALLOWED_TAGS as readonly string[]).includes(tag)) return true;
  if (customTags && customTags.includes(tag)) return true;
  return false;
}

export interface RouteRule {
  id: string;
  name: string;
  category: PersonaCategory;
  tag: AllowedTag | string;
  aliasTag?: string;
  chatId?: string;
  messageThreadId?: number;
  match: (toAddress: string, domain: string, username: string) => boolean;
}

/**
 * Universal baseline routing rules template
 * Custom rules can be added dynamically via Telegram Bot commands or Cloudflare KV.
 */
export const DEFAULT_PRESET_RULES: RouteRule[] = [
  // 1. Personal persona
  {
    id: 'persona-personal',
    name: 'Personal Inbox',
    category: 'personal',
    tag: '个人',
    aliasTag: 'personal',
    match: (_, __, username) => {
      const personalPrefixes = ['admin', 'me', 'i', 'hi', 'hello', 'personal', 'blog', 'owner'];
      return personalPrefixes.includes(username);
    },
  },

  // 2. Customer support persona
  {
    id: 'persona-support',
    name: 'Customer Support',
    category: 'commercial',
    tag: '客服',
    aliasTag: 'support',
    match: (_, __, username) => {
      const supportPrefixes = ['support', 'help', 'service', 'cs'];
      return supportPrefixes.includes(username);
    },
  },

  // 3. Business & Sales persona
  {
    id: 'persona-business',
    name: 'Business & Sales',
    category: 'commercial',
    tag: '商务',
    aliasTag: 'business',
    match: (_, __, username) => {
      const businessPrefixes = ['sales', 'billing', 'business', 'bd', 'cooperation'];
      return businessPrefixes.includes(username);
    },
  },

  // 4. Product & Feedback persona
  {
    id: 'persona-product',
    name: 'Product & Feedback',
    category: 'commercial',
    tag: '产品',
    aliasTag: 'product',
    match: (_, __, username) => {
      const productPrefixes = ['product', 'feedback', 'app', 'dev'];
      return productPrefixes.includes(username);
    },
  },
];

/**
 * Build Gmail-style alias from base forward email
 * e.g. base="user@gmail.com", alias="personal" => "user+personal@gmail.com"
 */
export function buildForwardEmail(baseEmail: string, aliasTag?: string): string {
  if (!baseEmail) return '';
  const clean = baseEmail.trim();
  if (!aliasTag || !aliasTag.trim()) return clean;

  const atIndex = clean.lastIndexOf('@');
  if (atIndex === -1) return `${clean}+${aliasTag.trim()}`;

  const username = clean.slice(0, atIndex);
  const domain = clean.slice(atIndex + 1);

  const plusIndex = username.indexOf('+');
  const baseUsername = plusIndex !== -1 ? username.slice(0, plusIndex) : username;

  return `${baseUsername}+${aliasTag.trim()}@${domain}`;
}
