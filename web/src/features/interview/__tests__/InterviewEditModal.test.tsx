import { fireEvent, render, screen, act } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { InterviewEditModal } from "../InterviewEditModal";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import type { InterviewQuestion } from "@/lib/interview/types";

vi.mock("@/features/practice/MarkdownContent", () => ({
  MarkdownContent: ({ markdown, onNavigateSource }: {
    markdown: string;
    onNavigateSource?: (location: { offset: number; line: number; column: number }, source: string) => void;
  }) => (
    <div>
      <button type="button" data-testid="mock-preview-navigation"
        onClick={() => onNavigateSource?.({ offset: 2, line: 1, column: 3 }, markdown)}>
        Navigate preview
      </button>
      <button type="button" data-testid="mock-stale-preview-navigation"
        onClick={() => onNavigateSource?.({ offset: 4, line: 1, column: 5 }, markdown + " stale")}>
        Navigate stale preview
      </button>
    </div>
  ),
}));
const question: InterviewQuestion = { id: "q-recovery", title: "Đã lưu mới nhất", category: "java-core", difficulty: "junior", summary: "", answerMarkdown: "Đáp án đã lưu", tags: ["Java"] };
const key = `interview_draft_${question.id}`;
const editor = () => screen.getByPlaceholderText("Nhập nội dung câu trả lời chi tiết bằng cú pháp Markdown...");
function mount(onSave: (updated: InterviewQuestion, canonical?: InterviewQuestion) => void = vi.fn(), onClose = vi.fn()) {
  return render(<ToastProvider><ConfirmProvider><InterviewEditModal isOpen question={question} canonicalQuestion={question} onSave={onSave} onClose={onClose} /></ConfirmProvider></ToastProvider>);
}
describe("InterviewEditModal draft safety", () => {
  beforeEach(() => { sessionStorage.clear(); vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
  it("giữ nháp cũ và chỉ khôi phục khi chọn, xác nhận nếu thiếu phiên bản nền", async () => {
    sessionStorage.setItem(key, JSON.stringify({ ...question, answerMarkdown: "Nháp cũ" }));
    mount();
    expect(editor()).toHaveValue("Đáp án đã lưu");
    expect(sessionStorage.getItem(key)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Khôi phục nháp" }));
    expect(editor()).toHaveValue("Đáp án đã lưu");
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Dùng bản nháp" })); });
    expect(editor()).toHaveValue("Nháp cũ");
  });
  it("tự lưu 400ms và giữ lại khi F5 rồi hỏi trước khi khôi phục", () => {
    const view = mount();
    fireEvent.change(editor(), { target: { value: "Đang soạn chưa lưu" } });
    act(() => { vi.advanceTimersByTime(400); });
    expect(sessionStorage.getItem(key)).toContain("Đang soạn chưa lưu");
    view.unmount();
    mount();
    expect(editor()).toHaveValue("Đáp án đã lưu");
    fireEvent.click(screen.getByRole("button", { name: "Khôi phục nháp" }));
    expect(editor()).toHaveValue("Đang soạn chưa lưu");
  });
  it("ghi nốt nội dung mới khi pagehide trước hạn debounce", () => {
    mount();
    fireEvent.change(editor(), { target: { value: "Trước F5" } });
    fireEvent(window, new Event("pagehide"));
    expect(sessionStorage.getItem(key)).toContain("Trước F5");
  });
  it("Ctrl+S không bỏ qua yêu cầu chọn khôi phục hoặc bỏ nháp", () => {
    const raw = JSON.stringify({ ...question, answerMarkdown: "Nháp cần giữ" });
    sessionStorage.setItem(key, raw);
    const save = vi.fn();
    mount(save);
    fireEvent.keyDown(window, { key: "s", ctrlKey: true });
    expect(save).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(key)).toBe(raw);
  });
  it("lỗi lưu phải giữ form và không xóa nháp tạm", () => {
    const close = vi.fn();
    mount(() => { throw new DOMException("full", "QuotaExceededError"); }, close);
    fireEvent.change(editor(), { target: { value: "Không được mất" } });
    act(() => { vi.advanceTimersByTime(400); });
    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
    expect(close).not.toHaveBeenCalled();
    expect(editor()).toHaveValue("Không được mất");
    expect(sessionStorage.getItem(key)).toContain("Không được mất");
    expect(screen.getByText(/Không thể lưu thay đổi/)).toBeInTheDocument();
  });
  it("lưu thành công xóa nháp và không ghi lại sau khi đóng", () => {
    const save = vi.fn();
    const view = mount(save);
    fireEvent.change(editor(), { target: { value: "Bản mới" } });
    act(() => { vi.advanceTimersByTime(400); });
    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ answerMarkdown: "Bản mới" }), question);
    expect(sessionStorage.getItem(key)).toBeNull();
    view.unmount();
    expect(sessionStorage.getItem(key)).toBeNull();
  });
  it("đóng form đã lưu không để timer cũ đóng một form mở sau đó", () => {
    const close = vi.fn();
    const view = mount(vi.fn(), close);
    fireEvent.change(editor(), { target: { value: "Bản mới đã lưu" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
    view.unmount();
    act(() => { vi.advanceTimersByTime(600); });
    expect(close).not.toHaveBeenCalled();
  });
  it("fullscreen được neo vào viewport, không áp dụng transform của popup và giữ các vùng cuộn", () => {
    mount();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("fixed", "inset-0");

    fireEvent.click(screen.getByRole("button", { name: "Mở rộng toàn màn hình" }));
    const card = dialog.children[1] as HTMLElement;
    expect(card).toHaveClass("absolute", "inset-0", "min-h-0", "overflow-hidden");
    expect(card).not.toHaveClass("h-screen", "animate-scale-in", "transform-gpu");
    const body = card.children[0] as HTMLElement;
    expect(body).toHaveClass("min-h-0", "overflow-hidden");
    const layout = body.querySelector("fieldset") as HTMLFieldSetElement;
    expect(layout).toHaveClass("flex", "flex-1", "min-h-0", "flex-col", "overflow-hidden");
    expect(layout.lastElementChild).toHaveClass("shrink-0");
    const input = editor();
    expect(input).toBeInTheDocument();
    expect(input.closest(".rounded-2xl")).toHaveClass("min-h-0");

    fireEvent.click(screen.getByRole("button", { name: "Thu nhỏ cửa sổ" }));
    expect(card).not.toHaveClass("absolute");
    expect(card).toHaveClass("relative", "animate-scale-in", "transform-gpu");
    expect(layout).toHaveClass("contents");
    expect(layout).not.toHaveClass("flex-1", "overflow-hidden");
    expect(editor()).toBeInTheDocument();
  });
  it("cho phép chuyển đổi giữa chế độ toàn màn hình và mặc định", () => {
    mount();
    const expandBtn = screen.getByRole("button", { name: "Mở rộng toàn màn hình" });
    expect(expandBtn).toBeInTheDocument();
    expect(expandBtn).toHaveAttribute("title", "Toàn màn hình");

    fireEvent.click(expandBtn);

    const shrinkBtn = screen.getByRole("button", { name: "Thu nhỏ cửa sổ" });
    expect(shrinkBtn).toBeInTheDocument();
    expect(shrinkBtn).toHaveAttribute("title", "Thu nhỏ (phím Esc hoặc click)");

    fireEvent.click(shrinkBtn);
    expect(screen.getByRole("button", { name: "Mở rộng toàn màn hình" })).toBeInTheDocument();
  });
  it("chuyển chế độ xem không làm đổi câu trả lời hoặc tạo bản nháp", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Xem trước" }));
    fireEvent.click(screen.getByRole("button", { name: "Song song" }));
    expect(editor()).toHaveValue("Đáp án đã lưu");
    act(() => { vi.advanceTimersByTime(450); });
    expect(sessionStorage.getItem(key)).toBeNull();
  });

  it("nhấp Preview chuyển con trỏ mà không sửa answerMarkdown, lưu nháp hoặc gọi onSave", () => {
    const save = vi.fn();
    mount(save);
    fireEvent.click(screen.getByRole("button", { name: "Song song" }));
    const input = editor() as HTMLTextAreaElement;
    expect(input.selectionStart).toBe(0);
    fireEvent.click(screen.getByTestId("mock-preview-navigation"));
    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
    expect(input.value).toBe("Đáp án đã lưu");
    act(() => { vi.advanceTimersByTime(450); });
    expect(sessionStorage.getItem(key)).toBeNull();
    expect(save).not.toHaveBeenCalled();
  });
  it("không điều hướng khi dữ liệu Preview không trùng bản hiện tại", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Song song" }));
    const input = editor() as HTMLTextAreaElement;
    fireEvent.click(screen.getByTestId("mock-stale-preview-navigation"));
    expect(input.selectionStart).toBe(0);
    expect(input.value).toBe("Đáp án đã lưu");
  });

});
