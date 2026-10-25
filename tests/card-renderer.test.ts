import { describe, it, expect } from 'vitest';
import {
  renderSizeAlertCard,
  renderRateLimitCard,
  renderAttachmentRejectCard,
  renderEmailCardHtml,
  renderEmailCardPlainText,
  renderMasterDashboardHtml,
} from '../src/card-renderer';
import { getTranslation } from '../src/i18n';

describe('Card Renderer - Presentation Layer Unit Tests', () => {
  const dictZh = getTranslation('zh-CN');
  const dictEn = getTranslation('en-US');

  it('renderSizeAlertCard 应正确生成超限告警卡片并正确包含标签与尺寸', () => {
    const card = renderSizeAlertCard({
      dict: dictZh,
      routeTag: '个人',
      targetDomain: 'example.com',
      from: 'sender@test.com',
      to: 'admin@example.com',
      rawSize: 10 * 1024 * 1024,
      maxSizeBytes: 5 * 1024 * 1024,
    });

    expect(card).toContain('超大容量熔断拦截');
    expect(card).toContain('10 MB');
    expect(card).toContain('5 MB');
    expect(card).toContain('example.com');
  });

  it('renderRateLimitCard 应正确显示频控降级与投递状态', () => {
    const card = renderRateLimitCard({
      dict: dictZh,
      routeTag: '商业支持',
      targetDomain: 'domain.com',
      from: 'spammer@spam.com',
      cleanReplyEmail: 'spammer@spam.com',
      to: 'support@domain.com',
      reason: '频控超限',
      forwardSuccess: true,
      baseForwardTarget: 'backup@gmail.com',
      actualForwardedTo: 'backup+support@gmail.com',
      forwardError: null,
    });

    expect(card).toContain('频控限流预警');
    expect(card).toContain('spammer@spam.com');
    expect(card).toContain('已安全直转备份邮箱');
  });

  it('renderAttachmentRejectCard 应正确展示检测到的危险附件', () => {
    const card = renderAttachmentRejectCard({
      dict: dictZh,
      routeTag: '通用',
      targetDomain: 'site.com',
      from: 'malware@bad.com',
      to: 'hi@site.com',
      reason: '拦截恶意附件',
      detectedAttachments: ['trojan.exe', 'payload.bat'],
    });

    expect(card).toContain('附件安全策略拦截');
    expect(card).toContain('trojan.exe, payload.bat');
    expect(card).toContain('SMTP 550 拒信');
  });

  it('renderEmailCardHtml 应支持验证码独立代码块置顶与 HTML 转义', () => {
    const card = renderEmailCardHtml({
      dict: dictZh,
      intentTag: '验证',
      targetName: 'login',
      extractedCode: '839210',
      routeTag: '个人',
      targetDomain: 'mycloud.io',
      to: 'login@mycloud.io',
      from: 'Security <auth@service.com>',
      cleanReplyEmail: 'auth@service.com',
      authBadge: '🛡️ <b>SPF / DKIM:</b> <code>双重校验通过 (官方可信来源)</code>',
      aiBadge: '🤖 <b>AI 研判:</b> <code>验证</code> (身份认证)',
      subject: 'Your Verification Code <OTP>',
      attachmentsSummary: undefined,
      snippet: 'Please enter code 839210 to login.',
      forwardSuccess: true,
      baseForwardTarget: 'master@gmail.com',
      actualForwardedTo: 'master@gmail.com',
      forwardError: null,
    });

    expect(card).toContain('🔐');
    expect(card).toContain('<code>839210</code>');
    expect(card).toContain('&lt;OTP&gt;');
    expect(card).toContain('<blockquote expandable>');
  });

  it('renderEmailCardPlainText 应生成安全紧凑的纯文本保底卡片', () => {
    const plain = renderEmailCardPlainText({
      dict: dictEn,
      intentTag: '账单',
      targetName: 'billing',
      routeTag: '通用',
      targetDomain: 'store.com',
      to: 'billing@store.com',
      from: 'Invoice <billing@stripe.com>',
      cleanReplyEmail: 'billing@stripe.com',
      authBadge: '',
      aiBadge: 'AI: Billing',
      subject: 'Invoice #10023 Paid',
      attachmentsSummary: 'invoice.pdf (120 KB)',
      snippet: 'Thank you for your payment.',
      forwardSuccess: true,
      baseForwardTarget: 'boss@corp.com',
      actualForwardedTo: 'boss@corp.com',
      forwardError: null,
    });

    expect(plain).toContain('💰 【Billing · billing】');
    expect(plain).toContain('store.com');
    expect(plain).toContain('Invoice #10023 Paid');
    expect(plain).toContain('invoice.pdf (120 KB)');
  });

  it('renderMasterDashboardHtml 应在英语下输出纯正英文，不夹杂中文且语言切换按钮为纯英文', () => {
    // 1. 语言切换按钮名称在英语下不需要显示中文出来
    expect(dictEn.dashboard.btnLang).toBe('🌐 Language');
    expect(dictEn.dashboard.btnLang).not.toContain('语言');

    // 2. 渲染 Settings 主页
    const cardEn = renderMasterDashboardHtml({
      dict: dictEn,
      provider: 'minimax',
      model: 'MiniMax-Text-01',
      keyConfigured: true,
      forwardEmail: 'test@example.com',
      gmailAliasesEnabled: false,
      customRulesCount: 0,
      keywordsCount: 67,
      langName: 'English',
    });

    // 验证核心英文字段已展示
    expect(cardEn).toContain('AI Engine:');
    expect(cardEn).toContain('API Key Status:');
    expect(cardEn).toContain('🟢 Ready');
    expect(cardEn).toContain('Backup Forward:');
    expect(cardEn).toContain('Gmail Aliases:');
    expect(cardEn).toContain('⚪ Disabled (Direct)');
    expect(cardEn).toContain('Custom Rules:');
    expect(cardEn).toContain('Spam Keywords:');
    expect(cardEn).toContain('Display Language:');
    expect(cardEn).toContain('Tap buttons below to enter control panels');

    // 验证严格不包含中文硬编码残留
    expect(cardEn).not.toContain('审信引擎');
    expect(cardEn).not.toContain('密钥状态');
    expect(cardEn).not.toContain('备份邮箱');
    expect(cardEn).not.toContain('已就绪');
    expect(cardEn).not.toContain('已停用');
    expect(cardEn).not.toContain('自定义规则');
    expect(cardEn).not.toContain('垃圾拦截词');
    expect(cardEn).not.toContain('轻触下方按钮');

    // 3. 验证中文模式下依然保持正常的中文展示
    const cardZh = renderMasterDashboardHtml({
      dict: dictZh,
      provider: 'minimax',
      model: 'MiniMax-Text-01',
      keyConfigured: true,
      forwardEmail: 'test@example.com',
      gmailAliasesEnabled: false,
      customRulesCount: 0,
      keywordsCount: 67,
      langName: '简体中文',
    });
    expect(cardZh).toContain('AI 审信引擎:');
    expect(cardZh).toContain('密钥状态:');
    expect(cardZh).toContain('🟢 已就绪 (Ready)');
    expect(cardZh).toContain('备份邮箱:');
  });
});
