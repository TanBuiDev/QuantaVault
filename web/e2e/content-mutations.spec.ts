import { expect, test } from "@playwright/test";

// playwright.config starts a production server against an isolated temporary
// CONTENT_ROOT. All writes in this test therefore target copied study content.
test("reference code CRUD refreshes production content and preserves workspace state", async ({ page }) => {
  await page.goto("/problems/121");
  await page.evaluate(() => {
    localStorage.setItem("preferred_layout_mode", "classic");
    localStorage.setItem("user_code_121", "class Solution { /* saved personal draft */ }");
  });
  await page.reload();
  await page.getByRole("tab", { name: "Solution", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Java solution", exact: true })).toBeVisible();
  await page.evaluate(() => { Object.assign(window, { workspaceRefreshMarker: "preserve-me" }); });

  const uniqueName = `E2E reference ${Date.now()}`;
  await page.getByRole("button", { name: "Thêm code", exact: true }).click();
  const modal = page.getByRole("dialog");
  await modal.getByLabel("Tên phiên bản (Tùy chọn)").fill(uniqueName);
  await modal.getByLabel("Code Java (Tùy chọn)").fill("class Solution { /* CREATED_REFERENCE */ }");
  const createdResponse = page.waitForResponse(response => response.url().endsWith("/api/code-versions") && response.request().method() === "POST");
  await modal.getByRole("button", { name: "Lưu phiên bản code", exact: true }).click();
  const created = await createdResponse;
  expect(created.ok()).toBe(true);
  expect(created.request().headers()["x-workspace-request"]).toBe("1");
  await expect(modal).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "Solution", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: uniqueName, exact: true }).click();
  await expect(page.locator("pre").filter({ hasText: "CREATED_REFERENCE" })).toBeVisible();

  await page.getByRole("button", { name: "Sửa code", exact: true }).click();
  await modal.getByLabel("Code Java (Tùy chọn)").fill("class Solution { /* UPDATED_REFERENCE */ }");
  await modal.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  await expect(modal).toHaveCount(0);
  // The selected reference ID stays selected when refreshed server props arrive.
  await expect(page.locator("pre").filter({ hasText: "UPDATED_REFERENCE" })).toBeVisible();
  await expect(page.locator("pre").filter({ hasText: "CREATED_REFERENCE" })).toHaveCount(0);

  await page.getByRole("button", { name: "Xóa", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Xóa phiên bản", exact: true }).click();
  await expect(page.getByRole("button", { name: uniqueName, exact: true })).toHaveCount(0);
  await expect(page.locator("pre").filter({ hasText: "UPDATED_REFERENCE" })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "Solution", exact: true })).toHaveAttribute("aria-selected", "true");
  expect(await page.evaluate(() => Reflect.get(window, "workspaceRefreshMarker"))).toBe("preserve-me");
  expect(await page.evaluate(() => localStorage.getItem("user_code_121"))).toBe("class Solution { /* saved personal draft */ }");
  // A fresh document also sees the final server state, with the original intact.
  await page.reload();
  await page.getByRole("tab", { name: "Solution", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Java solution", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: uniqueName, exact: true })).toHaveCount(0);
});

