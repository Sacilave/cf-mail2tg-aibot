import type { TranslationDict } from '../types';

export const deDE: TranslationDict = {
  langCode: 'de-DE',
  langName: 'Deutsch',
  flag: '🇩🇪',

  commandDesc: {
    start: 'Statusübersicht anzeigen',
    menu: 'Einstellungen öffnen',
    guide: 'Ausführliche Anleitung',
    setup: 'Einrichtungsassistent starten',
    lang: 'Sprache wechseln (Switch language)',
    config: 'Systemstatus & Schlüsseldetails',
    provider: 'KI-Anbieter wechseln',
    model: 'KI-Modellversion wechseln',
    routes: 'Routen & Tags verwalten',
    keywords: 'Spamfilter-Wortliste anzeigen',
    addkeywords: 'Spam-Schlüsselwörter hinzufügen',
    resetkeywords: 'Spamfilter zurücksetzen',
    add: 'Regel hinzufügen (add <Tag> <Präfix>)',
    del: 'Regel löschen (del <Präfix>)',
    setkey: 'Key oder E-Mail setzen (setkey)',
    resetkey: 'Dynamischen Key zurücksetzen',
    cancel: 'Aktive Sitzung abbrechen',
    help: 'Befehlshandbuch anzeigen',
  },

  dashboard: {
    title: '⚙️ <b>【 Einstellungen 】</b>',
    desc: 'Tippen Sie auf die Schaltflächen, um KI-Modelle zu wechseln, Routing-Regeln zu verwalten, Spamfilter anzupassen oder die Sprache zu ändern:',
    btnAi: '🤖 KI-Modelle',
    btnRoutes: '📂 Routing',
    btnKeywords: '🚫 Spamfilter',
    btnForward: '📬 Weiterleitung',
    btnLang: '🌐 Sprache / Language',
    btnRefresh: '🔄 Aktualisieren',
    btnBackMain: '🔙 Hauptmenü',
    btnBackAi: '🔙 Zurück zu KI',
    btnBackRoutes: '🔙 Zurück zu Routing',
    btnManageModels: '🎯 Modell wechseln',
    btnSetKey: '🔑 API-Key setzen',
    btnSetAiKey: '🔑 API-Key setzen',
    btnResetAiKey: '🔄 API-Key löschen',
    btnAddRoute: '➕ Regel hinzufügen',
    btnTags: '🏷️ Tag-Verwaltung',
    btnAddKw: '➕ Wörter hinzufügen',
    btnSetForward: '📬 Postfach ändern',
    btnResetForward: '🗑️ Postfach löschen',
    btnSetup: '⚡ Einrichtungsassistent',
    btnCancel: '❌ Abbrechen',
    routesTitle: '📂 <b>【 Routing-Regeln & Personas 】</b>',
    routesSelectTagPrompt: 'Wählen Sie ein <b>Kategorie-Tag</b> für die neue Regel (Button antippen):',
    routesInputPrefixPrompt: (tag: string) =>
      `Ausgewähltes Kategorie-Tag: <b>【${tag}】</b>\n\n` +
      `Bitte antworten Sie mit dem <b>E-Mail-Präfix</b> (z. B. <code>vip</code> oder <code>support</code>):\n` +
      `<i>(💡 Für eine eigene Weiterleitung: Präfix E-Mail, z. B.: vip user@example.com)</i>`,
    routesAddSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>Routing-Regel erfolgreich hinzugefügt!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Präfix: <code>${prefix}</code>\n` +
      `• Kategorie: <b>${tag}</b>\n` +
      `• Ziel: <code>${forward}</code>`,
    routesDeletedSuccess: (prefix: string) => `✅ Routing-Regel für Präfix <code>${prefix}</code> erfolgreich gelöscht!`,
    tagsTitle: '🏷️ <b>【 Verwaltung benutzerdefinierter Tags 】</b>',
    tagsPrompt: 'Verwalten Sie hier eigene Kategorie-Tags für neue Routing-Regeln:',
    tagsEmpty: 'Keine benutzerdefinierten Tags vorhanden. Standard-Kategorien aktiv (Privat, Support, Business, Produkt, Allgemein).',
    tagsAddSuccess: (tag: string) => `✅ Tag hinzugefügt: <b>【${tag}】</b>!`,
    tagsDeleteSuccess: (tag: string) => `✅ Tag gelöscht: <b>【${tag}】</b>!`,
    tagsAddPrompt:
      '🏷️ <b>【 Neues Tag hinzufügen 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Senden Sie den gewünschten Tag-Namen (z. B. <code>Finanzen</code>, <code>Monitoring</code>, max. 10 Zeichen):',
    tagsInvalid: '❌ Ungültiger oder doppelter Tag-Name (1-10 Zeichen ohne Leerzeichen).',
    kwTitle: '🚫 <b>【 Schlüsselwörter für Marketing- und Spamfilter 】</b>',
    fwdTitle: '📬 <b>【 Weiterleitungs- und Backup-Einstellungen 】</b>',
    toastUpdated: 'Einstellungen aktualisiert!',
    toastCancelled: 'Vorgang abgebrochen',
  },

  providerCommand: {
    title: '🏢 <b>【 KI-Anbieter auswählen 】</b>',
    current: (provider: string, model: string) => `Aktueller Anbieter: <b>${provider}</b> (Modell: <code>${model}</code>)`,
    prompt: 'Antworten Sie mit der entsprechenden Ziffer (5 Minuten gültig):',
    success: (provider: string, model: string, note: string) =>
      `✅ <b>KI-Anbieter erfolgreich gewechselt!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Aktiver Anbieter: <b>${provider}</b>\n` +
      `• Ausgeführtes Modell: <code>${model}</code>\n` +
      `${note}`,
    invalidOption: '❌ Ungültige Auswahl. Bitte geben Sie eine Zahl zwischen 1 und 9 ein. Mit /cancel abbrechen.',
    kvError: '❌ Speichern fehlgeschlagen: MAIL_ROUTES_KV Namespace nicht gefunden.',
    tipSetKey: '💡 Tipp: Wenn dieser Anbieter einen API-Schlüssel benötigt, senden Sie <code>/setkey ai &lt;Schlüssel&gt;</code>. Zum Modellwechsel senden Sie <code>/model</code>.',
  },

  modelCommand: {
    title: (provider: string) => `🧠 <b>【 Modell für ${provider} auswählen 】</b>`,
    current: (model: string) => `Aktuelles Modell: <code>${model}</code>`,
    prompt: 'Antworten Sie mit einer Ziffer oder einem benutzerdefinierten Modellnamen (5 Minuten gültig):',
    success: (model: string) =>
      `✅ <b>Modell erfolgreich aktualisiert!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Aktives Modell: <code>${model}</code>`,
    invalidOption: '❌ Ungültige Option. Senden Sie /cancel zum Abbrechen.',
    kvError: '❌ Speichern fehlgeschlagen: MAIL_ROUTES_KV Namespace nicht gefunden.',
  },

  langCommand: {
    selectPrompt:
      '🌐 <b>【 Spracheinstellungen / Language Settings 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Bitte wählen Sie Ihre bevorzugte Sprache für Benachrichtigungen und Befehle:\n' +
      'Please select your preferred language for notifications and commands:',
    currentLang: (name: string) => `\n📌 Aktuell aktive Sprache: <b>${name}</b>`,
    successAlert: (name: string) => `Sprache erfolgreich auf ${name} umgestellt!`,
    successCard: (name: string) =>
      `✅ <b>Spracheinstellung aktualisiert!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Die Systemsprache ist jetzt auf: <b>${name}</b> eingestellt.\n` +
      `Künftige E-Mail-Karten, Sicherheitswarnungen und Befehle werden in dieser Sprache dargestellt.\n\n` +
      `💡 <i>Senden Sie /help, um alle Befehle in der gewählten Sprache zu erkunden.</i>`,
    invalidArg:
      '❌ <b>Ungültiger Sprachcode!</b>\n' +
      'Verfügbare Sprachen: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      'Beispiel: <code>/lang de</code> oder senden Sie <code>/lang</code> für das Menü.',
  },

  startCommand: {
    title: '👋 <b>【 cf-mail2tg-aibot E-Mail-Gateway 】</b>',
    subtitle: 'Der Cloudflare E-Mail- und KI-Analyse-Bot ist aktiv. E-Mails werden sicher verarbeitet und an diesen Chat gesendet.',
    statusSectionTitle: '📊 <b>Gateway-Statusübersicht:</b>',
    statusRunningLabel: 'Status',
    statusRunningValue: 'Online',
    statusEngineLabel: 'KI-Engine',
    statusForwardLabel: 'Weiterleitung',
    statusNoForward: 'Nur-TG-Modus (Nicht konfiguriert)',
    statusAliasOn: 'Gmail-Aliase aktiv',
    statusAliasOff: 'Direktweiterleitung',
    statusDefenseLabel: 'Edge-Schutz',
    statusDefenseValue: 'Keine Anhänge (550) · 5MB Limit',
    guideTip: 'Tippen Sie auf 【Einstellungen】 zum Konfigurieren; 【Anleitung】 für Details; 【🌐 Sprache / Language】 zum Ändern der Sprache.',
    btnOpenMenu: '⚙️ Einstellungen',
    btnGuide: '📖 Anleitung',
  },

  usageGuide: {
    title: '📖 <b>【 cf-mail2tg-aibot Benutzerhandbuch 】</b>',
    subtitle: 'Grundlegende Funktionen und Konfiguration:',
    principlesTitle: '⚙️ <b>1. Funktionsablauf</b>',
    principlesContent:
      '• <b>E-Mail-Eingang</b>: E-Mails an Ihre Domain werden vom Worker-Skript empfangen und strukturiert verarbeitet.\n' +
      '• <b>Basisschutz</b>: Weist E-Mails &gt; 5 MB und riskante Dateianhänge ab, um Spamfluten zu verhindern.\n' +
      '• <b>Duale Zustellung</b>: Sendet Text und Codes an Telegram und leitet die Originalnachricht an das Backup-Postfach weiter.',
    tagsTitle: '🏷️ <b>2. E-Mail-Kategorien & OTP-Codes</b>',
    tagsContent:
      '• <b>Kategorietypen</b>: <code>Verifizierung</code> · <code>Marketing</code> · <code>Sicherheit</code> · <code>Rechnung</code> · <code>Direkt</code> · <code>Benachrichtigung</code>\n' +
      '• <b>Code-Erkennung</b>: Erkennt Anmeldecodes automatisch und platziert sie zum einfachen Kopieren ganz oben.\n' +
      '• <b>Absenderprüfung</b>: Prüft SPF / DKIM / DMARC-Einträge zur Feststellung der Absender-Authentizität.',
    antiSpamTitle: '🛡️ <b>3. Spamfilterung & Stumme Zustellung</b>',
    antiSpamContent:
      '• <b>Regelbasierte Filterung</b>: E-Mails mit Abmelde-Header (RFC 8058) oder Schlüsselwort-Treffern werden als Marketing eingestuft.\n' +
      '• <b>Stumme Benachrichtigung</b>: Marketing-Mails erfolgen ohne Ton und rufen kein KI-Modell auf, um Kontingente zu schonen.\n' +
      '• <b>Wortliste</b>: Entspricht der eingestellten Systemsprache und kann via <code>/addkeywords</code> erweitert werden.',
    routesTitle: '📂 <b>4. Präfix-Routing & Aliase</b>',
    routesContent:
      '• <b>Präfix-Zuweisung</b>: Sortiert E-Mails nach Absenderadresse (z. B. <code>support@</code> ➜ Support, <code>admin@</code> ➜ Privat).\n' +
      '• <b>Postfach-Aliase</b>: Hängt beim Weiterleiten automatisch <code>+tag</code> an, um Filterregeln im Postfach zu unterstützen.',
    commandsTitle: '⚡ <b>5. Befehlsübersicht</b>',
    commandsContent:
      '• <code>/start</code> - Gateway-Status & Schnellzugriff\n' +
      '• <code>/menu</code> - Einstellungen öffnen (⚙️ Einstellungen)\n' +
      '• <code>/guide</code> - Benutzerhandbuch ansehen\n' +
      '• <code>/routes</code> - Präfix-Routen & eigene Tags verwalten\n' +
      '• <code>/keywords</code> - Spam-Schlüsselwörter verwalten\n' +
      '• <code>/ai</code> - KI-Anbieter & Modell wechseln\n' +
      '• <code>/lang</code> - Systemsprache ändern',
    footerTip: 'Die meisten Aktionen können bequem über die Buttons unten ausgeführt werden.',
    btnBackStart: '🔙 Zur Übersicht',
    btnBackDashboard: '⚙️ Einstellungen',
    btnViewDocs: '🌐 Ausführliche Dokumentation auf GitHub',
  },

  helpCommand: {
    title: '📖 <b>【 cf-mail2tg-aibot Befehlshilfe 】</b>',
    menuHint: 'Tippen Sie auf <b>[Menu]</b> unten links oder senden Sie einen Befehl:',
    keysSectionTitle: '🔑 <b>Status- und Konfigurationsbefehle:</b>',
    configDesc: '• <code>/config</code> - Systemstatus und Schlüsseldetails anzeigen (maskiert)',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;key&gt;</code> - KI-Schlüssel am Smartphone aktualisieren',
    setkeyForwardDesc: '• <code>/setkey forward &lt;email&gt;</code> - Weiterleitungspostfach aktualisieren',
    resetkeyDesc: '• <code>/resetkey &lt;minimax|forward&gt;</code> - Dynamische Schlüssel überschreiben und zurücksetzen',
    keywordsSectionTitle: '📋 <b>Marketing-Schlüsselwörter und Spam-Schutz:</b>',
    keywordsDesc: '• <code>/keywords</code> - Alle Marketing-Filterwörter anzeigen und kopieren',
    addkeywordsDesc: '• <code>/addkeywords</code> - Schlüsselwörter sicher anhängen ohne Überschreiben',
    resetkeywordsDesc: '• <code>/resetkeywords</code> - Standardmäßige System-Schlüsselwörter wiederherstellen',
    routesSectionTitle: '🔀 <b>Domain-Routing und Persona-Regeln:</b>',
    routesDesc: '• <code>/routes</code> - Alle aktiven Basis- und KV-Routing-Regeln anzeigen',
    addDesc: '• <code>/add Tag Präfix [Ziel]</code> - E-Mail-Adressen-Routing-Regel hinzufügen',
    delDesc: '• <code>/del Präfix</code> - Benutzerdefinierte Regel löschen (mit Bestätigung)',
    langSectionTitle: '🌐 <b>Internationalisierung (i18n):</b>',
    langDesc: '• <code>/lang [Code]</code> - Sprache für Bot-Nachrichten und E-Mail-Karten umschalten',
    setupSectionTitle: '🛠️ <b>Konfigurations-Assistent:</b>',
    setupDesc: '• <code>/setup</code> - Interaktiven 2-Schritt-Einrichtungsassistenten starten',
    cancelDesc: '• <code>/cancel</code> - Aktive Sitzung oder Assistenten jederzeit beenden',
    footerTip: '💡 <i>Tipp: Sie können direkt auf Schlüsselwort-Nachrichten des Bots antworten, um sie zu bearbeiten.</i>',
  },

  configCommand: {
    title: '⚙️ <b>【 Einstellungen & Schlüsselstatus 】</b>',
    llmTitle: '🤖 <b>KI-E-Mail-Klassifizierung (MiniMax):</b>',
    llmReady: (source: string) => `  • Status: ✅ Bereit ${source}`,
    llmNotConfigured: '  • Status: ⚪ Nicht konfiguriert (Lokale Regex-Erkennung aktiv)',
    llmMaskedKey: (key: string) => `  • Maskierter Schlüssel: <code>${key}</code>`,
    llmModel: (model: string) => `  • Modell: <code>${model}</code>`,
    forwardTitle: '📥 <b>Verlustfreie Weiterleitung (Forward):</b>',
    forwardTarget: (target: string, source: string) => `  • Ziel-Postfach: <code>${target}</code> ${source}`,
    forwardNotConfigured: '  • Ziel-Postfach: ⚪ Nicht konfiguriert (Reiner Telegram-Modus)',
    forwardAliasesActive: '  • Gmail-Aliasse: ✅ Aktiv (Automatische +Tag-Zustellung)',
    forwardAliasesDisabled: '  • Gmail-Aliasse: ⚪ Deaktiviert (Direkt ins Hauptpostfach)',
    kvTitle: '🗄️ <b>KV-Datenbank (MAIL_ROUTES_KV):</b>',
    kvConnected: '  • Verbindung: ✅ Verbunden und aktiv',
    kvNotConnected: '  • Verbindung: ❌ Nicht gebunden',
    kvKeywordsCount: (count: number) => `  • Aktive Marketing-Schlüsselwörter: <b>${count}</b>`,
    kvCustomRulesCount: (count: number) => `  • Benutzerdefinierte Regeln: <b>${count}</b>`,
    securityTitle: '🛡️ <b>Edge-Sicherheit und Schutzrichtlinien:</b>',
    securityBlockAll: '  • Anhang-Richtlinie: 🔴 Alle blockieren (SMTP 550)',
    securityHighRiskOnly: '  • Anhang-Richtlinie: 🟢 Nur gefährliche Dateiendungen blockieren',
    securityMaxCap: (size: string) => `  • Maximale E-Mail-Größe: <b>${size}</b> (SMTP 552)`,
    securityMarketingPolicy: (policy: string) =>
      `  • Marketing-Richtlinie: <code>${policy === 'mute' ? 'Nicht an TG senden (mute)' : 'Stumm schalten (silent)'}</code>`,
    systemLangTitle: '🌐 <b>Systemsprache:</b>',
    systemLangDesc: (name: string, source: string) => `  • Aktuelle Sprache: <b>${name}</b> ${source}`,
    shortcutsTitle: '💡 <b>Schnellbefehle:</b>',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - KI-Schlüssel aktualisieren',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;email&gt;</code> - Backup-Postfach aktualisieren',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - KI-Schlüssel-Überschreibung löschen',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - Postfach-Überschreibung löschen',
    shortcutLang: '• <code>/lang</code> - Sprache wechseln (8 Sprachen unterstützt)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【 Anleitung zur Schlüssel-Aktualisierung 】</b>',
    helpUsage: '<b>Format:</b> <code>/setkey &lt;Typ&gt; &lt;Wert&gt;</code>',
    helpMinimax: '• <b>KI-API-Schlüssel aktualisieren:</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>Backup-Weiterleitungspostfach aktualisieren:</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>Änderungen werden sofort in KV gespeichert und am Edge wirksam.</i>',
    kvError: '❌ <b>Systemfehler:</b> MAIL_ROUTES_KV ist nicht gebunden.',
    successMinimax: (maskedKey: string) =>
      `✅ <b>KI-API-Schlüssel erfolgreich aktualisiert!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Neuer Schlüssel in KV gespeichert: <code>${maskedKey}</code>\n` +
      `Künftige E-Mails werden mit diesem Schlüssel analysiert.`,
    successForward: (email: string) =>
      `✅ <b>Backup-Postfach erfolgreich aktualisiert!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Neue Zieladresse: <code>${email}</code>\n` +
      `⚠️ <i>Stellen Sie sicher, dass diese Adresse in Cloudflare Email Routing verifiziert ist!</i>`,
    unsupportedType: (type: string) =>
      `❌ <b>Nicht unterstützter Typ:</b> 「<code>${type}</code>」\nGültig: <code>minimax</code> oder <code>forward</code>.`,
  },

  resetkeyCommand: {
    helpTitle: '💡 <b>【 Schlüssel zurücksetzen 】</b>',
    helpUsage: '<b>Format:</b> <code>/resetkey &lt;minimax|forward&gt;</code>',
    helpDesc: 'Löscht die dynamische KV-Überschreibung und fällt auf die Umgebungsvariablen zurück.',
    kvError: '❌ <b>Systemfehler:</b> MAIL_ROUTES_KV ist nicht gebunden.',
    successReset: (subType: string) =>
      `🔄 <b>Dynamische Konfiguration für ${subType} zurückgesetzt!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `KV-Eintrag gelöscht. Das System nutzt wieder die Standardwerte der Umgebungsvariablen.`,
  },

  keywordsCommand: {
    title: '📋 <b>【 Verwaltung von Marketing-Schlüsselwörtern 】</b>',
    countDesc: (count: number) => `Aktuell aktive Schlüsselwörter: <b>${count}</b>.`,
    instructions:
      '💡 <b>Bearbeitung (Kopieren, anpassen und [Auf diese Nachricht antworten]):</b>\n' +
      '1. Auf den Codeblock unten tippen, um alle Wörter zu kopieren;\n' +
      '2. <b>«Antworten (Reply)»</b> auf diese Nachricht wählen (oder <code>setkeywords ...</code> senden), einfügen und anpassen (<b>ein Wort pro Zeile</b>);\n' +
      '3. Antwort senden – Änderungen sind weltweit in Echtzeit aktiv!',
    emptyError:
      '❌ <b>Aktualisierung fehlgeschlagen:</b> Keine gültigen Schlüsselwörter gefunden.\nBitte mindestens ein Wort angeben (eines pro Zeile).',
    kvError: '❌ <b>Systemfehler:</b> MAIL_ROUTES_KV ist nicht gebunden.',
    successUpdate: (count: number, preview: string, moreCount: string) =>
      `✅ <b>【 Schlüsselwörter erfolgreich aktualisiert! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>${count}</b> Marketing-Schlüsselwörter global am Edge gespeichert.\n\n` +
      `📝 <b>Vorschau:</b>\n` +
      `<code>${preview}${moreCount}</code>\n\n` +
      `💡 <i>E-Mails, die diesen Wörtern oder RFC-Abmelde-Headern entsprechen, werden stumm zugestellt.</i>`,
    updateError: '❌ <b>Aktualisierung fehlgeschlagen:</b> Fehler beim Speichern in KV.',
    addHelpTitle: '💡 <b>【 Schlüsselwörter sicher anhängen 】</b>',
    addHelpUsage: '<b>Format:</b> <code>/addkeywords wort1\nwort2</code>',
    addHelpDesc: 'Wörter werden dedupliziert und sicher zusammengeführt. <b>Bestehende Wörter werden nicht überschrieben.</b>',
    successAppend: (addedCount: number, totalCount: number, preview: string) =>
      `✅ <b>【 Schlüsselwörter erfolgreich hinzugefügt 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Neu hinzugefügt: <b>${addedCount}</b> Wörter (Duplikate entfernt)\n` +
      `• Gesamtzahl aktiv: <b>${totalCount}</b> Wörter\n` +
      `• Bestehende Liste sicher beibehalten.\n\n` +
      `📝 <b>Hinzugefügte Elemente:</b>\n` +
      `<code>${preview}</code>`,
    appendError: '❌ <b>Hinzufügen fehlgeschlagen:</b> Fehler beim Schreiben in die Datenbank.',
    resetSuccess: (count: number) =>
      `🔄 <b>【 Schlüsselwörter auf Standardwerte zurückgesetzt 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Die <b>${count}</b> standardmäßigen zweisprachigen Filterwörter wurden wiederhergestellt.`,
  },

  routesCommand: {
    title: '📋 <b>【 Aktive E-Mail-Routing-Regeln 】</b>',
    presetBaselineTitle: '🔹 <b>Standardmäßige System-Personas:</b>',
    fallbackGeneric: '• <i>(Nicht zugeordnete Adressen)</i> ➔ 🏷️ <b>Allgemein</b>',
    customRulesTitle: '🔸 <b>Dynamische benutzerdefinierte Regeln (in KV):</b>',
    noCustomRules: '<i>(Noch keine Regeln vorhanden. Verwenden Sie "add Persönlich xxx" zum Hinzufügen)</i>',
    addHelpTitle: '💡 <b>【 Anleitung zum Hinzufügen einer Routing-Regel 】</b>',
    addHelpUsage:
      '<b>Format:</b> <code>add &lt;Tag&gt; &lt;Präfix&gt; [Ziel_E-Mail]</code>\n\n' +
      '• <b>Erlaubte Tags:</b> <code>Persönlich</code>, <code>Allgemein</code>, <code>Kostenloses Produkt</code>, <code>Kostenpflichtiges Produkt</code>, <code>Kommerzieller Support</code>\n' +
      '• <b>Präfix:</b> z. B. <code>support</code> für <code>support@ihre-domain.de</code>\n' +
      '• <b>Ziel-E-Mail:</b> Optional. Nutzt standardmäßig das Hauptpostfach.\n\n' +
      '<b>Beispiele:</b>\n' +
      '• <code>add Persönlich blog</code>\n' +
      '• <code>add Support help user@domain.com</code>',
    addMissingPrefix:
      '❌ <b>Fehler beim Hinzufügen:</b> Präfix-Parameter fehlt.\nFormat: <code>add &lt;Tag&gt; &lt;Präfix&gt; [E-Mail]</code>',
    addInvalidTag: (allowed: string, input: string) =>
      `❌ <b>Fehler beim Hinzufügen:</b> Tag muss eines von [${allowed}] sein.\nEingegeben: 「<code>${input}</code>」.`,
    addInvalidPrefix: (prefix: string) =>
      `❌ <b>Fehler beim Hinzufügen:</b> Präfix 「<code>${prefix}</code>」 ist ungültig. Nur Buchstaben, Ziffern, Punkte und Bindestriche erlaubt.`,
    addSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>Neue Routing-Regel erfolgreich hinzugefügt!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Ziel-Präfix:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Tag:</b> ${tag}\n` +
      `📥 <b>Weiterleitungsziel:</b> <code>${forward || '(Reiner TG-Modus)'}</code>\n\n` +
      `💡 <i>Bei aktivem Catch-all werden E-Mails an dieses Präfix ab sofort nach dieser Regel zugestellt.</i>`,
    delHelpTitle: '💡 <b>【 Anleitung zum Löschen einer Regel 】</b>',
    delHelpUsage: '<b>Format:</b> <code>del &lt;Präfix&gt;</code>\n<b>Beispiel:</b> <code>del blog</code>',
    delNotFound: (prefix: string) =>
      `⚠️ <b>Regel nicht gefunden:</b> Keine Regel für Präfix <code>${prefix}</code> in KV gefunden.`,
    delConfirmPrompt: (prefix: string, tag: string, forward: string) =>
      `⚠️ <b>Möchten Sie diese Regel wirklich löschen?</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Präfix:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Aktueller Tag:</b> ${tag}\n` +
      `📥 <b>Ziel:</b> <code>${forward || '(Keines)'}</code>\n\n` +
      `⚠️ <i>Tippen Sie unten auf Bestätigen. Die Regel wird endgültig aus KV entfernt!</i>`,
    delBtnConfirm: '🔴 Löschen bestätigen',
    delBtnCancel: '⚪ Abbrechen',
    delAlertDeleted: 'Dauerhaft aus der Datenbank gelöscht',
    delAlertNotFound: 'Regel nicht gefunden',
    delSuccessText: (prefix: string) =>
      `🗑️ <b>Regel erfolgreich gelöscht!</b>\n━━━━━━━━━━━━━━━━━━\nDie Routing-Regel für <code>${prefix}</code> wurde vollständig aus KV entfernt.`,
    delNotFoundText: (prefix: string) =>
      `⚠️ <b>Löschen fehlgeschlagen:</b> <code>${prefix}</code> nicht in der Datenbank gefunden.`,
    delAlertCancelled: 'Aktion abgebrochen',
    delCancelledText: (prefix: string) =>
      `❌ <b>Aktion abgebrochen</b>\n━━━━━━━━━━━━━━━━━━\nDie Regel für Präfix <code>${prefix}</code> bleibt unverändert.`,
  },

  setupCommand: {
    startWizardText:
      `🚀 <b>【 cf-mail2tg-aibot Einrichtungsassistent (1/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Willkommen beim Einrichtungsassistenten! Wir richten Ihre Daten in 2 Schritten ein.\n` +
      `💡 <i>Geben Sie <code>skip</code> ein zum Überspringen oder <code>/cancel</code> zum Beenden.</i>\n\n` +
      `<b>Schritt 1: Backup-Weiterleitungspostfach konfigurieren (Forward Email)</b>\n` +
      `Leitet eingehende E-Mails verlustfrei an Ihr primäres Postfach (z. B. Gmail) weiter.\n` +
      `⚠️ <i>Stellen Sie sicher, dass die Adresse unter Cloudflare Email Routing ➔ Destination addresses verifiziert ist!</i>\n\n` +
      `👉 <b>Bitte antworten Sie direkt mit Ihrer E-Mail-Adresse</b> (z. B. <code>yourname@gmail.com</code>), oder <code>skip</code>:`,
    cancelSuccess:
      `❌ <b>Einrichtungsassistent beendet</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Die Sitzung wurde zurückgesetzt. Sie können jederzeit mit <code>/setup</code> neu beginnen.`,
    skipStep1Text:
      `⏭️ <b>Konfiguration des Backup-Postfachs übersprungen.</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot Einrichtungsassistent (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Schritt 2: MiniMax KI-API-Schlüssel konfigurieren</b>\n` +
      `Dient zur KI-Analyse (Codes, Rechnungen, Marketing, Warnungen) und Code-Extraktion.\n` +
      `💡 <i>Falls noch nicht vorhanden, <code>skip</code> eingeben (lokale Regex-Erkennung wird genutzt).</i>\n\n` +
      `👉 <b>Bitte antworten Sie direkt mit Ihrem MiniMax API Key</b>, oder <code>skip</code>:`,
    formatErrorStep1: (input: string) =>
      `❌ <b>Ungültiges E-Mail-Format!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Eingegeben: <code>${input}</code>\n` +
      `Bitte ein gültiges E-Mail-Format eingeben (z. B.: <code>mymail@gmail.com</code>), oder <code>skip</code>:`,
    successStep1Text: (email: string) =>
      `✅ <b>Backup-Postfach erfolgreich verknüpft!</b>\n` +
      `Gespeicherte Adresse: <code>${email}</code>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot Einrichtungsassistent (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Schritt 2: MiniMax KI-API-Schlüssel konfigurieren</b>\n` +
      `Dient zur KI-Analyse (Codes, Rechnungen, Marketing, Warnungen) und Code-Extraktion.\n` +
      `💡 <i>Falls noch nicht vorhanden, <code>skip</code> eingeben (lokale Regex-Erkennung wird genutzt).</i>\n\n` +
      `👉 <b>Bitte antworten Sie direkt mit Ihrem MiniMax API Key</b>, oder <code>skip</code>:`,
    step2Card:
      `🚀 <b>【 cf-mail2tg-aibot Einrichtungsassistent (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Schritt 2: MiniMax KI-API-Schlüssel konfigurieren</b>\n` +
      `Dient zur KI-Analyse (Codes, Rechnungen, Marketing, Warnungen) und Code-Extraktion.\n` +
      `💡 <i>Falls noch nicht vorhanden, <code>skip</code> eingeben (lokale Regex-Erkennung wird genutzt).</i>\n\n` +
      `👉 <b>Bitte antworten Sie direkt mit Ihrem MiniMax API Key</b>, oder <code>skip</code>:`,
    skipStep2Text: (fwdText: string, mmxText: string) =>
      `⏭️ <b>Konfiguration des KI-Schlüssels übersprungen.</b>\n\n` +
      `🎉 <b>【 Einrichtung erfolgreich abgeschlossen! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Status der Kernkomponenten:\n` +
      `• Backup-Postfach: ${fwdText}\n` +
      `• KI-E-Mail-Analyse: ${mmxText}\n\n` +
      `💡 <b>Nächste Schritte:</b>\n` +
      `• Senden Sie <code>/config</code> zur Prüfung der Konfiguration und Schlüssel\n` +
      `• Senden Sie <code>/routes</code> zum Verwalten von Domain-Regeln\n` +
      `• Mit <code>/setkey</code> können Sie Schlüssel jederzeit aktualisieren`,
    keyEmptyError:
      `❌ <b>API-Schlüssel darf nicht leer sein!</b>\nBitte mit einem gültigen Schlüssel antworten oder <code>skip</code> senden:`,
    successStep2Text: (maskedKey: string, fwdText: string) =>
      `✅ <b>KI-API-Schlüssel erfolgreich gespeichert!</b>\n` +
      `In KV gesichert: <code>${maskedKey}</code>\n\n` +
      `🎉 <b>【 Einrichtung vollständig abgeschlossen! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Ihr cf-mail2tg-aibot E-Mail-Gateway ist voll einsatzbereit!\n` +
      `• Backup-Postfach: ${fwdText}\n` +
      `• KI-E-Mail-Analyse: ✅ Bereit (<code>${maskedKey}</code>)\n\n` +
      `💡 <b>Nächste Schritte:</b>\n` +
      `• Senden Sie <code>/config</code> für das Kontrollzentrum\n` +
      `• Senden Sie <code>/routes</code> für Domain-Regeln\n` +
      `• Eingehende E-Mails werden automatisch per KI analysiert und zugestellt!`,
    kvRequiredError: `⚠️ <b>Systemfehler:</b> Die Datenbank MAIL_ROUTES_KV ist nicht gebunden. Assistent kann nicht gestartet werden.`,
    notConfiguredPureTg: '⚪ Nicht konfiguriert (reiner TG-Modus)',
    notConfiguredRegexFallback: '⚪ Nicht konfiguriert (Regex-Fallback)',
    readyWithMask: (masked: string) => `✅ Bereit (<code>${masked}</code>)`,
  },

  emailCard: {
    intentTags: {
      验证: 'Verifizierung',
      营销: 'Marketing',
      告警: 'Sicherheitswarnung',
      账单: 'Rechnung/Zahlung',
      业务: 'Geschäftlich',
      通知: 'Benachrichtigung',
    },
    personaTags: {
      个人: 'Persönlich',
      客服: 'Kundenservice',
      商务: 'Geschäft & Vertrieb',
      产品: 'Produkt',
      通用: 'Allgemein',
      免费产品: 'Kostenloses Produkt',
      付费产品: 'Kostenpflichtiges Produkt',
      商业支持: 'Kommerzieller Support',
    },
    newEmailTitle: (intentTag: string, targetName: string) =>
      `<b>【Neue E-Mail · ${intentTag} · ${targetName}】</b>`,
    verificationCode: 'Bestätigungscode',
    copyHint: 'Tippen zum Kopieren',
    businessType: 'Kategorie/Typ',
    recipientDomain: 'Empfänger-Domain',
    targetEmail: 'Ziel-Postfach',
    senderFrom: 'Absender',
    authSPFDKIMPass: '🛡️ <b>Authentifizierung:</b> <code>SPF Bestanden · DKIM Gültig</code>',
    authSPFOnly: '🛡️ <b>Authentifizierung:</b> <code>SPF Bestanden · DKIM Nicht geprüft</code>',
    authDKIMOnly: '🛡️ <b>Authentifizierung:</b> <code>SPF Nicht geprüft · DKIM Gültig</code>',
    authFailed: '🚨 <b>Authentifizierung:</b> <code>SPF/DKIM Nicht bestanden (Mögliche Fälschung)</code>',
    authUnknown: '🛡️ <b>Authentifizierung:</b> <code>Unbekannte Signatur</code>',
    aiRfcUnsubShortCircuit: '🏷️ <b>Protokoll:</b> <code>RFC 8058 Abmelde-Header erkannt (KI übersprungen)</code>',
    aiKeywordShortCircuit: (keyword: string) =>
      `🏷️ <b>Filter:</b> <code>Schlüsselwort-Treffer [${keyword}] (KI übersprungen)</code>`,
    aiMarketing: '🤖 <b>KI-Analyse:</b> <code>Marketing / Werbung (Lautlos zugestellt)</code>',
    aiVerification: '🤖 <b>KI-Analyse:</b> <code>Verifizierungscode (Hohe Priorität mit Ton)</code>',
    aiSecurity: '🤖 <b>KI-Analyse:</b> <code>Sicherheitswarnung (Dringend mit Alarm)</code>',
    aiBilling: '🤖 <b>KI-Analyse:</b> <code>Rechnung / Finanzen (Benachrichtigung mit Ton)</code>',
    aiNotification: '🤖 <b>KI-Analyse:</b> <code>System-Benachrichtigung (Standard-Ton)</code>',
    aiImportant: '🤖 <b>KI-Analyse:</b> <code>Wichtige direkte Nachricht (Mit Ton)</code>',
    aiErrorFallback: (detail: string) =>
      `🤖 <b>KI-Status:</b> <code>⚠️ KI-API-Fehler: ${detail} (Fallback mit Ton)</code>`,
    aiRegexVerification: '🏷️ <b>Filter:</b> <code>Verifizierungscode erkannt (Mit Ton)</code>',
    subjectLabel: 'Betreff',
    noSubject: '(Kein Betreff)',
    unknownSender: 'Unbekannter Absender',
    attachmentsLabel: 'Anhänge',
    attachmentsSynced: 'Mit Postfach synchronisiert',
    attachmentsUnit: (count: number) => ` u. a. (${count} Dateien insgesamt)`,
    unnamedAttachment: 'Unbenannte Datei',
    snippetLabel: 'E-Mail-Auszug',
    noTextContent: '(Kein reiner Textinhalt)',
    snippetFolded: (max: number) =>
      `... (Text eingeklappt bei ${max} Zeichen; vollständiges Original im Backup-Postfach)`,
    backupStatusLabel: 'Weiterleitungsstatus',
    backupSynced: (base: string, alias?: string) =>
      `<code>Mit Backup-Postfach synchronisiert (${base}${alias ? ` · ${alias}` : ''})</code>`,
    backupFailed: (error: string) => `<code>⚠️ Weiterleitung fehlgeschlagen (${error})</code>`,
    backupPureTG: '<code>Kein Backup-Postfach konfiguriert (Reiner Telegram-Modus)</code>',
    replyContactLabel: 'Antwort an',
  },

  securityAlerts: {
    reasonLabel: 'Grund',
    actionLabel: 'Abwehrmaßnahme',
    triggerLabel: 'Auslösegrund',
    defenseStatusLabel: 'Abwehrstatus',
    sizeCapTitle: 'E-Mail-Gateway · Maximale Größe überschritten',
    sizeCapReason: (size: string, cap: string) =>
      `E-Mail-Größe beträgt <b>${size}</b> und überschreitet das Limit (${cap})`,
    sizeCapAction: 'Mit SMTP 552 abgewiesen. <b>Nicht ins Backup-Postfach weitergeleitet (0 Speicher verbraucht).</b>',
    sizeCapTip: 'Empfehlen Sie dem Absender die Nutzung von Cloud-Speichern oder GitHub-Links.',
    attachmentTitle: 'E-Mail-Gateway · Durch Anhangsrichtlinie blockiert',
    attachmentReason: 'Verstoß gegen die Sicherheitsrichtlinie für Dateianhänge',
    attachmentDetected: 'Erkannte Anhänge',
    attachmentAction: 'Mit SMTP 550 abgewiesen. <b>Nicht ins Backup-Postfach weitergeleitet (0 Speicher verbraucht).</b>',
    rateLimitTitle: 'E-Mail-Gateway · Ratenbegrenzungswarnung',
    rateLimitHighFreqSender: 'Hochfrequenter Absender',
    rateLimitReason: 'Häufigkeit eingehender E-Mails hat das Zeitfenster-Limit überschritten',
    rateLimitStatusForwarded: (base: string, alias?: string) =>
      `E-Mail sicher ins Backup-Postfach weitergeleitet (<code>${base}</code>${alias ? ` · Alias <code>${alias}</code>` : ''})`,
    rateLimitStatusFailed: (error: string) => `⚠️ Weiterleitung fehlgeschlagen: ${error}`,
    rateLimitStatusPureTG: 'Reiner TG-Benachrichtigungsmodus (Kein Backup-Postfach)',
    rateLimitTip: 'Telegram-Benachrichtigungen für diesen Absender wurden vorübergehend stummgeschaltet.',
  },

  sources: {
    kvOverride: '(KV-Überschreibung)',
    envDefault: '(Standardwert)',
  },
};
