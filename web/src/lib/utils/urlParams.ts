"use client";

/**
 * Reads current URL search parameters safely in client environment.
 */
export function getUrlParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  try {
    return new URLSearchParams(window.location.search);
  } catch {
    return new URLSearchParams();
  }
}

/**
 * Updates URL search parameters in place using window.history.replaceState
 * without triggering a page reload or disrupting the React component tree.
 * Passing null, undefined, or empty string deletes the key to keep the URL clean.
 */
export function updateUrlParams(
  updates: Record<string, string | number | null | undefined>,
  defaults?: Record<string, string | number | null | undefined>
): void {
  if (typeof window === "undefined") return;

  try {
    const url = new URL(window.location.href);

    for (const [key, val] of Object.entries(updates)) {
      if (
        val === null ||
        val === undefined ||
        val === "" ||
        (defaults && defaults[key] !== undefined && String(defaults[key]) === String(val))
      ) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, String(val));
      }
    }

    const searchStr = url.searchParams.toString();
    const newRelativePath =
      url.pathname + (searchStr ? `?${searchStr}` : "") + (url.hash || "");

    window.history.replaceState(window.history.state, "", newRelativePath);
  } catch {
    // Ignore URL manipulation errors
  }
}
