import { expect, test, type Locator } from "@playwright/test";

async function expectAligned(top: Locator, bottom: Locator) {
  await expect(top).toBeVisible();
  await expect(bottom).toBeVisible();
  await expect.poll(async () => {
    const first = (await top.boundingBox())!;
    const second = (await bottom.boundingBox())!;
    return [first.x - second.x, first.width - second.width, first.height, second.height, second.y - first.y - first.height];
  }).toEqual([0, 0, 40, 40, 8]);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
});

test("guest controls share a full-width stack and a centered compact rail", async ({ page }) => {
  await page.goto("/interview/");
  const sidebar = page.locator("aside").filter({ has: page.getByTitle(/Thu gọn thanh bên|Mở rộng thanh bên/) });
  const google = sidebar.getByRole("link", { name: "Đăng nhập bằng Google" });
  const theme = sidebar.getByRole("button", { name: "Switch to dark mode" });
  await expectAligned(google, theme);
  await expect(google).toHaveAttribute("href", "/api/auth/google/start");
  await expect(google).toHaveText("Đăng nhập");
  await expect(theme).toHaveText("Giao diện sáng");
  for (const control of [google, theme]) {
    await expect(control).toHaveCSS("border-radius", "12px");
    await expect(control).toHaveCSS("padding-inline", "12px");
    await expect(control).toHaveCSS("column-gap", "10px");
    await expect(control.locator("svg")).toHaveCSS("width", "18px");
  }
  await expect(sidebar.getByText("Nền tảng tri thức kỹ sư toàn diện", { exact: false })).toHaveCount(0);
  expect((await google.boundingBox())!.width).toBeGreaterThan(240);
  await expect(sidebar.getByRole("link", { name: /Phỏng vấn Java/ })).toHaveCSS("color", "rgb(255, 255, 255)");

  await theme.click();
  const darkTheme = sidebar.getByRole("button", { name: "Switch to light mode" });
  await expect(darkTheme).toHaveText("Giao diện tối");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await sidebar.getByTitle("Thu gọn thanh bên (Ctrl+B)").click();
  await expectAligned(google, darkTheme);
  await expect(sidebar.getByTitle("Mở rộng thanh bên (Ctrl+B)")).toBeFocused();
  await expect(google).toHaveText("");
  await expect(darkTheme).toHaveText("");
  await expect(google).toHaveAttribute("title", "Đăng nhập bằng Google");
  await expect(darkTheme).toHaveAttribute("title", /Giao diện tối/);
  const rail = (await sidebar.boundingBox())!;
  const control = (await google.boundingBox())!;
  expect(control.width).toBe(40);
  expect(Math.abs(rail.x + rail.width / 2 - control.x - control.width / 2)).toBeLessThanOrEqual(1);
  await page.reload();
  await expect(sidebar.getByTitle("Mở rộng thanh bên (Ctrl+B)")).toBeVisible();
  await expect(darkTheme).toBeVisible();
});

test("account menu preserves footer geometry and account actions", async ({ page }) => {
  const name = "Người dùng có tên dài ".repeat(7).trim();
  const email = "long-account-name-for-sidebar-testing@example.test";
  let role = "admin";
  await page.route("**/api/auth/session", route => route.fulfill({ json: {
    ok: true, user: { id: "sidebar-test", name, email, picture: null, role },
  } }));
  await page.route("**/api/auth/logout", route => route.fulfill({ json: { ok: true } }));
  await page.goto("/interview/");
  const sidebar = page.locator("aside").filter({ has: page.getByTitle(/Thu gọn thanh bên|Mở rộng thanh bên/) });
  const account = sidebar.getByRole("button", { name: "Mở menu tài khoản" });
  const theme = sidebar.getByRole("button", { name: "Switch to dark mode" });
  await expectAligned(account, theme);
  await expect(account.getByText(name)).toBeVisible();
  await expect(account.getByText(email)).toHaveCSS("text-overflow", "ellipsis");
  await account.click();
  await expect(sidebar.getByRole("link", { name: "Quản lý tài khoản" })).toHaveAttribute("href", "/account/?tab=profile");
  await expect(sidebar.getByRole("link", { name: /Đồng bộ/ })).toHaveCount(0);
  await expect(sidebar.getByRole("link", { name: "Quản trị nội dung" })).toBeVisible();
  await expectAligned(account, theme);
  await page.keyboard.press("Escape");
  await expect(account).toBeFocused();
  await expect(account).toHaveAttribute("aria-expanded", "false");

  await sidebar.getByTitle("Thu gọn thanh bên (Ctrl+B)").click();
  await expectAligned(account, theme);
  await expect(account).toHaveText("");
  await account.click();
  await expect(sidebar.getByRole("button", { name: "Đăng xuất" })).toBeVisible();
  await sidebar.getByRole("button", { name: "Đăng xuất" }).click();
  await expectAligned(sidebar.getByRole("link", { name: "Đăng nhập bằng Google" }), theme);
  role = "user";
  await page.reload();
  await account.click();
  await expect(sidebar.getByRole("link", { name: "Quản trị nội dung" })).toHaveCount(0);
});

test("a short mobile drawer scrolls the navigation and keeps the footer reachable", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 420 });
  await page.goto("/interview/");
  await page.getByTitle("Mở danh sách bài tập").click();
  const sidebar = page.locator("aside").filter({ has: page.getByTitle("Thu gọn thanh bên (Ctrl+B)") });
  const google = sidebar.getByRole("link", { name: "Đăng nhập bằng Google" });
  const theme = sidebar.getByRole("button", { name: "Switch to dark mode" });
  await expectAligned(google, theme);
  const initialTheme = await theme.boundingBox();
  const algorithms = sidebar.getByRole("button", { name: /Top Interview 150/ });
  await algorithms.scrollIntoViewIfNeeded();
  await expect(algorithms).toBeInViewport();
  expect(await theme.boundingBox()).toEqual(initialTheme);
  await sidebar.getByRole("link", { name: "Tất cả khóa học" }).click();
  await expect(page).toHaveURL(/\/courses\/?$/);
  await expect(google).toBeHidden();
});
