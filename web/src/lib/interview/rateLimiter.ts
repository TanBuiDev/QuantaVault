/**
 * Exponential Backoff Rate Limiter for Publish API
 * Protects against brute-force attacks on 6-digit TOTP / admin credentials.
 */

export interface RateLimitEntry {
  attempts: number;
  lockedUntil: number;
  lastAttempt: number;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
  message?: string;
}

export class MemoryRateLimiter {
  private entries = new Map<string, RateLimitEntry>();

  /**
   * Exponential backoff penalty schedule based on consecutive failed attempts:
   * 1 attempt: warning, 0s penalty
   * 2 attempts: 60s (1 minute) penalty
   * 3-4 attempts: 600s (10 minutes) penalty
   * 5+ attempts: 3600s (1 hour) penalty
   */
  getBackoffSeconds(attempts: number): number {
    if (attempts <= 1) return 0;
    if (attempts === 2) return 60; // 1 minute
    if (attempts <= 4) return 600; // 10 minutes
    return 3600; // 1 hour
  }

  /**
   * Check if a client IP is currently allowed or locked out
   */
  check(ip: string): RateLimitCheckResult {
    const cleanIp = (ip || "unknown").trim();
    const now = Date.now();
    const entry = this.entries.get(cleanIp);

    if (!entry) {
      return { allowed: true, remainingAttempts: 2 };
    }

    // Active lock check
    if (entry.lockedUntil > now) {
      const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
      return {
        allowed: false,
        retryAfterSeconds,
        message: `Bạn đã nhập sai nhiều lần. Vui lòng chờ ${retryAfterSeconds} giây trước khi thử lại.`,
      };
    }

    // If more than 15 minutes of inactivity since last attempt and not locked, reset
    if (now - entry.lastAttempt > 15 * 60 * 1000) {
      this.entries.delete(cleanIp);
      return { allowed: true, remainingAttempts: 2 };
    }

    const remaining = Math.max(1, 2 - (entry.attempts % 2 || 2));
    return { allowed: true, remainingAttempts: remaining };
  }

  /**
   * Record a failed verification attempt and return lock state
   */
  recordFailure(ip: string): {
    locked: boolean;
    retryAfterSeconds: number;
    remainingAttempts: number;
    message: string;
  } {
    const cleanIp = (ip || "unknown").trim();
    const now = Date.now();
    const entry = this.entries.get(cleanIp) || { attempts: 0, lockedUntil: 0, lastAttempt: now };

    entry.attempts += 1;
    entry.lastAttempt = now;

    const backoffSeconds = this.getBackoffSeconds(entry.attempts);
    if (backoffSeconds > 0) {
      entry.lockedUntil = now + backoffSeconds * 1000;
      this.entries.set(cleanIp, entry);
      const minutes = Math.round(backoffSeconds / 60);
      return {
        locked: true,
        retryAfterSeconds: backoffSeconds,
        remainingAttempts: 0,
        message: `Bạn đã nhập sai ${entry.attempts} lần liên tiếp. Hệ thống tạm khóa trong ${
          backoffSeconds >= 60 ? `${minutes} phút` : `${backoffSeconds} giây`
        }.`,
      };
    }

    this.entries.set(cleanIp, entry);
    return {
      locked: false,
      retryAfterSeconds: 0,
      remainingAttempts: 1,
      message: "Mã OTP không chính xác. Bạn còn 1 lần thử trước khi bị tạm khóa 60 giây.",
    };
  }

  /**
   * Reset client IP history on successful OTP verification
   */
  recordSuccess(ip: string): void {
    const cleanIp = (ip || "unknown").trim();
    this.entries.delete(cleanIp);
  }

  /**
   * Clear all records (useful for testing)
   */
  reset(): void {
    this.entries.clear();
  }
}

// Global shared singleton instance
export const globalRateLimiter = new MemoryRateLimiter();
