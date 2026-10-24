<div align="center">

# 📬 cf-mail2tg-aibot

**Production-grade, zero-cost, self-hosted Email-to-Telegram AI Bot powered by Cloudflare Workers & LLM.**  
*基于 Cloudflare Workers 的生产级、零成本、自建邮件转 Telegram AI 机器人*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Telegram Bot API](https://img.shields.io/badge/Telegram-Bot%20API-2CA5E0?logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tests-114%20Passed-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![i18n](https://img.shields.io/badge/i18n-8%20Languages-blueviolet)](#-5--8-mainstream-languages-i18n--instant-switching)
[![Zero Cost](https://img.shields.io/badge/Cost-%240%2Fmo%20Free-brightgreen)](#-zero-cost--free-quota-guarantee)

<p align="center">
  <b>English</b> •
  <a href="./README.zh-CN.md">简体中文</a> •
  <a href="./README.zh-TW.md">繁體中文</a> •
  <a href="./README.ja-JP.md">日本語</a> •
  <a href="./README.ru-RU.md">Русский</a> •
  <a href="./README.es-ES.md">Español</a> •
  <a href="./README.fr-FR.md">Français</a> •
  <a href="./README.de-DE.md">Deutsch</a>
</p>

<p align="center">
  <a href="#-quick-start-3-steps">Quick Start</a> •
  <a href="#-why-cf-mail2tg-aibot-comparison-matrix">Comparison Matrix</a> •
  <a href="#️-system-architecture">Architecture</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-telegram-interactive-commands">Bot Commands</a> •
  <a href="#-faq">FAQ</a>
</p>

</div>

---

## 📖 Project Overview

**`cf-mail2tg-aibot`** is a self-hosted email gateway engineered specifically for **Indie Hackers, global development teams, and multi-domain webmasters**.

Leveraging Cloudflare Workers edge computing and free Email Routing, it **deep-parses incoming emails, filters spam/noise, performs LLM semantic triage, and delivers beautifully formatted cards to Telegram in seconds**. Simultaneously, its Zero-Drop dual-track pipeline forwards uncompressed raw emails directly to your personal backup mailbox (e.g., Gmail aliases). Say goodbye to expensive business email subscriptions ($6–$18/user/mo across multiple domains) and embrace a lightweight, cost-free, real-time email receiving workflow.

---

## 🚀 Quick Start (3 Steps)

### 1. Get Telegram Credentials
- Message [@BotFather](https://t.me/BotFather) ➔ `/newbot` ➔ copy `TELEGRAM_BOT_TOKEN`.
- Message [@userinfobot](https://t.me/userinfobot) ➔ copy your user ID as `TELEGRAM_ADMIN_CHAT_ID`.

### 2. Verify Cloudflare Destination Address
- In Cloudflare Dashboard: **Email** ➔ **Email Routing** ➔ **Destination addresses** ➔ Add and verify your personal email (e.g. `you@gmail.com`).

### 3. Deploy & Activate
```bash
# Clone & install dependencies
git clone https://github.com/your-username/cf-mail2tg-aibot.git && cd cf-mail2tg-aibot
npm install

# Create KV and paste returned ID into wrangler.jsonc (kv_namespaces[0].id)
npx wrangler kv namespace create MAIL_ROUTES_KV

# Set required credentials
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_ADMIN_CHAT_ID
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET  # Strongly recommended

# Deploy to Cloudflare edge
npm run deploy
```

- **Activate Webhook**: Open `https://<your-worker>.<subdomain>.workers.dev/setup-webhook?secret=<YOUR_SECRET>` in browser (returns `{"ok":true}`).
- **Route Emails**: In Cloudflare **Email Routing** ➔ **Routing rules** ➔ Add Catch-all: **Send to Worker** ➔ Select `cf-mail2tg-aibot`.
- **Finish on Mobile**: In Telegram, send `/setup` to Bot to bind your backup Gmail and LLM Key in 1 minute—no terminal required!

#### 🤖 Optional: Continuous Deployment (Vibe Coding / GitHub Actions)
If you fork or clone this repository for customized development (vibe coding) and want pushes to `main` to automatically deploy to Cloudflare:
1. Rename [`.github/workflows/deploy.yml.example`](.github/workflows/deploy.yml.example) to `.github/workflows/deploy.yml`.
2. In your GitHub repository: **Settings** ➔ **Secrets and variables** ➔ **Actions** ➔ Add repository secret `CLOUDFLARE_API_TOKEN`.
3. Every push to `main` (or manual trigger in the Actions tab) will run automated tests and deploy to Cloudflare Workers automatically!
*(Note: As an open template, automatic deployment is intentionally disabled by default to prevent failed CI checks before Cloudflare secrets are configured.)*

---

## ⚡ Why cf-mail2tg-aibot? (Comparison Matrix)

| Dimension | Generic Open-Source Scripts | Paid Business Inboxes (Google / Feishu) | **cf-mail2tg-aibot (This Project)** |
| :--- | :--- | :--- | :--- |
| **Monthly Cost** | Free | $6 ~ $18 / user / mo (exponentially pricey across domains) | **$0 (Runs permanently on Cloudflare Free Tier)** |
| **Zero-Drop Delivery** | ❌ Lost during Telegram API throttling or network jitters | ✅ Reliable | **✅ Zero-Drop Dual-Track (Unconditional native forwarding fallback)** |
| **Attachment Defense** | ❌ Easy crash on 128MB Worker memory limit or disk quota | Costly storage expansion packs | **✅ 5MB Hard Cap + SMTP 550 Zero-Attachment Armor** |
| **Anti-Flooding Protection** | ❌ Vulnerable to spam bombing leading to TG 429 bans | Requires custom enterprise WAF rules | **✅ 0.2ms Pre-parse sliding-window rate limit, saving 98% CPU** |
| **Intent Classification** | ❌ None, spam barrages fire constant notifications | Basic heuristics, prone to false positives | **✅ LLM triage for 6 intents + silent push for marketing** |
| **Code Extraction** | ❌ Manual search & copy from bloated email bodies | ❌ No native extraction | **✅ Pinned `<code>` block, 1-tap copy on mobile devices** |
| **Ops & Configuration** | ❌ Re-build & re-deploy code on every rule change | Manual web dashboard configuration | **✅ Direct Telegram message replies for instant hot updates** |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    A["📨 Inbound Emails\n(Sent to your custom domains)"] --> B["☁️ Cloudflare Email Routing"]
    B --> C["🛡️ Defense 1: Hard Size Cap Check\n(> 5MB instant reject with SMTP 552)"]
    
    C -->|Pass| D["⚡ Defense 2: Ultra-fast Sliding Window Rate Check\n(0.2ms fast exit against spam bombing)"]
    
    D -->|Pass| E["📦 PostalMime Deep Parsing\n& Defense 3: Attachment Armor (SMTP 550)"]
    
    E --> F{"3-Tier Noise Reduction & AI Triage"}
    F -->|Level 1| G["RFC 8058 List-Unsubscribe Header (0ms · Token-free)"]
    F -->|Level 2| H["Local & KV Filter Keywords (0ms · Token-free)"]
    F -->|Level 3| I["LLM Semantic Analysis (MiniMax / Compatible)"]
    
    G --> J["🏷️ Intent Triage: Verification / Marketing / Alert / Billing / Business / Notification"]
    H --> J
    I --> J

    J --> K["🚀 Dual-Track Pipeline Dispatcher"]
    K -->|Primary Track| L["📥 Native Cloudflare forward to Gmail alias\n(Absolute Zero-Drop Assurance)"]
    K -->|Instant Track| M["📱 Telegram formatted card notification\n(1-tap copy code / silent push for marketing)"]
```

---

## 🌟 Key Features

### 1. 🔄 Zero-Drop Dual-Track Pipeline
- **Primary Track (Lossless Backup)**: The moment an email hits the Worker, Cloudflare's native forward engine delivers it directly to your designated inbox. Supports domain persona routing to dedicated Gmail aliases (e.g., `yourname+support@gmail.com`). Even during Telegram outages, **your raw emails are never lost**.
- **Instant Track (Push Notification)**: Automatically cleans HTML formatting, fixes Quoted-Printable encoding, and renders an elegant markdown card on Telegram.
- **Single-Track Mode**: When no backup email is configured, the gateway gracefully degrades to pure Telegram push mode with zero errors.

### 2. 🤖 LLM Semantic Triage & 1-Tap Verification Code Extraction
- **6 Standardized Intent Categories**: `🔐 Verification`, `📢 Marketing`, `🚨 Security Alert`, `💰 Billing`, `💬 Business`, `🔔 Notification`.
- **1-Tap Code Copy**: Built-in high-precision regex sniffing engine alongside LLM parsing extracts authentication codes and displays them in a top-level `<code>` block—**tap once on your phone to copy**.
- **Silent Marketing Push**: Marketing and SaaS promotional emails automatically trigger with `disable_notification: true` for **silent delivery (no sound, no vibration)**, eliminating notification fatigue.
- **Fail-Safe Circuit Breaker**: If LLM quotas expire or time out, the system defaults to loud notifications marked `⚠️ LLM API Offline (Alert Sound Preserved)`, ensuring critical messages are never missed.

### 3. 🛡️ 4-Layer Edge Armor Defense
- **Zero-Attachment Policy**: Reject incoming emails containing binary attachments at the edge using SMTP 550, safeguarding your Gmail quota and eliminating malware risks.
- **Size Cap Hard Limit**: Emails exceeding 5MB are immediately rejected with SMTP 552 at the edge, preventing OOM crashes and CPU exhaustion.
- **Pre-Parse Rate Limiting**: Checks sender sliding windows before unpacking email bodies; rate-limited spam exits within **0.2ms**, cutting CPU consumption by 98%.
- **Telegram 429 Circuit Breaker**: Automatically engages a 30-second cooldown period when Telegram API rate limits occur to prevent request pileups.

### 4. 🎛️ Mobile Telegram Control Panel & Key Management Hub
- **Interactive Setup Wizard (`/setup`)**: A 1-minute mobile-friendly step-by-step wizard to bind your backup inbox and LLM API key; enter `skip` to bypass any step, or `/cancel` anytime.
- **Global Status (`/config`)**: View gateway status with **security masking on sensitive keys** (e.g., `min***a8f9`).
- **Mobile Hot-Updates (`/setkey`)**: Send `/setkey minimax <NewKey>` or `/setkey forward <NewEmail>` in private chat to persist updates to Cloudflare KV in real time—no terminal needed.
- **Dynamic Config Reset (`/resetkey`)**: Clear KV dynamic overrides and effortlessly fall back to environment variable defaults.
- **Keyword Management (`/keywords`)**: Generate a clean, 1-tap copyable list of marketing filter keywords.
- **Reply-to-Update**: Simply reply to the Bot's keyword message with your modified wordlist to perform an instant full hot-reload into Cloudflare KV.
- **Routing Rules (`/routes`, `/add`, `/del`)**: Inspect domain persona rules and dynamically add/remove prefix routing with interactive confirmation buttons.

### 5. 🌐 8 Mainstream Languages i18n & Instant Switching
- **8 Supported Languages**: 🇨🇳 Simplified Chinese (`zh-CN`), 🇺🇸 English (`en-US`), 🇭🇰 Traditional Chinese (`zh-TW`), 🇯🇵 Japanese (`ja-JP`), 🇷🇺 Russian (`ru-RU`), 🇪🇸 Spanish (`es-ES`), 🇫🇷 French (`fr-FR`), 🇩🇪 German (`de-DE`).
- **End-to-End Localization**: Email notification cards, verification code banners, security alerts, setup wizards, control panels, and native Telegram Bot menu commands are fully localized.
- **Instant Switcher (`/lang`)**: Send `/lang` to invoke a 4x2 inline button matrix (the active language is marked with `✓`), or supply a code directly (e.g., `/lang en`, `/lang ja`).
- **4-Tier Priority Resolution**: `Cloudflare KV dynamic setting (config:sys:system_language)` > `Environment variable (DEFAULT_LANGUAGE)` > `Telegram client language (language_code)` > `Fallback default (zh-CN)`.
- **Sub-millisecond Zero Overhead**: Built on static TypeScript dictionary trees with sub-millisecond (< 0.1ms) execution and zero edge memory penalty.

---

## 📱 Telegram Interactive Commands

Tap the **[Menu]** button at the bottom-left of the Telegram chat or send any command below:

| Command | Parameter Format | Description |
| :--- | :--- | :--- |
| `/lang` | `[code]` | Switch system language via interactive 4x2 keyboard or direct code (e.g. `/lang en`, `/lang ja`) |
| `/setup` | - | Launch 1-minute step-by-step interactive setup wizard |
| `/cancel` | - | Exit active setup wizard or session, resetting interactive state |
| `/config` | - | Inspect gateway readiness status and masked credentials |
| `/setkey` | `<minimax\|forward> <value>` | Hot-update LLM API key or backup forwarding email into KV directly from mobile |
| `/resetkey` | `<minimax\|forward>` | Reset dynamic KV override and restore deployment defaults |
| `/keywords` | - | Display all active marketing filter keywords in copyable code block |
| `/addkeywords` | `<word1>\n<word2>` | Safely append marketing filter keywords with deduplication |
| `/resetkeywords` | - | Reset marketing keywords to default baseline |
| `/routes` | - | View system persona presets and dynamic KV routing rules |
| `/add` | `<tag> <prefix> [forward]` | Dynamically add custom route (e.g. `/add Commercial help user@domain.com`) |
| `/del` | `<prefix>` | Delete route rule with interactive confirmation dialog |
| `/help` | - | Display operation manual and gateway status |

---

## 💰 Zero Cost & Free Quota Guarantee

This project is tailored for the **Cloudflare Workers Free Tier**:
- **CPU Time**: Average email processing consumes ~0.5ms, well below the free 10ms limit.
- **Memory Footprint**: Complete attachment defense and a 5MB size cap guarantee edge memory stays safely within the 128MB limit.
- **KV Storage**: Routine incoming emails generate lightweight cache reads. Rule updates cost 1 write. Overall usage accounts for < 0.1% of the free quota (100,000 reads, 1,000 writes daily).
- **Billing Isolation**: Cloudflare Free accounts do not require credit card attachments; anomalous traffic spikes only trigger HTTP 503 drops with **zero risk of unexpected charges**.

---

## ❓ FAQ

<details>
<summary><b>Q: Can I use this purely as a Telegram Bot without a backup forwarding email (FORWARD_TO_EMAIL)?</b></summary>
Absolutely! When <code>FORWARD_TO_EMAIL</code> is omitted, the gateway operates in single-track mode, pushing real-time cards solely to Telegram without errors.
</details>

<details>
<summary><b>Q: Why does SPF/DKIM show "Failed (Possible Spoofing Source)" on some cards?</b></summary>
This is an automated security advisory. Certain notifications or poorly configured mail servers lack proper DKIM/SPF alignment. The gateway flags these with visual indicators to warn against phishing and tightens rate-limiting thresholds on that sender.
</details>

<details>
<summary><b>Q: Can I use the bot without an LLM API Key?</b></summary>
Yes! If <code>MINIMAX_API_KEY</code> is not provided, the gateway automatically falls back to its built-in <b>high-performance regex sniffing engine and local RFC rule library</b>, accurately detecting verification codes and common marketing emails at zero cost.
</details>

<details>
<summary><b>Q: Can I route multiple custom domains to a single Worker gateway?</b></summary>
Yes! Cloudflare allows unlimited domains on free plans. Set the Catch-all rule for each domain to forward to the same <code>cf-mail2tg-aibot</code> Worker. The gateway automatically detects the receiving domain and manages isolated persona defense.
</details>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to fork, modify, or host it for personal and commercial applications.
