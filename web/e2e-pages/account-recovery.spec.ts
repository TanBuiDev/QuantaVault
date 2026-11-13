import { expect, test } from "@playwright/test";

test("the everyday account view hides legacy sync controls, while the separate recovery page remains available",async({page})=>{
  await page.route("**/api/auth/session",route=>route.fulfill({json:{
    ok:true,user:{id:"e2e-user",name:"Member",email:"member@example.test",role:"user"},
  }}));
  await page.goto("/account/");
  await expect(page.getByRole("heading",{name:"Thông tin tài khoản"})).toBeVisible();
  await expect(page.getByText("Khôi phục dữ liệu cũ")).toHaveCount(0);
  await expect(page.getByRole("button",{name:/Đồng bộ tiến độ giữa các thiết bị/})).toHaveCount(0);
  await page.goto("/account/recovery/");
  await expect(page.getByRole("heading",{name:"Khôi phục tiến độ cũ"})).toBeVisible();
  await expect(page.getByText(/không tự chuyển dữ liệu cũ vào tài khoản Google/)).toBeVisible();
  await expect(page.getByRole("button",{name:/Đồng bộ tiến độ giữa các thiết bị/})).toBeVisible();
  await page.getByRole("button",{name:/Đồng bộ tiến độ giữa các thiết bị/}).click();
  await expect(page.getByText("Mã đồng bộ bí mật (64 ký tự)")).toBeVisible();
  await expect(page.getByRole("button",{name:"Dùng mã đã có"})).toBeVisible();
  await expect(page.getByRole("link",{name:/Về tài khoản/})).toHaveAttribute("href","/account/");
});

test("legacy recovery remains directly accessible without a Google session",async({page})=>{
  await page.route("**/api/auth/session",route=>route.fulfill({json:{ok:true,user:null}}));
  await page.goto("/account/recovery/");
  await expect(page.getByRole("heading",{name:"Khôi phục tiến độ cũ"})).toBeVisible();
  await expect(page.getByRole("button",{name:/Đồng bộ tiến độ giữa các thiết bị/})).toBeVisible();
});
