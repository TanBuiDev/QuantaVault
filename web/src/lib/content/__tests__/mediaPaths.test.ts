import { describe, expect, it } from "vitest";
import { mediaUrl, rewriteMediaMarkdown } from "../mediaPaths";

describe("scoped study media", () => {
  it("keeps problem and solution files with the same name distinct", () => {
    expect(mediaUrl(1, "assets/problem/example.png")).toBe("/media/1/problem/example.png");
    expect(mediaUrl(1, "assets/solution/example.png")).toBe("/media/1/solution/example.png");
  });
  it("rewrites Markdown and HTML references without changing remote images", () => {
    const markdown = '![A](assets/problem/example.png)\n<img src="./assets/solution/example.png">\n![B](https://example.com/a.png)';
    expect(rewriteMediaMarkdown(markdown, 1)).toBe('![A](/media/1/problem/example.png)\n<img src="/media/1/solution/example.png">\n![B](https://example.com/a.png)');
    expect(rewriteMediaMarkdown(null, 1)).toBeNull();
  });
  it("preserves nested paths and encodes individual segments", () => {
    expect(mediaUrl(1, "assets/problem/nested/a b.png")).toBe("/media/1/problem/nested/a%20b.png");
    expect(() => mediaUrl(1, "assets/problem/../secret.png")).toThrow();
  });
});
