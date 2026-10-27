import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRateLimiter } from "../rateLimiter";

describe("MemoryRateLimiter", () => {
  let limiter: MemoryRateLimiter;

  beforeEach(() => {
    limiter = new MemoryRateLimiter();
  });

  it("allows initial attempt with 2 remaining attempts", () => {
    const check = limiter.check("1.2.3.4");
    expect(check.allowed).toBe(true);
    expect(check.remainingAttempts).toBe(2);
  });

  it("warns on 1st failed attempt without locking", () => {
    const res = limiter.recordFailure("1.2.3.4");
    expect(res.locked).toBe(false);
    expect(res.remainingAttempts).toBe(1);

    const check = limiter.check("1.2.3.4");
    expect(check.allowed).toBe(true);
  });

  it("locks for 60 seconds on 2nd consecutive failure", () => {
    limiter.recordFailure("1.2.3.4");
    const res = limiter.recordFailure("1.2.3.4");

    expect(res.locked).toBe(true);
    expect(res.retryAfterSeconds).toBe(60);

    const check = limiter.check("1.2.3.4");
    expect(check.allowed).toBe(false);
    expect(check.retryAfterSeconds).toBeGreaterThan(0);
    expect(check.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it("increases penalty to 10 minutes on 3rd failure after initial lock", () => {
    limiter.recordFailure("1.2.3.4");
    limiter.recordFailure("1.2.3.4"); // locked 60s

    // Fast-forward 61 seconds
    vi.setSystemTime(Date.now() + 61 * 1000);

    // After 60s, client can try again
    const check = limiter.check("1.2.3.4");
    expect(check.allowed).toBe(true);

    // But fails again -> 3rd failure -> 600s penalty
    const res = limiter.recordFailure("1.2.3.4");
    expect(res.locked).toBe(true);
    expect(res.retryAfterSeconds).toBe(600);
  });

  it("resets on success", () => {
    limiter.recordFailure("1.2.3.4");
    limiter.recordSuccess("1.2.3.4");

    const check = limiter.check("1.2.3.4");
    expect(check.allowed).toBe(true);
    expect(check.remainingAttempts).toBe(2);
  });

  it("tracks different IPs independently", () => {
    limiter.recordFailure("1.1.1.1");
    limiter.recordFailure("1.1.1.1");

    expect(limiter.check("1.1.1.1").allowed).toBe(false);
    expect(limiter.check("2.2.2.2").allowed).toBe(true);
  });
});
