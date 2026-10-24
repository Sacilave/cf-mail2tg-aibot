/**
 * =============================================================================
 * Service: Cloudflare Email Routing to Telegram Bot & Gmail AI Gateway (cf-mail2tg-aibot)
 * Core Architecture:
 *   1. Dual-Track Zero-Drop Delivery:
 *      - Backup Track: Native Cloudflare message.forward to backup inbox (Gmail aliases supported)
 *      - Notification Track: Deep MIME decoding & clean card push to Telegram with HTML formatting
 *   2. Attachment Armor & Quota Hardening:
 *      - Zero-Attachment Mode: Drop all emails with attachments at edge via SMTP 550
 *      - Size Cap: Instant SMTP 552 rejection for emails exceeding MAX_EMAIL_SIZE_BYTES (default 5MB)
 *   3. Pre-Parse Rate Check:
 *      - Sliding window check before reading full stream; drops floods in 0.2ms
 *   4. Telegram 429 Circuit Breaker:
 *      - Auto 30s cooling period on HTTP 429 to protect Bot API quota
 *   5. LLM-Powered Intent Triage & Instant Verification Code Extraction:
 *      - 6 Intent Tags: 验证 | 营销 | 告警 | 账单 | 业务 | 通知
 *      - High-performance regex fallback + Telegram silent delivery for marketing
 * =============================================================================
 */

import PostalMime from 'postal-mime';
import {
  escapeHtml,
  extractCleanEmail,
  extractDomain,
  decodeQuotedPrintable,
  cleanHtmlToText,
  extractTextSnippet,
  formatBytes,
  checkAttachmentPolicy,
  DEFAULT_DANGEROUS_EXTENSIONS,
  DEFAULT_MARKETING_KEYWORDS,
  detectMarketingEmail,
} from './sanitizer';
import type { MarketingCheckResult } from './sanitizer';
import {
  classifyEmail,
  classifyEmailWithMiniMax,
  sanitizeErrorMessage,
  extractVerificationCode,
  normalizeIntent,
  findProvider,
  SUPPORTED_PROVIDERS,
  getRecommendedModel,
} from './ai';
import type { MiniMaxClassifyResult, MiniMaxClassifyOptions } from './ai';
import {
  defaultEmailRateLimiter,
  EmailRateLimiter,
  DEFAULT_CONFIG,
} from './rate-limiter';
import {
  ALLOWED_TAGS,
  isValidTag,
  DEFAULT_PRESET_RULES,
  buildForwardEmail,
} from './config';
import type { RouteRule } from './config';
import {
  defaultEmailRouter,
  EmailRouter,
  resolveRoute,
  resolveRouteAsync,
  getCustomRule,
  addCustomRule,
  deleteCustomRule,
  listCustomRules,
  getMarketingKeywords,
  setMarketingKeywords,
  appendMarketingKeywords,
  resetMarketingKeywords,
  ensureLanguageKeywords,
  getCustomTags,
  getAllActiveTags,
  addCustomTag,
  deleteCustomTag,
  MARKETING_KEYWORDS_KV_KEY,
  getDynamicConfig,
  setDynamicConfig,
  deleteDynamicConfig,
  maskSecret,
  DYNAMIC_CONFIG_PREFIX,
  isValidEmail,
  getSetupSession,
  setSetupSession,
  clearSetupSession,
  SETUP_SESSION_KEY,
  getInteractiveSession,
  setInteractiveSession,
  clearInteractiveSession,
  getEffectiveAiConfig,
} from './router';
import type {
  Env,
  PersonaRoute,
  PersonaCategory,
  AllowedTag,
  CustomRouteRule,
  EmailRateLimitOptions,
  EmailRateLimitResult,
  RateLimiterConfig,
  ParsedEmailSummary,
  AttachmentPolicyResult,
  MarketingDetectionResult,
  EmailIntentTag,
  EmailIntentType,
} from './types';
import {
  getTranslation,
  resolveLanguage,
  normalizeLanguage,
  getLanguageKeyboard,
  getCommandsPayload,
  SUPPORTED_LANGUAGES,
} from './i18n';
import type { SupportedLang, TranslationDict } from './i18n';
import {
  renderSizeAlertCard,
  renderRateLimitCard,
  renderAttachmentRejectCard,
  renderEmailCardHtml,
  renderEmailCardPlainText,
  renderMasterDashboardHtml,
  getMasterMenuKeyboard,
  renderStartCardHtml,
  getStartKeyboard,
  renderUsageGuideHtml,
  getUsageGuideKeyboard,
  getTagsMenuKeyboard,
  getAiMenuKeyboard,
  getModelsMenuKeyboard,
  getRoutesMenuKeyboard,
  getRouteTagSelectionKeyboard,
  getKeywordsMenuKeyboard,
  getForwardMenuKeyboard,
} from './card-renderer';

// Export core functions and types for external test suites
export {
  renderSizeAlertCard,
  renderRateLimitCard,
  renderAttachmentRejectCard,
  renderEmailCardHtml,
  renderEmailCardPlainText,
  escapeHtml,
  extractCleanEmail,
  extractDomain,
  decodeQuotedPrintable,
  cleanHtmlToText,
  extractTextSnippet,
  formatBytes,
  checkAttachmentPolicy,
  DEFAULT_DANGEROUS_EXTENSIONS,
  DEFAULT_MARKETING_KEYWORDS,
  detectMarketingEmail,
  defaultEmailRateLimiter,
  EmailRateLimiter,
  DEFAULT_CONFIG,
  defaultEmailRouter,
  EmailRouter,
  resolveRoute,
  resolveRouteAsync,
  buildForwardEmail,
  isValidTag,
  ALLOWED_TAGS,
  DEFAULT_PRESET_RULES,
  getCustomRule,
  addCustomRule,
  deleteCustomRule,
  listCustomRules,
  getMarketingKeywords,
  setMarketingKeywords,
  appendMarketingKeywords,
  resetMarketingKeywords,
  ensureLanguageKeywords,
  getCustomTags,
  getAllActiveTags,
  addCustomTag,
  deleteCustomTag,
  MARKETING_KEYWORDS_KV_KEY,
  getDynamicConfig,
  setDynamicConfig,
  deleteDynamicConfig,
  maskSecret,
  DYNAMIC_CONFIG_PREFIX,
  isValidEmail,
  getSetupSession,
  setSetupSession,
  clearSetupSession,
  SETUP_SESSION_KEY,
  classifyEmailWithMiniMax,
  sanitizeErrorMessage,
  extractVerificationCode,
  normalizeIntent,
  BOT_COMMANDS,
  getTranslation,
  resolveLanguage,
  normalizeLanguage,
  getLanguageKeyboard,
  getCommandsPayload,
  SUPPORTED_LANGUAGES,
};

export type {
  SupportedLang,
  TranslationDict,
};

export type {
  Env,
  PersonaRoute,
  PersonaCategory,
  AllowedTag,
  CustomRouteRule,
  RouteRule,
  EmailRateLimitOptions,
  EmailRateLimitResult,
  RateLimiterConfig,
  ParsedEmailSummary,
  AttachmentPolicyResult,
  MarketingCheckResult,
  MarketingDetectionResult,
  MiniMaxClassifyResult,
  MiniMaxClassifyOptions,
  EmailIntentTag,
  EmailIntentType,
};

// In-memory Telegram 429 cooling circuit breaker
let telegramCircuitBreakerUntil = 0;

/**
 * Standard Telegram Bot Commands definition for setMyCommands & Help Menu
 */
const BOT_COMMANDS = [
  { command: 'start', description: '网关状态总览与快速入口' },
  { command: 'menu', description: '打开网关设置控制面板' },
  { command: 'guide', description: '查看详细使用指南' },
  { command: 'lang', description: '切换显示语言 / Switch language' },
  { command: 'config', description: '查看密钥绑定状态与配置中枢' },
  { command: 'routes', description: '查看并管理邮箱业务路由规则' },
  { command: 'keywords', description: '查看并管理营销垃圾拦截词库' },
  { command: 'setkey', description: '热更新密钥/备份邮箱: setkey <类型> <值>' },
  { command: 'help', description: '查看指令面板与帮助' },
];

/**
 * Telegram API interactive helper functions
 */
async function sendTelegramMessage(
  botToken: string,
  chatId: string | number,
  text: string,
  replyMarkup?: any,
  disableNotification?: boolean
): Promise<boolean> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const body: any = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  };
  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }
  if (disableNotification) {
    body.disable_notification = true;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (err) {
    console.error('[Telegram] sendTelegramMessage failed:', err);
    return false;
  }
}

async function answerCallbackQuery(botToken: string, callbackQueryId: string, text?: string): Promise<boolean> {
  const url = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function editMessageText(
  botToken: string,
  chatId: string | number,
  messageId: number,
  text: string,
  replyMarkup?: any
): Promise<boolean> {
  const url = `https://api.telegram.org/bot${botToken}/editMessageText`;
  try {
    const payload: any = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
    };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default {
  /**
   * HTTP Entrypoint: Telegram Webhook interactive management
   */
  async fetch(request: Request, env?: Env): Promise<Response> {
    const url = new URL(request.url);
    const botToken = env?.TELEGRAM_BOT_TOKEN?.trim();
    const adminChatId = env?.TELEGRAM_ADMIN_CHAT_ID?.trim();
    const webhookSecret = env?.TELEGRAM_WEBHOOK_SECRET?.trim();
    const baseForwardTarget = env?.FORWARD_TO_EMAIL?.trim() || '';

    // Endpoint helper: One-click setup for Webhook & official Menu button commands
    if ((url.pathname === '/setup-webhook' || url.pathname === '/setup-commands') && botToken) {
      if (webhookSecret) {
        const querySecret = url.searchParams.get('secret')?.trim();
        if (querySecret !== webhookSecret) {
          return new Response(
            JSON.stringify({ ok: false, error: '403 Forbidden: Invalid or missing setup secret token (?secret=...)' }),
            {
              status: 403,
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
            }
          );
        }
      }

      const webhookUrl = `${url.origin}/`;
      try {
        const currentLang = await resolveLanguage(env?.MAIL_ROUTES_KV, env?.DEFAULT_LANGUAGE);
        const commandsPayload = getCommandsPayload(currentLang);

        const cmdRes = await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(commandsPayload),
        });
        const cmdData = await cmdRes.json();

        if (url.pathname === '/setup-commands') {
          return new Response(JSON.stringify({ ok: true, setMyCommands: cmdData }, null, 2), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          });
        }

        const infoRes = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
        const infoData: any = await infoRes.json().catch(() => ({}));
        if (infoData?.result?.url === webhookUrl) {
          return new Response(
            JSON.stringify(
              {
                ok: true,
                message: 'Webhook is already correctly configured',
                webhookUrl,
                setMyCommands: cmdData,
                info: infoData,
              },
              null,
              2
            ),
            {
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
            }
          );
        }

        let setWebhookUrl = `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
        if (webhookSecret) {
          setWebhookUrl += `&secret_token=${encodeURIComponent(webhookSecret)}`;
        }
        const tgRes = await fetch(setWebhookUrl);
        const tgData = await tgRes.json();
        return new Response(
          JSON.stringify({ ok: true, webhookUrl, setMyCommands: cmdData, telegram: tgData }, null, 2),
          {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          }
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
          status: 500,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
    }

    // Restrict direct HTTP requests (protect Workers quota from arbitrary crawlers)
    if (request.method !== 'POST') {
      return new Response('403 Forbidden: Direct HTTP access is restricted on cf-mail2tg-aibot gateway.', {
        status: 403,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Authenticate Telegram Webhook request via secret token if configured
    if (webhookSecret) {
      const incomingSecret = request.headers.get('x-telegram-bot-api-secret-token');
      if (incomingSecret !== webhookSecret) {
        return new Response('401 Unauthorized: Invalid Telegram Webhook Secret Token', {
          status: 401,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    }

    let update: any = null;
    try {
      update = await request.json();
    } catch {
      return new Response('Bad Request', { status: 400 });
    }

    if (!update || (!update.message && !update.callback_query)) {
      return new Response('403 Forbidden: Invalid Webhook Payload', { status: 403 });
    }

    if (!env || !botToken || !adminChatId) {
      return new Response('Worker environment unconfigured', { status: 500 });
    }

    // 1. Process inline button callbacks (secondary confirmation & language switching)
    if (update.callback_query) {
      const fromId = String(update.callback_query.from?.id);
      if (fromId !== adminChatId) {
        return new Response('OK', { status: 200 });
      }

      const callbackId = update.callback_query.id;
      const callbackData = update.callback_query.data || '';
      const messageId = update.callback_query.message?.message_id;
      const cbLang = await resolveLanguage(
        env.MAIL_ROUTES_KV,
        env.DEFAULT_LANGUAGE,
        update.callback_query.from?.language_code
      );
      const cbDict = getTranslation(cbLang);

      // 0. Start Overview Menu
      if (callbackData === 'm:start') {
        const effectiveAi = await getEffectiveAiConfig(env, env.MAIL_ROUTES_KV);
        const fwd = (await getDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email')) || env.FORWARD_TO_EMAIL || '';
        const aliasesEnabled = String((await getDynamicConfig(env.MAIL_ROUTES_KV, 'enable_gmail_aliases')) ?? env.ENABLE_GMAIL_ALIASES ?? 'true').toLowerCase() === 'true';

        const startCard = renderStartCardHtml({
          dict: cbDict,
          provider: effectiveAi.provider,
          model: effectiveAi.model,
          forwardEmail: fwd,
          gmailAliasesEnabled: aliasesEnabled,
        });

        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, startCard, {
            inline_keyboard: getStartKeyboard(cbDict),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 0.1 Usage Detailed Guide
      if (callbackData === 'm:guide') {
        const guideCard = renderUsageGuideHtml(cbDict);
        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, guideCard, {
            inline_keyboard: getUsageGuideKeyboard(cbDict),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 0.2 Quick Setup Wizard
      if (callbackData === 'm:setup') {
        if (!env?.MAIL_ROUTES_KV) {
          await answerCallbackQuery(botToken, callbackId, cbDict.setupCommand.kvRequiredError);
          return new Response('OK', { status: 200 });
        }
        await setSetupSession(env.MAIL_ROUTES_KV, 1);
        await answerCallbackQuery(botToken, callbackId);
        await sendTelegramMessage(botToken, adminChatId, cbDict.setupCommand.startWizardText, {
          inline_keyboard: [[{ text: cbDict.dashboard.btnCancel, callback_data: 'm:cancel' }]],
        });
        return new Response('OK', { status: 200 });
      }

      // 0.3 Cancel Active Wizard or Session
      if (callbackData === 'm:cancel') {
        if (env?.MAIL_ROUTES_KV) {
          await clearSetupSession(env.MAIL_ROUTES_KV);
          await clearInteractiveSession(env.MAIL_ROUTES_KV);
        }
        await answerCallbackQuery(botToken, callbackId, cbDict.setupCommand.cancelSuccess);
        await sendTelegramMessage(botToken, adminChatId, cbDict.setupCommand.cancelSuccess, {
          inline_keyboard: [[{ text: cbDict.startCommand.btnOpenMenu, callback_data: 'm:main' }]],
        });
        return new Response('OK', { status: 200 });
      }

      // 1. Dashboard Master Menu & Refresh
      if (callbackData === 'm:main' || callbackData === 'm:refresh') {
        const effectiveAi = await getEffectiveAiConfig(env, env.MAIL_ROUTES_KV);
        const fwd = (await getDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email')) || env.FORWARD_TO_EMAIL || '';
        const aliasesEnabled = String((await getDynamicConfig(env.MAIL_ROUTES_KV, 'enable_gmail_aliases')) ?? env.ENABLE_GMAIL_ALIASES ?? 'true').toLowerCase() === 'true';
        const rules = await listCustomRules(env.MAIL_ROUTES_KV);
        const kws = await getMarketingKeywords(env.MAIL_ROUTES_KV);

        const card = renderMasterDashboardHtml({
          dict: cbDict,
          provider: effectiveAi.provider,
          model: effectiveAi.model,
          keyConfigured: Boolean(effectiveAi.apiKey || effectiveAi.provider === 'workers-ai'),
          forwardEmail: fwd,
          gmailAliasesEnabled: aliasesEnabled,
          customRulesCount: rules.length,
          keywordsCount: kws.length,
          langName: cbDict.langName,
        });

        await answerCallbackQuery(botToken, callbackId, callbackData === 'm:refresh' ? cbDict.dashboard.toastUpdated : undefined);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getMasterMenuKeyboard(cbDict),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 2. AI Menu
      if (callbackData === 'm:ai') {
        const effectiveAi = await getEffectiveAiConfig(env, env.MAIL_ROUTES_KV);
        const card = [
          `🤖 <b>【 AI 审信与意图引擎设置 】</b>`,
          `━━━━━━━━━━━━━━━━━━`,
          `• 当前厂商: <b>${escapeHtml(effectiveAi.provider)}</b>`,
          `• 运行模型: <code>${escapeHtml(effectiveAi.model)}</code>`,
          `• 密钥状态: ${effectiveAi.apiKey ? '🟢 已配置' : (effectiveAi.provider === 'workers-ai' ? '🟢 免密运行' : '⚪ 未绑定')}`,
          ``,
          `💡 <i>轻触下方厂商按钮立即秒切，或点击【切换具体模型】挑选版本：</i>`,
        ].join('\n');

        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getAiMenuKeyboard(cbDict, effectiveAi.provider, effectiveAi.model),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 3. Provider Switch (p:<providerId>)
      if (callbackData.startsWith('p:')) {
        const providerId = callbackData.slice('p:'.length);
        const providerMeta = findProvider(providerId);
        if (providerMeta && env.MAIL_ROUTES_KV) {
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_provider', providerMeta.id);
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_model', providerMeta.defaultModel);
          await answerCallbackQuery(botToken, callbackId, `已切换至 ${providerMeta.name}`);

          const card = [
            `🤖 <b>【 AI 审信与意图引擎设置 】</b>`,
            `━━━━━━━━━━━━━━━━━━`,
            `• 当前厂商: <b>${escapeHtml(providerMeta.name)}</b>`,
            `• 运行模型: <code>${escapeHtml(providerMeta.defaultModel)}</code>`,
            `• 厂商特性: <i>${escapeHtml(providerMeta.badge)}</i>`,
            ``,
            `✅ <b>厂商切换成功！</b>`,
          ].join('\n');

          if (messageId) {
            await editMessageText(botToken, adminChatId, messageId, card, {
              inline_keyboard: getAiMenuKeyboard(cbDict, providerMeta.id, providerMeta.defaultModel),
            });
          }
        }
        return new Response('OK', { status: 200 });
      }

      // 4. Model Selection Menu (m:models)
      if (callbackData === 'm:models') {
        const effectiveAi = await getEffectiveAiConfig(env, env.MAIL_ROUTES_KV);
        const card = [
          cbDict.modelCommand.title(effectiveAi.provider),
          `━━━━━━━━━━━━━━━━━━`,
          cbDict.modelCommand.current(effectiveAi.model),
          ``,
          `<i>💡 轻触下方按钮直接切换至推荐模型：</i>`,
        ].join('\n');

        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getModelsMenuKeyboard(cbDict, effectiveAi.provider, effectiveAi.model),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 5. Model Switch (mod:<modelId>)
      if (callbackData.startsWith('mod:')) {
        const chosenModel = callbackData.slice('mod:'.length);
        if (env.MAIL_ROUTES_KV) {
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_model', chosenModel);
        }
        const effectiveAi = await getEffectiveAiConfig(env, env.MAIL_ROUTES_KV);
        await answerCallbackQuery(botToken, callbackId, `已切换为 ${chosenModel}`);

        const card = [
          cbDict.modelCommand.title(effectiveAi.provider),
          `━━━━━━━━━━━━━━━━━━`,
          `✅ <b>模型已更新为:</b> <code>${escapeHtml(chosenModel)}</code>`,
          ``,
          `<i>💡 轻触下方按钮可继续挑选其他推荐模型：</i>`,
        ].join('\n');

        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getModelsMenuKeyboard(cbDict, effectiveAi.provider, chosenModel),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 5.1 Set AI API Key (ai:setkey)
      if (callbackData === 'ai:setkey') {
        if (!env?.MAIL_ROUTES_KV) {
          await answerCallbackQuery(botToken, callbackId, cbDict.providerCommand.kvError);
          return new Response('OK', { status: 200 });
        }
        const effectiveAi = await getEffectiveAiConfig(env, env.MAIL_ROUTES_KV);
        await setInteractiveSession(env.MAIL_ROUTES_KV, {
          type: 'set_ai_key',
          step: 1,
          provider: effectiveAi.provider,
          createdAt: Date.now(),
        });
        await answerCallbackQuery(botToken, callbackId);
        await sendTelegramMessage(
          botToken,
          adminChatId,
          `🔑 <b>【 绑定大模型 API Key 】</b>\n━━━━━━━━━━━━━━━━━━\n当前厂商: <b>${escapeHtml(effectiveAi.provider)}</b>\n\n请直接回复您的 API Key（如 <code>sk-...</code>）：\n<i>（注：Workers AI 免密运行，无需配置 Key）</i>`,
          {
            inline_keyboard: [[{ text: cbDict.dashboard.btnCancel, callback_data: 'm:cancel' }]],
          }
        );
        return new Response('OK', { status: 200 });
      }

      // 5.2 Reset AI API Key (ai:resetkey)
      if (callbackData === 'ai:resetkey') {
        if (!env?.MAIL_ROUTES_KV) {
          await answerCallbackQuery(botToken, callbackId, cbDict.providerCommand.kvError);
          return new Response('OK', { status: 200 });
        }
        await deleteDynamicConfig(env.MAIL_ROUTES_KV, 'ai_api_key');
        await answerCallbackQuery(botToken, callbackId, '已清除自定义 API Key');
        const effectiveAi = await getEffectiveAiConfig(env, env.MAIL_ROUTES_KV);
        const card = [
          `🤖 <b>【 AI 审信与意图引擎设置 】</b>`,
          `━━━━━━━━━━━━━━━━━━`,
          `• 当前厂商: <b>${escapeHtml(effectiveAi.provider)}</b>`,
          `• 运行模型: <code>${escapeHtml(effectiveAi.model)}</code>`,
          `• 密钥状态: ${effectiveAi.apiKey ? '🟢 已配置' : (effectiveAi.provider === 'workers-ai' ? '🟢 免密运行' : '⚪ 未绑定')}`,
          ``,
          `✅ <b>已清除自定义 API Key，已恢复初始设置！</b>`,
        ].join('\n');
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getAiMenuKeyboard(cbDict, effectiveAi.provider, effectiveAi.model),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 6. Routes Menu (m:routes)
      if (callbackData === 'm:routes') {
        const rules = await listCustomRules(env.MAIL_ROUTES_KV);
        const customLines = rules.length > 0
          ? rules.map(r => `• <code>${escapeHtml(r.prefix)}</code> ➜ <b>${escapeHtml(cbDict.emailCard.personaTags[r.tag] || r.tag)}</b> <i>(${escapeHtml(r.forwardEmail || '默认备份')})</i>`).join('\n')
          : `<i>${cbDict.routesCommand.noCustomRules}</i>`;

        const card = [
          cbDict.dashboard.routesTitle,
          `━━━━━━━━━━━━━━━━━━`,
          `<b>自定义业务规则 (优先匹配):</b>`,
          customLines,
          ``,
          `<b>系统默认基线:</b>`,
          `• <code>support/help/service</code> ➜ <b>客服</b>`,
          `• <code>sales/billing/business</code> ➜ <b>商务</b>`,
          `• <code>admin/me/i/hi/blog</code> ➜ <b>个人</b>`,
          `• <code>product/feedback/app</code> ➜ <b>产品</b>`,
          `• <i>其他未定义前缀</i> ➜ <b>通用</b>`,
          `━━━━━━━━━━━━━━━━━━`,
          `<i>💡 点击【➕ 添加分流规则】或下方【🗑️ 删除】按钮快捷管理：</i>`,
        ].join('\n');

        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getRoutesMenuKeyboard(cbDict, rules),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 6.1 Tags Management Menu (m:tags)
      if (callbackData === 'm:tags') {
        const customTags = await getCustomTags(env.MAIL_ROUTES_KV);
        const card = [
          cbDict.dashboard.tagsTitle || '🏷️ <b>【 业务分类标签管理 】</b>',
          `━━━━━━━━━━━━━━━━━━`,
          cbDict.dashboard.tagsPrompt || '在此管理您的自定义业务分类标签。这些标签可在添加前缀分流规则时使用：',
          ``,
          `• <b>系统默认基准:</b> <code>个人</code> · <code>客服</code> · <code>商务</code> · <code>产品</code> · <code>通用</code>`,
          `• <b>自定义扩展标签:</b> ${customTags.length > 0 ? customTags.map(t => `<code>${escapeHtml(t)}</code>`).join(' · ') : `<i>${cbDict.dashboard.tagsEmpty || '暂无自定义标签'}</i>`}`,
          ``,
          `<i>💡 点击【➕ 新增标签】添加专属标签，或点击下方【🗑️ 删除】移除自定义标签：</i>`,
        ].join('\n');

        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getTagsMenuKeyboard(cbDict, customTags),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 6.2 Add Tag Prompt (ta:start)
      if (callbackData === 'ta:start') {
        if (env.MAIL_ROUTES_KV) {
          await setInteractiveSession(env.MAIL_ROUTES_KV, {
            type: 'add_custom_tag',
          });
        }
        const card = [
          cbDict.dashboard.tagsAddPrompt ||
            '🏷️ <b>【 添加自定义标签 】</b>\n━━━━━━━━━━━━━━━━━━\n请直接回复您想要创建的业务标签名称（例如：<code>财务</code>、<code>监控</code>、<code>内部</code>，10字以内）：',
        ].join('\n');

        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: [[{ text: cbDict.dashboard.btnCancel, callback_data: 'm:tags' }]],
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 6.3 Delete Tag (td:<tag>)
      if (callbackData.startsWith('td:')) {
        const tag = callbackData.slice('td:'.length);
        await deleteCustomTag(env.MAIL_ROUTES_KV, tag);
        await answerCallbackQuery(botToken, callbackId, `已删除标签: ${tag}`);
        const customTags = await getCustomTags(env.MAIL_ROUTES_KV);
        const card = [
          cbDict.dashboard.tagsTitle || '🏷️ <b>【 业务分类标签管理 】</b>',
          `━━━━━━━━━━━━━━━━━━`,
          cbDict.dashboard.tagsDeleteSuccess ? cbDict.dashboard.tagsDeleteSuccess(escapeHtml(tag)) : `✅ 已删除自定义标签: <b>【${escapeHtml(tag)}】</b>！`,
          ``,
          `• <b>系统默认基准:</b> <code>个人</code> · <code>客服</code> · <code>商务</code> · <code>产品</code> · <code>通用</code>`,
          `• <b>自定义扩展标签:</b> ${customTags.length > 0 ? customTags.map(t => `<code>${escapeHtml(t)}</code>`).join(' · ') : `<i>${cbDict.dashboard.tagsEmpty || '暂无自定义标签'}</i>`}`,
        ].join('\n');

        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getTagsMenuKeyboard(cbDict, customTags),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 7. Route Add Step 1 (ra:start)
      if (callbackData === 'ra:start') {
        const customTags = await getCustomTags(env.MAIL_ROUTES_KV);
        const card = [
          `➕ <b>【 添加新路由规则 · 第一步 】</b>`,
          `━━━━━━━━━━━━━━━━━━`,
          cbDict.dashboard.routesSelectTagPrompt,
        ].join('\n');

        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getRouteTagSelectionKeyboard(cbDict, customTags),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 8. Route Add Step 2 (ra:tag:<tag>)
      if (callbackData.startsWith('ra:tag:')) {
        const tag = callbackData.slice('ra:tag:'.length);
        if (env.MAIL_ROUTES_KV) {
          await setInteractiveSession(env.MAIL_ROUTES_KV, {
            type: 'add_route_prefix',
            tag,
          });
        }
        const localizedTag = cbDict.emailCard.personaTags[tag] || tag;
        const card = [
          `➕ <b>【 添加新路由规则 · 第二步 】</b>`,
          `━━━━━━━━━━━━━━━━━━`,
          cbDict.dashboard.routesInputPrefixPrompt(localizedTag),
        ].join('\n');

        await answerCallbackQuery(botToken, callbackId, `已选分类: ${localizedTag}`);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: [[{ text: cbDict.dashboard.btnCancel, callback_data: 'm:routes' }]],
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 9. Route Direct Delete (rd:<prefix>)
      if (callbackData.startsWith('rd:')) {
        const prefix = callbackData.slice('rd:'.length);
        const deleted = await deleteCustomRule(env.MAIL_ROUTES_KV, prefix);
        await answerCallbackQuery(botToken, callbackId, deleted ? cbDict.routesCommand.delAlertDeleted : cbDict.routesCommand.delAlertNotFound);
        const rules = await listCustomRules(env.MAIL_ROUTES_KV);

        const customLines = rules.length > 0
          ? rules.map(r => `• <code>${escapeHtml(r.prefix)}</code> ➜ <b>${escapeHtml(cbDict.emailCard.personaTags[r.tag] || r.tag)}</b> <i>(${escapeHtml(r.forwardEmail || '默认备份')})</i>`).join('\n')
          : `<i>${cbDict.routesCommand.noCustomRules}</i>`;

        const card = [
          cbDict.dashboard.routesTitle,
          `━━━━━━━━━━━━━━━━━━`,
          cbDict.dashboard.routesDeletedSuccess(escapeHtml(prefix)),
          ``,
          `<b>自定义业务规则 (优先匹配):</b>`,
          customLines,
        ].join('\n');

        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getRoutesMenuKeyboard(cbDict, rules),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 10. Keywords Menu (m:kw)
      if (callbackData === 'm:kw') {
        const kws = await getMarketingKeywords(env.MAIL_ROUTES_KV);
        const card = [
          cbDict.dashboard.kwTitle,
          `━━━━━━━━━━━━━━━━━━`,
          cbDict.keywordsCommand.countDesc(kws.length),
          ``,
          `<b>词库预览 (前15个):</b>`,
          `<code>${escapeHtml(kws.slice(0, 15).join('、'))}${kws.length > 15 ? ' ...' : ''}</code>`,
          ``,
          `<i>💡 发送 <code>/addkw 词1 词2</code> 可追加新词；或点击下方按钮重置：</i>`,
        ].join('\n');

        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getKeywordsMenuKeyboard(cbDict),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 11. Keywords Full View (kw:view)
      if (callbackData === 'kw:view') {
        const kws = await getMarketingKeywords(env.MAIL_ROUTES_KV);
        const card = [
          `📋 <b>【 营销拦截词库完整列表 (共 ${kws.length} 个) 】</b>`,
          `━━━━━━━━━━━━━━━━━━`,
          `<code>${escapeHtml(kws.join('、'))}</code>`,
        ].join('\n');

        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: [[{ text: cbDict.dashboard.btnBackMain, callback_data: 'm:kw' }]],
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 12. Keywords Reset (kw:reset_confirm)
      if (callbackData === 'kw:reset_confirm') {
        await resetMarketingKeywords(env.MAIL_ROUTES_KV);
        const kws = await getMarketingKeywords(env.MAIL_ROUTES_KV);
        await answerCallbackQuery(botToken, callbackId, '已恢复系统默认词库');

        const card = [
          cbDict.dashboard.kwTitle,
          `━━━━━━━━━━━━━━━━━━`,
          `✅ <b>已重置为默认拦截词库！</b>`,
          cbDict.keywordsCommand.countDesc(kws.length),
          ``,
          `<b>词库预览 (前15个):</b>`,
          `<code>${escapeHtml(kws.slice(0, 15).join('、'))}${kws.length > 15 ? ' ...' : ''}</code>`,
        ].join('\n');

        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getKeywordsMenuKeyboard(cbDict),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 12.3 Add Marketing Keywords (kw:add_start)
      if (callbackData === 'kw:add_start') {
        if (!env?.MAIL_ROUTES_KV) {
          await answerCallbackQuery(botToken, callbackId, cbDict.keywordsCommand.kvError);
          return new Response('OK', { status: 200 });
        }
        await setInteractiveSession(env.MAIL_ROUTES_KV, {
          type: 'add_keywords',
          step: 1,
          createdAt: Date.now(),
        });
        await answerCallbackQuery(botToken, callbackId);
        await sendTelegramMessage(
          botToken,
          adminChatId,
          `🚫 <b>【 追加营销拦截词 】</b>\n━━━━━━━━━━━━━━━━━━\n请直接回复您想要追加的关键词（一行一个，或以逗号/空格分隔）：`,
          {
            inline_keyboard: [[{ text: cbDict.dashboard.btnCancel, callback_data: 'm:cancel' }]],
          }
        );
        return new Response('OK', { status: 200 });
      }

      // 13. Forwarding Menu (m:fwd)
      if (callbackData === 'm:fwd') {
        const fwd = (await getDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email')) || env.FORWARD_TO_EMAIL || '';
        const aliasesActive = String((await getDynamicConfig(env.MAIL_ROUTES_KV, 'enable_gmail_aliases')) ?? env.ENABLE_GMAIL_ALIASES ?? 'true').toLowerCase() === 'true';

        const card = [
          cbDict.dashboard.fwdTitle,
          `━━━━━━━━━━━━━━━━━━`,
          `• 备份转发目标: ${fwd ? `<code>${escapeHtml(fwd)}</code>` : '⚪ 纯TG模式 (未设置)'}`,
          `• Gmail 别名路由 (+tag): ${aliasesActive ? '🟢 已启用' : '⚪ 已停用'}`,
          ``,
          `<i>💡 如需修改转发邮箱，可发送 <code>/setkey forward &lt;email&gt;</code>；轻触下方按钮可直接切换 Gmail 别名：</i>`,
        ].join('\n');

        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getForwardMenuKeyboard(cbDict, aliasesActive),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 14. Forwarding Toggle Alias (fwd:toggle_alias)
      if (callbackData === 'fwd:toggle_alias') {
        const cur = String((await getDynamicConfig(env.MAIL_ROUTES_KV, 'enable_gmail_aliases')) ?? env.ENABLE_GMAIL_ALIASES ?? 'true').toLowerCase() === 'true';
        const next = !cur;
        if (env.MAIL_ROUTES_KV) {
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'enable_gmail_aliases', String(next));
        }
        await answerCallbackQuery(botToken, callbackId, next ? '已开启 Gmail 别名 (+tag)' : '已停用 Gmail 别名');

        const fwd = (await getDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email')) || env.FORWARD_TO_EMAIL || '';
        const card = [
          cbDict.dashboard.fwdTitle,
          `━━━━━━━━━━━━━━━━━━`,
          `• 备份转发目标: ${fwd ? `<code>${escapeHtml(fwd)}</code>` : '⚪ 纯TG模式 (未设置)'}`,
          `• Gmail 别名路由 (+tag): ${next ? '🟢 已启用' : '⚪ 已停用'}`,
          ``,
          `<i>💡 如需修改转发邮箱，可发送 <code>/setkey forward &lt;email&gt;</code>；轻触下方按钮可直接切换 Gmail 别名：</i>`,
        ].join('\n');

        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getForwardMenuKeyboard(cbDict, next),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 14.1 Set Forward Email (fwd:set_start)
      if (callbackData === 'fwd:set_start') {
        if (!env?.MAIL_ROUTES_KV) {
          await answerCallbackQuery(botToken, callbackId, cbDict.setkeyCommand.kvError);
          return new Response('OK', { status: 200 });
        }
        await setInteractiveSession(env.MAIL_ROUTES_KV, {
          type: 'set_forward_email',
          step: 1,
          createdAt: Date.now(),
        });
        await answerCallbackQuery(botToken, callbackId);
        await sendTelegramMessage(
          botToken,
          adminChatId,
          `📬 <b>【 修改备份转发邮箱 】</b>\n━━━━━━━━━━━━━━━━━━\n请直接回复您的新目标邮箱（例如: <code>yourname@gmail.com</code>）：\n<i>（⚠️ 注意: 请确保该邮箱已在 Cloudflare Email Routing 中完成验证）</i>`,
          {
            inline_keyboard: [[{ text: cbDict.dashboard.btnCancel, callback_data: 'm:cancel' }]],
          }
        );
        return new Response('OK', { status: 200 });
      }

      // 14.2 Reset Forward Email (fwd:reset_confirm)
      if (callbackData === 'fwd:reset_confirm') {
        if (!env?.MAIL_ROUTES_KV) {
          await answerCallbackQuery(botToken, callbackId, cbDict.setkeyCommand.kvError);
          return new Response('OK', { status: 200 });
        }
        await deleteDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email');
        await answerCallbackQuery(botToken, callbackId, '已清除备份邮箱，已回退为单轨纯TG模式');
        const fwd = (await getDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email')) || env.FORWARD_TO_EMAIL || '';
        const aliasesActive = String((await getDynamicConfig(env.MAIL_ROUTES_KV, 'enable_gmail_aliases')) ?? env.ENABLE_GMAIL_ALIASES ?? 'true').toLowerCase() === 'true';
        const card = [
          cbDict.dashboard.fwdTitle,
          `━━━━━━━━━━━━━━━━━━`,
          `• 备份转发目标: ${fwd ? `<code>${escapeHtml(fwd)}</code>` : '⚪ 纯TG模式 (未设置)'}`,
          `• Gmail 别名路由 (+tag): ${aliasesActive ? '🟢 已启用' : '⚪ 已停用'}`,
          ``,
          `✅ <b>已清除自定义备份邮箱！</b>`,
        ].join('\n');
        if (messageId) {
          await editMessageText(botToken, adminChatId, messageId, card, {
            inline_keyboard: getForwardMenuKeyboard(cbDict, aliasesActive),
          });
        }
        return new Response('OK', { status: 200 });
      }

      // 15. Language Menu (m:lang)
      if (callbackData === 'm:lang') {
        await answerCallbackQuery(botToken, callbackId);
        if (messageId) {
          await editMessageText(
            botToken,
            adminChatId,
            messageId,
            `${cbDict.langCommand.selectPrompt}${cbDict.langCommand.currentLang(cbDict.langName)}`,
            { inline_keyboard: getLanguageKeyboard(cbLang, true, cbDict.dashboard.btnBackMain) }
          );
        }
        return new Response('OK', { status: 200 });
      }

      // Handle language switching buttons
      if (callbackData.startsWith('lang:')) {
        const targetLang = callbackData.slice('lang:'.length);
        const normalized = normalizeLanguage(targetLang);
        if (normalized) {
          if (env.MAIL_ROUTES_KV) {
            await setDynamicConfig(env.MAIL_ROUTES_KV, 'system_language', normalized);
            await ensureLanguageKeywords(env.MAIL_ROUTES_KV, normalized);
          }
          const newDict = getTranslation(normalized);
          await answerCallbackQuery(botToken, callbackId, newDict.langCommand.successAlert(newDict.langName));
          if (messageId) {
            await editMessageText(
              botToken,
              adminChatId,
              messageId,
              newDict.langCommand.successCard(newDict.langName),
              { inline_keyboard: [[{ text: newDict.dashboard.btnBackMain, callback_data: 'm:main' }]] }
            );
          }
          try {
            await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(getCommandsPayload(normalized)),
            });
          } catch {}
        }
        return new Response('OK', { status: 200 });
      }

      if (callbackData.startsWith('del_confirm:')) {
        const prefix = callbackData.slice('del_confirm:'.length);
        const deleted = await deleteCustomRule(env.MAIL_ROUTES_KV, prefix);
        await answerCallbackQuery(botToken, callbackId, deleted ? cbDict.routesCommand.delAlertDeleted : cbDict.routesCommand.delAlertNotFound);
        if (messageId) {
          await editMessageText(
            botToken,
            adminChatId,
            messageId,
            deleted
              ? cbDict.routesCommand.delSuccessText(escapeHtml(prefix))
              : cbDict.routesCommand.delNotFoundText(escapeHtml(prefix))
          );
        }
        return new Response('OK', { status: 200 });
      }

      if (callbackData.startsWith('del_cancel:')) {
        const prefix = callbackData.slice('del_cancel:'.length);
        await answerCallbackQuery(botToken, callbackId, cbDict.routesCommand.delAlertCancelled);
        if (messageId) {
          await editMessageText(
            botToken,
            adminChatId,
            messageId,
            cbDict.routesCommand.delCancelledText(escapeHtml(prefix))
          );
        }
        return new Response('OK', { status: 200 });
      }

      return new Response('OK', { status: 200 });
    }

    // 2. Process text commands
    if (update.message) {
      const fromId = String(update.message.from?.id);
      if (fromId !== adminChatId) {
        return new Response('OK', { status: 200 });
      }

      const rawText = (update.message.text || '').trim();
      const isReply = Boolean(update.message.reply_to_message);
      const replyText = update.message.reply_to_message?.text || '';

      const isCommand = rawText.startsWith('/');
      const text = isCommand ? rawText.slice(1).trim() : rawText;
      const parts = text.split(/\s+/).filter(Boolean);
      const command = (parts[0] || '').toLowerCase();

      // Resolve effective language
      const userTgLang = update.message.from?.language_code;
      const currentLang = await resolveLanguage(env?.MAIL_ROUTES_KV, env?.DEFAULT_LANGUAGE, userTgLang);
      const dict = getTranslation(currentLang);

      // Check if replying directly to marketing keywords list
      const isKeywordReply =
        isReply &&
        (replyText.includes('营销推广拦截关键词') ||
          replyText.includes('营销关键词') ||
          replyText.includes('Marketing') ||
          replyText.includes('キーワード') ||
          replyText.includes('стоп-слов') ||
          replyText.includes('Schlüsselwörter'));

      // Command: lang / language (多语言切换 / Switch language)
      if (command === 'lang' || command === 'language') {
        const arg = parts[1];
        if (!arg) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `${dict.langCommand.selectPrompt}${dict.langCommand.currentLang(dict.langName)}`,
            {
              inline_keyboard: getLanguageKeyboard(currentLang),
            }
          );
          return new Response('OK', { status: 200 });
        }

        const normalized = normalizeLanguage(arg);
        if (!normalized) {
          await sendTelegramMessage(botToken, adminChatId, dict.langCommand.invalidArg);
          return new Response('OK', { status: 200 });
        }

        if (env?.MAIL_ROUTES_KV) {
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'system_language', normalized);
          await ensureLanguageKeywords(env.MAIL_ROUTES_KV, normalized);
        }
        const newDict = getTranslation(normalized);
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getCommandsPayload(normalized)),
          });
        } catch {}

        await sendTelegramMessage(botToken, adminChatId, newDict.langCommand.successCard(newDict.langName));
        return new Response('OK', { status: 200 });
      }

      // Command: setup (交互式极速配置向导)
      if (command === 'setup') {
        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.setupCommand.kvRequiredError
          );
          return new Response('OK', { status: 200 });
        }

        await setSetupSession(env.MAIL_ROUTES_KV, 1);
        await sendTelegramMessage(
          botToken,
          adminChatId,
          dict.setupCommand.startWizardText,
          {
            inline_keyboard: [[{ text: dict.dashboard.btnCancel, callback_data: 'm:cancel' }]],
          }
        );
        return new Response('OK', { status: 200 });
      }

      // Command: cancel (退出当前向导或会话)
      if (command === 'cancel') {
        if (env?.MAIL_ROUTES_KV) {
          await clearSetupSession(env.MAIL_ROUTES_KV);
          await clearInteractiveSession(env.MAIL_ROUTES_KV);
        }
        await sendTelegramMessage(
          botToken,
          adminChatId,
          dict.setupCommand.cancelSuccess
        );
        return new Response('OK', { status: 200 });
      }

      // Command: provider / ai (选择大模型厂商)
      if (command === 'provider' || command === 'ai') {
        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, dict.providerCommand.kvError);
          return new Response('OK', { status: 200 });
        }

        const effectiveAi = await getEffectiveAiConfig(env, env.MAIL_ROUTES_KV);
        const currentMeta = findProvider(effectiveAi.provider);
        const currentProviderName = currentMeta?.name || effectiveAi.provider;
        const currentModelName = effectiveAi.model || currentMeta?.defaultModel || 'default';

        // Check if user passed arguments directly (e.g. /provider 2 or /provider deepseek)
        const directArg = parts.slice(1).join(' ').trim();
        if (directArg) {
          const matched = findProvider(directArg);
          if (!matched) {
            await sendTelegramMessage(botToken, adminChatId, dict.providerCommand.invalidOption);
            return new Response('OK', { status: 200 });
          }

          await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_provider', matched.id);
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_model', matched.defaultModel);
          await clearInteractiveSession(env.MAIL_ROUTES_KV);

          const note = matched.isFreeOrNoKey
            ? '• 运行状态: 🟢 原生免密钥就绪 (完全免费)'
            : dict.providerCommand.tipSetKey;

          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.providerCommand.success(matched.name, matched.defaultModel, note)
          );
          return new Response('OK', { status: 200 });
        }

        // Interactive numbered prompt (1 to 9)
        const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        const listLines = SUPPORTED_PROVIDERS.map((p, idx) => {
          const emoji = numberEmojis[idx] || `[${p.index}]`;
          const activeMark = p.id === effectiveAi.provider ? ' ✓ [当前]' : '';
          return `${emoji} <b>${escapeHtml(p.name)}</b> ${p.badge}${activeMark}`;
        }).join('\n');

        const card = [
          dict.providerCommand.title,
          dict.providerCommand.current(escapeHtml(currentProviderName), escapeHtml(currentModelName)),
          `━━━━━━━━━━━━━━━━━━`,
          dict.providerCommand.prompt,
          ``,
          listLines,
          ``,
          `💡 <i>直接回复数字 <b>1~9</b> 即可完成切换，发送 /cancel 退出。</i>`,
        ]
          .filter(Boolean)
          .join('\n');

        await setInteractiveSession(env.MAIL_ROUTES_KV, { type: 'select_provider' });
        await sendTelegramMessage(botToken, adminChatId, card);
        return new Response('OK', { status: 200 });
      }

      // Command: model / setmodel (选择模型版本)
      if (command === 'model' || command === 'setmodel') {
        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, dict.modelCommand.kvError);
          return new Response('OK', { status: 200 });
        }

        const effectiveAi = await getEffectiveAiConfig(env, env.MAIL_ROUTES_KV);
        const currentMeta = findProvider(effectiveAi.provider);
        const currentProviderName = currentMeta?.name || effectiveAi.provider;
        const currentModelName = effectiveAi.model || currentMeta?.defaultModel || 'default';

        // Check direct argument (e.g. /model 1 or /model deepseek-chat)
        const directArg = parts.slice(1).join(' ').trim();
        if (directArg) {
          let chosenModel = directArg;
          const num = parseInt(directArg, 10);
          if (!isNaN(num) && currentMeta && num >= 1 && num <= currentMeta.models.length) {
            chosenModel = currentMeta.models[num - 1].id;
          }

          await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_model', chosenModel);
          await clearInteractiveSession(env.MAIL_ROUTES_KV);

          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.modelCommand.success(escapeHtml(chosenModel))
          );
          return new Response('OK', { status: 200 });
        }

        // Interactive model options for current provider
        const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
        const isZh = dict.langCode.startsWith('zh');
        const modelsList = (currentMeta?.models || []).map((m, idx) => {
          const emoji = numberEmojis[idx] || `[${idx + 1}]`;
          const star = m.isRecommended ? ' ⭐ [推荐]' : '';
          const active = m.id === currentModelName ? ' ✓ [当前]' : '';
          const desc = isZh ? m.descriptionZh : m.descriptionEn;
          return `${emoji} <code>${escapeHtml(m.id)}</code>${star}${active}\n   • <i>${escapeHtml(desc)}</i>`;
        }).join('\n\n');

        const card = [
          dict.modelCommand.title(escapeHtml(currentProviderName)),
          dict.modelCommand.current(escapeHtml(currentModelName)),
          `━━━━━━━━━━━━━━━━━━`,
          dict.modelCommand.prompt,
          ``,
          modelsList || `(暂无预设列表，请直接回复模型名称)`,
          ``,
          `💡 <i>直接回复数字 <b>1~${currentMeta?.models.length || 1}</b> 或输入自定义模型名，发送 /cancel 退出。</i>`,
        ]
          .filter(Boolean)
          .join('\n');

        await setInteractiveSession(env.MAIL_ROUTES_KV, {
          type: 'select_model',
          provider: effectiveAi.provider,
        });
        await sendTelegramMessage(botToken, adminChatId, card);
        return new Response('OK', { status: 200 });
      }

      // If user enters any standard slash command during setup wizard or interactive session, gracefully exit
      if (isCommand && env?.MAIL_ROUTES_KV) {
        const activeStep = await getSetupSession(env.MAIL_ROUTES_KV);
        if (activeStep !== null) {
          await clearSetupSession(env.MAIL_ROUTES_KV);
        }
        const activeSession = await getInteractiveSession(env.MAIL_ROUTES_KV);
        if (activeSession !== null) {
          await clearInteractiveSession(env.MAIL_ROUTES_KV);
        }
      }

      // Handle interactive text replies (when message is NOT a command and NOT a keyword reply)
      if (!isCommand && !isKeywordReply && env?.MAIL_ROUTES_KV) {
        // 1. General Interactive Session (Provider / Model selection)
        const interactiveSession = await getInteractiveSession(env.MAIL_ROUTES_KV);
        if (interactiveSession) {
          if (interactiveSession.type === 'select_provider') {
            const rawChoice = rawText.trim();
            const matchedProvider = findProvider(rawChoice);
            if (!matchedProvider) {
              await sendTelegramMessage(botToken, adminChatId, dict.providerCommand.invalidOption);
              return new Response('OK', { status: 200 });
            }

            await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_provider', matchedProvider.id);
            await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_model', matchedProvider.defaultModel);
            await clearInteractiveSession(env.MAIL_ROUTES_KV);

            const note = matchedProvider.isFreeOrNoKey
              ? '• 运行状态: 🟢 原生免密钥就绪 (完全免费)'
              : dict.providerCommand.tipSetKey;

            await sendTelegramMessage(
              botToken,
              adminChatId,
              dict.providerCommand.success(matchedProvider.name, matchedProvider.defaultModel, note)
            );
            return new Response('OK', { status: 200 });
          }

          if (interactiveSession.type === 'select_model') {
            const rawChoice = rawText.trim();
            const providerMeta = findProvider(interactiveSession.provider || 'deepseek');
            let chosenModel = rawChoice;

            const num = parseInt(rawChoice, 10);
            if (!isNaN(num) && providerMeta && num >= 1 && num <= providerMeta.models.length) {
              chosenModel = providerMeta.models[num - 1].id;
            }

            if (!chosenModel) {
              await sendTelegramMessage(botToken, adminChatId, dict.modelCommand.invalidOption);
              return new Response('OK', { status: 200 });
            }

            await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_model', chosenModel);
            await clearInteractiveSession(env.MAIL_ROUTES_KV);

            await sendTelegramMessage(
              botToken,
              adminChatId,
              dict.modelCommand.success(chosenModel)
            );
            return new Response('OK', { status: 200 });
          }

          if (interactiveSession.type === 'add_route_prefix') {
            const chosenTag = interactiveSession.tag || '通用';
            const inputParts = rawText.trim().split(/\s+/).filter(Boolean);
            const prefix = (inputParts[0] || '').toLowerCase().replace(/^@+/, '');
            const forwardEmail = inputParts[1] || '';

            if (!prefix || !/^[a-zA-Z0-9._-]+$/.test(prefix)) {
              await sendTelegramMessage(botToken, adminChatId, dict.routesCommand.addInvalidPrefix(escapeHtml(rawText)));
              return new Response('OK', { status: 200 });
            }

            await addCustomRule(env.MAIL_ROUTES_KV, {
              prefix,
              tag: chosenTag,
              forwardEmail,
            });
            await clearInteractiveSession(env.MAIL_ROUTES_KV);

            const localizedTag = dict.emailCard.personaTags[chosenTag] || chosenTag;
            await sendTelegramMessage(
              botToken,
              adminChatId,
              dict.dashboard.routesAddSuccess(escapeHtml(prefix), escapeHtml(localizedTag), escapeHtml(forwardEmail || '默认备份邮箱')),
              {
                inline_keyboard: [[{ text: dict.dashboard.btnRoutes, callback_data: 'm:routes' }]],
              }
            );
            return new Response('OK', { status: 200 });
          }

          if (interactiveSession.type === 'add_custom_tag') {
            const tagInput = rawText.trim().replace(/[#\s]/g, '');
            if (!tagInput || tagInput.length > 10) {
              await sendTelegramMessage(
                botToken,
                adminChatId,
                dict.dashboard.tagsInvalid || '❌ 标签名称无效或已存在（必须为1-10个字符且不含空格）。'
              );
              return new Response('OK', { status: 200 });
            }

            await addCustomTag(env.MAIL_ROUTES_KV, tagInput);
            await clearInteractiveSession(env.MAIL_ROUTES_KV);

            const successMsg = dict.dashboard.tagsAddSuccess
              ? dict.dashboard.tagsAddSuccess(escapeHtml(tagInput))
              : `✅ 成功添加自定义标签: <b>【${escapeHtml(tagInput)}】</b>！`;

            await sendTelegramMessage(
              botToken,
              adminChatId,
              successMsg,
              {
                inline_keyboard: [
                  [
                    { text: dict.dashboard.btnTags || '🏷️ 标签管理', callback_data: 'm:tags' },
                    { text: dict.dashboard.btnAddRoute, callback_data: 'ra:start' },
                  ],
                ],
              }
            );
            return new Response('OK', { status: 200 });
          }

          if (interactiveSession.type === 'set_ai_key') {
            const cleanKey = rawText.trim().replace(/^['"]|['"]$/g, '');
            if (!cleanKey) {
              await sendTelegramMessage(botToken, adminChatId, '❌ Key 不能为空，请重新回复有效的 API Key:');
              return new Response('OK', { status: 200 });
            }
            await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_api_key', cleanKey);
            await clearInteractiveSession(env.MAIL_ROUTES_KV);
            await sendTelegramMessage(
              botToken,
              adminChatId,
              `✅ <b>大模型 API Key 绑定成功！</b>\n━━━━━━━━━━━━━━━━━━\n已持久化保存至 KV，脱敏预览: <code>${escapeHtml(maskSecret(cleanKey))}</code>\n后续审信将即刻使用新密钥。`,
              {
                inline_keyboard: [
                  [
                    { text: dict.dashboard.btnAi, callback_data: 'm:ai' },
                    { text: dict.dashboard.btnBackMain, callback_data: 'm:main' },
                  ],
                ],
              }
            );
            return new Response('OK', { status: 200 });
          }

          if (interactiveSession.type === 'add_keywords') {
            const lines = rawText
              .split(/\r?\n|[\s,，]+/)
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0 && !s.startsWith('#'));

            if (lines.length === 0) {
              await sendTelegramMessage(botToken, adminChatId, dict.keywordsCommand.emptyError);
              return new Response('OK', { status: 200 });
            }

            const appendResult = await appendMarketingKeywords(env.MAIL_ROUTES_KV, lines);
            await clearInteractiveSession(env.MAIL_ROUTES_KV);

            await sendTelegramMessage(
              botToken,
              adminChatId,
              dict.keywordsCommand.successAppend(
                appendResult.addedCount,
                appendResult.totalCount,
                escapeHtml(lines.join('\n'))
              ),
              {
                inline_keyboard: [
                  [
                    { text: dict.dashboard.btnKeywords, callback_data: 'm:kw' },
                    { text: dict.dashboard.btnBackMain, callback_data: 'm:main' },
                  ],
                ],
              }
            );
            return new Response('OK', { status: 200 });
          }

          if (interactiveSession.type === 'set_forward_email') {
            const targetEmail = rawText.trim();
            if (!isValidEmail(targetEmail)) {
              await sendTelegramMessage(
                botToken,
                adminChatId,
                dict.setupCommand.formatErrorStep1(escapeHtml(targetEmail))
              );
              return new Response('OK', { status: 200 });
            }

            await setDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email', targetEmail);
            await clearInteractiveSession(env.MAIL_ROUTES_KV);

            await sendTelegramMessage(
              botToken,
              adminChatId,
              `✅ <b>备份转发邮箱设置成功！</b>\n━━━━━━━━━━━━━━━━━━\n目标地址: <code>${escapeHtml(targetEmail)}</code>\n来信将自动通过保底轨双轨转递。`,
              {
                inline_keyboard: [
                  [
                    { text: dict.dashboard.btnForward, callback_data: 'm:fwd' },
                    { text: dict.dashboard.btnBackMain, callback_data: 'm:main' },
                  ],
                ],
              }
            );
            return new Response('OK', { status: 200 });
          }
        }

        const setupStep = await getSetupSession(env.MAIL_ROUTES_KV);

        // Step 1: Backup Forward Email
        if (setupStep === 1) {
          if (rawText.toLowerCase() === 'skip') {
            await setSetupSession(env.MAIL_ROUTES_KV, 2);
            await sendTelegramMessage(
              botToken,
              adminChatId,
              dict.setupCommand.skipStep1Text
            );
            return new Response('OK', { status: 200 });
          }

          if (!isValidEmail(rawText)) {
            await sendTelegramMessage(
              botToken,
              adminChatId,
              dict.setupCommand.formatErrorStep1(escapeHtml(rawText))
            );
            return new Response('OK', { status: 200 });
          }

          const emailToSave = rawText.trim();
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email', emailToSave);
          await setSetupSession(env.MAIL_ROUTES_KV, 2);
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.setupCommand.successStep1Text(escapeHtml(emailToSave))
          );
          return new Response('OK', { status: 200 });
        }

        // Step 2: MiniMax API Key
        if (setupStep === 2) {
          if (rawText.toLowerCase() === 'skip') {
            await clearSetupSession(env.MAIL_ROUTES_KV);
            const curFwd =
              (await getDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email')) ||
              env.FORWARD_TO_EMAIL?.trim() ||
              '';
            const curMmx =
              (await getDynamicConfig(env.MAIL_ROUTES_KV, 'minimax_api_key')) ||
              env.MINIMAX_API_KEY?.trim() ||
              '';
            const fwdText = curFwd ? `<code>${escapeHtml(curFwd)}</code>` : dict.setupCommand.notConfiguredPureTg;
            const mmxText = curMmx
              ? dict.setupCommand.readyWithMask(escapeHtml(maskSecret(curMmx)))
              : dict.setupCommand.notConfiguredRegexFallback;

            await sendTelegramMessage(
              botToken,
              adminChatId,
              dict.setupCommand.skipStep2Text(fwdText, mmxText)
            );
            return new Response('OK', { status: 200 });
          }

          const cleanKey = rawText.trim().replace(/^['"]|['"]$/g, '');
          if (cleanKey.length === 0) {
            await sendTelegramMessage(
              botToken,
              adminChatId,
              dict.setupCommand.keyEmptyError
            );
            return new Response('OK', { status: 200 });
          }

          await setDynamicConfig(env.MAIL_ROUTES_KV, 'minimax_api_key', cleanKey);
          await clearSetupSession(env.MAIL_ROUTES_KV);
          const curFwd =
            (await getDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email')) ||
            env.FORWARD_TO_EMAIL?.trim() ||
            '';
          const fwdText = curFwd ? `<code>${escapeHtml(curFwd)}</code>` : dict.setupCommand.notConfiguredPureTg;

          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.setupCommand.successStep2Text(escapeHtml(maskSecret(cleanKey)), fwdText)
          );
          return new Response('OK', { status: 200 });
        }
      }

      // Command: config / keys / status (查看当前密钥配置与网关就绪状态)
      if (command === 'config' || command === 'keys' || command === 'status') {
        const effectiveAi = await getEffectiveAiConfig(env, env?.MAIL_ROUTES_KV);
        const meta = findProvider(effectiveAi.provider);
        const providerName = meta?.name || effectiveAi.provider;
        const modelName = effectiveAi.model || meta?.defaultModel || 'gpt-4o-mini';

        const aiSourceText = effectiveAi.source === 'kv'
          ? dict.sources.kvOverride
          : effectiveAi.source === 'env'
            ? dict.sources.envDefault
            : '';

        let llmStatusText = dict.configCommand.llmNotConfigured;
        if (effectiveAi.isFreeOrNoKey) {
          llmStatusText = dict.configCommand.llmReady('(边缘免密·就绪)');
        } else if (effectiveAi.isConfigured) {
          llmStatusText = dict.configCommand.llmReady(escapeHtml(aiSourceText));
        }

        const dynamicForward = await getDynamicConfig(env?.MAIL_ROUTES_KV, 'forward_to_email');
        const effectiveForward = dynamicForward || env?.FORWARD_TO_EMAIL?.trim() || '';
        const forwardSource = dynamicForward
          ? dict.sources.kvOverride
          : env?.FORWARD_TO_EMAIL
            ? dict.sources.envDefault
            : '';

        const dynamicLang = await getDynamicConfig(env?.MAIL_ROUTES_KV, 'system_language');
        const langSource = dynamicLang
          ? dict.sources.kvOverride
          : env?.DEFAULT_LANGUAGE
            ? dict.sources.envDefault
            : '';

        const keywords = await getMarketingKeywords(env?.MAIL_ROUTES_KV);
        const customRules = await listCustomRules(env?.MAIL_ROUTES_KV);

        const hasKv = Boolean(env?.MAIL_ROUTES_KV);
        const blockAll =
          env?.BLOCK_ALL_ATTACHMENTS === true ||
          String(env?.BLOCK_ALL_ATTACHMENTS || '').toLowerCase() === 'true';
        const maxSizeBytes = Number(env?.MAX_EMAIL_SIZE_BYTES) || 5 * 1024 * 1024;
        const marketingPolicy = env?.MARKETING_TG_POLICY || 'silent';

        const configCard = [
          `🎛️ <b>【 ${dict.configCommand.title} 】</b>`,
          `━━━━━━━━━━━━━━━━━━`,
          dict.configCommand.llmTitle,
          dict.configCommand.llmProvider ? dict.configCommand.llmProvider(escapeHtml(providerName)) : `  • 模型厂商: <b>${escapeHtml(providerName)}</b>`,
          llmStatusText,
          effectiveAi.apiKey ? dict.configCommand.llmMaskedKey(escapeHtml(maskSecret(effectiveAi.apiKey))) : '',
          dict.configCommand.llmModel(escapeHtml(modelName)),
          ``,
          dict.configCommand.forwardTitle,
          effectiveForward
            ? dict.configCommand.forwardTarget(escapeHtml(effectiveForward), escapeHtml(forwardSource))
            : dict.configCommand.forwardNotConfigured,
          String(env?.ENABLE_GMAIL_ALIASES || '').toLowerCase() === 'true'
            ? dict.configCommand.forwardAliasesActive
            : dict.configCommand.forwardAliasesDisabled,
          ``,
          dict.configCommand.kvTitle,
          hasKv ? dict.configCommand.kvConnected : dict.configCommand.kvNotConnected,
          dict.configCommand.kvKeywordsCount(keywords.length),
          dict.configCommand.kvCustomRulesCount(customRules.length),
          ``,
          dict.configCommand.securityTitle,
          blockAll ? dict.configCommand.securityBlockAll : dict.configCommand.securityHighRiskOnly,
          dict.configCommand.securityMaxCap(formatBytes(maxSizeBytes)),
          dict.configCommand.securityMarketingPolicy(marketingPolicy === 'mute' ? 'mute' : 'silent'),
          ``,
          dict.configCommand.systemLangTitle,
          dict.configCommand.systemLangDesc(dict.langName, escapeHtml(langSource)),
          `━━━━━━━━━━━━━━━━━━`,
          dict.configCommand.shortcutsTitle,
          dict.configCommand.shortcutProvider || '• <code>/provider</code> - 交互式切换大模型厂商',
          dict.configCommand.shortcutModel || '• <code>/model</code> - 交互式切换大模型版本',
          dict.configCommand.shortcutSetkeyMinimax,
          dict.configCommand.shortcutSetkeyForward,
          dict.configCommand.shortcutResetkeyMinimax,
          dict.configCommand.shortcutResetkeyForward,
          dict.configCommand.shortcutLang,
        ]
          .filter(Boolean)
          .join('\n');

        await sendTelegramMessage(botToken, adminChatId, configCard);
        return new Response('OK', { status: 200 });
      }

      // Command: setkey (热更新密钥或备份邮箱)
      if (command === 'setkey') {
        const subType = (parts[1] || '').toLowerCase();
        const subVal = parts.slice(2).join(' ').trim();

        if (!subType || !subVal) {
          const aiHelp = dict.setkeyCommand.helpAi || '• <b>更新通用大模型密钥:</b>\n  <code>/setkey ai sk-your-api-key</code>';
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `${dict.setkeyCommand.helpTitle}\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `${dict.setkeyCommand.helpUsage}\n\n` +
              `${aiHelp}\n\n` +
              `${dict.setkeyCommand.helpMinimax}\n\n` +
              `${dict.setkeyCommand.helpForward}\n\n` +
              `${dict.setkeyCommand.helpTip}`
          );
          return new Response('OK', { status: 200 });
        }

        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, dict.setkeyCommand.kvError);
          return new Response('OK', { status: 200 });
        }

        if (subType === 'ai') {
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'ai_api_key', subVal);
          const successMsg = dict.setkeyCommand.successAi
            ? dict.setkeyCommand.successAi(escapeHtml(maskSecret(subVal)))
            : dict.setkeyCommand.successMinimax(escapeHtml(maskSecret(subVal)));
          await sendTelegramMessage(botToken, adminChatId, successMsg);
          return new Response('OK', { status: 200 });
        }

        if (subType === 'minimax') {
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'minimax_api_key', subVal);
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.setkeyCommand.successMinimax(escapeHtml(maskSecret(subVal)))
          );
          return new Response('OK', { status: 200 });
        }

        if (subType === 'forward') {
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email', subVal);
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.setkeyCommand.successForward(escapeHtml(subVal))
          );
          return new Response('OK', { status: 200 });
        }

        await sendTelegramMessage(
          botToken,
          adminChatId,
          dict.setkeyCommand.unsupportedType(escapeHtml(subType))
        );
        return new Response('OK', { status: 200 });
      }

      // Command: resetkey (重置动态密钥并回退)
      if (command === 'resetkey') {
        const subType = (parts[1] || '').toLowerCase();
        const validTypes = ['minimax', 'forward', 'ai', 'provider', 'model'];
        if (!subType || !validTypes.includes(subType)) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `${dict.resetkeyCommand.helpTitle}\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `${dict.resetkeyCommand.helpUsage}\n\n` +
              `${dict.resetkeyCommand.helpDesc}`
          );
          return new Response('OK', { status: 200 });
        }

        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, dict.resetkeyCommand.kvError);
          return new Response('OK', { status: 200 });
        }

        if (subType === 'ai') {
          await deleteDynamicConfig(env.MAIL_ROUTES_KV, 'ai_api_key');
        } else if (subType === 'provider') {
          await deleteDynamicConfig(env.MAIL_ROUTES_KV, 'ai_provider');
          await deleteDynamicConfig(env.MAIL_ROUTES_KV, 'ai_model');
        } else if (subType === 'model') {
          await deleteDynamicConfig(env.MAIL_ROUTES_KV, 'ai_model');
        } else if (subType === 'minimax') {
          await deleteDynamicConfig(env.MAIL_ROUTES_KV, 'minimax_api_key');
        } else if (subType === 'forward') {
          await deleteDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email');
        }

        await sendTelegramMessage(
          botToken,
          adminChatId,
          dict.resetkeyCommand.successReset(subType)
        );
        return new Response('OK', { status: 200 });
      }

      // Command: keywords / kw
      if (command === 'keywords' || command === 'kw') {
        const keywords = await getMarketingKeywords(env?.MAIL_ROUTES_KV);
        await sendTelegramMessage(
          botToken,
          adminChatId,
          `${dict.keywordsCommand.title}\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `${dict.keywordsCommand.countDesc(keywords.length)}\n\n` +
            `${dict.keywordsCommand.instructions}\n\n` +
            `<pre><code>${escapeHtml(keywords.join('\n'))}</code></pre>`,
          {
            force_reply: true,
            selective: true,
          }
        );
        return new Response('OK', { status: 200 });
      }

      // Command: setkeywords / setkw / reply
      if (command === 'setkeywords' || command === 'setkw' || isKeywordReply) {
        let contentToParse = rawText;
        if (command === 'setkeywords' || command === 'setkw') {
          contentToParse = rawText.replace(/^\/?(setkeywords|setkw)\s*/i, '');
        }

        const lines = contentToParse
          .split(/\r?\n/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0 && !s.startsWith('#'));

        if (lines.length === 0) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.keywordsCommand.emptyError
          );
          return new Response('OK', { status: 200 });
        }

        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, dict.keywordsCommand.kvError);
          return new Response('OK', { status: 200 });
        }

        const success = await setMarketingKeywords(env.MAIL_ROUTES_KV, lines);
        if (success) {
          const previewList = lines.slice(0, 15).join(', ');
          const moreCount = lines.length > 15 ? ` 等共 ${lines.length} 个` : '';
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.keywordsCommand.successUpdate(lines.length, escapeHtml(previewList), moreCount)
          );
        } else {
          await sendTelegramMessage(botToken, adminChatId, dict.keywordsCommand.updateError);
        }
        return new Response('OK', { status: 200 });
      }

      // Command: addkeywords / addkw
      if (command === 'addkeywords' || command === 'addkw') {
        const contentToParse = rawText.replace(/^\/?(addkeywords|addkw)\s*/i, '');
        const lines = contentToParse
          .split(/\r?\n/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0 && !s.startsWith('#'));

        if (lines.length === 0) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `${dict.keywordsCommand.addHelpTitle}\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `${dict.keywordsCommand.addHelpUsage}\n\n` +
              `${dict.keywordsCommand.addHelpDesc}`
          );
          return new Response('OK', { status: 200 });
        }

        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, dict.keywordsCommand.kvError);
          return new Response('OK', { status: 200 });
        }

        const appendResult = await appendMarketingKeywords(env.MAIL_ROUTES_KV, lines);
        if (appendResult.success) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.keywordsCommand.successAppend(
              appendResult.addedCount,
              appendResult.totalCount,
              escapeHtml(lines.join('\n'))
            )
          );
        } else {
          await sendTelegramMessage(botToken, adminChatId, dict.keywordsCommand.appendError);
        }
        return new Response('OK', { status: 200 });
      }

      // Command: resetkeywords
      if (command === 'resetkeywords') {
        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, dict.keywordsCommand.kvError);
          return new Response('OK', { status: 200 });
        }
        await resetMarketingKeywords(env.MAIL_ROUTES_KV);
        await sendTelegramMessage(
          botToken,
          adminChatId,
          dict.keywordsCommand.resetSuccess(DEFAULT_MARKETING_KEYWORDS.length)
        );
        return new Response('OK', { status: 200 });
      }

      // Command: add
      if (command === 'add') {
        if (parts.length === 1) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `${dict.routesCommand.addHelpTitle}\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `${dict.routesCommand.addHelpUsage}`
          );
          return new Response('OK', { status: 200 });
        }

        const tagInput = parts[1];
        const prefixInput = parts[2];
        const forwardInput = parts[3];

        if (!prefixInput) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.routesCommand.addMissingPrefix
          );
          return new Response('OK', { status: 200 });
        }

        if (!isValidTag(tagInput)) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.routesCommand.addInvalidTag(ALLOWED_TAGS.join('、'), escapeHtml(tagInput))
          );
          return new Response('OK', { status: 200 });
        }

        const cleanPrefix = prefixInput.toLowerCase().replace(/@.*$/, '').trim();
        if (!cleanPrefix || !/^[a-z0-9._-]+$/i.test(cleanPrefix)) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.routesCommand.addInvalidPrefix(escapeHtml(prefixInput))
          );
          return new Response('OK', { status: 200 });
        }

        const targetForward = forwardInput?.trim() || baseForwardTarget;

        if (!env.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, dict.keywordsCommand.kvError);
          return new Response('OK', { status: 200 });
        }

        await addCustomRule(env.MAIL_ROUTES_KV, {
          prefix: cleanPrefix,
          tag: tagInput,
          forwardEmail: targetForward,
          createdAt: Date.now(),
        });

        await sendTelegramMessage(
          botToken,
          adminChatId,
          dict.routesCommand.addSuccess(cleanPrefix, tagInput, targetForward)
        );
        return new Response('OK', { status: 200 });
      }

      // Command: del
      if (command === 'del') {
        if (parts.length === 1) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `${dict.routesCommand.delHelpTitle}\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `${dict.routesCommand.delHelpUsage}`
          );
          return new Response('OK', { status: 200 });
        }

        const targetPrefix = parts[1].toLowerCase().replace(/@.*$/, '').trim();
        const existing = await getCustomRule(env.MAIL_ROUTES_KV, targetPrefix);

        if (!existing) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            dict.routesCommand.delNotFound(escapeHtml(targetPrefix))
          );
          return new Response('OK', { status: 200 });
        }

        await sendTelegramMessage(
          botToken,
          adminChatId,
          dict.routesCommand.delConfirmPrompt(existing.prefix, existing.tag, existing.forwardEmail || ''),
          {
            inline_keyboard: [
              [
                { text: dict.routesCommand.delBtnConfirm, callback_data: `del_confirm:${existing.prefix}` },
                { text: dict.routesCommand.delBtnCancel, callback_data: `del_cancel:${existing.prefix}` },
              ],
            ],
          }
        );
        return new Response('OK', { status: 200 });
      }

      // Command: routes / list
      if (command === 'routes' || command === 'list') {
        const customRules = await listCustomRules(env.MAIL_ROUTES_KV);
        let customText = '';
        if (customRules.length === 0) {
          customText = dict.routesCommand.noCustomRules;
        } else {
          customText = customRules
            .map(
              (r, i) =>
                `${i + 1}. <code>${escapeHtml(r.prefix)}@*</code> ➔ 🏷️ <b>${r.tag}</b> ➔ <code>${escapeHtml(r.forwardEmail || '默认')}</code>`
            )
            .join('\n');
        }

        const presetText = DEFAULT_PRESET_RULES.map(
          (r) =>
            `• <b>${escapeHtml(r.name)}</b> ➔ 🏷️ <b>${escapeHtml(r.tag)}</b>`
        ).join('\n');

        await sendTelegramMessage(
          botToken,
          adminChatId,
          `${dict.routesCommand.title}\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `${dict.routesCommand.presetBaselineTitle}\n` +
            `${presetText}\n` +
            `${dict.routesCommand.fallbackGeneric}\n\n` +
            `${dict.routesCommand.customRulesTitle}\n` +
            `${customText}`,
          {
            inline_keyboard: getRoutesMenuKeyboard(dict, customRules),
          }
        );
        return new Response('OK', { status: 200 });
      }

      // Command: guide (详细使用指南)
      if (command === 'guide') {
        const guideCard = renderUsageGuideHtml(dict);
        await sendTelegramMessage(botToken, adminChatId, guideCard, {
          inline_keyboard: getUsageGuideKeyboard(dict),
        });
        return new Response('OK', { status: 200 });
      }

      // Command: start (绝对精简、实用主义与完整状态欢迎卡片)
      if (command === 'start') {
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getCommandsPayload(currentLang)),
          });
        } catch {}

        const effectiveAi = await getEffectiveAiConfig(env, env?.MAIL_ROUTES_KV);
        const fwd = (await getDynamicConfig(env?.MAIL_ROUTES_KV, 'forward_to_email')) || env.FORWARD_TO_EMAIL || '';
        const aliasesEnabled = String((await getDynamicConfig(env?.MAIL_ROUTES_KV, 'enable_gmail_aliases')) ?? env.ENABLE_GMAIL_ALIASES ?? 'true').toLowerCase() === 'true';

        const startCard = renderStartCardHtml({
          dict,
          provider: effectiveAi.provider,
          model: effectiveAi.model,
          forwardEmail: fwd,
          gmailAliasesEnabled: aliasesEnabled,
        });

        await sendTelegramMessage(botToken, adminChatId, startCard, {
          inline_keyboard: getStartKeyboard(dict),
        });
        return new Response('OK', { status: 200 });
      }

      // Command: menu / settings / dashboard (交互控制中枢)
      if (command === 'menu' || command === 'settings' || command === 'dashboard') {
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getCommandsPayload(currentLang)),
          });
        } catch {}

        const effectiveAi = await getEffectiveAiConfig(env, env?.MAIL_ROUTES_KV);
        const fwd = (await getDynamicConfig(env?.MAIL_ROUTES_KV, 'forward_to_email')) || env.FORWARD_TO_EMAIL || '';
        const aliasesEnabled = String((await getDynamicConfig(env?.MAIL_ROUTES_KV, 'enable_gmail_aliases')) ?? env.ENABLE_GMAIL_ALIASES ?? 'true').toLowerCase() === 'true';
        const rules = await listCustomRules(env?.MAIL_ROUTES_KV);
        const kws = await getMarketingKeywords(env?.MAIL_ROUTES_KV);

        const card = renderMasterDashboardHtml({
          dict,
          provider: effectiveAi.provider,
          model: effectiveAi.model,
          keyConfigured: Boolean(effectiveAi.apiKey || effectiveAi.provider === 'workers-ai'),
          forwardEmail: fwd,
          gmailAliasesEnabled: aliasesEnabled,
          customRulesCount: rules.length,
          keywordsCount: kws.length,
          langName: dict.langName,
        });

        await sendTelegramMessage(botToken, adminChatId, card, {
          inline_keyboard: getMasterMenuKeyboard(dict),
        });
        return new Response('OK', { status: 200 });
      }

      // Command: help (完整控制面板与指令字典)
      if (command === 'help') {
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getCommandsPayload(currentLang)),
          });
        } catch {}

        await sendTelegramMessage(
          botToken,
          adminChatId,
          `${dict.helpCommand.title}\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `${dict.helpCommand.menuHint}\n\n` +
            `${dict.helpCommand.keysSectionTitle}\n` +
            `${dict.helpCommand.setupDesc}\n` +
            `${dict.helpCommand.cancelDesc}\n` +
            `${dict.helpCommand.configDesc}\n` +
            `${dict.helpCommand.setkeyMinimaxDesc}\n` +
            `${dict.helpCommand.setkeyForwardDesc}\n` +
            `${dict.helpCommand.resetkeyDesc}\n\n` +
            `${dict.helpCommand.keywordsSectionTitle}\n` +
            `${dict.helpCommand.keywordsDesc}\n` +
            `${dict.helpCommand.addkeywordsDesc}\n` +
            `${dict.helpCommand.resetkeywordsDesc}\n\n` +
            `${dict.helpCommand.routesSectionTitle}\n` +
            `${dict.helpCommand.routesDesc}\n` +
            `${dict.helpCommand.addDesc}\n` +
            `${dict.helpCommand.delDesc}\n\n` +
            `${dict.helpCommand.langSectionTitle}\n` +
            `${dict.helpCommand.langDesc}\n\n` +
            `${dict.helpCommand.footerTip}`,
          {
            inline_keyboard: getMasterMenuKeyboard(dict),
          }
        );
        return new Response('OK', { status: 200 });
      }

      return new Response('OK', { status: 200 });
    }

    return new Response('OK', { status: 200 });
  },

  /**
   * Cloudflare Email Routing Entrypoint
   */
  async email(message: any, env: Env, ctx: any): Promise<void> {
    const handleEmail = async () => {
      const botToken = env.TELEGRAM_BOT_TOKEN?.trim();
      const adminChatId = env.TELEGRAM_ADMIN_CHAT_ID?.trim();
      const dynamicForward = await getDynamicConfig(env?.MAIL_ROUTES_KV, 'forward_to_email');
      const baseForwardTarget = dynamicForward || env.FORWARD_TO_EMAIL?.trim() || '';

      const currentLang = await resolveLanguage(env?.MAIL_ROUTES_KV, env?.DEFAULT_LANGUAGE);
      const dict = getTranslation(currentLang);
      const isChinese = currentLang === 'zh-CN' || currentLang === 'zh-TW';

      const to = message.to || '';
      const targetDomain = extractDomain(to);
      const targetName = (to.split('@')[0] || to || 'inbox').trim();

      // Resolve product persona route (KV custom rule -> default preset rule)
      const route = await resolveRouteAsync(to, baseForwardTarget, env.MAIL_ROUTES_KV);
      const targetChatId = route.chatId || adminChatId;

      const useAliases =
        env.ENABLE_GMAIL_ALIASES !== false &&
        String(env.ENABLE_GMAIL_ALIASES || '').toLowerCase() !== 'false';

      let preferredTarget = route.isCustom
        ? route.forwardEmail || baseForwardTarget
        : useAliases && route.forwardEmail
          ? route.forwardEmail
          : baseForwardTarget;

      let from = message.from || dict.emailCard.unknownSender;
      let subject = message.headers?.get?.('subject') || dict.emailCard.noSubject;
      const authHeader = message.headers?.get?.('authentication-results') || '';
      const isSpfPass = /spf=pass/i.test(authHeader);
      const isDkimPass = /dkim=pass/i.test(authHeader);
      const cleanReplyEmail = extractCleanEmail(from);

      let forwardSuccess = false;
      let actualForwardedTo = preferredTarget;
      let forwardError: string | null = null;

      // Native forward helper (Zero-Drop primary delivery)
      const executeNativeForward = async () => {
        if (!preferredTarget) return; // Single-track mode: no backup email configured

        if (typeof message.forward === 'function' && !forwardSuccess) {
          try {
            await message.forward(preferredTarget);
            forwardSuccess = true;
            actualForwardedTo = preferredTarget;
          } catch (aliasErr: any) {
            if (baseForwardTarget && preferredTarget !== baseForwardTarget) {
              console.warn(
                `[EmailWorker] Forward to alias ${preferredTarget} failed, falling back to ${baseForwardTarget}:`,
                aliasErr
              );
              try {
                await message.forward(baseForwardTarget);
                forwardSuccess = true;
                actualForwardedTo = baseForwardTarget;
              } catch (baseErr: any) {
                forwardError = baseErr?.message || String(baseErr);
                console.error(
                  `[EmailWorker] Native message.forward fallback to ${baseForwardTarget} failed:`,
                  baseErr
                );
              }
            } else {
              forwardError = aliasErr?.message || String(aliasErr);
              console.error(
                `[EmailWorker] Native message.forward to ${preferredTarget} failed:`,
                aliasErr
              );
            }
          }
        }
      };

      // Telegram notification helper
      const sendToTelegram = async (
        text: string,
        parseMode?: string,
        disableNotification?: boolean
      ): Promise<boolean> => {
        if (!botToken || !adminChatId) return false;

        const now = Date.now();
        if (now < telegramCircuitBreakerUntil) {
          console.warn('[EmailWorker] Telegram circuit breaker active, skipping card push.');
          return false;
        }

        const tgPayload: Record<string, unknown> = {
          chat_id: targetChatId,
          text,
          disable_web_page_preview: true,
        };
        if (parseMode) {
          tgPayload.parse_mode = parseMode;
        }
        if (route.messageThreadId) {
          tgPayload.message_thread_id = route.messageThreadId;
        }
        if (disableNotification) {
          tgPayload.disable_notification = true;
        }

        try {
          const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tgPayload),
            signal: AbortSignal.timeout(10000),
          });

          if (!response.ok) {
            if (response.status === 429) {
              telegramCircuitBreakerUntil = Date.now() + 30000;
              console.error('[EmailWorker] Telegram API returned HTTP 429. Activated 30s circuit breaker.');
            }
            const errBody = await response.text().catch(() => '');
            console.error(`[EmailWorker] Telegram API returned HTTP ${response.status}:`, errBody);
            return false;
          }
          return true;
        } catch (fetchErr) {
          console.error('[EmailWorker] Failed to send Telegram message:', fetchErr);
          return false;
        }
      };

      // =========================================================================
      // Defense 1: Email Size Cap (SMTP 552 rejection)
      // =========================================================================
      const maxSizeBytes = Number(env.MAX_EMAIL_SIZE_BYTES) || 5 * 1024 * 1024;
      const rawSize = Number(message.rawSize) || 0;

      if (rawSize > maxSizeBytes) {
        console.warn(
          `[EmailWorker] Email size (${formatBytes(rawSize)}) exceeds cap of ${formatBytes(maxSizeBytes)}. Rejecting.`
        );
        if (typeof message.setReject === 'function') {
          message.setReject(
            `552 Message size exceeds administrative limit (${formatBytes(maxSizeBytes)}). Please use cloud storage links.`
          );
        }

        const sizeAlertCard = renderSizeAlertCard({
          dict,
          routeTag: route.tag,
          targetDomain,
          from,
          to,
          rawSize,
          maxSizeBytes,
        });

        await sendToTelegram(sizeAlertCard, 'HTML');
        return;
      }

      // =========================================================================
      // Defense 2: Pre-Parse Rate Limit Check (0.2ms fast exit)
      // =========================================================================
      const rateLimitResult = defaultEmailRateLimiter.check({
        from: cleanReplyEmail || from,
        to,
        isSpfPass,
        isDkimPass,
      });

      if (!rateLimitResult.allowed) {
        console.warn(`[EmailWorker] Pre-parse rate limit triggered: ${rateLimitResult.reason}`);

        await executeNativeForward();

        if (rateLimitResult.shouldNotifySuppression) {
          const warningCard = renderRateLimitCard({
            dict,
            routeTag: route.tag,
            targetDomain,
            from,
            cleanReplyEmail,
            to,
            reason: rateLimitResult.reason,
            forwardSuccess,
            baseForwardTarget,
            actualForwardedTo,
            forwardError,
          });

          await sendToTelegram(warningCard, 'HTML');
        }
        return;
      }

      // =========================================================================
      // Defense 3: MIME Decoding & Attachment Armor
      // =========================================================================
      let snippet = '';
      let attachmentsSummary = '';
      let rawArrayBuffer: ArrayBuffer | null = null;
      let parsedEmail: any = null;

      try {
        if (message.raw) {
          rawArrayBuffer = await new Response(message.raw).arrayBuffer();
          parsedEmail = await PostalMime.parse(rawArrayBuffer);

          if (parsedEmail.subject) {
            subject = parsedEmail.subject;
          }
          if (parsedEmail.from?.address) {
            from = parsedEmail.from.name
              ? `${parsedEmail.from.name} <${parsedEmail.from.address}>`
              : parsedEmail.from.address;
          }
          if (parsedEmail.text?.trim()) {
            snippet = parsedEmail.text.trim();
          } else if (parsedEmail.html?.trim()) {
            snippet = cleanHtmlToText(parsedEmail.html);
          }

          const maxSnippetLength = Number(env.MAX_SNIPPET_LENGTH) || 1500;
          if (snippet.length > maxSnippetLength) {
            snippet = `${snippet.slice(0, maxSnippetLength)}${dict.emailCard.snippetFolded(maxSnippetLength)}`;
          }

          const blockAll =
            env.BLOCK_ALL_ATTACHMENTS === true ||
            String(env.BLOCK_ALL_ATTACHMENTS || '').toLowerCase() === 'true';
          const customBlockedExts = env.BLOCKED_ATTACHMENT_EXTENSIONS
            ? env.BLOCKED_ATTACHMENT_EXTENSIONS.split(',').map((s) => s.trim())
            : undefined;

          const attachmentPolicy = checkAttachmentPolicy(parsedEmail.attachments || [], {
            blockAll,
            blockedExtensions: customBlockedExts,
          });

          if (!attachmentPolicy.allowed) {
            console.warn(`[EmailWorker] Attachment policy violation: ${attachmentPolicy.reason}`);
            if (typeof message.setReject === 'function') {
              message.setReject(attachmentPolicy.reason || '550 Attachments not permitted by policy.');
            }

            const rejectCard = renderAttachmentRejectCard({
              dict,
              routeTag: route.tag,
              targetDomain,
              from,
              to,
              reason: attachmentPolicy.reason,
              detectedAttachments: attachmentPolicy.detectedAttachments,
            });

            await sendToTelegram(rejectCard, 'HTML');
            return;
          }

          if (parsedEmail.attachments && parsedEmail.attachments.length > 0) {
            const attachList = parsedEmail.attachments.slice(0, 3).map((att: any) => {
              const name = att.filename || dict.emailCard.unnamedAttachment;
              let byteLength = 0;
              if (typeof att.content === 'string') {
                byteLength = att.content.length;
              } else if (att.content && 'byteLength' in att.content) {
                byteLength = att.content.byteLength;
              }
              const size = byteLength > 0 ? formatBytes(byteLength) : '';
              return size ? `${name} (${size})` : name;
            });
            const extraCount = parsedEmail.attachments.length - attachList.length;
            attachmentsSummary =
              attachList.join('、') + (extraCount > 0 ? dict.emailCard.attachmentsUnit(parsedEmail.attachments.length) : '');
          }
        }
      } catch (mimeErr) {
        console.warn('[EmailWorker] PostalMime parse failed, falling back to regex parser:', mimeErr);
      }

      // Regex fallback if PostalMime didn't extract text snippet
      const maxSnippetLength = Number(env.MAX_SNIPPET_LENGTH) || 1500;
      if (!snippet) {
        let rawText = '';
        try {
          if (rawArrayBuffer) {
            rawText = new TextDecoder().decode(rawArrayBuffer);
          } else if (message.raw) {
            rawText = await new Response(message.raw).text();
          }
        } catch (textErr) {
          console.warn('[EmailWorker] Failed to read rawText:', textErr);
        }
        snippet = extractTextSnippet(rawText, maxSnippetLength);
      }

      // =========================================================================
      // Defense 4: Multi-tier Intent Triage & Verification Code Sniffer
      // =========================================================================
      let intentTag: EmailIntentTag = '业务';
      let extractedCode: string | undefined;
      let isMarketing = false;
      let aiBadge = '';
      let disableNotification = false;

      const effectiveAi = await getEffectiveAiConfig(env, env.MAIL_ROUTES_KV);
      const hasAI = effectiveAi.isConfigured;

      // 1. Level 1: Protocol short-circuit (RFC 8058 / RFC 2369)
      const getHeader = (name: string): string => {
        if (!message.headers) return '';
        if (typeof message.headers.get === 'function') {
          return message.headers.get(name) || '';
        }
        return message.headers[name.toLowerCase()] || message.headers[name] || '';
      };

      const rfcUnsub = getHeader('list-unsubscribe');
      const rfcPrecedence = getHeader('precedence').toLowerCase();
      const isRfcBulk = Boolean(
        rfcUnsub || rfcPrecedence === 'bulk' || rfcPrecedence === 'list' || rfcPrecedence === 'junk'
      );

      if (isRfcBulk) {
        isMarketing = true;
        intentTag = '营销';
        aiBadge = dict.emailCard.aiRfcUnsubShortCircuit;
        disableNotification = true;
      } else {
        // 2. Level 2: Local & KV Keywords short-circuit
        const marketingKeywords = await getMarketingKeywords(env.MAIL_ROUTES_KV);
        const localResult = detectMarketingEmail(message.headers, subject, snippet, marketingKeywords);

        if (localResult.isMarketing) {
          isMarketing = true;
          intentTag = '营销';
          aiBadge = dict.emailCard.aiKeywordShortCircuit(escapeHtml(
            localResult.matchedKeyword || '营销特征'
          ));
          disableNotification = true;
        } else if (hasAI) {
          // 3. Level 3: Multi-Provider LLM Intent Classification
          const aiResult = await classifyEmail({
            provider: effectiveAi.provider,
            apiKey: effectiveAi.apiKey,
            model: effectiveAi.model,
            baseUrl: effectiveAi.baseUrl,
            groupId: env.MINIMAX_GROUP_ID,
            subject,
            from,
            bodySnippet: snippet.slice(0, 800),
            cfAi: env.AI,
          });

          if (aiResult.success) {
            intentTag = aiResult.intent || '业务';
            isMarketing = aiResult.isMarketing;
            extractedCode = aiResult.extractedCode;

            if (intentTag === '营销') {
              aiBadge = dict.emailCard.aiMarketing;
              disableNotification = true;
            } else if (intentTag === '验证') {
              aiBadge = dict.emailCard.aiVerification;
              disableNotification = false;
            } else if (intentTag === '告警') {
              aiBadge = dict.emailCard.aiSecurity;
              disableNotification = false;
            } else if (intentTag === '账单') {
              aiBadge = dict.emailCard.aiBilling;
              disableNotification = false;
            } else if (intentTag === '通知') {
              aiBadge = dict.emailCard.aiNotification;
              disableNotification = false;
            } else {
              aiBadge = dict.emailCard.aiImportant;
              disableNotification = false;
            }
          } else {
            intentTag = '业务';
            isMarketing = false;
            const errDetail = aiResult.error || '连接异常';
            aiBadge = dict.emailCard.aiErrorFallback(escapeHtml(errDetail));
            disableNotification = false;
          }
        } else {
          // Fallback to local regex sniffer when LLM API Key is omitted
          extractedCode = extractVerificationCode(`${subject}\n${snippet}`);
          if (extractedCode) {
            intentTag = '验证';
            aiBadge = dict.emailCard.aiRegexVerification;
            disableNotification = false;
          }
        }
      }

      if (intentTag === '验证' && !extractedCode) {
        extractedCode = extractVerificationCode(`${subject}\n${snippet}`);
      }

      if (isMarketing && !route.isCustom && useAliases && baseForwardTarget) {
        preferredTarget = buildForwardEmail(baseForwardTarget, 'marketing');
      }

      // Execute primary native forward track
      await executeNativeForward();

      // Assemble Telegram notification card
      let authBadge = dict.emailCard.authUnknown;
      if (isSpfPass && isDkimPass) {
        authBadge = dict.emailCard.authSPFDKIMPass;
      } else if (isSpfPass) {
        authBadge = dict.emailCard.authSPFOnly;
      } else if (isDkimPass) {
        authBadge = dict.emailCard.authDKIMOnly;
      } else {
        authBadge = dict.emailCard.authFailed;
      }

      const cardOptions = {
        dict,
        intentTag,
        targetName,
        extractedCode,
        routeTag: route.tag,
        targetDomain,
        to,
        from,
        cleanReplyEmail,
        authBadge,
        aiBadge,
        subject,
        attachmentsSummary,
        snippet,
        forwardSuccess,
        baseForwardTarget,
        actualForwardedTo,
        forwardError,
      };

      const cardHtml = renderEmailCardHtml(cardOptions);

      const marketingPolicy = env.MARKETING_TG_POLICY || 'silent';
      if (isMarketing && marketingPolicy === 'mute') {
        console.log(`[EmailWorker] Marketing email suppressed from Telegram by policy (${marketingPolicy}): ${subject}`);
        return;
      }

      let sent = await sendToTelegram(cardHtml, 'HTML', disableNotification);

      if (!sent) {
        console.warn('[EmailWorker] HTML sendMessage failed. Retrying with safe plain text fallback...');
        const plainTextFallback = renderEmailCardPlainText(cardOptions);
        await sendToTelegram(plainTextFallback, undefined, disableNotification);
      }
    };

    if (ctx?.waitUntil) {
      ctx.waitUntil(handleEmail());
    } else {
      await handleEmail();
    }
  },
};
