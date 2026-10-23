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

// Export core functions and types for external test suites
export {
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
    const baseForwardTarget = env?.FORWARD_TO_EMAIL?.trim() || '';

    // Endpoint helper: One-click setup for Webhook & official Menu button commands
    if ((url.pathname === '/setup-webhook' || url.pathname === '/setup-commands') && botToken) {
      const webhookUrl = `${url.origin}/`;
      try {
        const commandsPayload = {
          commands: BOT_COMMANDS,
        };

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

        const tgRes = await fetch(
          `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`
        );
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

    // 1. Process inline button callbacks (secondary confirmation)
    if (update.callback_query) {
      const fromId = String(update.callback_query.from?.id);
      if (fromId !== adminChatId) {
        return new Response('OK', { status: 200 });
      }

      const callbackId = update.callback_query.id;
      const callbackData = update.callback_query.data || '';
      const messageId = update.callback_query.message?.message_id;

      if (callbackData.startsWith('del_confirm:')) {
        const prefix = callbackData.slice('del_confirm:'.length);
        const deleted = await deleteCustomRule(env.MAIL_ROUTES_KV, prefix);
        await answerCallbackQuery(botToken, callbackId, deleted ? '已从数据库彻底删除' : '未找到该规则');
        if (messageId) {
          await editMessageText(
            botToken,
            adminChatId,
            messageId,
            deleted
              ? `🗑️ <b>已彻底删除规则！</b>\n━━━━━━━━━━━━━━━━━━\n前缀 <code>${escapeHtml(prefix)}</code> 相关的路由与分流配置已完全从数据库抹除。`
              : `⚠️ <b>删除失败:</b> 未在数据库中找到 <code>${escapeHtml(prefix)}</code>，可能已被删除。`
          );
        }
        return new Response('OK', { status: 200 });
      }

      if (callbackData.startsWith('del_cancel:')) {
        const prefix = callbackData.slice('del_cancel:'.length);
        await answerCallbackQuery(botToken, callbackId, '操作已取消');
        if (messageId) {
          await editMessageText(
            botToken,
            adminChatId,
            messageId,
            `❌ <b>操作已取消</b>\n━━━━━━━━━━━━━━━━━━\n前缀 <code>${escapeHtml(prefix)}</code> 的规则保持不变。`
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

      // Check if replying directly to marketing keywords list
      const isKeywordReply =
        isReply && (replyText.includes('营销推广拦截关键词') || replyText.includes('营销关键词'));

      // Command: setup (交互式极速配置向导)
      if (command === 'setup') {
        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库，无法启动向导。`
          );
          return new Response('OK', { status: 200 });
        }

        await setSetupSession(env.MAIL_ROUTES_KV, 1);
        await sendTelegramMessage(
          botToken,
          adminChatId,
          `🚀 <b>【 cf-mail2tg-aibot 交互式配置向导 (1/2) 】</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `欢迎使用极速配置向导！本向导将分 2 步带您完成核心凭证绑定。\n` +
            `💡 <i>输入 <code>skip</code> 可跳过当前步骤，随时发送 <code>/cancel</code> 可退出向导。</i>\n\n` +
            `<b>第 1 步: 配置备份转发邮箱 (Forward Email)</b>\n` +
            `用于将入站邮件无损双轨转发至您的主力邮箱（如 Gmail）。\n` +
            `⚠️ <i>注意: 请确保该邮箱已在 Cloudflare 仪表盘的「Email Routing ➔ Destination addresses」中完成验证！</i>\n\n` +
            `👉 <b>请直接回复您的目标接收邮箱</b> (如 <code>yourname@gmail.com</code>)，或发送 <code>skip</code> 跳过:`
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
          `❌ <b>已退出配置向导</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `当前向导会话已重置，未完成的配置保持原状。您可随时发送 <code>/setup</code> 重新开始。`
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
              `⏭️ <b>已跳过备份邮箱配置。</b>\n\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `🚀 <b>【 cf-mail2tg-aibot 交互式配置向导 (2/2) 】</b>\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `<b>第 2 步: 配置 MiniMax 大模型 API Key</b>\n` +
                `用于对来信进行大模型智能意图审信（验证码、账单、营销、告警等）与验证码自动提取。\n` +
                `💡 <i>若暂未获取，输入 <code>skip</code> 可跳过，系统将自动使用高性能本地正则进行兜底处理。</i>\n\n` +
                `👉 <b>请直接回复您的 MiniMax API Key</b>，或发送 <code>skip</code> 跳过:`
            );
            return new Response('OK', { status: 200 });
          }

          if (!isValidEmail(rawText)) {
            await sendTelegramMessage(
              botToken,
              adminChatId,
              `❌ <b>邮箱格式不合法！</b>\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `您输入的内容为: <code>${escapeHtml(rawText)}</code>\n` +
                `请输入合法的邮箱格式（例如: <code>mymail@gmail.com</code>），或发送 <code>skip</code> 跳过当前步骤:`
            );
            return new Response('OK', { status: 200 });
          }

          const emailToSave = rawText.trim();
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email', emailToSave);
          await setSetupSession(env.MAIL_ROUTES_KV, 2);
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `✅ <b>备份邮箱绑定成功！</b>\n` +
              `已保存目标地址: <code>${escapeHtml(emailToSave)}</code>\n\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `🚀 <b>【 cf-mail2tg-aibot 交互式配置向导 (2/2) 】</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `<b>第 2 步: 配置 MiniMax 大模型 API Key</b>\n` +
              `用于对来信进行大模型智能意图审信（验证码、账单、营销、告警等）与验证码自动提取。\n` +
              `💡 <i>若暂未获取，输入 <code>skip</code> 可跳过，系统将自动使用高性能本地正则进行兜底处理。</i>\n\n` +
              `👉 <b>请直接回复您的 MiniMax API Key</b>，或发送 <code>skip</code> 跳过:`
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
            const fwdText = curFwd ? `<code>${escapeHtml(curFwd)}</code>` : '⚪ 未配置 (纯TG单轨模式)';
            const mmxText = curMmx
              ? `✅ 已就绪 (<code>${escapeHtml(maskSecret(curMmx))}</code>)`
              : '⚪ 未配置 (本地正则兜底)';

            await sendTelegramMessage(
              botToken,
              adminChatId,
              `⏭️ <b>已跳过大模型 API Key 配置。</b>\n\n` +
                `🎉 <b>【 恭喜！配置流程已顺利完成 】</b>\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `系统核心组件状态:\n` +
                `• 备份转发邮箱: ${fwdText}\n` +
                `• 大模型审信: ${mmxText}\n\n` +
                `💡 <b>后续建议:</b>\n` +
                `• 发送 <code>/config</code> 查看全局配置中枢与脱敏密钥\n` +
                `• 发送 <code>/routes</code> 查看当前生效的收信画像规则\n` +
                `• 随时发送 <code>/setkey</code> 可单独热更新各项密钥`
            );
            return new Response('OK', { status: 200 });
          }

          const cleanKey = rawText.trim().replace(/^['"]|['"]$/g, '');
          if (cleanKey.length === 0) {
            await sendTelegramMessage(
              botToken,
              adminChatId,
              `❌ <b>API Key 不能为空！</b>\n请回复有效的 API Key，或发送 <code>skip</code> 跳过:`
            );
            return new Response('OK', { status: 200 });
          }

          await setDynamicConfig(env.MAIL_ROUTES_KV, 'minimax_api_key', cleanKey);
          await clearSetupSession(env.MAIL_ROUTES_KV);
          const curFwd =
            (await getDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email')) ||
            env.FORWARD_TO_EMAIL?.trim() ||
            '';
          const fwdText = curFwd ? `<code>${escapeHtml(curFwd)}</code>` : '⚪ 未配置 (纯TG单轨模式)';

          await sendTelegramMessage(
            botToken,
            adminChatId,
            `✅ <b>大模型 API Key 绑定成功！</b>\n` +
              `已保存至 KV，脱敏预览: <code>${escapeHtml(maskSecret(cleanKey))}</code>\n\n` +
              `🎉 <b>【 恭喜！极速配置流程已全部完成 】</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `您的 cf-mail2tg-aibot 邮件网关已全面就绪！\n` +
              `• 备份转发邮箱: ${fwdText}\n` +
              `• 大模型审信: ✅ 已就绪 (<code>${escapeHtml(maskSecret(cleanKey))}</code>)\n\n` +
              `💡 <b>后续建议:</b>\n` +
              `• 发送 <code>/config</code> 查看全局配置中枢与脱敏密钥\n` +
              `• 发送 <code>/routes</code> 查看收信画像与域名规则\n` +
              `• 任何新邮件到达时，网关将全自动进行 AI 意图分析并实时推送！`
          );
          return new Response('OK', { status: 200 });
        }
      }

      // Command: config / keys / status (查看当前密钥配置与网关就绪状态)
      if (command === 'config' || command === 'keys' || command === 'status') {
        const dynamicMinimax = await getDynamicConfig(env?.MAIL_ROUTES_KV, 'minimax_api_key');
        const effectiveMinimax = dynamicMinimax || env?.MINIMAX_API_KEY?.trim() || '';
        const minimaxSource = dynamicMinimax ? '(动态KV覆盖)' : env?.MINIMAX_API_KEY ? '(环境默认)' : '';

        const dynamicForward = await getDynamicConfig(env?.MAIL_ROUTES_KV, 'forward_to_email');
        const effectiveForward = dynamicForward || env?.FORWARD_TO_EMAIL?.trim() || '';
        const forwardSource = dynamicForward ? '(动态KV覆盖)' : env?.FORWARD_TO_EMAIL ? '(环境默认)' : '';

        const keywords = await getMarketingKeywords(env?.MAIL_ROUTES_KV);
        const customRules = await listCustomRules(env?.MAIL_ROUTES_KV);

        const hasKv = Boolean(env?.MAIL_ROUTES_KV);
        const blockAll =
          env?.BLOCK_ALL_ATTACHMENTS === true ||
          String(env?.BLOCK_ALL_ATTACHMENTS || '').toLowerCase() === 'true';
        const maxSizeBytes = Number(env?.MAX_EMAIL_SIZE_BYTES) || 5 * 1024 * 1024;
        const marketingPolicy = env?.MARKETING_TG_POLICY || 'silent';

        const configCard = [
          `🎛️ <b>【 cf-mail2tg-aibot 配置与密钥中枢 】</b>`,
          `━━━━━━━━━━━━━━━━━━`,
          `🤖 <b>大模型审信 (LLM):</b>`,
          `  • 绑定状态: ${effectiveMinimax ? `✅ 已就绪 ${escapeHtml(minimaxSource)}` : `⚪ 未配置 (当前使用本地正则嗅探)`}`,
          effectiveMinimax ? `  • 密钥脱敏: <code>${escapeHtml(maskSecret(effectiveMinimax))}</code>` : '',
          `  • 运行模型: <code>${escapeHtml(env?.MINIMAX_MODEL || 'MiniMax-Text-01')}</code>`,
          ``,
          `📥 <b>零丢信备份轨 (Forward):</b>`,
          `  • 目标邮箱: ${effectiveForward ? `<code>${escapeHtml(effectiveForward)}</code> ${escapeHtml(forwardSource)}` : `⚪ 未配置 (纯TG单轨模式)`}`,
          `  • 别名分流: ${String(env?.ENABLE_GMAIL_ALIASES || '').toLowerCase() === 'true' ? '✅ 已激活 (自动+标签)' : '⚪ 已停用 (直转主邮箱)'}`,
          ``,
          `🗄️ <b>KV 数据库 (MAIL_ROUTES_KV):</b>`,
          `  • 连接状态: ${hasKv ? '✅ 已绑定生效' : '❌ 未连接'}`,
          `  • 活跃营销关键词: <b>${keywords.length}</b> 个`,
          `  • 自定义路由规则: <b>${customRules.length}</b> 条`,
          ``,
          `🛡️ <b>边缘装甲与安全策略:</b>`,
          `  • 零附件拦截策略: ${blockAll ? '🔴 全量拒信 (SMTP 550)' : '🟢 仅拦截高危格式'}`,
          `  • 邮件体积熔断上限: <b>${formatBytes(maxSizeBytes)}</b> (SMTP 552)`,
          `  • 营销推送策略: <code>${marketingPolicy === 'mute' ? '完全不推TG (mute)' : '静默不响铃 (silent)'}</code>`,
          `━━━━━━━━━━━━━━━━━━`,
          `💡 <b>快捷更新指令:</b>`,
          `• <code>/setkey minimax &lt;API_KEY&gt;</code> - 热更新大模型密钥`,
          `• <code>/setkey forward &lt;邮箱地址&gt;</code> - 热更新备份邮箱`,
          `• <code>/resetkey minimax</code> - 清除密钥动态覆盖并回退`,
          `• <code>/resetkey forward</code> - 清除备份邮箱动态覆盖`,
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
            `💡 <b>【热更新密钥/配置说明】</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `<b>格式:</b> <code>/setkey &lt;类型&gt; &lt;值&gt;</code>\n\n` +
              `• <b>更新大模型密钥:</b>\n` +
              `  <code>/setkey minimax sk-your-api-key</code>\n\n` +
              `• <b>更新备份邮箱:</b>\n` +
              `  <code>/setkey forward your-inbox@gmail.com</code>\n\n` +
              `💡 <i>更新后即刻保存在 KV 并在边缘端实时生效。</i>`
          );
          return new Response('OK', { status: 200 });
        }

        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, `❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库。`);
          return new Response('OK', { status: 200 });
        }

        if (subType === 'minimax') {
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'minimax_api_key', subVal);
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `✅ <b>大模型 API 密钥已成功热更新！</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `新密钥已保存至 KV，脱敏预览: <code>${escapeHtml(maskSecret(subVal))}</code>\n` +
              `后续来信将即刻使用新密钥进行 LLM 意图识别。`
          );
          return new Response('OK', { status: 200 });
        }

        if (subType === 'forward') {
          await setDynamicConfig(env.MAIL_ROUTES_KV, 'forward_to_email', subVal);
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `✅ <b>备份转发邮箱已成功热更新！</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `新目标地址: <code>${escapeHtml(subVal)}</code>\n` +
              `⚠️ <i>请务必确保该邮箱已在 Cloudflare Email Routing 中完成验证！</i>`
          );
          return new Response('OK', { status: 200 });
        }

        await sendTelegramMessage(
          botToken,
          adminChatId,
          `❌ <b>不支持的配置类型:</b> 「<code>${escapeHtml(subType)}</code>」\n目前仅支持 <code>minimax</code> 或 <code>forward</code>。`
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
            `💡 <b>【重置密钥指令说明】</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `<b>格式:</b> <code>/resetkey &lt;minimax|forward&gt;</code>\n\n` +
              `删除 KV 中的动态覆盖项，恢复使用环境变量中的初始默认值。`
          );
          return new Response('OK', { status: 200 });
        }

        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, `❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库。`);
          return new Response('OK', { status: 200 });
        }

        const configKey = subType === 'minimax' ? 'minimax_api_key' : 'forward_to_email';
        await deleteDynamicConfig(env.MAIL_ROUTES_KV, configKey);
        await sendTelegramMessage(
          botToken,
          adminChatId,
          `🔄 <b>已重置 ${subType} 动态配置！</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `已清除 KV 动态覆盖，系统已自动回退至环境变量中的初始默认配置。`
        );
        return new Response('OK', { status: 200 });
      }

      // Command: keywords / kw
      if (command === 'keywords' || command === 'kw') {
        const keywords = await getMarketingKeywords(env?.MAIL_ROUTES_KV);
        await sendTelegramMessage(
          botToken,
          adminChatId,
          `📋 <b>【营销推广拦截关键词管理】</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `当前生效关键词共 <b>${keywords.length}</b> 个。\n\n` +
            `💡 <b>修改方式（复制修改后【直接回复本条消息】）：</b>\n` +
            `1. 单击下方灰色代码块，在手机或电脑上一键复制全部内容；\n` +
            `2. 选择<b>「回复 (Reply)」本条消息</b>（或直接发送 <code>setkeywords ...</code>），粘贴并按需增删关键字（<b>一行一个关键字</b>）；\n` +
            `3. 发送后网关将自动全量更新并即刻在边缘生效！\n\n` +
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
            `❌ <b>更新失败:</b> 未检测到任何有效关键词。\n请输入至少一个关键词（每行一个），支持直接回复修改。`
          );
          return new Response('OK', { status: 200 });
        }

        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, `❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库。`);
          return new Response('OK', { status: 200 });
        }

        const success = await setMarketingKeywords(env.MAIL_ROUTES_KV, lines);
        if (success) {
          const previewList = lines.slice(0, 15).join(', ');
          const moreCount = lines.length > 15 ? ` 等共 ${lines.length} 个` : '';
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `✅ <b>【营销关键词库已成功更新！】</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `已全量更新 <b>${lines.length}</b> 个营销拦截关键词，边缘网关即刻生效。\n\n` +
              `📝 <b>当前关键词预览:</b>\n` +
              `<code>${escapeHtml(previewList)}${moreCount}</code>\n\n` +
              `💡 <i>后续命中上述任意关键词或 RFC 退订头的入站邮件，将自动静默推送并归档。</i>`
          );
        } else {
          await sendTelegramMessage(botToken, adminChatId, `❌ <b>更新失败:</b> 保存至数据库时出现异常。`);
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
            `💡 <b>【增量添加关键词说明】</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `<b>格式:</b> <code>/addkeywords 关键词1\n关键词2</code>\n\n` +
              `系统将自动去重并安全合并至现有词库，<b>绝不会覆盖原有的关键词</b>。`
          );
          return new Response('OK', { status: 200 });
        }

        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, `❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库。`);
          return new Response('OK', { status: 200 });
        }

        const appendResult = await appendMarketingKeywords(env.MAIL_ROUTES_KV, lines);
        if (appendResult.success) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `✅ <b>【增量关键词添加成功 (安全合并)】</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `• 本次成功新增: <b>${appendResult.addedCount}</b> 个（已过滤重复词）\n` +
              `• 现有生效总词数: <b>${appendResult.totalCount}</b> 个\n` +
              `• 原有词库已安全保留，未发生覆盖。\n\n` +
              `📝 <b>本次新增项:</b>\n` +
              `<code>${escapeHtml(lines.join('\n'))}</code>`
          );
        } else {
          await sendTelegramMessage(botToken, adminChatId, `❌ <b>添加失败:</b> 保存至数据库时出现异常。`);
        }
        return new Response('OK', { status: 200 });
      }

      // Command: resetkeywords
      if (command === 'resetkeywords') {
        if (!env?.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, `❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库。`);
          return new Response('OK', { status: 200 });
        }
        await resetMarketingKeywords(env.MAIL_ROUTES_KV);
        await sendTelegramMessage(
          botToken,
          adminChatId,
          `🔄 <b>【营销关键词已重置为默认基线】</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `已恢复系统预设的 <b>${DEFAULT_MARKETING_KEYWORDS.length}</b> 个中英文标准营销关键词。`
        );
        return new Response('OK', { status: 200 });
      }

      // Command: add
      if (command === 'add') {
        if (parts.length === 1) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `💡 <b>【添加规则命令说明】</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `<b>格式:</b> <code>add &lt;标签&gt; &lt;前缀&gt; [转发邮箱]</code>\n\n` +
              `• <b>标签限定:</b> <code>${ALLOWED_TAGS.join('</code>、<code>')}</code>\n` +
              `• <b>前缀说明:</b> 例如输入 <code>support</code> 对应 <code>support@你的域名</code>\n` +
              `• <b>转发邮箱:</b> 可选，未提供时默认使用主转发邮箱\n\n` +
              `<b>示例:</b>\n` +
              `• <code>add 个人 blog</code>\n` +
              `• <code>add 商业支持 help user@domain.com</code>`
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
            `❌ <b>添加失败:</b> 缺少前缀参数。\n正确格式: <code>add &lt;标签&gt; &lt;前缀&gt; [转发邮箱]</code>`
          );
          return new Response('OK', { status: 200 });
        }

        if (!isValidTag(tagInput)) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `❌ <b>添加失败:</b> 标签必须为 [${ALLOWED_TAGS.join('、')}] 之一。\n您输入的标签为「<code>${escapeHtml(tagInput)}</code>」，请检查后重试。`
          );
          return new Response('OK', { status: 200 });
        }

        const cleanPrefix = prefixInput.toLowerCase().replace(/@.*$/, '').trim();
        if (!cleanPrefix || !/^[a-z0-9._-]+$/i.test(cleanPrefix)) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `❌ <b>添加失败:</b> 邮箱前缀「<code>${escapeHtml(prefixInput)}</code>」格式不合法，仅支持字母、数字、点及减号。`
          );
          return new Response('OK', { status: 200 });
        }

        const targetForward = forwardInput?.trim() || baseForwardTarget;

        if (!env.MAIL_ROUTES_KV) {
          await sendTelegramMessage(botToken, adminChatId, `❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库。`);
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
          `✅ <b>新路由规则添加成功！</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `📬 <b>目标前缀:</b> <code>${cleanPrefix}</code>\n` +
            `🏷️ <b>归属标签:</b> ${tagInput}\n` +
            `📥 <b>转发目标:</b> <code>${targetForward || '(未配置独立转发，纯TG通知)'}</code>\n\n` +
            `💡 <i>Catch-all 开启后，发往该前缀的邮件将即刻按此规则分流。</i>`
        );
        return new Response('OK', { status: 200 });
      }

      // Command: del
      if (command === 'del') {
        if (parts.length === 1) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `💡 <b>【删除规则命令说明】</b>\n` +
              `━━━━━━━━━━━━━━━━━━\n` +
              `<b>格式:</b> <code>del &lt;前缀&gt;</code>\n` +
              `<b>示例:</b> <code>del blog</code>`
          );
          return new Response('OK', { status: 200 });
        }

        const targetPrefix = parts[1].toLowerCase().replace(/@.*$/, '').trim();
        const existing = await getCustomRule(env.MAIL_ROUTES_KV, targetPrefix);

        if (!existing) {
          await sendTelegramMessage(
            botToken,
            adminChatId,
            `⚠️ <b>未找到规则:</b> 数据库中未找到前缀为 <code>${escapeHtml(targetPrefix)}</code> 的自定义规则。`
          );
          return new Response('OK', { status: 200 });
        }

        await sendTelegramMessage(
          botToken,
          adminChatId,
          `⚠️ <b>请二次确认是否删除规则？</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `📬 <b>目标前缀:</b> <code>${existing.prefix}</code>\n` +
            `🏷️ <b>当前标签:</b> ${existing.tag}\n` +
            `📥 <b>转发目标:</b> <code>${existing.forwardEmail || '(无独立转发)'}</code>\n\n` +
            `⚠️ <i>请点击下方按钮确认，点击后将从数据库彻底抹除！</i>`,
          {
            inline_keyboard: [
              [
                { text: '🔴 确认删除', callback_data: `del_confirm:${existing.prefix}` },
                { text: '⚪ 取消', callback_data: `del_cancel:${existing.prefix}` },
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
          customText = '<i>(暂无自定义规则，可使用 add 个人 xxx 快速添加)</i>';
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
          `📋 <b>【 当前生效的邮件路由规则库 】</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `🔹 <b>系统预设基线画像:</b>\n` +
            `${presetText}\n` +
            `• <i>(其余未匹配地址)</i> ➔ 🏷️ <b>通用</b>\n\n` +
            `🔸 <b>动态自定义规则 (KV 存储):</b>\n` +
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
            body: JSON.stringify({ commands: BOT_COMMANDS }),
          });
        } catch {}

        await sendTelegramMessage(
          botToken,
          adminChatId,
          `👋 <b>【 cf-mail2tg-aibot 邮件网关已就绪 】</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `⚡ <b>高效 3 步初始化指引:</b>\n\n` +
            `🚀 <b>【首推】一键极速配置向导 (1分钟完成)</b>\n` +
            `   发送 <code>/setup</code> 启动交互向导，分步指引配置备份邮箱与大模型密钥！\n\n` +
            `1️⃣ <b>查验就绪状态</b>\n` +
            `   发送 <code>/config</code> 查看大模型、备份邮箱与 KV 数据库连接状态。\n\n` +
            `2️⃣ <b>手机端热更新密钥 (可选)</b>\n` +
            `   • 开启 AI 审信与提码: <code>/setkey minimax &lt;API_KEY&gt;</code>\n` +
            `   • 设置/更换 Gmail 备份: <code>/setkey forward &lt;接收邮箱&gt;</code>\n\n` +
            `3️⃣ <b>配置域名收信画像</b>\n` +
            `   • 查看生效画像规则: <code>/routes</code>\n` +
            `   • 添加专属分流规则: <code>/add 商业支持 help</code> (支持多域名)\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `💡 <b>日常快捷指令:</b>\n` +
            `• <code>/setup</code> - 交互式极速分步向导\n` +
            `• <code>/config</code> - 查看当前配置与脱敏密钥\n` +
            `• <code>/keywords</code> - 营销拦截词库管理 (回复即改)\n` +
            `• <code>/help</code> - 查看全量控制面板与详细参数说明\n\n` +
            `<i>左下角 [Menu] 菜单按钮已同步激活，点击即可快捷调用。</i>`
        );
        return new Response('OK', { status: 200 });
      }

      // Command: menu / help (完整控制面板与指令字典)
      if (command === 'menu' || command === 'help') {
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commands: BOT_COMMANDS }),
          });
        } catch {}

        await sendTelegramMessage(
          botToken,
          adminChatId,
          `🎛️ <b>【 cf-mail2tg-aibot 全量控制面板 】</b>\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `您可直接点击左下角 <b>[Menu]</b> 按钮或发送以下指令：\n\n` +
            `🔑 <b>密钥与运行状态指令:</b>\n` +
            `• <code>/setup</code> - 启动交互式一键分步配置向导 (1分钟分步引导)\n` +
            `• <code>/cancel</code> - 随时退出当前向导或交互会话\n` +
            `• <code>/config</code> - 查看密钥绑定状态与配置中枢 (带脱敏掩码)\n` +
            `• <code>/setkey minimax &lt;key&gt;</code> - 手机端热更新大模型密钥\n` +
            `• <code>/setkey forward &lt;email&gt;</code> - 手机端热更新备份邮箱\n` +
            `• <code>/resetkey &lt;minimax|forward&gt;</code> - 重置动态覆盖回退默认值\n\n` +
            `📋 <b>营销关键词与防垃圾指令:</b>\n` +
            `• <code>/keywords</code> - 查看并一键复制全部营销关键词\n` +
            `• <code>/addkeywords</code> - 增量安全追加关键词（绝不覆盖已有词）\n` +
            `• <code>/resetkeywords</code> - 恢复系统默认基线关键词\n\n` +
            `🔀 <b>域名路由与画像指令:</b>\n` +
            `• <code>/routes</code> - 查看所有已生效的内置与 KV 路由规则\n` +
            `• <code>/add 标签 前缀 [目标]</code> - 添加新地址分流规则\n` +
            `• <code>/del 前缀</code> - 删除自定义路由规则（带二次确认）\n\n` +
            `💡 <i>提示: 您也可以随时直接回复 Bot 发送的任何关键词列表消息进行快捷修改。</i>`
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

      let from = message.from || '未知发件人';
      let subject = message.headers?.get?.('subject') || '(无主题)';
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

        const sizeAlertCard = [
          `⚠️ <b>【 邮件中继 · 超大容量熔断拦截 】</b>`,
          `━━━━━━━━━━━━━━━━━━`,
          `${route.tag}`,
          `🌐 <b>收信站点:</b> <code>${escapeHtml(targetDomain)}</code>`,
          `👤 <b>发信来源:</b> <code>${escapeHtml(from)}</code>`,
          `📬 <b>目标邮箱:</b> <code>${escapeHtml(to)}</code>`,
          `📌 <b>拦截原因:</b> 邮件体积为 <b>${formatBytes(rawSize)}</b>，超出网关安全上限 (${formatBytes(maxSizeBytes)})`,
          `🛡️ <b>防御动作:</b> 已向发件方返回 SMTP 552 拒信退回，<b>未转入备份邮箱 (0 空间消耗)</b>。`,
          `💡 <i>提示: 建议发件人通过网盘或 GitHub 链接分享超大文件。</i>`,
        ].join('\n');

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
          const warningCard = [
            `⚠️ <b>【 邮件中继 · 频控限流预警 】</b>`,
            `━━━━━━━━━━━━━━━━━━`,
            `${route.tag}`,
            `🌐 <b>收信站点:</b> <code>${escapeHtml(targetDomain)}</code>`,
            `👤 <b>高频发信:</b> <code>${escapeHtml(cleanReplyEmail || from)}</code>`,
            `📬 <b>目标邮箱:</b> <code>${escapeHtml(to)}</code>`,
            `📌 <b>触发原因:</b> ${escapeHtml(rateLimitResult.reason || '短时间内来信频次超限')}`,
            `🛡️ <b>防御状态:</b> ${
              forwardSuccess
                ? `该邮件已安全直转备份邮箱 (<code>${escapeHtml(baseForwardTarget)}</code>${
                    actualForwardedTo !== baseForwardTarget ? ` · 别名 <code>${escapeHtml(actualForwardedTo)}</code>` : ''
                  })`
                : forwardError
                  ? `⚠️ 转寄失败: ${escapeHtml(forwardError)}`
                  : `纯TG通知模式 (无转存邮箱)`
            }`,
            `💡 <i>为免打扰与防 TG 429 频控，本周期内已暂停该来源的推送，后续信件请移步备份邮箱查阅。</i>`,
          ].join('\n');

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
            snippet = `${snippet.slice(0, maxSnippetLength)}... (正文过长已折叠展示前 ${maxSnippetLength} 字，完整原件已同步至邮箱)`;
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

            const rejectCard = [
              `🚫 <b>【 邮件中继 · 附件安全策略拦截 】</b>`,
              `━━━━━━━━━━━━━━━━━━`,
              `${route.tag}`,
              `🌐 <b>收信站点:</b> <code>${escapeHtml(targetDomain)}</code>`,
              `👤 <b>发信来源:</b> <code>${escapeHtml(from)}</code>`,
              `📬 <b>目标邮箱:</b> <code>${escapeHtml(to)}</code>`,
              `📌 <b>拦截原因:</b> ${escapeHtml(attachmentPolicy.reason || '触发附件安全防御')}`,
              `📎 <b>检测附件:</b> <code>${escapeHtml(attachmentPolicy.detectedAttachments.join(', '))}</code>`,
              `🛡️ <b>防御动作:</b> 已向发信方返回 SMTP 550 拒信，<b>未转入备份邮箱 (0 空间占用)</b>。`,
            ].join('\n');

            await sendToTelegram(rejectCard, 'HTML');
            return;
          }

          if (parsedEmail.attachments && parsedEmail.attachments.length > 0) {
            const attachList = parsedEmail.attachments.slice(0, 3).map((att: any) => {
              const name = att.filename || '未命名附件';
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
              attachList.join('、') + (extraCount > 0 ? ` 等共 ${parsedEmail.attachments.length} 个文件` : '');
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
        aiBadge = `🏷️ <b>协议质检:</b> <code>RFC 8058退订头命中 (已短路免调AI·省额度)</code>`;
        disableNotification = true;
      } else {
        // 2. Level 2: Local & KV Keywords short-circuit
        const marketingKeywords = await getMarketingKeywords(env.MAIL_ROUTES_KV);
        const localResult = detectMarketingEmail(message.headers, subject, snippet, marketingKeywords);

        if (localResult.isMarketing) {
          isMarketing = true;
          intentTag = '营销';
          aiBadge = `🏷️ <b>规则命中:</b> <code>关键词匹配 [${escapeHtml(
            localResult.matchedKeyword || '营销特征'
          )}] (已短路免调AI·省额度)</code>`;
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
              aiBadge = `🤖 <b>AI研判:</b> <code>LLM 判定为营销推广 (静默免打扰)</code>`;
              disableNotification = true;
            } else if (intentTag === '验证') {
              aiBadge = `🤖 <b>AI研判:</b> <code>LLM 判定为验证码 (重要·强提醒)</code>`;
              disableNotification = false;
            } else if (intentTag === '告警') {
              aiBadge = `🤖 <b>AI研判:</b> <code>LLM 判定为安全告警 (紧急响铃)</code>`;
              disableNotification = false;
            } else if (intentTag === '账单') {
              aiBadge = `🤖 <b>AI研判:</b> <code>LLM 判定为财务账单 (响铃提醒)</code>`;
              disableNotification = false;
            } else if (intentTag === '通知') {
              aiBadge = `🤖 <b>AI研判:</b> <code>LLM 判定为系统通知 (常规提醒)</code>`;
              disableNotification = false;
            } else {
              aiBadge = `🤖 <b>AI研判:</b> <code>LLM 判定为重要信件 (响铃提醒)</code>`;
              disableNotification = false;
            }
          } else {
            intentTag = '业务';
            isMarketing = false;
            const errDetail = miniMaxResult.error || '连接异常';
            aiBadge = `🤖 <b>AI状态:</b> <code>⚠️ LLM API失效: ${escapeHtml(errDetail)} (已保底响铃)</code>`;
            disableNotification = false;
          }
        } else {
          // Fallback to local regex sniffer when LLM API Key is omitted
          extractedCode = extractVerificationCode(`${subject}\n${snippet}`);
          if (extractedCode) {
            intentTag = '验证';
            aiBadge = `🏷️ <b>规则命中:</b> <code>特征匹配到验证码 (响铃提醒)</code>`;
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
      let authBadge = '🛡️ <b>鉴真:</b> <code>未知签名</code>';
      if (isSpfPass && isDkimPass) {
        authBadge = '🛡️ <b>鉴真:</b> <code>SPF通过 · DKIM签名有效</code>';
      } else if (isSpfPass) {
        authBadge = '🛡️ <b>鉴真:</b> <code>SPF通过 · DKIM未校验</code>';
      } else if (isDkimPass) {
        authBadge = '🛡️ <b>鉴真:</b> <code>SPF未校验 · DKIM签名有效</code>';
      } else {
        authBadge = '🚨 <b>鉴真:</b> <code>SPF/DKIM未通过 (疑似仿冒来源)</code>';
      }

      const backupStatusText = forwardSuccess
        ? `<code>已同步投递至备份邮箱 (${escapeHtml(baseForwardTarget)}${
            actualForwardedTo !== baseForwardTarget ? ` · ${escapeHtml(actualForwardedTo)}` : ''
          })</code>`
        : forwardError
          ? `<code>⚠️ 转发失败 (${escapeHtml(forwardError)})</code>`
          : `<code>未配置转存邮箱 (纯TG通知模式)</code>`;

      const intentIconMap: Record<EmailIntentTag, string> = {
        验证: '🔐',
        营销: '📢',
        告警: '🚨',
        账单: '💰',
        业务: '💬',
        通知: '🔔',
      };
      const intentIcon = intentIconMap[intentTag] || '📧';

      const titleLine = `${intentIcon} <b>【新邮件 · ${intentTag} · ${escapeHtml(targetName)}】</b>`;

      const cardLines = [titleLine, `━━━━━━━━━━━━━━━━━━`];

      if (extractedCode) {
        cardLines.push(
          `🔢 <b>验证码:</b> <code>${escapeHtml(extractedCode)}</code> <i>(轻触直接复制)</i>`,
          `━━━━━━━━━━━━━━━━━━`
        );
      }

      cardLines.push(
        `📂 <b>业务类型:</b> <code>${escapeHtml(route.tag)}</code>`,
        `🌐 <b>收信站点:</b> <code>${escapeHtml(targetDomain)}</code>`,
        `📬 <b>目标邮箱:</b> <code>${escapeHtml(to)}</code>`,
        `👤 <b>发件来源:</b> <code>${escapeHtml(from)}</code>`,
        `${authBadge}`
      );

      if (aiBadge) {
        cardLines.push(`${aiBadge}`);
      }

      cardLines.push(
        `━━━━━━━━━━━━━━━━━━`,
        `📌 <b>主　　题:</b> <b>${escapeHtml(subject)}</b>`
      );

      if (attachmentsSummary) {
        cardLines.push(`📎 <b>附　　件:</b> <code>${escapeHtml(attachmentsSummary)}</code> (已同步至邮箱)`);
      }

      cardLines.push(
        ``,
        `📝 <b>邮件摘要:</b>`,
        `<blockquote expandable>${escapeHtml(snippet || '(无纯文本正文内容)')}</blockquote>`,
        `━━━━━━━━━━━━━━━━━━`,
        `📥 <b>备份状态:</b> ${backupStatusText}`,
        `✉️ <b>回复联系:</b> <code>${escapeHtml(cleanReplyEmail || from)}</code>`
      );

      const cardHtml = cardLines.join('\n');

      const marketingPolicy = env.MARKETING_TG_POLICY || 'silent';
      if (isMarketing && marketingPolicy === 'mute') {
        console.log(`[EmailWorker] Marketing email suppressed from Telegram by policy (${marketingPolicy}): ${subject}`);
        return;
      }

      let sent = await sendToTelegram(cardHtml, 'HTML', disableNotification);

      if (!sent) {
        console.warn('[EmailWorker] HTML sendMessage failed. Retrying with safe plain text fallback...');
        const plainTextFallback = [
          `${intentIcon} 【新邮件 · ${intentTag} · ${targetName}】`,
          extractedCode ? `验证码: ${extractedCode} (轻触直接复制)` : '',
          `业务类型: ${route.tag}`,
          `收信站点: ${targetDomain}`,
          `目标邮箱: ${to}`,
          `发件来源: ${from}`,
          aiBadge ? `AI: ${aiBadge.replace(/<[^>]+>/g, '')}` : '',
          `----------------------------------`,
          `主题: ${subject}`,
          attachmentsSummary ? `附件: ${attachmentsSummary}` : '',
          `----------------------------------`,
          snippet || '(无纯文本正文内容)',
          `----------------------------------`,
          `备份状态: ${forwardSuccess ? `已同步投递至备份邮箱 (${actualForwardedTo})` : '未同步投递'}`,
          `回复邮箱: ${cleanReplyEmail || from}`,
        ]
          .filter(Boolean)
          .join('\n')
          .slice(0, 3800);

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
