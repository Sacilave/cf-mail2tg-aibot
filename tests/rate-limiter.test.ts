import { describe, it, expect, beforeEach } from 'vitest';
import {
  EmailRateLimiter,
  DEFAULT_CONFIG,
  extractDomain,
} from '../src/rate-limiter';

describe('EmailRateLimiter - 多站点隔离与智能防轰炸频控测试', () => {
  let limiter: EmailRateLimiter;

  beforeEach(() => {
    limiter = new EmailRateLimiter({
      maxPerSenderPerMinute: 3,
      maxPerDomainPerMinute: 8,
      maxGlobalPerMinute: 15,
      maxSuspiciousPerMinute: 1,
      windowMs: 60 * 1000,
    });
  });

  it('同一发件人 1 分钟内前 3 封放行，第 4 封触发超限并返回首封预警标志', () => {
    const sender = 'spammer@example.com';
    const baseTime = 1700000000000;

    expect(limiter.check({ from: sender, now: baseTime }).allowed).toBe(true);
    expect(limiter.check({ from: sender, now: baseTime + 5000 }).allowed).toBe(true);
    expect(limiter.check({ from: sender, now: baseTime + 10000 }).allowed).toBe(true);

    const fourth = limiter.check({ from: sender, now: baseTime + 15000 });
    expect(fourth.allowed).toBe(false);
    expect(fourth.reason).toContain('Sender rate limit exceeded');
    expect(fourth.shouldNotifySuppression).toBe(true);

    const fifth = limiter.check({ from: sender, now: baseTime + 20000 });
    expect(fifth.allowed).toBe(false);
    expect(fifth.shouldNotifySuppression).toBe(false);
  });

  it('多网站租户隔离: siteA 遭垃圾邮件轰炸不应波及 siteB 的正常来信', () => {
    const baseTime = 1700000000000;

    for (let i = 1; i <= 8; i++) {
      const res = limiter.check({
        from: `bot_${i}@attacker.com`,
        to: 'admin@siteA.com',
        now: baseTime + i * 100,
      });
      expect(res.allowed).toBe(true);
    }

    const siteANinth = limiter.check({
      from: 'bot_9@attacker.com',
      to: 'admin@siteA.com',
      now: baseTime + 1000,
    });
    expect(siteANinth.allowed).toBe(false);
    expect(siteANinth.reason).toContain('Domain recipient rate limit exceeded for sitea.com');

    const siteBFirst = limiter.check({
      from: 'partner@company.com',
      to: 'hello@siteB.com',
      now: baseTime + 1200,
    });
    expect(siteBFirst.allowed).toBe(true);
  });

  it('时间窗口滑动经过 60 秒后，发件人频控自动解封', () => {
    const sender = 'user@example.com';
    const t0 = 1700000000000;

    limiter.check({ from: sender, now: t0 });
    limiter.check({ from: sender, now: t0 + 1000 });
    limiter.check({ from: sender, now: t0 + 2000 });
    expect(limiter.check({ from: sender, now: t0 + 3000 }).allowed).toBe(false);

    const tAfter = t0 + 61 * 1000;
    const res = limiter.check({ from: sender, now: tAfter });
    expect(res.allowed).toBe(true);
  });

  it('未通过 SPF/DKIM 鉴真的可疑仿冒邮件，1 分钟内严格只允许 1 封', () => {
    const suspiciousSender = 'spoofed@bank.com';
    const baseTime = 1700000000000;

    const first = limiter.check({
      from: suspiciousSender,
      isSpfPass: false,
      isDkimPass: false,
      now: baseTime,
    });
    expect(first.allowed).toBe(true);

    const second = limiter.check({
      from: suspiciousSender,
      isSpfPass: false,
      isDkimPass: false,
      now: baseTime + 2000,
    });
    expect(second.allowed).toBe(false);
    expect(second.reason).toContain('Suspicious sender');
  });

  it('全局突发保护: 超过 maxGlobalPerMinute (15 封) 时触发全局拦截', () => {
    const baseTime = 1700000000000;

    for (let i = 1; i <= 15; i++) {
      const res = limiter.check({
        from: `user_${i}@domain${i}.com`,
        to: `admin@target${i}.com`,
        now: baseTime + i * 50,
      });
      expect(res.allowed).toBe(true);
    }

    const sixteenth = limiter.check({
      from: 'extra@domain99.com',
      to: 'admin@target99.com',
      now: baseTime + 1000,
    });
    expect(sixteenth.allowed).toBe(false);
    expect(sixteenth.reason).toContain('Global rate limit exceeded');
    expect(sixteenth.shouldNotifySuppression).toBe(true);
  });

  it('reset 方法应正确清空所有滑动时间戳与抑制状态', () => {
    const sender = 'reset-test@example.com';
    const baseTime = 1700000000000;

    limiter.check({ from: sender, now: baseTime });
    limiter.check({ from: sender, now: baseTime + 100 });
    limiter.check({ from: sender, now: baseTime + 200 });
    expect(limiter.check({ from: sender, now: baseTime + 300 }).allowed).toBe(false);

    limiter.reset();

    expect(limiter.check({ from: sender, now: baseTime + 400 }).allowed).toBe(true);
  });
});
