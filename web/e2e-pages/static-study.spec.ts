import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

test("all exported problem routes have direct HTML, navigation payloads and correct 404s", async ({ request }) => {
  test.setTimeout(120000);
  const pages = fs.readdirSync(path.resolve("cloudflare-pages/problems"), { withFileTypes: true }).filter(entry => entry.isDirectory() && /^\d+$/.test(entry.name));
  expect(pages).toHaveLength(150);
  for (const page of pages) {
    const response = await request.get(`/problems/${page.name}/`);
    expect(response.status(), page.name).toBe(200);
    const html = (await response.text()).replace(/<!--[\s\S]*?-->/g, "");
    expect(html.includes(`Problem #${page.name}`), `problem heading ${page.name}`).toBe(true);
    const navigation = await request.get(`/problems/${page.name}/index.txt`);
    expect(navigation.status(), `navigation ${page.name}`).toBe(200);
  }
  expect((await request.get("/problems/999999/")).status()).toBe(404);
  const api = await request.post("/api/run-code", { data: { problemId: 1 } });
  expect(api.status()).toBe(404);
  expect((await api.json()).code).toBe("STATIC_STUDY_ONLY");
  expect((await request.get("/api/publish")).status()).toBe(405);
  // No credentials are available in this isolated runtime, so no GitHub request is possible.
  expect((await request.post("/api/publish", { data: {} })).status()).toBe(503);
});

test("static pages support reading, reload, client navigation, images and personal drafts", async ({ page }) => {
  test.setTimeout(60000);
  const judgeRequests: string[] = [];
  page.on("request", request => { if (request.url().includes("/api/run-code")) judgeRequests.push(request.url()); });
  await page.goto("/problems/121/");
  await expect(page.getByRole("heading", { name: /Bài|Best Time to Buy and Sell Stock/ }).first()).toBeVisible();
  await page.evaluate(() => { localStorage.setItem("preferred_layout_mode", "classic"); localStorage.setItem("user_code_121", "class Solution { /* personal draft */ }"); });
  await page.reload();
  await page.getByRole("button", { name: "Split Editor" }).click();
  await expect(page.getByTitle("Chạy thử code (Ctrl + ')" )).toBeDisabled();
  await expect(page.getByTitle("Nộp bài chấm điểm (Ctrl + Enter)")).toBeDisabled();
  await expect(page.getByRole("status").filter({ hasText: "Chấm Java trực tuyến" })).toBeVisible();
  await page.getByRole("button", { name: "Classic" }).click();
  await page.getByRole("tab", { name: "Solution", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Java solution", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Thêm code", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Sửa code", exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("user_code_121"))).toContain("personal draft");
  // Verify Next Link navigation, rather than only loading independent documents.
  await page.getByRole("link", { name: /#122/ }).first().click();
  await expect(page).toHaveURL(/\/problems\/122\/?$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/problems\/121\/?$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/problems\/122\/?$/);
  await page.goto("/problems/48/");
  await expect(page.locator('img[src^="/media/"]')).toHaveCount(2);
  for (const image of await page.locator('img[src^="/media/"]').all()) {
    await expect(image).toBeVisible();
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
  const darkToggle = page.getByRole("button", { name: "Switch to dark mode" }).first();
  if (await darkToggle.isVisible()) await darkToggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Switch to light mode" }).first().click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  expect(judgeRequests).toEqual([]);
});
