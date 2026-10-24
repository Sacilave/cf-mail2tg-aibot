/**
 * =============================================================================
 * Module: src/card-renderer.ts
 * Description: Dedicated presentation layer for Telegram notification cards
 *              (HTML parse_mode cards, plain-text fallbacks, and security alerts).
 * =============================================================================
 */

import { escapeHtml, formatBytes } from './sanitizer';
import type { EmailIntentTag } from './types';
import type { TranslationDict } from './i18n';

export interface RenderSizeAlertOptions {
  dict: TranslationDict;
  routeTag: string;
  targetDomain: string;
  from: string;
  to: string;
  rawSize: number;
  maxSizeBytes: number;
}

export function renderSizeAlertCard(options: RenderSizeAlertOptions): string {
  const { dict, routeTag, targetDomain, from, to, rawSize, maxSizeBytes } = options;
  const personaDisplay = dict.emailCard.personaTags[routeTag] || routeTag;

  return [
    `⚠️ <b>【 ${dict.securityAlerts.sizeCapTitle} 】</b>`,
    `━━━━━━━━━━━━━━━━━━`,
    `${personaDisplay}`,
    `🌐 <b>${dict.emailCard.recipientDomain}:</b> <code>${escapeHtml(targetDomain)}</code>`,
    `👤 <b>${dict.emailCard.senderFrom}:</b> <code>${escapeHtml(from)}</code>`,
    `📬 <b>${dict.emailCard.targetEmail}:</b> <code>${escapeHtml(to)}</code>`,
    `📌 <b>${dict.securityAlerts.reasonLabel}:</b> ${dict.securityAlerts.sizeCapReason(
      formatBytes(rawSize),
      formatBytes(maxSizeBytes)
    )}`,
    `🛡️ <b>${dict.securityAlerts.actionLabel}:</b> ${dict.securityAlerts.sizeCapAction}`,
    `💡 <i>${dict.securityAlerts.sizeCapTip}</i>`,
  ].join('\n');
}

export interface RenderRateLimitOptions {
  dict: TranslationDict;
  routeTag: string;
  targetDomain: string;
  from: string;
  cleanReplyEmail: string;
  to: string;
  reason?: string;
  forwardSuccess: boolean;
  baseForwardTarget: string;
  actualForwardedTo: string;
  forwardError: string | null;
}

export function renderRateLimitCard(options: RenderRateLimitOptions): string {
  const {
    dict,
    routeTag,
    targetDomain,
    from,
    cleanReplyEmail,
    to,
    reason,
    forwardSuccess,
    baseForwardTarget,
    actualForwardedTo,
    forwardError,
  } = options;

  const personaDisplay = dict.emailCard.personaTags[routeTag] || routeTag;
  const defenseStatus = forwardSuccess
    ? dict.securityAlerts.rateLimitStatusForwarded(
        escapeHtml(baseForwardTarget),
        actualForwardedTo !== baseForwardTarget ? escapeHtml(actualForwardedTo) : undefined
      )
    : forwardError
      ? dict.securityAlerts.rateLimitStatusFailed(escapeHtml(forwardError))
      : dict.securityAlerts.rateLimitStatusPureTG;

  return [
    `⚠️ <b>【 ${dict.securityAlerts.rateLimitTitle} 】</b>`,
    `━━━━━━━━━━━━━━━━━━`,
    `${personaDisplay}`,
    `🌐 <b>${dict.emailCard.recipientDomain}:</b> <code>${escapeHtml(targetDomain)}</code>`,
    `👤 <b>${dict.securityAlerts.rateLimitHighFreqSender}:</b> <code>${escapeHtml(cleanReplyEmail || from)}</code>`,
    `📬 <b>${dict.emailCard.targetEmail}:</b> <code>${escapeHtml(to)}</code>`,
    `📌 <b>${dict.securityAlerts.triggerLabel}:</b> ${escapeHtml(
      reason || dict.securityAlerts.rateLimitReason
    )}`,
    `🛡️ <b>${dict.securityAlerts.defenseStatusLabel}:</b> ${defenseStatus}`,
    `💡 <i>${dict.securityAlerts.rateLimitTip}</i>`,
  ].join('\n');
}

export interface RenderAttachmentRejectOptions {
  dict: TranslationDict;
  routeTag: string;
  targetDomain: string;
  from: string;
  to: string;
  reason?: string;
  detectedAttachments: string[];
}

export function renderAttachmentRejectCard(options: RenderAttachmentRejectOptions): string {
  const { dict, routeTag, targetDomain, from, to, reason, detectedAttachments } = options;
  const personaDisplay = dict.emailCard.personaTags[routeTag] || routeTag;

  return [
    `🚫 <b>【 ${dict.securityAlerts.attachmentTitle} 】</b>`,
    `━━━━━━━━━━━━━━━━━━`,
    `${personaDisplay}`,
    `🌐 <b>${dict.emailCard.recipientDomain}:</b> <code>${escapeHtml(targetDomain)}</code>`,
    `👤 <b>${dict.emailCard.senderFrom}:</b> <code>${escapeHtml(from)}</code>`,
    `📬 <b>${dict.emailCard.targetEmail}:</b> <code>${escapeHtml(to)}</code>`,
    `📌 <b>${dict.securityAlerts.reasonLabel}:</b> ${escapeHtml(
      reason || dict.securityAlerts.attachmentReason
    )}`,
    `📎 <b>${dict.securityAlerts.attachmentDetected}:</b> <code>${escapeHtml(
      detectedAttachments.join(', ')
    )}</code>`,
    `🛡️ <b>${dict.securityAlerts.actionLabel}:</b> ${dict.securityAlerts.attachmentAction}`,
  ].join('\n');
}

export interface RenderEmailCardOptions {
  dict: TranslationDict;
  intentTag: EmailIntentTag;
  targetName: string;
  extractedCode?: string;
  routeTag: string;
  targetDomain: string;
  to: string;
  from: string;
  cleanReplyEmail: string;
  authBadge: string;
  aiBadge?: string;
  subject: string;
  attachmentsSummary?: string;
  snippet: string;
  forwardSuccess: boolean;
  baseForwardTarget: string;
  actualForwardedTo: string;
  forwardError: string | null;
}

export const INTENT_ICON_MAP: Record<EmailIntentTag, string> = {
  验证: '🔐',
  营销: '📢',
  告警: '🚨',
  账单: '💰',
  业务: '💬',
  通知: '🔔',
};

export function renderEmailCardHtml(options: RenderEmailCardOptions): string {
  const {
    dict,
    intentTag,
    targetName,
    extractedCode,
    routeTag,
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
  } = options;

  const intentIcon = INTENT_ICON_MAP[intentTag] || '📧';
  const localizedIntent = dict.emailCard.intentTags[intentTag] || intentTag;
  const localizedPersona = dict.emailCard.personaTags[routeTag] || routeTag;

  const backupStatusText = forwardSuccess
    ? dict.emailCard.backupSynced(
        escapeHtml(baseForwardTarget),
        actualForwardedTo !== baseForwardTarget ? escapeHtml(actualForwardedTo) : undefined
      )
    : forwardError
      ? dict.emailCard.backupFailed(escapeHtml(forwardError))
      : dict.emailCard.backupPureTG;

  const titleLine = `${intentIcon} ${dict.emailCard.newEmailTitle(
    localizedIntent,
    escapeHtml(targetName)
  )}`;

  const cardLines = [titleLine, `━━━━━━━━━━━━━━━━━━`];

  if (extractedCode) {
    cardLines.push(
      `🔢 <b>${dict.emailCard.verificationCode}:</b> <code>${escapeHtml(extractedCode)}</code> <i>(${dict.emailCard.copyHint})</i>`,
      `━━━━━━━━━━━━━━━━━━`
    );
  }

  cardLines.push(
    `📂 <b>${dict.emailCard.businessType}:</b> <code>${escapeHtml(localizedPersona)}</code>`,
    `🌐 <b>${dict.emailCard.recipientDomain}:</b> <code>${escapeHtml(targetDomain)}</code>`,
    `📬 <b>${dict.emailCard.targetEmail}:</b> <code>${escapeHtml(to)}</code>`,
    `👤 <b>${dict.emailCard.senderFrom}:</b> <code>${escapeHtml(from)}</code>`,
    `${authBadge}`
  );

  if (aiBadge) {
    cardLines.push(`${aiBadge}`);
  }

  cardLines.push(
    `━━━━━━━━━━━━━━━━━━`,
    `📌 <b>${dict.emailCard.subjectLabel}:</b> <b>${escapeHtml(subject || dict.emailCard.noSubject)}</b>`
  );

  if (attachmentsSummary) {
    cardLines.push(
      `📎 <b>${dict.emailCard.attachmentsLabel}:</b> <code>${escapeHtml(attachmentsSummary)}</code> (${dict.emailCard.attachmentsSynced})`
    );
  }

  cardLines.push(
    ``,
    `📝 <b>${dict.emailCard.snippetLabel}:</b>`,
    `<blockquote expandable>${escapeHtml(snippet || dict.emailCard.noTextContent)}</blockquote>`,
    `━━━━━━━━━━━━━━━━━━`,
    `📥 <b>${dict.emailCard.backupStatusLabel}:</b> ${backupStatusText}`,
    `✉️ <b>${dict.emailCard.replyContactLabel}:</b> <code>${escapeHtml(cleanReplyEmail || from)}</code>`
  );

  return cardLines.join('\n');
}

export function renderEmailCardPlainText(options: RenderEmailCardOptions): string {
  const {
    dict,
    intentTag,
    targetName,
    extractedCode,
    routeTag,
    targetDomain,
    to,
    from,
    cleanReplyEmail,
    aiBadge,
    subject,
    attachmentsSummary,
    snippet,
    forwardSuccess,
    actualForwardedTo,
  } = options;

  const intentIcon = INTENT_ICON_MAP[intentTag] || '📧';
  const localizedIntent = dict.emailCard.intentTags[intentTag] || intentTag;
  const localizedPersona = dict.emailCard.personaTags[routeTag] || routeTag;

  const plainLines = [
    `${intentIcon} 【${localizedIntent} · ${targetName}】`,
    extractedCode
      ? `${dict.emailCard.verificationCode}: ${extractedCode} (${dict.emailCard.copyHint})`
      : '',
    `${dict.emailCard.businessType}: ${localizedPersona}`,
    `${dict.emailCard.recipientDomain}: ${targetDomain}`,
    `${dict.emailCard.targetEmail}: ${to}`,
    `${dict.emailCard.senderFrom}: ${from}`,
    aiBadge ? `AI: ${aiBadge.replace(/<[^>]+>/g, '')}` : '',
    `----------------------------------`,
    `${dict.emailCard.subjectLabel}: ${subject}`,
    attachmentsSummary ? `${dict.emailCard.attachmentsLabel}: ${attachmentsSummary}` : '',
    `----------------------------------`,
    snippet || dict.emailCard.noTextContent,
    `----------------------------------`,
    `${dict.emailCard.backupStatusLabel}: ${
      forwardSuccess ? `已同步投递至备份邮箱 (${actualForwardedTo})` : '未同步投递'
    }`,
    `${dict.emailCard.replyContactLabel}: ${cleanReplyEmail || from}`,
  ];

  return plainLines
    .filter(Boolean)
    .join('\n')
    .slice(0, 3800);
}
