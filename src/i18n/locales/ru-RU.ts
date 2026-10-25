import type { TranslationDict } from '../types';

export const ruRU: TranslationDict = {
  langCode: 'ru-RU',
  langName: 'Русский',
  flag: '🇷🇺',

  commandDesc: {
    start: 'Общий статус работы системы',
    settings: 'Открыть панель настроек',
    status: 'Проверить статус системы и ключи',
    menu: 'Открыть панель настроек',
    config: 'Проверить статус системы и ключи',
    guide: 'Посмотреть руководство',
    setup: 'Запустить мастер настройки',
    lang: 'Сменить язык (Switch language)',
    provider: 'Сменить провайдера ИИ',
    model: 'Сменить версию модели',
    routes: 'Управление правилами маршрутизации',
    keywords: 'Посмотреть стоп-слова для спама',
    addkeywords: 'Добавить стоп-слова',
    resetkeywords: 'Сбросить стоп-слова',
    add: 'Добавить правило маршрутизации',
    del: 'Удалить правило маршрутизации',
    setkey: 'Обновить ключ или резервную почту',
    resetkey: 'Сбросить ключ или резервную почту',
    cancel: 'Отменить текущую сессию',
    help: 'Посмотреть справку по командам',
  },

  dashboard: {
    title: '⚙️ <b>【 Настройки 】</b>',
    desc: 'Нажмите кнопку ниже, чтобы переключить ИИ, настроить маршруты, спам-фильтр или сменить язык:',
    btnAi: '🤖 Модели ИИ',
    btnRoutes: '📂 Маршруты',
    btnKeywords: '🚫 Антиспам',
    btnForward: '📬 Пересылка',
    btnLang: '🌐 Язык / Language',
    btnRefresh: '🔄 Обновить',
    btnBackMain: '🔙 Главное меню',
    btnBackAi: '🔙 Назад к ИИ',
    btnBackRoutes: '🔙 Назад к маршрутам',
    btnManageModels: '🎯 Сменить модель',
    btnSetKey: '🔑 Установить API-ключ',
    btnSetAiKey: '🔑 Привязать ключ',
    btnResetAiKey: '🔄 Сбросить ключ',
    btnAddRoute: '➕ Добавить маршрут',
    btnTags: '🏷️ Управление тегами',
    btnAddKw: '➕ Добавить слова',
    btnSetForward: '📬 Изменить почту',
    btnResetForward: '🗑️ Удалить почту',
    btnSetup: '⚡ Мастер настройки',
    btnCancel: '❌ Отмена',
    routesTitle: '📂 <b>【 Правила маршрутизации почты 】</b>',
    routesSelectTagPrompt: 'Выберите <b>категорию</b> для нового маршрута (нажмите кнопку):',
    routesInputPrefixPrompt: (tag: string) =>
      `Выбрана категория: <b>【${tag}】</b>\n\n` +
      `Отправьте в ответ <b>префикс ящика</b> (например <code>vip</code> или <code>support</code>):\n` +
      `<i>(💡 Для отдельной пересылки укажите: префикс почта, например: vip user@example.com)</i>`,
    routesAddSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>Маршрут успешно добавлен!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Префикс: <code>${prefix}</code>\n` +
      `• Категория: <b>${tag}</b>\n` +
      `• Назначение: <code>${forward}</code>`,
    routesDeletedSuccess: (prefix: string) => `✅ Маршрут для префикса <code>${prefix}</code> успешно удален!`,
    tagsTitle: '🏷️ <b>【 Теги категорий 】</b>',
    tagsPrompt: 'Здесь вы можете управлять своими тегами категорий для создания правил маршрутизации:',
    tagsEmpty: 'Нет пользовательских тегов. Используются стандартные категории (Личное, Поддержка, Бизнес, Продукт, Общее).',
    tagsAddSuccess: (tag: string) => `✅ Добавлен пользовательский тег: <b>【${tag}】</b>!`,
    tagsDeleteSuccess: (tag: string) => `✅ Удален пользовательский тег: <b>【${tag}】</b>!`,
    tagsAddPrompt:
      '🏷️ <b>【 Добавление нового тега 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Отправьте название нового тега (например <code>Финансы</code>, <code>Мониторинг</code>, до 10 символов):',
    tagsInvalid: '❌ Недопустимое или повторяющееся имя тега (1-10 символов без пробелов).',
    kwTitle: '🚫 <b>【 Фильтр спам-слов 】</b>',
    fwdTitle: '📬 <b>【 Настройки пересылки почты 】</b>',
    toastUpdated: 'Настройки обновлены!',
    toastCancelled: 'Действие отменено',
  },

  providerCommand: {
    title: '🏢 <b>【 Выбор провайдера ИИ 】</b>',
    current: (provider: string, model: string) => `Текущий провайдер: <b>${provider}</b> (Модель: <code>${model}</code>)`,
    prompt: 'Отправьте номер в ответном сообщении (действует 5 минут):',
    success: (provider: string, model: string, note: string) =>
      `✅ <b>Провайдер ИИ успешно переключен!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Активный провайдер: <b>${provider}</b>\n` +
      `• Модель: <code>${model}</code>\n` +
      `${note}`,
    invalidOption: '❌ Неверный номер. Введите число от 1 до 9. Для отмены отправьте /cancel.',
    kvError: '❌ Ошибка сохранения: база данных MAIL_ROUTES_KV не подключена.',
    tipSetKey: '💡 Подсказка: если требуется API ключ, отправьте <code>/setkey ai &lt;ключ&gt;</code>. Для смены модели отправьте <code>/model</code>.',
  },

  modelCommand: {
    title: (provider: string) => `🧠 <b>【 Выбор модели для ${provider} 】</b>`,
    current: (model: string) => `Текущая модель: <code>${model}</code>`,
    prompt: 'Отправьте номер или имя модели (действует 5 минут):',
    success: (model: string) =>
      `✅ <b>Модель успешно обновлена!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Активная модель: <code>${model}</code>`,
    invalidOption: '❌ Неверный вариант. Для выхода отправьте /cancel.',
    kvError: '❌ Ошибка сохранения: база данных MAIL_ROUTES_KV не подключена.',
  },

  langCommand: {
    selectPrompt:
      '🌐 <b>【 Настройки языка / Language Settings 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Выберите предпочитаемый язык для сообщений и команд Telegram:\n' +
      'Please select your preferred language for notifications and commands:',
    currentLang: (name: string) => `\n📌 Текущий активный язык: <b>${name}</b>`,
    successAlert: (name: string) => `Язык успешно изменен на ${name}!`,
    successCard: (name: string) =>
      `✅ <b>Настройки языка обновлены!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Текущий язык системы: <b>${name}</b>\n` +
      `Все последующие карточки входящих писем, оповещения безопасности и панели команд будут отображаться на этом языке.\n\n` +
      `💡 <i>Отправьте /help, чтобы просмотреть команды на выбранном языке.</i>`,
    invalidArg:
      '❌ <b>Неверный код языка!</b>\n' +
      'Доступные языки: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ko-KR</code> (한국어), <code>pt-BR</code> (Português), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      'Пример: <code>/lang ru</code> или просто <code>/lang</code> для интерактивного меню.',
  },

  startCommand: {
    title: '👋 <b>【 Почтовый шлюз cf-mail2tg-aibot 】</b>',
    subtitle: 'Бот пересылки почты и анализа ИИ Cloudflare активен. Входящие письма безопасно обрабатываются и пересылаются в этот чат.',
    statusSectionTitle: '📊 <b>Сводка состояния шлюза:</b>',
    statusRunningLabel: 'Статус',
    statusRunningValue: 'В сети (Online)',
    statusEngineLabel: 'Движок ИИ',
    statusForwardLabel: 'Пересылка',
    statusNoForward: 'Только TG (не задан)',
    statusAliasOn: 'Алиасы Gmail включены',
    statusAliasOff: 'Прямая пересылка',
    statusDefenseLabel: 'Защита',
    statusDefenseValue: 'Блок вложений (550) · Лимит 5 МБ',
    guideTip: 'Нажмите 【Настройки】 для управления всеми параметрами; 【Руководство】 для справки; 【🌐 Язык / Language】 для смены языка.',
    btnOpenMenu: '⚙️ Настройки',
    btnGuide: '📖 Руководство',
  },

  usageGuide: {
    title: '📖 <b>【 Руководство cf-mail2tg-aibot 】</b>',
    subtitle: 'Базовые функции и настройка шлюза:',
    principlesTitle: '⚙️ <b>1. Процесс работы</b>',
    principlesContent:
      '• <b>Прием почты</b>: Входящие письма на домен обрабатываются и структурируются скриптом Worker.\n' +
      '• <b>Базовая защита</b>: Блокировка писем более 5 МБ и опасных вложений для защиты от спама.\n' +
      '• <b>Двойная доставка</b>: Отправка текста и кодов в Telegram с одновременной пересылкой на резервный ящик.',
    tagsTitle: '🏷️ <b>2. Категории и коды подтверждения</b>',
    tagsContent:
      '• <b>Типы писем</b>: <code>Верификация</code> · <code>Маркетинг</code> · <code>Тревога</code> · <code>Счета</code> · <code>Бизнес</code> · <code>Уведомления</code>\n' +
      '• <b>Коды из писем</b>: Автоматическое извлечение кодов авторизации с закреплением наверху для копирования.\n' +
      '• <b>Проверка SPF/DKIM</b>: Проверка записей подлинности отправителя для защиты от фишинга.',
    antiSpamTitle: '🛡️ <b>3. Фильтрация спама и тихий режим</b>',
    antiSpamContent:
      '• <b>По правилам</b>: Письма с заголовками отписки (RFC 8058) или спам-словами помечаются как маркетинг.\n' +
      '• <b>Без звука</b>: Маркетинговые письма доставляются тихо и не расходуют лимиты модели ИИ.\n' +
      '• <b>Стоп-слова</b>: Автоподбор словаря под язык системы, расширяемый командой <code>/addkeywords</code>.',
    routesTitle: '📂 <b>4. Префиксы ящиков и алиасы</b>',
    routesContent:
      '• <b>Сортировка</b>: Категоризация по префиксу адреса (например, <code>support@</code> ➜ Поддержка, <code>admin@</code> ➜ Личное).\n' +
      '• <b>Алиасы</b>: Автоматическое добавление тега <code>+tag</code> при пересылке для удобной фильтрации в почте.',
    commandsTitle: '⚡ <b>5. Список команд</b>',
    commandsContent:
      '• <code>/start</code> - Обзор состояния и быстрый доступ\n' +
      '• <code>/menu</code> - Настройки шлюза (⚙️ Настройки)\n' +
      '• <code>/guide</code> - Открыть это руководство\n' +
      '• <code>/routes</code> - Управление маршрутами и тегами\n' +
      '• <code>/keywords</code> - Управление стоп-словами\n' +
      '• <code>/ai</code> - Смена провайдера и модели ИI\n' +
      '• <code>/lang</code> - Смена языка интерфейса',
    footerTip: 'Большинство действий можно выполнить кнопками под сообщениями без ввода команд.',
    btnBackStart: '🔙 К обзору',
    btnBackDashboard: '⚙️ Настройки',
    btnViewDocs: '🌐 Подробная документация на GitHub',
  },

  helpCommand: {
    title: '📖 <b>【 cf-mail2tg-aibot Справка по командам 】</b>',
    menuHint: 'Нажмите кнопку <b>[Menu]</b> слева внизу или отправьте команду:',
    keysSectionTitle: '🔑 <b>Статус и команды настройки:</b>',
    configDesc: '• <code>/config</code> - Статус шлюза и сведения о ключах (с маскированием)',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;key&gt;</code> - Обновить API-ключ AI прямо с телефона',
    setkeyForwardDesc: '• <code>/setkey forward &lt;email&gt;</code> - Обновить почту для пересылки',
    resetkeyDesc: '• <code>/resetkey &lt;minimax|forward&gt;</code> - Сбросить перезапись ключей в KV',
    keywordsSectionTitle: '📋 <b>Антиспам и маркетинговые фильтры:</b>',
    keywordsDesc: '• <code>/keywords</code> - Просмотреть и скопировать все стоп-слова',
    addkeywordsDesc: '• <code>/addkeywords</code> - Добавить новые слова без перезаписи существующих',
    resetkeywordsDesc: '• <code>/resetkeywords</code> - Вернуть базовый список стоп-слов',
    routesSectionTitle: '🔀 <b>Маршрутизация и персоны:</b>',
    routesDesc: '• <code>/routes</code> - Показать все активные базовые и KV правила',
    addDesc: '• <code>/add Тег Префикс [Почта]</code> - Добавить правило маршрутизации',
    delDesc: '• <code>/del Префикс</code> - Удалить правило (с подтверждением)',
    langSectionTitle: '🌐 <b>Интернационализация (i18n):</b>',
    langDesc: '• <code>/lang [код]</code> - Переключить язык сообщений бота и карточек писем',
    setupSectionTitle: '🛠️ <b>Мастер настройки:</b>',
    setupDesc: '• <code>/setup</code> - Запустить пошаговый интерактивный мастер настройки',
    cancelDesc: '• <code>/cancel</code> - Прервать текущую сессию настройки',
    footerTip: '💡 <i>Совет: Вы можете ответить (Reply) на список ключевых слов от бота, чтобы изменить их.</i>',
  },

  configCommand: {
    title: '📊 <b>【 Состояние системы и ключей 】</b>',
    llmTitle: '🤖 <b>AI-классификация писем (MiniMax):</b>',
    llmReady: (source: string) => `  • Статус: ✅ Готов ${source}`,
    llmNotConfigured: '  • Статус: ⚪ Не настроен (работает локальный поиск регулярными выражениями)',
    llmMaskedKey: (key: string) => `  • API-ключ: <code>${key}</code>`,
    llmModel: (model: string) => `  • Модель: <code>${model}</code>`,
    forwardTitle: '📥 <b>Резервная пересылка без потерь:</b>',
    forwardTarget: (target: string, source: string) => `  • Почта назначения: <code>${target}</code> ${source}`,
    forwardNotConfigured: '  • Почта назначения: ⚪ Не настроена (только уведомления в TG)',
    forwardAliasesActive: '  • Алиасы Gmail: ✅ Включены (+теги в адресе)',
    forwardAliasesDisabled: '  • Алиасы Gmail: ⚪ Отключены (напрямую в основной ящик)',
    kvTitle: '🗄️ <b>База данных KV (MAIL_ROUTES_KV):</b>',
    kvConnected: '  • Подключение: ✅ Подключено и работает',
    kvNotConnected: '  • Подключение: ❌ Не привязано',
    kvKeywordsCount: (count: number) => `  • Активных стоп-слов: <b>${count}</b>`,
    kvCustomRulesCount: (count: number) => `  • Пользовательских правил: <b>${count}</b>`,
    securityTitle: '🛡️ <b>Политики безопасности шлюза:</b>',
    securityBlockAll: '  • Политика вложений: 🔴 Блокировать все (SMTP 550)',
    securityHighRiskOnly: '  • Политика вложений: 🟢 Блокировать только опасные форматы',
    securityMaxCap: (size: string) => `  • Лимит размера письма: <b>${size}</b> (SMTP 552)`,
    securityMarketingPolicy: (policy: string) =>
      `  • Политика для рассылок: <code>${policy === 'mute' ? 'Не отправлять в TG (mute)' : 'Без звука (silent)'}</code>`,
    systemLangTitle: '🌐 <b>Язык системы:</b>',
    systemLangDesc: (name: string, source: string) => `  • Текущий язык: <b>${name}</b> ${source}`,
    shortcutsTitle: '💡 <b>Команды быстрого обновления:</b>',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - Обновить ключ AI',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;email&gt;</code> - Обновить резервную почту',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - Сбросить ключ AI',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - Сбросить адрес пересылки',
    shortcutLang: '• <code>/lang</code> - Сменить язык (поддерживается 10 языков)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【 Инструкция по обновлению ключей 】</b>',
    helpUsage: '<b>Формат:</b> <code>/setkey &lt;тип&gt; &lt;значение&gt;</code>',
    helpMinimax: '• <b>Обновление ключа AI:</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>Обновление почты пересылки:</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>Изменения сохраняются в KV и вступают в силу мгновенно.</i>',
    kvError: '❌ <b>Системная ошибка:</b> База MAIL_ROUTES_KV не подключена.',
    successMinimax: (maskedKey: string) =>
      `✅ <b>API-ключ AI успешно обновлен!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Новый ключ сохранен в KV: <code>${maskedKey}</code>\n` +
      `Последующие письма будут анализироваться с использованием этого ключа.`,
    successForward: (email: string) =>
      `✅ <b>Адрес резервной пересылки успешно обновлен!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Новый адрес: <code>${email}</code>\n` +
      `⚠️ <i>Убедитесь, что этот адрес подтвержден в Cloudflare Email Routing!</i>`,
    unsupportedType: (type: string) =>
      `❌ <b>Неподдерживаемый тип конфигурации:</b> 「<code>${type}</code>」\nПоддерживается только <code>minimax</code> или <code>forward</code>.`,
  },

  resetkeyCommand: {
    helpTitle: '💡 <b>【 Инструкция по сбросу ключей 】</b>',
    helpUsage: '<b>Формат:</b> <code>/resetkey &lt;minimax|forward&gt;</code>',
    helpDesc: 'Удаляет переопределение из базы KV и возвращает значения из переменных окружения.',
    kvError: '❌ <b>Системная ошибка:</b> База MAIL_ROUTES_KV не подключена.',
    successReset: (subType: string) =>
      `🔄 <b>Сброшена динамическая конфигурация для ${subType}!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Запись в KV удалена. Система переключилась на значения по умолчанию.`,
  },

  keywordsCommand: {
    title: '📋 <b>【 Управление стоп-словами фильтра спама 】</b>',
    countDesc: (count: number) => `Всего активных стоп-слов: <b>${count}</b>.`,
    instructions:
      '💡 <b>Как изменить (Скопируйте, измените и [Ответьте на это сообщение]):</b>\n' +
      '1. Нажмите на блок кода ниже, чтобы скопировать все слова;\n' +
      '2. Выберите <b>«Ответить (Reply)»</b> на это сообщение (или отправьте <code>setkeywords ...</code>), вставьте и отредактируйте (<b>по одному слову на строку</b>);\n' +
      '3. Отправьте сообщение, и изменения мгновенно применятся на всех узлах Cloudflare!',
    emptyError:
      '❌ <b>Ошибка обновления:</b> Не найдено ни одного ключевого слова.\nУкажите как минимум одно слово (по одному на строку).',
    kvError: '❌ <b>Системная ошибка:</b> База MAIL_ROUTES_KV не подключена.',
    successUpdate: (count: number, preview: string, moreCount: string) =>
      `✅ <b>【 Список стоп-слов успешно обновлен! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Сохранено <b>${count}</b> стоп-слов для фильтрации.\n\n` +
      `📝 <b>Предпросмотр:</b>\n` +
      `<code>${preview}${moreCount}</code>\n\n` +
      `💡 <i>Письма, содержащие эти слова или заголовок отписки RFC, будут доставляться без звука.</i>`,
    updateError: '❌ <b>Ошибка обновления:</b> Сбой при сохранении в базу данных KV.',
    addHelpTitle: '💡 <b>【 Добавление стоп-слов без перезаписи 】</b>',
    addHelpUsage: '<b>Формат:</b> <code>/addkeywords слово1\nслово2</code>',
    addHelpDesc: 'Слова дедуплицируются и безопасно объединяются. <b>Существующие слова не будут стерты.</b>',
    successAppend: (addedCount: number, totalCount: number, preview: string) =>
      `✅ <b>【 Стоп-слова успешно добавлены 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Добавлено новых слов: <b>${addedCount}</b> (дубликаты отфильтрованы)\n` +
      `• Всего активных слов: <b>${totalCount}</b>\n` +
      `• Предыдущий список сохранен в безопасности.\n\n` +
      `📝 <b>Добавленные элементы:</b>\n` +
      `<code>${preview}</code>`,
    appendError: '❌ <b>Ошибка добавления:</b> Сбой записи в базу данных.',
    resetSuccess: (count: number) =>
      `🔄 <b>【 Список стоп-слов сброшен к базовому 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Восстановлены стандартные <b>${count}</b> мультиязычных стоп-слов.`,
  },

  routesCommand: {
    title: '📋 <b>【 Действующие правила маршрутизации писем 】</b>',
    presetBaselineTitle: '🔹 <b>Системные базовые персоны:</b>',
    fallbackGeneric: '• <i>(Остальные адреса)</i> ➔ 🏷️ <b>Общие</b>',
    customRulesTitle: '🔸 <b>Пользовательские правила (в KV):</b>',
    noCustomRules: '<i>(Нет правил. Используйте "add personal префикс" для добавления)</i>',
    addHelpTitle: '💡 <b>【 Инструкция по добавлению правила 】</b>',
    addHelpUsage:
      '<b>Формат:</b> <code>add &lt;тег&gt; &lt;префикс&gt; [почта_пересылки]</code>\n\n' +
      '• <b>Допустимые теги:</b> <code>Личное</code>, <code>Общие</code>, <code>Бесплатный продукт</code>, <code>Платный продукт</code>, <code>Техподдержка</code>\n' +
      '• <b>Префикс:</b> например, <code>support</code> для адреса <code>support@ваш-домен.com</code>\n' +
      '• <b>Почта:</b> Опционально. По умолчанию используется основная почта пересылки.\n\n' +
      '<b>Примеры:</b>\n' +
      '• <code>add Личное blog</code>\n' +
      '• <code>add Техподдержка help user@domain.com</code>',
    addMissingPrefix:
      '❌ <b>Ошибка добавления:</b> Не указан префикс адреса.\nФормат: <code>add &lt;тег&gt; &lt;префикс&gt; [почта]</code>',
    addInvalidTag: (allowed: string, input: string) =>
      `❌ <b>Ошибка добавления:</b> Тег должен быть одним из [${allowed}].\nВы указали: 「<code>${input}</code>」.`,
    addInvalidPrefix: (prefix: string) =>
      `❌ <b>Ошибка добавления:</b> Недопустимый формат префикса 「<code>${prefix}</code>」. Разрешены только буквы, цифры, точки и дефисы.`,
    addSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>Правило маршрутизации успешно добавлено!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Префикс:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Тег:</b> ${tag}\n` +
      `📥 <b>Пересылка:</b> <code>${forward || '(Только уведомления в TG)'}</code>\n\n` +
      `💡 <i>При включенном Catch-all письма на этот адрес сразу будут маршрутизироваться по правилу.</i>`,
    delHelpTitle: '💡 <b>【 Инструкция по удалению правила 】</b>',
    delHelpUsage: '<b>Формат:</b> <code>del &lt;префикс&gt;</code>\n<b>Пример:</b> <code>del blog</code>',
    delNotFound: (prefix: string) =>
      `⚠️ <b>Правило не найдено:</b> В базе KV нет правила для префикса <code>${prefix}</code>.`,
    delConfirmPrompt: (prefix: string, tag: string, forward: string) =>
      `⚠️ <b>Подтвердите удаление правила:</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Префикс:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Текущий тег:</b> ${tag}\n` +
      `📥 <b>Пересылка:</b> <code>${forward || '(Нет)'}</code>\n\n` +
      `⚠️ <i>Нажмите кнопку ниже. Правило будет безвозвратно удалено из базы KV!</i>`,
    delBtnConfirm: '🔴 Удалить',
    delBtnCancel: '⚪ Отмена',
    delAlertDeleted: 'Правило удалено из базы данных',
    delAlertNotFound: 'Правило не найдено',
    delSuccessText: (prefix: string) =>
      `🗑️ <b>Правило успешно удалено!</b>\n━━━━━━━━━━━━━━━━━━\nМаршрут для префикса <code>${prefix}</code> полностью удален из KV.`,
    delNotFoundText: (prefix: string) =>
      `⚠️ <b>Ошибка удаления:</b> <code>${prefix}</code> не найдено в базе данных.`,
    delAlertCancelled: 'Операция отменена',
    delCancelledText: (prefix: string) =>
      `❌ <b>Действие отменено</b>\n━━━━━━━━━━━━━━━━━━\nПравило для префикса <code>${prefix}</code> сохранено без изменений.`,
  },

  setupCommand: {
    startWizardText:
      `🚀 <b>【 cf-mail2tg-aibot Мастер настройки (1/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Добро пожаловать в мастер настройки! Мы привяжем основные данные за 2 шага.\n` +
      `💡 <i>Отправьте <code>skip</code> для пропуска или <code>/cancel</code> для выхода.</i>\n\n` +
      `<b>Шаг 1: Настройка резервной почты (Forward Email)</b>\n` +
      `Для надежной пересылки входящих писем в ваш основной ящик (напр., Gmail).\n` +
      `⚠️ <i>Убедитесь, что адрес подтвержден в Cloudflare Email Routing ➔ Destination addresses!</i>\n\n` +
      `👉 <b>Отправьте в ответ ваш адрес почты</b> (напр., <code>yourname@gmail.com</code>) или <code>skip</code>:`,
    cancelSuccess:
      `❌ <b>Вы вышли из мастера настройки</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Сессия настройки сброшена. Вы можете начать заново в любой момент: <code>/setup</code>.`,
    skipStep1Text:
      `⏭️ <b>Настройка резервной почты пропущена.</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot Мастер настройки (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Шаг 2: Настройка API-ключа MiniMax AI</b>\n` +
      `Используется для AI-анализа писем (коды, счета, маркетинг, оповещения) и извлечения кодов.\n` +
      `💡 <i>Если ключа пока нет, отправьте <code>skip</code> (будет работать локальный поиск по шаблонам).</i>\n\n` +
      `👉 <b>Отправьте в ответ ваш MiniMax API Key</b> или <code>skip</code>:`,
    formatErrorStep1: (input: string) =>
      `❌ <b>Некорректный формат почты!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Вы ввели: <code>${input}</code>\n` +
      `Введите правильный адрес (напр.: <code>mymail@gmail.com</code>) или отправьте <code>skip</code>:`,
    successStep1Text: (email: string) =>
      `✅ <b>Резервная почта успешно привязана!</b>\n` +
      `Сохранен адрес: <code>${email}</code>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot Мастер настройки (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Шаг 2: Настройка API-ключа MiniMax AI</b>\n` +
      `Используется для AI-анализа писем (коды, счета, маркетинг, оповещения) и извлечения кодов.\n` +
      `💡 <i>Если ключа пока нет, отправьте <code>skip</code> (будет работать локальный поиск по шаблонам).</i>\n\n` +
      `👉 <b>Отправьте в ответ ваш MiniMax API Key</b> или <code>skip</code>:`,
    step2Card:
      `🚀 <b>【 cf-mail2tg-aibot Мастер настройки (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Шаг 2: Настройка API-ключа MiniMax AI</b>\n` +
      `Используется для AI-анализа писем (коды, счета, маркетинг, оповещения) и извлечения кодов.\n` +
      `💡 <i>Если ключа пока нет, отправьте <code>skip</code> (будет работать локальный поиск по шаблонам).</i>\n\n` +
      `👉 <b>Отправьте в ответ ваш MiniMax API Key</b> или <code>skip</code>:`,
    skipStep2Text: (fwdText: string, mmxText: string) =>
      `⏭️ <b>Настройка API-ключа AI пропущена.</b>\n\n` +
      `🎉 <b>【 Поздравляем! Настройка успешно завершена 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Статус компонентов системы:\n` +
      `• Резервная почта: ${fwdText}\n` +
      `• AI-анализ писем: ${mmxText}\n\n` +
      `💡 <b>Что дальше:</b>\n` +
      `• Отправьте <code>/config</code> для проверки настроек и ключей\n` +
      `• Отправьте <code>/routes</code> для просмотра правил маршрутизации\n` +
      `• Вы можете в любой момент обновить ключи через <code>/setkey</code>`,
    keyEmptyError:
      `❌ <b>API-ключ не может быть пустым!</b>\nОтправьте правильный ключ или <code>skip</code>:`,
    successStep2Text: (maskedKey: string, fwdText: string) =>
      `✅ <b>API-ключ AI успешно привязан!</b>\n` +
      `Сохранено в KV: <code>${maskedKey}</code>\n\n` +
      `🎉 <b>【 Настройка полностью завершена 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Ваш почтовый шлюз cf-mail2tg-aibot полностью готов к работе!\n` +
      `• Резервная почта: ${fwdText}\n` +
      `• AI-анализ писем: ✅ Готов (<code>${maskedKey}</code>)\n\n` +
      `💡 <b>Что дальше:</b>\n` +
      `• Отправьте <code>/config</code> для проверки центра настроек\n` +
      `• Отправьте <code>/routes</code> для настройки правил доменов\n` +
      `• Все входящие письма будут автоматически анализироваться с помощью AI!`,
    kvRequiredError: `⚠️ <b>Системная ошибка:</b> База данных MAIL_ROUTES_KV не привязана. Невозможно запустить мастер.`,
    notConfiguredPureTg: '⚪ Не настроено (только TG)',
    notConfiguredRegexFallback: '⚪ Не настроено (резерв regex)',
    readyWithMask: (masked: string) => `✅ Готов (<code>${masked}</code>)`,
  },

  emailCard: {
    intentTags: {
      验证: 'Верификация',
      营销: 'Маркетинг',
      告警: 'Оповещение',
      账单: 'Счета/Оплата',
      业务: 'Деловая почта',
      通知: 'Уведомление',
    },
    personaTags: {
      个人: 'Личное',
      客服: 'Поддержка',
      商务: 'Бизнес и продажи',
      产品: 'Продукт',
      通用: 'Общее',
      免费产品: 'Бесплатный продукт',
      付费产品: 'Платный продукт',
      商业支持: 'Техподдержка',
    },
    newEmailTitle: (intentTag: string, targetName: string) =>
      `<b>【Новое письмо · ${intentTag} · ${targetName}】</b>`,
    verificationCode: 'Код подтверждения',
    copyHint: 'Нажмите, чтобы скопировать',
    businessType: 'Категория/Тег',
    recipientDomain: 'Домен получателя',
    targetEmail: 'Ящик получателя',
    senderFrom: 'Отправитель',
    authSPFDKIMPass: '🛡️ <b>Подлинность:</b> <code>SPF пройден · DKIM действителен</code>',
    authSPFOnly: '🛡️ <b>Подлинность:</b> <code>SPF пройден · DKIM отсутствует</code>',
    authDKIMOnly: '🛡️ <b>Подлинность:</b> <code>SPF отсутствует · DKIM действителен</code>',
    authFailed: '🚨 <b>Подлинность:</b> <code>SPF/DKIM не пройдены (возможна подделка)</code>',
    authUnknown: '🛡️ <b>Подлинность:</b> <code>Неизвестная подпись</code>',
    aiRfcUnsubShortCircuit: '🏷️ <b>Протокол:</b> <code>Заголовок отписки RFC 8058 (Запрос к AI пропущен)</code>',
    aiKeywordShortCircuit: (keyword: string) =>
      `🏷️ <b>Фильтр:</b> <code>Совпадение по слову [${keyword}] (Запрос к AI пропущен)</code>`,
    aiMarketing: '🤖 <b>AI-анализ:</b> <code>Реклама/Рассылка (Доставлено без звука)</code>',
    aiVerification: '🤖 <b>AI-анализ:</b> <code>Код подтверждения (Высокий приоритет)</code>',
    aiSecurity: '🤖 <b>AI-анализ:</b> <code>Оповещение безопасности (Срочно)</code>',
    aiBilling: '🤖 <b>AI-анализ:</b> <code>Финансовый счет/Оплата (Со звуком)</code>',
    aiNotification: '🤖 <b>AI-анализ:</b> <code>Системное уведомление (Обычный сигнал)</code>',
    aiImportant: '🤖 <b>AI-анализ:</b> <code>Важное письмо (Со звуком)</code>',
    aiErrorFallback: (detail: string) =>
      `🤖 <b>AI-статус:</b> <code>⚠️ Ошибка AI API: ${detail} (Доставлено со звуком)</code>`,
    aiRegexVerification: '🏷️ <b>Фильтр:</b> <code>Обнаружен код подтверждения (Со звуком)</code>',
    subjectLabel: 'Тема письма',
    noSubject: '(Без темы)',
    unknownSender: 'Неизвестный отправитель',
    attachmentsLabel: 'Вложения',
    attachmentsSynced: 'Синхронизировано в ящик',
    attachmentsUnit: (count: number) => ` и еще ${count} файлов`,
    unnamedAttachment: 'Безымянный файл',
    snippetLabel: 'Текст письма',
    noTextContent: '(Текстовое содержимое отсутствует)',
    snippetFolded: (max: number) =>
      `... (Письмо слишком длинное, показаны первые ${max} знаков, оригинал переслан на почту)`,
    backupStatusLabel: 'Статус резервирования',
    backupSynced: (base: string, alias?: string) =>
      `<code>Переслано на резервную почту (${base}${alias ? ` · ${alias}` : ''})</code>`,
    backupFailed: (error: string) => `<code>⚠️ Ошибка пересылки (${error})</code>`,
    backupPureTG: '<code>Резервная почта не настроена (Только TG)</code>',
    replyContactLabel: 'Для ответа',
  },

  securityAlerts: {
    reasonLabel: 'Причина',
    actionLabel: 'Действие защиты',
    triggerLabel: 'Причина срабатывания',
    defenseStatusLabel: 'Статус защиты',
    sizeCapTitle: 'Почтовый шлюз · Превышен лимит размера',
    sizeCapReason: (size: string, cap: string) =>
      `Размер письма <b>${size}</b>, что превышает лимит шлюза (${cap})`,
    sizeCapAction: 'Отправителю возвращена ошибка SMTP 552. <b>В резервную почту не пересылалось (0 МБ занято).</b>',
    sizeCapTip: 'Рекомендуется использовать облачные диски или GitHub для передачи больших файлов.',
    attachmentTitle: 'Почтовый шлюз · Блокировка вложений политикой',
    attachmentReason: 'Нарушение политики безопасности вложений',
    attachmentDetected: 'Обнаруженные вложения',
    attachmentAction: 'Отправителю возвращена ошибка SMTP 550. <b>В резервную почту не пересылалось (0 МБ занято).</b>',
    rateLimitTitle: 'Почтовый шлюз · Предупреждение о частоте писем',
    rateLimitHighFreqSender: 'Частый отправитель',
    rateLimitReason: 'Частота входящих писем превысила порог окна защиты',
    rateLimitStatusForwarded: (base: string, alias?: string) =>
      `Письмо безопасно переслано на резервную почту (<code>${base}</code>${alias ? ` · Алиас <code>${alias}</code>` : ''})`,
    rateLimitStatusFailed: (error: string) => `⚠️ Ошибка пересылки: ${error}`,
    rateLimitStatusPureTG: 'Режим только TG (Резервная почта не настроена)',
    rateLimitTip: 'Для защиты от спама уведомления в Telegram от этого адреса временно заглушены.',
  },

  sources: {
    kvOverride: '(Переопределение KV)',
    envDefault: '(По умолчанию)',
  },
};
