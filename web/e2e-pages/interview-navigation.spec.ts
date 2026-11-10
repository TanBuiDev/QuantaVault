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
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("interview_draft_q-001"))).toContain(markdown);
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
    .toBe(markdown.indexOf("banana"));

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
