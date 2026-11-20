import { expect, test } from "@playwright/test";

test("QuantaVault branding uses its standalone icons and PWA manifest", async ({ page }) => {
  await page.goto("/interview/");
  await expect(page.locator('aside img[src="/brand-icon.svg"]').first()).toBeVisible();
  await expect(page.locator('head link[rel="manifest"]')).toHaveAttribute("href", "/site.webmanifest");
  for (const path of ["/brand-icon.svg", "/brand-logo.svg", "/favicon.svg", "/favicon-32.png", "/apple-touch-icon.png", "/app-icon-192.png", "/app-icon-512.png", "/site.webmanifest"]) {
    const response = await page.request.get(path);
    expect(response.ok(), path).toBe(true);
  }
  const manifest = await (await page.request.get("/site.webmanifest")).json();
  expect(manifest.name).toContain("QuantaVault");
  expect(manifest.icons.map((icon: { src: string }) => icon.src)).toEqual(["/app-icon-192.png", "/app-icon-512.png"]);
});
