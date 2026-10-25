/**
 * =============================================================================
 * Module: src/card-renderer.ts
 * Description: Dedicated presentation layer for Telegram notification cards
 *              (HTML parse_mode cards, plain-text fallbacks, and security alerts).
 * =============================================================================
 */

import { escapeHtml, formatBytes } from './sanitizer';
import type { EmailIntentTag, CustomRouteRule } from './types';
import type { TranslationDict } from './i18n';
import { findProvider } from './ai/providers';

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

// ======================== Dashboard & Interactive Keyboards ========================

export interface RenderDashboardOptions {
  dict: TranslationDict;
  provider: string;
  model: string;
  keyConfigured: boolean;
  forwardEmail: string;
  gmailAliasesEnabled: boolean;
  customRulesCount: number;
  keywordsCount: number;
  langName: string;
}

export function renderMasterDashboardHtml(options: RenderDashboardOptions): string {
  const {
    dict,
    provider,
    model,
    keyConfigured,
    forwardEmail,
    gmailAliasesEnabled,
    customRulesCount,
    keywordsCount,
    langName,
  } = options;

  const isEn = dict.langCode === 'en-US';

  const engineLabel = dict.dashboard.statusEngineLabel || (isEn ? 'AI Engine' : 'AI 审信引擎');
  const keyLabel = dict.dashboard.statusKeyLabel || (isEn ? 'API Key Status' : '密钥状态');
  const keyStatus = keyConfigured
    ? (dict.dashboard.statusKeyReady || (isEn ? '🟢 Ready' : '🟢 已就绪 (Ready)'))
    : (dict.dashboard.statusKeyNone || (isEn ? '⚪ Not Set (None)' : '⚪ 未绑定 (None)'));

  const forwardLabel = dict.dashboard.statusForwardLabel || (isEn ? 'Backup Forward' : '备份邮箱');
  const forwardNone = dict.dashboard.statusForwardNone || (isEn ? '⚪ TG-Only Mode (Not Set)' : '⚪ 纯TG模式 (未设置)');
  const fwdDisplay = forwardEmail ? `<code>${escapeHtml(forwardEmail)}</code>` : forwardNone;

  const aliasLabel = dict.dashboard.statusAliasLabel || (isEn ? 'Gmail Aliases' : 'Gmail 别名');
  const aliasStatus = gmailAliasesEnabled
    ? (dict.dashboard.statusAliasOn || (isEn ? '🟢 Enabled (+tag)' : '🟢 已开启 (+tag)'))
    : (dict.dashboard.statusAliasOff || (isEn ? '⚪ Disabled (Direct)' : '⚪ 已停用 (直转)'));

  const rulesLabel = dict.dashboard.statusRulesLabel || (isEn ? 'Custom Rules' : '自定义规则');
  const rulesUnit = dict.dashboard.statusRulesUnit !== undefined ? ` ${dict.dashboard.statusRulesUnit}` : (isEn ? ' rule(s)' : ' 条');

  const keywordsLabel = dict.dashboard.statusKeywordsLabel || (isEn ? 'Spam Keywords' : '垃圾拦截词');
  const keywordsUnit = dict.dashboard.statusKeywordsUnit !== undefined ? ` ${dict.dashboard.statusKeywordsUnit}` : (isEn ? ' keyword(s)' : ' 个');

  const langLabel = dict.dashboard.statusLangLabel || (isEn ? 'Display Language' : '显示语言');
  const tipText = dict.dashboard.tipTapButtons || (isEn ? '💡 Tap buttons below to enter corresponding control panels' : '💡 轻触下方按钮直接进入对应控制面板');

  return [
    dict.dashboard.title,
    `━━━━━━━━━━━━━━━━━━`,
    dict.dashboard.desc,
    ``,
    `🤖 <b>${escapeHtml(engineLabel)}:</b> <b>${escapeHtml(provider)}</b> (<code>${escapeHtml(model)}</code>)`,
    `🔑 <b>${escapeHtml(keyLabel)}:</b> ${keyStatus}`,
    `📬 <b>${escapeHtml(forwardLabel)}:</b> ${fwdDisplay}`,
    `🏷️ <b>${escapeHtml(aliasLabel)}:</b> ${aliasStatus}`,
    `📂 <b>${escapeHtml(rulesLabel)}:</b> <code>${customRulesCount}</code>${rulesUnit}`,
    `🚫 <b>${escapeHtml(keywordsLabel)}:</b> <code>${keywordsCount}</code>${keywordsUnit}`,
    `🌐 <b>${escapeHtml(langLabel)}:</b> <b>${escapeHtml(langName)}</b>`,
    `━━━━━━━━━━━━━━━━━━`,
    `<i>${tipText}</i>`,
  ].join('\n');
}

export function getMasterMenuKeyboard(
  dict: TranslationDict
): Array<Array<{ text: string; callback_data: string }>> {
  return [
    [
      { text: dict.dashboard.btnAi, callback_data: 'm:ai' },
      { text: dict.dashboard.btnRoutes, callback_data: 'm:routes' },
    ],
    [
      { text: dict.dashboard.btnKeywords, callback_data: 'm:kw' },
      { text: dict.dashboard.btnForward, callback_data: 'm:fwd' },
    ],
    [
      { text: dict.dashboard.btnLang, callback_data: 'm:lang' },
      { text: dict.dashboard.btnRefresh, callback_data: 'm:refresh' },
    ],
    [
      { text: dict.dashboard.btnSetup || '⚡ 配置向导', callback_data: 'm:setup' },
      { text: dict.startCommand.btnGuide || '📖 使用指南', callback_data: 'm:guide' },
    ],
  ];
}

export function getAiMenuKeyboard(
  dict: TranslationDict,
  currentProvider: string,
  _currentModel: string
): Array<Array<{ text: string; callback_data: string }>> {
  return [
    [
      { text: `☁️ Workers AI${currentProvider === 'workers-ai' ? ' ✓' : ''}`, callback_data: 'p:workers-ai' },
      { text: `🐳 DeepSeek${currentProvider === 'deepseek' ? ' ✓' : ''}`, callback_data: 'p:deepseek' },
    ],
    [
      { text: `⚡ Groq${currentProvider === 'groq' ? ' ✓' : ''}`, callback_data: 'p:groq' },
      { text: `🟢 OpenAI${currentProvider === 'openai' ? ' ✓' : ''}`, callback_data: 'p:openai' },
    ],
    [
      { text: `✨ Gemini${currentProvider === 'gemini' ? ' ✓' : ''}`, callback_data: 'p:gemini' },
      { text: `🧠 Claude${currentProvider === 'claude' ? ' ✓' : ''}`, callback_data: 'p:claude' },
    ],
    [
      { text: `🌐 OpenRouter${currentProvider === 'openrouter' ? ' ✓' : ''}`, callback_data: 'p:openrouter' },
      { text: `🚀 MiniMax${currentProvider === 'minimax' ? ' ✓' : ''}`, callback_data: 'p:minimax' },
    ],
    [
      { text: dict.dashboard.btnManageModels, callback_data: 'm:models' },
    ],
    [
      { text: dict.dashboard.btnSetAiKey || '🔑 绑定 API Key', callback_data: 'ai:setkey' },
      { text: dict.dashboard.btnResetAiKey || '🔄 清除自定义 Key', callback_data: 'ai:resetkey' },
    ],
    [
      { text: dict.dashboard.btnBackMain, callback_data: 'm:main' },
    ],
  ];
}

export function getModelsMenuKeyboard(
  dict: TranslationDict,
  providerId: string,
  currentModel: string
): Array<Array<{ text: string; callback_data: string }>> {
  const provider = findProvider(providerId);
  const rows: Array<Array<{ text: string; callback_data: string }>> = [];

  if (provider && provider.models && provider.models.length > 0) {
    for (const m of provider.models) {
      const isSelected = m.id === currentModel;
      rows.push([
        {
          text: `${isSelected ? '✓ ' : ''}${m.name}`,
          callback_data: `mod:${m.id}`.slice(0, 64),
        },
      ]);
    }
  }

  rows.push([
    { text: dict.dashboard.btnBackAi, callback_data: 'm:ai' },
    { text: dict.dashboard.btnBackMain, callback_data: 'm:main' },
  ]);
  return rows;
}

export function getRoutesMenuKeyboard(
  dict: TranslationDict,
  customRules: CustomRouteRule[]
): Array<Array<{ text: string; callback_data: string }>> {
  const rows: Array<Array<{ text: string; callback_data: string }>> = [
    [
      { text: dict.dashboard.btnAddRoute, callback_data: 'ra:start' },
      { text: dict.dashboard.btnTags || '🏷️ 标签管理', callback_data: 'm:tags' },
    ],
  ];

  if (customRules && customRules.length > 0) {
    for (const r of customRules) {
      rows.push([
        {
          text: `🗑️ 删除 ${r.prefix} (${dict.emailCard.personaTags[r.tag] || r.tag})`,
          callback_data: `rd:${r.prefix}`.slice(0, 64),
        },
      ]);
    }
  }

  rows.push([{ text: dict.dashboard.btnBackMain, callback_data: 'm:main' }]);
  return rows;
}

export function getRouteTagSelectionKeyboard(
  dict: TranslationDict,
  customTags: string[] = []
): Array<Array<{ text: string; callback_data: string }>> {
  const rows: Array<Array<{ text: string; callback_data: string }>> = [
    [
      { text: `👤 ${dict.emailCard.personaTags['个人'] || '个人'}`, callback_data: 'ra:tag:个人' },
      { text: `🎧 ${dict.emailCard.personaTags['客服'] || '客服'}`, callback_data: 'ra:tag:客服' },
    ],
    [
      { text: `💼 ${dict.emailCard.personaTags['商务'] || '商务'}`, callback_data: 'ra:tag:商务' },
      { text: `🚀 ${dict.emailCard.personaTags['产品'] || '产品'}`, callback_data: 'ra:tag:产品' },
    ],
    [
      { text: `🌐 ${dict.emailCard.personaTags['通用'] || '通用'}`, callback_data: 'ra:tag:通用' },
    ],
  ];

  if (customTags && customTags.length > 0) {
    for (let i = 0; i < customTags.length; i += 2) {
      const row = [{ text: `🏷️ ${customTags[i]}`, callback_data: `ra:tag:${customTags[i]}`.slice(0, 64) }];
      if (i + 1 < customTags.length) {
        row.push({ text: `🏷️ ${customTags[i + 1]}`, callback_data: `ra:tag:${customTags[i + 1]}`.slice(0, 64) });
      }
      rows.push(row);
    }
  }

  rows.push([{ text: '➕ 自定义新标签', callback_data: 'ta:start' }]);
  rows.push([{ text: dict.dashboard.btnCancel, callback_data: 'm:routes' }]);
  return rows;
}

export function getTagsMenuKeyboard(
  dict: TranslationDict,
  customTags: string[] = []
): Array<Array<{ text: string; callback_data: string }>> {
  const rows: Array<Array<{ text: string; callback_data: string }>> = [
    [{ text: '➕ 新增标签', callback_data: 'ta:start' }],
  ];

  if (customTags && customTags.length > 0) {
    for (const tag of customTags) {
      rows.push([
        {
          text: `🗑️ 删除 ${tag}`,
          callback_data: `td:${tag}`.slice(0, 64),
        },
      ]);
    }
  }

  rows.push([{ text: dict.dashboard.btnBackRoutes || '🔙 返回业务路由', callback_data: 'm:routes' }]);
  return rows;
}

export function getKeywordsMenuKeyboard(
  dict: TranslationDict
): Array<Array<{ text: string; callback_data: string }>> {
  return [
    [
      { text: '📋 查看全部关键词', callback_data: 'kw:view' },
      { text: dict.dashboard.btnAddKw || '➕ 追加拦截词', callback_data: 'kw:add_start' },
    ],
    [
      { text: '🔄 重置为默认词库', callback_data: 'kw:reset_confirm' },
    ],
    [
      { text: dict.dashboard.btnBackMain, callback_data: 'm:main' },
    ],
  ];
}

export function getForwardMenuKeyboard(
  dict: TranslationDict,
  aliasesActive: boolean
): Array<Array<{ text: string; callback_data: string }>> {
  return [
    [
      {
        text: aliasesActive ? '🔄 停用 Gmail 别名 (+tag)' : '🔄 开启 Gmail 别名 (+tag)',
        callback_data: 'fwd:toggle_alias',
      },
    ],
    [
      { text: dict.dashboard.btnSetForward || '📬 修改备份邮箱', callback_data: 'fwd:set_start' },
      { text: dict.dashboard.btnResetForward || '🗑️ 清除备份邮箱', callback_data: 'fwd:reset_confirm' },
    ],
    [
      { text: dict.dashboard.btnBackMain, callback_data: 'm:main' },
    ],
  ];
}

// ======================== Start Welcome Card & Keyboard ========================

export interface RenderStartOptions {
  dict: TranslationDict;
  provider: string;
  model: string;
  forwardEmail: string;
  gmailAliasesEnabled: boolean;
}

export function renderStartCardHtml(options: RenderStartOptions): string {
  const { dict, provider, model, forwardEmail, gmailAliasesEnabled } = options;
  const fwdDisplay = forwardEmail ? `<code>${escapeHtml(forwardEmail)}</code>` : dict.startCommand.statusNoForward;
  const aliasDisplay = gmailAliasesEnabled ? dict.startCommand.statusAliasOn : dict.startCommand.statusAliasOff;

  return [
    dict.startCommand.title,
    `━━━━━━━━━━━━━━━━━━`,
    dict.startCommand.subtitle,
    ``,
    dict.startCommand.statusSectionTitle,
    `• <b>${dict.startCommand.statusRunningLabel}:</b> 🟢 ${dict.startCommand.statusRunningValue}`,
    `• <b>${dict.startCommand.statusEngineLabel}:</b> <b>${escapeHtml(provider)}</b> (<code>${escapeHtml(model)}</code>)`,
    `• <b>${dict.startCommand.statusForwardLabel}:</b> ${fwdDisplay} <i>(${aliasDisplay})</i>`,
    `• <b>${dict.startCommand.statusDefenseLabel}:</b> ${dict.startCommand.statusDefenseValue}`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `<i>💡 ${dict.startCommand.guideTip}</i>`,
  ].join('\n');
}

export function getStartKeyboard(
  dict: TranslationDict
): Array<Array<{ text: string; callback_data: string }>> {
  return [
    [{ text: dict.startCommand.btnOpenMenu, callback_data: 'm:main' }],
    [
      { text: dict.startCommand.btnGuide || '📖 使用指南', callback_data: 'm:guide' },
      { text: dict.dashboard.btnLang, callback_data: 'm:lang' },
    ],
  ];
}

// ======================== Detailed Usage Guide ========================

export function renderUsageGuideHtml(dict: TranslationDict): string {
  const guide = dict.usageGuide || {
    title: '📖 <b>【 cf-mail2tg-aibot 使用指南 】</b>',
    subtitle: '网关基础功能与配置说明：',
    principlesTitle: '⚙️ <b>1. 工作流程</b>',
    principlesContent:
      '• <b>邮件接收</b>: 域名邮箱接收来信，由 Worker 脚本进行过滤与结构化解析。\n' +
      '• <b>基础防护</b>: 拦截超大邮件 (默认 5MB) 与危险格式附件，防止垃圾邮件冲击。\n' +
      '• <b>双轨投递</b>: 提取正文文本与验证码推送至 Telegram，同时原样转发至备份邮箱。',
    tagsTitle: '🏷️ <b>2. 邮件分类与验证码</b>',
    tagsContent:
      '• <b>意图类型</b>: <code>验证</code> · <code>营销</code> · <code>告警</code> · <code>账单</code> · <code>业务</code> · <code>通知</code>\n' +
      '• <b>验证码提取</b>: 识别到登录与注册验证码时置顶显示，支持直接点击复制。\n' +
      '• <b>安全校验</b>: 校验发件人 SPF / DKIM 签名状态以标识发件来源可信度。',
    antiSpamTitle: '🛡️ <b>3. 垃圾拦截与静默推送</b>',
    antiSpamContent:
      '• <b>规则过滤</b>: 识别含退订标头 (RFC 8058) 或命中拦截词库的邮件，自动归为营销分类。\n' +
      '• <b>静默通知</b>: 营销邮件默认开启静音推送，且不触发 AI 模型调用以节约算力。\n' +
      '• <b>词库匹配</b>: 根据系统语言自动匹配词库，支持使用 <code>/addkeywords</code> 自行扩充。',
    routesTitle: '📂 <b>4. 前缀路由与别名</b>',
    routesContent:
      '• <b>前缀分流</b>: 根据收信前缀归类业务画像（如 <code>support@</code> 归为客服，<code>admin@</code> 归为个人）。\n' +
      '• <b>邮箱别名</b>: 开启后转发时自动追加 <code>+tag</code> 别名（如 <code>user+support@gmail.com</code>），便于在邮箱内分类归档。',
    commandsTitle: '⚡ <b>5. 常用指令速查</b>',
    commandsContent:
      '• <code>/start</code> - 查看运行状态与快捷入口\n' +
      '• <code>/menu</code> - 打开设置面板 (⚙️ 设置)\n' +
      '• <code>/guide</code> - 查看本使用指南\n' +
      '• <code>/routes</code> - 管理前缀分流规则与自定义标签\n' +
      '• <code>/keywords</code> - 查看与维护拦截词库\n' +
      '• <code>/ai</code> - 切换 AI 模型厂商与版本\n' +
      '• <code>/lang</code> - 切换系统语言',
    footerTip: '轻触消息下方按键即可快捷操作，无需手动输入指令。',
    btnBackStart: '🔙 返回总览',
    btnBackDashboard: '⚙️ 设置',
    btnViewDocs: '🌐 查看 GitHub 详细文档',
  };

  return [
    guide.title,
    `━━━━━━━━━━━━━━━━━━`,
    guide.subtitle,
    ``,
    guide.principlesTitle,
    guide.principlesContent,
    ``,
    guide.tagsTitle,
    guide.tagsContent,
    ``,
    guide.antiSpamTitle,
    guide.antiSpamContent,
    ``,
    guide.routesTitle,
    guide.routesContent,
    ``,
    guide.commandsTitle,
    guide.commandsContent,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `<i>💡 ${guide.footerTip}</i>`,
  ].join('\n');
}

export function getUsageGuideKeyboard(
  dict: TranslationDict
): Array<Array<{ text: string; callback_data?: string; url?: string }>> {
  return [
    [
      {
        text: dict.usageGuide?.btnViewDocs || '🌐 查看 GitHub 详细文档',
        url: 'https://github.com/Sacilave/cf-mail2tg-aibot#readme',
      },
    ],
    [
      { text: dict.usageGuide?.btnBackStart || '🔙 返回总览', callback_data: 'm:start' },
      { text: dict.usageGuide?.btnBackDashboard || dict.startCommand.btnOpenMenu, callback_data: 'm:main' },
    ],
  ];
}
