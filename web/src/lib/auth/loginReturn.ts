/** Internal navigation only: an OAuth callback must never be an open redirect. */
export function safeReturnTo(raw: string | null | undefined): string {
  if (!raw || raw.length > 1600 || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") ||
      /[\x00-\x1f\x7f]/.test(raw) || /%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f|2e)/i.test(raw) ||
      /(?:^|\/)\.\.(?:\/|$)/.test(raw.split(/[?#]/)[0])) return "/interview/";
  try {
    const url = new URL(raw, "https://quantavault.pages.dev");
    if (url.origin !== "https://quantavault.pages.dev") return "/interview/";
    return url.pathname + url.search + url.hash;
  } catch { return "/interview/"; }
}
export function googleLoginHref(): string {
  const target = typeof window === "undefined" ? "/interview/" : window.location.pathname + window.location.search + window.location.hash;
  return "/api/auth/google/start?returnTo=" + encodeURIComponent(safeReturnTo(target));
}
