import { expect, test } from "@playwright/test";

test("logged-out learners can read questions but cannot change saved progress",async({page})=>{
  await page.route("**/api/auth/session",route=>route.fulfill({json:{ok:true,user:null}}));
  await page.addInitScript(()=>{
    localStorage.setItem("interview-prep-progress-v1",JSON.stringify({
      learned:{"q-013":true},review:{},bookmarks:{},
    }));
  });
  await page.goto("/interview/");
  const question=page.locator("#question-q-013");
  await expect(page.getByRole("note")).toContainText("Đăng nhập Google để đánh dấu");
  await expect(question.getByRole("button",{name:"Đánh dấu đã hiểu"})).toBeDisabled();
  await expect(question.getByRole("button",{name:"Cần ôn lại"})).toBeDisabled();
  await expect(question.getByRole("button",{name:"Đánh dấu câu hỏi"})).toBeDisabled();
  const before=await page.evaluate(()=>localStorage.getItem("interview-prep-progress-v1"));
  await page.reload();
  await expect(question.getByRole("button",{name:"Đánh dấu đã hiểu"})).toBeDisabled();
  expect(await page.evaluate(()=>localStorage.getItem("interview-prep-progress-v1"))).toBe(before);
});

test("marking works with a verified session and stops immediately after logout",async({page})=>{
  await page.route("**/api/auth/session",route=>route.fulfill({json:{
    ok:true,user:{id:"e2e-student",name:"Student",email:"student@example.test",role:"user"},
  }}));
  await page.route("**/api/auth/logout",route=>route.fulfill({json:{ok:true}}));
  await page.goto("/interview/");
  const question=page.locator("#question-q-013");
  const mark=question.getByRole("button",{name:"Đánh dấu đã hiểu"});
  await expect(mark).toBeEnabled();
  await mark.click();
  await expect(question.getByRole("button",{name:"Đã hiểu"})).toBeVisible();
  const saved=await page.evaluate(()=>localStorage.getItem("interview-prep-progress-v1"));
  expect(saved).toContain("q-013");
  await page.getByRole("button",{name:"Mở menu tài khoản"}).click();
  await page.getByRole("button",{name:"Đăng xuất"}).click();
  await expect(page.getByRole("note")).toContainText("Đăng nhập Google để đánh dấu");
  await expect(question.getByRole("button",{name:"Đánh dấu đã hiểu"})).toBeDisabled();
  expect(await page.evaluate(()=>localStorage.getItem("interview-prep-progress-v1"))).toBe(saved);
});
