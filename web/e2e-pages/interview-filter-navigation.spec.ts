import { expect, test } from "@playwright/test";

test("interview filter survives leaving for a course, reloading and resetting", async ({ page }) => {
  await page.goto("/interview/");
  const junior = page.getByRole("button", { name: "Junior (Cơ bản)" });
  await junior.click();
  await expect(page).toHaveURL(/difficulty=junior/);
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("interview_view_state_v1"))).toContain("difficulty=junior");

  await page.getByRole("link", { name: "Tất cả khóa học" }).click();
  await expect(page).toHaveURL(/\/courses\/?$/);
  await page.getByRole("link", { name: "Phỏng vấn Java & Microservices" }).click();
  await expect(junior).toHaveClass(/bg-emerald-500/);
  await expect(page).toHaveURL(/difficulty=junior/);

  await page.reload();
  await expect(junior).toHaveClass(/bg-emerald-500/);

  await page.goto("/interview/?difficulty=senior");
  await expect(page.getByRole("button", { name: "Senior (Nâng cao)" })).toHaveClass(/bg-rose-500/);
  await page.getByRole("button", { name: "Đặt lại bộ lọc" }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("interview_view_state_v1"))).toBeNull();

  await page.getByRole("link", { name: "Tất cả khóa học" }).click();
  await page.getByRole("link", { name: "Phỏng vấn Java & Microservices" }).click();
  await expect(page).not.toHaveURL(/difficulty=/);
  await expect(junior).not.toHaveClass(/bg-emerald-500/);
});

test("Back and Forward restore explicitly selected interview difficulty", async ({ page }) => {
  await page.goto("/interview/?difficulty=junior");
  await expect(page.getByRole("button", { name: "Junior (Cơ bản)" })).toHaveClass(/bg-emerald-500/);
  await page.goto("/courses/");
  await page.goto("/interview/?difficulty=middle");
  await expect(page.getByRole("button", { name: "Middle (Trung cấp)" })).toHaveClass(/bg-amber-500/);

  await page.goBack();
  await expect(page).toHaveURL(/\/courses\/?$/);
  await page.goBack();
  await expect(page.getByRole("button", { name: "Junior (Cơ bản)" })).toHaveClass(/bg-emerald-500/);
  await page.goForward();
  await page.goForward();
  await expect(page.getByRole("button", { name: "Middle (Trung cấp)" })).toHaveClass(/bg-amber-500/);
});
