/**
 * =============================================================================
 * Module: src/ai/sanitizer.ts
 * Description: Universal token sanitizer ensuring zero API key leaks in Telegram
 *              cards and logs across all major AI providers.
 * =============================================================================
 */

/**
 * Sanitize error messages and raw strings to prevent any provider API Keys or
 * Authorization Bearer tokens from leaking in Telegram cards or logs.
 */
export function sanitizeErrorMessage(rawError: string, activeApiKey?: string): string {
  if (!rawError) return '';
  let clean = rawError;

  // 1. Redact explicitly supplied active API key
  if (activeApiKey && activeApiKey.trim().length >= 6) {
    clean = clean.split(activeApiKey.trim()).join('***');
  }

  // 2. Redact common authorization headers & tokens
  return clean
    .replace(/Bearer\s+[A-Za-z0-9._\-]+/gi, 'Bearer ***')
    .replace(/api[-_]?key[=:]\s*["']?[A-Za-z0-9._\-]+["']?/gi, 'api_key=***')
    .replace(/x-api-key[=:]\s*["']?[A-Za-z0-9._\-]+["']?/gi, 'x-api-key=***')
    .replace(/key=[A-Za-z0-9._\-]{16,}/gi, 'key=***')
    // 3. Provider-specific token signatures:
    // Anthropic: sk-ant-... (must precede sk- to prevent partial matching)
    .replace(/sk-ant-[A-Za-z0-9\-_]{20,}/gi, 'sk-ant-***')
    // OpenAI & DeepSeek: sk-...
    .replace(/sk-[A-Za-z0-9\-_]{20,}/gi, 'sk-***')
    // Groq: gsk_...
    .replace(/gsk_[A-Za-z0-9\-_]{20,}/gi, 'gsk_***')
    // Google: AIza...
    .replace(/AIza[A-Za-z0-9\-_]{20,}/gi, 'AIza***');
}

/**
 * Mask secret string for display in config card (e.g. sk-1234****abcd)
 */
export function maskSecretKey(secret: string): string {
  if (!secret) return '';
  const s = secret.trim();
  if (s.length <= 8) return '********';
  const prefix = s.slice(0, 4);
  const suffix = s.slice(-4);
  return `${prefix}****${suffix}`;
}
