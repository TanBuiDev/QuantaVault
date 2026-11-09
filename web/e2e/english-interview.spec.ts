import { expect, test } from "@playwright/test";

test("English bilingual interview course is available alongside existing study courses", async ({ page }) => {
  await page.goto("/courses/");
  const catalog = page.getByRole("region", { name: "Danh sách lộ trình học tập" });
  await expect(catalog.getByRole("heading", { name: /Tiếng Anh Phỏng Vấn Xin Việc/ })).toBeVisible();

  await page.goto("/courses/english-job-interview/lesson-01/");
  await expect(page.getByText("Tell me a little about yourself.").first()).toBeVisible();
  await expect(page).toHaveURL(/\/courses\/english-job-interview\/lesson-01\/?$/);
});
