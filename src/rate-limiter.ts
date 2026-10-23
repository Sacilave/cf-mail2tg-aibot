/**
 * =============================================================================
 * Module: src/rate-limiter.ts
 * Description: Multi-tenant in-memory sliding window rate limiter
 *              Protects Telegram Bot API from 429 throttling and CPU abuse.
 * =============================================================================
 */

import { extractDomain } from './sanitizer';
import type {
  EmailRateLimitOptions,
  EmailRateLimitResult,
  RateLimiterConfig,
} from './types';

export { extractDomain };
export type { EmailRateLimitOptions, EmailRateLimitResult, RateLimiterConfig };

export const DEFAULT_CONFIG: RateLimiterConfig = {
  maxPerSenderPerMinute: 3,
  maxPerDomainPerMinute: 8,
  maxGlobalPerMinute: 15,
  maxSuspiciousPerMinute: 1,
  windowMs: 60 * 1000, // 60 seconds
  maxMapEntries: 500,  // Bound memory to 500 active entries
};

export class EmailRateLimiter {
  private config: RateLimiterConfig;
  private globalTimestamps: number[] = [];
  private senderTimestamps: Map<string, number[]> = new Map();
  private domainTimestamps: Map<string, number[]> = new Map();
  private notifiedSuppressionSenders: Map<string, number> = new Map();
  private lastPruneTime = 0;

  constructor(customConfig: Partial<RateLimiterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...customConfig };
  }

  private normalizeSender(sender: string): string {
    if (!sender) return 'unknown';
    const match = sender.match(/<([^>]+)>/);
    const email = (match ? match[1] : sender).trim().toLowerCase();
    return email || 'unknown';
  }

  private prune(now: number): void {
    const cutoff = now - this.config.windowMs;

    this.globalTimestamps = this.globalTimestamps.filter((ts) => ts > cutoff);

    for (const [sender, timestamps] of this.senderTimestamps.entries()) {
      const active = timestamps.filter((ts) => ts > cutoff);
      if (active.length === 0) {
        this.senderTimestamps.delete(sender);
      } else {
        this.senderTimestamps.set(sender, active);
      }
    }

    for (const [domain, timestamps] of this.domainTimestamps.entries()) {
      const active = timestamps.filter((ts) => ts > cutoff);
      if (active.length === 0) {
        this.domainTimestamps.delete(domain);
      } else {
        this.domainTimestamps.set(domain, active);
      }
    }

    for (const [key, ts] of this.notifiedSuppressionSenders.entries()) {
      if (ts <= cutoff) {
        this.notifiedSuppressionSenders.delete(key);
      }
    }

    if (this.senderTimestamps.size > this.config.maxMapEntries) {
      const excess = this.senderTimestamps.size - this.config.maxMapEntries;
      const keys = Array.from(this.senderTimestamps.keys());
      for (let i = 0; i < excess; i++) {
        this.senderTimestamps.delete(keys[i]);
      }
    }

    if (this.domainTimestamps.size > this.config.maxMapEntries) {
      const excess = this.domainTimestamps.size - this.config.maxMapEntries;
      const keys = Array.from(this.domainTimestamps.keys());
      for (let i = 0; i < excess; i++) {
        this.domainTimestamps.delete(keys[i]);
      }
    }

    this.lastPruneTime = now;
  }

  public check(options: EmailRateLimitOptions): EmailRateLimitResult {
    const now = options.now || Date.now();

    if (now - this.lastPruneTime > 10000) {
      this.prune(now);
    }

    const cutoff = now - this.config.windowMs;
    const cleanSender = this.normalizeSender(options.from);
    const targetDomain = options.to ? extractDomain(options.to) : 'unknown';

    const globalActive = this.globalTimestamps.filter((ts) => ts > cutoff);
    const senderActive = (this.senderTimestamps.get(cleanSender) || []).filter((ts) => ts > cutoff);
    const domainActive = (this.domainTimestamps.get(targetDomain) || []).filter((ts) => ts > cutoff);

    const isSuspicious = options.isSpfPass === false && options.isDkimPass === false;

    // Check suspicious limit
    if (isSuspicious && senderActive.length >= this.config.maxSuspiciousPerMinute) {
      const shouldNotify = !this.notifiedSuppressionSenders.has(cleanSender);
      if (shouldNotify) {
        this.notifiedSuppressionSenders.set(cleanSender, now);
      }
      return {
        allowed: false,
        reason: `Suspicious sender (SPF/DKIM failed) exceeded rate limit (${senderActive.length}/${this.config.maxSuspiciousPerMinute} per min)`,
        senderCount: senderActive.length,
        domainCount: domainActive.length,
        globalCount: globalActive.length,
        shouldNotifySuppression: shouldNotify,
      };
    }

    // Check sender limit
    if (senderActive.length >= this.config.maxPerSenderPerMinute) {
      const shouldNotify = !this.notifiedSuppressionSenders.has(cleanSender);
      if (shouldNotify) {
        this.notifiedSuppressionSenders.set(cleanSender, now);
      }
      return {
        allowed: false,
        reason: `Sender rate limit exceeded for ${cleanSender} (${senderActive.length}/${this.config.maxPerSenderPerMinute} per min)`,
        senderCount: senderActive.length,
        domainCount: domainActive.length,
        globalCount: globalActive.length,
        shouldNotifySuppression: shouldNotify,
      };
    }

    // Check domain limit
    if (domainActive.length >= this.config.maxPerDomainPerMinute) {
      const key = `domain:${targetDomain}`;
      const shouldNotify = !this.notifiedSuppressionSenders.has(key);
      if (shouldNotify) {
        this.notifiedSuppressionSenders.set(key, now);
      }
      return {
        allowed: false,
        reason: `Domain recipient rate limit exceeded for ${targetDomain} (${domainActive.length}/${this.config.maxPerDomainPerMinute} per min)`,
        senderCount: senderActive.length,
        domainCount: domainActive.length,
        globalCount: globalActive.length,
        shouldNotifySuppression: shouldNotify,
      };
    }

    // Check global limit
    if (globalActive.length >= this.config.maxGlobalPerMinute) {
      const key = 'global:limit';
      const shouldNotify = !this.notifiedSuppressionSenders.has(key);
      if (shouldNotify) {
        this.notifiedSuppressionSenders.set(key, now);
      }
      return {
        allowed: false,
        reason: `Global rate limit exceeded (${globalActive.length}/${this.config.maxGlobalPerMinute} per min)`,
        senderCount: senderActive.length,
        domainCount: domainActive.length,
        globalCount: globalActive.length,
        shouldNotifySuppression: shouldNotify,
      };
    }

    // Register active hits
    this.globalTimestamps.push(now);
    senderActive.push(now);
    this.senderTimestamps.set(cleanSender, senderActive);
    domainActive.push(now);
    this.domainTimestamps.set(targetDomain, domainActive);

    return {
      allowed: true,
      senderCount: senderActive.length,
      domainCount: domainActive.length,
      globalCount: globalActive.length,
    };
  }

  public reset(): void {
    this.globalTimestamps = [];
    this.senderTimestamps.clear();
    this.domainTimestamps.clear();
    this.notifiedSuppressionSenders.clear();
    this.lastPruneTime = 0;
  }
}

export const defaultEmailRateLimiter = new EmailRateLimiter();
