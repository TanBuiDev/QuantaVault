import { describe, expect, it } from "vitest";

import { formatJavaSource } from "@/lib/javaFormatter";

describe("formatJavaSource", () => {
  it("formats compact LeetCode-style Java into readable blocks", () => {
    const source = "class Solution{public int abs(int x){if(x>=0){return x;}else{return -x;}}}";

    expect(formatJavaSource(source)).toBe([
      "class Solution {",
      "    public int abs(int x) {",
      "        if (x>=0) {",
      "            return x;",
      "        } else {",
      "            return -x;",
      "        }",
      "    }",
      "}",
    ].join("\n"));
  });

  it("does not split semicolons inside a for-loop header", () => {
    const source = "class Solution{void run(int n){for(int i=0;i<n;i++){System.out.println(i);}}}";

    const formatted = formatJavaSource(source);
    expect(formatted).toContain("for (int i=0; i<n; i++) {");
    expect(formatted).toContain("        System.out.println(i);");
  });

  it("keeps braces and semicolons inside strings and comments intact", () => {
    const source = 'class Solution{String value(){// }; stays comment\nreturn "};";}}';

    const formatted = formatJavaSource(source);
    expect(formatted).toContain("// }; stays comment");
    expect(formatted).toContain('return "};";');
  });

  it("formats array initializer braces without changing their contents", () => {
    const source = "class Solution{int[] pair(){return new int[]{1,2};}}";

    expect(formatJavaSource(source)).toContain([
      "        return new int[] {",
      "            1, 2",
      "        };",
    ].join("\n"));
  });
});
