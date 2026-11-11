/**
 * A bounded line-based diff for the interview conflict review.
 * Prefix/suffix trimming avoids work on long equal Markdown documents.
 * On unusually large changed regions the diff stays safe by showing the
 * entire region as removed/added rather than allocating an unbounded matrix.
 */
export type DiffLineKind = "same" | "removed" | "added";
export interface DiffCell {
  line: number;
  text: string;
  kind: DiffLineKind;
}
export interface DiffRow {
  left: DiffCell | null;
  right: DiffCell | null;
}
export type VisibleDiffRow = DiffRow | { collapsed: number };

type Operation = { kind: DiffLineKind; text: string };
const MAX_MATRIX_CELLS = 2_000_000;

function lines(value: string): string[] {
  return value === "" ? [] : value.replace(/\r\n?/g, "\n").split("\n");
}

export function buildLineDiff(left: string, right: string): {
  rows: DiffRow[];
  removed: number;
  added: number;
  coarse: boolean;
} {
  const before = lines(left);
  const after = lines(right);
  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) start++;

  let endBefore = before.length;
  let endAfter = after.length;
  while (endBefore > start && endAfter > start && before[endBefore - 1] === after[endAfter - 1]) {
    endBefore--;
    endAfter--;
  }

  const operations: Operation[] = [];
  for (let i = 0; i < start; i++) operations.push({ kind: "same", text: before[i] });

  const a = before.slice(start, endBefore);
  const b = after.slice(start, endAfter);
  const coarse = a.length * b.length > MAX_MATRIX_CELLS;
  if (coarse) {
    for (const line of a) operations.push({ kind: "removed", text: line });
    for (const line of b) operations.push({ kind: "added", text: line });
  } else {
    const dp = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
    for (let i = a.length - 1; i >= 0; i--) {
      for (let j = b.length - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }

    let i = 0;
    let j = 0;
    while (i < a.length || j < b.length) {
      if (i < a.length && j < b.length && a[i] === b[j]) {
        operations.push({ kind: "same", text: a[i++] });
        j++;
      } else if (i < a.length && (j === b.length || dp[i + 1][j] >= dp[i][j + 1])) {
        operations.push({ kind: "removed", text: a[i++] });
      } else {
        operations.push({ kind: "added", text: b[j++] });
      }
    }
  }

  for (let i = endBefore; i < before.length; i++) {
    operations.push({ kind: "same", text: before[i] });
  }

  const rows: DiffRow[] = [];
  let leftNumber = 0;
  let rightNumber = 0;
  let removed = 0;
  let added = 0;
  let deleted: DiffCell[] = [];
  let inserted: DiffCell[] = [];

  const flush = () => {
    for (let i = 0; i < Math.max(deleted.length, inserted.length); i++) {
      rows.push({ left: deleted[i] ?? null, right: inserted[i] ?? null });
    }
    deleted = [];
    inserted = [];
  };

  for (const operation of operations) {
    if (operation.kind === "same") {
      flush();
      rows.push({
        left: { kind: "same", text: operation.text, line: ++leftNumber },
        right: { kind: "same", text: operation.text, line: ++rightNumber },
      });
    } else if (operation.kind === "removed") {
      deleted.push({ kind: "removed", text: operation.text, line: ++leftNumber });
      removed++;
    } else {
      inserted.push({ kind: "added", text: operation.text, line: ++rightNumber });
      added++;
    }
  }
  flush();
  return { rows, removed, added, coarse };
}

export function compactDiffRows(rows: DiffRow[], context = 2): VisibleDiffRow[] {
  const keep = new Set<number>();
  rows.forEach((row, i) => {
    if (row.left?.kind !== "same" || row.right?.kind !== "same") {
      for (let j = Math.max(0, i - context); j <= Math.min(rows.length - 1, i + context); j++) keep.add(j);
    }
  });

  const result: VisibleDiffRow[] = [];
  let hidden = 0;
  for (let i = 0; i < rows.length; i++) {
    if (!keep.has(i)) {
      hidden++;
      continue;
    }
    if (hidden) result.push({ collapsed: hidden });
    hidden = 0;
    result.push(rows[i]);
  }
  if (hidden) result.push({ collapsed: hidden });
  return result;
}
