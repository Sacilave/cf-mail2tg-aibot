<div align="center">

# 📬 cf-mail2tg-aibot

**Cloudflare Workers & LLM 기반의 프로덕션급, 완전 무료, 셀프 호스팅 이메일-Telegram AI 봇**  
*Cloudflare Workers 기반의 엔터프라이즈급 지능형 수신 게이트웨이 및 원터치 인증번호 추출*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Telegram Bot API](https://img.shields.io/badge/Telegram-Bot%20API-2CA5E0?logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tests-147%20Passed-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![i18n](https://img.shields.io/badge/i18n-10%20Languages-blueviolet)](#-6--10개-주요-언어-다국어-지원-및-즉시-전환)
[![Zero Cost](https://img.shields.io/badge/Cost-%240%2Fmo%20Free-brightgreen)](#-완전-무료--무료-할당량-보장)

<p align="center">
  <a href="./README.md">English</a> •
  <a href="./README.zh-CN.md">简体中文</a> •
  <a href="./README.zh-TW.md">繁體中文</a> •
  <a href="./README.ja-JP.md">日本語</a> •
  <b>한국어</b> •
  <a href="./README.pt-BR.md">Português</a> •
  <a href="./README.ru-RU.md">Русский</a> •
  <a href="./README.es-ES.md">Español</a> •
  <a href="./README.fr-FR.md">Français</a> •
  <a href="./README.de-DE.md">Deutsch</a>
</p>

<p align="center">
  <a href="#-스크린샷">스크린샷</a> •
  <a href="#-빠른-시작-3단계">빠른 시작</a> •
  <a href="#-왜-cf-mail2tg-aibot인가-비교-매트릭스">비교 매트릭스</a> •
  <a href="#️-시스템-아키텍처">시스템 아키텍처</a> •
  <a href="#-핵심-기능">핵심 기능</a> •
  <a href="#-telegram-대화형-명령어">명령어 안내</a> •
  <a href="#-자주-묻는-질문-faq">자주 묻는 질문</a>
</p>

</div>

---

## 📖 프로젝트 개요

**`cf-mail2tg-aibot`**는 **인디 해커, 글로벌 개발팀, 다중 도메인을 운영하는 웹마스터**를 위해 특별히 설계된 셀프 호스팅 이메일 게이트웨이입니다.

Cloudflare Workers의 에지 컴퓨팅과 무료 Email Routing을 활용하여, **수신된 이메일을 심층 파싱하고, 스팸/노이즈를 차단하며, LLM 기반의 시맨틱 의도 분류를 거쳐 미려한 카드 형태로 수 초 내에 Telegram에 전달**합니다. 이와 동시에 무손실(Zero-Drop) 듀얼 트랙 파이프라인을 통해 원본 이메일을 개인 백업 사서함(예: Gmail 별칭)으로 직접 전달합니다. 다중 도메인으로 인해 발생하는 비싼 비즈니스 메일 구독료(유저당 월 $6~$18)를 없애고, 가볍고 유지비가 전혀 없는 실시간 이메일 수신 환경을 구축하세요.

---

## 📸 스크린샷

아래는 모두 실제 운영 중인 인스턴스의 스크린샷입니다. 이메일 주소, 인증 코드, 인보이스 번호 등 민감한 항목은 모두 자리 표시자로 교체했습니다.

### 🎛️ 봇 제어 패널

| | |
| :---: | :---: |
| <img src="docs/screenshots/gateway-home.png" alt="게이트웨이 홈" width="100%"><br><sub>게이트웨이 홈 — 온라인 상태, AI 엔진, 백업 포워딩을 한눈에</sub> | <img src="docs/screenshots/settings.png" alt="설정" width="100%"><br><sub>설정 — AI 제공업체, 라우팅 페르소나, 안티스팸, 언어를 한 패널에서 관리</sub> |

### 📬 이메일 알림 실제 화면

| | |
| :---: | :---: |
| <img src="docs/screenshots/email-verification.png" alt="인증 코드" width="100%"><br><sub>인증 코드 — 자동 추출해 상단에 고정, 탭하면 복사</sub> | <img src="docs/screenshots/email-security-alert.png" alt="보안 알림" width="100%"><br><sub>보안 알림 — SPF/DKIM 실패로 피싱 경고</sub> |
| <img src="docs/screenshots/email-billing.png" alt="청구" width="100%"><br><sub>청구 — 인보이스를 파싱하고 첨부 파일 정보까지 표시</sub> | <img src="docs/screenshots/email-business.png" alt="비즈니스 문의" width="100%"><br><sub>비즈니스 문의 — AI 분류로 우선 처리 지정</sub> |

<p align="center">
  <img src="docs/screenshots/email-marketing-muted.png" alt="마케팅" width="49%"><br>
  <sub>마케팅 — 프로모션은 스팸 규칙으로 자동 음소거</sub>
</p>

---

## 🚀 빠른 시작 (3단계)

**사전 준비:**
- 무료 Cloudflare 계정과 Cloudflare에 추가된 도메인 (Email Routing은 도메인별로 활성화되며, 3단계에서 설정합니다).
- 컴퓨터에 Node.js 22 이상과 Git 설치 (3단계의 첫 wrangler 명령 실행 시 브라우저가 열려 Cloudflare 로그인을 요청합니다).

### 1. Telegram 자격 증명 발급
- [@BotFather](https://t.me/BotFather)에게 대화 시작 ➔ `/newbot` 입력 ➔ 발급된 `TELEGRAM_BOT_TOKEN` 복사.
- [@userinfobot](https://t.me/userinfobot)에게 대화 시작 ➔ 사용자 ID 숫자를 복사하여 `TELEGRAM_ADMIN_CHAT_ID`로 보관.
- 터미널에서 `openssl rand -hex 32` 실행 ➔ 출력값을 복사하여 `TELEGRAM_WEBHOOK_SECRET`로 보관 (선택 사항이지만 권장; Windows에서는 Git Bash에서 실행).

### 2. Cloudflare 목적지 주소 인증
- Cloudflare 대시보드 접속: **Email** ➔ **Email Routing** ➔ **Destination addresses** ➔ 개인 이메일(예: `you@gmail.com`) 추가 후 인증 메일 확인.

### 3. 배포 및 활성화
```bash
# 저장소 클론 및 패키지 설치
git clone https://github.com/Sacilave/cf-mail2tg-aibot.git && cd cf-mail2tg-aibot
npm install

# KV 네임스페이스 생성 후 출력된 ID를 wrangler.jsonc의 kv_namespaces[0].id에 입력
npx wrangler kv namespace create MAIL_ROUTES_KV

# 필수 비밀값 설정
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_ADMIN_CHAT_ID
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET  # 강력 권장 (1단계에서 만든 값)

# Cloudflare 에지로 배포
npm run deploy
```

- **웹훅 등록 활성화**: 브라우저에서 `https://<your-worker>.<subdomain>.workers.dev/setup-webhook?secret=<YOUR_SECRET>` 접속 (`{"ok":true}` 반환 확인. `<YOUR_SECRET>`은 1단계의 `TELEGRAM_WEBHOOK_SECRET`와 정확히 일치해야 하며, Worker URL은 `npm run deploy` 출력에서 확인).
- **이메일 라우팅 연결**: Cloudflare 대시보드에서 내 도메인 선택 ➔ **Email** ➔ **Email Routing** ➔ 활성화 (필요한 MX 레코드가 자동 추가됩니다) ➔ **Routing rules** ➔ Catch-all 규칙 추가: **Send to Worker** ➔ `cf-mail2tg-aibot` 선택.
- **모바일에서 간편 마무리**: Telegram에서 봇에게 `/setup`을 전송하여 백업 Gmail(2단계에서 인증한 주소여야 합니다)과 LLM 키를 1분 만에 등록하세요 (터미널 재접속 불필요!).

#### 🤖 선택 사항: 지속적 배포 (CI/CD · GitHub Actions)
직접 포크하거나 클론하여 커스텀 개발을 진행할 때, `main` 브랜치 푸시 시 자동 배포를 원하시면:
1. [`.github/workflows/deploy.yml.example`](.github/workflows/deploy.yml.example)을 `.github/workflows/deploy.yml`로 변경합니다.
2. GitHub 저장소의 **Settings** ➔ **Secrets and variables** ➔ **Actions**에 `CLOUDFLARE_API_TOKEN` 시크릿을 추가합니다 (발급 방법: Cloudflare 대시보드 ➔ My Profile ➔ API Tokens ➔ 'Edit Cloudflare Workers' 템플릿으로 토큰 생성).
3. 이후 `main`에 코드를 푸시할 때마다 자동 테스트가 실행되고 Cloudflare Workers로 자동 배포됩니다.

---

## ⚡ 왜 cf-mail2tg-aibot인가? (비교 매트릭스)

| 비교 항목 | 일반 오픈소스 스크립트 | 유료 비즈니스 메일 (Google / Naver Works) | **cf-mail2tg-aibot (본 프로젝트)** |
| :--- | :--- | :--- | :--- |
| **월간 비용** | 무료 | 유저당 월 $6 ~ $18 (도메인 추가 시 기하급수적 증가) | **$0 (Cloudflare 무료 플랜으로 영구 구동)** |
| **무손실 전달** | ❌ Telegram API 병목 또는 네트워크 순단 시 유실 | ✅ 안정적 | **✅ Zero-Drop 듀얼 트랙 (네이티브 전달로 100% 무손실 보장)** |
| **첨부파일 방어** | ❌ 128MB 메모리 초과로 워커 크래시 발생 | 스토리지 추가 구매 필요 | **✅ 5MB 하드캡 + SMTP 550 제로 첨부파일 차단** |
| **스팸 폭격 방어** | ❌ 스팸 폭탄에 노출되어 TG 429 밴 유발 | 엔터프라이즈 WAF 규칙 직접 구성 필요 | **✅ 0.2ms 사전 슬라이딩 윈도우 빈도 제어로 CPU 98% 절감** |
| **의도 자동 분류** | ❌ 지원 안 함 (스팸 메일도 무차별 푸시) | 단순 휴리스틱 분류, 잦은 오탐 | **✅ LLM 6대 의도 분류 + 마케팅 메일 무음 푸시** |
| **인증번호 추출** | ❌ 본문 전체에서 수동 검색 및 복사 필요 | ❌ 자체 추출 미지원 | **✅ 최상단 `<code>` 블록 배치, 모바일에서 원터치 복사** |
| **운영 및 설정** | ❌ 규칙 변경 시마다 코드 수정 및 재배포 필요 | 복잡한 웹 콘솔 수동 설정 | **✅ Telegram 메시지 답장만으로 실시간 핫 리로드 완료** |

---

## 🏗️ 시스템 아키텍처

```mermaid
flowchart TD
    A["📨 수신 메일\n(사용자 지정 커스텀 도메인)"] --> B["☁️ Cloudflare Email Routing"]
    B --> C["🛡️ 방어 1: 메일 용량 하드캡 검사\n(> 5MB 초과 시 SMTP 552 즉시 거절)"]
    
    C -->|통과| D["⚡ 방어 2: 초고속 슬라이딩 윈도우 빈도 제어\n(0.2ms 스팸 폭격 사전 차단)"]
    
    D -->|통과| E["📦 PostalMime 심층 파싱\n& 방어 3: 첨부파일 보안 방어 (SMTP 550)"]
    
    E --> F{"3단계 노이즈 필터링 & AI 의도 분류"}
    F -->|레벨 1| G["RFC 8058 수신거부 헤더 감지 (0ms · 토큰 0소모)"]
    F -->|레벨 2| H["로컬 및 KV 필터 키워드 매칭 (0ms · 토큰 0소모)"]
    F -->|레벨 3| I["LLM 시맨틱 분석 (Workers AI / DeepSeek / Claude / OpenAI 등)"]
    
    G --> J1["🤖 동적 AI 의도 분류\n(인증/마케팅/경고/청구/업무/알림)"]
    H --> J1
    I --> J1

    E --> J2["📂 정적 페르소나 라우팅\n(개인/고객지원/비즈니스/제품/일반)"]

    J1 --> K["🚀 듀얼 트랙 파이프라인 디스패처"]
    J2 --> K
    K -->|기본 트랙| L["📥 Cloudflare 네이티브 Gmail 별칭 포워딩\n(완전 무손실 제로 드롭 보장)"]
    K -->|실시간 트랙| M["📱 Telegram 서식 카드 푸시 알림\n(인증번호 원터치 복사 / 마케팅 무음 전달)"]
```

---

## 🌟 핵심 기능

### 1. 🔄 Zero-Drop 듀얼 트랙 무손실 파이프라인
- **기본 트랙 (무손실 백업)**: 이메일이 워커에 도달하는 즉시 Cloudflare 네이티브 엔진을 통해 백업 사서함으로 전달됩니다. 도메인 페르소나에 따라 Gmail 별칭(예: `yourname+support@gmail.com`)으로 자동 라우팅을 지원합니다. Telegram 서버에 장애가 발생하더라도 **원본 이메일은 절대 유실되지 않습니다**.
- **실시간 트랙 (스마트 카드 알림)**: HTML 태그를 정제하고, Quoted-Printable 인코딩을 복원하여 가독성이 뛰어난 마크다운 카드로 Telegram에 즉시 전송합니다.
- **단일 트랙 모드**: 백업 이메일이 설정되어 있지 않은 경우, 오류 없이 순수 Telegram 알림 단일 모드로 부드럽게 동작합니다.

### 2. 🤖 멀티 LLM 공급업체 지원 & 원터치 인증번호 복사
- **완전 무료 에지 네이티브 AI**: **Cloudflare Workers AI**(`@cf/meta/llama-3.1-8b-instruct`)가 기본 내장되어 있어 **API 키 없이 100% 무료**로 구동됩니다. **DeepSeek**(초저비용·고지능), **Groq**(초고속 LPU 추론), **OpenAI**, **Google Gemini**, **Anthropic Claude**, **OpenRouter** 및 사용자 지정 OpenAI 호환 프록시를 완벽히 지원합니다.
- **6대 표준 의도 분류**: `🔐 인증`, `📢 마케팅`, `🚨 보안 경고`, `💰 청구/결제`, `💬 업무`, `🔔 알림`.
- **원터치 인증번호 복사**: 고정밀 정규식 탐지 엔진과 LLM 파싱을 결합하여 로그인 및 가입용 인증번호를 감지하고 최상단 `<code>` 블록에 단독 배치합니다. 스마트폰에서 **터치 한 번으로 즉시 복사**할 수 있습니다.
- **다국어 네이티브 스팸 키워드 사전 & 무음 전달**:
  - 시스템 언어를 지원 언어로 전환하면 지역별 비즈니스 메일 관례에 맞는 **원어민 수준의 지능형 마케팅 키워드**가 KV에 안전하게 자동 추가됩니다.
  - RFC 8058 수신거부 헤더 또는 키워드가 매칭되면 `disable_notification: true`로 **소리와 진동 없는 무음 알림**으로 조용히 전송됩니다.
- **Cloudflare 무료 할당량 보호**:
  - **사전 숏서킷**: 수신거부 헤더나 필터 키워드와 매칭된 메일은 AI 호출을 전면 생략하여 토큰 소모를 0으로 만듭니다.
  - **스마트 본문 요약**: LLM으로 전송되는 텍스트 길이를 800자로 엄격히 제한하여 지연 시간과 토큰 소모를 최소화합니다.
  - **메모리 캐시 & 쓰기 중복 제거**: 60초 메모리 캐시 및 해시 비교를 통해 KV 중복 쓰기를 건너뛰어 무료 할당량을 안전하게 보호합니다.

### 3. 🏷️ 2단계 태깅 아키텍처: 동적 AI 의도 + 수동 페르소나 라우팅
`cf-mail2tg-aibot`는 "메일의 실제 성격(의도)"과 "어느 사업/제품으로 온 것인가(페르소나)"를 명확히 분리합니다:

```
수신 이메일
├── 🤖 동적 AI 의도 태그 (본문 시맨틱 분석)
│   ├── 🔐 인증 (인증번호 추출, 고정폭 강조 표시, 우선순위 알림)
│   ├── 📢 마케팅 (RFC 수신거부/키워드 감지 -> 무음 푸시)
│   ├── 🚨 보안 경고 (계정 이상, 서버 모니터링, 긴급 알림)
│   ├── 💰 청구/결제 (인보이스, 결제 영수증, 정기 결제 갱신)
│   ├── 💬 업무 (비즈니스 협력, 클라이언트 문의, 개인 서신)
│   └── 🔔 알림 (GitHub 업데이트, 시스템 요약 알림)
│
└── 📂 수동 페르소나 라우팅 태그 (비즈니스 도메인)
    ├── 개인 (Personal) -> admin/me/hi 접두사 자동 매칭 (Gmail 별칭 +personal)
    ├── 고객지원 (Support) -> support/help/service 접두사 자동 매칭 (Gmail 별칭 +support)
    ├── 비즈니스 (Business) -> sales/billing/bd 접두사 자동 매칭 (Gmail 별칭 +business)
    ├── 제품 (Product) -> product/feedback/app 접두사 자동 매칭 (Gmail 별칭 +product)
    ├── 일반 (General) -> 기본 폴백
    └── ➕ 커스텀 카테고리 태그 -> 재무, 모니터링 등 자유로운 태그 생성 및 원터치 지정
```

### 4. 🛡️ 4단계 에지 방어 장갑 (Edge Armor)
- **Zero-Attachment Policy**: 첨부파일이 포함된 메일을 에지에서 SMTP 550으로 즉시 거절하여 Gmail 스토리지 소모와 악성코드 감염 위험을 원천 차단합니다.
- **5MB 용량 제한 하드캡**: 5MB를 초과하는 대용량 메일은 SMTP 552로 에지에서 즉각 튕겨내 워커 OOM 크래시와 CPU 고갈을 방지합니다.
- **사전 슬라이딩 윈도우 빈도 제어**: 메일 본문을 파싱하기 전에 발신자 빈도를 먼저 검사합니다. 스팸 폭격은 **0.2ms** 내에 종료되어 CPU를 98% 절감합니다.
- **Telegram 429 서킷 브레이커**: Telegram Bot API 429 Too Many Requests 발생 시 자동으로 30초 쿨다운에 들어가 요청 누적과 봇 밴을 방지합니다.

### 5. 🎛️ 모바일 Telegram 제어 센터
- **대화형 설정 마법사 (`/setup`)**: 1분 만에 백업 사서함과 AI 키를 등록하는 친절한 2단계 가이드.
- **실시간 상태 확인 (`/config`)**: 마스킹된 보안 키와 함께 전체 게이트웨이 구성을 한눈에 점검.
- **모바일 핫 업데이트 (`/setkey`)**: 채팅창에서 `/setkey minimax <키>` 또는 `/setkey forward <이메일>`을 전송하여 즉시 반영.
- **키워드 목록 수정 (`/keywords`)**: 봇이 보낸 키워드 목록 메시지에 직접 답장하여 실시간으로 편집 및 핫 리로드.
- **라우팅 규칙 관리 (`/routes`, `/add`, `/del`)**: 인라인 버튼과 대화상자를 통해 규칙 추가/삭제/확인 가능.

### 6. 🌐 10개 주요 언어 다국어 지원 및 즉시 전환
- **10개 언어 완벽 지원**: 🇨🇳 简体中文 (`zh-CN`), 🇺🇸 English (`en-US`), 🇭🇰 繁體中文 (`zh-TW`), 🇯🇵 日本語 (`ja-JP`), 🇰🇷 한국어 (`ko-KR`), 🇧🇷 Português (`pt-BR`), 🇷🇺 Русский (`ru-RU`), 🇪🇸 Español (`es-ES`), 🇫🇷 Français (`fr-FR`), 🇩🇪 Deutsch (`de-DE`).
- **전체 화면 완벽 현지화**: 이메일 푸시 카드, 인증번호 헤더, 보안 경고 카드, 설정 마법사, 제어 대시보드 및 Telegram Bot 메뉴 명령어가 네이티브 품질로 번역되어 제공됩니다.
- **인라인 언어 전환기 (`/lang`)**: `/lang`을 입력하면 5x2 버튼 그리드가 열리며(현재 언어에 `✓` 표시), `/lang ko`와 같이 코드를 직접 입력할 수도 있습니다.
- **4단계 우선순위 매칭**: `Cloudflare KV 동적 설정 (config:sys:system_language)` > `환경변수 (DEFAULT_LANGUAGE)` > `Telegram 클라이언트 언어 (language_code)` > `기본값 (zh-CN)`.

---

## 📱 Telegram 대화형 명령어

Telegram 채팅창 좌측 하단의 **[메뉴]** 버튼을 터치하거나 아래 명령어를 입력하세요:

| 명령어 | 매개변수 형식 | 설명 |
| :--- | :--- | :--- |
| `/start` | - | **👋 심플 개요**: `[⚙️ 설정]`, `[📖 사용 안내서]`, `[🌐 언어]` 바로가기가 포함된 상태 요약 |
| `/menu` | - | **⚙️ 설정 대시보드**: AI, 라우팅, 스팸 방어, 전달, 언어, 마법사를 관리하는 2x4 인라인 버튼 그리드 |
| `/guide` | - | **📖 상세 사용 안내서**: 워크플로, 의도 분류, 스팸 필터, 접두사 라우팅 가이드 |
| `/setup` | - | **⚡ 빠른 설정 마법사**: 1분 만에 핵심 자격 증명을 바인딩하는 2단계 대화형 마법사 |
| `/lang` | `[코드]` | 대화형 5x2 키보드 또는 언어 코드로 시스템 표시 언어 전환 (예: `/lang ko`, `/lang en`) |
| `/provider` | `[1~9\|이름]` | 대화형 AI 공급업체 전환 (1~9번 답장으로 Workers AI / DeepSeek / Groq / OpenAI 등 선택) |
| `/model` | `[1~2\|이름]` | 활성 공급업체의 모델 버전 대화형 변경 |
| `/cancel` | - | 진행 중인 설정 마법사 또는 대화형 세션 즉시 취소 |
| `/config` | - | 게이트웨이 가동 상태 및 마스킹된 자격 증명 확인 |
| `/setkey` | `<ai\|minimax\|forward> <값>` | 범용 AI/MiniMax 키 또는 백업 전달 이메일을 모바일에서 즉시 핫 업데이트 |
| `/resetkey` | `<ai\|provider\|model\|minimax\|forward>` | KV 동적 오버라이드를 초기화하고 기본 환경변수로 복원 |
| `/keywords` | - | 원터치 복사 가능한 코드 블록 형태로 마케팅 필터 키워드 확인 |
| `/addkeywords` | `<단어1>\n<단어2>` | 기존 키워드를 보존하며 안전하게 키워드 증분 추가 |
| `/resetkeywords` | - | 마케팅 필터 키워드를 시스템 기본값으로 복원 |
| `/routes` | - | 도메인 페르소나 프리셋 및 동적 KV 라우팅 규칙 확인, 커스텀 태그 관리 |
| `/add` | `<태그> <접두사> [전달대상]` | 새 라우팅 규칙 즉시 추가 (예: `/add 고객지원 help user@domain.com`) |
| `/del` | `<접두사>` | 대화형 확인 팝업과 함께 라우팅 규칙 안전 삭제 |
| `/help` | - | 전체 명령어 도움말 및 매뉴얼 확인 |

---

## 💰 완전 무료 & 무료 할당량 보장

본 프로젝트는 **Cloudflare Workers 무료 플랜**에 완벽히 최적화되어 있습니다:
- **CPU 시간**: 이메일 1건 처리 시 평균 ~0.5ms 소모 (무료 플랜 10ms 한도 대비 5% 미만).
- **메모리 점유율**: 제로 첨부파일 차단 및 5MB 용량 제한으로 에지 메모리가 128MB 한도 내에서 안전하게 유지됩니다.
- **KV 스토리지**: 일반 수신 메일은 경량 캐시 읽기만 발생하며, 규칙 업데이트 시 쓰기 1회가 발생합니다. 무료 플랜(일 100,000회 읽기, 1,000회 쓰기)의 0.1% 미만을 소모합니다.
- **과금 위험 차단**: Cloudflare 무료 계정은 신용카드 등록 없이도 생성 가능하며, 이상 트래픽 발생 시 HTTP 503으로 안전하게 튕겨내므로 **예상치 못한 과금 위험이 전혀 없습니다**.

---

## ❓ 자주 묻는 질문 (FAQ)

<details>
<summary><b>Q: 백업 이메일(FORWARD_TO_EMAIL) 없이 Telegram 봇 단독으로만 사용할 수 있나요?</b></summary>
네, 완전히 가능합니다! <code>FORWARD_TO_EMAIL</code>을 지정하지 않으면 게이트웨이가 단일 트랙 모드로 자동 동작하여 에러 없이 Telegram으로만 실시간 알림 카드를 전달합니다.
</details>

<details>
<summary><b>Q: 일부 알림 카드에서 SPF/DKIM에 "실패 (스푸핑 가능성)"라고 뜨는 이유는 무엇인가요?</b></summary>
이는 발신 서버의 설정 상태를 알려주는 보안 지표입니다. 일부 저품질 알림 메일 서버는 DKIM 서명이 누락되어 있을 수 있습니다. 게이트웨이는 이를 시각적으로 경고하고 해당 발신자에 대한 빈도 제한을 강화합니다.
</details>

<details>
<summary><b>Q: 유료 LLM API 키 없이도 사용할 수 있나요?</b></summary>
네! 기본 탑재된 <b>Cloudflare Workers AI</b>는 API 키 없이 100% 무료로 구동되며, AI 기능을 사용하지 않더라도 내장된 <b>초고속 정규식 탐지 엔진 및 로컬 RFC 규칙</b>을 통해 인증번호 추출과 스팸 필터링이 무료로 작동합니다.
</details>

<details>
<summary><b>Q: 여러 개의 도메인을 하나의 워커에 연결할 수 있나요?</b></summary>
네! Cloudflare는 무료 플랜에서도 무제한 도메인을 지원합니다. 각 도메인의 Catch-all 규칙을 동일한 <code>cf-mail2tg-aibot</code> Worker로 지정하기만 하면 게이트웨이가 수신 도메인을 자동 인식하여 격리된 페르소나 방어를 수행합니다.
</details>

---

## 📄 라이선스

본 프로젝트는 [MIT License](LICENSE)에 따라 자유롭게 배포 및 수정할 수 있습니다. 개인 및 상업적 용도로 자유롭게 활용하세요.
