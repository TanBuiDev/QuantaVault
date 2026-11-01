import { expect, test } from "@playwright/test";

test("saved interview content survives reopening and reload; unsaved recovery requires consent", async ({ page }) => {
  await page.goto("/interview/?edit=true&editQuestion=q-001");
  const editor = page.getByPlaceholder("Nhập nội dung câu trả lời chi tiết bằng cú pháp Markdown...");
  await expect(editor).toBeVisible();
  const saved = "Nội dung đã lưu trong kiểm thử hồi quy";
  await editor.fill(saved);
  await page.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  await expect(editor).toHaveCount(0);
  await page.getByRole("button", { name: "Chỉnh sửa câu hỏi", exact: true }).first().click();
  await expect(editor).toHaveValue(saved);
  await page.reload();
  await expect(editor).toHaveValue(saved);

  const unsaved = "Nội dung đang soạn chưa bấm lưu";
  await editor.fill(unsaved);
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("interview_draft_q-001"))).toContain(unsaved);
  await page.reload();
  await expect(editor).toHaveValue(saved);
  await expect(page.getByRole("button", { name: "Khôi phục nháp", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Khôi phục nháp", exact: true }).click();
  await expect(editor).toHaveValue(unsaved);
  await page.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  await expect(editor).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.getItem("interview_draft_q-001"))).toBeNull();
  await page.getByRole("button", { name: "Chỉnh sửa câu hỏi", exact: true }).first().click();
  await expect(editor).toHaveValue(unsaved);
  await page.reload();
  await expect(editor).toHaveValue(unsaved);
  await expect(page.getByRole("button", { name: "Khôi phục nháp", exact: true })).toHaveCount(0);
});
