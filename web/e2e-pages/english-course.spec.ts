import { expect, test } from "@playwright/test";

test("bilingual English interview course exports all 18 static lesson pages and separate practice", async ({ request }) => {
  test.setTimeout(120000);

  const catalog = await request.get("/courses/");
  expect(catalog.status()).toBe(200);
  expect(await catalog.text()).toContain("Tiếng Anh Phỏng Vấn Xin Việc");

  const first = await request.get("/courses/english-job-interview/lesson-01/");
  expect(first.status()).toBe(200);
  const firstHtml = await first.text();
  expect(firstHtml).toContain("Tell me a little about yourself");

  const practice = await request.get("/courses/english-job-interview/practice/");
  expect(practice.status()).toBe(200);
  expect(await practice.text()).toContain("Luyện dịch hai chiều");

  for (let number = 1; number <= 18; number++) {
    const id = String(number).padStart(2, "0");
    const lesson = await request.get("/courses/english-job-interview/lesson-" + id + "/");
    expect(lesson.status(), "English lesson " + id).toBe(200);
    expect(await lesson.text(), "rendered heading " + id).toContain("Tiếng Anh Phỏng Vấn Xin Việc");
  }

  expect((await request.get("/courses/postgres-for-java/lesson-01/")).status()).toBe(200);
  expect((await request.get("/courses/redis-for-java/lesson-01/")).status()).toBe(200);
});
