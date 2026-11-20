import { expect, test } from "@playwright/test";

const course = "/courses/spring-framework-for-java";
const videoIds = ["X4Pho7r5sDg", "-PAN_jBSMLk", "hFuleFszKcA"];

test("exports the three Spring lessons with video, transcript, flashcards and architecture", async ({ page }) => {
  await page.route("https://www.youtube-nocookie.com/**", route => route.fulfill({ body: "" }));
  await page.goto("/courses/");
  await expect(page.getByText("Spring Framework for Java Development", { exact: true }).first()).toBeVisible();

  for (const [index, videoId] of videoIds.entries()) {
    const lesson = `${course}/lesson-0${index + 1}/`;
    expect((await page.goto(lesson))?.status()).toBe(200);
    // 1. YouTube iframe is present in the video stage
    await expect(page.locator("iframe#spring-youtube-iframe")).toHaveAttribute(
      "src",
      new RegExp(`youtube-nocookie.com/embed/${videoId}\\?`)
    );
    // 2. Blueprint (Kiến trúc & Phân tích chuyên sâu) is rendered
    await expect(page.getByRole("region", { name: "Nội dung phân tích kiến trúc bài học" })).toBeVisible();
    // 3. Right dock has Flashcards on desktop
    await expect(page.getByText("Flashcard", { exact: false }).first()).toBeVisible();
    // 4. Mobile viewport fits without horizontal overflow
    await page.setViewportSize({ width: 390, height: 840 });
    await expect.poll(async () => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.setViewportSize({ width: 1280, height: 800 });
  }
});

test("Spring completion follows the existing account scope", async ({ page }) => {
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

  await page.goto(course + "/lesson-01/");
  await page.getByRole("button", { name: "Đánh dấu đã học", exact: true }).click();
  await expect(page.getByRole("button", { name: "Đã học xong", exact: true })).toBeVisible();
  await expect.poll(() => stored.get(userId)?.state.courses["spring-framework-for-java"]?.completedLessonIds).toEqual(["lesson-01"]);
  await page.reload();
  await expect(page.getByRole("button", { name: "Đã học xong", exact: true })).toBeVisible();

  userId = "spring-learner-b";
  await page.reload();
  await expect(page.getByRole("button", { name: "Đánh dấu đã học", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Bài tiếp theo/i }).click();
  await expect(page).toHaveURL(/lesson-02\/?$/);

  userId = "spring-learner-a";
  await page.goto(course + "/lesson-01/");
  await expect(page.getByRole("button", { name: "Đã học xong", exact: true })).toBeVisible();
});
