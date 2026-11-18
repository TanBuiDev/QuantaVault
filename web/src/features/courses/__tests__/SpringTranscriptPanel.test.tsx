import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpringTranscriptPanel } from "../SpringTranscriptPanel";
import type { CourseTranscriptSentence } from "@/lib/courses";

const mockTranscript: CourseTranscriptSentence[] = [
  {
    id: "sent-1",
    en: "Spring makes Java programming quicker, easier, and safer for everybody.",
    vi: "Spring giúp lập trình Java nhanh hơn, dễ dàng hơn và an toàn hơn cho mọi người."
  },
  {
    id: "sent-2",
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

  it("shows empty state when no transcript provided", () => {
    render(<SpringTranscriptPanel transcript={[]} inRail={true} />);
    expect(screen.getByText("Chưa có transcript cho bài học này.")).toBeInTheDocument();
  });
});
