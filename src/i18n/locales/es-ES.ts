import type { TranslationDict } from '../types';

export const esES: TranslationDict = {
  langCode: 'es-ES',
  langName: 'Español',
  flag: '🇪🇸',

  commandDesc: {
    lang: 'Cambiar idioma / Switch language',
    setup: 'Asistente de configuración rápida (1 minuto paso a paso)',
    config: 'Ver credenciales, estado de rutas y centro de control',
    setkey: 'Actualizar claves API o correo: setkey <tipo> <valor>',
    resetkey: 'Restablecer claves dinámicas a valores predeterminados',
    cancel: 'Salir del asistente o de la sesión interactiva',
    keywords: 'Ver y copiar palabras clave de bloqueo publicitario',
    addkeywords: 'Agregar palabras clave de forma segura (sin sobrescribir)',
    resetkeywords: 'Restablecer palabras clave a la base predeterminada',
    routes: 'Ver reglas activas de enrutamiento y perfiles de dominio',
    add: 'Añadir regla personalizada: add <etiqueta> <prefijo> [correo]',
    del: 'Eliminar regla personalizada: del <prefijo>',
    help: 'Ver manual de operaciones y lista de comandos',
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
      'Idiomas disponibles: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      'Ejemplo: <code>/lang es</code> o envía <code>/lang</code> para abrir el menú interactivo.',
  },

  startCommand: {
    title: '👋 <b>【 cf-mail2tg-aibot Pasarela de correo lista 】</b>',
    stepGuideTitle: '⚡ <b>Guía de inicio rápido en 3 pasos:</b>',
    step1Title: '1️⃣ <b>Comprobar estado de la pasarela</b>',
    step1Desc: '   Envía <code>/config</code> para verificar IA, correo de respaldo y base de datos KV.',
    step2Title: '2️⃣ <b>Actualizar credenciales por Telegram (Opcional)</b>',
    step2Desc1: '   • Activar análisis IA y extracción de códigos: <code>/setkey minimax &lt;API_KEY&gt;</code>',
    step2Desc2: '   • Configurar/cambiar correo de respaldo: <code>/setkey forward &lt;correo&gt;</code>',
    step3Title: '3️⃣ <b>Configurar perfiles de dominio</b>',
    step3Desc1: '   • Ver reglas activas: <code>/routes</code>',
    step3Desc2: '   • Añadir regla personalizada: <code>/add Soporte help</code> (Soporta múltiples dominios)',
    shortcutsTitle: '💡 <b>Comandos rápidos habituales:</b>',
    shortcutSetup: '• <code>/setup</code> - Asistente interactivo de configuración paso a paso',
    shortcutConfig: '• <code>/config</code> - Ver configuración activa y claves ocultas',
    shortcutKeywords: '• <code>/keywords</code> - Gestionar palabras clave de spam (responder para editar)',
    shortcutLang: '• <code>/lang</code> - Cambiar idioma del sistema (8 idiomas disponibles)',
    shortcutHelp: '• <code>/help</code> - Ver panel de control completo y manual de parámetros',
    menuActivatedNote: '<i>El botón [Menu] inferior izquierdo está sincronizado. Tócalo cuando quieras.</i>',
  },

  helpCommand: {
    title: '🎛️ <b>【 cf-mail2tg-aibot Panel de Control Completo 】</b>',
    menuHint: 'Toca el botón <b>[Menu]</b> abajo a la izquierda o envía un comando:',
    keysSectionTitle: '🔑 <b>Credenciales y estado de la pasarela:</b>',
    configDesc: '• <code>/config</code> - Ver estado de claves y centro de control (enmascarado)',
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
    title: '🎛️ <b>【 cf-mail2tg-aibot Centro de Configuración y Claves 】</b>',
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
    shortcutLang: '• <code>/lang</code> - Cambiar idioma (8 idiomas soportados)',
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
