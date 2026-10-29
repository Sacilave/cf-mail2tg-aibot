/**
 * =============================================================================
 * Module: src/ai/dispatcher.ts
 * Description: Universal multi-provider AI dispatcher with automatic routing,
 *              latency tracking, strict output parsing, and fallback protection.
 * =============================================================================
 */

import type {
  AIProviderId,
  ClassifyEmailOptions,
  ClassifyEmailResult,
  SummarizeEmailOptions,
  SummarizeEmailResult,
  TranslateEmailOptions,
  TranslateEmailResult,
} from './types';
import { findProvider, getRecommendedModel } from './providers';
import {
  buildClassifyPrompt,
  parseLLMResponse,
  buildSummarizePrompt,
  buildTranslatePrompt,
  parseTranslationResponse,
} from './prompt';
import {
  callWorkersAI,
  callOpenAICompatible,
  callClaude,
  callMiniMax,
} from './adapters';

/**
 * Universal email classification dispatcher
 */
export async function classifyEmail(
  options: ClassifyEmailOptions
): Promise<ClassifyEmailResult> {
  const startTime = Date.now();
  const {
    provider: requestedProvider,
    apiKey = '',
    model: requestedModel,
    baseUrl: customBaseUrl,
    groupId,
    subject,
    from,
    bodySnippet,
    timeoutMs = 4500,
    cfAi,
  } = options;

  // 1. Resolve Provider
  let providerId: AIProviderId = 'deepseek';
  if (requestedProvider) {
    const meta = findProvider(requestedProvider);
    if (meta) {
      providerId = meta.id;
    }
  } else if (cfAi && (!apiKey || !apiKey.trim())) {
    providerId = 'workers-ai';
  } else if (options.groupId || (options.baseUrl && options.baseUrl.includes('minimax'))) {
    providerId = 'minimax';
  }

  const providerMeta = findProvider(providerId);
  const model =
    requestedModel && requestedModel.trim()
      ? requestedModel.trim()
      : providerMeta?.defaultModel || getRecommendedModel(providerId);

  const prompt = buildClassifyPrompt(from, subject, bodySnippet);

  // 2. Dispatch to designated provider adapter
  let callerResult: { ok: boolean; content?: string; error?: string };

  switch (providerId) {
    case 'workers-ai':
      callerResult = await callWorkersAI(cfAi, model, prompt, timeoutMs);
      break;

    case 'claude':
      callerResult = await callClaude(apiKey, model, prompt, timeoutMs, customBaseUrl);
      break;

    case 'minimax': {
      const apiUrl =
        customBaseUrl ||
        providerMeta?.defaultBaseUrl ||
        'https://api.minimax.chat/v1/text/chatcompletion_v2';
      callerResult = await callMiniMax(apiKey, groupId, model, apiUrl, prompt, timeoutMs);
      break;
    }

    case 'deepseek':
    case 'groq':
    case 'openai':
    case 'gemini':
    case 'openrouter':
    case 'custom':
    default: {
      const baseUrl =
        customBaseUrl || providerMeta?.defaultBaseUrl || 'https://api.deepseek.com';
      const extraHeaders: Record<string, string> = {};
      if (providerId === 'openrouter') {
        extraHeaders['HTTP-Referer'] = 'https://github.com/cf-mail2tg-aibot';
        extraHeaders['X-Title'] = 'cf-mail2tg-aibot';
      }
      callerResult = await callOpenAICompatible(
        baseUrl,
        apiKey,
        model,
        prompt,
        timeoutMs,
        extraHeaders
      );
      break;
    }
  }

  const latencyMs = Date.now() - startTime;

  // 3. Handle failure
  if (!callerResult.ok || !callerResult.content) {
    return {
      success: false,
      isMarketing: false,
      intent: '业务',
      intentType: 'direct',
      error: callerResult.error || '大模型调用失败或返回为空',
      provider: providerId,
      model,
      latencyMs,
    };
  }

  // 4. Parse & validate response
  const parsed = parseLLMResponse(callerResult.content, subject, bodySnippet);

  return {
    success: true,
    isMarketing: parsed.tag === '营销',
    intent: parsed.tag,
    intentType: parsed.type,
    extractedCode: parsed.extractedCode,
    reason: parsed.reason,
    provider: providerId,
    model,
    latencyMs,
  };
}


/**
 * Universal email summarization dispatcher (Humanizer-zh Style)
 */
export async function summarizeEmail(
  options: SummarizeEmailOptions
): Promise<SummarizeEmailResult> {
  const startTime = Date.now();
  const {
    provider: requestedProvider,
    apiKey = "",
    model: requestedModel,
    baseUrl: customBaseUrl,
    groupId,
    subject,
    from,
    bodyText,
    targetLangName = "简体中文",
    timeoutMs = 9000,
    cfAi,
  } = options;

  let providerId: AIProviderId = "deepseek";
  if (requestedProvider) {
    const meta = findProvider(requestedProvider);
    if (meta) providerId = meta.id;
  } else if (cfAi && (!apiKey || !apiKey.trim())) {
    providerId = "workers-ai";
  } else if (options.groupId || (options.baseUrl && options.baseUrl.includes("minimax"))) {
    providerId = "minimax";
  }

  const providerMeta = findProvider(providerId);
  const model =
    requestedModel && requestedModel.trim()
      ? requestedModel.trim()
      : providerMeta?.defaultModel || getRecommendedModel(providerId);

  const prompt = buildSummarizePrompt(from, subject, bodyText, targetLangName);

  let callerResult: { ok: boolean; content?: string; error?: string };

  switch (providerId) {
    case "workers-ai":
      callerResult = await callWorkersAI(cfAi, model, prompt, timeoutMs, 600);
      break;

    case "claude":
      callerResult = await callClaude(apiKey, model, prompt, timeoutMs, customBaseUrl, 800);
      break;

    case "minimax": {
      const apiUrl =
        customBaseUrl ||
        providerMeta?.defaultBaseUrl ||
        "https://api.minimax.chat/v1/text/chatcompletion_v2";
      callerResult = await callMiniMax(apiKey, groupId, model, apiUrl, prompt, timeoutMs, 800);
      break;
    }

    case "deepseek":
    case "groq":
    case "openai":
    case "gemini":
    case "openrouter":
    case "custom":
    default: {
      const baseUrl =
        customBaseUrl || providerMeta?.defaultBaseUrl || "https://api.deepseek.com";
      const extraHeaders: Record<string, string> = {};
      if (providerId === "openrouter") {
        extraHeaders["HTTP-Referer"] = "https://github.com/cf-mail2tg-aibot";
        extraHeaders["X-Title"] = "cf-mail2tg-aibot";
      }
      callerResult = await callOpenAICompatible(
        baseUrl,
        apiKey,
        model,
        prompt,
        timeoutMs,
        extraHeaders,
        800,
        false
      );
      break;
    }
  }

  const latencyMs = Date.now() - startTime;

  if (!callerResult.ok || !callerResult.content) {
    return {
      success: false,
      error: callerResult.error || "AI 总结生成失败",
      provider: providerId,
      latencyMs,
    };
  }

  const cleanSummary = callerResult.content.trim();

  return {
    success: true,
    summary: cleanSummary,
    provider: providerId,
    latencyMs,
  };
}

/**
 * Universal email full-text translation dispatcher
 */
export async function translateEmail(
  options: TranslateEmailOptions
): Promise<TranslateEmailResult> {
  const startTime = Date.now();
  const {
    provider: requestedProvider,
    apiKey = "",
    model: requestedModel,
    baseUrl: customBaseUrl,
    groupId,
    subject,
    bodyText,
    targetLangName = "简体中文",
    timeoutMs = 12000,
    cfAi,
  } = options;

  let providerId: AIProviderId = "deepseek";
  if (requestedProvider) {
    const meta = findProvider(requestedProvider);
    if (meta) providerId = meta.id;
  } else if (cfAi && (!apiKey || !apiKey.trim())) {
    providerId = "workers-ai";
  } else if (options.groupId || (options.baseUrl && options.baseUrl.includes("minimax"))) {
    providerId = "minimax";
  }

  const providerMeta = findProvider(providerId);
  const model =
    requestedModel && requestedModel.trim()
      ? requestedModel.trim()
      : providerMeta?.defaultModel || getRecommendedModel(providerId);

  const prompt = buildTranslatePrompt(subject, bodyText, targetLangName);

  let callerResult: { ok: boolean; content?: string; error?: string };

  switch (providerId) {
    case "workers-ai":
      callerResult = await callWorkersAI(cfAi, model, prompt, timeoutMs, 1200);
      break;

    case "claude":
      callerResult = await callClaude(apiKey, model, prompt, timeoutMs, customBaseUrl, 1500);
      break;

    case "minimax": {
      const apiUrl =
        customBaseUrl ||
        providerMeta?.defaultBaseUrl ||
        "https://api.minimax.chat/v1/text/chatcompletion_v2";
      callerResult = await callMiniMax(apiKey, groupId, model, apiUrl, prompt, timeoutMs, 1500);
      break;
    }

    case "deepseek":
    case "groq":
    case "openai":
    case "gemini":
    case "openrouter":
    case "custom":
    default: {
      const baseUrl =
        customBaseUrl || providerMeta?.defaultBaseUrl || "https://api.deepseek.com";
      const extraHeaders: Record<string, string> = {};
      if (providerId === "openrouter") {
        extraHeaders["HTTP-Referer"] = "https://github.com/cf-mail2tg-aibot";
        extraHeaders["X-Title"] = "cf-mail2tg-aibot";
      }
      callerResult = await callOpenAICompatible(
        baseUrl,
        apiKey,
        model,
        prompt,
        timeoutMs,
        extraHeaders,
        1500,
        true
      );
      break;
    }
  }

  const latencyMs = Date.now() - startTime;

  if (!callerResult.ok || !callerResult.content) {
    return {
      success: false,
      error: callerResult.error || "AI 翻译生成失败",
      provider: providerId,
      latencyMs,
    };
  }

  const parsed = parseTranslationResponse(callerResult.content, subject, bodyText);

  return {
    success: true,
    translatedSubject: parsed.translatedSubject,
    translatedText: parsed.translatedText,
    provider: providerId,
    latencyMs,
  };
}