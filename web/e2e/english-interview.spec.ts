import { expect, test } from "@playwright/test";

test("English bilingual interview course is available alongside existing study courses", async ({ page }) => {
  await page.goto("/courses/");
  const catalog = page.getByRole("region", { name: "Danh sách lộ trình học tập" });
  await expect(catalog.getByRole("heading", { name: /Tiếng Anh Phỏng Vấn Xin Việc/ })).toBeVisible();

  await page.goto("/courses/english-job-interview/lesson-01/");
  await expect(page.getByText("Tell me a little about yourself.").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "About Yourself, Strengths and Weaknesses" })).toBeVisible();
  await expect(page.getByText("Bài 01: Bản thân, điểm mạnh và điểm yếu").first()).toBeVisible();
  await expect(page.getByText(/Tóm tắt bài học:/)).toHaveCount(0);
  await expect(page.getByText(/Nguồn: PDF/)).toHaveCount(0);
  await expect(page).toHaveURL(/\/courses\/english-job-interview\/lesson-01\/?$/);
});

test("English translation practice is a separate mode with concealed reference and two directions", async ({ page }) => {
  await page.goto("/courses/english-job-interview/lesson-01/");
  await page.getByRole("link", { name: "Mở chế độ luyện tập tiếng Anh" }).click();
  await expect(page).toHaveURL(/\/courses\/english-job-interview\/practice\/?$/);
  await expect(page.getByRole("heading", { name: "Luyện dịch hai chiều" })).toBeVisible();
  await expect(page.getByText("Tell me a little about yourself.")).toHaveCount(0);

  await page.getByRole("textbox", { name: "Bản dịch của bạn" }).fill("Tell me about yourself");
  await page.getByRole("button", { name: "Hiện bản dịch tham khảo" }).click();
  await expect(page.getByText("Tell me a little about yourself.")).toBeVisible();
  await page.getByRole("button", { name: "Cần ôn" }).click();
  await page.getByRole("button", { name: /Thẻ tiếp/ }).click();
  await expect(page.getByRole("textbox", { name: "Bản dịch của bạn" })).toHaveValue("");
  await page.getByRole("group", { name: "Hướng dịch" }).getByRole("button", { name: "Anh → Việt" }).click();
  await expect(page.getByText("Tell me a little about yourself.")).toBeVisible();
});
