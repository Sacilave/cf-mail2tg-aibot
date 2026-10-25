import type { TranslationDict } from '../types';

export const zhCN: TranslationDict = {
  langCode: 'zh-CN',
  langName: '简体中文',
  flag: '🇨🇳',

  commandDesc: {
    start: '查看运行状态总览',
    menu: '打开设置面板',
    guide: '查看详细使用指南',
    setup: '启动配置向导 (分步引导)',
    lang: '切换显示语言 (Switch language)',
    config: '查看运行状态与密钥详情',
    provider: '切换大模型厂商',
    model: '切换运行模型版本',
    routes: '管理分流路由与自定义标签',
    keywords: '查看营销拦截词库',
    addkeywords: '追加营销拦截词',
    resetkeywords: '重置营销拦截词库',
    add: '添加分流规则 (add 标签 前缀 [目标])',
    del: '删除分流规则 (del 前缀)',
    setkey: '更新密钥或备份邮箱 (setkey <类型> <值>)',
    resetkey: '重置动态密钥或备份邮箱',
    cancel: '取消当前会话或向导',
    help: '查看指令帮助手册',
  },

  dashboard: {
    title: '⚙️ <b>【 设置 】</b>',
    desc: '轻触下方按钮即可无缝切换 AI 厂商、管理业务分流路由、维护垃圾拦截词库或切换系统语言：',
    btnAi: '🤖 AI 模型',
    btnRoutes: '📂 业务路由',
    btnKeywords: '🚫 垃圾拦截',
    btnForward: '📬 邮箱转发',
    btnLang: '🌐 语言 / Language',
    btnRefresh: '🔄 刷新状态',
    btnBackMain: '🔙 返回主菜单',
    btnBackAi: '🔙 返回 AI 设置',
    btnBackRoutes: '🔙 返回路由设置',
    btnManageModels: '🎯 切换具体模型',
    btnSetKey: '🔑 设置 API Key',
    btnSetAiKey: '🔑 绑定 API Key',
    btnResetAiKey: '🔄 清除自定义 Key',
    btnAddRoute: '➕ 添加分流规则',
    btnTags: '🏷️ 标签管理',
    btnAddKw: '➕ 追加拦截词',
    btnSetForward: '📬 修改备份邮箱',
    btnResetForward: '🗑️ 清除备份邮箱',
    btnSetup: '⚡ 配置向导',
    btnCancel: '❌ 取消',
    routesTitle: '📂 <b>【 业务画像分流规则管理 】</b>',
    routesSelectTagPrompt: '请为新规则选择<b>业务分类标签</b>（轻触按钮选择）：',
    routesInputPrefixPrompt: (tag: string) =>
      `已选择分类标签：<b>【${tag}】</b>\n\n` +
      `请直接回复您想要绑定的<b>邮箱前缀</b>（例如 <code>vip</code> 或 <code>support</code>）：\n` +
      `<i>（💡 如需同时指定专属转发目标，请回复: 前缀 邮箱，例如: vip user@example.com）</i>`,
    routesAddSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>分流规则添加成功！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 匹配前缀: <code>${prefix}</code>\n` +
      `• 业务画像: <b>${tag}</b>\n` +
      `• 投递目标: <code>${forward}</code>`,
    routesDeletedSuccess: (prefix: string) => `✅ 已成功删除前缀为 <code>${prefix}</code> 的分流规则！`,
    tagsTitle: '🏷️ <b>【 业务分类标签管理 】</b>',
    tagsPrompt: '在此管理您的自定义业务分类标签。这些标签可在添加前缀分流规则时使用：',
    tagsEmpty: '暂无自定义标签，当前使用系统默认分类（个人、客服、商务、产品、通用）。',
    tagsAddSuccess: (tag: string) => `✅ 成功添加自定义标签: <b>【${tag}】</b>！`,
    tagsDeleteSuccess: (tag: string) => `✅ 已删除自定义标签: <b>【${tag}】</b>！`,
    tagsAddPrompt:
      '🏷️ <b>【 添加自定义标签 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      '请直接回复您想要创建的业务标签名称（例如：<code>财务</code>、<code>监控</code>、<code>内部</code>，10字以内）：',
    tagsInvalid: '❌ 标签名称无效或已存在（必须为1-10个字符且不含空格）。',
    kwTitle: '🚫 <b>【 营销推广与垃圾拦截词库 】</b>',
    fwdTitle: '📬 <b>【 备份邮箱与转发设置 】</b>',
    toastUpdated: '已更新设置！',
    toastCancelled: '已取消当前操作',
  },

  providerCommand: {
    title: '🏢 <b>【 请选择大模型 API 厂商 】</b>',
    current: (provider: string, model: string) => `当前厂商: <b>${provider}</b> (模型: <code>${model}</code>)`,
    prompt: '请直接回复对应序号进行切换（5分钟内有效）：',
    success: (provider: string, model: string, note: string) =>
      `✅ <b>API 厂商切换成功！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 当前厂商: <b>${provider}</b>\n` +
      `• 运行模型: <code>${model}</code>\n` +
      `${note}`,
    invalidOption: '❌ 无效的序号，请输入 1 到 9 之间的数字。如需退出请发送 /cancel。',
    kvError: '❌ 无法保存配置，未检测到绑定的 MAIL_ROUTES_KV 数据库。',
    tipSetKey: '💡 提示: 若该厂商需要 API Key，可发送 <code>/setkey ai &lt;你的Key&gt;</code> 进行绑定。如需更换模型，可发送 <code>/model</code>。',
  },

  modelCommand: {
    title: (provider: string) => `🧠 <b>【 请选择 ${provider} 运行模型 】</b>`,
    current: (model: string) => `当前运行模型: <code>${model}</code>`,
    prompt: '请直接回复对应序号完成切换，或直接回复自定义模型名称（5分钟内有效）：',
    success: (model: string) =>
      `✅ <b>运行模型更新成功！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `当前生效模型: <code>${model}</code>`,
    invalidOption: '❌ 无效的模型序号或名称。如需退出请发送 /cancel。',
    kvError: '❌ 无法保存配置，未检测到绑定的 MAIL_ROUTES_KV 数据库。',
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
      '可用语言选项: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ko-KR</code> (한국어), <code>pt-BR</code> (Português), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      '示例: <code>/lang en</code> 或直接发送 <code>/lang</code> 打开交互式菜单。',
  },

  startCommand: {
    title: '👋 <b>【 cf-mail2tg-aibot 邮件网关 】</b>',
    subtitle: 'Cloudflare 邮件转推与 AI 审信机器人已就绪。所有来信将自动经过安全清洗、意图识别与验证码提取后推送至本会话。',
    statusSectionTitle: '📊 <b>网关运行状态摘要:</b>',
    statusRunningLabel: '运行状态',
    statusRunningValue: '正常运行 (Online)',
    statusEngineLabel: '审信引擎',
    statusForwardLabel: '备份转发',
    statusNoForward: '纯TG模式 (未设置)',
    statusAliasOn: 'Gmail 别名已开启',
    statusAliasOff: '直转模式',
    statusDefenseLabel: '防御装甲',
    statusDefenseValue: '零附件拦截 (550) · 5MB 容量熔断',
    guideTip: '轻触下方【设置】进入配置面板；轻触【使用指南】查看详细说明；轻触【🌐 语言 / Language】可切换语言。',
    btnOpenMenu: '⚙️ 设置',
    btnGuide: '📖 使用指南',
  },

  usageGuide: {
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
  },

  helpCommand: {
    title: '📖 <b>【 cf-mail2tg-aibot 指令帮助 】</b>',
    menuHint: '您可直接点击左下角 <b>[Menu]</b> 按钮或发送以下指令：',
    keysSectionTitle: '🔑 <b>状态与配置指令:</b>',
    configDesc: '• <code>/config</code> - 查看运行状态与密钥绑定详情 (带脱敏掩码)',
    providerDesc: '• <code>/provider</code> - 交互式切换大模型厂商',
    modelDesc: '• <code>/model</code> - 交互式切换当前厂商的运行模型',
    setkeyAiDesc: '• <code>/setkey ai &lt;key&gt;</code> - 手机端热更新通用大模型 API Key',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;key&gt;</code> - 手机端热更新 MiniMax 密钥',
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
    title: '⚙️ <b>【 设置与密钥状态 】</b>',
    llmTitle: '🤖 <b>大模型审信 (LLM):</b>',
    llmProvider: (provider: string) => `  • 模型厂商: <b>${provider}</b>`,
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
    shortcutProvider: '• <code>/provider</code> - 交互式切换大模型厂商',
    shortcutModel: '• <code>/model</code> - 交互式切换大模型版本',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - 热更新大模型密钥',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;邮箱地址&gt;</code> - 热更新备份邮箱',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - 清除密钥动态覆盖并回退',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - 清除备份邮箱动态覆盖',
    shortcutLang: '• <code>/lang</code> - 切换系统显示语言 (支持10种主流语言)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【热更新密钥/配置说明】</b>',
    helpUsage: '<b>格式:</b> <code>/setkey &lt;类型&gt; &lt;值&gt;</code>',
    helpAi: '• <b>更新通用大模型密钥:</b>\n  <code>/setkey ai sk-your-api-key</code>',
    helpMinimax: '• <b>更新 MiniMax 密钥:</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>更新备份邮箱:</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>更新后即刻保存在 KV 并在边缘端实时生效。</i>',
    kvError: '❌ <b>系统错误:</b> 未绑定 MAIL_ROUTES_KV 数据库。',
    successAi: (maskedKey: string) =>
      `✅ <b>通用大模型 API 密钥已成功热更新！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `新密钥已保存至 KV，脱敏预览: <code>${maskedKey}</code>\n` +
      `后续来信将即刻使用新密钥进行 LLM 意图识别。`,
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
      `❌ <b>不支持的配置类型:</b> 「<code>${type}</code>」\n目前支持 <code>ai</code>、<code>minimax</code> 或 <code>forward</code>。`,
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
      客服: '客服',
      商务: '商务',
      产品: '产品',
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
