import type { TranslationDict } from '../types';

export const koKR: TranslationDict = {
  langCode: 'ko-KR',
  langName: '한국어',
  flag: '🇰🇷',

  commandDesc: {
    start: '운영 상태 개요 보기',
    settings: '설정 패널 열기',
    status: '운영 상태 및 인증 정보 확인',
    menu: '설정 패널 열기',
    config: '운영 상태 및 인증 정보 확인',
    guide: '상세 사용 가이드 확인',
    setup: '설정 마법사 실행',
    lang: '표시 언어 변경 (Switch language)',
    provider: 'AI 공급자 변경',
    model: '실행 모델 버전 변경',
    routes: '분류 라우팅 및 태그 관리',
    keywords: '스팸 차단 키워드 확인',
    addkeywords: '스팸 차단 키워드 추가',
    resetkeywords: '차단 키워드 초기화',
    add: '라우팅 규칙 추가',
    del: '라우팅 규칙 삭제',
    setkey: '키 또는 전달 이메일 업데이트',
    resetkey: '동적 키 또는 전달 이메일 재설정',
    cancel: '진행 중인 세션 취소',
    help: '명령어 도움말 확인',
  },

  dashboard: {
    title: '⚙️ <b>【 설정 대시보드 】</b>',
    desc: '아래 버튼을 터치하여 AI 모델 변경, 페르소나 라우팅 관리, 스팸 키워드 유지보수 또는 시스템 표시 언어를 전환할 수 있습니다:',
    btnAi: '🤖 AI 모델 설정',
    btnRoutes: '📂 라우팅 규칙',
    btnKeywords: '🚫 스팸 방어',
    btnForward: '📬 백업 전달',
    btnLang: '🌐 언어 / Language',
    btnRefresh: '🔄 새로고침',
    btnBackMain: '🔙 메인 메뉴',
    btnBackAi: '🔙 AI 설정',
    btnBackRoutes: '🔙 라우팅 설정',
    btnManageModels: '🎯 모델 변경',
    btnSetKey: '🔑 API 키 설정',
    btnSetAiKey: '🔑 API 키 설정',
    btnResetAiKey: '🔄 커스텀 키 초기화',
    btnAddRoute: '➕ 라우팅 추가',
    btnTags: '🏷️ 태그 관리',
    btnAddKw: '➕ 키워드 추가',
    btnSetForward: '📬 백업 이메일 수정',
    btnResetForward: '🗑️ 백업 이메일 제거',
    btnSetup: '⚡ 설정 마법사',
    btnCancel: '❌ 취소',
    routesTitle: '📂 <b>【 메일 분류 규칙 】</b>',
    routesSelectTagPrompt: '새 라우팅 규칙에 바인딩할 <b>비즈니스 카테고리 태그</b>를 선택하세요 (버튼 터치):',
    routesInputPrefixPrompt: (tag: string) =>
      `선택된 카테고리 태그: <b>【${tag}】</b>\n\n` +
      `바인딩할 <b>이메일 접두사</b>를 답장으로 입력하세요 (예: <code>vip</code> 또는 <code>support</code>):\n` +
      `<i>(💡 전용 전달 대상을 지정하려면 접두사 이메일 형식으로 답장하세요. 예: vip user@example.com)</i>`,
    routesAddSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>라우팅 규칙이 성공적으로 추가되었습니다!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 매칭 접두사: <code>${prefix}</code>\n` +
      `• 페르소나 태그: <b>${tag}</b>\n` +
      `• 전달 대상: <code>${forward}</code>`,
    routesDeletedSuccess: (prefix: string) => `✅ 접두사 <code>${prefix}</code>의 라우팅 규칙이 성공적으로 삭제되었습니다!`,
    tagsTitle: '🏷️ <b>【 분류 태그 관리 】</b>',
    tagsPrompt: '커스텀 비즈니스 카테고리 태그를 관리합니다. 이 태그들은 라우팅 규칙에 지정할 수 있습니다:',
    tagsEmpty: '등록된 커스텀 태그가 없습니다. 시스템 기본 카테고리가 사용 중입니다 (개인, 고객지원, 비즈니스, 제품, 일반).',
    tagsAddSuccess: (tag: string) => `✅ 커스텀 태그가 성공적으로 추가되었습니다: <b>【${tag}】</b>!`,
    tagsDeleteSuccess: (tag: string) => `✅ 커스텀 태그가 삭제되었습니다: <b>【${tag}】</b>!`,
    tagsAddPrompt:
      '🏷️ <b>【 새 태그 생성 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      '생성할 태그 이름을 입력하세요 (예: <code>재무</code>, <code>모니터링</code>, <code>개발</code>, 최대 10자):',
    tagsInvalid: '❌ 유효하지 않거나 중복된 태그 이름입니다 (공백 없는 1~10자 이내여야 합니다).',
    kwTitle: '🚫 <b>【 스팸 필터 키워드 】</b>',
    fwdTitle: '📬 <b>【 전달 및 백업 사서함 】</b>',
    toastUpdated: '설정이 업데이트되었습니다!',
    toastCancelled: '작업이 취소되었습니다.',
  },

  providerCommand: {
    title: '🏢 <b>【 AI 모델 공급업체 선택 】</b>',
    current: (provider: string, model: string) => `현재 공급업체: <b>${provider}</b> (모델: <code>${model}</code>)`,
    prompt: '원하는 번호를 답장으로 입력하세요 (5분간 유효):',
    success: (provider: string, model: string, note: string) =>
      `✅ <b>AI 공급업체가 성공적으로 전환되었습니다!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 활성 공급업체: <b>${provider}</b>\n` +
      `• 실행 모델: <code>${model}</code>\n` +
      `${note}`,
    invalidOption: '❌ 올바르지 않은 선택입니다. 1에서 9 사이의 숫자를 입력하세요. 취소하려면 /cancel을 보내세요.',
    kvError: '❌ 설정을 저장할 수 없습니다: MAIL_ROUTES_KV 네임스페이스 바인딩을 찾을 수 없습니다.',
    tipSetKey: '💡 팁: 해당 공급업체에 API 키가 필요한 경우 <code>/setkey ai &lt;키&gt;</code>를 보내세요. 모델을 변경하려면 <code>/model</code>을 보내세요.',
  },

  modelCommand: {
    title: (provider: string) => `🧠 <b>【 ${provider} 모델 선택 】</b>`,
    current: (model: string) => `현재 모델: <code>${model}</code>`,
    prompt: '번호를 입력하거나 커스텀 모델명을 직접 입력하세요 (5분간 유효):',
    success: (model: string) =>
      `✅ <b>모델이 성공적으로 업데이트되었습니다!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `활성 모델: <code>${model}</code>`,
    invalidOption: '❌ 유효하지 않은 모델 옵션입니다. 취소하려면 /cancel을 보내세요.',
    kvError: '❌ 설정을 저장할 수 없습니다: MAIL_ROUTES_KV 네임스페이스 바인딩을 찾을 수 없습니다.',
  },

  langCommand: {
    selectPrompt:
      '🌐 <b>【 언어 설정 / Language Settings 】</b>\n' +
      '━━━━━━━━━━━━━━━━━━\n' +
      '알림 메시지와 대화형 명령어에 사용할 언어를 선택하세요:\n' +
      'Please select your preferred language for notifications and commands:',
    currentLang: (name: string) => `\n📌 현재 적용된 언어: <b>${name}</b>`,
    successAlert: (name: string) => `언어가 ${name}(으)로 성공적으로 변경되었습니다!`,
    successCard: (name: string) =>
      `✅ <b>언어 설정이 업데이트되었습니다!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `시스템 언어가 <b>${name}</b>(으)로 설정되었습니다.\n` +
      `이후 수신되는 이메일 알림 카드, 보안 경고 및 제어 패널이 이 언어로 표시됩니다.\n\n` +
      `💡 <i>선택한 언어로 전체 명령어 목록을 보려면 /help를 입력하세요.</i>`,
    invalidArg:
      '❌ <b>유효하지 않은 언어 코드입니다!</b>\n' +
      '사용 가능한 옵션: <code>zh-CN</code> (简体中文), <code>en-US</code> (English), <code>zh-TW</code> (繁體中文), <code>ja-JP</code> (日本語), <code>ko-KR</code> (한국어), <code>pt-BR</code> (Português), <code>ru-RU</code> (Русский), <code>es-ES</code> (Español), <code>fr-FR</code> (Français), <code>de-DE</code> (Deutsch)\n' +
      '예시: <code>/lang ko</code> 또는 <code>/lang</code> 명령어로 대화형 메뉴를 여세요.',
  },

  startCommand: {
    title: '👋 <b>【 cf-mail2tg-aibot 이메일 게이트웨이 】</b>',
    subtitle: 'Cloudflare 이메일 라우팅 및 AI 분석 봇이 활성화되었습니다. 모든 수신 이메일은 보안 검사, 의도 분석 및 인증번호 추출을 거쳐 이 채팅방으로 안전하게 전달됩니다.',
    statusSectionTitle: '📊 <b>게이트웨이 가동 상태 요약:</b>',
    statusRunningLabel: '가동 상태',
    statusRunningValue: '정상 가동 중 (Online)',
    statusEngineLabel: 'AI 분석 엔진',
    statusForwardLabel: '백업 전달',
    statusNoForward: 'TG 단독 모드 (미설정)',
    statusAliasOn: 'Gmail 별칭 활성화',
    statusAliasOff: '직접 전달 모드',
    statusDefenseLabel: '에지 보안 방어',
    statusDefenseValue: '첨부파일 전면 차단 (550) · 5MB 용량 제한',
    guideTip: '【설정】을 터치하여 설정을 관리하고, 【사용 안내서】에서 상세 설명을 확인하며, 【🌐 언어 / Language】에서 표시 언어를 전환할 수 있습니다.',
    btnOpenMenu: '⚙️ 설정',
    btnGuide: '📖 사용 안내서',
  },

  usageGuide: {
    title: '📖 <b>【 cf-mail2tg-aibot 사용 안내서 】</b>',
    subtitle: '게이트웨이 아키텍처 및 구성 가이드:',
    principlesTitle: '⚙️ <b>1. 동작 워크플로</b>',
    principlesContent:
      '• <b>인바운드 처리</b>: 도메인 사서함으로 수신된 메일을 Worker 스크립트가 파싱하고 처리합니다.\n' +
      '• <b>기본 보호막</b>: 대용량 메일(기본 5MB)과 위험한 형식의 첨부파일을 즉시 거부하여 스팸 공격을 방어합니다.\n' +
      '• <b>이중 전달 경로</b>: 텍스트 본문과 인증번호를 추출하여 Telegram으로 푸시함과 동시에 원본 메일을 백업 사서함으로 안전하게 전달합니다.',
    tagsTitle: '🏷️ <b>2. 이메일 분류 및 인증번호</b>',
    tagsContent:
      '• <b>의도 유형</b>: <code>인증</code> · <code>마케팅</code> · <code>보안 경고</code> · <code>청구/결제</code> · <code>업무</code> · <code>알림</code>\n' +
      '• <b>인증번호 자동 추출</b>: 로그인 및 가입용 인증번호를 감지하여 최상단에 원터치 복사 가능한 형태로 표시합니다.\n' +
      '• <b>발신자 인증</b>: SPF / DKIM / DMARC 레코드를 검증하여 발신처의 신뢰 수준을 명확히 표시합니다.',
    antiSpamTitle: '🛡️ <b>3. 스팸 필터링 및 무음 알림</b>',
    antiSpamContent:
      '• <b>규칙 필터링</b>: 수신거부 헤더(RFC 8058)가 포함되어 있거나 필터 키워드와 일치하는 메일을 마케팅으로 자동 분류합니다.\n' +
      '• <b>무음 알림</b>: 마케팅 메일은 기본적으로 소리 없이 무음 전송되며 불필요한 AI 호출을 건너뛰어 할당량을 절약합니다.\n' +
      '• <b>사전 동기화</b>: 시스템 언어에 맞춰 지역별 마케팅 키워드를 자동 매칭하며, <code>/addkeywords</code>로 자유롭게 확장 가능합니다.',
    routesTitle: '📂 <b>4. 접두사 라우팅 및 별칭</b>',
    routesContent:
      '• <b>접두사 분류</b>: 수신 사서함 접두사에 따라 메일을 비즈니스 페르소나별로 분류합니다(예: <code>support@</code>는 고객지원, <code>admin@</code>은 개인).\n' +
      '• <b>사서함 별칭</b>: 전달 시 <code>+tag</code> 형태의 별칭(예: <code>user+support@gmail.com</code>)을 추가하여 수신함 내 필터링과 자동 정리를 지원합니다.',
    commandsTitle: '⚡ <b>5. 주요 명령어 빠른 참조</b>',
    commandsContent:
      '• <code>/start</code> - 게이트웨이 상태 요약 및 빠른 바로가기\n' +
      '• <code>/menu</code> - 설정 대시보드 열기 (⚙️ 설정)\n' +
      '• <code>/guide</code> - 본 사용 안내서 보기\n' +
      '• <code>/routes</code> - 접두사 라우팅 규칙 및 커스텀 태그 관리\n' +
      '• <code>/keywords</code> - 스팸 차단 키워드 확인 및 관리\n' +
      '• <code>/ai</code> - AI 공급업체 및 모델 버전 전환\n' +
      '• <code>/lang</code> - 시스템 표시 언어 변경',
    footerTip: '명령어를 직접 입력하지 않아도 아래 인라인 버튼을 통해 대부분의 작업을 간편하게 수행할 수 있습니다.',
    btnBackStart: '🔙 개요로 돌아가기',
    btnBackDashboard: '⚙️ 설정',
    btnViewDocs: '🌐 GitHub에서 상세 문서 확인',
  },

  helpCommand: {
    title: '📖 <b>【 cf-mail2tg-aibot 명령어 도움말 】</b>',
    menuHint: '왼쪽 하단의 <b>[메뉴]</b> 버튼을 누르거나 아래 명령어를 전송하세요:',
    keysSectionTitle: '🔑 <b>상태 및 설정 명령어:</b>',
    configDesc: '• <code>/config</code> - 실행 상태 및 마스킹된 자격 증명 정보 확인',
    providerDesc: '• <code>/provider</code> - 대화형 AI 공급업체 전환',
    modelDesc: '• <code>/model</code> - 현재 공급업체의 실행 모델 버전 전환',
    setkeyAiDesc: '• <code>/setkey ai &lt;키&gt;</code> - 범용 AI API 키 핫 업데이트',
    setkeyMinimaxDesc: '• <code>/setkey minimax &lt;키&gt;</code> - MiniMax API 키 핫 업데이트',
    setkeyForwardDesc: '• <code>/setkey forward &lt;이메일&gt;</code> - 백업 전달 사서함 핫 업데이트',
    resetkeyDesc: '• <code>/resetkey &lt;minimax|forward&gt;</code> - 동적 설정을 초기화하고 기본값으로 복원',
    keywordsSectionTitle: '📋 <b>마케팅 키워드 및 스팸 방어:</b>',
    keywordsDesc: '• <code>/keywords</code> - 등록된 모든 마케팅 키워드 확인 및 원터치 복사',
    addkeywordsDesc: '• <code>/addkeywords</code> - 기존 키워드를 보존하며 안전하게 키워드 추가',
    resetkeywordsDesc: '• <code>/resetkeywords</code> - 시스템 기본 마케팅 키워드로 복원',
    routesSectionTitle: '🔀 <b>도메인 라우팅 및 페르소나 규칙:</b>',
    routesDesc: '• <code>/routes</code> - 활성화된 기본 및 KV 커스텀 라우팅 규칙 확인',
    addDesc: '• <code>/add 태그 접두사 [전달대상]</code> - 새 이메일 라우팅 규칙 추가',
    delDesc: '• <code>/del 접두사</code> - 커스텀 라우팅 규칙 삭제 (확인 대화상자 포함)',
    langSectionTitle: '🌐 <b>국제화 및 다국어 (i18n):</b>',
    langDesc: '• <code>/lang [언어코드]</code> - 봇 메시지 및 이메일 카드 표시 언어 전환',
    setupSectionTitle: '🛠️ <b>대화형 설정 마법사:</b>',
    setupDesc: '• <code>/setup</code> - 2단계 대화형 빠른 설정 마법사 시작',
    cancelDesc: '• <code>/cancel</code> - 진행 중인 설정 또는 대화형 세션 즉시 취소',
    footerTip: '💡 <i>팁: 봇이 전송한 키워드 메시지에 직접 답장하여 실시간으로 편집할 수도 있습니다.</i>',
  },

  configCommand: {
    title: '📊 <b>【 시스템 운영 상태 】</b>',
    llmTitle: '🤖 <b>LLM 이메일 인텔리전트 분류 (AI):</b>',
    llmProvider: (provider: string) => `  • AI 공급업체: <b>${provider}</b>`,
    llmReady: (source: string) => `  • 바인딩 상태: ✅ 준비 완료 ${source}`,
    llmNotConfigured: '  • 바인딩 상태: ⚪ 미구성 (로컬 정규식 탐지기 사용 중)',
    llmMaskedKey: (key: string) => `  • 마스킹된 키: <code>${key}</code>`,
    llmModel: (model: string) => `  • 실행 모델: <code>${model}</code>`,
    forwardTitle: '📥 <b>무손실 제로-드롭 백업 트랙:</b>',
    forwardTarget: (target: string, source: string) => `  • 대상 사서함: <code>${target}</code> ${source}`,
    forwardNotConfigured: '  • 대상 사서함: ⚪ 미구성 (TG 단독 푸시 모드)',
    forwardAliasesActive: '  • Gmail 별칭: ✅ 활성화 (자동 +태그 분류)',
    forwardAliasesDisabled: '  • Gmail 별칭: ⚪ 비활성화 (기본 사서함으로 직접 전달)',
    kvTitle: '🗄️ <b>KV 데이터베이스 (MAIL_ROUTES_KV):</b>',
    kvConnected: '  • 연결 상태: ✅ 정상 연결 및 활성화됨',
    kvNotConnected: '  • 연결 상태: ❌ 바인딩되지 않음',
    kvKeywordsCount: (count: number) => `  • 활성 마케팅 키워드: <b>${count}</b>개`,
    kvCustomRulesCount: (count: number) => `  • 커스텀 라우팅 규칙: <b>${count}</b>개`,
    securityTitle: '🛡️ <b>에지 보안 및 가드레일 정책:</b>',
    securityBlockAll: '  • 첨부파일 방어 정책: 🔴 전체 차단 (SMTP 550)',
    securityHighRiskOnly: '  • 첨부파일 방어 정책: 🟢 고위험 확장자만 차단',
    securityMaxCap: (size: string) => `  • 용량 제한 차단기: <b>${size}</b> (SMTP 552)`,
    securityMarketingPolicy: (policy: string) =>
      `  • 마케팅 정책: <code>${policy === 'mute' ? 'TG 푸시 억제 (mute)' : '무음 알림 (silent)'}</code>`,
    systemLangTitle: '🌐 <b>시스템 표시 언어:</b>',
    systemLangDesc: (name: string, source: string) => `  • 현재 언어: <b>${name}</b> ${source}`,
    shortcutsTitle: '💡 <b>빠른 설정 명령어:</b>',
    shortcutProvider: '• <code>/provider</code> - 대화형 AI 공급업체 전환',
    shortcutModel: '• <code>/model</code> - 대화형 실행 모델 전환',
    shortcutSetkeyMinimax: '• <code>/setkey minimax &lt;API_KEY&gt;</code> - LLM 키 핫 업데이트',
    shortcutSetkeyForward: '• <code>/setkey forward &lt;이메일&gt;</code> - 백업 사서함 핫 업데이트',
    shortcutResetkeyMinimax: '• <code>/resetkey minimax</code> - LLM 키 오버라이드 제거',
    shortcutResetkeyForward: '• <code>/resetkey forward</code> - 백업 사서함 오버라이드 제거',
    shortcutLang: '• <code>/lang</code> - 표시 언어 전환 (10개 언어 지원)',
  },

  setkeyCommand: {
    helpTitle: '💡 <b>【 자격 증명 핫 업데이트 가이드 】</b>',
    helpUsage: '<b>사용법:</b> <code>/setkey &lt;유형&gt; &lt;값&gt;</code>',
    helpAi: '• <b>범용 AI 키 업데이트:</b>\n  <code>/setkey ai sk-your-api-key</code>',
    helpMinimax: '• <b>MiniMax API 키 업데이트:</b>\n  <code>/setkey minimax sk-your-api-key</code>',
    helpForward: '• <b>백업 전달 사서함 업데이트:</b>\n  <code>/setkey forward your-inbox@gmail.com</code>',
    helpTip: '💡 <i>변경 사항은 Cloudflare 에지에 즉시 적용됩니다.</i>',
    kvError: '❌ <b>시스템 오류:</b> MAIL_ROUTES_KV가 바인딩되지 않았습니다.',
    successAi: (maskedKey: string) =>
      `✅ <b>AI API 키가 성공적으로 핫 업데이트되었습니다!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `KV에 새 키가 저장되었습니다. 미리보기: <code>${maskedKey}</code>\n` +
      `이후 수신되는 이메일 분석에 이 키가 사용됩니다.`,
    successMinimax: (maskedKey: string) =>
      `✅ <b>LLM API 키가 성공적으로 핫 업데이트되었습니다!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `KV에 새 키가 저장되었습니다. 미리보기: <code>${maskedKey}</code>\n` +
      `이후 수신되는 이메일 분석에 이 키가 사용됩니다.`,
    successForward: (email: string) =>
      `✅ <b>백업 전달 사서함이 성공적으로 핫 업데이트되었습니다!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `새 대상 주소: <code>${email}</code>\n` +
      `⚠️ <i>해당 주소가 Cloudflare Email Routing에 등록 및 인증되어 있는지 확인하세요!</i>`,
    unsupportedType: (type: string) =>
      `❌ <b>지원하지 않는 설정 유형입니다:</b> 「<code>${type}</code>」\n지원 유형: <code>ai</code>, <code>minimax</code>, <code>forward</code>.`,
  },

  resetkeyCommand: {
    helpTitle: '💡 <b>【 설정 초기화 명령어 안내 】</b>',
    helpUsage: '<b>사용법:</b> <code>/resetkey &lt;minimax|forward&gt;</code>',
    helpDesc: 'KV에 저장된 동적 오버라이드를 삭제하고 기본 환경변수 설정으로 복원합니다.',
    kvError: '❌ <b>시스템 오류:</b> MAIL_ROUTES_KV가 바인딩되지 않았습니다.',
    successReset: (subType: string) =>
      `🔄 <b>${subType} 동적 설정이 초기화되었습니다!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `KV 오버라이드가 제거되었습니다. 시스템이 환경변수 기본값으로 복원되었습니다.`,
  },

  keywordsCommand: {
    title: '📋 <b>【 활성 스팸 키워드 】</b>',
    countDesc: (count: number) => `현재 활성 키워드: <b>${count}</b>개.`,
    instructions:
      '💡 <b>수정 방법 (복사 후 수정하여 [이 메시지에 답장]):</b>\n' +
      '1. 아래 코드 블록을 터치하여 전체 키워드를 복사하세요.\n' +
      '2. <b>이 메시지에 답장</b>을 선택하고(또는 <code>setkeywords ...</code> 전송), 내용을 붙여넣고 수정하세요(<b>한 줄에 하나씩</b>).\n' +
      '3. 답장을 전송하면 에지 데이터베이스에 실시간으로 즉시 반영됩니다!',
    emptyError:
      '❌ <b>업데이트 실패:</b> 유효한 키워드가 감지되지 않았습니다.\n최소 하나의 키워드를 제공해 주세요(한 줄에 하나씩).',
    kvError: '❌ <b>시스템 오류:</b> MAIL_ROUTES_KV가 바인딩되지 않았습니다.',
    successUpdate: (count: number, preview: string, moreCount: string) =>
      `✅ <b>【 마케팅 키워드 데이터베이스가 업데이트되었습니다! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `에지 전역에 <b>${count}</b>개의 마케팅 키워드가 반영되었습니다.\n\n` +
      `📝 <b>키워드 미리보기:</b>\n` +
      `<code>${preview}${moreCount}</code>\n\n` +
      `💡 <i>이 키워드 또는 RFC 수신거부 헤더와 일치하는 이메일은 무음으로 조용히 전달됩니다.</i>`,
    updateError: '❌ <b>업데이트 실패:</b> KV 데이터베이스에 기록하는 도중 오류가 발생했습니다.',
    addHelpTitle: '💡 <b>【 증분 키워드 추가 안내 】</b>',
    addHelpUsage: '<b>사용법:</b> <code>/addkeywords 키워드1\n키워드2</code>',
    addHelpDesc: '중복 항목은 자동으로 제거되고 안전하게 병합됩니다. <b>기존 키워드는 절대 덮어씌워지지 않습니다.</b>',
    successAppend: (addedCount: number, totalCount: number, preview: string) =>
      `✅ <b>【 키워드가 안전하게 추가되었습니다 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `• 새로 추가된 키워드: <b>${addedCount}</b>개\n` +
      `• 총 활성 키워드: <b>${totalCount}</b>개\n` +
      `• 기존 키워드는 안전하게 보존되었습니다.\n\n` +
      `📝 <b>추가된 항목:</b>\n` +
      `<code>${preview}</code>`,
    appendError: '❌ <b>추가 실패:</b> 데이터베이스 저장 오류.',
    resetSuccess: (count: number) =>
      `🔄 <b>【 마케팅 키워드가 기본값으로 복원되었습니다 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `시스템 기본 <b>${count}</b>개의 표준 마케팅 키워드로 복원되었습니다.`,
  },

  routesCommand: {
    title: '📋 <b>【 활성 분류 규칙 】</b>',
    presetBaselineTitle: '🔹 <b>시스템 기본 프리셋 페르소나:</b>',
    fallbackGeneric: '• <i>(미일치 주소)</i> ➔ 🏷️ <b>일반</b>',
    customRulesTitle: '🔸 <b>동적 커스텀 규칙 (KV 스토리지):</b>',
    noCustomRules: '<i>(등록된 커스텀 규칙이 없습니다. "add 개인 접두사" 명령어로 추가하세요)</i>',
    addHelpTitle: '💡 <b>【 라우팅 규칙 추가 안내 】</b>',
    addHelpUsage:
      '<b>사용법:</b> <code>add &lt;태그&gt; &lt;접두사&gt; [전달대상_이메일]</code>\n\n' +
      '• <b>허용 태그:</b> <code>개인</code>, <code>일반</code>, <code>무료 제품</code>, <code>유료 제품</code>, <code>상용 기술지원</code>\n' +
      '• <b>접두사:</b> 예: <code>support</code>는 <code>support@your-domain.com</code>에 매칭됩니다.\n' +
      '• <b>전달대상 이메일:</b> 선택 사항. 생략 시 기본 백업 전달 이메일이 사용됩니다.\n\n' +
      '<b>예시:</b>\n' +
      '• <code>add 개인 blog</code>\n' +
      '• <code>add 비즈니스 help user@domain.com</code>',
    addMissingPrefix:
      '❌ <b>추가 실패:</b> 접두사 매개변수가 누락되었습니다.\n사용법: <code>add &lt;태그&gt; &lt;접두사&gt; [전달대상_이메일]</code>',
    addInvalidTag: (allowed: string, input: string) =>
      `❌ <b>추가 실패:</b> 태그는 다음 중 하나여야 합니다: [${allowed}].\n입력한 값: 「<code>${input}</code>」.`,
    addInvalidPrefix: (prefix: string) =>
      `❌ <b>추가 실패:</b> 접두사 「<code>${prefix}</code>」이(가) 유효하지 않습니다. 영문, 숫자, 마침표(.), 하이픈(-)만 허용됩니다.`,
    addSuccess: (prefix: string, tag: string, forward: string) =>
      `✅ <b>새 라우팅 규칙이 성공적으로 추가되었습니다!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>대상 접두사:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>페르소나 태그:</b> ${tag}\n` +
      `📥 <b>전달 대상:</b> <code>${forward || '(TG 단독 푸시)'}</code>\n\n` +
      `💡 <i>Catch-all 라우팅이 이 접두사로 들어오는 이메일을 규칙에 따라 즉시 분류합니다.</i>`,
    delHelpTitle: '💡 <b>【 라우팅 규칙 삭제 안내 】</b>',
    delHelpUsage: '<b>사용법:</b> <code>del &lt;접두사&gt;</code>\n<b>예시:</b> <code>del blog</code>',
    delNotFound: (prefix: string) =>
      `⚠️ <b>규칙 없음:</b> KV에서 접두사 <code>${prefix}</code>에 해당하는 규칙을 찾을 수 없습니다.`,
    delConfirmPrompt: (prefix: string, tag: string, forward: string) =>
      `⚠️ <b>라우팅 규칙을 삭제하시겠습니까?</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📬 <b>접두사:</b> <code>${prefix}</code>\n` +
      `🏷️ <b>현재 태그:</b> ${tag}\n` +
      `📥 <b>전달 대상:</b> <code>${forward || '(없음)'}</code>\n\n` +
      `⚠️ <i>삭제를 확정하려면 아래 버튼을 터치하세요. KV에서 영구 삭제됩니다!</i>`,
    delBtnConfirm: '🔴 삭제 확인',
    delBtnCancel: '⚪ 취소',
    delAlertDeleted: '데이터베이스에서 영구 삭제되었습니다',
    delAlertNotFound: '규칙을 찾을 수 없습니다',
    delSuccessText: (prefix: string) =>
      `🗑️ <b>규칙이 성공적으로 삭제되었습니다!</b>\n━━━━━━━━━━━━━━━━━━\n접두사 <code>${prefix}</code>의 라우팅 규칙이 KV에서 완전히 제거되었습니다.`,
    delNotFoundText: (prefix: string) =>
      `⚠️ <b>삭제 실패:</b> 데이터베이스에서 <code>${prefix}</code>을(를) 찾을 수 없습니다.`,
    delAlertCancelled: '작업이 취소되었습니다',
    delCancelledText: (prefix: string) =>
      `❌ <b>작업 취소됨</b>\n━━━━━━━━━━━━━━━━━━\n접두사 <code>${prefix}</code>의 규칙이 변경되지 않았습니다.`,
  },

  setupCommand: {
    startWizardText:
      `🚀 <b>【 cf-mail2tg-aibot 빠른 설정 마법사 (1/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `빠른 설정 마법사에 오신 것을 환영합니다! 2단계에 걸쳐 핵심 설정을 구성합니다.\n` +
      `💡 <i>단계를 건너뛰려면 <code>skip</code>을 입력하고, 언제든지 종료하려면 <code>/cancel</code>을 보내세요.</i>\n\n` +
      `<b>1단계: 백업 전달 이메일 구성</b>\n` +
      `수신된 이메일을 기본 사서함(예: Gmail)으로 안정적으로 전달합니다.\n` +
      `⚠️ <i>해당 주소가 Cloudflare Email Routing ➔ Destination addresses에 등록 및 인증되어 있는지 확인하세요!</i>\n\n` +
      `👉 <b>목적지 이메일 주소를 직접 답장으로 입력하거나</b>(예: <code>yourname@gmail.com</code>), <code>skip</code>을 보내세요:`,
    cancelSuccess:
      `❌ <b>설정 마법사를 종료했습니다</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `진행 중이던 설정 세션이 초기화되었습니다. 언제든지 <code>/setup</code>으로 다시 시작할 수 있습니다.`,
    skipStep1Text:
      `⏭️ <b>백업 전달 이메일 설정을 건너뛰었습니다.</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot 빠른 설정 마법사 (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>2단계: MiniMax LLM API 키 구성</b>\n` +
      `AI 이메일 분석(인증번호, 청구서, 마케팅, 경고 등) 및 코드 추출에 사용됩니다.\n` +
      `💡 <i>아직 키가 없다면 <code>skip</code>을 입력하여 고속 로컬 정규식 탐지 모드로 진행하세요.</i>\n\n` +
      `👉 <b>MiniMax API 키를 직접 답장으로 입력하거나</b>, <code>skip</code>을 보내세요:`,
    formatErrorStep1: (input: string) =>
      `❌ <b>유효하지 않은 이메일 주소 형식입니다!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `입력한 값: <code>${input}</code>\n` +
      `올바른 이메일 형식을 입력하거나(예: <code>mymail@gmail.com</code>), <code>skip</code>을 보내세요:`,
    successStep1Text: (email: string) =>
      `✅ <b>백업 전달 이메일이 성공적으로 바인딩되었습니다!</b>\n` +
      `저장된 대상 주소: <code>${email}</code>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>【 cf-mail2tg-aibot 빠른 설정 마법사 (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>2단계: MiniMax LLM API 키 구성</b>\n` +
      `AI 이메일 분석(인증번호, 청구서, 마케팅, 경고 등) 및 코드 추출에 사용됩니다.\n` +
      `💡 <i>아직 키가 없다면 <code>skip</code>을 입력하여 고속 로컬 정규식 탐지 모드로 진행하세요.</i>\n\n` +
      `👉 <b>MiniMax API 키를 직접 답장으로 입력하거나</b>, <code>skip</code>을 보내세요:`,
    step2Card:
      `🚀 <b>【 cf-mail2tg-aibot 빠른 설정 마법사 (2/2) 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `<b>2단계: MiniMax LLM API 키 구성</b>\n` +
      `AI 이메일 분석(인증번호, 청구서, 마케팅, 경고 등) 및 코드 추출에 사용됩니다.\n` +
      `💡 <i>아직 키가 없다면 <code>skip</code>을 입력하여 고속 로컬 정규식 탐지 모드로 진행하세요.</i>\n\n` +
      `👉 <b>MiniMax API 키를 직접 답장으로 입력하거나</b>, <code>skip</code>을 보내세요:`,
    skipStep2Text: (fwdText: string, mmxText: string) =>
      `⏭️ <b>LLM API 키 설정을 건너뛰었습니다.</b>\n\n` +
      `🎉 <b>【 설정이 완료되었습니다! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `핵심 구성 요소 상태:\n` +
      `• 백업 전달 이메일: ${fwdText}\n` +
      `• AI 이메일 분석: ${mmxText}\n\n` +
      `💡 <b>다음 단계:</b>\n` +
      `• <code>/config</code>를 전송하여 글로벌 설정 및 마스킹된 키를 확인하세요\n` +
      `• <code>/routes</code>를 전송하여 활성 도메인 페르소나 규칙을 확인하세요\n` +
      `• 언제든지 <code>/setkey</code>로 자격 증명을 핫 업데이트할 수 있습니다`,
    keyEmptyError:
      `❌ <b>API 키는 비어 있을 수 없습니다!</b>\n올바른 API 키를 답장으로 입력하거나 <code>skip</code>을 보내세요:`,
    successStep2Text: (maskedKey: string, fwdText: string) =>
      `✅ <b>LLM API 키가 성공적으로 바인딩되었습니다!</b>\n` +
      `KV에 저장됨, 미리보기: <code>${maskedKey}</code>\n\n` +
      `🎉 <b>【 설정 흐름이 완전히 완료되었습니다! 】</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `cf-mail2tg-aibot 게이트웨이가 완벽하게 준비되었습니다!\n` +
      `• 백업 전달 이메일: ${fwdText}\n` +
      `• AI 이메일 분석: ✅ 준비 완료 (<code>${maskedKey}</code>)\n\n` +
      `💡 <b>다음 단계:</b>\n` +
      `• <code>/config</code>를 전송하여 글로벌 설정 및 마스킹된 키를 확인하세요\n` +
      `• <code>/routes</code>를 전송하여 페르소나 및 도메인 규칙을 관리하세요\n` +
      `• 이제 모든 수신 메일이 실시간으로 AI 분석을 거쳐 전달됩니다!`,
    kvRequiredError: `⚠️ <b>시스템 오류:</b> MAIL_ROUTES_KV 데이터베이스가 바인딩되지 않았습니다. 마법사를 시작할 수 없습니다.`,
    notConfiguredPureTg: '⚪ 미구성 (순수 TG 단일 트랙)',
    notConfiguredRegexFallback: '⚪ 미구성 (로컬 정규식 폴백)',
    readyWithMask: (masked: string) => `✅ 준비 완료 (<code>${masked}</code>)`,
  },

  emailCard: {
    intentTags: {
      验证: '인증',
      营销: '마케팅',
      告警: '보안 경고',
      账单: '청구/결제',
      业务: '업무',
      通知: '알림',
    },
    personaTags: {
      个人: '개인',
      客服: '고객지원',
      商务: '비즈니스',
      产品: '제품',
      通用: '일반',
      免费产品: '무료 제품',
      付费产品: '유료 제품',
      商业支持: '상용 기술지원',
    },
    newEmailTitle: (intentTag: string, targetName: string) =>
      `<b>【새 이메일 · ${intentTag} · ${targetName}】</b>`,
    verificationCode: '인증번호',
    copyHint: '터치하여 복사',
    businessType: '페르소나 태그',
    recipientDomain: '수신 도메인',
    targetEmail: '수신 사서함',
    senderFrom: '발신자',
    authSPFDKIMPass: '🛡️ <b>인증:</b> <code>SPF 통과 · DKIM 유효</code>',
    authSPFOnly: '🛡️ <b>인증:</b> <code>SPF 통과 · DKIM 누락</code>',
    authDKIMOnly: '🛡️ <b>인증:</b> <code>SPF 누락 · DKIM 유효</code>',
    authFailed: '🚨 <b>인증:</b> <code>SPF/DKIM 실패 (스푸핑 가능성)</code>',
    authUnknown: '🛡️ <b>인증:</b> <code>알 수 없는 서명</code>',
    aiRfcUnsubShortCircuit: '🏷️ <b>프로토콜 감사:</b> <code>RFC 8058 수신거부 감지 (AI 호출 생략)</code>',
    aiKeywordShortCircuit: (keyword: string) =>
      `🏷️ <b>규칙 일치:</b> <code>키워드 [${keyword}] 감지 (AI 호출 생략)</code>`,
    aiMarketing: '🤖 <b>AI 의도 분류:</b> <code>LLM 마케팅 판정 (무음 알림으로 전송)</code>',
    aiVerification: '🤖 <b>AI 의도 분류:</b> <code>LLM 인증 메일 판정 (우선순위 소리 알림)</code>',
    aiSecurity: '🤖 <b>AI 의도 분류:</b> <code>LLM 보안 경고 판정 (긴급 알림)</code>',
    aiBilling: '🤖 <b>AI 의도 분류:</b> <code>LLM 재무/청구 판정 (소리 알림)</code>',
    aiNotification: '🤖 <b>AI 의도 분류:</b> <code>LLM 시스템 알림 판정 (표준 알림)</code>',
    aiImportant: '🤖 <b>AI 의도 분류:</b> <code>LLM 중요 업무 메일 판정 (소리 알림)</code>',
    aiErrorFallback: (detail: string) =>
      `🤖 <b>AI 상태:</b> <code>⚠️ LLM API 오류: ${detail} (소리 알림 폴백)</code>`,
    aiRegexVerification: '🏷️ <b>규칙 일치:</b> <code>정규식 패턴 인증번호 일치 (소리 알림)</code>',
    subjectLabel: '제목',
    noSubject: '(제목 없음)',
    unknownSender: '알 수 없는 발신자',
    attachmentsLabel: '첨부파일',
    attachmentsSynced: '백업 사서함 동기화 완료',
    attachmentsUnit: (count: number) => ` 등 (총 ${count}개 파일)`,
    unnamedAttachment: '이름 없는 파일',
    snippetLabel: '본문 미리보기',
    noTextContent: '(텍스트 본문 내용 없음)',
    snippetFolded: (max: number) =>
      `... (본문이 길어 앞부분 ${max}자만 표시되었습니다. 원본 전문은 백업 사서함에 동기화되었습니다)`,
    backupStatusLabel: '전달 상태',
    backupSynced: (base: string, alias?: string) =>
      `<code>백업 사서함 동기화 완료 (${base}${alias ? ` · ${alias}` : ''})</code>`,
    backupFailed: (error: string) => `<code>⚠️ 전달 실패 (${error})</code>`,
    backupPureTG: '<code>백업 사서함 미구성 (순수 TG 푸시 모드)</code>',
    replyContactLabel: '답장 대상',
  },

  securityAlerts: {
    reasonLabel: '사유',
    actionLabel: '방어 조치',
    triggerLabel: '차단 사유',
    defenseStatusLabel: '방어 상태',
    sizeCapTitle: '이메일 게이트웨이 · 용량 제한 초과 차단',
    sizeCapReason: (size: string, cap: string) =>
      `이메일 크기가 <b>${size}</b>(으)로 게이트웨이 상한선(${cap})을 초과했습니다.`,
    sizeCapAction:
      'SMTP 552 코드로 거부되었습니다. <b>백업 사서함으로 전달되지 않음 (저장 공간 0 소모).</b>',
    sizeCapTip: '팁: 대용량 첨부파일 전송 시 클라우드 드라이브 또는 GitHub 릴리스 링크 사용을 권장합니다.',
    attachmentTitle: '이메일 게이트웨이 · 첨부파일 보안 방어 차단',
    attachmentReason: '첨부파일 보안 정책 위반',
    attachmentDetected: '감지된 첨부파일',
    attachmentAction:
      'SMTP 550 코드로 거부되었습니다. <b>백업 사서함으로 전달되지 않음 (저장 공간 0 소모).</b>',
    rateLimitTitle: '이메일 게이트웨이 · 수신 빈도 제한 경고',
    rateLimitHighFreqSender: '고빈도 발신자',
    rateLimitReason: '단위 시간당 수신 빈도가 임계값을 초과했습니다.',
    rateLimitStatusForwarded: (base: string, alias?: string) =>
      `이메일이 백업 사서함으로 안전하게 전달되었습니다 (<code>${base}</code>${alias ? ` · 별칭 <code>${alias}</code>` : ''})`,
    rateLimitStatusFailed: (error: string) => `⚠️ 전달 실패: ${error}`,
    rateLimitStatusPureTG: '순수 TG 알림 모드 (백업 사서함 미구성)',
    rateLimitTip: '스팸 홍수 및 TG 429 에러 방지를 위해 해당 발신자의 Telegram 푸시가 일시적으로 무음 처리됩니다.',
  },

  sources: {
    kvOverride: '(KV 설정값)',
    envDefault: '(기본 환경변수)',
  },
};
