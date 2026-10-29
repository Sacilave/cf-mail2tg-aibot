/**
 * =============================================================================
 * Module: src/email-sender.ts
 * Description: Hardened Outbound Email Dispatcher via Resend API
 *              Strictly compliant with RFC 5322 & RFC 2822 (Re:, In-Reply-To, References).
 *              Hardened against CRLF Header Injection & Malformed Addresses.
 * =============================================================================
 */

import { escapeHtml, extractCleanEmail } from './sanitizer';
import { isValidEmail } from './router';

export interface SendEmailOptions {
  /** Resend API Key (starts with re_) */
  apiKey: string;
  /** Sender address (must match verified domain, e.g. service@example.com) */
  from: string;
  /** Recipient address (original sender, e.g. client@example.com) */
  to: string;
  /** Email subject (e.g. Re: Original Subject) */
  subject: string;
  /** Plain text message body */
  text: string;
  /** Optional HTML body */
  html?: string;
  /** Message-ID of original email for threading (RFC 2822 In-Reply-To) */
  inReplyTo?: string;
  /** Message-ID references for threading (RFC 2822 References) */
  references?: string;
  /** Whether this is a reply (default: true if inReplyTo is provided, otherwise false) */
  isReply?: boolean;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Sanitize header values to completely neutralize CRLF & Control Character Injection
 * Strips \r, \n, and ASCII non-printable control characters (0x00-0x1F, 0x7F)
 */
export function cleanHeaderValue(val?: string | null): string {
  if (!val) return '';
  return val.replace(/[\r\n\x00-\x1F\x7F]+/g, ' ').trim();
}

/**
 * Format subject to ensure standard 'Re: ' prefix without duplicate 'Re: Re:'
 * and sanitize against CRLF injection
 */
export function formatReplySubject(subject: string): string {
  const clean = cleanHeaderValue(subject);
  if (!clean) return 'Re: (No Subject)';
  if (/^re:\s*/i.test(clean)) {
    return clean;
  }
  return `Re: ${clean}`;
}

/**
 * Send an email reply via Resend API with full parameter hardening
 */
export async function sendEmailViaResend(options: SendEmailOptions): Promise<SendEmailResult> {
  const { apiKey, from, to, subject, text, html, inReplyTo, references } = options;

  const cleanKey = (apiKey || '').trim().replace(/^['"]|['"]$/g, '');
  if (!cleanKey) {
    return {
      success: false,
      error: 'Resend API Key is missing. Please configure it via /setkey resend <key>',
    };
  }

  // Sanitize and validate email addresses
  const cleanFrom = cleanHeaderValue(extractCleanEmail(from));
  const cleanTo = cleanHeaderValue(extractCleanEmail(to));

  if (!cleanFrom || !cleanTo) {
    return {
      success: false,
      error: 'Sender or recipient address is missing or invalid.',
    };
  }

  if (!isValidEmail(cleanFrom)) {
    return {
      success: false,
      error: `Invalid sender email format: ${cleanFrom}`,
    };
  }

  if (!isValidEmail(cleanTo)) {
    return {
      success: false,
      error: `Invalid recipient email format: ${cleanTo}`,
    };
  }

  // Prevent sending to self in an infinite loop
  if (cleanFrom.toLowerCase() === cleanTo.toLowerCase()) {
    return {
      success: false,
      error: 'Sender and recipient address cannot be identical (preventing self-loop).',
    };
  }

  const isReplyEmail = options.isReply ?? Boolean(inReplyTo);
  const normalizedSubject = isReplyEmail ? formatReplySubject(subject) : (cleanHeaderValue(subject) || '(No Subject)');
  const headers: Record<string, string> = {};

  const cleanInReplyTo = cleanHeaderValue(inReplyTo);
  const cleanReferences = cleanHeaderValue(references);

  if (cleanInReplyTo) {
    headers['In-Reply-To'] = cleanInReplyTo;
  }
  if (cleanReferences) {
    headers['References'] = cleanReferences;
  } else if (cleanInReplyTo) {
    headers['References'] = cleanInReplyTo;
  }

  // Body cap defense: Cap text at 100KB to prevent edge memory exhaustion
  const maxBodyLength = 100 * 1024;
  const cleanText = (text || '').trim().slice(0, maxBodyLength);

  const payload: Record<string, any> = {
    from: cleanFrom,
    to: [cleanTo],
    subject: normalizedSubject,
    text: cleanText,
  };

  if (html && html.trim()) {
    payload.html = html.trim().slice(0, maxBodyLength * 2);
  } else {
    // Generate clean HTML format fallback preserving line breaks
    payload.html = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #111827; white-space: pre-wrap;">${escapeHtml(cleanText)}</div>`;
  }

  if (Object.keys(headers).length > 0) {
    payload.headers = headers;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10s safety timeout
    });

    const data: any = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errMsg = data?.message || data?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      return {
        success: false,
        error: errMsg,
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || String(err),
    };
  }
}
