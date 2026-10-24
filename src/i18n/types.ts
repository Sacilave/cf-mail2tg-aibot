/**
 * =============================================================================
 * Module: src/i18n/types.ts
 * Description: Strong type definitions and schemas for internationalization.
 * Supports 8 mainstream languages: zh-CN, en-US, zh-TW, ja-JP, ru-RU, es-ES, fr-FR, de-DE.
 * =============================================================================
 */

export type SupportedLang =
  | 'zh-CN'
  | 'en-US'
  | 'zh-TW'
  | 'ja-JP'
  | 'ru-RU'
  | 'es-ES'
  | 'fr-FR'
  | 'de-DE';

export interface LanguageMeta {
  code: SupportedLang;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇭🇰' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export interface TranslationDict {
  langCode: SupportedLang;
  langName: string;
  flag: string;

  // Bot Menu Commands description
  commandDesc: {
    lang: string;
    setup: string;
    config: string;
    setkey: string;
    resetkey: string;
    cancel: string;
    keywords: string;
    addkeywords: string;
    resetkeywords: string;
    routes: string;
    add: string;
    del: string;
    help: string;
  };

  // /lang command
  langCommand: {
    selectPrompt: string;
    currentLang: (name: string) => string;
    successAlert: (name: string) => string;
    successCard: (name: string) => string;
    invalidArg: string;
  };

  // /start command
  startCommand: {
    title: string;
    stepGuideTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc1: string;
    step2Desc2: string;
    step3Title: string;
    step3Desc1: string;
    step3Desc2: string;
    shortcutsTitle: string;
    shortcutSetup: string;
    shortcutConfig: string;
    shortcutKeywords: string;
    shortcutLang: string;
    shortcutHelp: string;
    menuActivatedNote: string;
  };

  // /help or /menu command
  helpCommand: {
    title: string;
    menuHint: string;
    keysSectionTitle: string;
    configDesc: string;
    setkeyMinimaxDesc: string;
    setkeyForwardDesc: string;
    resetkeyDesc: string;
    keywordsSectionTitle: string;
    keywordsDesc: string;
    addkeywordsDesc: string;
    resetkeywordsDesc: string;
    routesSectionTitle: string;
    routesDesc: string;
    addDesc: string;
    delDesc: string;
    langSectionTitle: string;
    langDesc: string;
    setupSectionTitle: string;
    setupDesc: string;
    cancelDesc: string;
    footerTip: string;
  };

  // /config command
  configCommand: {
    title: string;
    llmTitle: string;
    llmReady: (source: string) => string;
    llmNotConfigured: string;
    llmMaskedKey: (key: string) => string;
    llmModel: (model: string) => string;
    forwardTitle: string;
    forwardTarget: (target: string, source: string) => string;
    forwardNotConfigured: string;
    forwardAliasesActive: string;
    forwardAliasesDisabled: string;
    kvTitle: string;
    kvConnected: string;
    kvNotConnected: string;
    kvKeywordsCount: (count: number) => string;
    kvCustomRulesCount: (count: number) => string;
    securityTitle: string;
    securityBlockAll: string;
    securityHighRiskOnly: string;
    securityMaxCap: (size: string) => string;
    securityMarketingPolicy: (policy: string) => string;
    systemLangTitle: string;
    systemLangDesc: (name: string, source: string) => string;
    shortcutsTitle: string;
    shortcutSetkeyMinimax: string;
    shortcutSetkeyForward: string;
    shortcutResetkeyMinimax: string;
    shortcutResetkeyForward: string;
    shortcutLang: string;
  };

  // /setkey command
  setkeyCommand: {
    helpTitle: string;
    helpUsage: string;
    helpMinimax: string;
    helpForward: string;
    helpTip: string;
    kvError: string;
    successMinimax: (maskedKey: string) => string;
    successForward: (email: string) => string;
    unsupportedType: (type: string) => string;
  };

  // /resetkey command
  resetkeyCommand: {
    helpTitle: string;
    helpUsage: string;
    helpDesc: string;
    kvError: string;
    successReset: (subType: string) => string;
  };

  // /keywords & /setkeywords & /addkeywords & /resetkeywords commands
  keywordsCommand: {
    title: string;
    countDesc: (count: number) => string;
    instructions: string;
    emptyError: string;
    kvError: string;
    successUpdate: (count: number, preview: string, moreCount: string) => string;
    updateError: string;
    addHelpTitle: string;
    addHelpUsage: string;
    addHelpDesc: string;
    successAppend: (addedCount: number, totalCount: number, preview: string) => string;
    appendError: string;
    resetSuccess: (count: number) => string;
  };

  // /routes, /add, /del commands
  routesCommand: {
    title: string;
    presetBaselineTitle: string;
    fallbackGeneric: string;
    customRulesTitle: string;
    noCustomRules: string;
    addHelpTitle: string;
    addHelpUsage: string;
    addMissingPrefix: string;
    addInvalidTag: (allowed: string, input: string) => string;
    addInvalidPrefix: (prefix: string) => string;
    addSuccess: (prefix: string, tag: string, forward: string) => string;
    delHelpTitle: string;
    delHelpUsage: string;
    delNotFound: (prefix: string) => string;
    delConfirmPrompt: (prefix: string, tag: string, forward: string) => string;
    delBtnConfirm: string;
    delBtnCancel: string;
    delAlertDeleted: string;
    delAlertNotFound: string;
    delSuccessText: (prefix: string) => string;
    delNotFoundText: (prefix: string) => string;
    delAlertCancelled: string;
    delCancelledText: (prefix: string) => string;
  };

  // /setup & /cancel wizard commands
  setupCommand: {
    startWizardText: string;
    cancelSuccess: string;
    skipStep1Text: string;
    formatErrorStep1: (input: string) => string;
    successStep1Text: (email: string) => string;
    step2Card: string;
    skipStep2Text: (fwdText: string, mmxText: string) => string;
    keyEmptyError: string;
    successStep2Text: (maskedKey: string, fwdText: string) => string;
    kvRequiredError: string;
    notConfiguredPureTg: string;
    notConfiguredRegexFallback: string;
    readyWithMask: (masked: string) => string;
  };

  // Inbound Email Card Push
  emailCard: {
    intentTags: Record<string, string>;
    personaTags: Record<string, string>;
    newEmailTitle: (intentTag: string, targetName: string) => string;
    verificationCode: string;
    copyHint: string;
    businessType: string;
    recipientDomain: string;
    targetEmail: string;
    senderFrom: string;
    authSPFDKIMPass: string;
    authSPFOnly: string;
    authDKIMOnly: string;
    authFailed: string;
    authUnknown: string;
    aiRfcUnsubShortCircuit: string;
    aiKeywordShortCircuit: (keyword: string) => string;
    aiMarketing: string;
    aiVerification: string;
    aiSecurity: string;
    aiBilling: string;
    aiNotification: string;
    aiImportant: string;
    aiErrorFallback: (detail: string) => string;
    aiRegexVerification: string;
    subjectLabel: string;
    noSubject: string;
    unknownSender: string;
    attachmentsLabel: string;
    attachmentsSynced: string;
    attachmentsUnit: (count: number) => string;
    unnamedAttachment: string;
    snippetLabel: string;
    noTextContent: string;
    snippetFolded: (max: number) => string;
    backupStatusLabel: string;
    backupSynced: (base: string, alias?: string) => string;
    backupFailed: (error: string) => string;
    backupPureTG: string;
    replyContactLabel: string;
  };

  // Security & Circuit Breaker Alerts
  securityAlerts: {
    reasonLabel: string;
    actionLabel: string;
    triggerLabel: string;
    defenseStatusLabel: string;
    sizeCapTitle: string;
    sizeCapReason: (size: string, cap: string) => string;
    sizeCapAction: string;
    sizeCapTip: string;
    attachmentTitle: string;
    attachmentReason: string;
    attachmentDetected: string;
    attachmentAction: string;
    rateLimitTitle: string;
    rateLimitHighFreqSender: string;
    rateLimitReason: string;
    rateLimitStatusForwarded: (base: string, alias?: string) => string;
    rateLimitStatusFailed: (error: string) => string;
    rateLimitStatusPureTG: string;
    rateLimitTip: string;
  };

  sources: {
    kvOverride: string;
    envDefault: string;
  };
}
