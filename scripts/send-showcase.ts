/**
 * =============================================================================
 * Product Showcase Generator (Bilingual for Telegram Screenshots)
 * Sends 5 carefully crafted, high-fidelity sample cards to demonstrate:
 *   1. 🔐 OTP / Security Verification Code (Pinned & Tap-to-Copy)
 *   2. 💼 Business & Customer Support Inquiry (Persona Routing & Expandable Quote)
 *   3. 💰 Billing / Invoice Notification (Financial Triage & Amount Extraction)
 *   4. 🚨 Spoof Detection & Security Warning (SPF/DKIM Failure & High Alert)
 *   5. 📢 Marketing Noise Suppression (Keyword Fast-Drop & Silent Delivery)
 *
 * Usage:
 *   npx tsx scripts/send-showcase.ts [zh|en]
 * =============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { ProxyAgent } from 'undici';
import { renderEmailCardHtml } from '../src/card-renderer';
import { getTranslation } from '../src/i18n';
import type { EmailIntentTag, AllowedTag } from '../src/types';

function loadDevVars(): Record<string, string> {
  const env: Record<string, string> = {};
  const devVarsPath = path.resolve(process.cwd(), '.dev.vars');

  if (fs.existsSync(devVarsPath)) {
    const content = fs.readFileSync(devVarsPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        env[key] = val;
      }
    }
  }

  for (const [k, v] of Object.entries(process.env)) {
    if (v && !env[k]) env[k] = v;
  }
  return env;
}

async function sendTgMessage(
  botToken: string,
  chatId: string,
  text: string,
  dispatcher?: any,
  isSilent = false
) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      disable_notification: isSilent,
    }),
    // @ts-ignore
    dispatcher,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API Error ${res.status}: ${err}`);
  }
}

async function main() {
  const devVars = loadDevVars();
  const botToken = devVars.TELEGRAM_BOT_TOKEN?.trim();
  const adminChatId = devVars.TELEGRAM_ADMIN_CHAT_ID?.trim();

  const proxyUrl =
    devVars.HTTPS_PROXY ||
    devVars.HTTP_PROXY ||
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY ||
    'http://127.0.0.1:7897';

  let dispatcher: any = undefined;
  if (proxyUrl) {
    try {
      dispatcher = new ProxyAgent(proxyUrl);
    } catch {}
  }

  if (!botToken || !adminChatId) {
    console.error(`❌ [Error] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID in .dev.vars`);
    process.exit(1);
  }

  const langArg = (process.argv[2] || 'zh').toLowerCase();
  const isZh = langArg.startsWith('zh') || langArg === 'cn';
  const targetLang = isZh ? 'zh-CN' : 'en-US';
  const dict = getTranslation(targetLang);
  const baseBackup = devVars.FORWARD_TO_EMAIL || 'your-backup-email@gmail.com';

  const showcaseCasesZh = [
    // -------------------------------------------------------------------------
    // 1. 验证码独立置顶与一键复制场景
    // -------------------------------------------------------------------------
    {
      title: '1. [验证码秒提取] GitHub 动态验证码 (单行独立代码块 · 点击直接复制)',
      intentTag: '验证' as EmailIntentTag,
      targetName: 'admin',
      extractedCode: '729406',
      routeTag: '个人' as AllowedTag,
      targetDomain: 'yourdomain.com',
      to: 'admin@yourdomain.com',
      from: 'GitHub Security <noreply@github.com>',
      cleanReplyEmail: 'noreply@github.com',
      authBadge: '🛡️ <b>鉴真:</b> <code>SPF 通过 · DKIM 官方签名有效 (来源可信)</code>',
      aiBadge: '🤖 <b>AI 研判:</b> <code>MiniMax: 动态验证码 (重要·强提醒)</code>',
      subject: '【GitHub】请验证您的新设备登录请求',
      snippet:
        '开发者你好：\n\n' +
        '系统检测到您的 GitHub 账户正在尝试从新设备（东京，日本）登录。\n\n' +
        '本次安全验证码为: 729406\n' +
        '该验证码将在 10 分钟后失效。如非本人操作，请立即前往安全中心修改密码以保护账户安全。\n\n' +
        'GitHub 安全团队',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: baseBackup,
      isSilent: false,
    },

    // -------------------------------------------------------------------------
    // 2. 商业合作与客户咨询 (角色画像智能分流 & 长文折叠)
    // -------------------------------------------------------------------------
    {
      title: '2. [商业合作与客户画像] 企业级授权与私有部署咨询 (Gmail 别名投递)',
      intentTag: '业务' as EmailIntentTag,
      targetName: 'business',
      extractedCode: undefined,
      routeTag: '商务' as AllowedTag,
      targetDomain: 'yourdomain.com',
      to: 'business@yourdomain.com',
      from: '李晨 <chen.li@innovatetech.cn>',
      cleanReplyEmail: 'chen.li@innovatetech.cn',
      authBadge: '🛡️ <b>鉴真:</b> <code>SPF 通过 · DKIM 签名有效 (企业域名可信)</code>',
      aiBadge: '🤖 <b>AI 研判:</b> <code>MiniMax: 商业合作洽谈 (高优先级来信)</code>',
      subject: '关于 cf-mail2tg-aibot 企业版授权与批量私有化部署咨询',
      snippet:
        '您好！\n\n' +
        '我是创智科技（InnovateTech）的基础设施负责人。我们在边缘集群环境中完整测试了贵团队开源的 cf-mail2tg-aibot 邮件网关，工程团队（约 35 名工程师）对其 0.2ms 极速前置频控与双轨保底直转架构印象极其深刻。\n\n' +
        '我们计划在内部全面引入该方案，希望进一步了解：\n' +
        '1. 企业级多租户路由与专属 Webhook 告警扩展支持\n' +
        '2. 私有大模型集群（本地 Ollama / vLLM）对接适配指南\n' +
        '3. 企业 SLA 技术支持与定制化服务方案\n\n' +
        '期待与您建立商业合作，本周四上午方便安排一次 15 分钟的线上会议交流吗？\n\n' +
        '顺祝商祺！\n创智科技 基础架构部 · 李晨',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: 'sacilave+business@gmail.com',
      isSilent: false,
    },

    // -------------------------------------------------------------------------
    // 3. 财务账单与扣费凭据
    // -------------------------------------------------------------------------
    {
      title: '3. [财务账单与发票] Stripe 结算收据 (金额与订单号结构化高亮)',
      intentTag: '账单' as EmailIntentTag,
      targetName: 'billing',
      extractedCode: undefined,
      routeTag: '付费产品' as AllowedTag,
      targetDomain: 'yourdomain.com',
      to: 'billing@yourdomain.com',
      from: 'Stripe 结算中心 <invoices@stripe.com>',
      cleanReplyEmail: 'invoices@stripe.com',
      authBadge: '🛡️ <b>鉴真:</b> <code>SPF 通过 · DKIM 官方签名有效 (Stripe 官方)</code>',
      aiBadge: '🤖 <b>AI 研判:</b> <code>MiniMax: 财务扣费凭单 (财务发票入账)</code>',
      subject: '账单付款成功通知 #INV-2026-9812 ($249.00 USD)',
      snippet:
        'Stripe 支付结算凭单\n\n' +
        '账单编号: #INV-2026-9812\n' +
        '付款金额: $249.00 USD\n' +
        '支付方式: 企业 Visa 信用卡 (尾号 4921)\n' +
        '服务项目: Cloudflare Workers 专属 Pro 实例 (年度订阅)\n\n' +
        '完整的电子增值税发票与对账单已同步生成，您可以登录控制面板直接下载。',
      attachmentsSummary: 'invoice-INV-2026-9812.pdf (84 KB)',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: 'sacilave+billing@gmail.com',
      isSilent: false,
    },

    // -------------------------------------------------------------------------
    // 4. 仿冒源鉴真安全警报与钓鱼拦截
    // -------------------------------------------------------------------------
    {
      title: '4. [安全告警与鉴真拦截] 伪造发件人钓鱼警报 (SPF/DKIM 失败醒目标记)',
      intentTag: '告警' as EmailIntentTag,
      targetName: 'security',
      extractedCode: undefined,
      routeTag: '通用' as AllowedTag,
      targetDomain: 'yourdomain.com',
      to: 'security@yourdomain.com',
      from: '安全中心 <service-notice@fake-auth-portal.com>',
      cleanReplyEmail: 'service-notice@fake-auth-portal.com',
      authBadge: '🚨 <b>鉴真:</b> <code>SPF/DKIM 校验不合格 (高危仿冒发件人·来源未经验证)</code>',
      aiBadge: '🤖 <b>AI 研判:</b> <code>MiniMax: 钓鱼仿冒告警 (检测到可疑跳转链接)</code>',
      subject: '【紧急】您的域名解析凭据存在异常，请立即解除冻结',
      snippet:
        '安全警告: 检测到来自未知设备的越权访问尝试。\n\n' +
        '由于检测到疑似撞库攻击，您的域名控制面板已被系统临时限制。\n' +
        '请在 2 小时内点击下方链接完成安全校验，否则将暂停当前域名的 NS 解析服务。\n\n' +
        '[已被网关安全拦截的恶意钓鱼链接: http://fake-auth-portal.com/login?token=hijack]',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: baseBackup,
      isSilent: false,
    },

    // -------------------------------------------------------------------------
    // 5. 营销降噪与静默免打扰
    // -------------------------------------------------------------------------
    {
      title: '5. [营销推广与防打扰] 优惠大促 (关键词短路免调AI · 静默推送)',
      intentTag: '营销' as EmailIntentTag,
      targetName: 'newsletter',
      extractedCode: undefined,
      routeTag: '通用' as AllowedTag,
      targetDomain: 'yourdomain.com',
      to: 'newsletter@yourdomain.com',
      from: '云上周刊 <promotions@cloud-newsletter.com>',
      cleanReplyEmail: 'promotions@cloud-newsletter.com',
      authBadge: '🛡️ <b>鉴真:</b> <code>SPF 通过 · DKIM 签名有效</code>',
      aiBadge: '🏷️ <b>规则命中:</b> <code>关键词匹配 [限时特惠, 3折] (短路免调AI·节省配额·静默推送)</code>',
      subject: '限时特惠：全球开发者工具双11大促，云服务额度低至 3 折！',
      snippet:
        '亲爱的开发者：\n\n' +
        '年度最大折扣福利已上线！精选超过 50 款顶级开发者工具、IDE 效率插件与边缘算力资源包，首年特惠仅需 69 元/月起。\n\n' +
        '活动将于本周日 24:00 准时截止，结算时输入优惠码 DOUBLE11 即可立享折上折。\n\n' +
        '如需管理邮件订阅偏好或退订此类推广邮件，请点击这里: https://cloud-newsletter.com/unsubscribe',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: baseBackup,
      isSilent: true, // 静默投递
    },
  ];

  const showcaseCasesEn = [
    {
      title: '1. [Verification / OTP] GitHub 2FA Code with Instant Tap-to-Copy',
      intentTag: '验证' as EmailIntentTag,
      targetName: 'admin',
      extractedCode: '849201',
      routeTag: '个人' as AllowedTag,
      targetDomain: 'yourdomain.com',
      to: 'admin@yourdomain.com',
      from: 'GitHub Security <noreply@github.com>',
      cleanReplyEmail: 'noreply@github.com',
      authBadge: '🛡️ <b>Auth:</b> <code>SPF Pass · DKIM Valid (Official Verified)</code>',
      aiBadge: '🤖 <b>AI Triage:</b> <code>MiniMax: Verification Code (High Priority · Alert)</code>',
      subject: '[GitHub] Please verify your device sign-in',
      snippet:
        'Hey developer,\n\n' +
        'We detected a sign-in attempt to your GitHub account from a new IP address (Tokyo, Japan).\n\n' +
        'Your security verification code: 849201\n' +
        'This code will expire in 10 minutes. If you did not initiate this request, please secure your account immediately.\n\n' +
        'Thanks,\nThe GitHub Team',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: baseBackup,
      isSilent: false,
    },
    {
      title: '2. [Business & Support] Enterprise License & API Integration Inquiry',
      intentTag: '业务' as EmailIntentTag,
      targetName: 'business',
      extractedCode: undefined,
      routeTag: '商务' as AllowedTag,
      targetDomain: 'yourdomain.com',
      to: 'business@yourdomain.com',
      from: 'Marcus Vance <marcus.vance@vanguard-tech.io>',
      cleanReplyEmail: 'marcus.vance@vanguard-tech.io',
      authBadge: '🛡️ <b>Auth:</b> <code>SPF Pass · DKIM Valid (Verified Domain)</code>',
      aiBadge: '🤖 <b>AI Triage:</b> <code>MiniMax: Commercial Partnership (Priority Inbound)</code>',
      subject: 'Inquiry: Enterprise License & Bulk Deployment for cf-mail2tg-aibot',
      snippet:
        'Hi Sacilave Team,\n\n' +
        'I am the VP of Infrastructure at Vanguard Tech. We have been evaluating your open-source Email-to-Telegram AI gateway across our edge clusters, and our engineering department (approx. 40 developers) is thoroughly impressed with the sub-millisecond pre-parse rate limiting and zero-drop forwarding resilience.\n\n' +
        'We would like to discuss:\n' +
        '1. Enterprise volume license and custom SLA options\n' +
        '2. Multi-tenant KV routing and dedicated webhook endpoints\n' +
        '3. Consulting services for private LLM cluster integration\n\n' +
        'Could we schedule a brief 15-minute sync this Thursday?\n\n' +
        'Warm regards,\nMarcus Vance\nVP of Infrastructure | Vanguard Tech',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: 'sacilave+business@gmail.com',
      isSilent: false,
    },
    {
      title: '3. [Billing & Finance] Stripe Invoice & Payment Receipt',
      intentTag: '账单' as EmailIntentTag,
      targetName: 'billing',
      extractedCode: undefined,
      routeTag: '付费产品' as AllowedTag,
      targetDomain: 'yourdomain.com',
      to: 'billing@yourdomain.com',
      from: 'Stripe Billing <invoices@stripe.com>',
      cleanReplyEmail: 'invoices@stripe.com',
      authBadge: '🛡️ <b>Auth:</b> <code>SPF Pass · DKIM Valid (Stripe Official)</code>',
      aiBadge: '🤖 <b>AI Triage:</b> <code>MiniMax: Billing & Invoice (Financial Receipt)</code>',
      subject: 'Invoice #INV-2026-9812 Paid ($249.00 USD)',
      snippet:
        'Receipt from Stripe Payments\n\n' +
        'Invoice: #INV-2026-9812\n' +
        'Amount Paid: $249.00 USD\n' +
        'Status: Paid via Corporate Visa (•••• 4921)\n' +
        'Service: Cloudflare Workers Dedicated Pro Plan (Annual)\n\n' +
        'You can view and download your full PDF VAT invoice directly from your customer dashboard.',
      attachmentsSummary: 'invoice-INV-2026-9812.pdf (84 KB)',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: 'sacilave+billing@gmail.com',
      isSilent: false,
    },
    {
      title: '4. [Security Alert] Phishing Spoof Detection (SPF/DKIM Failure Warning)',
      intentTag: '告警' as EmailIntentTag,
      targetName: 'security',
      extractedCode: undefined,
      routeTag: '通用' as AllowedTag,
      targetDomain: 'yourdomain.com',
      to: 'security@yourdomain.com',
      from: 'Account Support <service-notice@fake-auth-portal.com>',
      cleanReplyEmail: 'service-notice@fake-auth-portal.com',
      authBadge: '🚨 <b>Auth:</b> <code>SPF/DKIM FAILED (High Risk · Unverified Origin)</code>',
      aiBadge: '🤖 <b>AI Triage:</b> <code>MiniMax: Phishing Alert (Dangerous Link Detected)</code>',
      subject: 'CRITICAL: Immediate action required to unfreeze your domain credentials',
      snippet:
        'WARNING: Unauthorized access detected from unknown device.\n\n' +
        'Your domain management portal has been temporarily locked due to suspicious credential stuffing.\n' +
        'Click the unverified link below within 2 hours or your domain nameserver records will be suspended.\n\n' +
        '[Blocked Phishing URL: http://fake-auth-portal.com/login?token=hijack]',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: baseBackup,
      isSilent: false,
    },
    {
      title: '5. [Marketing Noise] Promo Campaign (Keyword Fast-Match · Muted Delivery)',
      intentTag: '营销' as EmailIntentTag,
      targetName: 'newsletter',
      extractedCode: undefined,
      routeTag: '通用' as AllowedTag,
      targetDomain: 'yourdomain.com',
      to: 'newsletter@yourdomain.com',
      from: 'SaaS Deals Weekly <promotions@cloud-newsletter.com>',
      cleanReplyEmail: 'promotions@cloud-newsletter.com',
      authBadge: '🛡️ <b>Auth:</b> <code>SPF Pass · DKIM Valid</code>',
      aiBadge: '🏷️ <b>Rule Matched:</b> <code>Spam Rule [70% off, promo] (AI Bypassed · Quota Saved · Muted)</code>',
      subject: 'Flash Sale: 70% Off Black Friday Developer Toolkits & Cloud Credits!',
      snippet:
        'Hey Cloud Engineers!\n\n' +
        'Unlock our biggest seasonal discount yet. Over 50+ developer tools, IDE extensions, and edge hosting credits bundled for just $9.99/mo.\n\n' +
        'Limited time offer expires midnight Sunday. Use code BLACKFRIDAY2026 at checkout.\n\n' +
        'To manage your email preferences or unsubscribe from promotional emails, click here: https://cloud-newsletter.com/opt-out',
      forwardSuccess: true,
      baseForwardTarget: baseBackup,
      actualForwardedTo: baseBackup,
      isSilent: true,
    },
  ];

  const showcaseCases = isZh ? showcaseCasesZh : showcaseCasesEn;

  console.log(`\n========================================================`);
  console.log(`🚀 Starting Showcase Generation (${isZh ? '简体中文' : 'English'})...`);
  console.log(`   Target Chat ID: ${adminChatId}`);
  console.log(`   Total Cards: ${showcaseCases.length}`);
  console.log(`========================================================\n`);

  for (let i = 0; i < showcaseCases.length; i++) {
    const sc = showcaseCases[i];
    console.log(`[${i + 1}/${showcaseCases.length}] Rendering & Sending: ${sc.title}`);

    const cardHtml = renderEmailCardHtml({
      dict,
      intentTag: sc.intentTag,
      targetName: sc.targetName,
      extractedCode: sc.extractedCode,
      routeTag: sc.routeTag,
      targetDomain: sc.targetDomain,
      to: sc.to,
      from: sc.from,
      cleanReplyEmail: sc.cleanReplyEmail,
      authBadge: sc.authBadge,
      aiBadge: sc.aiBadge,
      subject: sc.subject,
      attachmentsSummary: sc.attachmentsSummary,
      snippet: sc.snippet,
      forwardSuccess: sc.forwardSuccess,
      baseForwardTarget: sc.baseForwardTarget,
      actualForwardedTo: sc.actualForwardedTo,
      forwardError: null,
    });

    try {
      await sendTgMessage(botToken, adminChatId, cardHtml, dispatcher, sc.isSilent);
      console.log(`   ✅ Sent successfully!`);
    } catch (err: any) {
      console.error(`   ❌ Failed to send: ${err.message}`);
    }

    // 1.5s delay between messages to maintain crisp ordering in Telegram
    if (i < showcaseCases.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  console.log(`\n🎉 All 5 ${isZh ? '中文' : 'English'} showcase cards delivered to your Telegram!`);
  console.log(`   You can now take screenshots directly in Telegram.`);
}

main().catch(console.error);
