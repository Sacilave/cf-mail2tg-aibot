/**
 * =============================================================================
 * Module: src/ai/index.ts
 * Description: Unified facade for the Multi-Provider AI classification engine.
 * =============================================================================
 */

export * from './types';
export * from './providers';
export * from './sanitizer';
export * from './prompt';
export * from './adapters';
export * from './dispatcher';

import type { EmailIntentTag, EmailIntentType } from '../types';
import { classifyEmail } from './dispatcher';

export interface MiniMaxClassifyOptions {
  apiKey: string;
  groupId?: string;
  model?: string;
  apiUrl?: string;
  subject: string;
  from: string;
  bodySnippet: string;
  timeoutMs?: number;
}

export interface MiniMaxClassifyResult {
  success: boolean;
  isMarketing: boolean;
  intent: EmailIntentTag;
  intentType: EmailIntentType;
  extractedCode?: string;
  reason?: string;
  error?: string;
  model?: string;
}

/**
 * Backward-compatible helper preserving existing tests and code paths
 */
export async function classifyEmailWithMiniMax(
  options: MiniMaxClassifyOptions
): Promise<MiniMaxClassifyResult> {
  if (!options.apiKey || !options.apiKey.trim()) {
    return {
      success: false,
      isMarketing: false,
      intent: '业务',
      intentType: 'direct',
      error: '未配置 MINIMAX_API_KEY',
    };
  }

  const res = await classifyEmail({
    provider: 'minimax',
    apiKey: options.apiKey,
    groupId: options.groupId,
    model: options.model || 'MiniMax-Text-01',
    baseUrl: options.apiUrl,
    subject: options.subject,
    from: options.from,
    bodySnippet: options.bodySnippet,
    timeoutMs: options.timeoutMs,
  });

  return {
    success: res.success,
    isMarketing: res.isMarketing,
    intent: res.intent,
    intentType: res.intentType,
    extractedCode: res.extractedCode,
    reason: res.reason,
    error: res.error,
    model: res.model,
  };
}
