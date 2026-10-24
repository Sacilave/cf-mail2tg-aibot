import type { TranslationDict } from '../types';

export const zhCN: TranslationDict = {
  langCode: 'zh-CN',
  langName: '简体中文',
  flag: '🇨🇳',

  commandDesc: {
    lang: '切换显示语言 / Switch language',
    setup: '一键极速配置向导 (1分钟分步引导)',
    config: '查看密钥绑定状态与配置中枢',
    setkey: '热更新密钥/备份邮箱: setkey <类型> <值>',
    resetkey: '重置动态密钥并回退至默认配置',
    cancel: '退出当前向导或交互会话',
    keywords: '查看并复制全部营销拦截关键词',
    addkeywords: '增量安全追加营销关键词 (不覆盖)',
    resetkeywords: '重置营销关键词为系统默认基线',
    routes: '查看当前所有域名路由映射与规则',
    add: '添加自定义路由规则: add 标签 前缀 [转发目标]',
    del: '删除自定义路由规则: del 前缀',
    help: '查看网关操作帮助与状态',
  },

  langCommand: {
    selectPrompt:
      '🌐 <b>【 语言偏好设置 / Language Settings 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      '请选择 Telegram 消息卡片与交互指令的显示语言：\n' +
      'Please select your preferred language for notifications and commands:',
    currentLang: (name: string) => `\n📌 当前生效语言: <b>${name}</b>`,
    successAlert: (name: string) => `语言已成功切换为 ${name}！`,
    successCard: (name: string) =>
      `✅ <b>语言偏好已更新！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `当前系统语言已设置为: <b>${name}</b>\n` +
      `后续收到的新邮件推送卡片、安全警报与指令面板将即刻以该语言呈现。\n\n` +
      `💡 <i>发送 /help 可查看当前语言的完整指令字典。</i>`,
    invalidArg:
      '❌ <b>无效的语言代码！</b>\n' +
      '可用语言选项: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      '示例: <code>/lang en</code> 或直接发送 <code>/lang</code> 打开交互式菜单。',
  },

  startCommand: {
    title: '👋 <b>【 cf-mail2tg-aibot 邮件网关已就绪 】</b>',
    stepGuideTitle: '⚡ <b>高效 3 步初始化指引:</b>',
    step1Title: '1️⃣ <b>查验就绪状态</b>',
    step1Desc: '   发送 <code>/config</code> 查看大模型、备份邮箱与 KV 数据库连接状态。',
    step2Title: '2️⃣ <b>手机端热更新密钥 (可选)</b>',
    step2Desc1: '   • 开启 AI 审信与提码: <code>/setkey minimax &lt;API_KEY&gt;</code>',
    step2Desc2: '   • 设置/更换 Gmail 备份: <code>/setkey forward &lt;接收邮箱&gt;</code>',
    step3Title: '3️⃣ <b>配置域名收信画像</b>',
    step3Desc1: '   • 查看生效画像规则: <code>/routes</code>',
    step3Desc2: '   • 添加专属分流规则: <code>/add 商业支持 help</code> (支持多域名)',
    shortcutsTitle: '💡 <b>日常快捷指令:</b>',
    shortcutSetup: '• <code>/setup</code> - 交互式极速分步向导',
    shortcutConfig: '• <code>/config</code> - 查看当前配置与脱敏密钥',
    shortcutKeywords: '• <code>/keywords</code> - 营销拦截词库管理 (回复即改)',
    shortcutLang: '• <code>/lang</code> - 切换系统显示语言 (多语言支持)',
    shortcutHelp: '• <code>/help</code> - 查看全量控制面板与详细参数说明',
    menuActivatedNote: '<i>左下角 [Menu] 菜单按钮已同步激活，点击即可快捷调用。</i>',
  },

  helpCommand: {
    title: '🎛️ <b>【 cf-mail2tg-aibot 全量控制面板 】</b>',
    menuHint: '您可直接点击左下角 <b>[Menu]</b> 按钮或发送以下指令：',
    keysSectionTitle: '🔑 <b>密钥与运行状态指令:</b>',
    configDesc: '• <code>/config</code> - 查看密钥绑定状态与配置中枢 (带脱敏掩码)',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;key&gt;</code> - 手机端热更新大模型密钥',
    setkeyForwardDesc: '• <code>/setkey forward &lt;email&gt;</code> - 手机端热更新备份邮箱',
    resetkeyDesc: '• <code>/resetkey &lt;minimax|forward&gt;</code> - 重置动态覆盖回退默认值',
    keywordsSectionTitle: '📋 <b>营销关键词与防垃圾指令:</b>',
    keywordsDesc: '• <code>/keywords</code> - 查看并一键复制全部营销关键词',
    addkeywordsDesc: '• <code>/addkeywords</code> - 增量安全追加关键词（绝不覆盖已有词）',
    resetkeywordsDesc: '• <code>/resetkeywords</code> - 恢复系统默认基线关键词',
    routesSectionTitle: '🔀 <b>域名路由与画像指令:</b>',
    routesDesc: '• <code>/routes</code> - 查看所有已生效的内置与 KV 路由规则',
    addDesc: '• <code>/add 标签 前缀 [目标]</code> - 添加新地址分流规则',
    delDesc: '• <code>/del 前缀</code> - 删除自定义路由规则（带二次确认）',
    langSectionTitle: '🌐 <b>国际化与多语言:</b>',
    langDesc: '• <code>/lang [语言代码]</code> - 切换 Bot 与邮件卡片的显示语言',
    setupSectionTitle: '🛠️ <b>配置向导与会话:</b>',
    setupDesc: '• <code>/setup</code> - 启动交互式 2 步配置向导',
    cancelDesc: '• <code>/cancel</code> - 随时取消当前进行中的向导会话',
    footerTip: '💡 <i>提示: 您也可以随时直接回复 Bot 发送的任何关键词列表消息进行快捷修改。</i>',
  },

  configCommand: {
    title: '🎛️ <b>【 cf-mail2tg-aibot 配置与密钥中枢 】</b>',
    llmTitle: '🤖 <b>大模型审信 (LLM):</b>',
    llmReady: (source: string) => `  • 绑定状态: ✅ 已就绪 ${source}`,
    llmNotConfigured: '  • 绑定状态: ⚪ 未配置 (当前使用本地正则嗅探)',
    llmMaskedKey: (key: string) => `  • 密钥脱敏: <code>${key}</code>`,
    llmModel: (model: string) => `  • 运行模型: <code>${model}</code>`,
    forwardTitle: '📥 <b>零丢信备份轨 (Forward):</b>',
    forwardTarget: (target: string, source: string) => `  • 目标邮箱: <code>${target}</code> ${source}`,
    forwardNotConfigured: '  • 目标邮箱: ⚪ 未配置 (纯TG单轨模式)',
    forwardAliasesActive: '  • 别名分流: ✅ 已激活 (自动+标签)',
    forwardAliasesDisabled: '  • 别名分流: ⚪ 已停用 (直转主邮箱)',
    kvTitle: '🗄️ <b>KV 数据库 (MAIL_ROUTES_KV):</b>',
    kvConnected: '  • 连接状态: ✅ 已绑定生效',
    kvNotConnected: '  • 连接状态: ❌ 未连接',
    kvKeywordsCount: (count: number) => `  • 活跃营销关键词: <b>${count}</b> 个`,
    kvCustomRulesCount: (count: number) => `  • 自定义路由规则: <b>${count}</b> 条`,
    securityTitle: '🛡️ <b>边缘装甲与安全策略:</b>',
    securityBlockAll: '  • 零附件拦截策略: 🔴 全量拒信 (SMTP 550)',
    securityHighRiskOnly: '  • 零附件拦截策略: 🟢 仅拦截高危格式',
    securityMaxCap: (size: string) => `  • 邮件体积熔断上限: <b>${size}</b> (SMTP 552)`,
    securityMarketingPolicy: (policy: string) =>
      `  • 营销推送策略: <code>${policy === 'mute' ? '完全不推TG (mute)' : '静默不响铃 (silent)'}</code>`,
    systemLangTitle: '🌐 <b>系统显示语言:</b>',
    systemLangDesc: (name: string, source: string) => `  • 当前语言: <b>${name}</b> ${source}`,
    shortcutsTitle: '💡 <b>快捷更新指令:</b>',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - 热更新大模型密钥',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;邮箱地址&gt;</code> - 热更新备份邮箱',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - 清除密钥动态覆盖并回退',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - 清除备份邮箱动态覆盖',
    shortcutLang: '• <code>/lang</code> - 切换系统显示语言 (支持8种语言)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【热更新密钥/配置说明】</b>',
    helpUsage: '<b>格式:</b> <code>/setkey &lt;类型&gt; &lt;值&gt;</code>',
    helpMinimax: '• <b>更新大模型密钥:</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>更新备份邮箱:</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>更新后即刻保存在 KV 并在边缘端实时生效。</i>',
    kvError: '❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库。',
    successMinimax: (maskedKey: string) =>
      `✅ <b>大模型 API 密钥已成功热更新！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `新密钥已保存至 KV，脱敏预览: <code>${maskedKey}</code>\n` +
      `后续来信将即刻使用新密钥进行 LLM 意图识别。`,
    successForward: (email: string) =>
      `✅ <b>备份转发邮箱已成功热更新！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `新目标地址: <code>${email}</code>\n` +
      `⚠️ <i>请务必确保该邮箱已在 Cloudflare Email Routing 中完成验证！</i>`,
    unsupportedType: (type: string) =>
      `❌ <b>不支持的配置类型:</b> 「<code>${type}</code>」\n目前仅支持 <code>minimax</code> 或 <code>forward</code>。`,
  },

  resetkeyCommand: {
    helpTitle: '💡 <b>【重置密钥指令说明】</b>',
    helpUsage: '<b>格式:</b> <code>/resetkey &lt;minimax|forward&gt;</code>',
    helpDesc: '删除 KV 中的动态覆盖项，恢复使用环境变量中的初始默认值。',
    kvError: '❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库。',
    successReset: (subType: string) =>
      `🔄 <b>已重置 ${subType} 动态配置！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `已清除 KV 动态覆盖，系统已自动回退至环境变量中的初始默认配置。`,
  },

  keywordsCommand: {
    title: '📋 <b>【营销推广拦截关键词管理】</b>',
    countDesc: (count: number) => `当前生效关键词共 <b>${count}</b> 个。`,
    instructions:
      '💡 <b>修改方式（复制修改后【直接回复本条消息】）：</b>\n' +
      '1. 单击下方灰色代码块，在手机或电脑上一键复制全部内容；\n' +
      '2. 选择<b>「回复 (Reply)」本条消息</b>（或直接发送 <code>setkeywords ...</code>），粘贴并按需增删关键字（<b>一行一个关键字</b>）；\n' +
      '3. 发送后网关将自动全量更新并即刻在边缘生效！',
    emptyError:
      '❌ <b>更新失败:</b> 未检测到任何有效关键词。\n请输入至少一个关键词（每行一个），支持直接回复修改。',
    kvError: '❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库。',
    successUpdate: (count: number, preview: string, moreCount: string) =>
      `✅ <b>【营销关键词库已成功更新！】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `已全量更新 <b>${count}</b> 个营销拦截关键词，边缘网关即刻生效。\n\n` +
      `📝 <b>当前关键词预览:</b>\n` +
      `<code>${preview}${moreCount}</code>\n\n` +
      `💡 <i>后续命中上述任意关键词或 RFC 退订头的入站邮件，将自动静默推送并归档。</i>`,
    updateError: '❌ <b>更新失败:</b> 保存至数据库时出现异常。',
    addHelpTitle: '💡 <b>【增量添加关键词说明】</b>',
    addHelpUsage: '<b>格式:</b> <code>/addkeywords 关键词1\n关键词2</code>',
    addHelpDesc: '系统将自动去重并安全合并至现有词库，<b>绝不会覆盖原有的关键词</b>。',
    successAppend: (addedCount: number, totalCount: number, preview: string) =>
      `✅ <b>【增量关键词添加成功 (安全合并)】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 本次成功新增: <b>${addedCount}</b> 个（已过滤重复词）\n` +
      `• 现有生效总词数: <b>${totalCount}</b> 个\n` +
      `• 原有词库已安全保留，未发生覆盖。\n\n` +
      `📝 <b>本次新增项:</b>\n` +
      `<code>${preview}</code>`,
    appendError: '❌ <b>添加失败:</b> 保存至数据库时出现异常。',
    resetSuccess: (count: number) =>
      `🔄 <b>【营销关键词已重置为默认基线】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `已恢复系统预设的 <b>${count}</b> 个中英文标准营销关键词。`,
  },

  routesCommand: {
    title: '📋 <b>【 当前生效的邮件路由规则库 】</b>',
    presetBaselineTitle: '🔹 <b>系统预设基线画像:</b>',
    fallbackGeneric: '• <i>(其余未匹配地址)</i> ➔ 🏷️ <b>通用</b>',
    customRulesTitle: '🔸 <b>动态自定义规则 (KV 存储):</b>',
    noCustomRules: '<i>(暂无自定义规则，可使用 add 个人 xxx 快速添加)</i>',
    addHelpTitle: '💡 <b>【添加规则命令说明】</b>',
    addHelpUsage:
      '<b>格式:</b> <code>add &lt;标签&gt; &lt;前缀&gt; [转发邮箱]</code>\n\n' +
      '• <b>标签限定:</b> <code>个人</code>、<code>通用</code>、<code>免费产品</code>、<code>付费产品</code>、<code>商业支持</code>\n' +
      '• <b>前缀说明:</b> 例如输入 <code>support</code> 对应 <code>support@你的域名</code>\n' +
      '• <b>转发邮箱:</b> 可选，未提供时默认使用主转发邮箱\n\n' +
      '<b>示例:</b>\n' +
      '• <code>add 个人 blog</code>\n' +
      '• <code>add 商业支持 help user@domain.com</code>',
    addMissingPrefix:
      '❌ <b>添加失败:</b> 缺少前缀参数。\n正确格式: <code>add &lt;标签&gt; &lt;前缀&gt; [转发邮箱]</code>',
    addInvalidTag: (allowed: string, input: string) =>
      `❌ <b>添加失败:</b> 标签必须为 [${allowed}] 之一。\n您输入的标签为「<code>${input}</code>」，请检查后重试。`,
    addInvalidPrefix: (prefix: string) =>
      `❌ <b>添加失败:</b> 邮箱前缀「<code>${prefix}</code>」格式不合法，仅支持字母、数字、点及减号。`,
    addSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>新路由规则添加成功！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>目标前缀:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>归属标签:</b> ${tag}\n` +
      `📥 <b>转发目标:</b> <code>${forward || '(未配置独立转发，纯TG通知)'}</code>\n\n` +
      `💡 <i>Catch-all 开启后，发往该前缀的邮件将即刻按此规则分流。</i>`,
    delHelpTitle: '💡 <b>【删除规则命令说明】</b>',
    delHelpUsage: '<b>格式:</b> <code>del &lt;前缀&gt;</code>\n<b>示例:</b> <code>del blog</code>',
    delNotFound: (prefix: string) =>
      `⚠️ <b>未找到规则:</b> 数据库中未找到前缀为 <code>${prefix}</code> 的自定义规则。`,
    delConfirmPrompt: (prefix: string, tag: string, forward: string) =>
      `⚠️ <b>请二次确认是否删除规则？</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>目标前缀:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>当前标签:</b> ${tag}\n` +
      `📥 <b>转发目标:</b> <code>${forward || '(无独立转发)'}</code>\n\n` +
      `⚠️ <i>请点击下方按钮确认，点击后将从数据库彻底抹除！</i>`,
    delBtnConfirm: '🔴 确认删除',
    delBtnCancel: '⚪ 取消',
    delAlertDeleted: '已从数据库彻底删除',
    delAlertNotFound: '未找到该规则',
    delSuccessText: (prefix: string) =>
      `🗑️ <b>已彻底删除规则！</b>\n━━━━━━━━━━━━━━━━━━\n前缀 <code>${prefix}</code> 相关的路由与分流配置已完全从数据库抹除。`,
    delNotFoundText: (prefix: string) =>
      `⚠️ <b>删除失败:</b> 未在数据库中找到 <code>${prefix}</code>，可能已被删除。`,
    delAlertCancelled: '操作已取消',
    delCancelledText: (prefix: string) =>
      `❌ <b>操作已取消</b>\n━━━━━━━━━━━━━━━━━━\n前缀 <code>${prefix}</code> 的规则保持不变。`,
  },

  setupCommand: {
    startWizardText:
      `🚀 <b>【 cf-mail2tg-aibot 交互式配置向导 (1/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `欢迎使用极速配置向导！本向导将分 2 步带您完成核心凭证绑定。\n` +
      `💡 <i>输入 <code>skip</code> 可跳过当前步骤，随时发送 <code>/cancel</code> 可退出向导。</i>\n\n` +
      `<b>第 1 步: 配置备份转发邮箱 (Forward Email)</b>\n` +
      `用于将入站邮件无损双轨转发至您的主力邮箱（如 Gmail）。\n` +
      `⚠️ <i>注意: 请确保该邮箱已在 Cloudflare 仪表盘的「Email Routing ➔ Destination addresses」中完成验证！</i>\n\n` +
      `👉 <b>请直接回复您的目标接收邮箱</b> (如 <code>yourname@gmail.com</code>)，或发送 <code>skip</code> 跳过:`,
    cancelSuccess:
      `❌ <b>已退出配置向导</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `当前向导会话已重置，未完成的配置保持原状。您可随时发送 <code>/setup</code> 重新开始。`,
    skipStep1Text:
      `⏭️ <b>已跳过备份邮箱配置。</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot 交互式配置向导 (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>第 2 步: 配置 MiniMax 大模型 API Key</b>\n` +
      `用于对来信进行大模型智能意图审信（验证码、账单、营销、告警等）与验证码自动提取。\n` +
      `💡 <i>若暂未获取，输入 <code>skip</code> 可跳过，系统将自动使用高性能本地正则进行兜底处理。</i>\n\n` +
      `👉 <b>请直接回复您的 MiniMax API Key</b>，或发送 <code>skip</code> 跳过:`,
    formatErrorStep1: (input: string) =>
      `❌ <b>邮箱格式不合法！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `您输入的内容为: <code>${input}</code>\n` +
      `请输入合法的邮箱格式（例如: <code>mymail@gmail.com</code>），或发送 <code>skip</code> 跳过当前步骤:`,
    successStep1Text: (email: string) =>
      `✅ <b>备份邮箱绑定成功！</b>\n` +
      `已保存目标地址: <code>${email}</code>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot 交互式配置向导 (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>第 2 步: 配置 MiniMax 大模型 API Key</b>\n` +
      `用于对来信进行大模型智能意图审信（验证码、账单、营销、告警等）与验证码自动提取。\n` +
      `💡 <i>若暂未获取，输入 <code>skip</code> 可跳过，系统将自动使用高性能本地正则进行兜底处理。</i>\n\n` +
      `👉 <b>请直接回复您的 MiniMax API Key</b>，或发送 <code>skip</code> 跳过:`,
    step2Card:
      `🚀 <b>【 cf-mail2tg-aibot 交互式配置向导 (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>第 2 步: 配置 MiniMax 大模型 API Key</b>\n` +
      `用于对来信进行大模型智能意图审信（验证码、账单、营销、告警等）与验证码自动提取。\n` +
      `💡 <i>若暂未获取，输入 <code>skip</code> 可跳过，系统将自动使用高性能本地正则进行兜底处理。</i>\n\n` +
      `👉 <b>请直接回复您的 MiniMax API Key</b>，或发送 <code>skip</code> 跳过:`,
    skipStep2Text: (fwdText: string, mmxText: string) =>
      `⏭️ <b>已跳过大模型 API Key 配置。</b>\n\n` +
      `🎉 <b>【 恭喜！配置流程已顺利完成 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `系统核心组件状态:\n` +
      `• 备份转发邮箱: ${fwdText}\n` +
      `• 大模型审信: ${mmxText}\n\n` +
      `💡 <b>后续建议:</b>\n` +
      `• 发送 <code>/config</code> 查看全局配置中枢与脱敏密钥\n` +
      `• 发送 <code>/routes</code> 查看当前生效的收信画像规则\n` +
      `• 随时发送 <code>/setkey</code> 可单独热更新各项密钥`,
    keyEmptyError:
      `❌ <b>API Key 不能为空！</b>\n请回复有效的 API Key，或发送 <code>skip</code> 跳过:`,
    successStep2Text: (maskedKey: string, fwdText: string) =>
      `✅ <b>大模型 API Key 绑定成功！</b>\n` +
      `已保存至 KV，脱敏预览: <code>${maskedKey}</code>\n\n` +
      `🎉 <b>【 恭喜！极速配置流程已全部完成 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `您的 cf-mail2tg-aibot 邮件网关已全面就绪！\n` +
      `• 备份转发邮箱: ${fwdText}\n` +
      `• 大模型审信: ✅ 已就绪 (<code>${maskedKey}</code>)\n\n` +
      `💡 <b>后续建议:</b>\n` +
      `• 发送 <code>/config</code> 查看全局配置中枢与脱敏密钥\n` +
      `• 发送 <code>/routes</code> 查看收信画像与域名规则\n` +
      `• 任何新邮件到达时，网关将全自动进行 AI 意图分析并实时推送！`,
    kvRequiredError: `⚠️ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库，无法启动向导。`,
    notConfiguredPureTg: '⚪ 未配置 (纯TG单轨模式)',
    notConfiguredRegexFallback: '⚪ 未配置 (本地正则兜底)',
    readyWithMask: (masked: string) => `✅ 已就绪 (<code>${masked}</code>)`,
  },

  emailCard: {
    intentTags: {
      验证: '验证',
      营销: '营销',
      告警: '告警',
      账单: '账单',
      业务: '业务',
      通知: '通知',
    },
    personaTags: {
      个人: '个人',
      通用: '通用',
      免费产品: '免费产品',
      付费产品: '付费产品',
      商业支持: '商业支持',
    },
    newEmailTitle: (intentTag: string, targetName: string) =>
      `<b>【新邮件 · ${intentTag} · ${targetName}】</b>`,
    verificationCode: '验证码',
    copyHint: '轻触直接复制',
    businessType: '业务类型',
    recipientDomain: '收信站点',
    targetEmail: '目标邮箱',
    senderFrom: '发件来源',
    authSPFDKIMPass: '🛡️ <b>鉴真:</b> <code>SPF通过 · DKIM签名有效</code>',
    authSPFOnly: '🛡️ <b>鉴真:</b> <code>SPF通过 · DKIM未校验</code>',
    authDKIMOnly: '🛡️ <b>鉴真:</b> <code>SPF未校验 · DKIM签名有效</code>',
    authFailed: '🚨 <b>鉴真:</b> <code>SPF/DKIM未通过 (疑似仿冒来源)</code>',
    authUnknown: '🛡️ <b>鉴真:</b> <code>未知签名</code>',
    aiRfcUnsubShortCircuit: '🏷️ <b>协议质检:</b> <code>RFC 8058退订头命中 (已短路免调AI·省额度)</code>',
    aiKeywordShortCircuit: (keyword: string) =>
      `🏷️ <b>规则命中:</b> <code>关键词匹配 [${keyword}] (已短路免调AI·省额度)</code>`,
    aiMarketing: '🤖 <b>AI研判:</b> <code>LLM 判定为营销推广 (静默免打扰)</code>',
    aiVerification: '🤖 <b>AI研判:</b> <code>LLM 判定为验证码 (重要·强提醒)</code>',
    aiSecurity: '🤖 <b>AI研判:</b> <code>LLM 判定为安全告警 (紧急响铃)</code>',
    aiBilling: '🤖 <b>AI研判:</b> <code>LLM 判定为财务账单 (响铃提醒)</code>',
    aiNotification: '🤖 <b>AI研判:</b> <code>LLM 判定为系统通知 (常规提醒)</code>',
    aiImportant: '🤖 <b>AI研判:</b> <code>LLM 判定为重要信件 (响铃提醒)</code>',
    aiErrorFallback: (detail: string) =>
      `🤖 <b>AI状态:</b> <code>⚠️ LLM API失效: ${detail} (已保底响铃)</code>`,
    aiRegexVerification: '🏷️ <b>规则命中:</b> <code>特征匹配到验证码 (响铃提醒)</code>',
    subjectLabel: '主　　题',
    noSubject: '(无主题)',
    unknownSender: '未知发件人',
    attachmentsLabel: '附　　件',
    attachmentsSynced: '已同步至邮箱',
    attachmentsUnit: (count: number) => ` 等共 ${count} 个文件`,
    unnamedAttachment: '未命名附件',
    snippetLabel: '邮件摘要',
    noTextContent: '(无纯文本正文内容)',
    snippetFolded: (max: number) => `... (正文过长已折叠展示前 ${max} 字，完整原件已同步至邮箱)`,
    backupStatusLabel: '备份状态',
    backupSynced: (base: string, alias?: string) =>
      `<code>已同步投递至备份邮箱 (${base}${alias ? ` · ${alias}` : ''})</code>`,
    backupFailed: (error: string) => `<code>⚠️ 转发失败 (${error})</code>`,
    backupPureTG: '<code>未配置转存邮箱 (纯TG通知模式)</code>',
    replyContactLabel: '回复联系',
  },

  securityAlerts: {
    reasonLabel: '拦截原因',
    actionLabel: '防御动作',
    triggerLabel: '触发原因',
    defenseStatusLabel: '防御状态',
    sizeCapTitle: '邮件中继 · 超大容量熔断拦截',
    sizeCapReason: (size: string, cap: string) =>
      `邮件体积为 <b>${size}</b>，超出网关安全上限 (${cap})`,
    sizeCapAction: '已向发件方返回 SMTP 552 拒信退回，<b>未转入备份邮箱 (0 空间消耗)</b>。',
    sizeCapTip: '建议发件人通过网盘或 GitHub 链接分享超大文件。',
    attachmentTitle: '邮件中继 · 附件安全策略拦截',
    attachmentReason: '触发附件安全防御',
    attachmentDetected: '检测附件',
    attachmentAction: '已向发信方返回 SMTP 550 拒信，<b>未转入备份邮箱 (0 空间占用)</b>。',
    rateLimitTitle: '邮件中继 · 频控限流预警',
    rateLimitHighFreqSender: '高频发信',
    rateLimitReason: '短时间内来信频次超限',
    rateLimitStatusForwarded: (base: string, alias?: string) =>
      `该邮件已安全直转备份邮箱 (<code>${base}</code>${alias ? ` · 别名 <code>${alias}</code>` : ''})`,
    rateLimitStatusFailed: (error: string) => `⚠️ 转寄失败: ${error}`,
    rateLimitStatusPureTG: '纯TG通知模式 (无转存邮箱)',
    rateLimitTip: '为免打扰与防 TG 429 频控，本周期内已暂停该来源的推送，后续信件请移步备份邮箱查阅。',
  },

  sources: {
    kvOverride: '(动态KV覆盖)',
    envDefault: '(环境默认)',
  },
};
