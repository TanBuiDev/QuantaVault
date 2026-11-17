import { expect, test } from "@playwright/test";

const course = "/courses/spring-framework-for-java";
const videoIds = ["X4Pho7r5sDg", "-PAN_jBSMLk", "hFuleFszKcA"];

test("exports the three Spring lessons with video, transcript, flashcards and architecture", async ({ page }) => {
  await page.route("https://www.youtube-nocookie.com/**", route => route.fulfill({ body: "" }));
  await page.setViewportSize({ width: 390, height: 840 });
  await page.goto("/courses/");
  await expect(page.getByText("Spring Framework for Java Development", { exact: true }).first()).toBeVisible();

  for (const [index, videoId] of videoIds.entries()) {
    const lesson = `${course}/lesson-0${index + 1}/`;
    expect((await page.goto(lesson))?.status()).toBe(200);
    const content = page.getByRole("region", { name: "Nội dung bài học Spring Framework" });
    await expect(content.locator("iframe")).toHaveAttribute("src", new RegExp(`youtube-nocookie.com/embed/${videoId}\\?`));
    await expect(content.getByText(/Transcript Song Ngữ/i)).toBeVisible();
    await content.getByRole("button", { name: /Thẻ Flashcard/i }).click();
    await content.getByRole("button", { name: "Lật thẻ" }).click();
    await expect(content.getByText("Đáp án (Answer)")).toBeVisible();
    await expect(content.getByText(/Giải thích & Liên hệ phỏng vấn/)).toBeVisible();
    await content.getByRole("button", { name: /Phân tích/i }).click();
    await expect(content.getByRole("region", { name: "Nội dung phân tích kiến trúc bài học" })).toBeVisible();
    await page.reload();
    await expect(content.getByRole("region", { name: "Nội dung phân tích kiến trúc bài học" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
});

test("Spring completion follows the existing account scope and flashcard scores stay separate", async ({ page }) => {
  let userId = "spring-learner-a";
  type CourseState = { version: 1; courses: Record<string, { completedLessonIds: string[] }> };
  const stored = new Map<string, { state: CourseState; revision: number }>();
  await page.route("**/api/learning-progress?*", async route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("kind") !== "courses") return route.fallback();
    const owner = url.searchParams.get("userId")!;
    const current = stored.get(owner) ?? { state: { version: 1 as const, courses: {} }, revision: 0 };
    if (route.request().method() === "PUT") {
      const payload = route.request().postDataJSON() as { state: CourseState; revision: number };
      if (payload.revision !== current.revision) return route.fulfill({ status: 409 });
      const revision = current.revision + 1;
      stored.set(owner, { state: payload.state, revision });
      return route.fulfill({ json: { ok: true, revision } });
    }
    return route.fulfill({ json: { ok: true, ...current } });
  });
  await page.route("**/api/auth/session", route => route.fulfill({ json: {
    ok: true, user: { id: userId, name: userId, email: userId + "@example.test", role: "user" },
  } }));
  await page.route("https://www.youtube-nocookie.com/**", route => route.fulfill({ body: "" }));
  await page.goto(course + "/lesson-01/?tab=flashcards");
  await expect(page.getByText("0 đã nhớ")).toBeVisible();
  await page.getByRole("button", { name: "Đã ghi nhớ", exact: true }).click();
  await expect(page.getByText("1 đã nhớ")).toBeVisible();
  await page.getByRole("button", { name: "Đánh dấu đã học", exact: true }).click();
  await expect(page.getByRole("button", { name: "Đã học xong", exact: true })).toBeVisible();
  await expect.poll(() => stored.get(userId)?.state.courses["spring-framework-for-java"]?.completedLessonIds).toEqual(["lesson-01"]);
  await page.reload();
  await expect(page.getByText("1 đã nhớ")).toBeVisible();
  await expect(page.getByRole("button", { name: "Đã học xong", exact: true })).toBeVisible();

  userId = "spring-learner-b";
  await page.reload();
  await expect(page.getByText("0 đã nhớ")).toBeVisible();
  await expect(page.getByRole("button", { name: "Đánh dấu đã học", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Bài tiếp theo/i }).click();
  await expect(page).toHaveURL(/lesson-02\/?$/);
  await expect(page.getByRole("button", { name: /Bài giảng & Transcript/i })).toBeVisible();

  userId = "spring-learner-a";
  await page.goto(course + "/lesson-01/?tab=flashcards");
  await expect(page.getByText("1 đã nhớ")).toBeVisible();
  await expect(page.getByRole("button", { name: "Đã học xong", exact: true })).toBeVisible();
});
