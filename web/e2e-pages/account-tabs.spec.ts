import { expect, test } from "@playwright/test";

test("regular accounts use one useful page; retired links open the account summary",async({page})=>{
  await page.route("**/api/auth/session",route=>route.fulfill({json:{
    ok:true,user:{id:"e2e-user",name:"Member",email:"member@example.test",role:"user"},
  }}));
  await page.goto("/account/?tab=sync");
  await expect(page.getByRole("heading",{name:"Thông tin tài khoản"})).toBeVisible();
  await expect(page.getByRole("tablist")).toHaveCount(0);
  await expect(page).toHaveURL(/tab=profile/);
  await expect(page.locator("#progress-sync")).toBeVisible();
  await page.goto("/account/?tab=security");
  await expect(page).toHaveURL(/tab=profile/);
  await page.goto("/account/#sync");
  await expect(page).toHaveURL(/tab=profile/);
});

test("administrator still has an independent management feature",async({page})=>{
  await page.route("**/api/auth/session",route=>route.fulfill({json:{
    ok:true,user:{id:"e2e-admin",name:"Admin",email:"admin@example.test",role:"admin"},
  }}));
  await page.route("**/api/admin/status",route=>route.fulfill({json:{ok:true,role:"admin",elevated:false}}));
  await page.goto("/account/?tab=security");
  await expect(page.getByRole("tab",{name:"Quản trị"})).toHaveAttribute("aria-selected","true");
  await expect(page.getByRole("tab",{name:"Đồng bộ"})).toHaveCount(0);
  await expect(page.getByRole("region",{name:"Quản trị tài khoản"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Mở quyền quản lý"})).toBeVisible();
});
