/**
 * =============================================================================
 * Module: src/sanitizer.ts
 * Description: Email message sanitization, RFC decoding, HTML to text cleaning,
 *              anti-phishing escaping, and attachment policy guards.
 * =============================================================================
 */

/**
 * HTML entity escaping for Telegram Bot API HTML parse_mode
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Extract clean email address from sender header
 * e.g. "Support Team <support@example.com>" => "support@example.com"
 */
export function extractCleanEmail(address: string): string {
  if (!address) return '';
  const match = address.match(/<([^>]+)>/);
  return (match ? match[1] : address).trim();
}

/**
 * Extract lowercased domain part from email address
 * e.g. "admin@example.com" => "example.com"
 */
export function extractDomain(emailOrAddress: string): string {
  if (!emailOrAddress) return 'unknown';
  const match = emailOrAddress.match(/<([^>]+)>/);
  const clean = (match ? match[1] : emailOrAddress).trim().toLowerCase();
  const atIdx = clean.lastIndexOf('@');
  return atIdx !== -1 ? clean.slice(atIdx + 1) : 'unknown';
}

/**
 * Robust Quoted-Printable decoder with UTF-8 and graceful error fallback
 */
export function decodeQuotedPrintable(text: string): string {
  try {
    const withoutSoftBreaks = text.replace(/=\r?\n/g, '');
    return decodeURIComponent(
      withoutSoftBreaks.replace(/=([0-9A-Fa-f]{2})/g, '%$1')
    );
  } catch {
    return text.replace(/=\r?\n/g, '');
  }
}

/**
 * Convert HTML to clean plain text (strips scripts, styles, tags and formats linebreaks)
 */
export function cleanHtmlToText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

/**
 * Safe plain text snippet extractor with multipart MIME boundary awareness
 */
export function extractTextSnippet(rawContent: string, maxLength = 1500): string {
  if (!rawContent) return '';

  let body = rawContent;

  // 1. Remove outer headers if present
  const headerSplit = rawContent.split(/\r?\n\r?\n/);
  if (headerSplit.length > 1) {
    body = headerSplit.slice(1).join('\n');
  }

  // 2. Detect and process MIME multipart boundaries
  const boundaryMatch = body.match(/^--[A-Za-z0-9'()+_,-./:=?]+(?:\r?\n|$)/m);
  if (boundaryMatch) {
    const rawBoundary = boundaryMatch[0].trim();
    const parts = body.split(rawBoundary);
    let chosenPart = '';

    // Prefer text/plain
    for (const part of parts) {
      if (/content-type:\s*text\/plain/i.test(part)) {
        chosenPart = part;
        break;
      }
    }
    // Fallback to text/html
    if (!chosenPart) {
      for (const part of parts) {
        if (/content-type:\s*text\/html/i.test(part)) {
          chosenPart = part;
          break;
        }
      }
    }
    // Fallback to any non-empty body part
    if (!chosenPart && parts.length > 1) {
      for (let i = 1; i < parts.length; i++) {
        const p = parts[i].trim();
        if (p && !p.startsWith('--')) {
          chosenPart = parts[i];
          break;
        }
      }
    }

    if (chosenPart) {
      const subParts = chosenPart.split(/\r?\n\r?\n/);
      const subHeader = subParts[0] || '';
      let subBody = subParts.slice(1).join('\n') || chosenPart;

      if (/content-transfer-encoding:\s*base64/i.test(subHeader)) {
        try {
          const cleanB64 = subBody.replace(/[^A-Za-z0-9+/=]/g, '');
          subBody = atob(cleanB64);
        } catch {}
      } else if (/content-transfer-encoding:\s*quoted-printable/i.test(subHeader)) {
        subBody = decodeQuotedPrintable(subBody);
      }

      if (/content-type:\s*text\/html/i.test(subHeader)) {
        subBody = cleanHtmlToText(subBody);
      }

      body = subBody;
    }
  } else {
    body = decodeQuotedPrintable(body);
  }

  // 3. Strip residual MIME boundary relics
  let clean = body
    .replace(/^--[A-Za-z0-9'()+_,-./:=?]+(?:--)?$/gm, '')
    .replace(/^content-(?:type|transfer-encoding|description):[^\r\n]*/gim, '');

  clean = cleanHtmlToText(clean);

  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength)}... (正文过长已折叠展示前 ${maxLength} 字，完整原件已同步至邮箱)`;
}

/**
 * Format bytes to readable string (e.g. 5.2 MB)
 */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i] || 'B'}`;
}

/**
 * Default dangerous file extensions list
 */
export const DEFAULT_DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar',
  '.iso', '.apk', '.msi', '.ps1', '.pif', '.com', '.zip',
  '.tar', '.gz', '.7z', '.rar'
];

export interface CheckAttachmentOptions {
  blockAll?: boolean;
  blockedExtensions?: string[];
}

export interface AttachmentCheckResult {
  allowed: boolean;
  reason?: string;
  smtpRejectCode?: number;
  detectedAttachments: string[];
}

/**
 * Validate attachment policy: Zero-Attachment mode or dangerous extension block
 */
export function checkAttachmentPolicy(
  attachments: Array<{ filename?: string }>,
  options: CheckAttachmentOptions = {}
): AttachmentCheckResult {
  const detected = (attachments || []).map((att) => att.filename?.trim() || '未命名附件');

  if (detected.length === 0) {
    return { allowed: true, detectedAttachments: [] };
  }

  // 1. Zero-Attachment Policy: Block all attachments unconditionally
  if (options.blockAll) {
    return {
      allowed: false,
      smtpRejectCode: 550,
      reason: `本网关已开启全量附件防御策略 (Zero-Attachment Policy)，禁止接收任何文件附件 (拦截: ${detected.join(', ')})。如需传阅文件，请使用网盘、GitHub 或在线文档链接。`,
      detectedAttachments: detected,
    };
  }

  // 2. Dangerous file format inspection
  const extensions = options.blockedExtensions && options.blockedExtensions.length > 0
    ? options.blockedExtensions
    : DEFAULT_DANGEROUS_EXTENSIONS;

  for (const name of detected) {
    const lower = name.toLowerCase();
    for (const ext of extensions) {
      if (lower.endsWith(ext.toLowerCase())) {
        return {
          allowed: false,
          smtpRejectCode: 550,
          reason: `检测到禁止接收的潜在高危文件格式 (${ext})，附件名: ${name}。为免受恶意脚本与木马侵害，已在边缘直接拒信。`,
          detectedAttachments: detected,
        };
      }
    }
  }

  return { allowed: true, detectedAttachments: detected };
}

/**
 * Baseline marketing keywords (English-only baseline for initial start)
 */
export const DEFAULT_MARKETING_KEYWORDS_EN: readonly string[] = [
  'unsubscribe',
  'opt out',
  'opt-out',
  'subscription preferences',
  'email preferences',
  'manage preferences',
  'click here to unsubscribe',
  'newsletter',
  'promotion',
  'promotions',
  'special offer',
  'limited time offer',
  'exclusive offer',
  'discount',
  'discount code',
  'coupon',
  'coupon code',
  'black friday',
  'cyber monday',
  'flash sale',
  'sponsored',
  'advertisement',
  'marketing communication',
  'growth strategy',
  'scale your user base',
  'tailored acquisition campaign',
  'promote chrome extension',
  'promote chrome extensions',
  'bring in new users',
  'more visibility or bring in new users',
  'targeted community outreach',
  'congrats on shipping',
  'congrats on launching',
  'view in browser',
  'privacy policy',
  'appranker',
  'extensionbooster',
  'extension promoter',
] as const;

export const DEFAULT_MARKETING_KEYWORDS = DEFAULT_MARKETING_KEYWORDS_EN;

/**
 * Authentic regional marketing & spam keywords for each supported language.
 * Curated from real-world regional commercial email conventions rather than crude translations.
 */
export const LOCALIZED_MARKETING_KEYWORDS: Record<string, readonly string[]> = {
  'zh-CN': [
    '退订',
    '取消订阅',
    '退订请回',
    '退订请回复',
    '点击退订',
    'td',
    '如不想接收此类邮件',
    '不想继续接收',
    '商业推广',
    '限时特惠',
    '限时优惠',
    '独家特惠',
    '仅限今日',
    '立即抢购',
    '点击领取',
    '优惠券',
    '代金券',
    '商业合作',
    '商务合作',
    '代开发票',
    '开具发票',
    '增值税发票',
    '兼职刷单',
    '博彩',
    '澳门首家',
    '首充特惠',
    '免费领取',
    '点击查看更多优惠',
    '会员专享',
  ],
  'zh-TW': [
    '取消訂閱',
    '點此退訂',
    '退訂請回覆',
    '若您不希望再收到',
    '如欲停止訂閱',
    '電子報',
    '行銷推廣',
    '限時優惠',
    '限時特惠',
    '優惠券',
    '折價券',
    '立即購買',
    '免費領取',
    '商業合作',
    '商務合作',
    '專屬優惠',
    '點擊查看更多',
    '會員獨享',
    '本信件為系統自動發送',
  ],
  'ja-JP': [
    '配信停止',
    'メルマガ解除',
    '配信解除',
    'メール配信停止',
    '特定商取引法',
    'オプトアウト',
    'お得な情報',
    '期間限定',
    '割引クーポン',
    '今すぐチェック',
    'キャンペーン情報',
    '広告メール',
    '登録解除',
    '購読解除',
    '配信停止はこちら',
    'ご案内メール',
  ],
  'ko-KR': [
    '수신거부',
    '수신 거부',
    '무료 수신거부',
    '구독취소',
    '구독 취소',
    '광고',
    '(광고)',
    '이메일 수신을 원치 않으시면',
    '수신 동의 철회',
    '할인코드',
    '할인 쿠폰',
    '특가',
    '기간한정',
    '기간 한정',
    '프로모션',
    '뉴스레터',
    '이벤트 안내',
    '무료 체험',
    '제휴 문의',
    '비즈니스 협력',
    '개인정보처리방침',
    '회원 전용 혜택',
  ],
  'pt-BR': [
    'cancelar inscrição',
    'cancelar assinatura',
    'descadastre-se',
    'descadastrar',
    'caso não queira mais receber',
    'se não deseja mais receber',
    'clique aqui para cancelar',
    'preferências de e-mail',
    'newsletter',
    'boletim informativo',
    'oferta especial',
    'por tempo limitado',
    'cupom de desconto',
    'código de desconto',
    'promoção exclusiva',
    'publicidade',
    'desconto imperdível',
    'política de privacidade',
    'parceria comercial',
    'comunicação de marketing',
  ],
  'ru-RU': [
    'отписаться',
    'отписаться от рассылки',
    'нажмите здесь, чтобы отписаться',
    'управление подпиской',
    'рекламная рассылка',
    'специальное предложение',
    'скидка',
    'промокод',
    'ограниченное предложение',
    'акция',
    'отписаться от уведомлений',
    'политика конфиденциальности',
    'партнерская программа',
  ],
  'es-ES': [
    'darse de baja',
    'cancelar suscripción',
    'desuscribirse',
    'anular suscripción',
    'boletín informativo',
    'oferta especial',
    'código de descuento',
    'cupón',
    'promoción exclusiva',
    'gestionar preferencias',
    'haga clic aquí para darse de baja',
    'publicidad',
    'si no deseas recibir más correos',
  ],
  'fr-FR': [
    'se désinscrire',
    'se désabonner',
    'cliquez ici pour vous désinscrire',
    'lettre d\'information',
    'offre spéciale',
    'code de réduction',
    'coupon',
    'promotion exclusive',
    'gérer mes préférences',
    'ne plus recevoir d\'e-mails',
    'publicité',
  ],
  'de-DE': [
    'abmelden',
    'newsletter abbestellen',
    'hier abmelden',
    'e-mail-präferenzen',
    'sonderangebot',
    'rabattcode',
    'gutschein',
    'werbung',
    'widerrufsrecht',
    'datenschutzerklärung',
    'keine werbung mehr erhalten',
    'vom newsletter austragen',
  ],
  'en-US': DEFAULT_MARKETING_KEYWORDS_EN,
};

export interface MarketingCheckResult {
  isMarketing: boolean;
  reason?: string;
  matchedKeyword?: string;
  matchedHeader?: string;
}

/**
 * Detect marketing emails via RFC headers and keyword matching
 */
export function detectMarketingEmail(
  headers: any,
  subject = '',
  bodySnippet = '',
  keywords: readonly string[] | string[] = DEFAULT_MARKETING_KEYWORDS
): MarketingCheckResult {
  const getHeader = (name: string): string => {
    if (!headers) return '';
    if (typeof headers.get === 'function') {
      return headers.get(name) || '';
    }
    return headers[name.toLowerCase()] || headers[name] || '';
  };

  // 1. RFC 8058 / RFC 2369 Header Checks
  const listUnsub = getHeader('list-unsubscribe');
  if (listUnsub) {
    return {
      isMarketing: true,
      reason: '命中 RFC 8058/2369 退订头 (List-Unsubscribe)',
      matchedHeader: 'list-unsubscribe',
    };
  }

  // 2. Precedence: bulk / list / junk headers
  const precedence = getHeader('precedence').toLowerCase();
  if (precedence === 'bulk' || precedence === 'list' || precedence === 'junk') {
    return {
      isMarketing: true,
      reason: `命中批量广播邮件头 (Precedence: ${precedence})`,
      matchedHeader: 'precedence',
    };
  }

  // 3. Keyword Matching
  const fullText = `${subject || ''}\n${bodySnippet || ''}`.toLowerCase();
  const effectiveKeywords = keywords && keywords.length > 0 ? keywords : DEFAULT_MARKETING_KEYWORDS;

  for (const kw of effectiveKeywords) {
    const cleanKw = (kw || '').trim().toLowerCase();
    if (!cleanKw) continue;
    if (fullText.includes(cleanKw)) {
      return {
        isMarketing: true,
        reason: `命中营销特征关键字: "${kw.trim()}"`,
        matchedKeyword: kw.trim(),
      };
    }
  }

  return { isMarketing: false };
}

/**
 * Sanitize and format LLM output or user input into Telegram-safe HTML.
 * Preserves standard Telegram tags: <b>, <i>, <code>, <pre>, <blockquote>, <u>, <s>, <a>
 * Converts Markdown bold (**text**) and inline code (`code`) to HTML tags.
 * Safely escapes any stray <, >, or & that would otherwise trigger Telegram 400 Bad Request entity parse error.
 * Enforces a maximum character length to prevent Telegram 4096 character limit errors.
 */
export function formatTelegramSafeHtml(text: string, maxLength = 3200): string {
  if (!text) return '';

  let trimmed = text.trim();
  if (trimmed.length > maxLength) {
    trimmed = trimmed.slice(0, maxLength) + '\n\n...(内容过长已折叠)';
  }

  // Convert markdown **bold** to <b>bold</b>
  trimmed = trimmed.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  // Convert markdown `code` to <code>code</code>
  trimmed = trimmed.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Regex matching allowed Telegram HTML opening and closing tags
  const allowedTagPattern = /<\/?(?:b|i|u|s|code|pre|blockquote|tg-spoiler|a)(?:\s+href="[^"]*")?\s*\/?>/gi;

  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = allowedTagPattern.exec(trimmed)) !== null) {
    if (match.index > lastIndex) {
      const rawPiece = trimmed.slice(lastIndex, match.index);
      parts.push(escapeHtml(rawPiece));
    }
    parts.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < trimmed.length) {
    parts.push(escapeHtml(trimmed.slice(lastIndex)));
  }

  return parts.join('');
}
