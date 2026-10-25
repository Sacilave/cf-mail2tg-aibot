import type { TranslationDict } from '../types';

export const ptBR: TranslationDict = {
  langCode: 'pt-BR',
  langName: 'Português',
  flag: '🇧🇷',

  commandDesc: {
    start: 'Ver resumo do status do gateway',
    menu: 'Abrir painel de configurações',
    guide: 'Ver guia do usuário detalhado',
    setup: 'Iniciar assistente de configuração rápida',
    lang: 'Alternar idioma de exibição',
    config: 'Ver status do sistema e credenciais',
    provider: 'Alternar provedor de modelos de IA',
    model: 'Alternar versão do modelo de IA',
    routes: 'Gerenciar regras de rota e tags personalizadas',
    keywords: 'Ver lista de palavras-chave de spam',
    addkeywords: 'Adicionar palavras-chave de spam',
    resetkeywords: 'Restaurar palavras-chave para o padrão',
    add: 'Adicionar regra de rota (add <tag> <prefixo> [encam])',
    del: 'Excluir regra de rota (del <prefixo>)',
    setkey: 'Definir chave ou e-mail (setkey <tipo> <val>)',
    resetkey: 'Redefinir chave dinâmica ou e-mail',
    cancel: 'Cancelar sessão ou assistente ativo',
    help: 'Exibir manual e ajuda de comandos',
  },

  dashboard: {
    title: '⚙️ <b>【 Configurações 】</b>',
    desc: 'Toque nos botões abaixo para alternar provedores de IA, gerenciar personas de roteamento, manter palavras-chave de spam ou mudar o idioma do sistema:',
    btnAi: '🤖 Modelo de IA',
    btnRoutes: '📂 Rotas',
    btnKeywords: '🚫 Anti-Spam',
    btnForward: '📬 Encaminhamento',
    btnLang: '🌐 Idioma / Language',
    btnRefresh: '🔄 Atualizar',
    btnBackMain: '🔙 Menu Principal',
    btnBackAi: '🔙 Configurações de IA',
    btnBackRoutes: '🔙 Configurações de Rota',
    btnManageModels: '🎯 Mudar Modelo',
    btnSetKey: '🔑 Definir Chave de API',
    btnSetAiKey: '🔑 Definir Chave de API',
    btnResetAiKey: '🔄 Limpar Chave Personalizada',
    btnAddRoute: '➕ Adicionar Rota',
    btnTags: '🏷️ Gerenciar Tags',
    btnAddKw: '➕ Adicionar Palavras-chave',
    btnSetForward: '📬 Atualizar E-mail de Encaminhamento',
    btnResetForward: '🗑️ Limpar E-mail de Encaminhamento',
    btnSetup: '⚡ Assistente de Configuração',
    btnCancel: '❌ Cancelar',
    routesTitle: '📂 <b>【 Regras de Roteamento por Persona 】</b>',
    routesSelectTagPrompt: 'Selecione uma <b>tag de categoria de negócio</b> para esta nova rota (toque no botão):',
    routesInputPrefixPrompt: (tag: string) =>
      `Tag de Categoria Selecionada: <b>【${tag}】</b>\n\n` +
      `Responda com o <b>prefixo de e-mail</b> que deseja vincular (ex: <code>vip</code> ou <code>suporte</code>):\n` +
      `<i>(💡 Para especificar um destino de encaminhamento dedicado, responda: prefixo e-mail, ex: vip usuario@exemplo.com)</i>`,
    routesAddSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>Regra de roteamento adicionada com sucesso!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Prefixo Correspondente: <code>${prefix}</code>\n` +
      `• Tag de Persona: <b>${tag}</b>\n` +
      `• Destino: <code>${forward}</code>`,
    routesDeletedSuccess: (prefix: string) => `✅ Regra de rota para o prefixo <code>${prefix}</code> excluída com sucesso!`,
    tagsTitle: '🏷️ <b>【 Gerenciador de Tags de Categoria 】</b>',
    tagsPrompt: 'Gerencie suas tags de categoria de negócio personalizadas aqui. Elas podem ser atribuídas a regras de roteamento:',
    tagsEmpty: 'Nenhuma tag personalizada criada ainda. As categorias padrão do sistema estão em uso (Pessoal, Suporte, Comercial, Produto, Geral).',
    tagsAddSuccess: (tag: string) => `✅ Tag personalizada adicionada com sucesso: <b>【${tag}】</b>!`,
    tagsDeleteSuccess: (tag: string) => `✅ Tag personalizada excluída: <b>【${tag}】</b>!`,
    tagsAddPrompt:
      '🏷️ <b>【 Adicionar Tag Personalizada 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Responda com o nome da tag que deseja criar (ex: <code>Finanças</code>, <code>Monitoramento</code>, <code>Dev</code>, máx. 10 caracteres):',
    tagsInvalid: '❌ Nome de tag inválido ou duplicado (deve ter entre 1 e 10 caracteres, sem espaços).',
    kwTitle: '🚫 <b>【 Filtro de Palavras-chave de Marketing e Spam 】</b>',
    fwdTitle: '📬 <b>【 Caixa de Encaminhamento e Backup 】</b>',
    toastUpdated: 'Configurações atualizadas!',
    toastCancelled: 'Operação cancelada',
  },

  providerCommand: {
    title: '🏢 <b>【 Selecionar Provedor de IA 】</b>',
    current: (provider: string, model: string) => `Provedor Atual: <b>${provider}</b> (Modelo: <code>${model}</code>)`,
    prompt: 'Responda com o número correspondente (válido por 5 minutos):',
    success: (provider: string, model: string, note: string) =>
      `✅ <b>Provedor de IA Alterado com Sucesso!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Provedor Ativo: <b>${provider}</b>\n` +
      `• Modelo em Execução: <code>${model}</code>\n` +
      `${note}`,
    invalidOption: '❌ Seleção inválida. Digite um número de 1 a 9. Envie /cancel para sair.',
    kvError: '❌ Não foi possível salvar a configuração: vínculo do namespace MAIL_ROUTES_KV não encontrado.',
    tipSetKey: '💡 Dica: Se o provedor exigir chave de API, envie <code>/setkey ai &lt;sua-chave&gt;</code>. Para alternar modelos, envie <code>/model</code>.',
  },

  modelCommand: {
    title: (provider: string) => `🧠 <b>【 Selecionar Modelo para ${provider} 】</b>`,
    current: (model: string) => `Modelo Atual: <code>${model}</code>`,
    prompt: 'Responda com um número ou digite um nome de modelo personalizado (válido por 5 minutos):',
    success: (model: string) =>
      `✅ <b>Modelo Atualizado com Sucesso!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Modelo Ativo: <code>${model}</code>`,
    invalidOption: '❌ Opção de modelo inválida. Envie /cancel para sair.',
    kvError: '❌ Não foi possível salvar a configuração: vínculo do namespace MAIL_ROUTES_KV não encontrado.',
  },

  langCommand: {
    selectPrompt:
      '🌐 <b>【 Configurações de Idioma / Language Settings 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      'Selecione o idioma de sua preferência para notificações e comandos:\n' +
      'Please select your preferred language for notifications and commands:',
    currentLang: (name: string) => `\n📌 Idioma Ativo no Momento: <b>${name}</b>`,
    successAlert: (name: string) => `Idioma alterado com sucesso para ${name}!`,
    successCard: (name: string) =>
      `✅ <b>Preferência de Idioma Atualizada!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `O idioma do sistema foi definido como: <b>${name}</b>\n` +
      `Todos os novos cards de notificação, alertas de segurança e painéis de comando serão exibidos neste idioma.\n\n` +
      `💡 <i>Envie /help para explorar todos os comandos no idioma selecionado.</i>`,
    invalidArg:
      '❌ <b>Código de Idioma Inválido!</b>\n' +
      'Opções disponíveis: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ko-KR</code> (한국어), <code>pt-BR</code> (Português), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      'Exemplo: <code>/lang pt</code> ou envie <code>/lang</code> para abrir o menu interativo.',
  },

  startCommand: {
    title: '👋 <b>【 Gateway de E-mail cf-mail2tg-aibot 】</b>',
    subtitle: 'O bot de roteamento e análise inteligente de e-mails Cloudflare está ativo. Todas as mensagens são higienizadas, classificadas e enviadas para este chat com total segurança.',
    statusSectionTitle: '📊 <b>Resumo de Prontidão do Gateway:</b>',
    statusRunningLabel: 'Status',
    statusRunningValue: 'Online (Operação Normal)',
    statusEngineLabel: 'Motor de IA',
    statusForwardLabel: 'Encaminhamento',
    statusNoForward: 'Modo Apenas TG (Não Configurado)',
    statusAliasOn: 'Aliases do Gmail Ativos',
    statusAliasOff: 'Encaminhamento Direto',
    statusDefenseLabel: 'Blindagem de Borda',
    statusDefenseValue: 'Zero Anexos (550) · Limite de 5MB',
    guideTip: 'Toque em 【Configurações】 para gerenciar o gateway; toque em 【Guia do Usuário】 para detalhes; toque em 【🌐 Idioma / Language】 para mudar o idioma.',
    btnOpenMenu: '⚙️ Configurações',
    btnGuide: '📖 Guia do Usuário',
  },

  usageGuide: {
    title: '📖 <b>【 Guia do Usuário cf-mail2tg-aibot 】</b>',
    subtitle: 'Instruções de arquitetura e configuração do gateway:',
    principlesTitle: '⚙️ <b>1. Fluxo de Trabalho</b>',
    principlesContent:
      '• <b>Processamento de Entrada</b>: Os e-mails recebidos pelo seu domínio são interceptados e analisados pelo Worker.\n' +
      '• <b>Proteções Essenciais</b>: Rejeita mensagens que excedem o limite (padrão 5MB) e formatos perigosos para bloquear enxurradas de spam.\n' +
      '• <b>Entrega em Trilha Dupla</b>: Extrai texto e códigos OTP para o Telegram enquanto encaminha o e-mail bruto para a sua caixa de backup.',
    tagsTitle: '🏷️ <b>2. Classificação de E-mails e Códigos OTP</b>',
    tagsContent:
      '• <b>Tipos de Intenção</b>: <code>Verificação</code> · <code>Marketing</code> · <code>Alerta de Segurança</code> · <code>Faturamento</code> · <code>Negócios</code> · <code>Notificação</code>\n' +
      '• <b>Extração de OTP</b>: Identifica automaticamente códigos de verificação e os destaca no topo para cópia com 1 toque.\n' +
      '• <b>Autenticação de Remetente</b>: Valida registros SPF / DKIM / DMARC para indicar a confiabilidade da fonte.',
    antiSpamTitle: '🛡️ <b>3. Filtragem de Spam e Notificações Silenciosas</b>',
    antiSpamContent:
      '• <b>Filtro por Regras</b>: E-mails com cabeçalhos de cancelamento (RFC 8058) ou palavras-chave de marketing são marcados como Marketing.\n' +
      '• <b>Notificações Silenciosas</b>: E-mails de marketing chegam sem som e ignoram chamadas de IA para economizar cota.\n' +
      '• <b>Sincronização de Termos</b>: Palavras-chave regionais são ativadas de acordo com o idioma, expansíveis com <code>/addkeywords</code>.',
    routesTitle: '📂 <b>4. Roteamento por Prefixo e Aliases</b>',
    routesContent:
      '• <b>Triagem por Prefixo</b>: Categoriza e-mails pelo prefixo da caixa postal (ex: <code>suporte@</code> para Suporte, <code>admin@</code> para Pessoal).\n' +
      '• <b>Aliases no Gmail</b>: Adiciona aliases <code>+tag</code> no encaminhamento (ex: <code>usuario+suporte@gmail.com</code>) para organização na caixa de entrada.',
    commandsTitle: '⚡ <b>5. Referência Rápida de Comandos</b>',
    commandsContent:
      '• <code>/start</code> - Resumo do gateway e atalhos\n' +
      '• <code>/menu</code> - Painel de controle de configurações (⚙️ Configurações)\n' +
      '• <code>/guide</code> - Ver este guia do usuário\n' +
      '• <code>/routes</code> - Gerenciar regras de roteamento e tags personalizadas\n' +
      '• <code>/keywords</code> - Ver e manter palavras-chave de filtro de spam\n' +
      '• <code>/ai</code> - Alternar provedores e modelos de IA\n' +
      '• <code>/lang</code> - Alterar idioma de exibição do sistema',
    footerTip: 'A maioria das ações pode ser executada diretamente pelos botões abaixo, sem precisar digitar comandos.',
    btnBackStart: '🔙 Voltar à Visão Geral',
    btnBackDashboard: '⚙️ Configurações',
    btnViewDocs: '🌐 Ver Documentação Detalhada no GitHub',
  },

  helpCommand: {
    title: '📖 <b>【 Ajuda de Comandos cf-mail2tg-aibot 】</b>',
    menuHint: 'Toque no botão <b>[Menu]</b> no canto inferior esquerdo ou envie qualquer comando abaixo:',
    keysSectionTitle: '🔑 <b>Comandos de Status e Configuração:</b>',
    configDesc: '• <code>/config</code> - Ver status do sistema e credenciais mascaradas',
    providerDesc: '• <code>/provider</code> - Troca interativa de provedor de IA',
    modelDesc: '• <code>/model</code> - Troca interativa de versão do modelo ativo',
    setkeyAiDesc: '• <code>/setkey ai &lt;chave&gt;</code> - Atualizar chave universal de IA a quente',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;chave&gt;</code> - Atualizar chave MiniMax a quente',
    setkeyForwardDesc: '• <code>/setkey forward &lt;email&gt;</code> - Atualizar e-mail de encaminhamento a quente',
    resetkeyDesc: '• <code>/resetkey &lt;ai|minimax|forward&gt;</code> - Redefinir sobreposição do KV para padrões',
    keywordsSectionTitle: '📋 <b>Palavras-chave de Marketing e Escudo Anti-Spam:</b>',
    keywordsDesc: '• <code>/keywords</code> - Ver e copiar todas as palavras-chave com 1 toque',
    addkeywordsDesc: '• <code>/addkeywords</code> - Adicionar palavras-chave com segurança sem sobrescrever',
    resetkeywordsDesc: '• <code>/resetkeywords</code> - Restaurar palavras-chave padrão do sistema',
    routesSectionTitle: '🔀 <b>Roteamento de Domínio e Regras de Persona:</b>',
    routesDesc: '• <code>/routes</code> - Ver todas as regras padrão ativas e personalizadas do KV',
    addDesc: '• <code>/add Tag Prefixo [Destino]</code> - Adicionar nova regra de roteamento',
    delDesc: '• <code>/del Prefixo</code> - Excluir regra de rota personalizada (com confirmação)',
    langSectionTitle: '🌐 <b>Internacionalização (i18n):</b>',
    langDesc: '• <code>/lang [código]</code> - Alternar idioma do bot e dos cards de e-mail',
    setupSectionTitle: '🛠️ <b>Assistente de Configuração Interativo:</b>',
    setupDesc: '• <code>/setup</code> - Iniciar assistente de configuração em 2 etapas',
    cancelDesc: '• <code>/cancel</code> - Cancelar sessão ou assistente ativo a qualquer momento',
    footerTip: '💡 <i>Dica: Você pode responder diretamente a qualquer mensagem de palavras-chave do Bot para editar.</i>',
  },

  configCommand: {
    title: '⚙️ <b>【 Status de Configurações e Credenciais 】</b>',
    llmTitle: '🤖 <b>Classificação Inteligente de E-mails (IA):</b>',
    llmProvider: (provider: string) => `  • Provedor de IA: <b>${provider}</b>`,
    llmReady: (source: string) => `  • Status de Vínculo: ✅ Pronto ${source}`,
    llmNotConfigured: '  • Status de Vínculo: ⚪ Não configurado (Usando detecção local via regex)',
    llmMaskedKey: (key: string) => `  • Chave Mascarada: <code>${key}</code>`,
    llmModel: (model: string) => `  • Modelo: <code>${model}</code>`,
    forwardTitle: '📥 <b>Trilha de Encaminhamento Zero-Drop:</b>',
    forwardTarget: (target: string, source: string) => `  • Caixa de Destino: <code>${target}</code> ${source}`,
    forwardNotConfigured: '  • Caixa de Destino: ⚪ Não configurada (Modo apenas push TG)',
    forwardAliasesActive: '  • Aliases do Gmail: ✅ Ativos (Roteamento auto +tag)',
    forwardAliasesDisabled: '  • Aliases do Gmail: ⚪ Desativados (Direto para caixa principal)',
    kvTitle: '🗄️ <b>Banco de Dados KV (MAIL_ROUTES_KV):</b>',
    kvConnected: '  • Conexão: ✅ Conectado e ativo',
    kvNotConnected: '  • Conexão: ❌ Não vinculado',
    kvKeywordsCount: (count: number) => `  • Palavras-chave de Marketing Ativas: <b>${count}</b>`,
    kvCustomRulesCount: (count: number) => `  • Regras de Rota Personalizadas: <b>${count}</b>`,
    securityTitle: '🛡️ <b>Políticas de Segurança e Proteção de Borda:</b>',
    securityBlockAll: '  • Política Zero Anexos: 🔴 Bloquear Todos (SMTP 550)',
    securityHighRiskOnly: '  • Política Zero Anexos: 🟢 Bloquear apenas extensões perigosas',
    securityMaxCap: (size: string) => `  • Disjuntor de Tamanho Máximo: <b>${size}</b> (SMTP 552)`,
    securityMarketingPolicy: (policy: string) =>
      `  • Política de Marketing: <code>${policy === 'mute' ? 'Suprimir Push no TG (mute)' : 'Notificação Silenciosa (silent)'}</code>`,
    systemLangTitle: '🌐 <b>Idioma de Exibição do Sistema:</b>',
    systemLangDesc: (name: string, source: string) => `  • Idioma Atual: <b>${name}</b> ${source}`,
    shortcutsTitle: '💡 <b>Comandos de Atualização Rápida:</b>',
    shortcutProvider: '• <code>/provider</code> - Troca interativa de provedor de IA',
    shortcutModel: '• <code>/model</code> - Troca interativa de modelo',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - Atualizar chave LLM',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;email&gt;</code> - Atualizar e-mail de backup',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - Limpar sobreposição da chave LLM',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - Limpar sobreposição do e-mail de backup',
    shortcutLang: '• <code>/lang</code> - Alternar idioma de exibição (10 idiomas suportados)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【 Guia de Atualização de Credenciais a Quente 】</b>',
    helpUsage: '<b>Uso:</b> <code>/setkey &lt;tipo&gt; &lt;valor&gt;</code>',
    helpAi: '• <b>Atualizar Chave Universal de IA:</b>\n  <code>/setkey ai sk-sua-chave-de-api</code>',
    helpMinimax: '• <b>Atualizar Chave MiniMax:</b>\n  <code>/setkey minimax sk-sua-chave-de-api</code>',
    helpForward: '• <b>Atualizar E-mail de Encaminhamento:</b>\n  <code>/setkey forward seu-email@gmail.com</code>',
    helpTip: '💡 <i>As alterações entram em vigor imediatamente na borda da Cloudflare.</i>',
    kvError: '❌ <b>Erro do Sistema:</b> MAIL_ROUTES_KV não está vinculado.',
    successAi: (maskedKey: string) =>
      `✅ <b>Chave de API de IA Atualizada com Sucesso!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Nova chave armazenada no KV, prévia: <code>${maskedKey}</code>\n` +
      `Os próximos e-mails usarão esta chave para triagem de intenções por IA.`,
    successMinimax: (maskedKey: string) =>
      `✅ <b>Chave de API LLM Atualizada com Sucesso!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Nova chave armazenada no KV, prévia: <code>${maskedKey}</code>\n` +
      `Os próximos e-mails usarão esta chave para triagem de intenções por IA.`,
    successForward: (email: string) =>
      `✅ <b>E-mail de Encaminhamento Atualizado com Sucesso!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Novo endereço de destino: <code>${email}</code>\n` +
      `⚠️ <i>Certifique-se de que este endereço esteja verificado no Cloudflare Email Routing!</i>`,
    unsupportedType: (type: string) =>
      `❌ <b>Tipo de configuração não suportado:</b> 「<code>${type}</code>」\nTipos suportados: <code>ai</code>, <code>minimax</code> ou <code>forward</code>.`,
  },

  resetkeyCommand: {
    helpTitle: '💡 <b>【 Guia do Comando Resetkey 】</b>',
    helpUsage: '<b>Uso:</b> <code>/resetkey &lt;minimax|forward&gt;</code>',
    helpDesc: 'Remove a sobreposição dinâmica do KV e restaura as variáveis de ambiente padrão.',
    kvError: '❌ <b>Erro do Sistema:</b> MAIL_ROUTES_KV não está vinculado.',
    successReset: (subType: string) =>
      `🔄 <b>Configuração dinâmica de ${subType} redefinida!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Sobreposição no KV limpa. O sistema voltou aos padrões de variáveis de ambiente.`,
  },

  keywordsCommand: {
    title: '📋 <b>【 Gerenciamento de Palavras-chave de Marketing 】</b>',
    countDesc: (count: number) => `Palavras-chave ativas no momento: <b>${count}</b>.`,
    instructions:
      '💡 <b>Como editar (Copie, modifique e [Responda a esta mensagem]):</b>\n' +
      '1. Toque no bloco de código abaixo para copiar todas as palavras-chave;\n' +
      '2. Selecione <b>Responder a esta mensagem</b> (ou envie <code>setkeywords ...</code>), cole e ajuste (<b>uma palavra-chave por linha</b>);\n' +
      '3. Envie sua resposta para atualizar o banco de dados globalmente em tempo real!',
    emptyError:
      '❌ <b>Falha na Atualização:</b> Nenhuma palavra-chave válida foi detectada.\nForneça pelo menos uma palavra-chave (uma por linha).',
    kvError: '❌ <b>Erro do Sistema:</b> MAIL_ROUTES_KV não está vinculado.',
    successUpdate: (count: number, preview: string, moreCount: string) =>
      `✅ <b>【 Banco de Palavras-chave de Marketing Atualizado! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Foram atualizadas <b>${count}</b> palavras-chave globalmente na borda.\n\n` +
      `📝 <b>Prévia das Palavras-chave:</b>\n` +
      `<code>${preview}${moreCount}</code>\n\n` +
      `💡 <i>E-mails futuros que corresponderem a estas palavras-chave ou cabeçalhos RFC serão entregues em silêncio.</i>`,
    updateError: '❌ <b>Falha na Atualização:</b> Ocorreu um erro ao gravar no banco de dados KV.',
    addHelpTitle: '💡 <b>【 Guia para Adição Incremental de Palavras-chave 】</b>',
    addHelpUsage: '<b>Uso:</b> <code>/addkeywords palavra1\npalavra2</code>',
    addHelpDesc: 'Termos duplicados são descartados automaticamente. <b>Palavras-chave existentes nunca serão sobrescritas.</b>',
    successAppend: (addedCount: number, totalCount: number, preview: string) =>
      `✅ <b>【 Palavras-chave Adicionadas com Sucesso 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• Adicionadas com sucesso: <b>${addedCount}</b> novas palavras-chave\n` +
      `• Total de palavras-chave ativas: <b>${totalCount}</b>\n` +
      `• Palavras existentes preservadas com segurança.\n\n` +
      `📝 <b>Itens Adicionados:</b>\n` +
      `<code>${preview}</code>`,
    appendError: '❌ <b>Falha ao Adicionar:</b> Erro de gravação no banco de dados.',
    resetSuccess: (count: number) =>
      `🔄 <b>【 Palavras-chave de Marketing Restauradas aos Padrões 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Restauradas as <b>${count}</b> palavras-chave padrão do sistema.`,
  },

  routesCommand: {
    title: '📋 <b>【 Regras de Roteamento de E-mail Ativas 】</b>',
    presetBaselineTitle: '🔹 <b>Personas Padrão do Sistema:</b>',
    fallbackGeneric: '• <i>(Endereços não correspondentes)</i> ➔ 🏷️ <b>Geral</b>',
    customRulesTitle: '🔸 <b>Regras Personalizadas Dinâmicas (Armazenamento KV):</b>',
    noCustomRules: '<i>(Nenhuma regra personalizada ainda. Use "add Pessoal prefixo" para adicionar uma)</i>',
    addHelpTitle: '💡 <b>【 Guia para Adicionar Regra de Rota 】</b>',
    addHelpUsage:
      '<b>Uso:</b> <code>add &lt;tag&gt; &lt;prefixo&gt; [email_encaminhamento]</code>\n\n' +
      '• <b>Tags Permitidas:</b> <code>Pessoal</code>, <code>Geral</code>, <code>Produto Gratuito</code>, <code>Produto Pago</code>, <code>Suporte Corporativo</code>\n' +
      '• <b>Prefixo:</b> ex: <code>suporte</code> mapeia para <code>suporte@seu-dominio.com</code>\n' +
      '• <b>E-mail de Encaminhamento:</b> Opcional. O padrão é o e-mail de encaminhamento principal.\n\n' +
      '<b>Exemplos:</b>\n' +
      '• <code>add Pessoal blog</code>\n' +
      '• <code>add Comercial ajuda usuario@dominio.com</code>',
    addMissingPrefix:
      '❌ <b>Falha ao Adicionar:</b> Argumento de prefixo ausente.\nUso: <code>add &lt;tag&gt; &lt;prefixo&gt; [email_encaminhamento]</code>',
    addInvalidTag: (allowed: string, input: string) =>
      `❌ <b>Falha ao Adicionar:</b> A tag deve ser uma das seguintes: [${allowed}].\nVocê forneceu: 「<code>${input}</code>」.`,
    addInvalidPrefix: (prefix: string) =>
      `❌ <b>Falha ao Adicionar:</b> O prefixo 「<code>${prefix}</code>」 é inválido. Apenas letras, números, pontos e hifens são permitidos.`,
    addSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>Nova Regra de Rota Adicionada com Sucesso!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Prefixo de Destino:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Tag de Persona:</b> ${tag}\n` +
      `📥 <b>Destino de Encaminhamento:</b> <code>${forward || '(Apenas Push no TG)'}</code>\n\n` +
      `💡 <i>O catch-all roteará imediatamente os e-mails deste prefixo de acordo com esta regra.</i>`,
    delHelpTitle: '💡 <b>【 Guia para Excluir Regra de Rota 】</b>',
    delHelpUsage: '<b>Uso:</b> <code>del &lt;prefixo&gt;</code>\n<b>Exemplo:</b> <code>del blog</code>',
    delNotFound: (prefix: string) =>
      `⚠️ <b>Regra Não Encontrada:</b> Nenhuma regra personalizada encontrada para o prefixo <code>${prefix}</code> no KV.`,
    delConfirmPrompt: (prefix: string, tag: string, forward: string) =>
      `⚠️ <b>Confirmar Exclusão da Regra de Rota?</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>Prefixo:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>Tag Atual:</b> ${tag}\n` +
      `📥 <b>Destino de Encaminhamento:</b> <code>${forward || '(Nenhum)'}</code>\n\n` +
      `⚠️ <i>Toque no botão abaixo para confirmar. Isso apagará permanentemente do KV!</i>`,
    delBtnConfirm: '🔴 Confirmar Exclusão',
    delBtnCancel: '⚪ Cancelar',
    delAlertDeleted: 'Excluído permanentemente do banco de dados',
    delAlertNotFound: 'Regra não encontrada',
    delSuccessText: (prefix: string) =>
      `🗑️ <b>Regra Excluída com Sucesso!</b>\n━━━━━━━━━━━━━━━━━━\nA regra de roteamento para o prefixo <code>${prefix}</code> foi completamente apagada do KV.`,
    delNotFoundText: (prefix: string) =>
      `⚠️ <b>Falha ao Excluir:</b> <code>${prefix}</code> não encontrado no banco de dados.`,
    delAlertCancelled: 'Ação cancelada',
    delCancelledText: (prefix: string) =>
      `❌ <b>Ação Cancelada</b>\n━━━━━━━━━━━━━━━━━━\nA regra para o prefixo <code>${prefix}</code> permanece inalterada.`,
  },

  setupCommand: {
    startWizardText:
      `🚀 <b>【 Assistente de Configuração cf-mail2tg-aibot (1/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Bem-vindo ao assistente rápido! Vamos configurar as credenciais principais em 2 etapas.\n` +
      `💡 <i>Digite <code>skip</code> para pular a etapa atual, ou envie <code>/cancel</code> a qualquer momento para sair.</i>\n\n` +
      `<b>Etapa 1: Configurar E-mail de Encaminhamento de Backup</b>\n` +
      `Encaminha com segurança os e-mails recebidos para sua caixa de correio principal (ex: Gmail).\n` +
      `⚠️ <i>Certifique-se de que este endereço esteja verificado em Cloudflare Email Routing ➔ Destination addresses!</i>\n\n` +
      `👉 <b>Responda diretamente com seu e-mail de destino</b> (ex: <code>seunome@gmail.com</code>), ou envie <code>skip</code>:`,
    cancelSuccess:
      `❌ <b>Assistente de Configuração Encerrado</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `A sessão ativa do assistente foi reiniciada. Você pode recomeçar quando quiser com <code>/setup</code>.`,
    skipStep1Text:
      `⏭️ <b>Configuração de e-mail de backup ignorada.</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 Assistente de Configuração cf-mail2tg-aibot (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Etapa 2: Configurar Chave de API LLM MiniMax</b>\n` +
      `Usada para triagem de e-mails com IA (códigos de verificação, faturas, marketing, alertas) e extração de OTP.\n` +
      `💡 <i>Se ainda não possuir uma, digite <code>skip</code> para usar o farejador regex local rápido.</i>\n\n` +
      `👉 <b>Responda diretamente com sua Chave de API MiniMax</b>, ou envie <code>skip</code>:`,
    formatErrorStep1: (input: string) =>
      `❌ <b>Endereço de E-mail Inválido!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Você inseriu: <code>${input}</code>\n` +
      `Forneça um formato de e-mail válido (ex: <code>meuemail@gmail.com</code>), ou envie <code>skip</code>:`,
    successStep1Text: (email: string) =>
      `✅ <b>E-mail de Encaminhamento Vinculado com Sucesso!</b>\n` +
      `Endereço de destino salvo: <code>${email}</code>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 Assistente de Configuração cf-mail2tg-aibot (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Etapa 2: Configurar Chave de API LLM MiniMax</b>\n` +
      `Usada para triagem de e-mails com IA (códigos de verificação, faturas, marketing, alertas) e extração de OTP.\n` +
      `💡 <i>Se ainda não possuir uma, digite <code>skip</code> para usar o farejador regex local rápido.</i>\n\n` +
      `👉 <b>Responda diretamente com sua Chave de API MiniMax</b>, ou envie <code>skip</code>:`,
    step2Card:
      `🚀 <b>【 Assistente de Configuração cf-mail2tg-aibot (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>Etapa 2: Configurar Chave de API LLM MiniMax</b>\n` +
      `Usada para triagem de e-mails com IA (códigos de verificação, faturas, marketing, alertas) e extração de OTP.\n` +
      `💡 <i>Se ainda não possuir uma, digite <code>skip</code> para usar o farejador regex local rápido.</i>\n\n` +
      `👉 <b>Responda diretamente com sua Chave de API MiniMax</b>, ou envie <code>skip</code>:`,
    skipStep2Text: (fwdText: string, mmxText: string) =>
      `⏭️ <b>Configuração de Chave de API LLM ignorada.</b>\n\n` +
      `🎉 <b>【 Configuração Concluída com Sucesso! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Status dos Componentes Principais:\n` +
      `• E-mail de Encaminhamento: ${fwdText}\n` +
      `• Triagem de E-mails com IA: ${mmxText}\n\n` +
      `💡 <b>Próximos Passos:</b>\n` +
      `• Envie <code>/config</code> para verificar configurações globais e chaves mascaradas\n` +
      `• Envie <code>/routes</code> para ver regras ativas de personas de domínio\n` +
      `• Envie <code>/setkey</code> a qualquer momento para atualizar credenciais a quente`,
    keyEmptyError:
      `❌ <b>A chave de API não pode ficar vazia!</b>\nResponda com uma chave válida ou envie <code>skip</code>:`,
    successStep2Text: (maskedKey: string, fwdText: string) =>
      `✅ <b>Chave de API LLM Vinculada com Sucesso!</b>\n` +
      `Salva no KV, prévia: <code>${maskedKey}</code>\n\n` +
      `🎉 <b>【 Fluxo de Configuração Totalmente Concluído! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Seu gateway cf-mail2tg-aibot está totalmente pronto!\n` +
      `• E-mail de Encaminhamento: ${fwdText}\n` +
      `• Triagem de E-mails com IA: ✅ Pronto (<code>${maskedKey}</code>)\n\n` +
      `💡 <b>Próximos Passos:</b>\n` +
      `• Envie <code>/config</code> para inspecionar configurações globais e chaves\n` +
      `• Envie <code>/routes</code> para gerenciar personas e regras de domínio\n` +
      `• Qualquer e-mail recebido agora será analisado em tempo real por IA!`,
    kvRequiredError: `⚠️ <b>Erro do Sistema:</b> O banco de dados MAIL_ROUTES_KV não está vinculado. O assistente não pode iniciar.`,
    notConfiguredPureTg: '⚪ Não Configurado (Modo Trilha Única TG)',
    notConfiguredRegexFallback: '⚪ Não Configurado (Fallback via Regex Local)',
    readyWithMask: (masked: string) => `✅ Pronto (<code>${masked}</code>)`,
  },

  emailCard: {
    intentTags: {
      验证: 'Verificação',
      营销: 'Marketing',
      告警: 'Alerta de Segurança',
      账单: 'Faturamento',
      业务: 'Negócios',
      通知: 'Notificação',
    },
    personaTags: {
      个人: 'Pessoal',
      客服: 'Suporte ao Cliente',
      商务: 'Comercial',
      产品: 'Produto',
      通用: 'Geral',
      免费产品: 'Produto Gratuito',
      付费产品: 'Produto Pago',
      商业支持: 'Suporte Corporativo',
    },
    newEmailTitle: (intentTag: string, targetName: string) =>
      `<b>【Novo E-mail · ${intentTag} · ${targetName}】</b>`,
    verificationCode: 'Código de Verificação',
    copyHint: 'Toque para copiar',
    businessType: 'Tag de Persona',
    recipientDomain: 'Domínio de Destino',
    targetEmail: 'Caixa de Entrada',
    senderFrom: 'Remetente',
    authSPFDKIMPass: '🛡️ <b>Autenticação:</b> <code>SPF Aprovado · DKIM Válido</code>',
    authSPFOnly: '🛡️ <b>Autenticação:</b> <code>SPF Aprovado · DKIM Ausente</code>',
    authDKIMOnly: '🛡️ <b>Autenticação:</b> <code>SPF Ausente · DKIM Válido</code>',
    authFailed: '🚨 <b>Autenticação:</b> <code>SPF/DKIM Reprovado (Possível Falsificação)</code>',
    authUnknown: '🛡️ <b>Autenticação:</b> <code>Assinatura Desconhecida</code>',
    aiRfcUnsubShortCircuit: '🏷️ <b>Auditoria de Protocolo:</b> <code>Cancelamento RFC 8058 Detectado (IA Ignorada)</code>',
    aiKeywordShortCircuit: (keyword: string) =>
      `🏷️ <b>Regra Correspondida:</b> <code>Palavra-chave [${keyword}] (IA Ignorada)</code>`,
    aiMarketing: '🤖 <b>Triagem de IA:</b> <code>Identificado como Marketing (Entregue em silêncio)</code>',
    aiVerification: '🤖 <b>Triagem de IA:</b> <code>Identificado como Verificação (Alerta de Alta Prioridade)</code>',
    aiSecurity: '🤖 <b>Triagem de IA:</b> <code>Identificado como Alerta de Segurança (Alerta Urgente)</code>',
    aiBilling: '🤖 <b>Triagem de IA:</b> <code>Identificado como Faturamento/Finanças (Alerta Sonoro)</code>',
    aiNotification: '🤖 <b>Triagem de IA:</b> <code>Identificado como Notificação do Sistema (Alerta Padrão)</code>',
    aiImportant: '🤖 <b>Triagem de IA:</b> <code>Identificado como Mensagem Direta Importante (Alerta Sonoro)</code>',
    aiErrorFallback: (detail: string) =>
      `🤖 <b>Status de IA:</b> <code>⚠️ Erro na API LLM: ${detail} (Fallback com Alerta Sonoro)</code>`,
    aiRegexVerification: '🏷️ <b>Regra Correspondida:</b> <code>Código de verificação detectado via regex (Alerta Sonoro)</code>',
    subjectLabel: 'Assunto',
    noSubject: '(Sem Assunto)',
    unknownSender: 'Remetente Desconhecido',
    attachmentsLabel: 'Anexos',
    attachmentsSynced: 'Sincronizado com a caixa de backup',
    attachmentsUnit: (count: number) => ` etc. (${count} arquivos no total)`,
    unnamedAttachment: 'Arquivo sem nome',
    snippetLabel: 'Trecho do E-mail',
    noTextContent: '(Sem conteúdo de texto simples)',
    snippetFolded: (max: number) =>
      `... (Texto longo recolhido nos primeiros ${max} caracteres; e-mail original completo sincronizado no backup)`,
    backupStatusLabel: 'Status de Encaminhamento',
    backupSynced: (base: string, alias?: string) =>
      `<code>Sincronizado com a caixa de backup (${base}${alias ? ` · ${alias}` : ''})</code>`,
    backupFailed: (error: string) => `<code>⚠️ Falha no encaminhamento (${error})</code>`,
    backupPureTG: '<code>Nenhuma caixa de backup configurada (Modo apenas TG)</code>',
    replyContactLabel: 'Responder Para',
  },

  securityAlerts: {
    reasonLabel: 'Motivo',
    actionLabel: 'Ação de Defesa',
    triggerLabel: 'Motivo do Disparo',
    defenseStatusLabel: 'Status da Defesa',
    sizeCapTitle: 'Gateway de E-mail · Disjuntor de Limite de Tamanho',
    sizeCapReason: (size: string, cap: string) =>
      `O tamanho do e-mail é <b>${size}</b>, excedendo o limite do gateway (${cap})`,
    sizeCapAction:
      'Rejeitado com SMTP 552. <b>Não encaminhado para o backup (0 consumo de armazenamento).</b>',
    sizeCapTip: 'Dica: Recomende ao remetente o uso de links de nuvem ou GitHub para arquivos grandes.',
    attachmentTitle: 'Gateway de E-mail · Interceptação de Blindagem de Anexos',
    attachmentReason: 'Política de segurança de anexos violada',
    attachmentDetected: 'Anexos detectados',
    attachmentAction:
      'Rejeitado com SMTP 550. <b>Não encaminhado para o backup (0 consumo de armazenamento).</b>',
    rateLimitTitle: 'Gateway de E-mail · Aviso de Limite de Frequência',
    rateLimitHighFreqSender: 'Remetente de alta frequência',
    rateLimitReason: 'A frequência de mensagens recebidas excedeu o limite da janela de tempo',
    rateLimitStatusForwarded: (base: string, alias?: string) =>
      `E-mail encaminhado com segurança para o backup (<code>${base}</code>${alias ? ` · Alias <code>${alias}</code>` : ''})`,
    rateLimitStatusFailed: (error: string) => `⚠️ Falha no encaminhamento: ${error}`,
    rateLimitStatusPureTG: 'Modo de notificação apenas TG (Sem caixa de backup)',
    rateLimitTip: 'Notificações push do Telegram foram silenciadas temporariamente para este remetente a fim de evitar spam e erros TG 429.',
  },

  sources: {
    kvOverride: '(Sobrescrita KV)',
    envDefault: '(Padrão de Ambiente)',
  },
};
