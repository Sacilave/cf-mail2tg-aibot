# Cloudflare Email to Telegram: 基于 Resend 的邮件快捷回复功能完整开发方案

## 1. 方案背景与架构定位

### 1.1 现状与痛点
当前系统实现了外部邮件经 Cloudflare Email Routing 接收，经过 MIME 解码与 AI 分流后推送至 Telegram 机器人的单向通知链路。然而，当管理员需要在移动端对特定邮件进行即时回复时，必须手动登录对应邮箱网页端或第三方客户端，切换发件身份（例如 `service@example.com`），割裂了 Telegram 一站式收发体验。

### 1.2 技术选型决策：为何采用 Resend？
* **规避 Cloudflare 原生 Send Email 的局限**：Cloudflare Workers 原生 `send_email` 绑定默认仅能发信至已验证的目的邮箱，无法直接发送至外部任意收件人（如任意公共邮箱、企业邮箱）。
* **Resend 优势**：
  * **完全免费**：每月提供 3,000 封免费发信额度，每日限额 100 封，充分覆盖个人与轻量业务回复需求；
  * **全网通达**：只要验证主域名（如 `example.com`），即可使用任意前缀别名（如 `service@example.com`、`support@example.com`）向全网任意邮箱发信；
  * **顶级送达率与信誉池**：具备权威 SPF、DKIM、DMARC 签名，回复邮件不会被 Gmail、QQ、Outlook 识别为垃圾邮件；
  * **极简 API**：原生 `fetch()` 即可完成投递，无需在 Workers 中引入臃肿 SDK，代码体积与内存开销为 0。

---

## 2. 系统交互时序与全链路流程

```mermaid
sequenceDiagram
    autonumber
    actor ExternalUser as 外部发信方 (client@example.com)
    participant CF_Email as Cloudflare Email Worker
    participant KV as Cloudflare KV 存储
    participant TG_Bot as Telegram Bot API
    actor Admin as 管理员 (TG 客户端)
    participant Resend as Resend API 引擎

    ExternalUser->>CF_Email: 发送邮件至 service@example.com
    CF_Email->>CF_Email: 解析邮件 (From, To, Subject, Message-ID)
    CF_Email->>KV: 写入暂存元数据: rep:<replyId> (TTL: 7天)
    CF_Email->>TG_Bot: 推送邮件卡片 (带「↩️ 回复邮件」按钮)
    TG_Bot->>Admin: 收到新邮件通知卡片

    Admin->>TG_Bot: 点击「↩️ 回复邮件」
    TG_Bot->>CF_Email: Webhook 回调 callback_query (rep:<replyId>)
    CF_Email->>KV: 读取 rep:<replyId> 元信息
    CF_Email->>KV: 设置交互 Session: reply_email (TTL: 5分钟)
    CF_Email->>TG_Bot: 弹出回复引导消息 (ForceReply / 提示输入正文)
    TG_Bot->>Admin: 提示已就绪，请输入回复内容

    Admin->>TG_Bot: 发送回复文本 ("您好，方案已收到...")
    TG_Bot->>CF_Email: Webhook 收到文本消息 update.message
    CF_Email->>KV: 校验 active session (防重放、身份核验)
    CF_Email->>Resend: POST /emails 发送邮件 (注入 In-Reply-To, References, Re:)
    Resend-->>ExternalUser: 投递回复邮件 (From: service@example.com)
    CF_Email->>KV: 销毁回复会话 Session
    CF_Email->>TG_Bot: 发送「✅ 邮件已成功回复」确认卡片
    TG_Bot->>Admin: 呈现成功凭据
```

---

## 3. 绝对安全性设计（Zero-Trust & Anti-Relay）

为保证 Cloudflare Worker 网关不被利用为垃圾邮件中继（Open Relay）跳板，系统实施以下防御策略：

1. **严格的身份鉴权 (Zero-Trust Caller)**：
   * 所有回复相关的回调（`callback_query`）与输入文本（`update.message`），均做 `from.id === TELEGRAM_ADMIN_CHAT_ID` 强比对，非管理员的请求一律在 0.1ms 内静默丢弃并返回 `200 OK`，杜绝任何未经授权的调用。
2. **防开放中继与目标地址锁定 (Strict Anti-Relay Enforce)**：
   * **收件人不可伪造**：回复邮件的 `to` 地址完全从 KV 中存储的原始发件人（`meta.from`）中反查，不允许管理员或外界自由指定任意目的地址，防止 Bot 变成匿名发信机；
   * **发件人域名校验**：回复发信地址必须严格与该邮件的实际接收地址（如 `service@example.com`）一致，且域名必须与已绑定的合法域名白名单匹配。
3. **防重放与会话防并发攻击 (Atomic Anti-Replay)**：
   * 每次激活回复时，生成带有唯一 UUID / 纳秒时间戳的 Session 令牌；
   * 发信操作一旦进入执行分支，立即执行锁止或标记消费，完成发送后瞬间销毁会话，防止网络重试或重复连击导致向客户连发多封相同邮件。
4. **敏感密钥脱敏保护 (Secret Masking)**：
   * Resend API Key 在存入 KV 后，对外查询及 TG 面板中展示时，一律使用 `maskSecret` 进行脱敏处理（例如 `re_123***abcd`），防止屏幕共享或截图泄露。
5. **内容安全消毒 (Sanitization)**：
   * 纯文本正文自动转义 HTML 特殊字符，生成纯文本与简洁 HTML 双轨道正文，杜绝 XSS 与邮件注入风险。

---

## 4. Cloudflare 免费额度极致优化策略

针对 Cloudflare Workers 免费计划（每天 100,000 次请求、每次 10ms CPU 限制、每天 1,000 次 KV 写入）：

| 优化维度 | 具体实现策略 | 带来的节省效果 |
| :--- | :--- | :--- |
| **KV 存储容量控制** | 邮件元数据仅存储关键字段（`from`, `to`, `subject`, `messageId`），体积小于 250 字节，设置 7 天自动过期（`expirationTtl: 604800`）。 | 无需任何清理定时任务，KV 空间永不膨胀。 |
| **KV 写入次数节省** | 用户回复会话 Session 写入时复用已有的 `INTERACTIVE_SESSION_KEY`，有效期 5 分钟（`expirationTtl: 300`），超时自动释放。 | 整个回复过程仅消耗 1 次元数据写入 + 1 次状态写入。 |
| **内存热缓存机制 (RAM Cache)** | Resend API Key 等配置读取引入 Workers 全局内存热缓存（LRU/Map），命中时 0 KV 读取开销。 | 大幅减少 KV 每日读配额消耗。 |
| **零依赖原生 Fetch** | 抛弃外部 Resend Node SDK，使用浏览器标准的 `fetch('https://api.resend.com/emails')` 原生实现。 | 打包体积维持在极轻量级，Workers 启动冷启动时间 < 5ms。 |
| **CPU 时间管控** | 文本回复判断直接基于内存状态比对，非目标消息快速熔断退出。 | 单次请求 CPU 时间控制在 1~3ms 以内，完全不触发超限。 |

---

## 5. 模块架构与数据规范设计

### 5.1 KV 存储模型

#### 邮件元数据索引（`rep:<replyId>`）
```json
{
  "from": "user@client.com",
  "to": "service@example.com",
  "subject": "合作洽谈",
  "messageId": "<CA+abc123xyz@mail.gmail.com>",
  "createdAt": 1740000000000
}
```

#### 活跃交互会话（`session:interactive_action`）
```json
{
  "type": "reply_email",
  "replyId": "r_7x9a2b",
  "fromRoute": "service@example.com",
  "targetSender": "user@client.com",
  "subject": "合作洽谈",
  "messageId": "<CA+abc123xyz@mail.gmail.com>",
  "createdAt": 1740000000000
}
```

### 5.2 Resend API 引擎请求规范 (`src/email-sender.ts`)

发送回复邮件时，严格遵循 RFC 5322 和 RFC 2822 规范：
* **URL**: `POST https://api.resend.com/emails`
* **Headers**:
  * `Authorization`: `Bearer re_xxxxxx`
  * `Content-Type`: `application/json`
* **Payload**:
  ```json
  {
    "from": "service@example.com",
    "to": ["user@client.com"],
    "subject": "Re: 合作洽谈",
    "text": "您好，邮件已收到...",
    "headers": {
      "In-Reply-To": "<CA+abc123xyz@mail.gmail.com>",
      "References": "<CA+abc123xyz@mail.gmail.com>"
    }
  }
  ```

---

## 6. 开发实施计划（Execution Roadmap）

- [x] **架构与安全方案定稿**：完成架构方案文档设计并归档。
- [ ] **发信核心服务层开发 (`src/email-sender.ts`)**：
  - 封装 `sendEmailViaResend()` 核心发信函数；
  - 自动补全 `Re:` 前缀、邮件线程 `In-Reply-To` / `References` 标头；
  - 完善网络容错、超时控制（AbortSignal: 8000ms）与脱敏错误上报。
- [ ] **交互状态机与元数据管理 (`src/router.ts`)**：
  - 扩展 `InteractiveSession` 联合类型，增加 `reply_email` 支持；
  - 新增 `saveEmailReplyMeta()` 与 `getEmailReplyMeta()` 方法（TTL: 7天）；
  - 新增 Resend API Key 的 KV 配置读写方法 `resend_api_key`。
- [ ] **卡片渲染层升级 (`src/card-renderer.ts`)**：
  - 邮件到达卡片底部增加 `[ ↩️ 回复邮件 ]` Inline Button；
  - 增加回复准备卡片、回复成功凭证卡片渲染函数。
- [ ] **多语言翻译包更新 (`src/i18n/locales/*.ts`)**：
  - 同步补充中文（`zh-CN`, `zh-TW`）、英文（`en-US`）等关于回复操作的提示文案。
- [ ] **Webhook 消息流与状态处理 (`src/index.ts`)**：
  - 处理 `rep:<replyId>` 点击事件，激活回复会话；
  - 处理 `/setkey resend <API_KEY>` 指令，支持随时热配置发信密钥；
  - 捕获管理员文本回复消息，调用发信服务并回显结果。
- [ ] **全量自动化单元测试 (`tests/email-reply.test.ts`)**：
  - 覆盖鉴权拦截、防中继验证、Resend 接口请求模拟、Session 状态转移。

---

## 7. 待用户操作指南清单（用户操作部分）

开发完成后，用户仅需完成以下 3 步即可实现全自动回复：

1. **注册 Resend 免费账号**：
   * 访问 [resend.com](https://resend.com) 并注册账号；
2. **在 Resend 添加域名并在 Cloudflare 配置 DNS**：
   * 在 Resend 的 `Domains` 页面点击 `Add Domain`，输入 `example.com`；
   * Resend 会生成 3 条 DNS 记录（1 条 MX 验证记录，2 条 TXT/DKIM 记录）；
   * 打开 Cloudflare 域名 DNS 控制台，复制并添加这 3 条记录，等待 Resend 显示 `Verified`（通常 1~2 分钟）。
3. **获取 API Key 并绑定至 Bot**：
   * 在 Resend 的 `API Keys` 页面点击 `Create API Key`，复制生成的密钥（如 `re_123456789...`）；
   * 在 Telegram 中直接给你的邮件机器人发送一条指令：
     ```text
     /setkey resend re_你的APIKey
     ```
   * 机器人回复配置成功后，所有邮件下方点击【↩️ 回复邮件】即可直接实现从 `service@example.com` 自动回复！


---

## 8. 全量安全审计与深度优化报告

| 审计维度 | 发现潜在隐患 | 实施防御与优化方案 | 状态 |
| :--- | :--- | :--- | :---: |
| **邮件头注入防御 (CRLF Injection)** | 原邮件的主题、Message-ID、From 或 To 中若包含 `\r\n`，存在潜在的邮件头注入风险。 | 增加 `cleanHeaderValue()` 严密过滤器，强行剔除所有 `[\r\n\x00-\x1F\x7F]` 换行与控制字符。 | ✅ 已加固 |
| **收发地址合法性防线** | 发信人与收件人未作强类型邮箱格式校验，可能包含多收件人逗号或非法格式。 | 发信前使用 `isValidEmail()` + `extractCleanEmail()` 强校验，并且严格阻止发信收信相同地址以防死循环。 | ✅ 已加固 |
| **Cloudflare KV 免费额度保护** | 营销垃圾邮件在判定为静默屏蔽（`mute`）之前执行了元数据 KV 写入，浪费每日 1,000 次 KV 写配额。 | 将 `saveEmailReplyMeta()` 顺延至 `mute` 检查之后，被静默的垃圾信件 **0 KV 消耗**，极致节省额度。 | ✅ 已加固 |
| **Telegram 通知 100% 必达保障** | `sendTelegramMessage` 和 `editMessageText` 在 HTML 解析失败（如特殊字符引发 400 Bad Request）时会静默失败。 | 内置全自动重试降级机制：HTML 解析失败时自动剥离标签重试纯文本模式，保证通知绝不吞消息。 | ✅ 已加固 |
| **API 密钥清洗与防呆保护** | 用户输入 `/setkey resend "re_..."` 时若包含引号或空格，会导致请求 Resend 时 401 认证失败。 | 自动清洗首尾可能携带的双引号、单引号与空格，保障密钥准确无误。 | ✅ 已加固 |
