import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LanguageModeToggle } from "../LanguageModeToggle";

describe("LanguageModeToggle", () => {
  it("renders all 3 language options with accessible labels", () => {
    const handleChange = vi.fn();
    render(<LanguageModeToggle value="bilingual" onChange={handleChange} />);

    expect(screen.getByText("Song ngữ")).toBeInTheDocument();
    expect(screen.getByText("Tiếng Việt")).toBeInTheDocument();
    expect(screen.getByText("Tiếng Anh")).toBeInTheDocument();

    const bilingualBtn = screen.getByText("Song ngữ");
    expect(bilingualBtn).toHaveAttribute("aria-pressed", "true");

    const viBtn = screen.getByText("Tiếng Việt");
    expect(viBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange when clicking a different mode", () => {
    const handleChange = vi.fn();
    render(<LanguageModeToggle value="bilingual" onChange={handleChange} />);

    const viBtn = screen.getByText("Tiếng Việt");
    fireEvent.click(viBtn);
    expect(handleChange).toHaveBeenCalledWith("vi");

    const enBtn = screen.getByText("Tiếng Anh");
    fireEvent.click(enBtn);
    expect(handleChange).toHaveBeenCalledWith("en");
  });
});
