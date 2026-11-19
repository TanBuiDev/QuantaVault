import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpringTranscriptPanel } from "../SpringTranscriptPanel";
import type { CourseTranscriptSentence } from "@/lib/courses";

const mockTranscript: CourseTranscriptSentence[] = [
  {
    id: "sent-1",
    start: 5,
    time: "00:05",
    en: "Spring makes Java programming quicker, easier, and safer for everybody.",
    vi: "Spring giúp lập trình Java nhanh hơn, dễ dàng hơn và an toàn hơn cho mọi người."
  },
  {
    id: "sent-2",
    start: 15,
    time: "00:15",
    en: "Dependency Injection is the core pattern in Spring Framework.",
    vi: "Dependency Injection là mẫu thiết kế cốt lõi trong Spring Framework."
  }
];

describe("SpringTranscriptPanel", () => {
  it("renders in rail mode and filters with searchQuery prop", () => {
    const { rerender } = render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
      />
    );

    expect(screen.getByText(/2 câu/i)).toBeInTheDocument();
    expect(screen.getByText("Spring makes Java programming quicker, easier, and safer for everybody.")).toBeInTheDocument();
    expect(screen.getByText("Dependency Injection is the core pattern in Spring Framework.")).toBeInTheDocument();

    // Rerender with searchQuery prop
    rerender(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
        searchQuery="core pattern"
      />
    );

    expect(screen.queryByText("Spring makes Java programming quicker, easier, and safer for everybody.")).not.toBeInTheDocument();
    expect(screen.getByText("Dependency Injection is the core pattern in Spring Framework.")).toBeInTheDocument();
  });

  it("renders search and toggles auto-scroll mode in full/mobile mode", () => {
    render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={false}
      />
    );

    expect(screen.getByPlaceholderText("Tìm trong bài...")).toBeInTheDocument();

    const toggleBtn = screen.getByTitle(/Đang bật tự cuộn/i);
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveTextContent("Tự cuộn: Bật");

    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveTextContent("Tự cuộn: Tắt");
  });

  it("filters language modes (bilingual, vi-only, en-only)", () => {
    render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
      />
    );

    // Switch to English only
    const enBtn = screen.getByRole("button", { name: /^Tiếng Anh$/i });
    fireEvent.click(enBtn);

    expect(screen.getByText("Spring makes Java programming quicker, easier, and safer for everybody.")).toBeInTheDocument();
    expect(screen.queryByText("Spring giúp lập trình Java nhanh hơn, dễ dàng hơn và an toàn hơn cho mọi người.")).not.toBeInTheDocument();

    // Switch to Vietnamese only
    const viBtn = screen.getByRole("button", { name: /^Tiếng Việt$/i });
    fireEvent.click(viBtn);

    expect(screen.queryByText("Spring makes Java programming quicker, easier, and safer for everybody.")).not.toBeInTheDocument();
    expect(screen.getByText("Spring giúp lập trình Java nhanh hơn, dễ dàng hơn và an toàn hơn cho mọi người.")).toBeInTheDocument();
  });

  it("highlights active sentence synchronized with video currentTime without redundant label", () => {
    const { rerender } = render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
        currentTime={7}
      />
    );

    // At 7s (>= 5s and < 15s), sentence 1 should be active
    expect(screen.queryByText("Đang phát")).not.toBeInTheDocument();
    expect(screen.getByText("00:05")).toBeInTheDocument();

    // Rerender at 18s (>= 15s), sentence 2 should be active
    rerender(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
        currentTime={18}
      />
    );

    expect(screen.queryByText("Đang phát")).not.toBeInTheDocument();
    expect(screen.getByText("00:15")).toBeInTheDocument();
  });

  it("opens Zen Reading Modal when clicking Mở rộng", () => {
    render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
      />
    );

    const expandBtn = screen.getByRole("button", { name: /Mở rộng/i });
    expect(expandBtn).toBeInTheDocument();

    fireEvent.click(expandBtn);
    expect(screen.getByText(/Chế độ Đọc Chuyên Sâu/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Đóng \(Esc\)/i })).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByRole("button", { name: /Đóng \(Esc\)/i }));
    expect(screen.queryByText(/Chế độ Đọc Chuyên Sâu/i)).not.toBeInTheDocument();
  });

  it("scales transcript font size directly with textScale", () => {
    render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
        textScale={120}
      />
    );

    const enText = screen.getByText("Spring makes Java programming quicker, easier, and safer for everybody.");
    // 13 * 1.2 = 15.6px
    expect(enText).toHaveStyle({ fontSize: "15.6px" });
  });

  it("triggers onSeek when user clicks timestamp or sentence card", () => {
    const onSeek = vi.fn();
    render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
        currentTime={0}
        onSeek={onSeek}
      />
    );

    // Click timestamp for sentence 2 (00:15)
    const btn = screen.getByRole("button", { name: /00:15/i });
    fireEvent.click(btn);
    expect(onSeek).toHaveBeenCalledWith(15);

    // Click sentence card 1
    const text1 = screen.getByText("Spring makes Java programming quicker, easier, and safer for everybody.");
    fireEvent.click(text1);
    expect(onSeek).toHaveBeenCalledWith(5);
  });

  it("shows empty state when no transcript provided", () => {
    render(<SpringTranscriptPanel transcript={[]} inRail={true} />);
    expect(screen.getByText("Chưa có transcript cho bài học này.")).toBeInTheDocument();
  });

  it("re-anchors active sentence instantly when switching language tabs", () => {
    const scrollToMock = vi.fn();
    Element.prototype.scrollTo = scrollToMock;

    render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
        currentTime={7}
      />
    );

    // Switch to Vietnamese only
    const viBtn = screen.getByRole("button", { name: /^Tiếng Việt$/i });
    fireEvent.click(viBtn);

    // Should call scrollTo with instant behavior
    expect(scrollToMock).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: "instant"
      })
    );
  });
});
