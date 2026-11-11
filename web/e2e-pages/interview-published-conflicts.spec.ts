import { expect, test } from "@playwright/test";

const id = "q-001";
const localVersion = {
  id, title: "Local published version of Java question",
  category: "java-core", difficulty: "junior", tags: ["Java"],
  summary: "Locally published summary", answerMarkdown: "Locally published Markdown answer",
};

async function loadConflict(page: import("@playwright/test").Page) {
  await page.addInitScript(({ key, local }) => {
    if (!location.pathname.startsWith("/interview")) return;
    localStorage.setItem("interview_published_cache_v1", JSON.stringify({
      [key]: { question: local, publishedAt: Date.now(), baseVersion: "qv1:older-website-content" },
    }));
  }, { key: id, local: localVersion });
  await page.goto("/interview/?edit=true");
  await expect(page.getByRole("button", { name: "Xem & đối chiếu" })).toBeVisible();
  await page.getByRole("button", { name: "Xem & đối chiếu" }).click();
  await expect(page.getByRole("heading", { name: "Đối chiếu phiên bản đã xuất bản" })).toBeVisible();
}

test("review requires a complete backup, then accepts website version for only one question", async ({ page }) => {
  await loadConflict(page);
  const conflict = page.getByRole("region", { name: "Xung đột " + id });
  await expect(conflict).toContainText(localVersion.title);
  await expect(conflict).toContainText("Dữ liệu website hiện tại");
  await expect(conflict.getByRole("button", { name: "Dùng bản website" })).toBeDisabled();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Tải JSON sao lưu đầy đủ" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^quantavault-interview-conflict-backup-/);
  await expect(conflict.getByRole("button", { name: "Dùng bản website" })).toBeEnabled();

  await conflict.getByRole("button", { name: "Dùng bản website" }).click();
  await expect(page.getByText("Chỉ bỏ bản Published Cache của câu hỏi " + id, { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Dùng bản website", exact: true }).last().click();

  await expect(page.getByRole("button", { name: "Xem & đối chiếu" })).toHaveCount(0);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem("interview_published_cache_v1") || "{}")[key], id)).toBeUndefined();
  expect(await page.evaluate(() => localStorage.getItem("interview_drafts_v1"))).toBeNull();
});

test("keeping a local conflict creates an unpublished draft, never a new GitHub publish", async ({ page }) => {
  await loadConflict(page);
  const conflict = page.getByRole("region", { name: "Xung đột " + id });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Tải JSON sao lưu đầy đủ" }).click();
  await downloadPromise;

  await conflict.getByRole("button", { name: "Giữ bản cục bộ thành nháp" }).click();
  await page.getByRole("button", { name: "Giữ thành bản nháp" }).click();
  await expect(page.getByRole("button", { name: "Xem & đối chiếu" })).toHaveCount(0);
  const state = await page.evaluate(key => ({
    draft: JSON.parse(localStorage.getItem("interview_drafts_v1") || "{}")[key],
    published: JSON.parse(localStorage.getItem("interview_published_cache_v1") || "{}")[key],
  }), id);
  expect(state.draft.title).toBe(localVersion.title);
  expect(state.draft.baseVersion).toMatch(/^qv1:/);
  expect(state.published).toBeUndefined();
  await expect(page.getByRole("button", { name: "Xuất bản (1)" })).toBeVisible();
});
