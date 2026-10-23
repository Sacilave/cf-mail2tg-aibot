/**
 * =============================================================================
 * cf-mail2tg-aibot Interface & Type Definitions
 * =============================================================================
 */

export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_ADMIN_CHAT_ID: string;
  FORWARD_TO_EMAIL?: string;
  ENABLE_GMAIL_ALIASES?: string | boolean;
  /** Whether to block all attachments (SMTP 550 reject) */
  BLOCK_ALL_ATTACHMENTS?: string | boolean;
  /** Maximum email raw size in bytes (default 5MB = 5242880) */
  MAX_EMAIL_SIZE_BYTES?: string | number;
  /** Comma-separated dangerous file extensions to block */
  BLOCKED_ATTACHMENT_EXTENSIONS?: string;
  /** Cloudflare Workers KV namespace binding */
  MAIL_ROUTES_KV?: any;
  /** Maximum body snippet length for card display (default 1500) */
  MAX_SNIPPET_LENGTH?: string | number;
  /** Telegram marketing email policy: 'silent' (no ring/vibrate) | 'mute' (suppress TG push) */
  MARKETING_TG_POLICY?: 'silent' | 'mute';
  /** MiniMax API Key for LLM classification */
  MINIMAX_API_KEY?: string;
  /** MiniMax Group ID (optional) */
  MINIMAX_GROUP_ID?: string;
  /** MiniMax Model (optional, default: MiniMax-Text-01) */
  MINIMAX_MODEL?: string;
  /** MiniMax Custom API Endpoint (optional) */
  MINIMAX_API_URL?: string;
}

export interface MarketingDetectionResult {
  isMarketing: boolean;
  reason?: string;
  matchedKeyword?: string;
  matchedHeader?: string;
}

/** Standardized two-character intent labels */
export type EmailIntentTag = '验证' | '营销' | '告警' | '账单' | '业务' | '通知';

export type EmailIntentType =
  | 'verification'
  | 'marketing'
  | 'security'
  | 'billing'
  | 'direct'
  | 'notification';

export interface EmailIntentResult {
  intent: EmailIntentTag;
  type: EmailIntentType;
  reason?: string;
  code?: string;
  isMarketing: boolean;
  model?: string;
  error?: string;
}

export type AllowedTag = '个人' | '通用' | '免费产品' | '付费产品' | '商业支持';

export interface CustomRouteRule {
  prefix: string;
  tag: AllowedTag | string;
  forwardEmail: string;
  createdAt?: number;
}

export type PersonaCategory = 'personal' | 'commercial' | 'generic';

export interface PersonaRoute {
  category: PersonaCategory;
  /** Tag display string */
  tag: string;
  /** Forwarding email target */
  forwardEmail: string;
  /** Product/rule name */
  productName: string;
  /** Whether dynamically configured via KV */
  isCustom?: boolean;
  /** Product dedicated Telegram Chat ID (optional) */
  chatId?: string;
  /** Product dedicated Telegram Topic / Message Thread ID (optional) */
  messageThreadId?: number;
}

export interface EmailRateLimitOptions {
  from: string;
  to?: string;
  isSpfPass?: boolean;
  isDkimPass?: boolean;
  now?: number;
}

export interface EmailRateLimitResult {
  allowed: boolean;
  reason?: string;
  senderCount?: number;
  domainCount?: number;
  globalCount?: number;
  shouldNotifySuppression?: boolean;
}

export interface RateLimiterConfig {
  maxPerSenderPerMinute: number;
  maxPerDomainPerMinute: number;
  maxGlobalPerMinute: number;
  maxSuspiciousPerMinute: number;
  windowMs: number;
  maxMapEntries: number;
}

export interface ParsedEmailSummary {
  from: string;
  cleanReplyEmail: string;
  to: string;
  targetDomain: string;
  subject: string;
  snippet: string;
  attachmentsSummary: string;
  authBadge: string;
  isSpfPass: boolean;
  isDkimPass: boolean;
}

export interface AttachmentPolicyResult {
  allowed: boolean;
  reason?: string;
  smtpRejectCode?: number;
  detectedAttachments?: string[];
}
