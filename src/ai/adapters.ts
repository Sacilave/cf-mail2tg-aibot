/**
 * =============================================================================
 * Module: src/ai/adapters.ts
 * Description: Low-level API caller adapters for all supported AI providers.
 *              Guarantees strict compliance with the latest REST API standards.
 * =============================================================================
 */

import { sanitizeErrorMessage } from './sanitizer';

export interface CallerResult {
  ok: boolean;
  content?: string;
  error?: string;
}

/**
 * 1. Cloudflare Workers AI Native Adapter (Edge Native, Free, No API Key)
 */
export async function callWorkersAI(
  cfAi: any,
  model: string,
  prompt: string,
  _timeoutMs: number = 4500
): Promise<CallerResult> {
  if (!cfAi || typeof cfAi.run !== 'function') {
    return {
      ok: false,
      error: 'Workers AI binding (env.AI) 未在 wrangler.jsonc 中绑定或当前环境不可用',
    };
  }

  try {
    const result: any = await cfAi.run(model, {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 120,
      temperature: 0.1,
    });

    const reply = typeof result === 'string' ? result : result?.response || '';
    if (!reply) {
      return { ok: false, error: 'Workers AI 返回内容为空' };
    }
    return { ok: true, content: reply };
  } catch (err: any) {
    const rawMsg = err?.message || String(err);
    return { ok: false, error: `Workers AI 调用失败: ${rawMsg.slice(0, 100)}` };
  }
}

/**
 * 2. OpenAI-Compatible Standard Adapter
 * Supports: DeepSeek, Groq, OpenAI, Google Gemini (OpenAI endpoint), OpenRouter, Custom
 */
export async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string,
  timeoutMs: number = 4500,
  extraHeaders?: Record<string, string>
): Promise<CallerResult> {
  if (!apiKey || !apiKey.trim()) {
    return { ok: false, error: '未配置 API Key' };
  }

  let cleanBase = baseUrl.trim().replace(/\/+$/, '');
  if (cleanBase === 'https://api.openai.com') {
    cleanBase = 'https://api.openai.com/v1';
  }
  const endpoint = cleanBase.endsWith('/chat/completions')
    ? cleanBase
    : `${cleanBase}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey.trim()}`,
    ...extraHeaders,
  };

  const payload: any = {
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 120,
    response_format: { type: 'json_object' },
  };

  try {
    let res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');

      // Resilient fallback: If custom/older endpoint rejects `response_format`, retry without it
      if (res.status === 400 && /response_format|json_object|unrecognized/i.test(errText)) {
        delete payload.response_format;
        const retryRes = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (retryRes.ok) {
          const retryData: any = await retryRes.json();
          const reply = retryData?.choices?.[0]?.message?.content || '';
          return { ok: true, content: reply };
        }
      }

      const sanitized = sanitizeErrorMessage(errText, apiKey).slice(0, 100);
      return { ok: false, error: `HTTP ${res.status}: ${sanitized}` };
    }

    const data: any = await res.json();
    const reply = data?.choices?.[0]?.message?.content || '';
    return { ok: true, content: reply };
  } catch (err: any) {
    const rawMsg = err?.message || String(err);
    const isTimeout = /timeout|timed out|abort/i.test(rawMsg);
    const cleanMsg = sanitizeErrorMessage(rawMsg, apiKey);
    return {
      ok: false,
      error: isTimeout ? `请求超时 (${cleanMsg})` : cleanMsg,
    };
  }
}

/**
 * 3. Anthropic Claude Adapter (Messages API)
 */
export async function callClaude(
  apiKey: string,
  model: string,
  prompt: string,
  timeoutMs: number = 4500,
  baseUrl?: string
): Promise<CallerResult> {
  if (!apiKey || !apiKey.trim()) {
    return { ok: false, error: '未配置 ANTHROPIC_API_KEY' };
  }

  const cleanBase = (baseUrl || 'https://api.anthropic.com').trim().replace(/\/+$/, '');
  const endpoint = cleanBase.endsWith('/messages')
    ? cleanBase
    : cleanBase.endsWith('/v1')
      ? `${cleanBase}/messages`
      : `${cleanBase}/v1/messages`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey.trim(),
    'anthropic-version': '2023-06-01',
  };

  const payload = {
    model,
    max_tokens: 150,
    temperature: 0.1,
    messages: [{ role: 'user', content: prompt }],
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      const sanitized = sanitizeErrorMessage(errText, apiKey).slice(0, 100);
      return { ok: false, error: `HTTP ${res.status}: ${sanitized}` };
    }

    const data: any = await res.json();
    const reply = data?.content?.[0]?.text || '';
    return { ok: true, content: reply };
  } catch (err: any) {
    const rawMsg = err?.message || String(err);
    const isTimeout = /timeout|timed out|abort/i.test(rawMsg);
    const cleanMsg = sanitizeErrorMessage(rawMsg, apiKey);
    return {
      ok: false,
      error: isTimeout ? `请求超时 (${cleanMsg})` : cleanMsg,
    };
  }
}

/**
 * 4. MiniMax Legacy Adapter
 */
export async function callMiniMax(
  apiKey: string,
  groupId: string | undefined,
  model: string,
  apiUrl: string,
  prompt: string,
  timeoutMs: number = 4500
): Promise<CallerResult> {
  if (!apiKey || !apiKey.trim()) {
    return { ok: false, error: '未配置 MINIMAX_API_KEY' };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey.trim()}`,
  };
  if (groupId) {
    headers['Group-Id'] = groupId.trim();
  }

  const payload = {
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 100,
  };

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      const sanitized = sanitizeErrorMessage(errText, apiKey).slice(0, 100);
      return { ok: false, error: `HTTP ${res.status}: ${sanitized}` };
    }

    const data: any = await res.json();
    const reply = data?.choices?.[0]?.message?.content || '';
    return { ok: true, content: reply };
  } catch (err: any) {
    const rawMsg = err?.message || String(err);
    const isTimeout = /timeout|timed out|abort/i.test(rawMsg);
    const cleanMsg = sanitizeErrorMessage(rawMsg, apiKey);
    return {
      ok: false,
      error: isTimeout ? `请求超时 (${cleanMsg})` : cleanMsg,
    };
  }
}
