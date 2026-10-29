<div align="center">

# 📬 cf-mail2tg-aibot

**基於 Cloudflare Workers 的生產級、零成本、自建郵件轉 Telegram AI 機器人**  
*Production-grade, zero-cost, self-hosted Email to Telegram AI Bot powered by Cloudflare Workers & LLM.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Telegram Bot API](https://img.shields.io/badge/Telegram-Bot%20API-2CA5E0?logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tests-148%20Passed-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![i18n](https://img.shields.io/badge/i18n-10%20Languages-blueviolet)](#-5-🌐-10-種主流語言國際化-i18n)
[![Zero Cost](https://img.shields.io/badge/Cost-%240%2Fmo%20Free-brightgreen)](#-零成本與免費配額保證)

<p align="center">
  <a href="./README.md">English</a> •
  <a href="./README.zh-CN.md">简体中文</a> •
  <b>繁體中文</b> •
  <a href="./README.ja-JP.md">日本語</a> •
  <a href="./README.ko-KR.md">한국어</a> •
  <a href="./README.pt-BR.md">Português</a> •
  <a href="./README.ru-RU.md">Русский</a> •
  <a href="./README.es-ES.md">Español</a> •
  <a href="./README.fr-FR.md">Français</a> •
  <a href="./README.de-DE.md">Deutsch</a>
</p>

<p align="center">
  <a href="#-截圖演示">截圖演示</a> •
  <a href="#-極速上手-兩種部署方式二選一推薦方式-a">快速部署 (二選一)</a> •
  <a href="#-核心特性">核心特性</a> •
  <a href="#-為什麼選擇-cf-mail2tg-aibot-對比矩陣">方案對比</a> •
  <a href="#-系統架構">系統架構</a> •
  <a href="#-telegram-互動指令">Bot 指令</a> •
  <a href="#-常見問答-faq">常見問答</a>
</p>

</div>

---

## 📖 專案定位

**`cf-mail2tg-aibot`** 是專為**獨立開發者（Indie Hackers）、出海團隊與多域名站長**打造的自建郵件網關。

利用 Cloudflare Workers 邊緣運算與免費的 Email Routing，它將發往你所有域名的郵件**深度解析、經過大模型語義審信與防垃圾降噪後，秒級推播到 Telegram Bot**；同時支援雙軌制（Zero-Drop）無損保底直轉個人 Gmail。徹底告別每個域名每年數十美元的企業信箱月費，享受即時通訊收信的極客體驗。

---

## 📸 截圖演示

以下均為真實運行實例的截圖，其中的郵箱地址、驗證碼、發票號等敏感欄位已全部替換為佔位內容。

### 🎛️ 機器人控制面板

| | |
| :---: | :---: |
| <img src="docs/screenshots/gateway-home.png" alt="網關主頁" width="100%"><br><sub>網關主頁——在線狀態、AI 引擎與備份轉發一目了然</sub> | <img src="docs/screenshots/settings.png" alt="設定面板" width="100%"><br><sub>設定面板——AI 供應商、路由画像、防垃圾與語言一站管理</sub> |

### 📬 郵件通知實景

| | |
| :---: | :---: |
| <img src="docs/screenshots/email-verification.png" alt="驗證碼郵件" width="100%"><br><sub>驗證碼郵件——驗證碼自動擷取並置頂，點擊即可複製</sub> | <img src="docs/screenshots/email-security-alert.png" alt="安全警報" width="100%"><br><sub>安全警報——釣魚郵件被識別並標出 SPF/DKIM 失敗</sub> |
| <img src="docs/screenshots/email-billing.png" alt="賬單郵件" width="100%"><br><sub>賬單郵件——發票資訊自動解析，附件一目了然</sub> | <img src="docs/screenshots/email-business.png" alt="商務合作" width="100%"><br><sub>商務合作——AI 分診自動標為優先處理</sub> |

<p align="center">
  <img src="docs/screenshots/email-marketing-muted.png" alt="行銷郵件" width="49%"><br>
  <sub>行銷郵件——促銷內容被垃圾規則自動靜默</sub>
</p>

---

## 🚀 極速上手 (兩種部署方式二選一，推薦方式 A)

> 📌 **【特別聲明：二選一即可】**：以下兩種部署方式**只需選擇其中一種即可**完成全部安裝，請**勿**重複操作！
> - **🟢 方式 A（強烈推薦·新手首選）**：**網頁一鍵極速部署** —— 免裝 Node.js/Git，無需終端機指令，在 Cloudflare 網頁後台 3 步點選，2 分鐘搞定；
> - **🔵 方式 B（開發者專用）**：**本機 CLI 終端機部署** —— 需電腦安裝 Node.js 22+ 與命令列，適合二次開發與程式碼除錯。

---

### 🟢 方式 A：2分鐘極速一鍵部署 (推薦 / 0 終端機·網頁即點即用)

> **💡 專為非技術新手設計**：全程無需在電腦安裝 Node.js、Git 或執行任何終端機指令，直接在 Cloudflare 官方網頁後台點選即可完成全部部署！

<p align="center">
  <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/Sacilave/cf-mail2tg-aibot">
    <img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare Workers" />
  </a>
</p>

#### 步驟 1：取得 Telegram 機器人憑據 (1 分鐘)
1. 在 Telegram 中私訊 [@BotFather](https://t.me/BotFather)，發送 `/newbot`，依提示為機器人命名，複製產生的 **`HTTP API Token`**（即 `TELEGRAM_BOT_TOKEN`）；
2. 私訊 [@userinfobot](https://t.me/userinfobot)，取得你個人的純數字 ID（即 `TELEGRAM_ADMIN_CHAT_ID`，僅你本人有權控制機器人）。

#### 步驟 2：點擊上方按鈕，網頁一鍵授權部署 (30 秒)
1. 點擊上方的 **`[Deploy to Cloudflare Workers]`** 按鈕（或[點擊此處直達網頁部署](https://deploy.workers.cloudflare.com/?url=https://github.com/Sacilave/cf-mail2tg-aibot)）；
2. 登入你的 Cloudflare 帳號，授權關聯 GitHub；
3. Cloudflare 會全自動建立全新的 KV 資料庫（`MAIL_ROUTES_KV`）及預設環境變數。在部署頁面填入剛才取得的兩個憑據：
   - `TELEGRAM_BOT_TOKEN`：你的 Bot Token
   - `TELEGRAM_ADMIN_CHAT_ID`：你的 Telegram 數字 Chat ID
4. 點擊 **Save and Deploy (儲存並部署)**，等待約 10 秒即部署上線！部署完成後，記下系統分配的 Worker 訪問網址（例如 `https://cf-mail2tg-aibot.xxx.workers.dev`）。

#### 步驟 3：在網域名稱開啟郵件路由，綁定 Worker (30 秒)
1. 在 Cloudflare 控制台左側進入你的網域名稱 ➔ **Email (電子郵件)** ➔ **Email Routing (電子郵件路由)**；
2. 如果先前未啟用，按網頁提示一鍵點擊開啟（Cloudflare 會全自動配置好所需的 DNS MX 記錄）；
3. 在 **Routing rules (路由規則)** 標籤頁中，點擊 **Add rule (新增規則)**（或編輯 Catch-all 規則）：
   - **Type (類型)**：選擇 **Catch-all rule (全部接收規則)**；
   - **Action (操作)**：選擇 **Send to Worker (發送到 Worker)**；
   - **Destination (目標)**：選中剛剛部署的 **`cf-mail2tg-aibot`** 並儲存；
4. **啟動並測試**：
   - 瀏覽器訪問一次 `https://<你的Worker網址>/setup-webhook` 啟動 Telegram Webhook；
   - 在 Telegram 中對你的 Bot 發送 `/start` 或 `/setup`，即可直接在手機端完成備份信箱與 AI 引擎配置！

---

### 🔵 方式 B：本機 CLI 終端機部署 (開發者除錯 / 二次開發)

**準備工作：**
- 一個免費的 Cloudflare 帳號，以及一個已添加到 Cloudflare 的域名（Email Routing 按域名啟用，第 3 步會為你的域名開啟）；
- 電腦已安裝 Node.js 22 或更高版本和 Git（第 3 步第一條 wrangler 指令會自動開啟瀏覽器讓你登入 Cloudflare）。

### 1. 獲取 Telegram 憑證
- 私聊 [@BotFather](https://t.me/BotFather) ➔ `/newbot` 獲取 `TELEGRAM_BOT_TOKEN`；
- 私聊 [@userinfobot](https://t.me/userinfobot) ➔ 獲取數字 ID 作為 `TELEGRAM_ADMIN_CHAT_ID`；
- 運行 `openssl rand -hex 32` ➔ 生成隨機字串作為 `TELEGRAM_WEBHOOK_SECRET`（可選但推薦；Windows 請在 Git Bash 裡運行）。

### 2. 驗證 Cloudflare 目標信箱
- 進入 Cloudflare 控制台：**Email** ➔ **Email Routing** ➔ **Destination addresses** ➔ 添加並驗證你的個人信箱（如 `you@gmail.com`）。

### 3. 一鍵部署與啟用
```bash
# 複製專案與安裝依賴
git clone https://github.com/Sacilave/cf-mail2tg-aibot.git && cd cf-mail2tg-aibot
npm install

# 建立 KV 並將輸出的 ID 填入 wrangler.jsonc (kv_namespaces[0].id)
npx wrangler kv namespace create MAIL_ROUTES_KV

# 設定核心金鑰
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_ADMIN_CHAT_ID
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET  # 強烈推薦，填第 1 步生成的值

# 部署上線
npm run deploy
```

- **啟用 Webhook**：瀏覽器造訪 `https://<你的Worker>.<子域>.workers.dev/setup-webhook?secret=<金鑰>`（返回 `{"ok":true}` 即註冊成功，`<金鑰>` 即第 1 步的 `TELEGRAM_WEBHOOK_SECRET`、須完全一致，Worker 地址見 `npm run deploy` 輸出）；
- **綁定路由**：在 Cloudflare 控制台選中你的域名 ➔ **Email** ➔ **Email Routing** ➔ 啟用（所需 MX 記錄會自動添加）➔ 在 **Routing rules** 中添加 Catch-all 規則：動作選 **Send to Worker** ➔ 綁定 `cf-mail2tg-aibot`；
- **手機完成配置**：在 Telegram 中對 Bot 發送 `/setup`，1 分鐘互動式綁定備份信箱（須為第 2 步驗證過的那個）與大模型 Key，無需回電腦打指令！

#### 🤖 可選：配置自動持續部署（Vibe Coding / GitHub Actions）
如果你 Fork 本專案用於二次開發（Vibe Coding），並希望每次向 `main` 分支提交程式碼時由 GitHub 自動部署到 Cloudflare：
1. 將 [`.github/workflows/deploy.yml.example`](.github/workflows/deploy.yml.example) 重新命名為 `.github/workflows/deploy.yml`；
2. 在你的 GitHub 倉庫中進入 **Settings** ➔ **Secrets and variables** ➔ **Actions** ➔ 添加 Secret：`CLOUDFLARE_API_TOKEN`（取得方式：Cloudflare 控制台 ➔ 我的個人資料 ➔ API 權杖 ➔ 建立具有「編輯 Cloudflare Workers」權限的權杖）；
3. 大功告成！之後每次 push 程式碼或在 GitHub Actions 頁面手動點選 "Run workflow"，都會自動通過單元測試並完成上線。
*(註：作為公開開源範本，預設不啟用自動部署，以避免使用者 Fork 後因未配置 Secret 而出現紅叉報錯。)*

---

## ⚡ 為什麼選擇 cf-mail2tg-aibot？ (對比矩陣)

| 核心維度 | 市面普通腳本 (Toy scripts) | 商業企業信箱 (Google Workspace / 飛書) | **cf-mail2tg-aibot (本專案)** |
| :--- | :--- | :--- | :--- |
| **月費成本** | 免費 | $6 ~ $18 / 使用者 / 月 (多域名時極其昂貴) | **$0 (永久運行於 Cloudflare 免費配額)** |
| **遺失信件保障** | ❌ Telegram API 波動或限流時直接丟信 | ✅ 正常接收 | **✅ 雙軌制保底 (底層無條件直轉 Gmail)** |
| **大檔案/附件防禦** | ❌ 容易擊穿 Worker 128MB 記憶體或爆容量 | 需付費購買額外擴容包 | **✅ 5MB 硬熔斷 + SMTP 550 零附件裝甲** |
| **抗轟炸頻控** | ❌ 易遭遇刷信攻擊導致 Bot 被 TG 429 封禁 | 需自建企業級 WAF 規則 | **✅ 0.2ms 滑動窗口短路保護，節省 98% CPU** |
| **郵件意圖識別** | ❌ 無，所有垃圾推廣一股腦彈窗轟炸 | 基礎規則過濾，常誤判 | **✅ LLM 語義識別 6 類意圖 + 行銷信靜音推播** |
| **驗證碼擷取** | ❌ 手動在長文本中翻找複製 | ❌ 原生無擷取 | **✅ 置頂獨立代碼區塊，手機端輕觸一鍵複製** |
| **維運管理** | ❌ 每次改規則必須重新打包代碼部署 | 網頁後台逐個設定 | **✅ 手機 Telegram 訊息直接回覆熱更新** |

---

## 🏗️ 系統架構

```mermaid
flowchart TD
    A["📨 外部入站郵件\n(發往你的自訂域名)"] --> B["☁️ Cloudflare Email Routing"]
    B --> C["🛡️ Defense 1: 體積硬上限檢查\n(> 5MB 秒級 SMTP 552 拒信)"]
    
    C -->|通過| D["⚡ Defense 2: 極速滑動窗口頻控\n(0.2ms 快速退出，防轟炸洗版)"]
    
    D -->|通過| E["📦 PostalMime 深度解析\n& Defense 3: 附件安全裝甲 (SMTP 550)"]
    
    E --> F{"三級加速降噪與 AI 意圖判定"}
    F -->|Level 1| G["RFC 8058 退訂標頭短路 (0ms·省Token)"]
    F -->|Level 2| H["本地/KV 關鍵字庫短路 (0ms·省Token)"]
    F -->|Level 3| I["LLM API 語義研判 (MiniMax / 相容模型)"]
    
    G --> J["🏷️ 意圖分流: 驗證 / 行銷 / 告警 / 帳單 / 業務 / 通知"]
    H --> J
    I --> J

    J --> K["🚀 雙軌管道分流"]
    K -->|保底軌 Primary| L["📥 Cloudflare 原生 forward 直達 Gmail 別名\n(絕對零遺失保障)"]
    K -->|通知軌 Instant| M["📱 Telegram 格式化卡片推播\n(驗證碼置頂複製 / 行銷郵件靜音免打擾)"]
```

---

## 🌟 核心特性

### 1. 🔄 雙軌制「零遺失」管道 (Zero-Drop Delivery)
- **保底軌**：郵件到達 Worker 瞬間，優先調用 Cloudflare 原生通道執行直轉。支援按產品輪廓分流至專屬 Gmail 別名（如 `yourname+support@gmail.com`）。即使 Telegram 網路抖動，**原始郵件也絕無遺失風險**。
- **通知軌**：深度清洗 HTML 標籤、自動規整 Quoted-Printable 與字元集，以優雅的 Telegram 卡片形式呈現。
- **純通知單軌模式**：若未配置備份信箱，系統自動優雅降級為純 Telegram 接收模式，零報錯運行。

### 2. 🤖 LLM 語義意圖識別與驗證碼置頂擷取
- **6 大標準化雙字意圖標籤**：`🔐 驗證`、`📢 行銷`、`🚨 告警`、`💰 帳單`、`💬 業務`、`🔔 通知`。
- **驗證碼一鍵複製**：內建高精度中英文正則嗅探引擎與大模型擷取能力，在卡片頂端單獨以 `<code>` 代碼區塊置頂展示，行動端**輕觸一次即可複製驗證碼**。
- **行銷推銷靜音降噪**：商業廣告與 SaaS 推銷郵件自動使用 `disable_notification: true` 進行**靜默推播（不響鈴、不震動）**，徹底消除通知焦慮。
- **大模型故障熔斷兜底**：若 LLM 介面欠費或逾時，系統堅持「先訊息提醒（響鈴）」，在卡片標註 `⚠️ LLM API失效 (已保底響鈴)`，絕不漏掉重要信件。

### 3. 🛡️ 四層邊緣縱深防禦體系 (Edge Armor)
- **零附件裝甲 (Zero-Attachment Policy)**：支援在邊緣直接以 SMTP 550 拒信攔截帶附件郵件，從物理層面杜絕惡意木馬及大檔案塞爆 Gmail 15GB 空間。
- **體積容量熔斷 (Size Cap)**：超過 5MB 郵件直接在邊緣返回 SMTP 552 拒信，杜絕 OOM 當機與 CPU 超額。
- **極速短路頻控 (Pre-Parse Rate Check)**：未解包前先查滑動窗口，被限流垃圾信在 **0.2ms 內退出**，節省 98% 運算算力。
- **Telegram 429 斷路器**：遭遇 TG 頻控時自動進入 30 秒熔斷冷卻期，防止請求堆積。

### 4. 🎛️ 手機端 Telegram 互動式控制面板與金鑰中樞
- **互動引導 (`/setup`)**：專為行動端打造的 1 分鐘互動式分步引導，按提示一步步輸入備份信箱與大模型 Key，輸入 `skip` 可跳過當前項，支援隨時 `/cancel` 退出；
- **發送 `/status`（或 `/config`）**：一鍵調出網關全局就緒狀態卡片，**敏感 Key 強制脫敏遮罩顯示**（如 `min***a8f9`），防止窺屏洩漏；
- **免電腦熱更新 Key (`/setkey`)**：直接在手機私聊發送 `/setkey minimax <新Key>` 或 `/setkey forward <新信箱>`，立刻持久化到 Cloudflare KV 並在邊緣端即時生效，告別電腦敲命令列；
- **重設動態配置 (`/resetkey`)**：一鍵清除 KV 動態覆蓋項，優雅回退至環境變數初始值；
- **發送 `/keywords`**：Bot 輸出當前生效的完整攔截詞清單，支援在手機端**一鍵複製全文**；
- **回覆即改**：直接在 Telegram 裡選擇「回覆 (Reply)」Bot 的訊息，貼上修改後的詞庫，網關自動全量熱更新並同步至 Cloudflare KV；
- **發送 `/routes`、`/add`、`/del`**：在手機端隨時添加新地址路由分流規則，刪除規則自帶 Inline Keyboard 二次確認。

### 5. 🌐 10 種主流語言國際化與一鍵切換 (i18n)
- **支援 10 種主流語言**：🇨🇳 簡體中文 (`zh-CN`)、🇺🇸 English (`en-US`)、🇭🇰 繁體中文 (`zh-TW`)、🇯🇵 日本語 (`ja-JP`)、🇰🇷 한국어 (`ko-KR`)、🇧🇷 Português (`pt-BR`)、🇷🇺 Русский (`ru-RU`)、🇪🇸 Español (`es-ES`)、🇫🇷 Français (`fr-FR`)、🇩🇪 Deutsch (`de-DE`)；
- **全鏈路本地化覆蓋**：包括入站郵件卡片推播、驗證碼擷取模組、安全與熔斷警報、互動式配置引導、控制面板與 Telegram 原生 Bot 選單指令；
- **即時互動切換 (`/lang`)**：在 Telegram 中發送 `/lang` 即可呼出 5x2 緊湊內聯鍵盤一鍵切換（當前語言附帶 `✓` 標記），或直接傳參快捷設定（如 `/lang ko`、`/lang pt`、`/lang en`）；
- **四級無縫優先級解析**：`Cloudflare KV 動態配置 (config:sys:system_language)` > `環境變數 (DEFAULT_LANGUAGE)` > `Telegram 客戶端語言上報 (language_code)` > `保底 (zh-CN)`；
- **零外部依賴與極致效能**：基於純 TypeScript 靜態型別字典樹構建，亞毫秒級（< 0.1ms）邊緣零記憶體開銷查找。
### 7. 📤 主動發信嚮導與一鍵 RFC 5322 會話回覆 (Outbound & Reply via Resend)
- **多步式發信互動嚮導 (`/send`)**：在 Telegram 中輕觸 5 步嚮導，依次完成發信身分選擇、收件人輸入、主題、內文排版（支援多行與 100KB 長度熔斷）及最終確認卡片，直通 Resend REST API 極速出站投遞；
- **RFC 5322 會話執行緒合規**：收到郵件後點擊 `[ ↩️ 回覆郵件 ]` 即刻啟動會話，自動補全 `Re: ` 前綴並攜帶 `In-Reply-To` 與 `References` 郵件頭，主流郵件用戶端自動完美折疊為單條會話流；
- **CRLF 注入深度封堵**：自動過濾並剔除換行符與控制字元（`\r\n\x00-\x1F`），徹底消除 SMTP/MIME 郵件標頭劫持隱患；
- **動態金鑰配置**：支援在 Telegram 中發送 `/setkey resend re_xxxxxx` 即刻綁定發信金鑰，免重新部署。

### 8. ⭐ 白名單免研判體系與動態快捷候選按鍵 (Whitelist & Quick-Pick)
- **0 Token 額度短路機制 (`/whitelist`)**：支援信箱與網域級白名單（`@company.com`），命中白名單的寄件人直接免除大模型研判，**0 Token 消耗，防誤判為行銷郵件**；
- **動態收件人候選面板**：主動發信嚮導（`/send`）第 1 步自動聚合白名單地址、最近 2 次入站寄件人與最近 2 次出站收件人為一鍵觸控按鍵，告別手機端手動輸入複雜長信箱。

### 9. 🎛️ 收信通知 5 合 1 互動操作台 (5-in-1 Action Console)
每封推送到 Telegram 的郵件通知卡片底部均附帶 5 個高頻功能按鍵：
- **`[ ↩️ 回覆郵件 ]`**：一鍵啟動上下文回覆；
- **`[ 🤖 AI 總結 ]`**：基於 Humanizer 實用主義風格設計，去除 AI 套話，提煉核心主旨、關鍵事實與後續行動項。支援多語言自適應，首次提煉後自動寫入 KV 快取（後續點擊 0 Token 秒開）；
- **`[ 🌐 AI 翻譯 ]`**：全文去機械感高保真翻譯，雙語主題對照，內建 2800 字元防溢出截斷保護；
- **`[ 📋 複製內文 ]`**：發送 `<pre><code>` 單觸即拷代碼塊，手機輕按一鍵拷貝全文；
- **`[ 📖 查看完整原文 ]`**：直達輕量 Web 閱讀器（`GET /view/:replyId`），自帶 Strict CSP 安全沙箱與暗黑模式，徹底解決 Telegram 4096 字元上限截斷痛點。

---

## 📱 Telegram 互動指令

直接在 Telegram 聊天視窗中點擊左下角 **[Menu]** 按鈕或輸入以下指令：

| 指令 | 參數格式 | 功能描述 |
| :--- | :--- | :--- |
| `/lang` | `[語言代號]` | 切換系統顯示語言，支援 5x2 互動式內嵌鍵盤切換或直接傳參 (如 `/lang ko`、`/lang pt`、`/lang en`) |
| `/setup` | - | 啟動互動式分步極速配置引導 (1 分鐘帶你完成核心憑證綁定) |
| `/cancel` | - | 退出當前引導或對話，重設互動狀態 |
| `/status` | - | **📊 運行狀態**：查看網關就緒狀態與金鑰綁定情況 (帶安全脫敏遮罩，支援 `/config` 別名) |
| `/settings` | - | **⚙️ 設定面板**：以 2x4 內聯按鍵面板層級化管理所有設定 (支援 `/menu` 別名) |
| `/setkey` | `<minimax\|forward> <值>` | 手機端熱更新大模型金鑰或備份轉發信箱，即刻持久化保存至 KV |
| `/resetkey` | `<minimax\|forward>` | 清除 KV 動態覆蓋項，一鍵恢復至部署時綁定的初始環境變數 |
| `/keywords` | - | 查看並生成帶 `<pre><code>` 代碼區塊的全部行銷關鍵字，便於手機一鍵複製 |
| `/addkeywords` | `<詞1>\n<詞2>` | 安全增量追加關鍵字至現有詞庫（自動去重，絕不覆蓋已有詞） |
| `/resetkeywords` | - | 一鍵重設清空自訂詞庫，恢復系統預設的標準基線關鍵字 |
| `/routes` | - | 查看當前生效的內建輪廓規則與 KV 動態路由規則 |
| `/add` | `<標籤> <前綴> [目標]` | 動態添加分流規則，如 `/add 商業支持 help user@domain.com` |
| `/del` | `<前綴>` | 刪除指定前綴規則（彈出帶確認/取消按鈕的二次確認卡片） |
| `/help` | - | 查看網關操作面板指南與當前狀態 |

---

## 💰 零成本與免費配額保證

本專案專門針對 **Cloudflare Workers 免費計劃 (Free Tier)** 進行了極致優化：
- **CPU 運算開銷**：單封郵件均值運算僅約 0.5ms，遠低於免費額度的 10ms 限制；
- **記憶體安全**：全量附件防禦與 5MB 體積熔斷，杜絕突破 128MB 邊緣記憶體配額；
- **KV 儲存**：日常收信產生極輕量快取讀取，更新規則時產生 1 次寫入，使用量不足免費額度（每天 100,000 次讀、1,000 次寫）的 0.1%；
- **計費硬隔離**：Cloudflare 免費帳戶不綁定信用卡機制，任何異常超限僅觸發 HTTP 503 阻斷，**絕對無法產生任何帳單或扣費**。

---

## ❓ 常見問答 (FAQ)

<details>
<summary><b>Q: 如果不配置備份信箱 (FORWARD_TO_EMAIL)，可以只當純 Telegram 機器人用嗎？</b></summary>
完全可以！未配置 <code>FORWARD_TO_EMAIL</code> 時，網關自動以單軌模式運作，僅向 Telegram 即時推播通知卡片，不會產生任何錯誤。
</details>

<details>
<summary><b>Q: 為什麼卡片上的 SPF/DKIM 顯示「未通過 (疑似仿冒來源)」？</b></summary>
這是正常安全防禦提示。一些自動化通知或未規範配置反垃圾解析的郵件伺服器發出的信件未通過鑑真，網關會在卡片中以醒目標誌提醒防範釣魚，並自動對該來源收緊頻控配額。
</details>

<details>
<summary><b>Q: 不配置大模型 API Key 還可以使用嗎？</b></summary>
可以！完全不需要 Key：網關預設使用預先配置的 <b>Cloudflare Workers AI</b>，100% 免費、零 API Key。即便大模型暫時不可用，內建的<b>高效能正則嗅探引擎與本地 RFC 規則庫</b>依然可以精準識別驗證碼與大部分行銷推廣郵件；想換 DeepSeek / OpenAI 等服務商，隨時用 <code>/setup</code> 綁定 Key 即可。
</details>

<details>
<summary><b>Q: 多個域名可以使用同一個 Worker 網關嗎？</b></summary>
可以！Cloudflare 免費帳戶支援添加多個域名，每個域名的 Email Routing Catch-all 規則均可直接選擇指向同一個 <code>cf-mail2tg-aibot</code> Worker，網关會自動識別收件域名並實現隔離防禦。
</details>

---

## 📄 開源授權條款

本專案採用 [MIT License](LICENSE) 授權條款，歡迎自由 Fork、修改或用於個人/團隊自建服務。
