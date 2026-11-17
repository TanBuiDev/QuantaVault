import { expect, test } from "@playwright/test";

const card = "article#question-q-010";

test("numeric, badge, and technical-ID searches resolve only q-010 without renumbering", async ({ page }) => {
  await page.goto("/interview/");
  const search = page.getByPlaceholder(/Tìm theo câu hỏi/i);
  for (const term of ["010", "#010", "q-010"]) {
    await search.fill(term);
    await expect(page.locator("article[id^='question-']")).toHaveCount(1);
    await expect(page.locator(card)).toContainText("MinIO");
    await expect(page.locator(card).locator("span.font-mono").first()).toHaveText("#010");
  }
  await search.fill("#99999");
  await expect(page.getByText("Không tìm thấy câu hỏi phù hợp")).toBeVisible();
});

test("direct question URL wins over saved filters, reloads, and supports browser history", async ({ page }) => {
  // An authorized editor keeps edit=true. Ordinary accounts intentionally discard it.
  await page.route("**/api/auth/session", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ ok: true, user: { id: "e2e-admin", name: "Admin", email: "admin@example.com", role: "admin" } }),
  }));
  await page.goto("/interview/?search=unmatched-string-xyz&questionId=q-010&edit=true");
  await expect(page.locator(card)).toBeVisible();
  await expect(page.locator(card)).toContainText("#010");
  await expect(page).toHaveURL(/edit=true/);
  await page.reload();
  await expect(page.locator(card)).toBeVisible();

  await page.getByRole("button", { name: "Quay lại danh sách" }).click();
  await expect(page).not.toHaveURL(/questionId=/);
  await expect(page).toHaveURL(/edit=true/);
  await expect(page.getByText("Không tìm thấy câu hỏi phù hợp")).toBeVisible();
  await page.goBack();
  await expect(page.locator(card)).toBeVisible();
  await page.goForward();
  await expect(page.getByText("Không tìm thấy câu hỏi phù hợp")).toBeVisible();
});

test("copy link is canonical and presentation has the same badge", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/interview/?search=010&auth=connected");
  await expect(page.locator(card)).toBeVisible();
  await page.locator(card).getByRole("button", { name: "Sao chép liên kết câu hỏi" }).click();
  const url = new URL(await page.evaluate(() => navigator.clipboard.readText()));
  expect(url.pathname).toBe("/interview/");
  expect(url.searchParams.get("questionId")).toBe("q-010");
  expect(url.searchParams.has("auth")).toBe(false);
  expect(url.searchParams.has("search")).toBe(false);

  await page.getByRole("button", { name: /Trình chiếu \(P\)/i }).click();
  const dialog = page.getByRole("dialog", { name: /Trình chiếu/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("main")).toContainText("#010");
});

test("retired ID is not redirected to an unrelated question", async ({ page }) => {
  await page.goto("/interview/?questionId=q-194");
  await expect(page.getByText(/Không tồn tại Question ID "q-194"/)).toBeVisible();
  await expect(page.locator("article[id^='question-']")).toHaveCount(0);
});
