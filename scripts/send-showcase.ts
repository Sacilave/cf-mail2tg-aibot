/**
 * =============================================================================
 * Product Showcase Generator (English Version for Telegram Screenshots)
 * Sends 5 carefully crafted, high-fidelity sample cards to demonstrate:
 *   1. 🔐 OTP / Security Verification Code (Pinned & Tap-to-Copy)
 *   2. 💼 Business & Customer Support Inquiry (Persona Routing & Expandable Quote)
 *   3. 💰 Billing / Invoice Notification (Financial Triage & Amount Extraction)
 *   4. 🚨 Spoof Detection & Security Warning (SPF/DKIM Failure & High Alert)
 *   5. 📢 Marketing Noise Suppression (Keyword Fast-Drop & Silent Delivery)
 * =============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { ProxyAgent } from 'undici';
import { renderEmailCardHtml } from '../src/card-renderer';
import { getTranslation } from '../src/i18n';
import type { EmailIntentTag, AllowedTag } from '../src/types';

function loadDevVars(): Record<string, string> {
  const env: Record<string, string> = {};
  const devVarsPath = path.resolve(process.cwd(), '.dev.vars');

  if (fs.existsSync(devVarsPath)) {
    const content = fs.readFileSync(devVarsPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        env[key] = val;
      }
    }
  }

  for (const [k, v] of Object.entries(process.env)) {
    if (v && !env[k]) env[k] = v;
  }
  return env;
}

async function sendTgMessage(
  botToken: string,
  chatId: string,
  text: string,
  dispatcher?: any,
  isSilent = false
) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      disable_notification: isSilent,
    }),
    // @ts-ignore
    dispatcher,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API Error ${res.status}: ${err}`);
  }
}

async function main() {
  const devVars = loadDevVars();
  const botToken = devVars.TELEGRAM_BOT_TOKEN?.trim();
  const adminChatId = devVars.TELEGRAM_ADMIN_CHAT_ID?.trim();

  const proxyUrl =
    devVars.HTTPS_PROXY ||
    devVars.HTTP_PROXY ||
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY ||
    'http://127.0.0.1:7897';

  let dispatcher: any = undefined;
  if (proxyUrl) {
    try {
      dispatcher = new ProxyAgent(proxyUrl);
    } catch {}
  }

  if (!botToken || !adminChatId) {
    console.error(`❌ [Error] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID in .dev.vars`);
    process.exit(1);
  }

  const dictEn = getTranslation('en-US');
  const baseBackup = devVars.FORWARD_TO_EMAIL || 'sacilave@gmail.com';

  const showcaseCases = [
    // -------------------------------------------------------------------------
    // 1. Verification / OTP Scenario
    // -------------------------------------------------------------------------
    {
      title: '1. [Verification / OTP] GitHub 2FA Code with Instant Tap-to-Copy',
      intentTag: '验证' as EmailIntentTag,
      targetName: 'admin',
      extractedCode: '849201',
      routeTag: '个人' as AllowedTag,
      targetDomain: 'lave.fun',
      to: 'admin@lave.fun',
      from: 'GitHub Security <noreply@github.com>',
      cleanReplyEmail: 'noreply@github.com',
      authBadge: '🛡️ <b>Auth:</b> <code>SPF Pass · DKIM Valid (Official Verified)</code>',
      aiBadge: '🤖 <b>AI Triage:</b> <code>MiniMax: Verification Code (High Priority · Alert)</code>',
      subject: '[GitHub] Please verify your device sign-in',
      snippet:
        'Hey developer,\n\n' +
        'We detected a sign-in attempt to your GitHub account from a new IP address (Tokyo, Japan).\n\n' +
        'Your security verification code: 849201\n' +
        'This code will expire in 10 minutes. If you did not initiate this request, please secure your account immediately.\n\n' +
        'Thanks,\nThe GitHub Team',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: baseBackup,
      isSilent: false,
    },

    // -------------------------------------------------------------------------
    // 2. Business & Customer Support Persona Routing
    // -------------------------------------------------------------------------
    {
      title: '2. [Business & Support] Enterprise License & API Integration Inquiry',
      intentTag: '业务' as EmailIntentTag,
      targetName: 'business',
      extractedCode: undefined,
      routeTag: '商务' as AllowedTag,
      targetDomain: 'lave.fun',
      to: 'business@lave.fun',
      from: 'Marcus Vance <marcus.vance@vanguard-tech.io>',
      cleanReplyEmail: 'marcus.vance@vanguard-tech.io',
      authBadge: '🛡️ <b>Auth:</b> <code>SPF Pass · DKIM Valid (Verified Domain)</code>',
      aiBadge: '🤖 <b>AI Triage:</b> <code>MiniMax: Commercial Partnership (Priority Inbound)</code>',
      subject: 'Inquiry: Enterprise License & Bulk Deployment for cf-mail2tg-aibot',
      snippet:
        'Hi Sacilave Team,\n\n' +
        'I am the VP of Infrastructure at Vanguard Tech. We have been evaluating your open-source Email-to-Telegram AI gateway across our edge clusters, and our engineering department (approx. 40 developers) is thoroughly impressed with the sub-millisecond pre-parse rate limiting and zero-drop forwarding resilience.\n\n' +
        'We would like to discuss:\n' +
        '1. Enterprise volume license and custom SLA options\n' +
        '2. Multi-tenant KV routing and dedicated webhook endpoints\n' +
        '3. Consulting services for private LLM cluster integration\n\n' +
        'Could we schedule a brief 15-minute sync this Thursday?\n\n' +
        'Warm regards,\nMarcus Vance\nVP of Infrastructure | Vanguard Tech',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: 'sacilave+business@gmail.com',
      isSilent: false,
    },

    // -------------------------------------------------------------------------
    // 3. Billing & Payment Invoice
    // -------------------------------------------------------------------------
    {
      title: '3. [Billing & Finance] Stripe Invoice & Payment Receipt',
      intentTag: '账单' as EmailIntentTag,
      targetName: 'billing',
      extractedCode: undefined,
      routeTag: '付费产品' as AllowedTag,
      targetDomain: 'lave.fun',
      to: 'billing@lave.fun',
      from: 'Stripe Billing <invoices@stripe.com>',
      cleanReplyEmail: 'invoices@stripe.com',
      authBadge: '🛡️ <b>Auth:</b> <code>SPF Pass · DKIM Valid (Stripe Official)</code>',
      aiBadge: '🤖 <b>AI Triage:</b> <code>MiniMax: Billing & Invoice (Financial Receipt)</code>',
      subject: 'Invoice #INV-2026-9812 Paid ($249.00 USD)',
      snippet:
        'Receipt from Stripe Payments\n\n' +
        'Invoice: #INV-2026-9812\n' +
        'Amount Paid: $249.00 USD\n' +
        'Status: Paid via Corporate Visa (•••• 4921)\n' +
        'Service: Cloudflare Workers Dedicated Pro Plan (Annual)\n\n' +
        'You can view and download your full PDF VAT invoice directly from your customer dashboard.',
      attachmentsSummary: 'invoice-INV-2026-9812.pdf (84 KB)',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: 'sacilave+billing@gmail.com',
      isSilent: false,
    },

    // -------------------------------------------------------------------------
    // 4. Security Spoof Alert & Phishing Defense
    // -------------------------------------------------------------------------
    {
      title: '4. [Security Alert] Phishing Spoof Detection (SPF/DKIM Failure Warning)',
      intentTag: '告警' as EmailIntentTag,
      targetName: 'security',
      extractedCode: undefined,
      routeTag: '通用' as AllowedTag,
      targetDomain: 'lave.fun',
      to: 'security@lave.fun',
      from: 'Account Support <service-notice@fake-auth-portal.com>',
      cleanReplyEmail: 'service-notice@fake-auth-portal.com',
      authBadge: '🚨 <b>Auth:</b> <code>SPF/DKIM FAILED (High Risk · Unverified Origin)</code>',
      aiBadge: '🤖 <b>AI Triage:</b> <code>MiniMax: Phishing Alert (Dangerous Link Detected)</code>',
      subject: 'CRITICAL: Immediate action required to unfreeze your domain credentials',
      snippet:
        'WARNING: Unauthorized access detected from unknown device.\n\n' +
        'Your domain management portal has been temporarily locked due to suspicious credential stuffing.\n' +
        'Click the unverified link below within 2 hours or your domain nameserver records will be suspended.\n\n' +
        '[Blocked Phishing URL: http://fake-auth-portal.com/login?token=hijack]',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: baseBackup,
      isSilent: false,
    },

    // -------------------------------------------------------------------------
    // 5. Marketing Noise Suppression & Silent Delivery
    // -------------------------------------------------------------------------
    {
      title: '5. [Marketing Noise] Promo Campaign (Keyword Fast-Match · Muted Delivery)',
      intentTag: '营销' as EmailIntentTag,
      targetName: 'newsletter',
      extractedCode: undefined,
      routeTag: '通用' as AllowedTag,
      targetDomain: 'lave.fun',
      to: 'newsletter@lave.fun',
      from: 'SaaS Deals Weekly <promotions@cloud-newsletter.com>',
      cleanReplyEmail: 'promotions@cloud-newsletter.com',
      authBadge: '🛡️ <b>Auth:</b> <code>SPF Pass · DKIM Valid</code>',
      aiBadge: '🏷️ <b>Rule Matched:</b> <code>Spam Rule [70% off, promo] (AI Bypassed · Quota Saved · Muted)</code>',
      subject: 'Flash Sale: 70% Off Black Friday Developer Toolkits & Cloud Credits!',
      snippet:
        'Hey Cloud Engineers!\n\n' +
        'Unlock our biggest seasonal discount yet. Over 50+ developer tools, IDE extensions, and edge hosting credits bundled for just $9.99/mo.\n\n' +
        'Limited time offer expires midnight Sunday. Use code BLACKFRIDAY2026 at checkout.\n\n' +
        'To manage your email preferences or unsubscribe from promotional emails, click here: https://cloud-newsletter.com/opt-out',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: baseBackup,
      isSilent: true, // Silent delivery for marketing
    },
  ];

  console.log(`\n========================================================`);
  console.log(`🚀 Starting Showcase Generation (English Edition)...`);
  console.log(`   Target Chat ID: ${adminChatId}`);
  console.log(`   Total Cards: ${showcaseCases.length}`);
  console.log(`========================================================\n`);

  for (let i = 0; i < showcaseCases.length; i++) {
    const sc = showcaseCases[i];
    console.log(`[${i + 1}/${showcaseCases.length}] Rendering & Sending: ${sc.title}`);

    const cardHtml = renderEmailCardHtml({
      dict: dictEn,
      intentTag: sc.intentTag,
      targetName: sc.targetName,
      extractedCode: sc.extractedCode,
      routeTag: sc.routeTag,
      targetDomain: sc.targetDomain,
      to: sc.to,
      from: sc.from,
      cleanReplyEmail: sc.cleanReplyEmail,
      authBadge: sc.authBadge,
      aiBadge: sc.aiBadge,
      subject: sc.subject,
      attachmentsSummary: sc.attachmentsSummary,
      snippet: sc.snippet,
      forwardSuccess: sc.forwardSuccess,
      baseForwardTarget: sc.baseForwardTarget,
      actualForwardedTo: sc.actualForwardedTo,
      forwardError: null,
    });

    try {
      await sendTgMessage(botToken, adminChatId, cardHtml, dispatcher, sc.isSilent);
      console.log(`   ✅ Sent successfully!`);
    } catch (err: any) {
      console.error(`   ❌ Failed to send: ${err.message}`);
    }

    // 1.5s delay between messages to maintain crisp ordering in Telegram
    if (i < showcaseCases.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  console.log(`\n🎉 All 5 showcase cards delivered to your Telegram!`);
  console.log(`   You can now take screenshots directly in Telegram for your README.`);
}

main().catch(console.error);
