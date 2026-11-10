import { expect, test } from "@playwright/test";

const editorSelector = "Nhập nội dung câu trả lời chi tiết bằng cú pháp Markdown...";

test("split preview navigates precisely without editing content or creating extra drafts", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/interview/?edit=true&editQuestion=q-001");
  const editor = page.getByPlaceholder(editorSelector);
  await expect(editor).toBeVisible();
  const markdown = [
    "## Java example",
    "",
    "Repeated paragraph.",
    "",
    "Repeated paragraph.",
    "",
    "- first",
    "- second",
    "",
    "```java",
    "Map<Character, Integer> frequency = new HashMap<>();",
    "```",
    "",
    "| Name | Count |",
    "| --- | --- |",
    "| banana | 3 |",
  ].join("\n");
  await editor.fill(markdown);
  await expect.poll(() => page.evaluate(() => {
    const raw = sessionStorage.getItem("interview_draft_q-001");
    return raw ? JSON.parse(raw).values?.answerMarkdown : null;
  })).toBe(markdown);
  const beforeDraft = await page.evaluate(() => sessionStorage.getItem("interview_draft_q-001"));

  await page.getByRole("button", { name: "Song song" }).click();
  const preview = page.locator(".md-source-navigation");
  await expect(preview.getByRole("heading", { name: "Java example" })).toBeVisible();

  await preview.getByText("Repeated paragraph.", { exact: true }).nth(1).click();
  await expect.poll(() => editor.evaluate((el) => (el as HTMLTextAreaElement).selectionStart))
    .toBe(markdown.lastIndexOf("Repeated paragraph."));

  await preview.getByText("second", { exact: true }).click();
  await expect.poll(() => editor.evaluate((el) => (el as HTMLTextAreaElement).selectionStart))
    .toBe(markdown.indexOf("- second"));

  await preview.getByRole("cell", { name: "banana" }).click();
  await expect.poll(() => editor.evaluate((el) => (el as HTMLTextAreaElement).selectionStart))
    .toBe(markdown.indexOf("| banana"));

  const codeBlock = preview.locator('[data-md-source-offset]').filter({ has: page.locator("pre code") }).first();
  await codeBlock.focus();
  await codeBlock.press("Enter");
  await expect.poll(() => editor.evaluate((el) => (el as HTMLTextAreaElement).selectionStart))
    .toBe(markdown.indexOf("```java"));
  await expect(editor).toHaveValue(markdown);
  expect(await page.evaluate(() => sessionStorage.getItem("interview_draft_q-001"))).toBe(beforeDraft);
});

test("wrapped paragraphs scroll to the actual target caret in fullscreen", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/interview/?edit=true&editQuestion=q-001");
  const editor = page.getByPlaceholder(editorSelector);
  await expect(editor).toBeVisible();
  const longLine = "many wrapped words ".repeat(180);
  const markdown = longLine + "\n\n## Final target\n\nDone.";
  await editor.fill(markdown);
  await page.getByRole("button", { name: "Song song" }).click();
  await page.getByRole("button", { name: "Mở rộng toàn màn hình" }).click();
  const heading = page.locator(".md-source-navigation").getByRole("heading", { name: "Final target" });
  await expect(heading).toBeVisible();
  await heading.click();
  await expect.poll(() => editor.evaluate((el) => (el as HTMLTextAreaElement).selectionStart))
    .toBe(markdown.indexOf("## Final target"));
  await expect.poll(() => editor.evaluate((el) => (el as HTMLTextAreaElement).scrollTop))
    .toBeGreaterThan(0);
  await expect(editor).toHaveValue(markdown);
});


test("large Markdown document records browser navigation latency without mutating draft", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/interview/?edit=true&editQuestion=q-001");
  const editor = page.getByPlaceholder(editorSelector);
  await expect(editor).toBeVisible();
  const markdown = Array.from({ length: 220 }, (_, i) =>
    "## Section " + i + "\n\n" + "This is a Java interview explanation containing multiple words. ".repeat(3),
  ).join("\n\n");
  await editor.fill(markdown);
  await expect.poll(() => page.evaluate(() => {
    const raw = sessionStorage.getItem("interview_draft_q-001");
    return raw ? JSON.parse(raw).values?.answerMarkdown : null;
  })).toBe(markdown);
  const baselineDraft = await page.evaluate(() => sessionStorage.getItem("interview_draft_q-001"));
  await page.getByRole("button", { name: "Song song" }).click();
  const lastHeading = page.locator(".md-source-navigation").getByRole("heading", { name: "Section 219" });
  await expect(lastHeading).toBeVisible();
  const start = Date.now();
  await lastHeading.click();
  await expect.poll(() => editor.evaluate((element) => (element as HTMLTextAreaElement).selectionStart))
    .toBe(markdown.lastIndexOf("## Section 219"));
  const latencyMs = Date.now() - start;
  const jsBytes = await page.evaluate(() => performance.getEntriesByType("resource")
    .filter((entry) => entry.name.includes(".js"))
    .reduce((sum, entry) => sum + ((entry as PerformanceResourceTiming).encodedBodySize || 0), 0));
  console.log("[navigation-benchmark] 220 sections, click-to-caret=" + latencyMs + "ms, loaded-JS=" + jsBytes + " bytes");
  await expect(editor).toHaveValue(markdown);
  expect(await page.evaluate(() => sessionStorage.getItem("interview_draft_q-001"))).toBe(baselineDraft);
});


test("preview list retains original unboxed appearance while navigation remains functional", async ({ page }) => {
  await page.goto("/interview/?edit=true&editQuestion=q-001");
  const editor = page.getByPlaceholder(editorSelector);
  await expect(editor).toBeVisible();
  const markdown = [
    "**Các bước thực hiện:**",
    "",
    "1. Khởi tạo `LinkedHashMap<String, Integer>` để lưu tần suất.",
    "2. Duyệt từng phần tử trong List.",
    "3. Nếu đã tồn tại thì tăng số đếm.",
  ].join("\n");
  await editor.fill(markdown);
  await page.getByRole("button", { name: "Song song" }).click();

  const preview = page.locator(".md-source-navigation");
  const list = preview.locator("ol").first();
  const firstItem = list.locator("li").first();
  await expect(firstItem).toBeVisible();
  await firstItem.hover();

  for (const element of [list, firstItem]) {
    expect(await element.evaluate(node => getComputedStyle(node).outlineStyle)).toBe("none");
  }

  // Keyboard access remains available, without the previous rectangular focus ring.
  await firstItem.focus();
  expect(await firstItem.evaluate(node => getComputedStyle(node).outlineStyle)).toBe("none");
  await firstItem.press("Enter");
  await expect.poll(() => editor.evaluate(node => (node as HTMLTextAreaElement).selectionStart))
    .toBe(markdown.indexOf("1. Khởi tạo"));
  await expect(editor).toHaveValue(markdown);
});
