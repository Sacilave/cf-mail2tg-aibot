/**
 * =============================================================================
 * Module: src/ai/types.ts
 * Description: Unified type definitions for Multi-Provider AI classification engine.
 * =============================================================================
 */

import type { EmailIntentTag, EmailIntentType } from '../types';

export type AIProviderId =
  | 'workers-ai'
  | 'deepseek'
  | 'groq'
  | 'openai'
  | 'gemini'
  | 'claude'
  | 'openrouter'
  | 'minimax'
  | 'custom';

export interface ModelOption {
  id: string;
  name: string;
  isRecommended?: boolean;
  descriptionZh: string;
  descriptionEn: string;
}

export interface ProviderMetadata {
  id: AIProviderId;
  index: number;
  name: string;
  badge: string;
  isFreeOrNoKey?: boolean;
  defaultModel: string;
  models: ModelOption[];
  defaultBaseUrl?: string;
  descriptionZh: string;
  descriptionEn: string;
}

export interface ClassifyEmailOptions {
  provider?: AIProviderId | string;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  groupId?: string; // MiniMax legacy
  subject: string;
  from: string;
  bodySnippet: string;
  timeoutMs?: number;
  /** Cloudflare Workers AI binding (`env.AI`) */
  cfAi?: any;
}

export interface ClassifyEmailResult {
  /** Whether the classification call succeeded */
  success: boolean;
  /** Whether classified as marketing email */
  isMarketing: boolean;
  /** Standard 2-character intent tag */
  intent: EmailIntentTag;
  /** Intent category type */
  intentType: EmailIntentType;
  /** Extracted verification code if present */
  extractedCode?: string;
  /** Reason / explanation */
  reason?: string;
  /** Detailed error if failed */
  error?: string;
  /** Provider used */
  provider: AIProviderId | 'local-regex';
  /** Model used */
  model?: string;
  /** Call duration in milliseconds */
  latencyMs?: number;
}
