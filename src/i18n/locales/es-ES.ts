import type { TranslationDict } from '../types';

export const esES: TranslationDict = {
  langCode: 'es-ES',
  langName: 'Español',
  flag: '🇪🇸',

  commandDesc: {
    start: 'Ver resumen del estado',
    menu: 'Abrir panel de ajustes',
    guide: 'Ver guía detallada',
    setup: 'Iniciar asistente de config.',
    lang: 'Cambiar idioma (Switch language)',
    config: 'Ver estado del sistema y claves',
    provider: 'Cambiar proveedor de IA',
    model: 'Cambiar versión de modelo IA',
    routes: 'Gestionar rutas y etiquetas',
    keywords: 'Ver lista de palabras spam',
    addkeywords: 'Añadir palabras spam',
    resetkeywords: 'Restablecer palabras spam',
    add: 'Añadir regla (add <etiq> <prefijo>)',
    del: 'Eliminar regla (del <prefijo>)',
    setkey: 'Configurar clave o buzón (setkey)',
    resetkey: 'Restablecer clave dinámica',
    cancel: 'Cancelar sesión o asistente',
    help: 'Manual de comandos y ayuda',
  },

  dashboard: {
    title: '⚙️ <b>【 Ajustes 】</b>',
    desc: 'Toque los botones siguientes para cambiar de IA, gestionar reglas de ruta, configurar antispam o cambiar el idioma:',
    btnAi: '🤖 Modelos IA',
    btnRoutes: '📂 Enrutamiento',
    btnKeywords: '🚫 Filtro Spam',
    btnForward: '📬 Reenvío',
    btnLang: '🌐 Idioma / Language',
    btnRefresh: '🔄 Actualizar',
    btnBackMain: '🔙 Menú Principal',
    btnBackAi: '🔙 Volver a IA',
    btnBackRoutes: '🔙 Volver a Rutas',
    btnManageModels: '🎯 Cambiar Modelo',
    btnSetKey: '🔑 Configurar API Key',
    btnSetAiKey: '🔑 Vincular API Key',
    btnResetAiKey: '🔄 Borrar API Key',
    btnAddRoute: '➕ Añadir Regla',
    btnTags: '🏷️ Gestión de Etiquetas',
    btnAddKw: '➕ Añadir palabras',
    btnSetForward: '📬 Cambiar buzón',
    btnResetForward: '🗑️ Eliminar buzón',
    btnSetup: '⚡ Asistente de config.',
    btnCancel: '❌ Cancelar',
    routesTitle: '📂 <b>【 Gestión de Reglas de Enrutamiento 】</b>',
    routesSelectTagPrompt: 'Seleccione una <b>etiqueta de categoría</b> para la nueva regla (toque el botón):',
    routesInputPrefixPrompt: (tag: string) =>
      `Categoría seleccionada: <b>【${tag}】</b>\n\n` +
      `Por favor responda con el <b>prefijo de correo</b> a vincular (ej. <code>vip</code> o <code>support</code>):\n` +
      `<i>(💡 Para especificar un destino de reenvío: prefijo correo, ej: vip user@example.com)</i>`,
    routesAddSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>¡Regla de enrutamiento añadida con éxito!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Prefijo: <code>${prefix}</code>\n` +
      `• Etiqueta: <b>${tag}</b>\n` +
      `• Destino: <code>${forward}</code>`,
    routesDeletedSuccess: (prefix: string) => `✅ ¡Regla para el prefijo <code>${prefix}</code> eliminada con éxito!`,
    tagsTitle: '🏷️ <b>【 Gestor de Etiquetas Personalizadas 】</b>',
    tagsPrompt: 'Gestione sus etiquetas de negocio personalizadas. Podrá usarlas al añadir reglas de enrutamiento:',
    tagsEmpty: 'Sin etiquetas personalizadas. Se usan las categorías predeterminadas (Personal, Soporte, Negocios, Producto, General).',
    tagsAddSuccess: (tag: string) => `✅ ¡Etiqueta personalizada añadida: <b>【${tag}】</b>!`,
    tagsDeleteSuccess: (tag: string) => `✅ ¡Etiqueta eliminada: <b>【${tag}】</b>!`,
    tagsAddPrompt:
      '🏷️ <b>【 Añadir Nueva Etiqueta 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Responda con el nombre de la nueva etiqueta (ej: <code>Finanzas</code>, <code>Monitoreo</code>, máx 10 letras):',
    tagsInvalid: '❌ Nombre de etiqueta inválido o duplicado (1-10 caracteres sin espacios).',
    kwTitle: '🚫 <b>【 Palabras Clave de Bloqueo Publicitario 】</b>',
    fwdTitle: '📬 <b>【 Configuración de Reenvío y Copia 】</b>',
    toastUpdated: '¡Configuración actualizada!',
    toastCancelled: 'Operación cancelada',
  },

  providerCommand: {
    title: '🏢 <b>【 Seleccionar Proveedor de IA 】</b>',
    current: (provider: string, model: string) => `Proveedor Actual: <b>${provider}</b> (Modelo: <code>${model}</code>)`,
    prompt: 'Responda con el número correspondiente (válido por 5 minutos):',
    success: (provider: string, model: string, note: string) =>
      `✅ <b>¡Proveedor de IA Cambiado con Éxito!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Proveedor Activo: <b>${provider}</b>\n` +
      `• Modelo en Ejecución: <code>${model}</code>\n` +
      `${note}`,
    invalidOption: '❌ Selección inválida. Introduzca un número entre 1 y 9. Envíe /cancel para salir.',
    kvError: '❌ No se puede guardar la configuración: enlace MAIL_ROUTES_KV no encontrado.',
    tipSetKey: '💡 Consejo: Si este proveedor requiere API Key, envíe <code>/setkey ai &lt;su-clave&gt;</code>. Para cambiar modelo, use <code>/model</code>.',
  },

  modelCommand: {
    title: (provider: string) => `🧠 <b>【 Seleccionar Modelo para ${provider} 】</b>`,
    current: (model: string) => `Modelo Actual: <code>${model}</code>`,
    prompt: 'Responda con un número o escriba el nombre del modelo personalizado (válido por 5 minutos):',
    success: (model: string) =>
      `✅ <b>¡Modelo Actualizado con Éxito!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Modelo Activo: <code>${model}</code>`,
    invalidOption: '❌ Opción inválida. Envíe /cancel para salir.',
    kvError: '❌ No se puede guardar la configuración: enlace MAIL_ROUTES_KV no encontrado.',
  },

  langCommand: {
    selectPrompt:
      '🌐 <b>【 Configuración de Idioma / Language Settings 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Seleccione su idioma preferido para notificaciones y comandos en Telegram:\n' +
      'Please select your preferred language for notifications and commands:',
    currentLang: (name: string) => `\n📌 Idioma activo actualmente: <b>${name}</b>`,
    successAlert: (name: string) => `¡Idioma cambiado exitosamente a ${name}!`,
    successCard: (name: string) =>
      `✅ <b>¡Preferencia de idioma actualizada!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `El idioma del sistema ahora es: <b>${name}</b>\n` +
      `Las futuras tarjetas de correo entrante, alertas de seguridad y paneles de comandos se mostrarán en este idioma.\n\n` +
      `💡 <i>Envía /help para explorar todos los comandos en el idioma seleccionado.</i>`,
    invalidArg:
      '❌ <b>¡Código de idioma no válido!</b>\n' +
      'Idiomas disponibles: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ko-KR</code> (한국어), <code>pt-BR</code> (Português), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      'Ejemplo: <code>/lang es</code> o envía <code>/lang</code> para abrir el menú interactivo.',
  },

  startCommand: {
    title: '👋 <b>【 Pasarela de Correo cf-mail2tg-aibot 】</b>',
    subtitle: 'El bot de enrutamiento y análisis IA de Cloudflare está listo. Los correos se limpian, analizan y notifican en este chat.',
    statusSectionTitle: '📊 <b>Resumen de Estado:</b>',
    statusRunningLabel: 'Estado',
    statusRunningValue: 'En línea (Online)',
    statusEngineLabel: 'Motor de IA',
    statusForwardLabel: 'Reenvío',
    statusNoForward: 'Solo TG (No configurado)',
    statusAliasOn: 'Alias Gmail activos',
    statusAliasOff: 'Reenvío directo',
    statusDefenseLabel: 'Defensa Edge',
    statusDefenseValue: 'Sin adjuntos (550) · Límite 5MB',
    guideTip: 'Toca 【Ajustes】 para configurar todos los parámetros; 【Guía de uso】 para detalles; 【🌐 Idioma / Language】 para cambiar el idioma.',
    btnOpenMenu: '⚙️ Ajustes',
    btnGuide: '📖 Guía de uso',
  },

  usageGuide: {
    title: '📖 <b>【 Guía de Uso cf-mail2tg-aibot 】</b>',
    subtitle: 'Funciones básicas e instrucciones de configuración:',
    principlesTitle: '⚙️ <b>1. Flujo de Trabajo</b>',
    principlesContent:
      '• <b>Recepción</b>: Los correos al dominio son filtrados y estructurados mediante el script Worker.\n' +
      '• <b>Protección Básica</b>: Rechazo de correos &gt; 5MB y adjuntos de riesgo para frenar el spam.\n' +
      '• <b>Entrega Dual</b>: Envío del texto limpio y códigos a Telegram con reenvío paralelo a su buzón de respaldo.',
    tagsTitle: '🏷️ <b>2. Clasificación y Códigos OTP</b>',
    tagsContent:
      '• <b>Tipos de Correo</b>: <code>Verificación</code> · <code>Marketing</code> · <code>Seguridad</code> · <code>Facturas</code> · <code>Directo</code> · <code>Avisos</code>\n' +
      '• <b>Extracción de Códigos</b>: Identificación de códigos de registro y acceso fijados arriba para copiar al toque.\n' +
      '• <b>Autenticación</b>: Comprobación de registros SPF / DKIM / DMARC para validar el remitente.',
    antiSpamTitle: '🛡️ <b>3. Filtrado de Spam y Entrega Silenciosa</b>',
    antiSpamContent:
      '• <b>Filtrado por Reglas</b>: Correos con cabecera de baja (RFC 8058) o palabras clave pasan a Marketing.\n' +
      '• <b>Notificación Silenciosa</b>: El marketing no genera sonido y omite la llamada a la IA para ahorrar cuota.\n' +
      '• <b>Diccionario</b>: Ajustado al idioma configurado y ampliable con <code>/addkeywords</code>.',
    routesTitle: '📂 <b>4. Enrutamiento por Prefijo y Alias</b>',
    routesContent:
      '• <b>Prefijos</b>: Clasifica por prefijo (ej: <code>support@</code> ➜ Soporte, <code>admin@</code> ➜ Personal).\n' +
      '• <b>Alias de Correo</b>: Añade <code>+tag</code> al reenviar para facilitar filtros y carpetas en su buzón personal.',
    commandsTitle: '⚡ <b>5. Lista de Comandos</b>',
    commandsContent:
      '• <code>/start</code> - Resumen del gateway y accesos rápidos\n' +
      '• <code>/menu</code> - Panel de ajustes (⚙️ Ajustes)\n' +
      '• <code>/guide</code> - Ver esta guía de uso\n' +
      '• <code>/routes</code> - Gestionar reglas de prefijo y etiquetas\n' +
      '• <code>/keywords</code> - Gestionar palabras clave de bloqueo\n' +
      '• <code>/ai</code> - Cambiar proveedor y modelo de IA\n' +
      '• <code>/lang</code> - Cambiar idioma del sistema',
    footerTip: 'La mayoría de las acciones se realizan pulsando los botones inferiores.',
    btnBackStart: '🔙 Volver al Resumen',
    btnBackDashboard: '⚙️ Ajustes',
    btnViewDocs: '🌐 Ver Documentación Completa en GitHub',
  },

  helpCommand: {
    title: '📖 <b>【 cf-mail2tg-aibot Ayuda de comandos 】</b>',
    menuHint: 'Toca el botón <b>[Menu]</b> abajo a la izquierda o envía un comando:',
    keysSectionTitle: '🔑 <b>Comandos de estado y configuración:</b>',
    configDesc: '• <code>/config</code> - Ver estado del sistema y credenciales (enmascarado)',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;key&gt;</code> - Actualizar clave API de IA desde el móvil',
    setkeyForwardDesc: '• <code>/setkey forward &lt;email&gt;</code> - Actualizar correo de reenvío',
    resetkeyDesc: '• <code>/resetkey &lt;minimax|forward&gt;</code> - Restablecer claves dinámicas a valores por defecto',
    keywordsSectionTitle: '📋 <b>Palabras clave y filtro antispam:</b>',
    keywordsDesc: '• <code>/keywords</code> - Ver y copiar todas las palabras clave publicitarias',
    addkeywordsDesc: '• <code>/addkeywords</code> - Agregar palabras clave sin sobrescribir las existentes',
    resetkeywordsDesc: '• <code>/resetkeywords</code> - Restaurar palabras clave predeterminadas del sistema',
    routesSectionTitle: '🔀 <b>Enrutamiento de dominios y reglas:</b>',
    routesDesc: '• <code>/routes</code> - Ver todas las reglas activas de base y de KV',
    addDesc: '• <code>/add Etiqueta Prefijo [Destino]</code> - Añadir regla de enrutamiento',
    delDesc: '• <code>/del Prefijo</code> - Eliminar regla personalizada (con confirmación)',
    langSectionTitle: '🌐 <b>Internacionalización (i18n):</b>',
    langDesc: '• <code>/lang [código]</code> - Cambiar el idioma de los mensajes y tarjetas',
    setupSectionTitle: '🛠️ <b>Asistente de configuración:</b>',
    setupDesc: '• <code>/setup</code> - Iniciar asistente interactivo de 2 pasos',
    cancelDesc: '• <code>/cancel</code> - Cancelar la sesión interactiva en cualquier momento',
    footerTip: '💡 <i>Consejo: Puedes responder directamente a cualquier mensaje de palabras clave del Bot para editar.</i>',
  },

  configCommand: {
    title: '⚙️ <b>【 Ajustes y estado de claves 】</b>',
    llmTitle: '🤖 <b>Clasificación de correos por IA (MiniMax):</b>',
    llmReady: (source: string) => `  • Estado: ✅ Listo ${source}`,
    llmNotConfigured: '  • Estado: ⚪ No configurado (Usando detector local de expresiones regulares)',
    llmMaskedKey: (key: string) => `  • Clave API: <code>${key}</code>`,
    llmModel: (model: string) => `  • Modelo: <code>${model}</code>`,
    forwardTitle: '📥 <b>Reenvío de respaldo sin pérdidas:</b>',
    forwardTarget: (target: string, source: string) => `  • Buzón de destino: <code>${target}</code> ${source}`,
    forwardNotConfigured: '  • Buzón de destino: ⚪ No configurado (Modo solo notificación TG)',
    forwardAliasesActive: '  • Alias de Gmail: ✅ Activos (Enrutamiento automático +etiqueta)',
    forwardAliasesDisabled: '  • Alias de Gmail: ⚪ Desactivados (Directo al buzón principal)',
    kvTitle: '🗄️ <b>Base de datos KV (MAIL_ROUTES_KV):</b>',
    kvConnected: '  • Conexión: ✅ Conectada y operativa',
    kvNotConnected: '  • Conexión: ❌ No vinculada',
    kvKeywordsCount: (count: number) => `  • Palabras clave activas: <b>${count}</b>`,
    kvCustomRulesCount: (count: number) => `  • Reglas personalizadas: <b>${count}</b>`,
    securityTitle: '🛡️ <b>Políticas de seguridad de borde:</b>',
    securityBlockAll: '  • Política de adjuntos: 🔴 Bloquear todo (SMTP 550)',
    securityHighRiskOnly: '  • Política de adjuntos: 🟢 Bloquear solo extensiones peligrosas',
    securityMaxCap: (size: string) => `  • Límite de tamaño de correo: <b>${size}</b> (SMTP 552)`,
    securityMarketingPolicy: (policy: string) =>
      `  • Política para publicidad: <code>${policy === 'mute' ? 'No enviar a TG (mute)' : 'Notificación silenciosa (silent)'}</code>`,
    systemLangTitle: '🌐 <b>Idioma del sistema:</b>',
    systemLangDesc: (name: string, source: string) => `  • Idioma actual: <b>${name}</b> ${source}`,
    shortcutsTitle: '💡 <b>Comandos de actualización rápida:</b>',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - Actualizar clave de IA',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;correo&gt;</code> - Actualizar correo de respaldo',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - Borrar clave de IA en KV',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - Borrar correo en KV',
    shortcutLang: '• <code>/lang</code> - Cambiar idioma (10 idiomas compatibles)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【 Guía para actualizar credenciales 】</b>',
    helpUsage: '<b>Formato:</b> <code>/setkey &lt;tipo&gt; &lt;valor&gt;</code>',
    helpMinimax: '• <b>Actualizar clave de IA:</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>Actualizar correo de respaldo:</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>Los cambios se guardan en KV y se aplican en el edge al instante.</i>',
    kvError: '❌ <b>Error del sistema:</b> MAIL_ROUTES_KV no está vinculado.',
    successMinimax: (maskedKey: string) =>
      `✅ <b>¡Clave API de IA actualizada con éxito!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Nueva clave guardada en KV: <code>${maskedKey}</code>\n` +
      `Los futuros correos entrantes usarán esta clave para el análisis IA.`,
    successForward: (email: string) =>
      `✅ <b>¡Correo de reenvío actualizado con éxito!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Nueva dirección de destino: <code>${email}</code>\n` +
      `⚠️ <i>¡Asegúrese de que esta dirección esté verificada en Cloudflare Email Routing!</i>`,
    unsupportedType: (type: string) =>
      `❌ <b>Tipo de configuración no admitido:</b> 「<code>${type}</code>」\nTipos válidos: <code>minimax</code> o <code>forward</code>.`,
  },

  resetkeyCommand: {
    helpTitle: '💡 <b>【 Guía de comando para restablecer claves 】</b>',
    helpUsage: '<b>Formato:</b> <code>/resetkey &lt;minimax|forward&gt;</code>',
    helpDesc: 'Elimina la anulación en KV y vuelve a los valores predeterminados de las variables de entorno.',
    kvError: '❌ <b>Error del sistema:</b> MAIL_ROUTES_KV no está vinculado.',
    successReset: (subType: string) =>
      `🔄 <b>¡Configuración dinámica de ${subType} restablecida!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Se borró la clave en KV. El sistema ha vuelto a los valores por defecto.`,
  },

  keywordsCommand: {
    title: '📋 <b>【 Gestión de palabras clave para filtrar publicidad 】</b>',
    countDesc: (count: number) => `Palabras clave activas actualmente: <b>${count}</b>.`,
    instructions:
      '💡 <b>Cómo editar (Copiar, modificar y [Responder a este mensaje]):</b>\n' +
      '1. Toca el bloque de código abajo para copiar todas las palabras;\n' +
      '2. Selecciona <b>«Responder (Reply)»</b> a este mensaje (o envía <code>setkeywords ...</code>), pega y ajusta (<b>una palabra por línea</b>);\n' +
      '3. ¡Envía tu mensaje y los cambios se aplicarán en tiempo real!',
    emptyError:
      '❌ <b>Error de actualización:</b> No se detectaron palabras clave válidas.\nProporcione al menos una palabra clave (una por línea).',
    kvError: '❌ <b>Error del sistema:</b> MAIL_ROUTES_KV no está vinculado.',
    successUpdate: (count: number, preview: string, moreCount: string) =>
      `✅ <b>【 ¡Base de datos de palabras clave actualizada! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Se actualizaron <b>${count}</b> palabras clave en el edge.\n\n` +
      `📝 <b>Vista previa:</b>\n` +
      `<code>${preview}${moreCount}</code>\n\n` +
      `💡 <i>Los correos entrantes que coincidan con estas palabras o con encabezados RFC de baja se entregarán en silencio.</i>`,
    updateError: '❌ <b>Error de actualización:</b> Error al escribir en la base de datos KV.',
    addHelpTitle: '💡 <b>【 Agregar palabras clave sin sobrescribir 】</b>',
    addHelpUsage: '<b>Formato:</b> <code>/addkeywords palabra1\npalabra2</code>',
    addHelpDesc: 'Las palabras se desduplican y se combinan de forma segura. <b>Las existentes nunca se borrarán.</b>',
    successAppend: (addedCount: number, totalCount: number, preview: string) =>
      `✅ <b>【 Palabras clave agregadas con éxito 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Agregadas con éxito: <b>${addedCount}</b> palabras nuevas\n` +
      `• Total de palabras activas: <b>${totalCount}</b>\n` +
      `• La lista existente se ha conservado íntegramente.\n\n` +
      `📝 <b>Nuevos elementos:</b>\n` +
      `<code>${preview}</code>`,
    appendError: '❌ <b>Error al agregar:</b> Error al escribir en la base de datos.',
    resetSuccess: (count: number) =>
      `🔄 <b>【 Palabras clave restablecidas a los valores de fábrica 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Se restauraron las <b>${count}</b> palabras clave estándar predeterminadas.`,
  },

  routesCommand: {
    title: '📋 <b>【 Reglas activas de enrutamiento de correo 】</b>',
    presetBaselineTitle: '🔹 <b>Perfiles predeterminados del sistema:</b>',
    fallbackGeneric: '• <i>(Direcciones no coincidentes)</i> ➔ 🏷️ <b>General</b>',
    customRulesTitle: '🔸 <b>Reglas personalizadas dinámicas (en KV):</b>',
    noCustomRules: '<i>(No hay reglas personalizadas aún. Usa "add Personal xxx" para añadir)</i>',
    addHelpTitle: '💡 <b>【 Guía para añadir regla de enrutamiento 】</b>',
    addHelpUsage:
      '<b>Formato:</b> <code>add &lt;etiqueta&gt; &lt;prefijo&gt; [correo_reenvío]</code>\n\n' +
      '• <b>Etiquetas permitidas:</b> <code>Personal</code>, <code>General</code>, <code>Producto gratuito</code>, <code>Producto de pago</code>, <code>Soporte comercial</code>\n' +
      '• <b>Prefijo:</b> ej. <code>support</code> para <code>support@tu-dominio.com</code>\n' +
      '• <b>Correo:</b> Opcional. Por defecto usa el buzón principal.\n\n' +
      '<b>Ejemplos:</b>\n' +
      '• <code>add Personal blog</code>\n' +
      '• <code>add Soporte help user@domain.com</code>',
    addMissingPrefix:
      '❌ <b>Error:</b> Falta el parámetro del prefijo.\nFormato: <code>add &lt;etiqueta&gt; &lt;prefijo&gt; [correo]</code>',
    addInvalidTag: (allowed: string, input: string) =>
      `❌ <b>Error:</b> La etiqueta debe ser una de [${allowed}].\nIngresaste: 「<code>${input}</code>」.`,
    addInvalidPrefix: (prefix: string) =>
      `❌ <b>Error:</b> El prefijo 「<code>${prefix}</code>」 no es válido. Solo se admiten letras, números, puntos y guiones.`,
    addSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>¡Nueva regla de enrutamiento añadida!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Prefijo destino:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Etiqueta:</b> ${tag}\n` +
      `📥 <b>Destino de reenvío:</b> <code>${forward || '(Solo notificación en TG)'}</code>\n\n` +
      `💡 <i>Con Catch-all activado, los correos a este prefijo se enrutarán inmediatamente según esta regla.</i>`,
    delHelpTitle: '💡 <b>【 Guía para eliminar regla de enrutamiento 】</b>',
    delHelpUsage: '<b>Formato:</b> <code>del &lt;prefijo&gt;</code>\n<b>Ejemplo:</b> <code>del blog</code>',
    delNotFound: (prefix: string) =>
      `⚠️ <b>Regla no encontrada:</b> No existe ninguna regla para el prefijo <code>${prefix}</code> en KV.`,
    delConfirmPrompt: (prefix: string, tag: string, forward: string) =>
      `⚠️ <b>¿Confirmas la eliminación de esta regla?</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Prefijo:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Etiqueta actual:</b> ${tag}\n` +
      `📥 <b>Destino:</b> <code>${forward || '(Ninguno)'}</code>\n\n` +
      `⚠️ <i>¡Toca el botón abajo para confirmar. Se borrará permanentemente de KV!</i>`,
    delBtnConfirm: '🔴 Confirmar eliminación',
    delBtnCancel: '⚪ Cancelar',
    delAlertDeleted: 'Eliminado permanentemente de la base de datos',
    delAlertNotFound: 'Regla no encontrada',
    delSuccessText: (prefix: string) =>
      `🗑️ <b>¡Regla eliminada con éxito!</b>\n━━━━━━━━━━━━━━━━━━\nLa configuración para el prefijo <code>${prefix}</code> se ha borrado de KV.`,
    delNotFoundText: (prefix: string) =>
      `⚠️ <b>Error al eliminar:</b> No se encontró <code>${prefix}</code> en la base de datos.`,
    delAlertCancelled: 'Operación cancelada',
    delCancelledText: (prefix: string) =>
      `❌ <b>Operación cancelada</b>\n━━━━━━━━━━━━━━━━━━\nLa regla para el prefijo <code>${prefix}</code> se mantiene sin cambios.`,
  },

  setupCommand: {
    startWizardText:
      `🚀 <b>【 cf-mail2tg-aibot Asistente de Configuración (1/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `¡Bienvenido al asistente rápido! Vincularemos las credenciales clave en 2 pasos.\n` +
      `💡 <i>Envía <code>skip</code> para saltar el paso o <code>/cancel</code> para salir en cualquier momento.</i>\n\n` +
      `<b>Paso 1: Configurar correo de respaldo (Forward Email)</b>\n` +
      `Para reenviar correos entrantes de forma fiable a tu buzón principal (ej. Gmail).\n` +
      `⚠️ <i>¡Asegúrate de que la dirección esté verificada en Cloudflare Email Routing ➔ Destination addresses!</i>\n\n` +
      `👉 <b>Responde directamente con tu correo de destino</b> (ej. <code>yourname@gmail.com</code>), o envía <code>skip</code>:`,
    cancelSuccess:
      `❌ <b>Has salido del asistente de configuración</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `La sesión del asistente se ha restablecido. Puedes reiniciar cuando quieras con <code>/setup</code>.`,
    skipStep1Text:
      `⏭️ <b>Se ha omitido la configuración del correo de respaldo.</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot Asistente de Configuración (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Paso 2: Configurar clave API de IA MiniMax</b>\n` +
      `Usada para análisis IA (códigos, facturas, publicidad, alertas) y extracción automática de códigos.\n` +
      `💡 <i>Si no tienes clave aún, envía <code>skip</code> (se usará el detector local rápido por expresiones regulares).</i>\n\n` +
      `👉 <b>Responde directamente con tu clave API MiniMax</b>, o envía <code>skip</code>:`,
    formatErrorStep1: (input: string) =>
      `❌ <b>¡Formato de correo no válido!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Ingresaste: <code>${input}</code>\n` +
      `Introduce un formato válido (ejemplo: <code>mymail@gmail.com</code>), o envía <code>skip</code>:`,
    successStep1Text: (email: string) =>
      `✅ <b>¡Correo de respaldo vinculado con éxito!</b>\n` +
      `Dirección guardada: <code>${email}</code>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot Asistente de Configuración (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Paso 2: Configurar clave API de IA MiniMax</b>\n` +
      `Usada para análisis IA (códigos, facturas, publicidad, alertas) y extracción automática de códigos.\n` +
      `💡 <i>Si no tienes clave aún, envía <code>skip</code> (se usará el detector local rápido por expresiones regulares).</i>\n\n` +
      `👉 <b>Responde directamente con tu clave API MiniMax</b>, o envía <code>skip</code>:`,
    step2Card:
      `🚀 <b>【 cf-mail2tg-aibot Asistente de Configuración (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Paso 2: Configurar clave API de IA MiniMax</b>\n` +
      `Usada para análisis IA (códigos, facturas, publicidad, alertas) y extracción automática de códigos.\n` +
      `💡 <i>Si no tienes clave aún, envía <code>skip</code> (se usará el detector local rápido por expresiones regulares).</i>\n\n` +
      `👉 <b>Responde directamente con tu clave API MiniMax</b>, o envía <code>skip</code>:`,
    skipStep2Text: (fwdText: string, mmxText: string) =>
      `⏭️ <b>Se ha omitido la configuración de la clave de IA.</b>\n\n` +
      `🎉 <b>【 ¡Configuración completada con éxito! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Estado de los componentes principales:\n` +
      `• Correo de reenvío: ${fwdText}\n` +
      `• Análisis IA: ${mmxText}\n\n` +
      `💡 <b>Siguientes pasos:</b>\n` +
      `• Envía <code>/config</code> para revisar la configuración y claves\n` +
      `• Envía <code>/routes</code> para ver las reglas de enrutamiento activas\n` +
      `• Puedes actualizar las claves en cualquier momento con <code>/setkey</code>`,
    keyEmptyError:
      `❌ <b>¡La clave API no puede estar vacía!</b>\nResponde con una clave válida o envía <code>skip</code>:`,
    successStep2Text: (maskedKey: string, fwdText: string) =>
      `✅ <b>¡Clave API de IA vinculada con éxito!</b>\n` +
      `Guardada en KV: <code>${maskedKey}</code>\n\n` +
      `🎉 <b>【 ¡Proceso de configuración finalizado! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `¡Tu pasarela cf-mail2tg-aibot está totalmente lista!\n` +
      `• Correo de reenvío: ${fwdText}\n` +
      `• Análisis IA: ✅ Listo (<code>${maskedKey}</code>)\n\n` +
      `💡 <b>Siguientes pasos:</b>\n` +
      `• Envía <code>/config</code> para revisar el centro de control\n` +
      `• Envía <code>/routes</code> para gestionar reglas de dominios\n` +
      `• ¡Cualquier correo entrante será analizado por IA y notificado en tiempo real!`,
    kvRequiredError: `⚠️ <b>Error del sistema:</b> La base de datos MAIL_ROUTES_KV no está vinculada. No se puede iniciar el asistente.`,
    notConfiguredPureTg: '⚪ No configurado (modo solo TG)',
    notConfiguredRegexFallback: '⚪ No configurado (respaldo regex)',
    readyWithMask: (masked: string) => `✅ Listo (<code>${masked}</code>)`,
  },

  emailCard: {
    intentTags: {
      验证: 'Verificación',
      营销: 'Publicidad',
      告警: 'Alerta de Seguridad',
      账单: 'Facturación',
      业务: 'Negocios',
      通知: 'Notificación',
    },
    personaTags: {
      个人: 'Personal',
      客服: 'Atención al Cliente',
      商务: 'Negocios y Ventas',
      产品: 'Producto',
      通用: 'General',
      免费产品: 'Producto Gratuito',
      付费产品: 'Producto de Pago',
      商业支持: 'Soporte Comercial',
    },
    newEmailTitle: (intentTag: string, targetName: string) =>
      `<b>【Nuevo Correo · ${intentTag} · ${targetName}】</b>`,
    verificationCode: 'Código de verificación',
    copyHint: 'Toca para copiar',
    businessType: 'Tipo / Etiqueta',
    recipientDomain: 'Dominio receptor',
    targetEmail: 'Correo destino',
    senderFrom: 'Remitente',
    authSPFDKIMPass: '🛡️ <b>Autenticación:</b> <code>SPF Aprobado · DKIM Válido</code>',
    authSPFOnly: '🛡️ <b>Autenticación:</b> <code>SPF Aprobado · DKIM No verificado</code>',
    authDKIMOnly: '🛡️ <b>Autenticación:</b> <code>SPF No verificado · DKIM Válido</code>',
    authFailed: '🚨 <b>Autenticación:</b> <code>SPF/DKIM No superado (Posible falsificación)</code>',
    authUnknown: '🛡️ <b>Autenticación:</b> <code>Firma desconocida</code>',
    aiRfcUnsubShortCircuit: '🏷️ <b>Protocolo:</b> <code>Encabezado de baja RFC 8058 (Ahorro de llamada a IA)</code>',
    aiKeywordShortCircuit: (keyword: string) =>
      `🏷️ <b>Regla:</b> <code>Coincidencia con palabra clave [${keyword}] (Ahorro de llamada a IA)</code>`,
    aiMarketing: '🤖 <b>IA:</b> <code>Publicidad / Promoción (Entregado en silencio)</code>',
    aiVerification: '🤖 <b>IA:</b> <code>Código de verificación (Prioridad alta con sonido)</code>',
    aiSecurity: '🤖 <b>IA:</b> <code>Alerta de seguridad (Alerta urgente)</code>',
    aiBilling: '🤖 <b>IA:</b> <code>Factura o pago financiero (Con sonido)</code>',
    aiNotification: '🤖 <b>IA:</b> <code>Notificación del sistema (Alerta estándar)</code>',
    aiImportant: '🤖 <b>IA:</b> <code>Correo importante directo (Con sonido)</code>',
    aiErrorFallback: (detail: string) =>
      `🤖 <b>Estado IA:</b> <code>⚠️ Error en API de IA: ${detail} (Notificado con sonido)</code>`,
    aiRegexVerification: '🏷️ <b>Regla:</b> <code>Código de verificación detectado por patrón (Con sonido)</code>',
    subjectLabel: 'Asunto',
    noSubject: '(Sin asunto)',
    unknownSender: 'Remitente desconocido',
    attachmentsLabel: 'Archivos adjuntos',
    attachmentsSynced: 'Sincronizado al buzón de correo',
    attachmentsUnit: (count: number) => ` y otros (${count} archivos en total)`,
    unnamedAttachment: 'Archivo sin nombre',
    snippetLabel: 'Resumen del correo',
    noTextContent: '(Sin contenido de texto plano)',
    snippetFolded: (max: number) =>
      `... (Texto extenso plegado a ${max} caracteres; correo original completo sincronizado al buzón)`,
    backupStatusLabel: 'Estado del reenvío',
    backupSynced: (base: string, alias?: string) =>
      `<code>Sincronizado al buzón de respaldo (${base}${alias ? ` · ${alias}` : ''})</code>`,
    backupFailed: (error: string) => `<code>⚠️ Error de reenvío (${error})</code>`,
    backupPureTG: '<code>Sin buzón de respaldo (Modo solo Telegram)</code>',
    replyContactLabel: 'Responder a',
  },

  securityAlerts: {
    reasonLabel: 'Motivo',
    actionLabel: 'Acción de defensa',
    triggerLabel: 'Motivo del disparo',
    defenseStatusLabel: 'Estado de defensa',
    sizeCapTitle: 'Pasarela de Correo · Límite de Tamaño Excedido',
    sizeCapReason: (size: string, cap: string) =>
      `El tamaño del correo es <b>${size}</b>, superando el límite (${cap})`,
    sizeCapAction: 'Rechazado con SMTP 552. <b>No reenviado al buzón de respaldo (0 consumo de almacenamiento).</b>',
    sizeCapTip: 'Se recomienda al remitente usar enlaces de almacenamiento en la nube o GitHub.',
    attachmentTitle: 'Pasarela de Correo · Bloqueo por Política de Adjuntos',
    attachmentReason: 'Violación de la política de seguridad de archivos adjuntos',
    attachmentDetected: 'Adjuntos detectados',
    attachmentAction: 'Rechazado con SMTP 550. <b>No reenviado al buzón de respaldo (0 consumo de almacenamiento).</b>',
    rateLimitTitle: 'Pasarela de Correo · Advertencia de Límite de Frecuencia',
    rateLimitHighFreqSender: 'Remitente de alta frecuencia',
    rateLimitReason: 'La frecuencia de correos entrantes superó el umbral permitido',
    rateLimitStatusForwarded: (base: string, alias?: string) =>
      `Correo reenviado de forma segura al respaldo (<code>${base}</code>${alias ? ` · Alias <code>${alias}</code>` : ''})`,
    rateLimitStatusFailed: (error: string) => `⚠️ Error de reenvío: ${error}`,
    rateLimitStatusPureTG: 'Modo solo notificación TG (Sin buzón de respaldo)',
    rateLimitTip: 'Las notificaciones de Telegram para este remitente se han silenciado temporalmente para prevenir spam.',
  },

  sources: {
    kvOverride: '(Anulación en KV)',
    envDefault: '(Por defecto en Env)',
  },
};
