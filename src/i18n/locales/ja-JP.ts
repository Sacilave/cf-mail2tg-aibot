import type { TranslationDict } from '../types';

export const jaJP: TranslationDict = {
  langCode: 'ja-JP',
  langName: '日本語',
  flag: '🇯🇵',

  commandDesc: {
    start: 'ステータス概要を表示',
    menu: '設定パネルを開く',
    guide: '利用ガイドを表示',
    setup: '初期設定ウィザードを開始',
    lang: '表示言語の切り替え (Switch language)',
    config: '稼働状況とキー詳細を確認',
    provider: 'AIプロバイダーを切り替え',
    model: '実行モデルを切り替え',
    routes: 'ルーティングとタグを管理',
    keywords: '迷惑メールキーワードを表示',
    addkeywords: '遮断キーワードを追加',
    resetkeywords: 'キーワードを初期化',
    add: 'ルール追加 (add <タグ> <接頭辞> [転送先])',
    del: 'ルール削除 (del <接頭辞>)',
    setkey: 'キーや転送先を設定 (setkey <種別> <値>)',
    resetkey: '動的設定をリセット',
    cancel: '操作またはセッションを中止',
    help: 'コマンドヘルプを表示',
  },

  dashboard: {
    title: '⚙️ <b>【 設定 】</b>',
    desc: '下のボタンをタップして、AIプロバイダーの切り替え、ルーティング管理、スパム対策、言語設定を簡単に行えます：',
    btnAi: '🤖 AI モデル',
    btnRoutes: '📂 ルーティング',
    btnKeywords: '🚫 スパム対策',
    btnForward: '📬 メール転送',
    btnLang: '🌐 言語 / Language',
    btnRefresh: '🔄 最新情報に更新',
    btnBackMain: '🔙 メインメニュー',
    btnBackAi: '🔙 AI設定に戻る',
    btnBackRoutes: '🔙 ルーティングに戻る',
    btnManageModels: '🎯 モデル切り替え',
    btnSetKey: '🔑 APIキー設定',
    btnSetAiKey: '🔑 APIキー設定',
    btnResetAiKey: '🔄 APIキー初期化',
    btnAddRoute: '➕ ルール追加',
    btnTags: '🏷️ タグ管理',
    btnAddKw: '➕ 単語を追加',
    btnSetForward: '📬 転送先を変更',
    btnResetForward: '🗑️ 転送先を解除',
    btnSetup: '⚡ 初期設定ウィザード',
    btnCancel: '❌ キャンセル',
    routesTitle: '📂 <b>【 ペルソナルーティング設定 】</b>',
    routesSelectTagPrompt: '新しいルールの<b>ビジネス分類タグ</b>を選択してください（ボタンをタップ）：',
    routesInputPrefixPrompt: (tag: string) =>
      `選択されたタグ：<b>【${tag}】</b>\n\n` +
      `紐付ける<b>メール接頭辞</b>を返信してください（例: <code>vip</code> または <code>support</code>）：\n` +
      `<i>（💡 個別の転送先を指定する場合は: 接頭辞 メールアドレス、例: vip user@example.com）</i>`,
    routesAddSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>ルーティングルールを追加しました！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 接頭辞: <code>${prefix}</code>\n` +
      `• ペルソナ: <b>${tag}</b>\n` +
      `• 転送先: <code>${forward}</code>`,
    routesDeletedSuccess: (prefix: string) => `✅ 接頭辞 <code>${prefix}</code> のルールを削除しました！`,
    tagsTitle: '🏷️ <b>【 カスタムタグ管理 】</b>',
    tagsPrompt: 'カスタムタグを管理します。これらのタグはルーティングルールの作成時に選択できます：',
    tagsEmpty: 'カスタムタグはありません。現在デフォルト分類（個人、サポート、ビジネス、プロダクト、汎用）を使用しています。',
    tagsAddSuccess: (tag: string) => `✅ カスタムタグを追加しました: <b>【${tag}】</b>！`,
    tagsDeleteSuccess: (tag: string) => `✅ カスタムタグを削除しました: <b>【${tag}】</b>！`,
    tagsAddPrompt:
      '🏷️ <b>【 カスタムタグの追加 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      '作成するタグ名を返信してください（例: <code>財務</code>、<code>監視</code>、<code>開発</code>、10文字以内）：',
    tagsInvalid: '❌ タグ名が無効または既に存在します（1〜10文字、スペース不可）。',
    kwTitle: '🚫 <b>【 スパム・プロモーション遮断キーワード 】</b>',
    fwdTitle: '📬 <b>【 バックアップ転送設定 】</b>',
    toastUpdated: '設定を更新しました！',
    toastCancelled: '操作をキャンセルしました',
  },

  providerCommand: {
    title: '🏢 <b>【 AIプロバイダーの選択 】</b>',
    current: (provider: string, model: string) => `現在のプロバイダー: <b>${provider}</b> (モデル: <code>${model}</code>)`,
    prompt: '対応する番号を返信してください（5分間有効）：',
    success: (provider: string, model: string, note: string) =>
      `✅ <b>AIプロバイダーの切り替えが完了しました！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 現在のプロバイダー: <b>${provider}</b>\n` +
      `• 実行モデル: <code>${model}</code>\n` +
      `${note}`,
    invalidOption: '❌ 無効な番号です。1から9の数字を入力してください。キャンセルは /cancel です。',
    kvError: '❌ 設定を保存できません: MAIL_ROUTES_KV がバインドされていません。',
    tipSetKey: '💡 ヒント: APIキーが必要な場合は <code>/setkey ai &lt;キー&gt;</code> を送信してください。モデルの変更は <code>/model</code> です。',
  },

  modelCommand: {
    title: (provider: string) => `🧠 <b>【 ${provider} のモデル選択 】</b>`,
    current: (model: string) => `現在のモデル: <code>${model}</code>`,
    prompt: '番号またはカスタムモデル名を入力してください（5分間有効）：',
    success: (model: string) =>
      `✅ <b>モデルが正常に更新されました！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `現在の有効モデル: <code>${model}</code>`,
    invalidOption: '❌ 無効なモデル指定です。終了するには /cancel を送信してください。',
    kvError: '❌ 設定を保存できません: MAIL_ROUTES_KV がバインドされていません。',
  },

  langCommand: {
    selectPrompt:
      '🌐 <b>【 言語設定 / Language Settings 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Telegramの通知メッセージおよびコマンドの表示言語を選択してください：\n' +
      'Please select your preferred language for notifications and commands:',
    currentLang: (name: string) => `\n📌 現在の適用言語: <b>${name}</b>`,
    successAlert: (name: string) => `言語を ${name} に切り替えました！`,
    successCard: (name: string) =>
      `✅ <b>言語設定を更新しました！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `現在のシステム言語: <b>${name}</b>\n` +
      `今後受信するメール通知、セキュリティ警告、コマンド画面はすべてこの言語で表示されます。\n\n` +
      `💡 <i>/help を送信すると、コマンド一覧を確認できます。</i>`,
    invalidArg:
      '❌ <b>無効な言語コードです！</b>\n' +
      '利用可能な言語: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ko-KR</code> (한국어), <code>pt-BR</code> (Português), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      '例: <code>/lang ja</code> または <code>/lang</code> で選択メニューを開きます。',
  },

  startCommand: {
    title: '👋 <b>【 cf-mail2tg-aibot メールゲートウェイ 】</b>',
    subtitle: 'Cloudflare メール転送＆AI審査ボットが稼働しています。すべての受信メールは自動で安全に解析され、本チャットに転送されます。',
    statusSectionTitle: '📊 <b>ゲートウェイ稼働サマリー:</b>',
    statusRunningLabel: 'ステータス',
    statusRunningValue: 'オンライン (Online)',
    statusEngineLabel: 'AIエンジン',
    statusForwardLabel: 'バックアップ転送',
    statusNoForward: 'TG専用モード (未設定)',
    statusAliasOn: 'Gmail エイリアス有効',
    statusAliasOff: 'ダイレクト転送',
    statusDefenseLabel: 'エッジ防御',
    statusDefenseValue: '添付ファイル遮断 (550) · 5MB 容量制限',
    guideTip: '下の【設定】で各種構成、【利用ガイド】で詳細解説、【🌐 言語 / Language】で多言語の切り替えが可能です。',
    btnOpenMenu: '⚙️ 設定',
    btnGuide: '📖 利用ガイド',
  },

  usageGuide: {
    title: '📖 <b>【 cf-mail2tg-aibot 利用ガイド 】</b>',
    subtitle: 'ゲートウェイの基本機能と設定手順：',
    principlesTitle: '⚙️ <b>1. 処理フロー</b>',
    principlesContent:
      '• <b>メール受信</b>: ドメインメールを受信し、Worker スクリプトでフィルタリングと構造化解析を行います。\n' +
      '• <b>基本防御</b>: 5MB超過メールや危険な添付ファイルを遮断し、スパムの流入を防ぎます。\n' +
      '• <b>デュアル配送</b>: 本文テキストと認証コードを Telegram へ転送し、同時にバックアップ受信箱へ転送します。',
    tagsTitle: '🏷️ <b>2. メール分類と認証コード</b>',
    tagsContent:
      '• <b>意図タイプ</b>: <code>認証</code> · <code>プロモ</code> · <code>警告</code> · <code>請求</code> · <code>業務</code> · <code>通知</code>\n' +
      '• <b>認証コード</b>: ログインや登録コードを上部に表示し、タップでコピーできます。\n' +
      '• <b>送信元検証</b>: SPF / DKIM / DMARC 認証状態を確認し、なりすましを識別します。',
    antiSpamTitle: '🛡️ <b>3. スパム遮断と通知消音</b>',
    antiSpamContent:
      '• <b>ルール判定</b>: RFC 8058 配信停止ヘッダーや遮断キーワードに一致したメールをプロモとして処理します。\n' +
      '• <b>消音配信</b>: プロモメールは通知音を鳴らさず、AI モデルの消費を抑えます。\n' +
      '• <b>キーワード</b>: システム言語に応じた辞書を読み込み、<code>/addkeywords</code> で拡張可能です。',
    routesTitle: '📂 <b>4. 接頭辞ルーティングとエイリアス</b>',
    routesContent:
      '• <b>アドレス仕分け</b>: メール接頭辞に応じて分類（例: <code>support@</code> ➜ サポート、<code>admin@</code> ➜ 個人）。\n' +
      '• <b>エイリアス</b>: 転送時に <code>+tag</code> エイリアスを自動付与し、受信トレイでの仕分けを容易にします。',
    commandsTitle: '⚡ <b>5. コマンド一覧</b>',
    commandsContent:
      '• <code>/start</code> - 状態概要とクイックアクセス\n' +
      '• <code>/menu</code> - 設定を開く (⚙️ 設定)\n' +
      '• <code>/guide</code> - 利用ガイドを表示\n' +
      '• <code>/routes</code> - ルーティングルールとカスタムタグを管理\n' +
      '• <code>/keywords</code> - 遮断キーワードの管理\n' +
      '• <code>/ai</code> - AI プロバイダーとモデルを変更\n' +
      '• <code>/lang</code> - 表示言語を変更',
    footerTip: '画面下のインラインボタンで各操作を直感的に実行できます。',
    btnBackStart: '🔙 概要に戻る',
    btnBackDashboard: '⚙️ 設定',
    btnViewDocs: '🌐 GitHub で詳細ドキュメントを見る',
  },

  helpCommand: {
    title: '📖 <b>【 cf-mail2tg-aibot コマンドヘルプ 】</b>',
    menuHint: '左下の <b>[Menu]</b> を押すか、以下のコマンドを送信してください：',
    keysSectionTitle: '🔑 <b>状態と設定コマンド:</b>',
    configDesc: '• <code>/config</code> - 稼働状況と認証情報の詳細確認 (マスキング済み)',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;key&gt;</code> - AIのAPIキーをオンライン更新',
    setkeyForwardDesc: '• <code>/setkey forward &lt;email&gt;</code> - 転送先メールアドレスを更新',
    resetkeyDesc: '• <code>/resetkey &lt;minimax|forward&gt;</code> - 設定をリセットして環境変数に戻す',
    keywordsSectionTitle: '📋 <b>プロモーション遮断とスパム対策:</b>',
    keywordsDesc: '• <code>/keywords</code> - 全ての遮断キーワードを表示・コピー',
    addkeywordsDesc: '• <code>/addkeywords</code> - キーワードを安全に追加 (上書き防止)',
    resetkeywordsDesc: '• <code>/resetkeywords</code> - キーワードをシステムの初期状態に復元',
    routesSectionTitle: '🔀 <b>ドメインルーティングとペルソナ:</b>',
    routesDesc: '• <code>/routes</code> - 有効なルーティングルール一覧を表示',
    addDesc: '• <code>/add タグ 接頭辞 [転送先]</code> - メールアドレス振り分けルールを追加',
    delDesc: '• <code>/del 接頭辞</code> - ルールを削除 (確認画面あり)',
    langSectionTitle: '🌐 <b>多言語対応 (i18n):</b>',
    langDesc: '• <code>/lang [言語コード]</code> - 表示言語を切り替える',
    setupSectionTitle: '🛠️ <b>セットアップウィザード:</b>',
    setupDesc: '• <code>/setup</code> - 2ステップの対話型セットアップを開始',
    cancelDesc: '• <code>/cancel</code> - 実行中のウィザードをいつでも終了',
    footerTip: '💡 <i>ヒント: Botが送信したキーワード一覧に直接返信 (Reply) しても編集できます。</i>',
  },

  configCommand: {
    title: '⚙️ <b>【 設定と認証情報ステータス 】</b>',
    llmTitle: '🤖 <b>AIメール自動判定 (LLM):</b>',
    llmReady: (source: string) => `  • 状態: ✅ 準備完了 ${source}`,
    llmNotConfigured: '  • 状態: ⚪ 未設定 (ローカル正規表現スニッファーで動作中)',
    llmMaskedKey: (key: string) => `  • APIキー: <code>${key}</code>`,
    llmModel: (model: string) => `  • モデル: <code>${model}</code>`,
    forwardTitle: '📥 <b>ゼロロス転送トラック:</b>',
    forwardTarget: (target: string, source: string) => `  • 転送先: <code>${target}</code> ${source}`,
    forwardNotConfigured: '  • 転送先: ⚪ 未設定 (TG通知のみの単一モード)',
    forwardAliasesActive: '  • Gmailエイリアス: ✅ 有効 (+タグ振り分け)',
    forwardAliasesDisabled: '  • Gmailエイリアス: ⚪ 無効 (メイン受信箱に直接転送)',
    kvTitle: '🗄️ <b>KV データベース (MAIL_ROUTES_KV):</b>',
    kvConnected: '  • 接続状態: ✅ 接続済み・正常',
    kvNotConnected: '  • 接続状態: ❌ 未接続',
    kvKeywordsCount: (count: number) => `  • 有効な遮断キーワード: <b>${count}</b> 件`,
    kvCustomRulesCount: (count: number) => `  • カスタムルール: <b>${count}</b> 件`,
    securityTitle: '🛡️ <b>エッジセキュリティ防御ポリシー:</b>',
    securityBlockAll: '  • 添付ファイル防御: 🔴 すべて拒否 (SMTP 550)',
    securityHighRiskOnly: '  • 添付ファイル防御: 🟢 危険な拡張子のみ拒否',
    securityMaxCap: (size: string) => `  • 容量制限サーキットブレーカー: <b>${size}</b> (SMTP 552)`,
    securityMarketingPolicy: (policy: string) =>
      `  • プロモーション通知ポリシー: <code>${policy === 'mute' ? 'TG通知なし (mute)' : 'サイレント通知 (silent)'}</code>`,
    systemLangTitle: '🌐 <b>表示言語:</b>',
    systemLangDesc: (name: string, source: string) => `  • 現在の言語: <b>${name}</b> ${source}`,
    shortcutsTitle: '💡 <b>クイック操作コマンド:</b>',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - APIキーを更新',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;email&gt;</code> - 転送先アドレスを更新',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - APIキーの上書きを解除',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - 転送先の上書きを解除',
    shortcutLang: '• <code>/lang</code> - 言語を切り替える (全10言語対応)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【 設定・APIキー更新ガイド 】</b>',
    helpUsage: '<b>形式:</b> <code>/setkey &lt;種類&gt; &lt;値&gt;</code>',
    helpMinimax: '• <b>AI APIキーの更新:</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>転送先アドレスの更新:</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>更新はKVに即座に保存され、エッジ全体に反映されます。</i>',
    kvError: '❌ <b>システムエラー:</b> MAIL_ROUTES_KV がバインドされていません。',
    successMinimax: (maskedKey: string) =>
      `✅ <b>AI APIキーが正常に更新されました！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `新しいキーが保存されました: <code>${maskedKey}</code>\n` +
      `今後のメール解析にこのキーが使用されます。`,
    successForward: (email: string) =>
      `✅ <b>転送先メールアドレスが正常に更新されました！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `新しい転送先: <code>${email}</code>\n` +
      `⚠️ <i>このアドレスがCloudflare Email Routingで認証済みであることを確認してください。</i>`,
    unsupportedType: (type: string) =>
      `❌ <b>サポートされていない種類です:</b> 「<code>${type}</code>」\n利用可能: <code>minimax</code> または <code>forward</code>。`,
  },

  resetkeyCommand: {
    helpTitle: '💡 <b>【 キーリセットコマンドの案内 】</b>',
    helpUsage: '<b>形式:</b> <code>/resetkey &lt;minimax|forward&gt;</code>',
    helpDesc: 'KVの動的設定を削除し、環境変数の初期デフォルト値に戻します。',
    kvError: '❌ <b>システムエラー:</b> MAIL_ROUTES_KV がバインドされていません。',
    successReset: (subType: string) =>
      `🔄 <b>${subType} の動的設定をリセットしました！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `KVの上書きが削除され、環境変数の初期値にフォールバックしました。`,
  },

  keywordsCommand: {
    title: '📋 <b>【 プロモーション・迷惑メール遮断キーワード管理 】</b>',
    countDesc: (count: number) => `現在有効なキーワード数: <b>${count}</b> 件。`,
    instructions:
      '💡 <b>編集方法（コピーして変更後、【このメッセージに直接返信】）：</b>\n' +
      '1. 下のコードブロックをタップして全キーワードをコピーします；\n' +
      '2. <b>このメッセージに「返信 (Reply)」</b>を選択（または <code>setkeywords ...</code> を送信）し、編集します（<b>1行に1キーワード</b>）；\n' +
      '3. 送信すると、エッジ全体で即座に反映されます！',
    emptyError:
      '❌ <b>更新失敗:</b> 有効なキーワードが見つかりませんでした。\n少なくとも1つのキーワード（1行1件）を入力してください。',
    kvError: '❌ <b>システムエラー:</b> MAIL_ROUTES_KV がバインドされていません。',
    successUpdate: (count: number, preview: string, moreCount: string) =>
      `✅ <b>【 キーワードリストが更新されました！ 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>${count}</b> 件の遮断キーワードを保存しました。\n\n` +
      `📝 <b>登録キーワードのプレビュー:</b>\n` +
      `<code>${preview}${moreCount}</code>\n\n` +
      `💡 <i>これらのキーワードまたはRFC退会ヘッダーに一致するメールは、自動的にサイレント配信・アーカイブされます。</i>`,
    updateError: '❌ <b>更新失敗:</b> データベース保存中にエラーが発生しました。',
    addHelpTitle: '💡 <b>【 追加キーワード登録ガイド 】</b>',
    addHelpUsage: '<b>形式:</b> <code>/addkeywords キーワード1\nキーワード2</code>',
    addHelpDesc: '重複を排除して安全に既存リストに追加されます。<b>既存のキーワードが消えることはありません。</b>',
    successAppend: (addedCount: number, totalCount: number, preview: string) =>
      `✅ <b>【 キーワードが安全に追加されました 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 新規追加: <b>${addedCount}</b> 件（重複除外済み）\n` +
      `• 現在の有効総数: <b>${totalCount}</b> 件\n` +
      `• 既存のリストは安全に保護されています。\n\n` +
      `📝 <b>追加された項目:</b>\n` +
      `<code>${preview}</code>`,
    appendError: '❌ <b>追加失敗:</b> データベースエラーが発生しました。',
    resetSuccess: (count: number) =>
      `🔄 <b>【 キーワードをシステムの初期状態に復元しました 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `システム標準の <b>${count}</b> 件の日英中標準キーワードに戻りました。`,
  },

  routesCommand: {
    title: '📋 <b>【 現在有効なメールルーティングルール一覧 】</b>',
    presetBaselineTitle: '🔹 <b>システム既定の基本ペルソナ:</b>',
    fallbackGeneric: '• <i>(未一致のアドレス)</i> ➔ 🏷️ <b>汎用 (General)</b>',
    customRulesTitle: '🔸 <b>動的カスタムルール (KV保存):</b>',
    noCustomRules: '<i>(カスタムルールはまだありません。"add 个人 xxx" で追加可能)</i>',
    addHelpTitle: '💡 <b>【 ルール追加ガイド 】</b>',
    addHelpUsage:
      '<b>形式:</b> <code>add &lt;タグ&gt; &lt;接頭辞&gt; [転送先メール]</code>\n\n' +
      '• <b>指定可能タグ:</b> <code>個人</code>、<code>通用</code>、<code>免費產品</code>、<code>付費產品</code>、<code>商業支援</code>\n' +
      '• <b>接頭辞:</b> 例: <code>support</code> は <code>support@あなたのドメイン</code> に対応\n' +
      '• <b>転送先メール:</b> 任意。省略時はメイン転送先を使用\n\n' +
      '<b>例:</b>\n' +
      '• <code>add 个人 blog</code>\n' +
      '• <code>add 商业支持 help user@domain.com</code>',
    addMissingPrefix:
      '❌ <b>追加失敗:</b> 接頭辞が指定されていません。\n形式: <code>add &lt;タグ&gt; &lt;接頭辞&gt; [転送先]</code>',
    addInvalidTag: (allowed: string, input: string) =>
      `❌ <b>追加失敗:</b> タグは [${allowed}] のいずれかである必要があります。\n入力された値: 「<code>${input}</code>」`,
    addInvalidPrefix: (prefix: string) =>
      `❌ <b>追加失敗:</b> 接頭辞「<code>${prefix}</code>」が無効です。半角英数字、ドット、ハイフンのみ使用できます。`,
    addSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>ルーティングルールを追加しました！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>対象接頭辞:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>割り当てタグ:</b> ${tag}\n` +
      `📥 <b>転送先:</b> <code>${forward || '(単一TG通知モード)'}</code>\n\n` +
      `💡 <i>Catch-allが有効な場合、このアドレスへのメールは直ちに本ルールで振り分けられます。</i>`,
    delHelpTitle: '💡 <b>【 ルール削除ガイド 】</b>',
    delHelpUsage: '<b>形式:</b> <code>del &lt;接頭辞&gt;</code>\n<b>例:</b> <code>del blog</code>',
    delNotFound: (prefix: string) =>
      `⚠️ <b>見つかりません:</b> 接頭辞 <code>${prefix}</code> のカスタムルールが見つかりません。`,
    delConfirmPrompt: (prefix: string, tag: string, forward: string) =>
      `⚠️ <b>本当にこのルールを削除しますか？</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>対象接頭辞:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>現在のタグ:</b> ${tag}\n` +
      `📥 <b>転送先:</b> <code>${forward || '(なし)'}</code>\n\n` +
      `⚠️ <i>下のボタンを押すとKVデータベースから完全に削除されます！</i>`,
    delBtnConfirm: '🔴 削除を確定',
    delBtnCancel: '⚪ キャンセル',
    delAlertDeleted: 'データベースから完全に削除しました',
    delAlertNotFound: 'ルールが見つかりませんでした',
    delSuccessText: (prefix: string) =>
      `🗑️ <b>ルールを完全に削除しました！</b>\n━━━━━━━━━━━━━━━━━━\n接頭辞 <code>${prefix}</code> の設定はKVから抹消されました。`,
    delNotFoundText: (prefix: string) =>
      `⚠️ <b>削除失敗:</b> <code>${prefix}</code> は既に存在しないか削除されています。`,
    delAlertCancelled: '操作をキャンセルしました',
    delCancelledText: (prefix: string) =>
      `❌ <b>操作がキャンセルされました</b>\n━━━━━━━━━━━━━━━━━━\n接頭辞 <code>${prefix}</code> のルールは保持されます。`,
  },

  setupCommand: {
    startWizardText:
      `🚀 <b>【 cf-mail2tg-aibot セットアップウィザード (1/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `クイック初期設定ウィザードへようこそ！2ステップでコア設定を完了します。\n` +
      `💡 <i><code>skip</code> でスキップ、<code>/cancel</code> でいつでも終了できます。</i>\n\n` +
      `<b>ステップ 1: バックアップ転送先メールアドレスの設定</b>\n` +
      `受信メールを受信箱 (Gmail等) に無損失で転送します。\n` +
      `⚠️ <i>Cloudflareの Email Routing ➔ Destination addresses で認証済みか確認してください！</i>\n\n` +
      `👉 <b>転送先メールアドレスを直接返信してください</b> (例: <code>yourname@gmail.com</code>)、または <code>skip</code>:`,
    cancelSuccess:
      `❌ <b>セットアップウィザードを終了しました</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `セッションをリセットしました。<code>/setup</code> でいつでも再開できます。`,
    skipStep1Text:
      `⏭️ <b>バックアップ転送先の設定をスキップしました。</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot セットアップウィザード (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>ステップ 2: MiniMax AI APIキーの設定</b>\n` +
      `AIによるメール自動審信 (認証コード、請求、プロモーション、警告) とコード自動抽出に利用します。\n` +
      `💡 <i>未取得の場合は <code>skip</code> でスキップ (高速ローカル正規表現が動作します)。</i>\n\n` +
      `👉 <b>MiniMax APIキーを直接返信してください</b>、または <code>skip</code>:`,
    formatErrorStep1: (input: string) =>
      `❌ <b>メールアドレスの形式が不正です！</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `入力内容: <code>${input}</code>\n` +
      `有効なアドレスを入力するか、<code>skip</code> でスキップしてください:`,
    successStep1Text: (email: string) =>
      `✅ <b>バックアップ転送先を登録しました！</b>\n` +
      `保存アドレス: <code>${email}</code>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot セットアップウィザード (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>ステップ 2: MiniMax AI APIキーの設定</b>\n` +
      `AIによるメール自動審信 (認証コード、請求、プロモーション、警告) とコード自動抽出に利用します。\n` +
      `💡 <i>未取得の場合は <code>skip</code> でスキップ (高速ローカル正規表現が動作します)。</i>\n\n` +
      `👉 <b>MiniMax APIキーを直接返信してください</b>、または <code>skip</code>:`,
    step2Card:
      `🚀 <b>【 cf-mail2tg-aibot セットアップウィザード (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>ステップ 2: MiniMax AI APIキーの設定</b>\n` +
      `AIによるメール自動審信 (認証コード、請求、プロモーション、警告) とコード自動抽出に利用します。\n` +
      `💡 <i>未取得の場合は <code>skip</code> でスキップ (高速ローカル正規表現が動作します)。</i>\n\n` +
      `👉 <b>MiniMax APIキーを直接返信してください</b>、または <code>skip</code>:`,
    skipStep2Text: (fwdText: string, mmxText: string) =>
      `⏭️ <b>AI APIキーの設定をスキップしました。</b>\n\n` +
      `🎉 <b>【 おめでとうございます！設定が完了しました 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `システム稼働状態:\n` +
      `• バックアップ転送先: ${fwdText}\n` +
      `• AIメール解析: ${mmxText}\n\n` +
      `💡 <b>次のステップ:</b>\n` +
      `• <code>/config</code> で設定全般とマスク済みキーを確認\n` +
      `• <code>/routes</code> で有効なドメインルールを確認\n` +
      `• いつでも <code>/setkey</code> で個別にキーを更新可能`,
    keyEmptyError:
      `❌ <b>APIキーを入力してください！</b>\n有効なキーを返信するか、<code>skip</code> でスキップしてください:`,
    successStep2Text: (maskedKey: string, fwdText: string) =>
      `✅ <b>AI APIキーが正常に登録されました！</b>\n` +
      `KVに保存完了: <code>${maskedKey}</code>\n\n` +
      `🎉 <b>【 セットアップが完了しました 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `cf-mail2tg-aibot メールゲートウェイの準備が整いました！\n` +
      `• バックアップ転送先: ${fwdText}\n` +
      `• AIメール解析: ✅ 準備完了 (<code>${maskedKey}</code>)\n\n` +
      `💡 <b>次のステップ:</b>\n` +
      `• <code>/config</code> で設定全般を確認\n` +
      `• <code>/routes</code> でペルソナとドメインルールを確認\n` +
      `• 新着メール受信時に自動でAI解析と通知が行われます！`,
    kvRequiredError: `⚠️ <b>システムエラー:</b> MAIL_ROUTES_KV データベースがバインドされていません。ウィザードを開始できません。`,
    notConfiguredPureTg: '⚪ 未設定 (純TG単一モード)',
    notConfiguredRegexFallback: '⚪ 未設定 (ローカル正規表現フォールバック)',
    readyWithMask: (masked: string) => `✅ 準備完了 (<code>${masked}</code>)`,
  },

  emailCard: {
    intentTags: {
      验证: '認証コード',
      营销: 'プロモーション',
      告警: 'セキュリティ警告',
      账单: '請求書・決済',
      业务: '一般・ビジネス',
      通知: 'システム通知',
    },
    personaTags: {
      个人: '個人',
      客服: 'カスタマーサポート',
      商务: 'ビジネス・営業',
      产品: 'プロダクト',
      通用: '汎用',
      免费产品: '無料プロダクト',
      付费产品: '有料プロダクト',
      商业支持: '商用サポート',
    },
    newEmailTitle: (intentTag: string, targetName: string) =>
      `<b>【新着メール · ${intentTag} · ${targetName}】</b>`,
    verificationCode: '認証コード',
    copyHint: 'タップしてコピー',
    businessType: 'ペルソナ分類',
    recipientDomain: '受信ドメイン',
    targetEmail: '受信先アドレス',
    senderFrom: '送信元',
    authSPFDKIMPass: '🛡️ <b>認証:</b> <code>SPF合格 · DKIM署名有効</code>',
    authSPFOnly: '🛡️ <b>認証:</b> <code>SPF合格 · DKIM未検証</code>',
    authDKIMOnly: '🛡️ <b>認証:</b> <code>SPF未検証 · DKIM署名有効</code>',
    authFailed: '🚨 <b>認証:</b> <code>SPF/DKIM不合格 (なりすましの疑い)</code>',
    authUnknown: '🛡️ <b>認証:</b> <code>署名不明</code>',
    aiRfcUnsubShortCircuit: '🏷️ <b>プロトコル検査:</b> <code>RFC 8058 退会ヘッダー検出 (AIスキップ・枠節約)</code>',
    aiKeywordShortCircuit: (keyword: string) =>
      `🏷️ <b>ルール一致:</b> <code>キーワード一致 [${keyword}] (AIスキップ・枠節約)</code>`,
    aiMarketing: '🤖 <b>AI判定:</b> <code>LLM判定: プロモーション (サイレント配信)</code>',
    aiVerification: '🤖 <b>AI判定:</b> <code>LLM判定: 認証コード (重要・高優先度通知)</code>',
    aiSecurity: '🤖 <b>AI判定:</b> <code>LLM判定: セキュリティ警告 (緊急通知)</code>',
    aiBilling: '🤖 <b>AI判定:</b> <code>LLM判定: 請求・決済関連 (サウンド通知)</code>',
    aiNotification: '🤖 <b>AI判定:</b> <code>LLM判定: システム通知 (通常通知)</code>',
    aiImportant: '🤖 <b>AI判定:</b> <code>LLM判定: 重要メール (サウンド通知)</code>',
    aiErrorFallback: (detail: string) =>
      `🤖 <b>AI状態:</b> <code>⚠️ LLM APIエラー: ${detail} (通常通知で代替)</code>`,
    aiRegexVerification: '🏷️ <b>ルール一致:</b> <code>認証コードを検出しました (サウンド通知)</code>',
    subjectLabel: '件　　名',
    noSubject: '(件名なし)',
    unknownSender: '不明な送信元',
    attachmentsLabel: '添付ファイル',
    attachmentsSynced: 'メールボックスに同期済み',
    attachmentsUnit: (count: number) => ` 等 計 ${count} 件`,
    unnamedAttachment: '名称未設定ファイル',
    snippetLabel: '本文プレビュー',
    noTextContent: '(テキスト本文なし)',
    snippetFolded: (max: number) =>
      `... (長文のため先頭 ${max} 文字のみ表示。完全な原本は転送先メールをご確認ください)`,
    backupStatusLabel: '転送ステータス',
    backupSynced: (base: string, alias?: string) =>
      `<code>バックアップ宛先に同期完了 (${base}${alias ? ` · ${alias}` : ''})</code>`,
    backupFailed: (error: string) => `<code>⚠️ 転送失敗 (${error})</code>`,
    backupPureTG: '<code>転送先未設定 (TG通知のみ)</code>',
    replyContactLabel: '返信先アドレス',
  },

  securityAlerts: {
    reasonLabel: '遮断理由',
    actionLabel: '防御アクション',
    triggerLabel: 'トリガー理由',
    defenseStatusLabel: '防御ステータス',
    sizeCapTitle: 'メールゲートウェイ · 容量超過遮断',
    sizeCapReason: (size: string, cap: string) =>
      `メール容量が <b>${size}</b> であり、上限値 (${cap}) を超過しました`,
    sizeCapAction: '送信者に SMTP 552 で拒否通知を返送しました。<b>バックアップ転送は行われません (容量消費 0)。</b>',
    sizeCapTip: '送信者にクラウドストレージやGitHubリンクの利用を案内してください。',
    attachmentTitle: 'メールゲートウェイ · 添付ファイル防御ポリシー遮断',
    attachmentReason: '添付ファイルポリシー違反',
    attachmentDetected: '検出された添付ファイル',
    attachmentAction: '送信者に SMTP 550 で拒否通知を返送しました。<b>バックアップ転送は行われません (容量消費 0)。</b>',
    rateLimitTitle: 'メールゲートウェイ · レート制限警告',
    rateLimitHighFreqSender: '頻回送信元',
    rateLimitReason: '短時間内の受信頻度が閾値を超過しました',
    rateLimitStatusForwarded: (base: string, alias?: string) =>
      `バックアップ転送先に安全に転送済み (<code>${base}</code>${alias ? ` · エイリアス <code>${alias}</code>` : ''})`,
    rateLimitStatusFailed: (error: string) => `⚠️ 転送失敗: ${error}`,
    rateLimitStatusPureTG: 'TG通知のみモード (転送先なし)',
    rateLimitTip: 'スパム防止およびTG API制限保護のため、この送信元からの通知は一時的に抑制されています。',
  },

  sources: {
    kvOverride: '(動的KV優先)',
    envDefault: '(環境変数初期値)',
  },
};
