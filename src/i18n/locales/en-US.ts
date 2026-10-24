import type { TranslationDict } from '../types';

export const enUS: TranslationDict = {
  langCode: 'en-US',
  langName: 'English',
  flag: '🇺🇸',

  commandDesc: {
    lang: 'Switch language / 切换语言',
    setup: 'Interactive setup wizard (1-min step-by-step)',
    config: 'View credentials, routing status & config hub',
    setkey: 'Hot-update API keys & forward inbox: setkey <type> <val>',
    resetkey: 'Reset dynamic keys and fallback to defaults',
    cancel: 'Exit current setup wizard or interactive session',
    keywords: 'View and copy all marketing filter keywords',
    addkeywords: 'Safely append marketing keywords without overwrite',
    resetkeywords: 'Reset marketing keywords to default baseline',
    routes: 'View active domain routing mappings and persona rules',
    add: 'Add custom route rule: add <tag> <prefix> [forward]',
    del: 'Delete custom route rule: del <prefix>',
    help: 'View gateway operation manual & command status',
  },

  langCommand: {
    selectPrompt:
      '🌐 <b>【 Language Settings / 语言偏好设置 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Please select your preferred language for notifications and commands:\n' +
      '请选择 Telegram 消息卡片与交互指令的显示语言：',
    currentLang: (name: string) => `\n📌 Current Active Language: <b>${name}</b>`,
    successAlert: (name: string) => `Language successfully switched to ${name}!`,
    successCard: (name: string) =>
      `✅ <b>Language Preference Updated!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Active system language is now set to: <b>${name}</b>\n` +
      `All future incoming email cards, security alerts, and command panels will be rendered in this language.\n\n` +
      `💡 <i>Send /help to explore all commands in your selected language.</i>`,
    invalidArg:
      '❌ <b>Invalid Language Code!</b>\n' +
      'Available options: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      'Example: <code>/lang en</code> or send <code>/lang</code> to open interactive menu.',
  },

  startCommand: {
    title: '👋 <b>【 cf-mail2tg-aibot Mail Gateway Ready 】</b>',
    stepGuideTitle: '⚡ <b>3-Step Rapid Getting Started Guide:</b>',
    step1Title: '1️⃣ <b>Check Gateway Status</b>',
    step1Desc: '   Send <code>/config</code> to inspect LLM model, backup inbox, and KV database bindings.',
    step2Title: '2️⃣ <b>Hot-Update Keys via Telegram (Optional)</b>',
    step2Desc1: '   • Enable AI triage & code extraction: <code>/setkey minimax &lt;API_KEY&gt;</code>',
    step2Desc2: '   • Bind/change backup forwarding inbox: <code>/setkey forward &lt;email&gt;</code>',
    step3Title: '3️⃣ <b>Configure Domain Personas</b>',
    step3Desc1: '   • View active persona routes: <code>/routes</code>',
    step3Desc2: '   • Add custom address routing: <code>/add Commercial help</code> (Multi-domain ready)',
    shortcutsTitle: '💡 <b>Everyday Quick Commands:</b>',
    shortcutSetup: '• <code>/setup</code> - Interactive rapid setup wizard',
    shortcutConfig: '• <code>/config</code> - View active configuration & masked keys',
    shortcutKeywords: '• <code>/keywords</code> - Manage marketing filter keywords (Reply to edit)',
    shortcutLang: '• <code>/lang</code> - Switch system display language',
    shortcutHelp: '• <code>/help</code> - View complete control panel & parameter manual',
    menuActivatedNote: '<i>The bottom-left [Menu] button is synchronized. Tap anytime for quick access.</i>',
  },

  helpCommand: {
    title: '🎛️ <b>【 cf-mail2tg-aibot Full Control Panel 】</b>',
    menuHint: 'Tap the <b>[Menu]</b> button or send any command below:',
    keysSectionTitle: '🔑 <b>Credentials & Gateway Status:</b>',
    configDesc: '• <code>/config</code> - View credentials status & config hub (masked)',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;key&gt;</code> - Hot-update LLM API key on mobile',
    setkeyForwardDesc: '• <code>/setkey forward &lt;email&gt;</code> - Hot-update backup forwarding inbox',
    resetkeyDesc: '• <code>/resetkey &lt;minimax|forward&gt;</code> - Reset dynamic key override to defaults',
    keywordsSectionTitle: '📋 <b>Marketing Keywords & Spam Shield:</b>',
    keywordsDesc: '• <code>/keywords</code> - View and 1-tap copy all marketing keywords',
    addkeywordsDesc: '• <code>/addkeywords</code> - Safely append keywords without overwriting',
    resetkeywordsDesc: '• <code>/resetkeywords</code> - Restore baseline default marketing keywords',
    routesSectionTitle: '🔀 <b>Domain Routing & Persona Rules:</b>',
    routesDesc: '• <code>/routes</code> - View all active baseline and KV custom rules',
    addDesc: '• <code>/add Tag Prefix [Target]</code> - Add address routing rule',
    delDesc: '• <code>/del Prefix</code> - Delete custom route rule (with confirmation)',
    langSectionTitle: '🌐 <b>Internationalization (i18n):</b>',
    langDesc: '• <code>/lang [code]</code> - Switch language for bot messages and email cards',
    setupSectionTitle: '🛠️ <b>Interactive Setup Wizard:</b>',
    setupDesc: '• <code>/setup</code> - Launch 2-step interactive configuration wizard',
    cancelDesc: '• <code>/cancel</code> - Exit active setup or interactive session anytime',
    footerTip: '💡 <i>Tip: You can reply directly to any keywords message from the Bot to edit.</i>',
  },

  configCommand: {
    title: '🎛️ <b>【 cf-mail2tg-aibot Configuration & Credentials Hub 】</b>',
    llmTitle: '🤖 <b>LLM Email Classification (MiniMax):</b>',
    llmReady: (source: string) => `  • Binding Status: ✅ Ready ${source}`,
    llmNotConfigured: '  • Binding Status: ⚪ Not configured (Using local regex sniffer)',
    llmMaskedKey: (key: string) => `  • Masked Key: <code>${key}</code>`,
    llmModel: (model: string) => `  • Model: <code>${model}</code>`,
    forwardTitle: '📥 <b>Zero-Drop Forwarding Track:</b>',
    forwardTarget: (target: string, source: string) => `  • Target Inbox: <code>${target}</code> ${source}`,
    forwardNotConfigured: '  • Target Inbox: ⚪ Not configured (Pure TG push mode)',
    forwardAliasesActive: '  • Gmail Aliases: ✅ Active (Auto +tag routing)',
    forwardAliasesDisabled: '  • Gmail Aliases: ⚪ Disabled (Direct to main inbox)',
    kvTitle: '🗄️ <b>KV Database (MAIL_ROUTES_KV):</b>',
    kvConnected: '  • Connection: ✅ Connected and active',
    kvNotConnected: '  • Connection: ❌ Not bound',
    kvKeywordsCount: (count: number) => `  • Active Marketing Keywords: <b>${count}</b>`,
    kvCustomRulesCount: (count: number) => `  • Custom Routing Rules: <b>${count}</b>`,
    securityTitle: '🛡️ <b>Edge Security & Guardrail Policies:</b>',
    securityBlockAll: '  • Zero-Attachment Policy: 🔴 Block All (SMTP 550)',
    securityHighRiskOnly: '  • Zero-Attachment Policy: 🟢 Block high-risk extensions only',
    securityMaxCap: (size: string) => `  • Size Cap Circuit Breaker: <b>${size}</b> (SMTP 552)`,
    securityMarketingPolicy: (policy: string) =>
      `  • Marketing Policy: <code>${policy === 'mute' ? 'Suppress TG Push (mute)' : 'Silent Notification (silent)'}</code>`,
    systemLangTitle: '🌐 <b>System Display Language:</b>',
    systemLangDesc: (name: string, source: string) => `  • Current Language: <b>${name}</b> ${source}`,
    shortcutsTitle: '💡 <b>Quick Update Commands:</b>',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - Hot-update LLM key',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;email&gt;</code> - Hot-update backup inbox',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - Clear LLM key override',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - Clear forward inbox override',
    shortcutLang: '• <code>/lang</code> - Switch display language (8 languages supported)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【 Hot-Update Credentials Guide 】</b>',
    helpUsage: '<b>Usage:</b> <code>/setkey &lt;type&gt; &lt;value&gt;</code>',
    helpMinimax: '• <b>Update LLM API Key:</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>Update Backup Forward Inbox:</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>Changes take effect immediately at Cloudflare edge.</i>',
    kvError: '❌ <b>System Error:</b> MAIL_ROUTES_KV is not bound.',
    successMinimax: (maskedKey: string) =>
      `✅ <b>LLM API Key Hot-Updated Successfully!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `New key stored in KV, preview: <code>${maskedKey}</code>\n` +
      `Future incoming emails will use this key for AI intent triage.`,
    successForward: (email: string) =>
      `✅ <b>Backup Forward Inbox Hot-Updated Successfully!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `New target address: <code>${email}</code>\n` +
      `⚠️ <i>Ensure this address is verified in Cloudflare Email Routing!</i>`,
    unsupportedType: (type: string) =>
      `❌ <b>Unsupported config type:</b> 「<code>${type}</code>」\nSupported types: <code>minimax</code> or <code>forward</code>.`,
  },

  resetkeyCommand: {
    helpTitle: '💡 <b>【 Reset Key Command Guide 】</b>',
    helpUsage: '<b>Usage:</b> <code>/resetkey &lt;minimax|forward&gt;</code>',
    helpDesc: 'Deletes the dynamic override from KV and falls back to environment variables.',
    kvError: '❌ <b>System Error:</b> MAIL_ROUTES_KV is not bound.',
    successReset: (subType: string) =>
      `🔄 <b>Reset ${subType} dynamic config!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `KV override cleared. System has fallen back to environment default.`,
  },

  keywordsCommand: {
    title: '📋 <b>【 Marketing Filter Keywords Management 】</b>',
    countDesc: (count: number) => `Currently active keywords: <b>${count}</b>.`,
    instructions:
      '💡 <b>How to edit (Copy, modify, and [Reply to this message]):</b>\n' +
      '1. Tap the code block below to copy all keywords;\n' +
      '2. Select <b>Reply to this message</b> (or send <code>setkeywords ...</code>), paste and adjust (<b>one keyword per line</b>);\n' +
      '3. Send your reply to update the keywords database globally in real time!',
    emptyError:
      '❌ <b>Update Failed:</b> No valid keywords detected.\nPlease provide at least one keyword (one per line).',
    kvError: '❌ <b>System Error:</b> MAIL_ROUTES_KV is not bound.',
    successUpdate: (count: number, preview: string, moreCount: string) =>
      `✅ <b>【 Marketing Keywords Database Updated! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Updated <b>${count}</b> marketing keywords globally at edge.\n\n` +
      `📝 <b>Keywords Preview:</b>\n` +
      `<code>${preview}${moreCount}</code>\n\n` +
      `💡 <i>Future emails matching these keywords or RFC unsubscribe headers will be delivered silently.</i>`,
    updateError: '❌ <b>Update Failed:</b> Error occurred while writing to KV database.',
    addHelpTitle: '💡 <b>【 Incremental Append Keywords Guide 】</b>',
    addHelpUsage: '<b>Usage:</b> <code>/addkeywords keyword1\nkeyword2</code>',
    addHelpDesc: 'Keywords are deduplicated and merged safely. <b>Existing keywords will never be overwritten.</b>',
    successAppend: (addedCount: number, totalCount: number, preview: string) =>
      `✅ <b>【 Keywords Appended Successfully (Safe Merge) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Successfully added: <b>${addedCount}</b> new keywords\n` +
      `• Total active keywords: <b>${totalCount}</b>\n` +
      `• Existing keywords preserved safely.\n\n` +
      `📝 <b>Added Items:</b>\n` +
      `<code>${preview}</code>`,
    appendError: '❌ <b>Append Failed:</b> Database write error.',
    resetSuccess: (count: number) =>
      `🔄 <b>【 Marketing Keywords Restored to Baseline 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Restored system default <b>${count}</b> standard bilingual marketing keywords.`,
  },

  routesCommand: {
    title: '📋 <b>【 Active Email Routing Rules 】</b>',
    presetBaselineTitle: '🔹 <b>System Preset Baseline Personas:</b>',
    fallbackGeneric: '• <i>(Unmatched addresses)</i> ➔ 🏷️ <b>General</b>',
    customRulesTitle: '🔸 <b>Dynamic Custom Rules (KV Storage):</b>',
    noCustomRules: '<i>(No custom rules yet. Use "add personal prefix" to add one)</i>',
    addHelpTitle: '💡 <b>【 Add Route Rule Guide 】</b>',
    addHelpUsage:
      '<b>Usage:</b> <code>add &lt;tag&gt; &lt;prefix&gt; [forward_email]</code>\n\n' +
      '• <b>Allowed Tags:</b> <code>Personal</code>, <code>General</code>, <code>Free Product</code>, <code>Paid Product</code>, <code>Commercial Support</code>\n' +
      '• <b>Prefix:</b> e.g. <code>support</code> maps to <code>support@your-domain.com</code>\n' +
      '• <b>Forward Email:</b> Optional. Defaults to primary forward email.\n\n' +
      '<b>Examples:</b>\n' +
      '• <code>add Personal blog</code>\n' +
      '• <code>add Commercial help user@domain.com</code>',
    addMissingPrefix:
      '❌ <b>Add Failed:</b> Missing prefix argument.\nUsage: <code>add &lt;tag&gt; &lt;prefix&gt; [forward_email]</code>',
    addInvalidTag: (allowed: string, input: string) =>
      `❌ <b>Add Failed:</b> Tag must be one of [${allowed}].\nYou provided: 「<code>${input}</code>」.`,
    addInvalidPrefix: (prefix: string) =>
      `❌ <b>Add Failed:</b> Prefix 「<code>${prefix}</code>」 is invalid. Only letters, numbers, dots, and hyphens are permitted.`,
    addSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>New Route Rule Added Successfully!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Target Prefix:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Persona Tag:</b> ${tag}\n` +
      `📥 <b>Forward Target:</b> <code>${forward || '(Pure TG Push)'}</code>\n\n` +
      `💡 <i>Catch-all will immediately route emails matching this prefix according to this rule.</i>`,
    delHelpTitle: '💡 <b>【 Delete Route Rule Guide 】</b>',
    delHelpUsage: '<b>Usage:</b> <code>del &lt;prefix&gt;</code>\n<b>Example:</b> <code>del blog</code>',
    delNotFound: (prefix: string) =>
      `⚠️ <b>Rule Not Found:</b> No custom rule found for prefix <code>${prefix}</code> in KV.`,
    delConfirmPrompt: (prefix: string, tag: string, forward: string) =>
      `⚠️ <b>Confirm Deletion of Route Rule?</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Prefix:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Current Tag:</b> ${tag}\n` +
      `📥 <b>Forward Target:</b> <code>${forward || '(None)'}</code>\n\n` +
      `⚠️ <i>Tap button below to confirm. This will permanently delete from KV!</i>`,
    delBtnConfirm: '🔴 Confirm Delete',
    delBtnCancel: '⚪ Cancel',
    delAlertDeleted: 'Permanently deleted from database',
    delAlertNotFound: 'Rule not found',
    delSuccessText: (prefix: string) =>
      `🗑️ <b>Rule Deleted Successfully!</b>\n━━━━━━━━━━━━━━━━━━\nRouting rule for prefix <code>${prefix}</code> has been completely erased from KV.`,
    delNotFoundText: (prefix: string) =>
      `⚠️ <b>Delete Failed:</b> <code>${prefix}</code> not found in database.`,
    delAlertCancelled: 'Action cancelled',
    delCancelledText: (prefix: string) =>
      `❌ <b>Action Cancelled</b>\n━━━━━━━━━━━━━━━━━━\nRule for prefix <code>${prefix}</code> remains unchanged.`,
  },

  setupCommand: {
    startWizardText:
      `🚀 <b>【 cf-mail2tg-aibot Setup Wizard (1/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Welcome to the rapid setup wizard! We will bind core credentials in 2 steps.\n` +
      `💡 <i>Type <code>skip</code> to bypass current step, or send <code>/cancel</code> anytime to exit.</i>\n\n` +
      `<b>Step 1: Configure Backup Forward Email</b>\n` +
      `Forwards inbound emails reliably to your primary mailbox (e.g. Gmail).\n` +
      `⚠️ <i>Ensure this address is verified under Cloudflare Email Routing ➔ Destination addresses!</i>\n\n` +
      `👉 <b>Please reply directly with your destination email</b> (e.g. <code>yourname@gmail.com</code>), or send <code>skip</code>:`,
    cancelSuccess:
      `❌ <b>Exited Setup Wizard</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Active wizard session has been reset. You can restart anytime with <code>/setup</code>.`,
    skipStep1Text:
      `⏭️ <b>Skipped backup forward email configuration.</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot Setup Wizard (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Step 2: Configure MiniMax LLM API Key</b>\n` +
      `Used for AI email triage (verification codes, bills, marketing, alerts) and code extraction.\n` +
      `💡 <i>If not available yet, type <code>skip</code> to fallback to fast local regex pattern sniffing.</i>\n\n` +
      `👉 <b>Please reply directly with your MiniMax API Key</b>, or send <code>skip</code>:`,
    formatErrorStep1: (input: string) =>
      `❌ <b>Invalid Email Address!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `You entered: <code>${input}</code>\n` +
      `Please provide a valid email format (e.g.: <code>mymail@gmail.com</code>), or send <code>skip</code>:`,
    successStep1Text: (email: string) =>
      `✅ <b>Backup Forward Email Bound Successfully!</b>\n` +
      `Saved target address: <code>${email}</code>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot Setup Wizard (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Step 2: Configure MiniMax LLM API Key</b>\n` +
      `Used for AI email triage (verification codes, bills, marketing, alerts) and code extraction.\n` +
      `💡 <i>If not available yet, type <code>skip</code> to fallback to fast local regex pattern sniffing.</i>\n\n` +
      `👉 <b>Please reply directly with your MiniMax API Key</b>, or send <code>skip</code>:`,
    step2Card:
      `🚀 <b>【 cf-mail2tg-aibot Setup Wizard (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Step 2: Configure MiniMax LLM API Key</b>\n` +
      `Used for AI email triage (verification codes, bills, marketing, alerts) and code extraction.\n` +
      `💡 <i>If not available yet, type <code>skip</code> to fallback to fast local regex pattern sniffing.</i>\n\n` +
      `👉 <b>Please reply directly with your MiniMax API Key</b>, or send <code>skip</code>:`,
    skipStep2Text: (fwdText: string, mmxText: string) =>
      `⏭️ <b>Skipped LLM API Key configuration.</b>\n\n` +
      `🎉 <b>【 Setup Completed Successfully! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Core Component Status:\n` +
      `• Backup Forward Email: ${fwdText}\n` +
      `• AI Email Triage: ${mmxText}\n\n` +
      `💡 <b>Next Steps:</b>\n` +
      `• Send <code>/config</code> to inspect global configuration & masked keys\n` +
      `• Send <code>/routes</code> to view active domain persona rules\n` +
      `• Send <code>/setkey</code> anytime to hot-update credentials`,
    keyEmptyError:
      `❌ <b>API Key cannot be empty!</b>\nPlease reply with a valid API Key, or send <code>skip</code>:`,
    successStep2Text: (maskedKey: string, fwdText: string) =>
      `✅ <b>LLM API Key Bound Successfully!</b>\n` +
      `Saved to KV, preview: <code>${maskedKey}</code>\n\n` +
      `🎉 <b>【 Setup Flow Fully Complete! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Your cf-mail2tg-aibot gateway is fully ready!\n` +
      `• Backup Forward Email: ${fwdText}\n` +
      `• AI Email Triage: ✅ Ready (<code>${maskedKey}</code>)\n\n` +
      `💡 <b>Next Steps:</b>\n` +
      `• Send <code>/config</code> to inspect global configuration & masked keys\n` +
      `• Send <code>/routes</code> to manage personas & domain rules\n` +
      `• Any incoming email will now be analyzed with AI triage in real time!`,
    kvRequiredError: `⚠️ <b>System Error:</b> MAIL_ROUTES_KV database is not bound. Wizard cannot start.`,
    notConfiguredPureTg: '⚪ Unconfigured (Pure TG Single-Track)',
    notConfiguredRegexFallback: '⚪ Unconfigured (Local Regex Fallback)',
    readyWithMask: (masked: string) => `✅ Ready (<code>${masked}</code>)`,
  },

  emailCard: {
    intentTags: {
      验证: 'Verification',
      营销: 'Marketing',
      告警: 'Security Alert',
      账单: 'Billing',
      业务: 'Business',
      通知: 'Notification',
    },
    personaTags: {
      个人: 'Personal',
      通用: 'General',
      免费产品: 'Free Product',
      付费产品: 'Paid Product',
      商业支持: 'Commercial Support',
    },
    newEmailTitle: (intentTag: string, targetName: string) =>
      `<b>【New Email · ${intentTag} · ${targetName}】</b>`,
    verificationCode: 'Verification Code',
    copyHint: 'Tap to copy',
    businessType: 'Persona Tag',
    recipientDomain: 'Target Domain',
    targetEmail: 'Target Inbox',
    senderFrom: 'Sender',
    authSPFDKIMPass: '🛡️ <b>Auth:</b> <code>SPF Passed · DKIM Valid</code>',
    authSPFOnly: '🛡️ <b>Auth:</b> <code>SPF Passed · DKIM Missing</code>',
    authDKIMOnly: '🛡️ <b>Auth:</b> <code>SPF Missing · DKIM Valid</code>',
    authFailed: '🚨 <b>Auth:</b> <code>SPF/DKIM Failed (Possible Spoof)</code>',
    authUnknown: '🛡️ <b>Auth:</b> <code>Unknown Signature</code>',
    aiRfcUnsubShortCircuit: '🏷️ <b>Protocol Audit:</b> <code>RFC 8058 Unsubscribe Hit (Short-circuited AI)</code>',
    aiKeywordShortCircuit: (keyword: string) =>
      `🏷️ <b>Rule Matched:</b> <code>Keyword [${keyword}] (Short-circuited AI)</code>`,
    aiMarketing: '🤖 <b>AI Triage:</b> <code>LLM identified as Marketing (Delivered silently)</code>',
    aiVerification: '🤖 <b>AI Triage:</b> <code>LLM identified as Verification (High Priority Alert)</code>',
    aiSecurity: '🤖 <b>AI Triage:</b> <code>LLM identified as Security Alert (Urgent Alert)</code>',
    aiBilling: '🤖 <b>AI Triage:</b> <code>LLM identified as Financial/Billing (Sound Alert)</code>',
    aiNotification: '🤖 <b>AI Triage:</b> <code>LLM identified as System Notification (Standard Alert)</code>',
    aiImportant: '🤖 <b>AI Triage:</b> <code>LLM identified as Important Direct Mail (Sound Alert)</code>',
    aiErrorFallback: (detail: string) =>
      `🤖 <b>AI Status:</b> <code>⚠️ LLM API Error: ${detail} (Sound Alert Fallback)</code>`,
    aiRegexVerification: '🏷️ <b>Rule Matched:</b> <code>Pattern matched verification code (Sound Alert)</code>',
    subjectLabel: 'Subject',
    noSubject: '(No Subject)',
    unknownSender: 'Unknown Sender',
    attachmentsLabel: 'Attachments',
    attachmentsSynced: 'Synced to backup inbox',
    attachmentsUnit: (count: number) => ` etc. (${count} files in total)`,
    unnamedAttachment: 'Unnamed file',
    snippetLabel: 'Email Snippet',
    noTextContent: '(No plain text body content)',
    snippetFolded: (max: number) =>
      `... (Folded at ${max} characters; full original email synced to backup inbox)`,
    backupStatusLabel: 'Backup Status',
    backupSynced: (base: string, alias?: string) =>
      `<code>Synced to backup inbox (${base}${alias ? ` · ${alias}` : ''})</code>`,
    backupFailed: (error: string) => `<code>⚠️ Forward failed (${error})</code>`,
    backupPureTG: '<code>No backup inbox configured (Pure TG mode)</code>',
    replyContactLabel: 'Reply To',
  },

  securityAlerts: {
    reasonLabel: 'Reason',
    actionLabel: 'Defense Action',
    triggerLabel: 'Trigger Reason',
    defenseStatusLabel: 'Defense Status',
    sizeCapTitle: 'Email Gateway · Size Cap Circuit Breaker',
    sizeCapReason: (size: string, cap: string) =>
      `Email size is <b>${size}</b>, exceeding gateway cap (${cap})`,
    sizeCapAction:
      'Rejected with SMTP 552. <b>Not forwarded to backup inbox (0 storage consumption).</b>',
    sizeCapTip: 'Tip: Suggest sender use cloud drives or GitHub releases for large attachments.',
    attachmentTitle: 'Email Gateway · Attachment Armor Interception',
    attachmentReason: 'Attachment security policy violated',
    attachmentDetected: 'Detected attachments',
    attachmentAction:
      'Rejected with SMTP 550. <b>Not forwarded to backup inbox (0 storage consumption).</b>',
    rateLimitTitle: 'Email Gateway · Rate Limit Warning',
    rateLimitHighFreqSender: 'High-frequency sender',
    rateLimitReason: 'Inbound message frequency exceeded window threshold',
    rateLimitStatusForwarded: (base: string, alias?: string) =>
      `Email safely forwarded to backup inbox (<code>${base}</code>${alias ? ` · Alias <code>${alias}</code>` : ''})`,
    rateLimitStatusFailed: (error: string) => `⚠️ Forward failed: ${error}`,
    rateLimitStatusPureTG: 'Pure TG notification mode (No backup inbox)',
    rateLimitTip: 'Telegram push notifications temporarily silenced for this sender to prevent spam & TG 429.',
  },

  sources: {
    kvOverride: '(KV Override)',
    envDefault: '(Env Default)',
  },
};
