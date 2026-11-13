import { expect, test } from "@playwright/test";

test("regular accounts have two useful tabs and old security links open profile",async({page})=>{
  await page.route("**/api/auth/session",route=>route.fulfill({json:{
    ok:true,user:{id:"e2e-user",name:"Member",email:"member@example.test",role:"user"},
  }}));
  await page.goto("/account/?tab=security");
  await expect(page.getByRole("tab",{name:"Tài khoản"})).toBeVisible();
  await expect(page.getByRole("tab",{name:"Đồng bộ"})).toBeVisible();
  await expect(page.getByRole("tab",{name:"Bảo mật"})).toHaveCount(0);
  await expect(page).toHaveURL(/tab=profile/);
  await expect(page.getByRole("tabpanel",{name:"Tài khoản"})).toBeVisible();
  await page.goto("/account/#administration");
  await expect(page).toHaveURL(/tab=profile/);
  await page.getByRole("tab",{name:"Đồng bộ"}).click();
  await expect(page.getByRole("tabpanel",{name:"Đồng bộ"})).toBeVisible();
});

test("administrators still access real management features",async({page})=>{
  await page.route("**/api/auth/session",route=>route.fulfill({json:{
    ok:true,user:{id:"e2e-admin",name:"Admin",email:"admin@example.test",role:"admin"},
  }}));
  await page.route("**/api/admin/status",route=>route.fulfill({json:{ok:true,role:"admin",elevated:false}}));
  await page.goto("/account/?tab=security");
  await expect(page.getByRole("tab",{name:"Bảo mật"})).toBeVisible();
  await expect(page.getByRole("tab",{name:"Bảo mật"})).toHaveAttribute("aria-selected","true");
  await expect(page.getByRole("region",{name:"Quản trị tài khoản"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Mở quyền quản lý"})).toBeVisible();
});
