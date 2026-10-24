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
  classifyEmailWithMiniMax,
  sanitizeErrorMessage,
  extractVerificationCode,
  normalizeIntent,
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
  { command: 'lang', description: '切换显示语言 / Switch language' },
  { command: 'setup', description: '一键极速配置向导 (1分钟分步引导)' },
  { command: 'config', description: '查看密钥绑定状态与配置中枢' },
  { command: 'setkey', description: '热更新密钥/备份邮箱: setkey <类型> <值>' },
  { command: 'resetkey', description: '重置动态密钥并回退至默认配置' },
  { command: 'cancel', description: '退出当前向导或交互会话' },
  { command: 'keywords', description: '查看并复制全部营销拦截关键词' },
  { command: 'addkeywords', description: '增量安全追加营销关键词 (不覆盖)' },
  { command: 'resetkeywords', description: '重置营销关键词为系统默认基线' },
  { command: 'routes', description: '查看当前所有域名路由映射与规则' },
  { command: 'add', description: '添加自定义路由规则: add 标签 前缀 [转发目标]' },
  { command: 'del', description: '删除自定义路由规则: del 前缀' },
  { command: 'help', description: '查看网关操作帮助与状态' },
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

async function editMessageText(botToken: string, chatId: string | number, messageId: number, text: string): Promise<boolean> {
  const url = `https://api.telegram.org/bot${botToken}/editMessageText`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'HTML',
      }),
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

      // Handle language switching buttons
      if (callbackData.startsWith('lang:')) {
        const targetLang = callbackData.slice('lang:'.length);
        const normalized = normalizeLanguage(targetLang);
        if (normalized) {
          if (env.MAIL_ROUTES_KV) {
            await setDynamicConfig(env.MAIL_ROUTES_KV, 'system_language', normalized);
          }
          const newDict = getTranslation(normalized);
          await answerCallbackQuery(botToken, callbackId, newDict.langCommand.successAlert(newDict.langName));
          if (messageId) {
            await editMessageText(
              botToken,
              adminChatId,
              messageId,
              newDict.langCommand.successCard(newDict.langName)
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
          dict.setupCommand.startWizardText
        );
        return new Response('OK', { status: 200 });
      }

      // Command: cancel (退出当前向导或会话)
      if (command === 'cancel') {
        if (env?.MAIL_ROUTES_KV) {
          await clearSetupSession(env.MAIL_ROUTES_KV);
        }
        await sendTelegramMessage(
          botToken,
          adminChatId,
          dict.setupCommand.cancelSuccess
        );
        return new Response('OK', { status: 200 });
      }

      // If user enters any standard slash command during setup wizard, gracefully exit wizard session
      if (isCommand && env?.MAIL_ROUTES_KV) {
        const activeStep = await getSetupSession(env.MAIL_ROUTES_KV);
        if (activeStep !== null) {
          await clearSetupSession(env.MAIL_ROUTES_KV);
        }
      }

      // Handle interactive wizard text replies (when message is NOT a command and NOT a keyword reply)
      if (!isCommand && !isKeywordReply && env?.MAIL_ROUTES_KV) {
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
        const dynamicMinimax = await getDynamicConfig(env?.MAIL_ROUTES_KV, 'minimax_api_key');
        const effectiveMinimax = dynamicMinimax || env?.MINIMAX_API_KEY?.trim() || '';
        const minimaxSource = dynamicMinimax
          ? dict.sources.kvOverride
          : env?.MINIMAX_API_KEY
            ? dict.sources.envDefault
            : '';

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
          effectiveMinimax
            ? dict.configCommand.llmReady(escapeHtml(minimaxSource))
            : dict.configCommand.llmNotConfigured,
          effectiveMinimax ? dict.configCommand.llmMaskedKey(escapeHtml(maskSecret(effectiveMinimax))) : '',
          dict.configCommand.llmModel(escapeHtml(env?.MINIMAX_MODEL || 'MiniMax-Text-01')),
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
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `${dict.setkeyCommand.helpTitle}\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `${dict.setkeyCommand.helpUsage}\n\n` +
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
        if (!subType || (subType !== 'minimax' && subType !== 'forward')) {
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

        const configKey = subType === 'minimax' ? 'minimax_api_key' : 'forward_to_email';
        await deleteDynamicConfig(env.MAIL_ROUTES_KV, configKey);
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
            `${customText}`
        );
        return new Response('OK', { status: 200 });
      }

      // Command: start (精简高效分步骤就绪指引)
      if (command === 'start') {
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
          `${dict.startCommand.title}\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `${dict.startCommand.stepGuideTitle}\n\n` +
            `${dict.startCommand.step1Title}\n` +
            `${dict.startCommand.step1Desc}\n\n` +
            `${dict.startCommand.step2Title}\n` +
            `${dict.startCommand.step2Desc1}\n` +
            `${dict.startCommand.step2Desc2}\n\n` +
            `${dict.startCommand.step3Title}\n` +
            `${dict.startCommand.step3Desc1}\n` +
            `${dict.startCommand.step3Desc2}\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `${dict.startCommand.shortcutsTitle}\n` +
            `${dict.startCommand.shortcutSetup}\n` +
            `${dict.startCommand.shortcutConfig}\n` +
            `${dict.startCommand.shortcutKeywords}\n` +
            `${dict.startCommand.shortcutLang}\n` +
            `${dict.startCommand.shortcutHelp}\n\n` +
            `${dict.startCommand.menuActivatedNote}`
        );
        return new Response('OK', { status: 200 });
      }

      // Command: menu / help (完整控制面板与指令字典)
      if (command === 'menu' || command === 'help') {
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
            `${dict.helpCommand.footerTip}`
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

      const dynamicMinimaxKey = await getDynamicConfig(env?.MAIL_ROUTES_KV, 'minimax_api_key');
      const effectiveMinimaxKey = dynamicMinimaxKey || env.MINIMAX_API_KEY?.trim() || '';
      const hasMiniMax = Boolean(effectiveMinimaxKey);

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
        } else if (hasMiniMax) {
          // 3. Level 3: LLM Intent Classification
          const miniMaxResult = await classifyEmailWithMiniMax({
            apiKey: effectiveMinimaxKey,
            groupId: env.MINIMAX_GROUP_ID,
            model: env.MINIMAX_MODEL || 'MiniMax-Text-01',
            apiUrl: env.MINIMAX_API_URL,
            subject,
            from,
            bodySnippet: snippet,
          });

          if (miniMaxResult.success) {
            intentTag = miniMaxResult.intent || '业务';
            isMarketing = miniMaxResult.isMarketing;
            extractedCode = miniMaxResult.extractedCode;

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
            const errDetail = miniMaxResult.error || '连接异常';
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
