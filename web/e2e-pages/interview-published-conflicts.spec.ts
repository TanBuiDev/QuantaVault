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


test("Git-style comparison highlights changed lines without mutating local versions", async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await loadConflict(page);
  const before = await page.evaluate(() => ({
    published: localStorage.getItem("interview_published_cache_v1"),
    drafts: localStorage.getItem("interview_drafts_v1"),
  }));
  const conflict = page.getByRole("region", { name: "Xung đột " + id });
  const diff = conflict.getByRole("region", { name: "Thay đổi trường Nội dung trả lời" });
  await expect(diff).toBeVisible();
  await expect(diff.locator('[data-diff-kind="removed"][data-diff-side="left"]')).toContainText(localVersion.answerMarkdown);
  await expect(diff.locator('[data-diff-kind="added"][data-diff-side="right"]').first()).toBeVisible();
  await expect(diff.getByRole("columnheader", { name: /Bản cục bộ/ })).toBeVisible();
  await expect(diff.getByRole("columnheader", { name: /Dữ liệu website hiện tại/ })).toBeVisible();

  await page.getByRole("checkbox", { name: "Hiển thị cả dòng không đổi" }).check();
  await expect(page.getByRole("checkbox", { name: "Hiển thị cả dòng không đổi" })).toBeChecked();
  await conflict.getByText("Xem toàn bộ hai phiên bản và dữ liệu JSON (không tô màu)").click();
  await expect(conflict.locator("details").first().getByText("Locally published summary", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Đóng" }).click();

  const after = await page.evaluate(() => ({
    published: localStorage.getItem("interview_published_cache_v1"),
    drafts: localStorage.getItem("interview_drafts_v1"),
  }));
  expect(after).toEqual(before);
});

test("Git-style comparison fits a narrow mobile viewport without clipping comparison controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loadConflict(page);
  const diff = page.getByRole("region", { name: "Thay đổi trường Nội dung trả lời" });
  await expect(diff).toBeVisible();
  const scroll = await diff.locator('[role="table"]').evaluate(element => ({
    fullWidth: element.scrollWidth, viewportWidth: window.innerWidth,
    leftOverflow: element.getBoundingClientRect().left,
  }));
  expect(scroll.fullWidth).toBeGreaterThanOrEqual(560);
  expect(scroll.leftOverflow).toBeGreaterThanOrEqual(0);
  await expect(page.getByRole("button", { name: "Tải JSON sao lưu đầy đủ" })).toBeVisible();
});
