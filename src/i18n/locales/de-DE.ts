import type { TranslationDict } from '../types';

export const deDE: TranslationDict = {
  langCode: 'de-DE',
  langName: 'Deutsch',
  flag: '🇩🇪',

  commandDesc: {
    lang: 'Sprache wechseln / Switch language',
    setup: 'Schnellkonfigurations-Assistent (in 1 Min.)',
    config: 'Schlüssel, Routing-Status und Hub anzeigen',
    setkey: 'API-Schlüssel/E-Mail aktualisieren: setkey <Typ> <Wert>',
    resetkey: 'Dynamische Schlüssel auf Standardwerte zurücksetzen',
    cancel: 'Aktuellen Assistenten oder Sitzung abbrechen',
    keywords: 'Marketing- und Spam-Schlüsselwörter verwalten',
    addkeywords: 'Schlüsselwörter sicher anhängen (ohne Überschreiben)',
    resetkeywords: 'Schlüsselwörter auf Systemstandard zurücksetzen',
    routes: 'Aktive Domain-Routing-Regeln und Personas',
    add: 'Routing-Regel hinzufügen: add <Tag> <Präfix> [E-Mail]',
    del: 'Routing-Regel löschen: del <Präfix>',
    help: 'Bedienungsanleitung und Befehlsübersicht anzeigen',
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
    title: '👋 <b>【 cf-mail2tg-aibot E-Mail-Gateway ist bereit 】</b>',
    stepGuideTitle: '⚡ <b>Schnellstartanleitung in 3 Schritten:</b>',
    step1Title: '1️⃣ <b>Gateway-Status prüfen</b>',
    step1Desc: '   Senden Sie <code>/config</code>, um KI, Backup-Postfach und KV-Datenbank zu prüfen.',
    step2Title: '2️⃣ <b>Schlüssel via Telegram aktualisieren (Optional)</b>',
    step2Desc1: '   • KI-Analyse & Code-Extraktion aktivieren: <code>/setkey minimax &lt;API_KEY&gt;</code>',
    step2Desc2: '   • Backup-Postfach festlegen/ändern: <code>/setkey forward &lt;email&gt;</code>',
    step3Title: '3️⃣ <b>Domain-Routing konfigurieren</b>',
    step3Desc1: '   • Aktive Regeln anzeigen: <code>/routes</code>',
    step3Desc2: '   • Benutzerdefinierte Regel hinzufügen: <code>/add Support help</code> (Multi-Domain-fähig)',
    shortcutsTitle: '💡 <b>Tägliche Schnellbefehle:</b>',
    shortcutSetup: '• <code>/setup</code> - Interaktiver 2-Schritt-Einrichtungsassistent',
    shortcutConfig: '• <code>/config</code> - Aktuelle Konfiguration und maskierte Schlüssel',
    shortcutKeywords: '• <code>/keywords</code> - Spam-Schlüsselwörter verwalten (Antworten zum Ändern)',
    shortcutLang: '• <code>/lang</code> - Systemsprache wechseln (8 Sprachen unterstützt)',
    shortcutHelp: '• <code>/help</code> - Vollständiges Kontrollzentrum und Parameterhandbuch',
    menuActivatedNote: '<i>Die [Menu]-Schaltfläche unten links ist synchronisiert. Jederzeit tippbar.</i>',
  },

  helpCommand: {
    title: '🎛️ <b>【 cf-mail2tg-aibot Vollständiges Kontrollzentrum 】</b>',
    menuHint: 'Tippen Sie auf <b>[Menu]</b> unten links oder senden Sie einen Befehl:',
    keysSectionTitle: '🔑 <b>Schlüssel und Systemstatus:</b>',
    configDesc: '• <code>/config</code> - Schlüsselstatus und Konfigurations-Hub anzeigen (maskiert)',
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
    title: '🎛️ <b>【 cf-mail2tg-aibot Konfigurations- und Schlüssel-Hub 】</b>',
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
