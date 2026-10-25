import type { TranslationDict } from '../types';

export const frFR: TranslationDict = {
  langCode: 'fr-FR',
  langName: 'Français',
  flag: '🇫🇷',

  commandDesc: {
    start: 'Aperçu de l\'état du système',
    menu: 'Ouvrir les paramètres',
    guide: 'Consulter le guide détaillé',
    setup: 'Lancer l\'assistant de config.',
    lang: 'Changer de langue (Switch language)',
    config: 'Voir l\'état et les clés d\'accès',
    provider: 'Changer de fournisseur d\'IA',
    model: 'Changer de modèle d\'IA',
    routes: 'Gérer le routage et les balises',
    keywords: 'Voir les mots-clés anti-spam',
    addkeywords: 'Ajouter des mots-clés',
    resetkeywords: 'Réinitialiser les mots-clés',
    add: 'Ajouter une règle (add <balise> <préfixe>)',
    del: 'Supprimer une règle (del <préfixe>)',
    setkey: 'Définir clé ou e-mail (setkey)',
    resetkey: 'Réinitialiser clé dynamique',
    cancel: 'Annuler la session en cours',
    help: 'Manuel des commandes',
  },

  dashboard: {
    title: '⚙️ <b>【 Paramètres 】</b>',
    desc: 'Appuyez sur les boutons ci-dessous pour changer de modèle IA, gérer les routes, le filtre antispam ou la langue :',
    btnAi: '🤖 Modèles IA',
    btnRoutes: '📂 Routage',
    btnKeywords: '🚫 Filtre Spam',
    btnForward: '📬 Redirection',
    btnLang: '🌐 Langue / Language',
    btnRefresh: '🔄 Actualiser',
    btnBackMain: '🔙 Menu Principal',
    btnBackAi: '🔙 Retour à l’IA',
    btnBackRoutes: '🔙 Retour au Routage',
    btnManageModels: '🎯 Changer de Modèle',
    btnSetKey: '🔑 Définir Clé API',
    btnSetAiKey: '🔑 Associer clé API',
    btnResetAiKey: '🔄 Effacer clé API',
    btnAddRoute: '➕ Ajouter Règle',
    btnTags: '🏷️ Gestion des Balises',
    btnAddKw: '➕ Ajouter mots-clés',
    btnSetForward: '📬 Modifier l\'e-mail',
    btnResetForward: '🗑️ Effacer l\'e-mail',
    btnSetup: '⚡ Assistant de config.',
    btnCancel: '❌ Annuler',
    routesTitle: '📂 <b>【 Gestion des Règles de Routage 】</b>',
    routesSelectTagPrompt: 'Sélectionnez une <b>catégorie</b> pour la nouvelle règle (appuyez sur le bouton) :',
    routesInputPrefixPrompt: (tag: string) =>
      `Catégorie sélectionnée : <b>【${tag}】</b>\n\n` +
      `Veuillez répondre avec le <b>préfixe d'adresse</b> à lier (ex. <code>vip</code> ou <code>support</code>) :\n` +
      `<i>(💡 Pour spécifier une redirection dédiée : préfixe e-mail, ex. : vip user@example.com)</i>`,
    routesAddSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>Règle de routage ajoutée avec succès !</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Préfixe : <code>${prefix}</code>\n` +
      `• Catégorie : <b>${tag}</b>\n` +
      `• Destination : <code>${forward}</code>`,
    routesDeletedSuccess: (prefix: string) => `✅ Règle pour le préfixe <code>${prefix}</code> supprimée avec succès !`,
    tagsTitle: '🏷️ <b>【 Gestionnaire de Balises Personnalisées 】</b>',
    tagsPrompt: 'Gérez vos balises de catégorie ici pour les utiliser lors de la création de règles :',
    tagsEmpty: 'Aucune balise personnalisée. Les catégories par défaut sont utilisées (Personnel, Support, Business, Produit, Générique).',
    tagsAddSuccess: (tag: string) => `✅ Balise personnalisée ajoutée : <b>【${tag}】</b> !`,
    tagsDeleteSuccess: (tag: string) => `✅ Balise supprimée : <b>【${tag}】</b> !`,
    tagsAddPrompt:
      '🏷️ <b>【 Ajouter une nouvelle balise 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Répondez avec le nom de la balise (ex. <code>Finance</code>, <code>Monitoring</code>, max 10 lettres) :',
    tagsInvalid: '❌ Nom de balise invalide ou déjà existant (1-10 caractères sans espaces).',
    kwTitle: '🚫 <b>【 Mots-clés de Filtrage des E-mails Marketing 】</b>',
    fwdTitle: '📬 <b>【 Configuration de Redirection et Copie 】</b>',
    toastUpdated: 'Paramètres mis à jour !',
    toastCancelled: 'Opération annulée',
  },

  providerCommand: {
    title: '🏢 <b>【 Sélectionner le fournisseur d’IA 】</b>',
    current: (provider: string, model: string) => `Fournisseur actuel : <b>${provider}</b> (Modèle : <code>${model}</code>)`,
    prompt: 'Répondez avec le numéro correspondant (valable 5 minutes) :',
    success: (provider: string, model: string, note: string) =>
      `✅ <b>Fournisseur d’IA modifié avec succès !</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Fournisseur actif : <b>${provider}</b>\n` +
      `• Modèle en cours : <code>${model}</code>\n` +
      `${note}`,
    invalidOption: '❌ Sélection invalide. Entrez un numéro entre 1 et 9. Envoyez /cancel pour quitter.',
    kvError: '❌ Impossible d’enregistrer : liaison MAIL_ROUTES_KV introuvable.',
    tipSetKey: '💡 Conseil : Si ce fournisseur nécessite une clé API, envoyez <code>/setkey ai &lt;votre-clé&gt;</code>. Pour changer de modèle, envoyez <code>/model</code>.',
  },

  modelCommand: {
    title: (provider: string) => `🧠 <b>【 Sélectionner le modèle pour ${provider} 】</b>`,
    current: (model: string) => `Modèle actuel : <code>${model}</code>`,
    prompt: 'Répondez avec un numéro ou un nom de modèle personnalisé (valable 5 minutes) :',
    success: (model: string) =>
      `✅ <b>Modèle mis à jour avec succès !</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Modèle actif : <code>${model}</code>`,
    invalidOption: '❌ Option invalide. Envoyez /cancel pour quitter.',
    kvError: '❌ Impossible d’enregistrer : liaison MAIL_ROUTES_KV introuvable.',
  },

  langCommand: {
    selectPrompt:
      '🌐 <b>【 Paramètres de langue / Language Settings 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Veuillez sélectionner votre langue préférée pour Telegram :\n' +
      'Please select your preferred language for notifications and commands:',
    currentLang: (name: string) => `\n📌 Langue actuellement active : <b>${name}</b>`,
    successAlert: (name: string) => `Langue changée avec succès en ${name} !`,
    successCard: (name: string) =>
      `✅ <b>Préférence de langue mise à jour !</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `La langue du système est désormais : <b>${name}</b>\n` +
      `Toutes les futures notifications d'e-mails, alertes de sécurité et commandes seront affichées dans cette langue.\n\n` +
      `💡 <i>Envoyez /help pour découvrir toutes les commandes disponibles.</i>`,
    invalidArg:
      '❌ <b>Code de langue non valide !</b>\n' +
      'Langues disponibles : <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ko-KR</code> (한국어), <code>pt-BR</code> (Português), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      'Exemple : <code>/lang fr</code> ou envoyez <code>/lang</code> pour ouvrir le menu interactif.',
  },

  startCommand: {
    title: '👋 <b>【 Passerelle E-mail cf-mail2tg-aibot 】</b>',
    subtitle: 'Le bot de routage et de tri IA Cloudflare est actif. Tous les e-mails sont analysés en toute sécurité et notifiés dans ce chat.',
    statusSectionTitle: '📊 <b>Résumé de l’état du système :</b>',
    statusRunningLabel: 'Statut',
    statusRunningValue: 'En ligne (Online)',
    statusEngineLabel: 'Moteur IA',
    statusForwardLabel: 'Redirection',
    statusNoForward: 'Mode TG seul (Non défini)',
    statusAliasOn: 'Alias Gmail activés',
    statusAliasOff: 'Redirection directe',
    statusDefenseLabel: 'Protection Edge',
    statusDefenseValue: 'Zéro pièce jointe (550) · Limite 5 Mo',
    guideTip: 'Touchez 【Paramètres】 pour configurer la passerelle ; 【Guide d\'utilisation】 pour les détails ; 【🌐 Langue / Language】 pour changer de langue.',
    btnOpenMenu: '⚙️ Paramètres',
    btnGuide: '📖 Guide d\'utilisation',
  },

  usageGuide: {
    title: '📖 <b>【 Guide d\'utilisation cf-mail2tg-aibot 】</b>',
    subtitle: 'Fonctions de base et instructions de configuration :',
    principlesTitle: '⚙️ <b>1. Fonctionnement</b>',
    principlesContent:
      '• <b>Réception</b>: Les e-mails adressés à votre domaine sont filtrés et structurés par le script Worker.\n' +
      '• <b>Sécurité</b>: Rejet des e-mails &gt; 5 Mo et pièces jointes à risque pour bloquer les attaques de spam.\n' +
      '• <b>Double Distribution</b>: Envoi du texte et des codes sur Telegram avec copie vers votre boîte de secours.',
    tagsTitle: '🏷️ <b>2. Tri et codes de vérification OTP</b>',
    tagsContent:
      '• <b>Types d\'e-mails</b>: <code>Vérification</code> · <code>Marketing</code> · <code>Alerte</code> · <code>Facturation</code> · <code>Direct</code> · <code>Notification</code>\n' +
      '• <b>Codes OTP</b>: Détection des codes de connexion affichés en haut pour une copie instantanée.\n' +
      '• <b>Authentification</b>: Vérification des enregistrements SPF / DKIM / DMARC de l\'expéditeur.',
    antiSpamTitle: '🛡️ <b>3. Filtrage Anti-Spam et Mode Silencieux</b>',
    antiSpamContent:
      '• <b>Filtrage par Règles</b>: Les e-mails avec en-têtes de désinscription (RFC 8058) ou mots-clés sont classés en marketing.\n' +
      '• <b>Distribution Silencieuse</b>: Les messages marketing n\'émettent aucun son et n\'appellent pas l\'IA afin d\'économiser les quotas.\n' +
      '• <b>Dictionnaire</b>: Adapté à la langue du système et extensible via <code>/addkeywords</code>.',
    routesTitle: '📂 <b>4. Routage par Préfixe et Alias</b>',
    routesContent:
      '• <b>Tri par Préfixe</b>: Classement selon le préfixe (ex. <code>support@</code> ➜ Support, <code>admin@</code> ➜ Personnel).\n' +
      '• <b>Alias d\'e-mail</b>: Ajout automatique de <code>+tag</code> lors du transfert pour faciliter les filtres de messagerie.',
    commandsTitle: '⚡ <b>5. Liste des Commandes</b>',
    commandsContent:
      '• <code>/start</code> - Résumé de la passerelle et accès rapide\n' +
      '• <code>/menu</code> - Panneau de réglages (⚙️ Paramètres)\n' +
      '• <code>/guide</code> - Consulter ce guide\n' +
      '• <code>/routes</code> - Gérer les règles de routage et balises\n' +
      '• <code>/keywords</code> - Gérer les mots-clés anti-spam\n' +
      '• <code>/ai</code> - Changer de fournisseur et modèle d\'IA\n' +
      '• <code>/lang</code> - Changer la langue du système',
    footerTip: 'La plupart des actions s\'effectuent en un clic sur les boutons ci-dessous.',
    btnBackStart: '🔙 Revenir au Résumé',
    btnBackDashboard: '⚙️ Paramètres',
    btnViewDocs: '🌐 Voir la Documentation Complète sur GitHub',
  },

  helpCommand: {
    title: '📖 <b>【 cf-mail2tg-aibot Aide des commandes 】</b>',
    menuHint: 'Appuyez sur le bouton <b>[Menu]</b> ou envoyez l’une des commandes ci-dessous :',
    keysSectionTitle: '🔑 <b>Commandes d\'état et de configuration :</b>',
    configDesc: '• <code>/config</code> - Voir l\'état du système et les identifiants (masqué)',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;key&gt;</code> - Mettre à jour la clé IA sur mobile',
    setkeyForwardDesc: '• <code>/setkey forward &lt;email&gt;</code> - Mettre à jour l’e-mail de transfert',
    resetkeyDesc: '• <code>/resetkey &lt;minimax|forward&gt;</code> - Réinitialiser les clés dynamiques',
    keywordsSectionTitle: '📋 <b>Mots-clés marketing et anti-spam :</b>',
    keywordsDesc: '• <code>/keywords</code> - Voir et copier tous les mots-clés marketing',
    addkeywordsDesc: '• <code>/addkeywords</code> - Ajouter des mots-clés en toute sécurité sans écraser',
    resetkeywordsDesc: '• <code>/resetkeywords</code> - Rétablir les mots-clés par défaut du système',
    routesSectionTitle: '🔀 <b>Routage de domaine et profils :</b>',
    routesDesc: '• <code>/routes</code> - Voir toutes les règles de routage actives (base et KV)',
    addDesc: '• <code>/add Étiquette Préfixe [Cible]</code> - Ajouter une règle de routage',
    delDesc: '• <code>/del Préfixe</code> - Supprimer une règle personnalisée (avec confirmation)',
    langSectionTitle: '🌐 <b>Internationalisation (i18n) :</b>',
    langDesc: '• <code>/lang [code]</code> - Changer la langue des messages et des cartes d’e-mails',
    setupSectionTitle: '🛠️ <b>Assistant de configuration :</b>',
    setupDesc: '• <code>/setup</code> - Lancer l’assistant de configuration interactif en 2 étapes',
    cancelDesc: '• <code>/cancel</code> - Quitter la session de configuration à tout moment',
    footerTip: '💡 <i>Astuce : Vous pouvez répondre directement à un message de mots-clés du Bot pour le modifier.</i>',
  },

  configCommand: {
    title: '⚙️ <b>【 Paramètres et état des clés 】</b>',
    llmTitle: '🤖 <b>Classification des e-mails par IA (MiniMax) :</b>',
    llmReady: (source: string) => `  • État : ✅ Prêt ${source}`,
    llmNotConfigured: '  • État : ⚪ Non configuré (Détection locale par regex active)',
    llmMaskedKey: (key: string) => `  • Clé API masquée : <code>${key}</code>`,
    llmModel: (model: string) => `  • Modèle : <code>${model}</code>`,
    forwardTitle: '📥 <b>Transfert de secours sans perte :</b>',
    forwardTarget: (target: string, source: string) => `  • Boîte de secours : <code>${target}</code> ${source}`,
    forwardNotConfigured: '  • Boîte de secours : ⚪ Non configurée (Mode notification TG seule)',
    forwardAliasesActive: '  • Alias Gmail : ✅ Actifs (Routage auto +étiquette)',
    forwardAliasesDisabled: '  • Alias Gmail : ⚪ Désactivés (Directement dans la boîte principale)',
    kvTitle: '🗄️ <b>Base de données KV (MAIL_ROUTES_KV) :</b>',
    kvConnected: '  • Connexion : ✅ Connectée et opérationnelle',
    kvNotConnected: '  • Connexion : ❌ Non liée',
    kvKeywordsCount: (count: number) => `  • Mots-clés marketing actifs : <b>${count}</b>`,
    kvCustomRulesCount: (count: number) => `  • Règles de routage personnalisées : <b>${count}</b>`,
    securityTitle: '🛡️ <b>Sécurité en périphérie et politiques de garde :</b>',
    securityBlockAll: '  • Politique des pièces jointes : 🔴 Bloquer tout (SMTP 550)',
    securityHighRiskOnly: '  • Politique des pièces jointes : 🟢 Formats dangereux uniquement',
    securityMaxCap: (size: string) => `  • Limite de taille max de l’e-mail : <b>${size}</b> (SMTP 552)`,
    securityMarketingPolicy: (policy: string) =>
      `  • Politique marketing : <code>${policy === 'mute' ? 'Pas d’envoi TG (mute)' : 'Notification silencieuse (silent)'}</code>`,
    systemLangTitle: '🌐 <b>Langue d’affichage du système :</b>',
    systemLangDesc: (name: string, source: string) => `  • Langue actuelle : <b>${name}</b> ${source}`,
    shortcutsTitle: '💡 <b>Commandes de mise à jour rapide :</b>',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - Mettre à jour la clé IA',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;email&gt;</code> - Mettre à jour la boîte de secours',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - Effacer la clé IA dynamique',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - Effacer l’e-mail de secours dynamique',
    shortcutLang: '• <code>/lang</code> - Changer de langue (10 langues supportées)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【 Guide de mise à jour des identifiants 】</b>',
    helpUsage: '<b>Format :</b> <code>/setkey &lt;type&gt; &lt;valeur&gt;</code>',
    helpMinimax: '• <b>Clé API IA :</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>E-mail de transfert de secours :</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>Les modifications sont enregistrées dans KV et appliquées immédiatement en périphérie.</i>',
    kvError: '❌ <b>Erreur système :</b> MAIL_ROUTES_KV n’est pas lié.',
    successMinimax: (maskedKey: string) =>
      `✅ <b>Clé API IA mise à jour avec succès !</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Nouvelle clé enregistrée dans KV : <code>${maskedKey}</code>\n` +
      `Les prochains e-mails entrants utiliseront cette clé pour l’analyse IA.`,
    successForward: (email: string) =>
      `✅ <b>E-mail de secours mis à jour avec succès !</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Nouvelle adresse de destination : <code>${email}</code>\n` +
      `⚠️ <i>Assurez-vous que cette adresse est validée dans Cloudflare Email Routing !</i>`,
    unsupportedType: (type: string) =>
      `❌ <b>Type de configuration non pris en charge :</b> 「<code>${type}</code>」\nTypes valides : <code>minimax</code> ou <code>forward</code>.`,
  },

  resetkeyCommand: {
    helpTitle: '💡 <b>【 Guide de réinitialisation des clés 】</b>',
    helpUsage: '<b>Format :</b> <code>/resetkey &lt;minimax|forward&gt;</code>',
    helpDesc: 'Supprime la configuration dynamique dans KV et rétablit les variables d’environnement.',
    kvError: '❌ <b>Erreur système :</b> MAIL_ROUTES_KV n’est pas lié.',
    successReset: (subType: string) =>
      `🔄 <b>Configuration dynamique de ${subType} réinitialisée !</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Clé KV supprimée. Le système revient aux valeurs par défaut de l’environnement.`,
  },

  keywordsCommand: {
    title: '📋 <b>【 Gestion des mots-clés de filtrage publicitaire 】</b>',
    countDesc: (count: number) => `Nombre total de mots-clés actifs : <b>${count}</b>.`,
    instructions:
      '💡 <b>Comment modifier (Copiez, ajustez et [Répondez à ce message]) :</b>\n' +
      '1. Touchez le bloc de code ci-dessous pour copier tous les mots-clés ;\n' +
      '2. Choisissez <b>« Répondre (Reply) »</b> à ce message (ou envoyez <code>setkeywords ...</code>), collez et ajustez (<b>un mot-clé par ligne</b>) ;\n' +
      '3. Envoyez votre réponse pour appliquer instantanément les modifications !',
    emptyError:
      '❌ <b>Échec de la mise à jour :</b> Aucun mot-clé valide détecté.\nVeuillez fournir au moins un mot-clé (un par ligne).',
    kvError: '❌ <b>Erreur système :</b> MAIL_ROUTES_KV n’est pas lié.',
    successUpdate: (count: number, preview: string, moreCount: string) =>
      `✅ <b>【 Base de mots-clés publicitaires mise à jour ! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>${count}</b> mots-clés mis à jour avec succès sur l’ensemble du réseau.\n\n` +
      `📝 <b>Aperçu des mots-clés :</b>\n` +
      `<code>${preview}${moreCount}</code>\n\n` +
      `💡 <i>Les e-mails correspondants à ces mots ou aux en-têtes RFC de désinscription seront délivrés silencieusement.</i>`,
    updateError: '❌ <b>Échec de la mise à jour :</b> Erreur lors de l’écriture dans la base KV.',
    addHelpTitle: '💡 <b>【 Ajout de mots-clés sans écrasement 】</b>',
    addHelpUsage: '<b>Format :</b> <code>/addkeywords mot1\nmot2</code>',
    addHelpDesc: 'Les mots sont dédoublonnés et fusionnés en toute sécurité. <b>Les mots existants ne seront pas écrasés.</b>',
    successAppend: (addedCount: number, totalCount: number, preview: string) =>
      `✅ <b>【 Mots-clés ajoutés avec succès 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Ajoutés : <b>${addedCount}</b> nouveaux mots-clés\n` +
      `• Total actif : <b>${totalCount}</b> mots-clés\n` +
      `• La liste précédente est entièrement conservée.\n\n` +
      `📝 <b>Éléments ajoutés :</b>\n` +
      `<code>${preview}</code>`,
    appendError: '❌ <b>Échec de l’ajout :</b> Erreur d’écriture dans la base de données.',
    resetSuccess: (count: number) =>
      `🔄 <b>【 Mots-clés restaurés aux valeurs d’origine 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Les <b>${count}</b> mots-clés standard bilingues du système ont été rétablis.`,
  },

  routesCommand: {
    title: '📋 <b>【 Règles de routage d’e-mails actives 】</b>',
    presetBaselineTitle: '🔹 <b>Profils de base du système :</b>',
    fallbackGeneric: '• <i>(Adresses non associées)</i> ➔ 🏷️ <b>Général</b>',
    customRulesTitle: '🔸 <b>Règles personnalisées dynamiques (dans KV) :</b>',
    noCustomRules: '<i>(Aucune règle pour le moment. Utilisez "add Personnel xxx" pour en créer une)</i>',
    addHelpTitle: '💡 <b>【 Guide d’ajout d’une règle de routage 】</b>',
    addHelpUsage:
      '<b>Format :</b> <code>add &lt;étiquette&gt; &lt;préfixe&gt; [e-mail_secours]</code>\n\n' +
      '• <b>Étiquettes :</b> <code>Personnel</code>, <code>Général</code>, <code>Produit gratuit</code>, <code>Produit payant</code>, <code>Support commercial</code>\n' +
      '• <b>Préfixe :</b> ex. <code>support</code> correspond à <code>support@votre-domaine.com</code>\n' +
      '• <b>E-mail :</b> Facultatif. Par défaut, utilise la boîte principale.\n\n' +
      '<b>Exemples :</b>\n' +
      '• <code>add Personnel blog</code>\n' +
      '• <code>add Support help user@domain.com</code>',
    addMissingPrefix:
      '❌ <b>Échec de l’ajout :</b> Préfixe manquant.\nFormat : <code>add &lt;étiquette&gt; &lt;préfixe&gt; [e-mail]</code>',
    addInvalidTag: (allowed: string, input: string) =>
      `❌ <b>Échec de l’ajout :</b> L’étiquette doit faire partie de [${allowed}].\nValeur saisie : 「<code>${input}</code>」.`,
    addInvalidPrefix: (prefix: string) =>
      `❌ <b>Échec de l’ajout :</b> Le préfixe 「<code>${prefix}</code>」 n’est pas valide. Lettres, chiffres, points et tirets autorisés uniquement.`,
    addSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>Nouvelle règle de routage ajoutée avec succès !</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Préfixe cible :</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Étiquette :</b> ${tag}\n` +
      `📥 <b>Boîte de transfert :</b> <code>${forward || '(Notification TG seule)'}</code>\n\n` +
      `💡 <i>Si le Catch-all est activé, les e-mails envoyés à ce préfixe suivront immédiatement cette règle.</i>`,
    delHelpTitle: '💡 <b>【 Guide de suppression d’une règle 】</b>',
    delHelpUsage: '<b>Format :</b> <code>del &lt;préfixe&gt;</code>\n<b>Exemple :</b> <code>del blog</code>',
    delNotFound: (prefix: string) =>
      `⚠️ <b>Règle introuvable :</b> Aucune règle trouvée pour le préfixe <code>${prefix}</code> dans KV.`,
    delConfirmPrompt: (prefix: string, tag: string, forward: string) =>
      `⚠️ <b>Confirmez-vous la suppression de cette règle ?</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Préfixe :</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Étiquette actuelle :</b> ${tag}\n` +
      `📥 <b>Boîte de transfert :</b> <code>${forward || '(Aucune)'}</code>\n\n` +
      `⚠️ <i>Appuyez sur le bouton ci-dessous pour confirmer. La règle sera définitivement supprimée de KV !</i>`,
    delBtnConfirm: '🔴 Confirmer la suppression',
    delBtnCancel: '⚪ Annuler',
    delAlertDeleted: 'Supprimé définitivement de la base de données',
    delAlertNotFound: 'Règle introuvable',
    delSuccessText: (prefix: string) =>
      `🗑️ <b>Règle supprimée avec succès !</b>\n━━━━━━━━━━━━━━━━━━\nLa configuration du préfixe <code>${prefix}</code> a été effacée de KV.`,
    delNotFoundText: (prefix: string) =>
      `⚠️ <b>Échec de la suppression :</b> <code>${prefix}</code> introuvable dans la base de données.`,
    delAlertCancelled: 'Action annulée',
    delCancelledText: (prefix: string) =>
      `❌ <b>Action annulée</b>\n━━━━━━━━━━━━━━━━━━\nLa règle pour le préfixe <code>${prefix}</code> reste inchangée.`,
  },

  setupCommand: {
    startWizardText:
      `🚀 <b>【 cf-mail2tg-aibot Assistant de configuration (1/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Bienvenue dans l’assistant de configuration ! Nous allons lier vos paramètres en 2 étapes.\n` +
      `💡 <i>Tapez <code>skip</code> pour passer l’étape ou <code>/cancel</code> pour quitter.</i>\n\n` +
      `<b>Étape 1 : Configurer l’e-mail de secours (Forward Email)</b>\n` +
      `Permet de transférer les e-mails sans perte vers votre boîte principale (ex. Gmail).\n` +
      `⚠️ <i>Assurez-vous que l’adresse est validée dans Cloudflare Email Routing ➔ Destination addresses !</i>\n\n` +
      `👉 <b>Veuillez répondre directement avec votre e-mail</b> (ex. <code>yourname@gmail.com</code>), ou tapez <code>skip</code> :`,
    cancelSuccess:
      `❌ <b>Vous avez quitté l’assistant de configuration</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `La session a été réinitialisée. Vous pouvez recommencer à tout moment avec <code>/setup</code>.`,
    skipStep1Text:
      `⏭️ <b>Configuration de l’e-mail de secours ignorée.</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot Assistant de configuration (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Étape 2 : Configurer la clé API MiniMax IA</b>\n` +
      `Utilisée pour l’analyse IA (codes, factures, marketing, alertes) et l’extraction de codes.\n` +
      `💡 <i>Si vous n’avez pas de clé pour le moment, tapez <code>skip</code> (le filtre local par regex sera utilisé).</i>\n\n` +
      `👉 <b>Veuillez répondre avec votre clé API MiniMax</b>, ou tapez <code>skip</code> :`,
    formatErrorStep1: (input: string) =>
      `❌ <b>Format d’e-mail invalide !</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Vous avez saisi : <code>${input}</code>\n` +
      `Veuillez entrer une adresse valide (ex. : <code>mymail@gmail.com</code>), ou tapez <code>skip</code> :`,
    successStep1Text: (email: string) =>
      `✅ <b>E-mail de secours enregistré avec succès !</b>\n` +
      `Adresse enregistrée : <code>${email}</code>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot Assistant de configuration (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Étape 2 : Configurer la clé API MiniMax IA</b>\n` +
      `Utilisée pour l’analyse IA (codes, factures, marketing, alertes) et l’extraction de codes.\n` +
      `💡 <i>Si vous n’avez pas de clé pour le moment, tapez <code>skip</code> (le filtre local par regex sera utilisé).</i>\n\n` +
      `👉 <b>Veuillez répondre avec votre clé API MiniMax</b>, ou tapez <code>skip</code> :`,
    step2Card:
      `🚀 <b>【 cf-mail2tg-aibot Assistant de configuration (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Étape 2 : Configurer la clé API MiniMax IA</b>\n` +
      `Utilisée pour l’analyse IA (codes, factures, marketing, alertes) et l’extraction de codes.\n` +
      `💡 <i>Si vous n’avez pas de clé pour le moment, tapez <code>skip</code> (le filtre local par regex sera utilisé).</i>\n\n` +
      `👉 <b>Veuillez répondre avec votre clé API MiniMax</b>, ou tapez <code>skip</code> :`,
    skipStep2Text: (fwdText: string, mmxText: string) =>
      `⏭️ <b>Configuration de la clé IA ignorée.</b>\n\n` +
      `🎉 <b>【 Configuration terminée avec succès ! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `État des composants du système :\n` +
      `• E-mail de transfert : ${fwdText}\n` +
      `• Analyse IA des e-mails : ${mmxText}\n\n` +
      `💡 <b>Étapes suivantes :</b>\n` +
      `• Envoyez <code>/config</code> pour inspecter la configuration globale et les clés\n` +
      `• Envoyez <code>/routes</code> pour afficher les règles actives\n` +
      `• Envoyez <code>/setkey</code> à tout moment pour modifier vos clés`,
    keyEmptyError:
      `❌ <b>La clé API ne peut pas être vide !</b>\nVeuillez répondre avec une clé valide, ou tapez <code>skip</code> :`,
    successStep2Text: (maskedKey: string, fwdText: string) =>
      `✅ <b>Clé API IA enregistrée avec succès !</b>\n` +
      `Enregistrée dans KV : <code>${maskedKey}</code>\n\n` +
      `🎉 <b>【 Configuration terminée ! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Votre passerelle e-mail cf-mail2tg-aibot est pleinement opérationnelle !\n` +
      `• E-mail de transfert : ${fwdText}\n` +
      `• Analyse IA : ✅ Prêt (<code>${maskedKey}</code>)\n\n` +
      `💡 <b>Étapes suivantes :</b>\n` +
      `• Envoyez <code>/config</code> pour afficher le hub de configuration\n` +
      `• Envoyez <code>/routes</code> pour gérer les règles de domaine\n` +
      `• Tout nouvel e-mail entrant sera automatiquement analysé par IA et notifié !`,
    kvRequiredError: `⚠️ <b>Erreur système :</b> La base de données MAIL_ROUTES_KV n'est pas liée. Impossible de démarrer l'assistant.`,
    notConfiguredPureTg: '⚪ Non configuré (mode TG seul)',
    notConfiguredRegexFallback: '⚪ Non configuré (secours regex)',
    readyWithMask: (masked: string) => `✅ Prêt (<code>${masked}</code>)`,
  },

  emailCard: {
    intentTags: {
      验证: 'Vérification',
      营销: 'Marketing',
      告警: 'Alerte Sécurité',
      账单: 'Facturation',
      业务: 'Affaires',
      通知: 'Notification',
    },
    personaTags: {
      个人: 'Personnel',
      客服: 'Support Client',
      商务: 'Affaires & Ventes',
      产品: 'Produit',
      通用: 'Général',
      免费产品: 'Produit Gratuit',
      付费产品: 'Produit Payant',
      商业支持: 'Support Commercial',
    },
    newEmailTitle: (intentTag: string, targetName: string) =>
      `<b>【Nouvel e-mail · ${intentTag} · ${targetName}】</b>`,
    verificationCode: 'Code de vérification',
    copyHint: 'Appuyez pour copier',
    businessType: 'Catégorie / Profil',
    recipientDomain: 'Domaine récepteur',
    targetEmail: 'Boîte de réception',
    senderFrom: 'Expéditeur',
    authSPFDKIMPass: '🛡️ <b>Authentification :</b> <code>SPF Valide · DKIM Conforme</code>',
    authSPFOnly: '🛡️ <b>Authentification :</b> <code>SPF Valide · DKIM Non vérifié</code>',
    authDKIMOnly: '🛡️ <b>Authentification :</b> <code>SPF Non vérifié · DKIM Conforme</code>',
    authFailed: '🚨 <b>Authentification :</b> <code>SPF/DKIM Échoué (Usurpation possible)</code>',
    authUnknown: '🛡️ <b>Authentification :</b> <code>Signature inconnue</code>',
    aiRfcUnsubShortCircuit: '🏷️ <b>Protocole :</b> <code>En-tête de désinscription RFC 8058 (Appel IA évité)</code>',
    aiKeywordShortCircuit: (keyword: string) =>
      `🏷️ <b>Règle :</b> <code>Correspondance au mot-clé [${keyword}] (Appel IA évité)</code>`,
    aiMarketing: '🤖 <b>IA :</b> <code>Marketing / Promotion (Délivré silencieusement)</code>',
    aiVerification: '🤖 <b>IA :</b> <code>Code de vérification (Alerte sonore haute priorité)</code>',
    aiSecurity: '🤖 <b>IA :</b> <code>Alerte de sécurité (Alerte urgente)</code>',
    aiBilling: '🤖 <b>IA :</b> <code>Facture / Paiement (Notification avec son)</code>',
    aiNotification: '🤖 <b>IA :</b> <code>Notification système (Alerte standard)</code>',
    aiImportant: '🤖 <b>IA :</b> <code>E-mail important direct (Notification avec son)</code>',
    aiErrorFallback: (detail: string) =>
      `🤖 <b>État IA :</b> <code>⚠️ Erreur API IA : ${detail} (Alerte avec son par défaut)</code>`,
    aiRegexVerification: '🏷️ <b>Règle :</b> <code>Code de vérification détecté par motif (Alerte avec son)</code>',
    subjectLabel: 'Objet',
    noSubject: '(Sans objet)',
    unknownSender: 'Expéditeur inconnu',
    attachmentsLabel: 'Pièces jointes',
    attachmentsSynced: 'Synchronisé avec la boîte e-mail',
    attachmentsUnit: (count: number) => ` et d’autres (${count} fichiers au total)`,
    unnamedAttachment: 'Fichier sans nom',
    snippetLabel: 'Extrait de l’e-mail',
    noTextContent: '(Aucun contenu en texte brut)',
    snippetFolded: (max: number) =>
      `... (Texte trop long, affichage des ${max} premiers caractères ; original complet transféré)`,
    backupStatusLabel: 'Statut du transfert',
    backupSynced: (base: string, alias?: string) =>
      `<code>Transféré vers la boîte de secours (${base}${alias ? ` · ${alias}` : ''})</code>`,
    backupFailed: (error: string) => `<code>⚠️ Échec du transfert (${error})</code>`,
    backupPureTG: '<code>Aucune boîte de secours (Mode Telegram seul)</code>',
    replyContactLabel: 'Répondre à',
  },

  securityAlerts: {
    reasonLabel: 'Motif',
    actionLabel: 'Action de défense',
    triggerLabel: 'Motif du déclenchement',
    defenseStatusLabel: 'Statut de défense',
    sizeCapTitle: 'Passerelle e-mail · Dépassement de la taille limite',
    sizeCapReason: (size: string, cap: string) =>
      `Taille de l’e-mail : <b>${size}</b>, dépassant le plafond de sécurité (${cap})`,
    sizeCapAction: 'Rejeté avec le code SMTP 552. <b>Non transféré (0 Mo de stockage consommé).</b>',
    sizeCapTip: 'Il est conseillé à l’expéditeur de partager les fichiers volumineux via un cloud ou GitHub.',
    attachmentTitle: 'Passerelle e-mail · Blocage par politique de pièces jointes',
    attachmentReason: 'Violation de la politique de sécurité des pièces jointes',
    attachmentDetected: 'Pièces jointes détectées',
    attachmentAction: 'Rejeté avec le code SMTP 550. <b>Non transféré (0 Mo de stockage consommé).</b>',
    rateLimitTitle: 'Passerelle e-mail · Avertissement de limite de fréquence',
    rateLimitHighFreqSender: 'Expéditeur haute fréquence',
    rateLimitReason: 'La fréquence d’e-mails entrants a dépassé le seuil de tolérance',
    rateLimitStatusForwarded: (base: string, alias?: string) =>
      `E-mail transféré en toute sécurité (<code>${base}</code>${alias ? ` · Alias <code>${alias}</code>` : ''})`,
    rateLimitStatusFailed: (error: string) => `⚠️ Échec du transfert : ${error}`,
    rateLimitStatusPureTG: 'Mode notification TG seule (Aucune boîte de secours)',
    rateLimitTip: 'Les notifications Telegram pour cet expéditeur sont temporairement coupées pour éviter les spams.',
  },

  sources: {
    kvOverride: '(Remplacement KV)',
    envDefault: '(Valeur par défaut Env)',
  },
};
