import { describe, expect, it } from "vitest";
import { buildLineDiff, compactDiffRows } from "../publishedConflictDiff";

describe("published conflict Git-style diff", () => {
  it("identifies the exact changed line with correct old/new line numbers", () => {
    const diff = buildLineDiff("first\nold Markdown\nlast", "first\nnew Markdown\nlast");
    expect(diff).toMatchObject({ removed: 1, added: 1, coarse: false });
    expect(diff.rows).toEqual([
      { left: { kind: "same", line: 1, text: "first" }, right: { kind: "same", line: 1, text: "first" } },
      { left: { kind: "removed", line: 2, text: "old Markdown" }, right: { kind: "added", line: 2, text: "new Markdown" } },
      { left: { kind: "same", line: 3, text: "last" }, right: { kind: "same", line: 3, text: "last" } },
    ]);
  });

  it("shows insertions and deletions without matching them against unrelated lines", () => {
    const diff = buildLineDiff("before\nremoved 1\nremoved 2\nafter", "before\nadded\nafter");
    expect(diff).toMatchObject({ removed: 2, added: 1, coarse: false });
    expect(diff.rows[1]).toMatchObject({
      left: { kind: "removed", line: 2, text: "removed 1" },
      right: { kind: "added", line: 2, text: "added" },
    });
    expect(diff.rows[2]).toMatchObject({ left: { kind: "removed", line: 3 }, right: null });
    expect(diff.rows[3].left?.line).toBe(4);
    expect(diff.rows[3].right?.line).toBe(3);
  });

  it("normalizes CRLF line endings and does not create a false difference", () => {
    const diff = buildLineDiff("Java\r\nSpring\r\nPostgreSQL", "Java\nSpring\nPostgreSQL");
    expect(diff).toMatchObject({ removed: 0, added: 0, coarse: false });
    expect(diff.rows).toHaveLength(3);
  });

  it("collapses only unchanged context and exposes all changes", () => {
    const before = Array.from({ length: 24 }, (_, index) => "line " + (index + 1)).join("\n");
    const after = before.replace("line 13", "line 13 changed");
    const diff = buildLineDiff(before, after);
    const compact = compactDiffRows(diff.rows);
    expect(compact.some(row => "collapsed" in row && row.collapsed > 0)).toBe(true);
    expect(compact.some(row => "left" in row && row.left?.text === "line 13")).toBe(true);
    expect(compact.some(row => "right" in row && row.right?.text === "line 13 changed")).toBe(true);
    expect(diff.rows).toHaveLength(24);
  });

  it("handles missing questions and empty text without throwing", () => {
    const diff = buildLineDiff("Existing Java question", "");
    expect(diff).toMatchObject({ removed: 1, added: 0 });
    expect(diff.rows).toHaveLength(1);
    expect(diff.rows[0].right).toBeNull();
    expect(buildLineDiff("", "")).toMatchObject({ removed: 0, added: 0, rows: [] });
  });

  it("bounds memory for massive changed Markdown while still preserving all text", () => {
    const left = Array.from({ length: 1500 }, (_, i) => "old-" + i).join("\n");
    const right = Array.from({ length: 1500 }, (_, i) => "new-" + i).join("\n");
    const diff = buildLineDiff(left, right);
    expect(diff.coarse).toBe(true);
    expect(diff).toMatchObject({ removed: 1500, added: 1500 });
    expect(diff.rows).toHaveLength(1500);
    expect(diff.rows[1499].left?.text).toBe("old-1499");
    expect(diff.rows[1499].right?.text).toBe("new-1499");
  });
});
