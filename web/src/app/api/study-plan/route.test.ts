// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";
import { getAllProblemSummaries, getProblemSummary } from "@/lib/content";

vi.mock("@/lib/content", () => ({
  getTopInterview150: vi.fn(),
  getAllProblemSummaries: vi.fn(),
  getProblemSummary: vi.fn(),
}));

describe("study-plan navigation API", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    const content = await import("@/lib/content");
    vi.mocked(content.getTopInterview150).mockReturnValue({
      id: "top-interview-150",
      title: "Top Interview 150",
      sections: [{ name: "Array", slug: "array", problemIds: [1, 2] }],
    });
    vi.mocked(getAllProblemSummaries).mockReturnValue([
      { id: 1, title: "One", slug: "one", difficulty: "Easy" },
      { id: 2, title: "Two", slug: "two", difficulty: "Medium" },
    ] as ReturnType<typeof getAllProblemSummaries>);
    vi.mocked(getProblemSummary).mockImplementation(() => { throw new Error("repeated full scan"); });
  });

  it("builds navigation from one summary snapshot", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(getAllProblemSummaries).toHaveBeenCalledTimes(1);
    expect(getProblemSummary).not.toHaveBeenCalled();
  });
});
