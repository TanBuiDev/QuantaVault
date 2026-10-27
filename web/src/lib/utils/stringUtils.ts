/**
 * Removes Vietnamese diacritical marks (accents) from a string.
 * Example: "Đa luồng & Đồng bộ" -> "Da luong & Dong bo"
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/**
 * Checks whether the target text matches the search query,
 * supporting both exact match and Vietnamese accent-insensitive match.
 */
export function matchesSearch(target: string | undefined | null, query: string): boolean {
  if (!target) return false;
  if (!query || !query.trim()) return true;

  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();

  // Fast path: direct substring match
  if (t.includes(q)) return true;

  // Normalized path: accent-insensitive match
  const cleanQ = removeVietnameseTones(q);
  const cleanT = removeVietnameseTones(t);

  return cleanT.includes(cleanQ);
}
