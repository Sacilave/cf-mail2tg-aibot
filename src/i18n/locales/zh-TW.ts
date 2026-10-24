import type { TranslationDict } from '../types';

export const zhTW: TranslationDict = {
  langCode: 'zh-TW',
  langName: '繁體中文',
  flag: '🇭🇰',

  commandDesc: {
    start: '查看運作狀態總覽',
    menu: '開啟設定面板',
    guide: '查看詳細使用指南',
    setup: '啟動設定精靈 (分步引導)',
    lang: '切換顯示語言 (Switch language)',
    config: '查看運作狀態與金鑰詳情',
    provider: '切換大模型廠商',
    model: '切換運行模型版本',
    routes: '管理分流路由與自訂標籤',
    keywords: '查看行銷攔截詞庫',
    addkeywords: '追加行銷攔截詞',
    resetkeywords: '重設行銷攔截詞庫',
    add: '新增分流規則 (add 標籤 前綴 [目標])',
    del: '刪除分流規則 (del 前綴)',
    setkey: '更新金鑰或備份信箱 (setkey <類型> <值>)',
    resetkey: '重設動態金鑰或備份信箱',
    cancel: '取消當前會話或精靈',
    help: '查看指令幫助手冊',
  },

  dashboard: {
    title: '⚙️ <b>【 設定 】</b>',
    desc: '輕觸下方按鈕即可無縫切換 AI 廠商、管理業務分流路由、維護垃圾攔截關鍵字庫或切換系統語言：',
    btnAi: '🤖 AI 模型',
    btnRoutes: '📂 業務路由',
    btnKeywords: '🚫 垃圾攔截',
    btnForward: '📬 信箱轉發',
    btnLang: '🌐 語言 / Language',
    btnRefresh: '🔄 重新整理',
    btnBackMain: '🔙 返回主選單',
    btnBackAi: '🔙 返回 AI 設定',
    btnBackRoutes: '🔙 返回路由設定',
    btnManageModels: '🎯 切換具體模型',
    btnSetKey: '🔑 設定 API Key',
    btnSetAiKey: '🔑 綁定 API Key',
    btnResetAiKey: '🔄 清除自訂 Key',
    btnAddRoute: '➕ 新增分流規則',
    btnTags: '🏷️ 標籤管理',
    btnAddKw: '➕ 追加關鍵字',
    btnSetForward: '📬 修改備份信箱',
    btnResetForward: '🗑️ 清除備份信箱',
    btnSetup: '⚡ 設定精靈',
    btnCancel: '❌ 取消',
    routesTitle: '📂 <b>【 業務畫像分流規則管理 】</b>',
    routesSelectTagPrompt: '請為新規則選擇<b>業務分類標籤</b>（輕觸按鈕選擇）：',
    routesInputPrefixPrompt: (tag: string) =>
      `已選擇分類標籤：<b>【${tag}】</b>\n\n` +
      `請直接回覆您想要綁定的<b>信箱前綴</b>（例如 <code>vip</code> 或 <code>support</code>）：\n` +
      `<i>（💡 如需同時指定專屬轉發目標，請回覆: 前綴 信箱，例如: vip user@example.com）</i>`,
    routesAddSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>分流規則新增成功！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 匹配前綴: <code>${prefix}</code>\n` +
      `• 業務畫像: <b>${tag}</b>\n` +
      `• 遞送目標: <code>${forward}</code>`,
    routesDeletedSuccess: (prefix: string) => `✅ 已成功刪除前綴為 <code>${prefix}</code> 的分流規則！`,
    tagsTitle: '🏷️ <b>【 業務分類標籤管理 】</b>',
    tagsPrompt: '在此管理您的自訂業務分類標籤。這些標籤可在新增前綴分流規則時使用：',
    tagsEmpty: '暫無自訂標籤，目前使用系統預設分類（個人、客服、商務、產品、通用）。',
    tagsAddSuccess: (tag: string) => `✅ 成功新增自訂標籤: <b>【${tag}】</b>！`,
    tagsDeleteSuccess: (tag: string) => `✅ 已刪除自訂標籤: <b>【${tag}】</b>！`,
    tagsAddPrompt:
      '🏷️ <b>【 新增自訂標籤 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      '請直接回覆您想要建立的業務標籤名稱（例如：<code>財務</code>、<code>監控</code>、<code>內部</code>，10字以內）：',
    tagsInvalid: '❌ 標籤名稱無效或已存在（必須為1-10個字元且不含空格）。',
    kwTitle: '🚫 <b>【 行銷推廣與垃圾攔截關鍵字庫 】</b>',
    fwdTitle: '📬 <b>【 備份信箱與轉發設定 】</b>',
    toastUpdated: '已更新設定！',
    toastCancelled: '已取消目前操作',
  },

  providerCommand: {
    title: '🏢 <b>【 請選擇大模型 API 廠商 】</b>',
    current: (provider: string, model: string) => `目前廠商: <b>${provider}</b> (模型: <code>${model}</code>)`,
    prompt: '請直接回覆對應序號進行切換（5分鐘內有效）：',
    success: (provider: string, model: string, note: string) =>
      `✅ <b>API 廠商切換成功！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 目前廠商: <b>${provider}</b>\n` +
      `• 執行模型: <code>${model}</code>\n` +
      `${note}`,
    invalidOption: '❌ 無效的序號，請輸入 1 到 9 之間的數字。如需退出請發送 /cancel。',
    kvError: '❌ 無法儲存設定，未偵測到綁定的 MAIL_ROUTES_KV 資料庫。',
    tipSetKey: '💡 提示: 若該廠商需要 API Key，可發送 <code>/setkey ai &lt;你的Key&gt;</code> 進行綁定。如需更換模型，可發送 <code>/model</code>。',
  },

  modelCommand: {
    title: (provider: string) => `🧠 <b>【 請選擇 ${provider} 執行模型 】</b>`,
    current: (model: string) => `目前執行模型: <code>${model}</code>`,
    prompt: '請直接回覆對應序號完成切換，或直接回覆自訂模型名稱（5分鐘内有效）：',
    success: (model: string) =>
      `✅ <b>執行模型更新成功！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `目前生效模型: <code>${model}</code>`,
    invalidOption: '❌ 無效的模型序號或名稱。如需退出請發送 /cancel。',
    kvError: '❌ 無法儲存設定，未偵測到綁定的 MAIL_ROUTES_KV 資料庫。',
  },

  langCommand: {
    selectPrompt:
      '🌐 <b>【 語言偏好設定 / Language Settings 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      '請選擇 Telegram 訊息卡片與指令的顯示語言：\n' +
      'Please select your preferred language for notifications and commands:',
    currentLang: (name: string) => `\n📌 目前生效語言: <b>${name}</b>`,
    successAlert: (name: string) => `語言已成功切換為 ${name}！`,
    successCard: (name: string) =>
      `✅ <b>語言偏好已更新！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `目前系統語言已設定為: <b>${name}</b>\n` +
      `後續收到的新郵件推播卡片、安全性警報與指令面板將即刻以此語言呈現。\n\n` +
      `💡 <i>發送 /help 可查看目前語言的完整指令字典。</i>`,
    invalidArg:
      '❌ <b>無效的語言代碼！</b>\n' +
      '可用語言選項: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      '範例: <code>/lang tw</code> 或直接發送 <code>/lang</code> 開啟互動式選單。',
  },

  startCommand: {
    title: '👋 <b>【 cf-mail2tg-aibot 郵件閘道 】</b>',
    subtitle: 'Cloudflare 郵件轉推與 AI 審信機器人已就緒。所有來信將自動經過安全清洗、意圖識別與驗證碼提取後推送至本會話。',
    statusSectionTitle: '📊 <b>閘道運作狀態摘要:</b>',
    statusRunningLabel: '運作狀態',
    statusRunningValue: '正常運作 (Online)',
    statusEngineLabel: '審信引擎',
    statusForwardLabel: '備份轉發',
    statusNoForward: '純TG模式 (未設定)',
    statusAliasOn: 'Gmail 別名已啟用',
    statusAliasOff: '直轉模式',
    statusDefenseLabel: '防禦裝甲',
    statusDefenseValue: '零附件攔截 (550) · 5MB 容量熔斷',
    guideTip: '輕觸下方【設定】進入配置面板；輕觸【使用指南】查看詳細說明；輕觸【🌐 語言 / Language】可切換語言。',
    btnOpenMenu: '⚙️ 設定',
    btnGuide: '📖 使用指南',
  },

  usageGuide: {
    title: '📖 <b>【 cf-mail2tg-aibot 使用指南 】</b>',
    subtitle: '閘道基礎功能與設定說明：',
    principlesTitle: '⚙️ <b>1. 工作流程</b>',
    principlesContent:
      '• <b>郵件接收</b>: 網域信箱接收來信，由 Worker 腳本進行過濾與結構化解析。\n' +
      '• <b>基礎防護</b>: 攔截超大郵件 (預設 5MB) 與危險格式附件，防止垃圾郵件衝擊。\n' +
      '• <b>雙軌投遞</b>: 提取內文文字與驗證碼推送至 Telegram，同時原樣轉發至備份信箱。',
    tagsTitle: '🏷️ <b>2. 郵件分類與驗證碼</b>',
    tagsContent:
      '• <b>意圖類型</b>: <code>驗證</code> · <code>行銷</code> · <code>告警</code> · <code>帳單</code> · <code>業務</code> · <code>通知</code>\n' +
      '• <b>驗證碼提取</b>: 識別到登入與註冊驗證碼時置頂顯示，支援直接點擊複製。\n' +
      '• <b>安全校驗</b>: 校驗寄件人 SPF / DKIM 簽名狀態以標識寄件來源可信度。',
    antiSpamTitle: '🛡️ <b>3. 垃圾攔截與靜默推送</b>',
    antiSpamContent:
      '• <b>規則過濾</b>: 識別含退訂標頭 (RFC 8058) 或命中攔截詞庫的郵件，自動歸為行銷分類。\n' +
      '• <b>靜默通知</b>: 行銷郵件預設啟用靜音推送，且不觸發 AI 模型調用以節約算力。\n' +
      '• <b>詞庫匹配</b>: 根據系統語言自動匹配詞庫，支援使用 <code>/addkeywords</code> 自行擴充。',
    routesTitle: '📂 <b>4. 前綴路由與別名</b>',
    routesContent:
      '• <b>前綴分流</b>: 根據收信前綴歸類業務畫像（如 <code>support@</code> 歸為客服，<code>admin@</code> 归为個人）。\n' +
      '• <b>信箱別名</b>: 啟用後轉發時自動追加 <code>+tag</code> 別名（如 <code>user+support@gmail.com</code>），便於在信箱內分類歸檔。',
    commandsTitle: '⚡ <b>5. 常用指令速查</b>',
    commandsContent:
      '• <code>/start</code> - 查看運作狀態與快速入口\n' +
      '• <code>/menu</code> - 開啟設定面板 (⚙️ 設定)\n' +
      '• <code>/guide</code> - 查看本使用指南\n' +
      '• <code>/routes</code> - 管理前綴分流規則與自訂標籤\n' +
      '• <code>/keywords</code> - 查看與維護攔截詞庫\n' +
      '• <code>/ai</code> - 切換 AI 模型廠商與版本\n' +
      '• <code>/lang</code> - 切換系統語言',
    footerTip: '輕觸訊息下方按鈕即可快捷操作，無需手動輸入指令。',
    btnBackStart: '🔙 返回總覽',
    btnBackDashboard: '⚙️ 設定',
    btnViewDocs: '🌐 查看 GitHub 詳細文件',
  },

  helpCommand: {
    title: '📖 <b>【 cf-mail2tg-aibot 指令幫助 】</b>',
    menuHint: '您可直接點選左下角 <b>[Menu]</b> 按鈕或發送以下指令：',
    keysSectionTitle: '🔑 <b>狀態與配置指令:</b>',
    configDesc: '• <code>/config</code> - 查看運作狀態與金鑰詳情 (附遮罩)',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;key&gt;</code> - 手機端熱更新大模型金鑰',
    setkeyForwardDesc: '• <code>/setkey forward &lt;email&gt;</code> - 手機端熱更新備份信箱',
    resetkeyDesc: '• <code>/resetkey &lt;minimax|forward&gt;</code> - 重設動態覆蓋回退預設值',
    keywordsSectionTitle: '📋 <b>行銷關鍵字與防垃圾指令:</b>',
    keywordsDesc: '• <code>/keywords</code> - 查看並一鍵複製全部行銷關鍵字',
    addkeywordsDesc: '• <code>/addkeywords</code> - 增量安全追加關鍵字（絕不覆蓋現有詞）',
    resetkeywordsDesc: '• <code>/resetkeywords</code> - 還原系統預設基準關鍵字',
    routesSectionTitle: '🔀 <b>網域名稱路由與分流指令:</b>',
    routesDesc: '• <code>/routes</code> - 查看所有已生效的內建與 KV 路由規則',
    addDesc: '• <code>/add 標籤 前綴 [目標]</code> - 新增信箱地址分流規則',
    delDesc: '• <code>/del 前綴</code> - 刪除自訂路由規則（附二次確認）',
    langSectionTitle: '🌐 <b>國際化與多語言:</b>',
    langDesc: '• <code>/lang [語言代碼]</code> - 切換 Bot 與郵件卡片的顯示語言',
    setupSectionTitle: '🛠️ <b>配置精靈與對話:</b>',
    setupDesc: '• <code>/setup</code> - 啟動互動式 2 步配置精靈',
    cancelDesc: '• <code>/cancel</code> - 隨時取消目前進行中的精靈對話',
    footerTip: '💡 <i>提示: 您也可以隨時直接回覆 Bot 發送的任何關鍵字清單訊息進行快速修改。</i>',
  },

  configCommand: {
    title: '⚙️ <b>【 設定與金鑰狀態 】</b>',
    llmTitle: '🤖 <b>大模型審信 (LLM):</b>',
    llmReady: (source: string) => `  • 綁定狀態: ✅ 已就緒 ${source}`,
    llmNotConfigured: '  • 綁定狀態: ⚪ 未配置 (目前使用本機正則特徵嗅探)',
    llmMaskedKey: (key: string) => `  • 金鑰脫敏: <code>${key}</code>`,
    llmModel: (model: string) => `  • 運行模型: <code>${model}</code>`,
    forwardTitle: '📥 <b>零丟信備份軌 (Forward):</b>',
    forwardTarget: (target: string, source: string) => `  • 目標信箱: <code>${target}</code> ${source}`,
    forwardNotConfigured: '  • 目標信箱: ⚪ 未配置 (純TG單軌模式)',
    forwardAliasesActive: '  • 別名分流: ✅ 已啟用 (自動+標籤)',
    forwardAliasesDisabled: '  • 別名分流: ⚪ 已停用 (直轉主信箱)',
    kvTitle: '🗄️ <b>KV 資料庫 (MAIL_ROUTES_KV):</b>',
    kvConnected: '  • 連線狀態: ✅ 已綁定生效',
    kvNotConnected: '  • 連線狀態: ❌ 未連線',
    kvKeywordsCount: (count: number) => `  • 活躍行銷關鍵字: <b>${count}</b> 個`,
    kvCustomRulesCount: (count: number) => `  • 自訂路由規則: <b>${count}</b> 條`,
    securityTitle: '🛡️ <b>邊緣裝甲與安全性策略:</b>',
    securityBlockAll: '  • 零附件攔截策略: 🔴 全量拒信 (SMTP 550)',
    securityHighRiskOnly: '  • 零附件攔截策略: 🟢 僅攔截高風險格式',
    securityMaxCap: (size: string) => `  • 郵件體積熔斷上限: <b>${size}</b> (SMTP 552)`,
    securityMarketingPolicy: (policy: string) =>
      `  • 行銷推播策略: <code>${policy === 'mute' ? '完全不推TG (mute)' : '靜音不響鈴 (silent)'}</code>`,
    systemLangTitle: '🌐 <b>系統顯示語言:</b>',
    systemLangDesc: (name: string, source: string) => `  • 目前語言: <b>${name}</b> ${source}`,
    shortcutsTitle: '💡 <b>快捷更新指令:</b>',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - 熱更新大模型金鑰',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;信箱地址&gt;</code> - 熱更新備份信箱',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - 清除金鑰動態覆蓋並回退',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - 清除備份信箱動態覆蓋',
    shortcutLang: '• <code>/lang</code> - 切換系統顯示語言 (支援8種語言)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【熱更新金鑰/配置說明】</b>',
    helpUsage: '<b>格式:</b> <code>/setkey &lt;類型&gt; &lt;值&gt;</code>',
    helpMinimax: '• <b>更新大模型金鑰:</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>更新備份信箱:</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>更新後即刻儲存在 KV 並在邊緣端即時生效。</i>',
    kvError: '❌ <b>系統錯誤:</b> 未綁定 MAIL_ROUTES_KV 資料庫。',
    successMinimax: (maskedKey: string) =>
      `✅ <b>大模型 API 金鑰已成功熱更新！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `新金鑰已儲存至 KV，脫敏預覽: <code>${maskedKey}</code>\n` +
      `後續來信將即刻使用新金鑰進行 LLM 意圖識別。`,
    successForward: (email: string) =>
      `✅ <b>備份轉發信箱已成功熱更新！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `新目標地址: <code>${email}</code>\n` +
      `⚠️ <i>請務必確認該信箱已在 Cloudflare Email Routing 中完成驗證！</i>`,
    unsupportedType: (type: string) =>
      `❌ <b>不支援的配置類型:</b> 「<code>${type}</code>」\n目前僅支援 <code>minimax</code> 或 <code>forward</code>。`,
  },

  resetkeyCommand: {
    helpTitle: '💡 <b>【重設金鑰指令說明】</b>',
    helpUsage: '<b>格式:</b> <code>/resetkey &lt;minimax|forward&gt;</code>',
    helpDesc: '刪除 KV 中的動態覆蓋項，恢復使用環境變數中的初始預設值。',
    kvError: '❌ <b>系統錯誤:</b> 未綁定 MAIL_ROUTES_KV 資料庫。',
    successReset: (subType: string) =>
      `🔄 <b>已重設 ${subType} 動態配置！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `已清除 KV 動態覆蓋，系統已自動回退至環境變數中的初始預設配置。`,
  },

  keywordsCommand: {
    title: '📋 <b>【行銷推廣攔截關鍵字管理】</b>',
    countDesc: (count: number) => `目前生效關鍵字共 <b>${count}</b> 個。`,
    instructions:
      '💡 <b>修改方式（複製修改後【直接回覆本則訊息】）：</b>\n' +
      '1. 按一下下方灰色代碼塊，在手機或電腦上一鍵複製全部內容；\n' +
      '2. 選擇<b>「回覆 (Reply)」本則訊息</b>（或直接發送 <code>setkeywords ...</code>），貼上並視需求增刪關鍵字（<b>一行一個關鍵字</b>）；\n' +
      '3. 發送後閘道將自動全量更新並即刻在邊緣生效！',
    emptyError:
      '❌ <b>更新失敗:</b> 未偵測到任何有效關鍵字。\n請輸入至少一個關鍵字（每行一個），支援直接回覆修改。',
    kvError: '❌ <b>系統錯誤:</b> 未綁定 MAIL_ROUTES_KV 資料庫。',
    successUpdate: (count: number, preview: string, moreCount: string) =>
      `✅ <b>【行銷關鍵字庫已成功更新！】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `已全量更新 <b>${count}</b> 個行銷攔截關鍵字，邊緣閘道即刻生效。\n\n` +
      `📝 <b>目前關鍵字預覽:</b>\n` +
      `<code>${preview}${moreCount}</code>\n\n` +
      `💡 <i>後續命中上述任一關鍵字或 RFC 退訂標頭的入站郵件，將自動靜音推播並歸檔。</i>`,
    updateError: '❌ <b>更新失敗:</b> 儲存至資料庫時出現異常。',
    addHelpTitle: '💡 <b>【增量新增關鍵字說明】</b>',
    addHelpUsage: '<b>格式:</b> <code>/addkeywords 關鍵字1\n關鍵字2</code>',
    addHelpDesc: '系統將自動去重並安全合併至現有詞庫，<b>絕不會覆蓋原有的關鍵字</b>。',
    successAppend: (addedCount: number, totalCount: number, preview: string) =>
      `✅ <b>【增量關鍵字新增成功 (安全合併)】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 本次成功新增: <b>${addedCount}</b> 個（已過濾重複詞）\n` +
      `• 現有生效總詞數: <b>${totalCount}</b> 個\n` +
      `• 原有詞庫已安全保留，未發生覆蓋。\n\n` +
      `📝 <b>本次新增項目:</b>\n` +
      `<code>${preview}</code>`,
    appendError: '❌ <b>新增失敗:</b> 儲存至資料庫時出現異常。',
    resetSuccess: (count: number) =>
      `🔄 <b>【行銷關鍵字已重設為預設基準】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `已還原系統預設的 <b>${count}</b> 個中英文標準行銷關鍵字。`,
  },

  routesCommand: {
    title: '📋 <b>【 目前生效的郵件路由規則庫 】</b>',
    presetBaselineTitle: '🔹 <b>系統預設基準畫像:</b>',
    fallbackGeneric: '• <i>(其餘未匹配地址)</i> ➔ 🏷️ <b>通用</b>',
    customRulesTitle: '🔸 <b>動態自訂規則 (KV 儲存):</b>',
    noCustomRules: '<i>(暫無自訂規則，可使用 add 個人 xxx 快速新增)</i>',
    addHelpTitle: '💡 <b>【新增規則命令說明】</b>',
    addHelpUsage:
      '<b>格式:</b> <code>add &lt;標籤&gt; &lt;前綴&gt; [轉發信箱]</code>\n\n' +
      '• <b>標籤限定:</b> <code>個人</code>、<code>通用</code>、<code>免費產品</code>、<code>付費產品</code>、<code>商業支援</code>\n' +
      '• <b>前綴說明:</b> 例如輸入 <code>support</code> 對應 <code>support@你的網域</code>\n' +
      '• <b>轉發信箱:</b> 可選，未提供時預設使用主轉發信箱\n\n' +
      '<b>範例:</b>\n' +
      '• <code>add 個人 blog</code>\n' +
      '• <code>add 商業支援 help user@domain.com</code>',
    addMissingPrefix:
      '❌ <b>新增失敗:</b> 缺少前綴參數。\n正確格式: <code>add &lt;標籤&gt; &lt;前綴&gt; [轉發信箱]</code>',
    addInvalidTag: (allowed: string, input: string) =>
      `❌ <b>新增失敗:</b> 標籤必須為 [${allowed}] 之一。\n您輸入的標籤為「<code>${input}</code>」，請檢查後重試。`,
    addInvalidPrefix: (prefix: string) =>
      `❌ <b>新增失敗:</b> 信箱前綴「<code>${prefix}</code>」格式不合法，僅支援英數字、點及減號。`,
    addSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>新路由規則新增成功！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>目標前綴:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>歸屬標籤:</b> ${tag}\n` +
      `📥 <b>轉發目標:</b> <code>${forward || '(未配置獨立轉發，純TG通知)'}</code>\n\n` +
      `💡 <i>Catch-all 開啟後，發往該前綴的郵件將即刻按此規則分流。</i>`,
    delHelpTitle: '💡 <b>【刪除規則命令說明】</b>',
    delHelpUsage: '<b>格式:</b> <code>del &lt;前綴&gt;</code>\n<b>範例:</b> <code>del blog</code>',
    delNotFound: (prefix: string) =>
      `⚠️ <b>未找到規則:</b> 資料庫中未找到前綴為 <code>${prefix}</code> 的自訂規則。`,
    delConfirmPrompt: (prefix: string, tag: string, forward: string) =>
      `⚠️ <b>請二次確認是否刪除規則？</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>目標前綴:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>目前標籤:</b> ${tag}\n` +
      `📥 <b>轉發目標:</b> <code>${forward || '(無獨立轉發)'}</code>\n\n` +
      `⚠️ <i>請點選下方按鈕確認，點選後將從資料庫徹底抹除！</i>`,
    delBtnConfirm: '🔴 確認刪除',
    delBtnCancel: '⚪ 取消',
    delAlertDeleted: '已從資料庫徹底刪除',
    delAlertNotFound: '未找到該規則',
    delSuccessText: (prefix: string) =>
      `🗑️ <b>已徹底刪除規則！</b>\n━━━━━━━━━━━━━━━━━━\n前綴 <code>${prefix}</code> 相關的路由與分流配置已完全從資料庫抹除。`,
    delNotFoundText: (prefix: string) =>
      `⚠️ <b>刪除失敗:</b> 未在資料庫中找到 <code>${prefix}</code>，可能已被刪除。`,
    delAlertCancelled: '操作已取消',
    delCancelledText: (prefix: string) =>
      `❌ <b>操作已取消</b>\n━━━━━━━━━━━━━━━━━━\n前綴 <code>${prefix}</code> 的規則保持不變。`,
  },

  setupCommand: {
    startWizardText:
      `🚀 <b>【 cf-mail2tg-aibot 互動式配置精靈 (1/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `歡迎使用極速配置精靈！本精靈將分 2 步帶您完成核心憑證綁定。\n` +
      `💡 <i>輸入 <code>skip</code> 可跳過目前步驟，隨時發送 <code>/cancel</code> 可退出精靈。</i>\n\n` +
      `<b>第 1 步: 配置備份轉發信箱 (Forward Email)</b>\n` +
      `用於將入站郵件無損雙軌轉發至您的主力信箱（如 Gmail）。\n` +
      `⚠️ <i>注意: 請確保該信箱已在 Cloudflare 儀表板的「Email Routing ➔ Destination addresses」中完成驗證！</i>\n\n` +
      `👉 <b>請直接回覆您的目標接收信箱</b> (如 <code>yourname@gmail.com</code>)，或發送 <code>skip</code> 跳過:`,
    cancelSuccess:
      `❌ <b>已退出配置精靈</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `目前精靈會話已重設，未完成的配置保持原狀。您可隨時發送 <code>/setup</code> 重新開始。`,
    skipStep1Text:
      `⏭️ <b>已跳過備份信箱配置。</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot 互動式配置精靈 (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>第 2 步: 配置 MiniMax 大模型 API Key</b>\n` +
      `用於對來信進行大模型智慧意圖審信（驗證碼、帳單、行銷、告警等）與驗證碼自動提取。\n` +
      `💡 <i>若暫未獲取，輸入 <code>skip</code> 可跳過，系統將自動使用高效本機正規表示式進行保底處理。</i>\n\n` +
      `👉 <b>請直接回覆您的 MiniMax API Key</b>，或發送 <code>skip</code> 跳過:`,
    formatErrorStep1: (input: string) =>
      `❌ <b>信箱格式不合法！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `您輸入的內容為: <code>${input}</code>\n` +
      `請輸入合法的信箱格式（例如: <code>mymail@gmail.com</code>），或發送 <code>skip</code> 跳過目前步驟:`,
    successStep1Text: (email: string) =>
      `✅ <b>備份信箱綁定成功！</b>\n` +
      `已儲存目標地址: <code>${email}</code>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot 互動式配置精靈 (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>第 2 步: 配置 MiniMax 大模型 API Key</b>\n` +
      `用於對來信進行大模型智慧意圖審信（驗證碼、帳單、行銷、告警等）與驗證碼自動提取。\n` +
      `💡 <i>若暫未獲取，輸入 <code>skip</code> 可跳過，系統將自動使用高效本機正規表示式進行保底處理。</i>\n\n` +
      `👉 <b>請直接回覆您的 MiniMax API Key</b>，或發送 <code>skip</code> 跳過:`,
    step2Card:
      `🚀 <b>【 cf-mail2tg-aibot 互動式配置精靈 (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>第 2 步: 配置 MiniMax 大模型 API Key</b>\n` +
      `用於對來信進行大模型智慧意圖審信（驗證碼、帳單、行銷、告警等）與驗證碼自動提取。\n` +
      `💡 <i>若暫未獲取，輸入 <code>skip</code> 可跳過，系統將自動使用高效本機正規表示式進行保底處理。</i>\n\n` +
      `👉 <b>請直接回覆您的 MiniMax API Key</b>，或發送 <code>skip</code> 跳過:`,
    skipStep2Text: (fwdText: string, mmxText: string) =>
      `⏭️ <b>已跳過大模型 API Key 配置。</b>\n\n` +
      `🎉 <b>【 恭喜！配置流程已順利完成 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `系統核心組件狀態:\n` +
      `• 備份轉發信箱: ${fwdText}\n` +
      `• 大模型審信: ${mmxText}\n\n` +
      `💡 <b>後續建議:</b>\n` +
      `• 發送 <code>/config</code> 查看全域配置中心與脫敏金鑰\n` +
      `• 發送 <code>/routes</code> 查看目前生效的收信畫像規則\n` +
      `• 隨時發送 <code>/setkey</code> 可單獨熱更新各項金鑰`,
    keyEmptyError:
      `❌ <b>API Key 不能為空！</b>\n請回覆有效的 API Key，或發送 <code>skip</code> 跳過:`,
    successStep2Text: (maskedKey: string, fwdText: string) =>
      `✅ <b>大模型 API Key 綁定成功！</b>\n` +
      `已儲存至 KV，脫敏預覽: <code>${maskedKey}</code>\n\n` +
      `🎉 <b>【 恭喜！極速配置流程已全部完成 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `您的 cf-mail2tg-aibot 郵件閘道已全面就緒！\n` +
      `• 備份轉發信箱: ${fwdText}\n` +
      `• 大模型審信: ✅ 已就緒 (<code>${maskedKey}</code>)\n\n` +
      `💡 <b>後續建議:</b>\n` +
      `• 發送 <code>/config</code> 查看全域配置中心與脫敏金鑰\n` +
      `• 發送 <code>/routes</code> 查看收信畫像與網域規則\n` +
      `• 任何新郵件到達時，閘道將全自動進行 AI 意圖分析並即時推播！`,
    kvRequiredError: `⚠️ <b>系統錯誤:</b> 未綁定 MAIL_ROUTES_KV 資料庫，無法啟動精靈。`,
    notConfiguredPureTg: '⚪ 未配置 (純TG單軌模式)',
    notConfiguredRegexFallback: '⚪ 未配置 (本機正則保底)',
    readyWithMask: (masked: string) => `✅ 已就緒 (<code>${masked}</code>)`,
  },

  emailCard: {
    intentTags: {
      验证: '驗證',
      营销: '行銷',
      告警: '告警',
      账单: '帳單',
      业务: '業務',
      通知: '通知',
    },
    personaTags: {
      个人: '個人',
      客服: '客服',
      商务: '商務',
      产品: '產品',
      通用: '通用',
      免费产品: '免費產品',
      付费产品: '付費產品',
      商业支持: '商業支援',
    },
    newEmailTitle: (intentTag: string, targetName: string) =>
      `<b>【新郵件 · ${intentTag} · ${targetName}】</b>`,
    verificationCode: '驗證碼',
    copyHint: '輕觸直接複製',
    businessType: '業務類型',
    recipientDomain: '收信網站',
    targetEmail: '目標信箱',
    senderFrom: '發件來源',
    authSPFDKIMPass: '🛡️ <b>鑑真:</b> <code>SPF通過 · DKIM簽章有效</code>',
    authSPFOnly: '🛡️ <b>鑑真:</b> <code>SPF通過 · DKIM未校驗</code>',
    authDKIMOnly: '🛡️ <b>鑑真:</b> <code>SPF未校驗 · DKIM簽章有效</code>',
    authFailed: '🚨 <b>鑑真:</b> <code>SPF/DKIM未通過 (疑似冒名來源)</code>',
    authUnknown: '🛡️ <b>鑑真:</b> <code>未知簽章</code>',
    aiRfcUnsubShortCircuit: '🏷️ <b>協定檢驗:</b> <code>RFC 8058退訂標頭命中 (已短路免調AI·省額度)</code>',
    aiKeywordShortCircuit: (keyword: string) =>
      `🏷️ <b>規則命中:</b> <code>關鍵字匹配 [${keyword}] (已短路免調AI·省額度)</code>`,
    aiMarketing: '🤖 <b>AI研判:</b> <code>LLM 判定為行銷推廣 (靜音免打擾)</code>',
    aiVerification: '🤖 <b>AI研判:</b> <code>LLM 判定為驗證碼 (重要·強提醒)</code>',
    aiSecurity: '🤖 <b>AI研判:</b> <code>LLM 判定為安全告警 (緊急響鈴)</code>',
    aiBilling: '🤖 <b>AI研判:</b> <code>LLM 判定為財務帳單 (響鈴提醒)</code>',
    aiNotification: '🤖 <b>AI研判:</b> <code>LLM 判定為系統通知 (常規提醒)</code>',
    aiImportant: '🤖 <b>AI研判:</b> <code>LLM 判定為重要信件 (響鈴提醒)</code>',
    aiErrorFallback: (detail: string) =>
      `🤖 <b>AI狀態:</b> <code>⚠️ LLM API失效: ${detail} (已保底響鈴)</code>`,
    aiRegexVerification: '🏷️ <b>規則命中:</b> <code>特徵匹配到驗證碼 (響鈴提醒)</code>',
    subjectLabel: '主　　題',
    noSubject: '(無主題)',
    unknownSender: '未知寄件者',
    attachmentsLabel: '附　　件',
    attachmentsSynced: '已同步至信箱',
    attachmentsUnit: (count: number) => ` 等共 ${count} 個檔案`,
    unnamedAttachment: '未命名附件',
    snippetLabel: '郵件摘要',
    noTextContent: '(無純文字內文內容)',
    snippetFolded: (max: number) => `... (內文過長已摺疊展示前 ${max} 字，完整原件已同步至信箱)`,
    backupStatusLabel: '備份狀態',
    backupSynced: (base: string, alias?: string) =>
      `<code>已同步遞送至備份信箱 (${base}${alias ? ` · ${alias}` : ''})</code>`,
    backupFailed: (error: string) => `<code>⚠️ 轉發失敗 (${error})</code>`,
    backupPureTG: '<code>未配置備份信箱 (純TG通知模式)</code>',
    replyContactLabel: '回覆聯絡',
  },

  securityAlerts: {
    reasonLabel: '攔截原因',
    actionLabel: '防禦動作',
    triggerLabel: '觸發原因',
    defenseStatusLabel: '防禦狀態',
    sizeCapTitle: '郵件轉發 · 超大容量熔斷攔截',
    sizeCapReason: (size: string, cap: string) =>
      `郵件大小為 <b>${size}</b>，超出閘道安全性上限 (${cap})`,
    sizeCapAction: '已向寄件者傳回 SMTP 552 退信，<b>未轉入備份信箱 (0 空間消耗)</b>。',
    sizeCapTip: '建議寄件者透過雲端硬碟或 GitHub 連結分享超大檔案。',
    attachmentTitle: '郵件轉發 · 附件安全策略攔截',
    attachmentReason: '觸發附件防禦策略',
    attachmentDetected: '偵測到附件',
    attachmentAction: '已向寄件者傳回 SMTP 550 退信，<b>未轉入備份信箱 (0 空間消耗)</b>。',
    rateLimitTitle: '郵件轉發 · 頻寬流量控管警報',
    rateLimitHighFreqSender: '高頻發信',
    rateLimitReason: '短時間內來信頻率超出上限',
    rateLimitStatusForwarded: (base: string, alias?: string) =>
      `該郵件已安全直轉備份信箱 (<code>${base}</code>${alias ? ` · 別名 <code>${alias}</code>` : ''})`,
    rateLimitStatusFailed: (error: string) => `⚠️ 轉發失敗: ${error}`,
    rateLimitStatusPureTG: '純TG通知模式 (無轉發信箱)',
    rateLimitTip: '為免打擾與防範 TG 429 頻控，本週期內已暫停此來源推播，請移至備份信箱查閱。',
  },

  sources: {
    kvOverride: '(動態KV覆蓋)',
    envDefault: '(環境預設)',
  },
};
