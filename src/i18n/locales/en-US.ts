import type { TranslationDict } from '../types';

export const enUS: TranslationDict = {
  langCode: 'en-US',
  langName: 'English',
  flag: '🇺🇸',

  commandDesc: {
    start: 'View gateway status overview',
    menu: 'Open Settings dashboard',
    guide: 'View detailed user guide',
    setup: 'Launch quick setup wizard',
    lang: 'Switch display language',
    config: 'View system status & credentials',
    provider: 'Switch AI model provider',
    model: 'Switch AI model version',
    routes: 'Manage routing rules & custom tags',
    keywords: 'View spam filter keyword list',
    addkeywords: 'Append spam filter keywords',
    resetkeywords: 'Reset spam keywords to baseline',
    add: 'Add route rule (add <tag> <prefix> [fwd])',
    del: 'Delete route rule (del <prefix>)',
    setkey: 'Set secret key or email (setkey <type> <val>)',
    resetkey: 'Reset dynamic secret key or email',
    cancel: 'Cancel active session or wizard',
    help: 'Display command manual & help',
  },

  dashboard: {
    title: '⚙️ <b>【 Settings 】</b>',
    desc: 'Tap buttons below to seamlessly switch AI providers, manage routing personas, maintain spam keywords, or change system language:',
    btnAi: '🤖 AI Model',
    btnRoutes: '📂 Routes',
    btnKeywords: '🚫 Anti-Spam',
    btnForward: '📬 Forwarding',
    btnLang: '🌐 Language / 语言',
    btnRefresh: '🔄 Refresh',
    btnBackMain: '🔙 Main Menu',
    btnBackAi: '🔙 AI Settings',
    btnBackRoutes: '🔙 Route Settings',
    btnManageModels: '🎯 Switch Model',
    btnSetKey: '🔑 Set API Key',
    btnSetAiKey: '🔑 Set API Key',
    btnResetAiKey: '🔄 Clear Custom Key',
    btnAddRoute: '➕ Add Route',
    btnTags: '🏷️ Tag Manager',
    btnAddKw: '➕ Add Keywords',
    btnSetForward: '📬 Update Forward Email',
    btnResetForward: '🗑️ Clear Forward Email',
    btnSetup: '⚡ Setup Wizard',
    btnCancel: '❌ Cancel',
    routesTitle: '📂 <b>【 Persona Routing Rules 】</b>',
    routesSelectTagPrompt: 'Select a <b>business category tag</b> for this new route (tap button):',
    routesInputPrefixPrompt: (tag: string) =>
      `Selected Category Tag: <b>【${tag}】</b>\n\n` +
      `Please reply with the <b>email prefix</b> you wish to bind (e.g. <code>vip</code> or <code>support</code>):\n` +
      `<i>(💡 To specify a dedicated forward target, reply: prefix email, e.g.: vip user@example.com)</i>`,
    routesAddSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>Routing rule added successfully!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Match Prefix: <code>${prefix}</code>\n` +
      `• Persona Tag: <b>${tag}</b>\n` +
      `• Destination: <code>${forward}</code>`,
    routesDeletedSuccess: (prefix: string) => `✅ Routing rule for prefix <code>${prefix}</code> deleted successfully!`,
    tagsTitle: '🏷️ <b>【 Business Category Tag Manager 】</b>',
    tagsPrompt: 'Manage your custom business category tags here. These tags can be assigned to routing rules:',
    tagsEmpty: 'No custom tags yet. System default categories are currently in use (Personal, Support, Business, Product, Generic).',
    tagsAddSuccess: (tag: string) => `✅ Custom tag added successfully: <b>【${tag}】</b>!`,
    tagsDeleteSuccess: (tag: string) => `✅ Custom tag deleted: <b>【${tag}】</b>!`,
    tagsAddPrompt:
      '🏷️ <b>【 Add Custom Tag 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Please reply with the tag name you want to create (e.g. <code>Finance</code>, <code>Monitoring</code>, <code>Dev</code>, max 10 chars):',
    tagsInvalid: '❌ Invalid or duplicate tag name (must be 1-10 characters without spaces).',
    kwTitle: '🚫 <b>【 Marketing & Spam Keyword Filter 】</b>',
    fwdTitle: '📬 <b>【 Forwarding & Backup Inbox 】</b>',
    toastUpdated: 'Settings updated!',
    toastCancelled: 'Operation cancelled',
  },

  providerCommand: {
    title: '🏢 <b>【 Select AI Provider 】</b>',
    current: (provider: string, model: string) => `Current Provider: <b>${provider}</b> (Model: <code>${model}</code>)`,
    prompt: 'Reply with the corresponding number (valid for 5 minutes):',
    success: (provider: string, model: string, note: string) =>
      `✅ <b>AI Provider Switched Successfully!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Active Provider: <b>${provider}</b>\n` +
      `• Running Model: <code>${model}</code>\n` +
      `${note}`,
    invalidOption: '❌ Invalid selection. Please enter a number between 1 and 9. Send /cancel to exit.',
    kvError: '❌ Cannot save configuration: MAIL_ROUTES_KV namespace binding not found.',
    tipSetKey: '💡 Tip: If this provider requires an API Key, send <code>/setkey ai &lt;your-key&gt;</code>. To switch models, send <code>/model</code>.',
  },

  modelCommand: {
    title: (provider: string) => `🧠 <b>【 Select Model for ${provider} 】</b>`,
    current: (model: string) => `Current Model: <code>${model}</code>`,
    prompt: 'Reply with a number or enter a custom model name (valid for 5 minutes):',
    success: (model: string) =>
      `✅ <b>Model Updated Successfully!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Active Model: <code>${model}</code>`,
    invalidOption: '❌ Invalid model option. Send /cancel to exit.',
    kvError: '❌ Cannot save configuration: MAIL_ROUTES_KV namespace binding not found.',
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
      'Available options: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ko-KR</code> (한국어), <code>pt-BR</code> (Português), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      'Example: <code>/lang en</code> or send <code>/lang</code> to open interactive menu.',
  },

  startCommand: {
    title: '👋 <b>【 cf-mail2tg-aibot Gateway 】</b>',
    subtitle: 'Cloudflare email routing and AI analysis bot is active. Incoming emails are securely sanitized, classified, and forwarded to this chat.',
    statusSectionTitle: '📊 <b>Gateway Readiness Summary:</b>',
    statusRunningLabel: 'Status',
    statusRunningValue: 'Online',
    statusEngineLabel: 'AI Engine',
    statusForwardLabel: 'Backup Forward',
    statusNoForward: 'TG-Only Mode (None)',
    statusAliasOn: 'Gmail Aliases Active',
    statusAliasOff: 'Direct Forward',
    statusDefenseLabel: 'Edge Armor',
    statusDefenseValue: 'Zero-Attachment (550) · 5MB Size Cap',
    guideTip: 'Tap 【Settings】 to manage gateway configurations; tap 【User Guide】 for details; tap 【🌐 Language / 语言】 to switch display language.',
    btnOpenMenu: '⚙️ Settings',
    btnGuide: '📖 User Guide',
  },

  usageGuide: {
    title: '📖 <b>【 cf-mail2tg-aibot User Guide 】</b>',
    subtitle: 'Gateway architecture and configuration instructions:',
    principlesTitle: '⚙️ <b>1. Workflow</b>',
    principlesContent:
      '• <b>Inbound Processing</b>: Emails sent to your domain are received and parsed by the Worker script.\n' +
      '• <b>Basic Safeguards</b>: Rejects oversized emails (default 5MB) and dangerous file types to block spam floods.\n' +
      '• <b>Dual-Track Delivery</b>: Extracts plain text and OTP codes to Telegram while forwarding raw emails to your backup inbox.',
    tagsTitle: '🏷️ <b>2. Email Classification & OTP Codes</b>',
    tagsContent:
      '• <b>Intent Types</b>: <code>Verification</code> · <code>Marketing</code> · <code>Security</code> · <code>Billing</code> · <code>Direct</code> · <code>Notification</code>\n' +
      '• <b>OTP Extraction</b>: Automatically identifies verification codes and displays them at the top for 1-tap copying.\n' +
      '• <b>Sender Authentication</b>: Verifies SPF / DKIM / DMARC records to indicate sender trustworthiness.',
    antiSpamTitle: '🛡️ <b>3. Spam Filtering & Silent Delivery</b>',
    antiSpamContent:
      '• <b>Rule Filtering</b>: Flags emails with unsubscribe headers (RFC 8058) or keyword matches as Marketing.\n' +
      '• <b>Silent Alerts</b>: Marketing emails default to silent delivery and skip AI model invocation to conserve quota.\n' +
      '• <b>Dictionary Sync</b>: Matches keywords based on the configured language, expandable via <code>/addkeywords</code>.',
    routesTitle: '📂 <b>4. Prefix Routing & Aliases</b>',
    routesContent:
      '• <b>Prefix Triage</b>: Categorizes emails by inbox prefix (e.g. <code>support@</code> to Support, <code>admin@</code> to Personal).\n' +
      '• <b>Inbox Aliases</b>: Appends <code>+tag</code> aliases during forwarding (e.g. <code>user+support@gmail.com</code>) for personal inbox filtering.',
    commandsTitle: '⚡ <b>5. Command Quick Reference</b>',
    commandsContent:
      '• <code>/start</code> - Gateway status summary & shortcuts\n' +
      '• <code>/menu</code> - Open Settings dashboard (⚙️ Settings)\n' +
      '• <code>/guide</code> - View this user guide\n' +
      '• <code>/routes</code> - Manage prefix routing rules & custom tags\n' +
      '• <code>/keywords</code> - View and manage spam keyword filter\n' +
      '• <code>/ai</code> - Switch AI providers & models\n' +
      '• <code>/lang</code> - Change system display language',
    footerTip: 'Most actions can be performed via the inline buttons below without typing commands.',
    btnBackStart: '🔙 Back to Overview',
    btnBackDashboard: '⚙️ Settings',
    btnViewDocs: '🌐 View Detailed Docs on GitHub',
  },

  helpCommand: {
    title: '📖 <b>【 cf-mail2tg-aibot Command Help 】</b>',
    menuHint: 'Tap the <b>[Menu]</b> button or send any command below:',
    keysSectionTitle: '🔑 <b>Status & Configuration Commands:</b>',
    configDesc: '• <code>/config</code> - View system status & masked credentials',
    providerDesc: '• <code>/provider</code> - Interactive switch of AI provider',
    modelDesc: '• <code>/model</code> - Interactive switch of running model version',
    setkeyAiDesc: '• <code>/setkey ai &lt;key&gt;</code> - Hot-update universal AI API key',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;key&gt;</code> - Hot-update MiniMax API key',
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
    title: '⚙️ <b>【 Settings & Credentials Status 】</b>',
    llmTitle: '🤖 <b>LLM Email Classification (AI):</b>',
    llmProvider: (provider: string) => `  • AI Provider: <b>${provider}</b>`,
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
    shortcutProvider: '• <code>/provider</code> - Interactive AI provider switch',
    shortcutModel: '• <code>/model</code> - Interactive model switch',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - Hot-update LLM key',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;email&gt;</code> - Hot-update backup inbox',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - Clear LLM key override',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - Clear forward inbox override',
    shortcutLang: '• <code>/lang</code> - Switch display language (10 languages supported)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【 Hot-Update Credentials Guide 】</b>',
    helpUsage: '<b>Usage:</b> <code>/setkey &lt;type&gt; &lt;value&gt;</code>',
    helpAi: '• <b>Update Universal AI Key:</b>\n  <code>/setkey ai sk-your-api-key</code>',
    helpMinimax: '• <b>Update MiniMax API Key:</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>Update Backup Forward Inbox:</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>Changes take effect immediately at Cloudflare edge.</i>',
    kvError: '❌ <b>System Error:</b> MAIL_ROUTES_KV is not bound.',
    successAi: (maskedKey: string) =>
      `✅ <b>AI API Key Hot-Updated Successfully!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `New key stored in KV, preview: <code>${maskedKey}</code>\n` +
      `Future incoming emails will use this key for AI intent triage.`,
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
      `❌ <b>Unsupported config type:</b> 「<code>${type}</code>」\nSupported types: <code>ai</code>, <code>minimax</code>, or <code>forward</code>.`,
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
      客服: 'Customer Support',
      商务: 'Business & Sales',
      产品: 'Product',
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
