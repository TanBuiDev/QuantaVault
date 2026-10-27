import { describe, it, expect } from "vitest";
import { toBase32, fromBase32 } from "../base32";
import { generateTOTP, verifyTOTP, getOtpAuthUrl } from "../totp";

describe("Base32 Encoding/Decoding", () => {
  it("mã hóa và giải mã chuỗi byte chính xác", () => {
    const original = new Uint8Array([72, 101, 108, 108, 111, 33]); // "Hello!"
    const encoded = toBase32(original);
    expect(encoded).toBe("JBSWY3DPEE");
    const decoded = fromBase32(encoded);
    expect(decoded).toEqual(original);
  });

  it("xử lý bỏ qua dấu cách và gạch ngang khi giải mã", () => {
    const raw = "JBSW-Y3DP EE";
    const decoded = fromBase32(raw);
    expect(decoded).toEqual(new Uint8Array([72, 101, 108, 108, 111, 33]));
  });
});

describe("RFC 6238 TOTP Implementation", () => {
  // RFC 6238 Test Vector: Secret "12345678901234567890" -> Base32 "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
  const rfcSecret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

  it("khớp với RFC 6238 test vector tại T=59s (T=1)", async () => {
    const otp = await generateTOTP(rfcSecret, 59 * 1000);
    expect(otp).toBe("287082");
  });

  it("khớp với RFC 6238 test vector tại T=1111111109s", async () => {
    const otp = await generateTOTP(rfcSecret, 1111111109 * 1000);
    expect(otp).toBe("081804");
  });

  it("khớp với RFC 6238 test vector tại T=1234567890s", async () => {
    const otp = await generateTOTP(rfcSecret, 1234567890 * 1000);
    expect(otp).toBe("005924");
  });

  it("khớp với RFC 6238 test vector tại T=2000000000s", async () => {
    const otp = await generateTOTP(rfcSecret, 2000000000 * 1000);
    expect(otp).toBe("279037");
  });

  it("xác thực thành công với mã hiện tại", async () => {
    const now = Date.now();
    const currentOtp = await generateTOTP(rfcSecret, now);
    const isValid = await verifyTOTP(currentOtp, rfcSecret, { timestampMs: now });
    expect(isValid).toBe(true);
  });

  it("xác thực thành công với độ trễ +/- 1 chu kỳ (30s drift)", async () => {
    const now = 1000000000 * 1000;
    // Mã sinh ở chu kỳ trước (cách 25 giây)
    const prevOtp = await generateTOTP(rfcSecret, now - 25000);
    const isValid = await verifyTOTP(prevOtp, rfcSecret, { timestampMs: now, window: 1 });
    expect(isValid).toBe(true);
  });

  it("từ chối mã sai hoặc mã quá hạn ngoài window", async () => {
    const now = 1000000000 * 1000;
    const oldOtp = await generateTOTP(rfcSecret, now - 90000); // 3 chu kỳ trước
    const isOldValid = await verifyTOTP(oldOtp, rfcSecret, { timestampMs: now, window: 1 });
    expect(isOldValid).toBe(false);

    const isWrongValid = await verifyTOTP("999999", rfcSecret, { timestampMs: now });
    expect(isWrongValid).toBe(false);
  });

  it("tạo đúng định dạng otpauth URL", () => {
    const url = getOtpAuthUrl("admin@lehoang", "Java Interview CMS", rfcSecret);
    expect(url).toBe(
      `otpauth://totp/Java%20Interview%20CMS:admin%40lehoang?secret=${rfcSecret}&issuer=Java%20Interview%20CMS&algorithm=SHA1&digits=6&period=30`
    );
  });
});
