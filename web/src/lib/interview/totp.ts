import { fromBase32 } from "./base32";

export interface TotpOptions {
  stepSeconds?: number;
  digits?: number;
  window?: number;
  timestampMs?: number;
}

/**
 * Generates an RFC 6238 Time-based One-Time Password (TOTP)
 * Uses Web Crypto API (supported natively in Cloudflare Workers, Node.js 18+, and Modern Browsers).
 */
export async function generateTOTP(
  secret: string,
  timestampMs: number = Date.now(),
  stepSeconds: number = 30,
  digits: number = 6
): Promise<string> {
  const rawKey = fromBase32(secret);
  const timeStep = Math.floor(timestampMs / 1000 / stepSeconds);

  const timeBuffer = new ArrayBuffer(8);
  const view = new DataView(timeBuffer);
  view.setUint32(0, Math.floor(timeStep / 0x100000000));
  view.setUint32(4, timeStep >>> 0);

  const subtle = globalThis.crypto.subtle;
  const cryptoKey = await subtle.importKey(
    "raw",
    rawKey as unknown as BufferSource,
    { name: "HMAC", hash: { name: "SHA-1" } },
    false,
    ["sign"]
  );

  const signatureBuffer = await subtle.sign("HMAC", cryptoKey, timeBuffer);
  const signature = new Uint8Array(signatureBuffer);

  const offset = signature[signature.length - 1] & 0x0f;
  const binary =
    ((signature[offset] & 0x7f) << 24) |
    ((signature[offset + 1] & 0xff) << 16) |
    ((signature[offset + 2] & 0xff) << 8) |
    (signature[offset + 3] & 0xff);

  const otp = binary % Math.pow(10, digits);
  return otp.toString().padStart(digits, "0");
}

/**
 * Verifies an entered TOTP token with tolerance window.
 * Default window is 1 (+/- 30 seconds drift tolerance).
 */
export async function verifyTOTP(
  token: string,
  secret: string,
  options?: TotpOptions
): Promise<boolean> {
  const cleanToken = token.replace(/\s+/g, "");
  if (!cleanToken || cleanToken.length !== (options?.digits ?? 6)) {
    return false;
  }

  const stepSeconds = options?.stepSeconds ?? 30;
  const digits = options?.digits ?? 6;
  const window = options?.window ?? 1;
  const now = options?.timestampMs ?? Date.now();

  for (let w = -window; w <= window; w++) {
    const checkTime = now + w * stepSeconds * 1000;
    const expected = await generateTOTP(secret, checkTime, stepSeconds, digits);
    if (expected === cleanToken) {
      return true;
    }
  }

  return false;
}

/**
 * Creates an otpauth URI for QR code generation
 */
export function getOtpAuthUrl(
  accountName: string,
  issuer: string,
  secret: string
): string {
  const encAccount = encodeURIComponent(accountName);
  const encIssuer = encodeURIComponent(issuer);
  return `otpauth://totp/${encIssuer}:${encAccount}?secret=${secret}&issuer=${encIssuer}&algorithm=SHA1&digits=6&period=30`;
}

export const DEFAULT_TOTP_SECRET = "ACNDJOJFMRGAE3CKKU3UG3MZVSQXTBRJ";
export const DEFAULT_TOTP_ISSUER = "Java Interview CMS";
export const DEFAULT_TOTP_ACCOUNT = "admin";

/**
 * Generates a Base64 data:image/png URL on-the-fly for rendering QR Code in <img />
 */
export async function generateQrDataUrl(otpauthUrl: string): Promise<string> {
  const QRCodeModule = await import("qrcode");
  const QRCode = QRCodeModule.default ?? QRCodeModule;
  return QRCode.toDataURL(otpauthUrl, {
    width: 220,
    margin: 2,
    color: {
      dark: "#1e1b4b",
      light: "#ffffff",
    },
  });
}

