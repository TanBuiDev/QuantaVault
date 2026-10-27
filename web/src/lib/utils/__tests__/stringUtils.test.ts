import { describe, expect, it } from "vitest";
import { matchesSearch, removeVietnameseTones } from "../stringUtils";

describe("stringUtils - Vietnamese Search & Normalization", () => {
  it("normalizes Vietnamese tones correctly", () => {
    expect(removeVietnameseTones("Đa luồng & Đồng bộ")).toBe("Da luong & Dong bo");
    expect(removeVietnameseTones("Hệ quản trị cơ sở dữ liệu")).toBe("He quan tri co so du lieu");
    expect(removeVietnameseTones("Quy hoạch động")).toBe("Quy hoach dong");
    expect(removeVietnameseTones("")).toBe("");
  });

  it("matches exact text case-insensitively", () => {
    expect(matchesSearch("Spring Boot Microservices", "spring")).toBe(true);
    expect(matchesSearch("Spring Boot Microservices", "BOOT")).toBe(true);
    expect(matchesSearch("Java Collections", "python")).toBe(false);
  });

  it("matches Vietnamese text without accents (unaccented search)", () => {
    expect(matchesSearch("Đa luồng trong Java", "da luong")).toBe(true);
    expect(matchesSearch("Phân biệt equals và hashCode", "phan biet")).toBe(true);
    expect(matchesSearch("Đồng bộ hóa với synchronized", "dong bo")).toBe(true);
    expect(matchesSearch("Xử lý ngoại lệ với try-catch", "ngoai le")).toBe(true);
  });

  it("handles empty or falsy inputs gracefully", () => {
    expect(matchesSearch(null, "test")).toBe(false);
    expect(matchesSearch(undefined, "test")).toBe(false);
    expect(matchesSearch("Any text", "")).toBe(true);
    expect(matchesSearch("Any text", "   ")).toBe(true);
  });
});
