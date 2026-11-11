import { expect, test } from "@playwright/test";

test("saved interview content survives reopening and reload; unsaved recovery requires consent", async ({ page }) => {
  await page.goto("/interview/?edit=true&editQuestion=q-001");
  const editor = page.getByPlaceholder("Nhập nội dung câu trả lời chi tiết bằng cú pháp Markdown...");
  await expect(editor).toBeVisible();
  const saved = "Nội dung đã lưu trong kiểm thử hồi quy";
  await editor.fill(saved);
  await page.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  await expect(editor).toHaveCount(0);
  await page.getByRole("button", { name: "Chỉnh sửa câu hỏi", exact: true }).first().click();
  await expect(editor).toHaveValue(saved);
  await page.reload();
  await expect(editor).toHaveValue(saved);

  const unsaved = "Nội dung đang soạn chưa bấm lưu";
  await editor.fill(unsaved);
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("interview_draft_q-001"))).toContain(unsaved);
  await page.reload();
  await expect(editor).toHaveValue(saved);
  await expect(page.getByRole("button", { name: "Khôi phục nháp", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Khôi phục nháp", exact: true }).click();
  await expect(editor).toHaveValue(unsaved);
  await page.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  await expect(editor).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.getItem("interview_draft_q-001"))).toBeNull();
  await page.getByRole("button", { name: "Chỉnh sửa câu hỏi", exact: true }).first().click();
  await expect(editor).toHaveValue(unsaved);
  await page.reload();
  await expect(editor).toHaveValue(unsaved);
  await expect(page.getByRole("button", { name: "Khôi phục nháp", exact: true })).toHaveCount(0);
});

test("fullscreen interview editor aligns exactly with the viewport and keeps footer visible", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/interview/?edit=true&editQuestion=q-001");
  const editor = page.getByPlaceholder("Nhập nội dung câu trả lời chi tiết bằng cú pháp Markdown...");
  await expect(editor).toBeVisible();

  await page.getByRole("button", { name: "Mở rộng toàn màn hình" }).click();
  await expect(page.getByRole("button", { name: "Thu nhỏ cửa sổ" })).toBeVisible();

  const bounds = await page.getByRole("dialog").evaluate(dialog => {
    const card = dialog.children[1].getBoundingClientRect();
    return { top: card.top, left: card.left, right: card.right, bottom: card.bottom, width: window.innerWidth, height: window.innerHeight };
  });
  expect(Math.abs(bounds.top)).toBeLessThanOrEqual(1);
  expect(Math.abs(bounds.left)).toBeLessThanOrEqual(1);
  expect(Math.abs(bounds.right - bounds.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(bounds.bottom - bounds.height)).toBeLessThanOrEqual(1);

  const save = page.getByRole("button", { name: "Lưu thay đổi", exact: true });
  await expect(save).toBeInViewport();
  await expect(editor).toBeInViewport();

  await page.getByRole("button", { name: "Thu nhỏ cửa sổ" }).click();
  await expect(page.getByRole("button", { name: "Mở rộng toàn màn hình" })).toBeVisible();
});


test("fullscreen has no bottom strip or overlapping actions from mobile to desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1650, height: 818 });
  await page.goto("/interview/?edit=true&editQuestion=q-001");
  const editor = page.getByPlaceholder("Nhập nội dung câu trả lời chi tiết bằng cú pháp Markdown...");
  await expect(editor).toBeVisible();
  const content = "## Regression check\\n\\nFullscreen must preserve unsaved text.";
  await editor.fill(content);
  await page.getByRole("button", { name: "Mở rộng toàn màn hình" }).click();

  for (const width of [390, 850, 1024, 1280, 1650]) {
    await page.setViewportSize({ width, height: 818 });
    const geometry = await page.evaluate(() => {
      const box = (selector: string) => {
        const node = document.querySelector<HTMLElement>(selector);
        if (!node) throw new Error("Missing editor node: " + selector);
        return node.getBoundingClientRect();
      };
      const modal = document.querySelector<HTMLElement>('[role="dialog"]');
      if (!modal) throw new Error("Fullscreen dialog is missing");
      const card = (modal.children[1] as HTMLElement).getBoundingClientRect();
      const layout = box('[data-testid="interview-editor-layout"]');
      const footer = box('[data-testid="interview-editor-action-bar"]');
      const left = box('[data-testid="interview-editor-action-left"]');
      const right = box('[data-testid="interview-editor-action-right"]');
      return {
        cardTop: card.top, cardBottom: card.bottom, layoutBottom: layout.bottom,
        footerTop: footer.top, footerBottom: footer.bottom,
        leftRight: left.right, rightLeft: right.left,
        rightRight: right.right, viewportWidth: window.innerWidth, viewportHeight: window.innerHeight,
      };
    });
    expect(Math.abs(geometry.cardTop), "card top at " + width).toBeLessThanOrEqual(2);
    expect(Math.abs(geometry.cardBottom - geometry.viewportHeight), "card bottom at " + width).toBeLessThanOrEqual(2);
    expect(Math.abs(geometry.layoutBottom - geometry.viewportHeight), "layout bottom at " + width).toBeLessThanOrEqual(2);
    expect(Math.abs(geometry.footerBottom - geometry.viewportHeight), "footer bottom at " + width).toBeLessThanOrEqual(2);
    expect(geometry.leftRight, "action groups overlap at " + width).toBeLessThanOrEqual(geometry.rightLeft - 2);
    expect(geometry.rightRight, "save button is clipped at " + width).toBeLessThanOrEqual(geometry.viewportWidth + 1);
    await expect(page.getByRole("button", { name: "Lưu thay đổi", exact: true })).toBeInViewport();
  }

  await page.getByRole("button", { name: "Thuộc tính" }).click();
  const metadataFooterBottom = await page.getByTestId("interview-editor-action-bar").evaluate(element => element.getBoundingClientRect().bottom);
  expect(Math.abs(metadataFooterBottom - 818)).toBeLessThanOrEqual(2);
  await page.getByRole("button", { name: "Nội dung", exact: true }).click();
  await expect(editor).toHaveValue(content);
  await page.getByRole("button", { name: "Thu nhỏ cửa sổ" }).click();
  await expect(editor).toHaveValue(content);
});
