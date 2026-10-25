import fs from 'node:fs';

const inputTag = process.env.INPUT_TAG?.trim();
const refName = process.env.GITHUB_REF_NAME?.trim();
const refType = process.env.GITHUB_REF_TYPE?.trim();

let tag = '';
if (inputTag) {
  tag = inputTag;
} else if (refType === 'tag' && refName) {
  tag = refName;
} else {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  tag = `v${pkg.version}`;
}

if (process.env.GITHUB_ENV) {
  fs.appendFileSync(process.env.GITHUB_ENV, `RELEASE_TAG=${tag}\n`);
}

const content = `## 📬 cf-mail2tg-aibot Release ${tag}

> **Production-grade, 100% free, self-hosted Email-to-Telegram AI Bot gateway powered by Cloudflare Workers & LLM.**  
> *No servers, no monthly email domain subscription fees, zero command-line setup required.*

---

### ⚡ Option A: 2-Minute 1-Click Fast Deploy (Recommended for Beginners)

Deploy directly in your browser without installing Node.js, Git, or touching the terminal:

<p align="center">
  <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/Sacilave/cf-mail2tg-aibot">
    <img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare Workers" />
  </a>
</p>

#### 3 Simple Steps:
1. **Get Telegram Credentials (1 min)**:
   - Message [@BotFather](https://t.me/BotFather) ➔ \`/newbot\` to create your bot and copy the **HTTP API Token** (\`TELEGRAM_BOT_TOKEN\`).
   - Message [@userinfobot](https://t.me/userinfobot) to get your numeric ID (\`TELEGRAM_ADMIN_CHAT_ID\`).
2. **Click Deploy (30 sec)**:
   - Click the **[Deploy to Cloudflare Workers]** button above.
   - Authorize Cloudflare with GitHub. Cloudflare will automatically provision your KV database (\`MAIL_ROUTES_KV\`).
   - Fill in your \`TELEGRAM_BOT_TOKEN\` and \`TELEGRAM_ADMIN_CHAT_ID\`, then click **Save and Deploy**.
3. **Bind Email Routing (30 sec)**:
   - In Cloudflare Dashboard, go to your domain ➔ **Email** ➔ **Email Routing** ➔ **Routing rules**.
   - Add/edit Catch-all rule: Action **Send to Worker** ➔ choose **\`cf-mail2tg-aibot\`**.
   - Open \`https://<YOUR_WORKER_URL>/setup-webhook\` in your browser once to register your Telegram Bot.
   - Send \`/start\` or \`/setup\` to your bot in Telegram to finish configuring your backup inbox and AI model right on your phone!

---

### 📦 Option B: Zero-CLI Manual Code Paste (Using \`worker.js\`)

If you prefer not to connect GitHub or want completely offline deployment:
1. Download **\`worker.js\`** from the **Assets** section below.
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) ➔ **Workers & Pages** ➔ **Create application** ➔ **Create Worker**.
3. Click **Quick Edit**, paste the entire contents of \`worker.js\` into the editor, and click **Save and Deploy**.
4. In your Worker's **Settings**:
   - Under **Bindings** ➔ **KV Namespace Bindings**: Add a binding with Variable name \`MAIL_ROUTES_KV\` linked to a KV namespace.
   - Under **Variables and Secrets**: Add \`TELEGRAM_BOT_TOKEN\` and \`TELEGRAM_ADMIN_CHAT_ID\`.
5. Point your domain's Email Routing Catch-all rule to this Worker. Done!

---

### 🌐 Complete Multilingual Documentation (10 Languages)
Read step-by-step guides, screenshots, architecture deep dives, and troubleshooting in your native language:

| Language | Guide Link |
| :--- | :--- |
| 🇺🇸 **English** | [README.md](https://github.com/Sacilave/cf-mail2tg-aibot#readme) |
| 🇨🇳 **简体中文** | [README.zh-CN.md](https://github.com/Sacilave/cf-mail2tg-aibot/blob/main/README.zh-CN.md) |
| 🇭🇰 **繁體中文** | [README.zh-TW.md](https://github.com/Sacilave/cf-mail2tg-aibot/blob/main/README.zh-TW.md) |
| 🇯🇵 **日本語** | [README.ja-JP.md](https://github.com/Sacilave/cf-mail2tg-aibot/blob/main/README.ja-JP.md) |
| 🇰🇷 **한국어** | [README.ko-KR.md](https://github.com/Sacilave/cf-mail2tg-aibot/blob/main/README.ko-KR.md) |
| 🇧🇷 **Português** | [README.pt-BR.md](https://github.com/Sacilave/cf-mail2tg-aibot/blob/main/README.pt-BR.md) |
| 🇷🇺 **Русский** | [README.ru-RU.md](https://github.com/Sacilave/cf-mail2tg-aibot/blob/main/README.ru-RU.md) |
| 🇪🇸 **Español** | [README.es-ES.md](https://github.com/Sacilave/cf-mail2tg-aibot/blob/main/README.es-ES.md) |
| 🇫🇷 **Français** | [README.fr-FR.md](https://github.com/Sacilave/cf-mail2tg-aibot/blob/main/README.fr-FR.md) |
| 🇩🇪 **Deutsch** | [README.de-DE.md](https://github.com/Sacilave/cf-mail2tg-aibot/blob/main/README.de-DE.md) |

---

### 🌟 Key Highlights
- **Zero Cost Guaranteed**: 100% runs inside Cloudflare free tier limits (100k req/day + free Workers AI inference).
- **Zero-Drop Dual Track**: Forwards raw emails losslessly to personal Gmail while pushing formatted cards to Telegram.
- **One-Tap Copyable OTP**: Automatically detects verification codes and pins them in a clean code block.
- **Triple Shield Defense**: 5MB hard limit, sliding-window anti-spam rate limiter, and Zero-Attachment security armor.
- **Pre-compiled Assets**: Attached \`worker.js\` is fully bundled and ready for instant deployment without building.
`;

fs.writeFileSync('RELEASE_NOTES.md', content, 'utf8');
console.log(`Successfully generated beginner-friendly RELEASE_NOTES.md for ${tag}`);
