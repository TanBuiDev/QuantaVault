import { expect, test } from "@playwright/test";

async function clearProgress(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
}

test("Top Interview 150 study workflow persists progress without exposing spoilers", async ({ page }) => {
  await clearProgress(page);

  await expect(page.getByRole("heading", { name: "Top Interview 150" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Overall study progress" })).toBeVisible();

  // The app shell navigation is intentionally compact/icon-first now, so navigate directly
  // to the problem explorer and keep this test focused on the study workflow itself.
  await page.goto("/problems");
  await page.getByRole("searchbox", { name: "Search problems" }).fill("121");
  const problemLink = page.getByRole("link", { name: /Best Time to Buy and Sell Stock/i }).first();
  await expect(problemLink).toBeVisible();
  await problemLink.click();

  await expect(
    page.getByRole("heading", { name: "Best Time to Buy and Sell Stock", exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: "Problem" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("link", { name: "LeetCode", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Java solution", exact: true })).toHaveCount(0);

  const problemTab = page.getByRole("tab", { name: "Problem" });
  await problemTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Hints" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Hint 1", { exact: true }).first()).toBeVisible();

  await page.getByRole("tab", { name: "Solution" }).click();
  await expect(page.getByRole("heading", { name: "Java solution", exact: true })).toBeVisible();

  // Cycle current status: Not Started -> In Progress -> Solved.
  await page.getByRole("button", { name: "Not Started", exact: true }).click();
  await page.getByRole("button", { name: "In Progress", exact: true }).click();
  await expect(page.getByRole("button", { name: "Solved", exact: true })).toBeVisible();

  await page.getByRole("tab", { name: "Notes" }).click();
  const personalNotes = page.getByLabel(/Ghi chú cá nhân/i);
  await personalNotes.fill("Review running minimum before interview.");
  await page.reload();

  await expect(page.getByRole("button", { name: "Solved", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Notes" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel(/Ghi chú cá nhân/i)).toHaveValue(
    "Review running minimum before interview.",
  );

  await expect(page.getByRole("link", { name: /Bài trước: #189 Rotate Array/i })).toHaveAttribute(
    "href",
    "/problems/189",
  );
  await expect(
    page.getByRole("link", { name: /Bài tiếp theo: #122 Best Time to Buy and Sell Stock II/i }),
  ).toHaveAttribute("href", "/problems/122");
});

test("theme preference persists across reloads", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.setItem("top150-theme", "light"));
  await page.reload();

  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
});

test("dashboard, filters, and practice layout fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await clearProgress(page);

  const documentFitsViewport = async () =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

  await expect(page.getByRole("heading", { name: "Top Interview 150" })).toBeVisible();
  expect(await documentFitsViewport()).toBe(true);

  await page.goto("/problems");
  await expect(page.getByRole("searchbox", { name: "Search problems" })).toBeVisible();
  await expect(page.getByLabel("Learning status")).toBeVisible();
  expect(await documentFitsViewport()).toBe(true);

  await page.goto("/problems/121");
  await expect(page.getByRole("link", { name: "LeetCode", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Problem" })).toBeVisible();
  await page.getByRole("tab", { name: "Notes" }).click();
  await expect(page.getByLabel(/Ghi chú cá nhân/i)).toBeVisible();
  expect(await documentFitsViewport()).toBe(true);
});
