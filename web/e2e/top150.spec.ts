import { expect, test } from "@playwright/test";

async function clearProgress(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
}

test("Top Interview 150 study workflow persists progress without exposing spoilers", async ({ page }) => {
  await clearProgress(page);

  await expect(page.getByRole("heading", { name: "Top Interview 150" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Progress summary" })).toBeVisible();

  await page.getByRole("link", { name: "Problems", exact: true }).click();
  await page.getByLabel("Search problems").fill("121");
  const problemLink = page.getByRole("link", { name: /121\. Best Time to Buy and Sell Stock/i });
  await expect(problemLink).toBeVisible();
  await problemLink.click();

  await expect(
    page.getByRole("heading", { name: "Best Time to Buy and Sell Stock", exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("Solution hidden")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Java reference solution" })).toHaveCount(0);

  const problemTab = page.getByRole("tab", { name: "Problem" });
  await problemTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Hints" })).toHaveAttribute("aria-selected", "true");

  await page.getByRole("button", { name: "Reveal next hint" }).click();
  await expect(page.getByRole("heading", { name: "Hint 1" })).toBeVisible();

  await page.getByRole("tab", { name: "Solution" }).click();
  await expect(page.getByText("Solution hidden")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Java reference solution" })).toHaveCount(0);
  await page.getByRole("button", { name: "Reveal solution" }).click();
  await expect(page.getByRole("heading", { name: "Java reference solution" })).toBeVisible();

  await page.getByRole("button", { name: "Solved", exact: true }).click();
  await page.getByLabel("Personal notes").fill("Review running minimum before interview.");
  await page.reload();

  await expect(page.getByRole("button", { name: "Solved", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByLabel("Personal notes")).toHaveValue(
    "Review running minimum before interview.",
  );

  await expect(page.getByRole("link", { name: /Previous.*Rotate Array/i })).toHaveAttribute(
    "href",
    "/problems/189",
  );
  await expect(
    page.getByRole("link", { name: /Next.*Best Time to Buy and Sell Stock II/i }),
  ).toHaveAttribute("href", "/problems/122");
});

test("dashboard, filters, and practice layout fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await clearProgress(page);

  const documentFitsViewport = async () =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

  await expect(page.getByRole("heading", { name: "Top Interview 150" })).toBeVisible();
  expect(await documentFitsViewport()).toBe(true);

  await page.getByRole("link", { name: "Problems", exact: true }).click();
  await expect(page.getByLabel("Search problems")).toBeVisible();
  await expect(page.getByLabel("Learning status")).toBeVisible();
  expect(await documentFitsViewport()).toBe(true);

  await page.goto("/problems/121");
  await expect(page.getByRole("tab", { name: "Problem" })).toBeVisible();
  await expect(page.getByLabel("Personal notes")).toBeVisible();
  expect(await documentFitsViewport()).toBe(true);
});
