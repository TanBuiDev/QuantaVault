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
  it("renders in rail mode and searches correctly", () => {
    render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
      />
    );

    expect(screen.getByPlaceholderText("Tìm trong bài...")).toBeInTheDocument();
    expect(screen.getByText(/2 câu/i)).toBeInTheDocument();
    expect(screen.getByText("Spring makes Java programming quicker, easier, and safer for everybody.")).toBeInTheDocument();
    expect(screen.getByText("Dependency Injection is the core pattern in Spring Framework.")).toBeInTheDocument();

    // Search for pattern
    const searchInput = screen.getByPlaceholderText("Tìm trong bài...");
    fireEvent.change(searchInput, { target: { value: "core pattern" } });

    expect(screen.queryByText("Spring makes Java programming quicker, easier, and safer for everybody.")).not.toBeInTheDocument();
    expect(screen.getByText("Dependency Injection is the core pattern in Spring Framework.")).toBeInTheDocument();
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

  it("highlights active sentence synchronized with video currentTime", () => {
    const { rerender } = render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
        currentTime={7}
      />
    );

    // At 7s (>= 5s and < 15s), sentence 1 should be active
    expect(screen.getByText("Đang phát")).toBeInTheDocument();
    expect(screen.getByText("00:05")).toBeInTheDocument();

    // Rerender at 18s (>= 15s), sentence 2 should be active
    rerender(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
        currentTime={18}
      />
    );

    expect(screen.getByText("Đang phát")).toBeInTheDocument();
    expect(screen.getByText("00:15")).toBeInTheDocument();
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

  it("toggles auto-scroll mode", () => {
    render(
      <SpringTranscriptPanel
        transcript={mockTranscript}
        inRail={true}
      />
    );

    const toggleBtn = screen.getByTitle(/Đang bật tự cuộn/i);
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveTextContent("Tự cuộn: Bật");

    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveTextContent("Tự cuộn: Tắt");
  });

  it("shows empty state when no transcript provided", () => {
    render(<SpringTranscriptPanel transcript={[]} inRail={true} />);
    expect(screen.getByText("Chưa có transcript cho bài học này.")).toBeInTheDocument();
  });
});
