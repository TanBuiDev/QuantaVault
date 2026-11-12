import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readInterviewProgress, replaceInterviewProgress } from "../interview/progress";
import {
  conservativeMerge, fetchGoogleProgress, getLinkedGoogleUser, isGoogleProgressLinked,
  linkGoogleProgress, reconcileGoogleProgress, unlinkGoogleProgress,
  ensureAutoLinkedGoogleProgress, prepareGoogleDevice,
} from "./googleSync";
import type { InterviewProgressState } from "../interview/types";

const state = (learned: string[] = [], review: string[] = [], bookmarks: string[] = []): InterviewProgressState => ({
  learned: Object.fromEntries(learned.map(id => [id, true])),
  review: Object.fromEntries(review.map(id => [id, true])),
  bookmarks: Object.fromEntries(bookmarks.map(id => [id, true])),
});
let remote: { state: InterviewProgressState; revision: number };
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  localStorage.clear();
  remote = { state: state(), revision: 0 };
  fetchMock = vi.fn(async (_: string, options?: RequestInit) => {
    if (!options || options.method !== "PUT") return Response.json({ ok: true, ...remote });
    const body = JSON.parse(options.body as string) as { state: InterviewProgressState; revision: number };
    if (body.revision !== remote.revision) return Response.json({ ok: false }, { status: 409 });
    remote = { state: body.state, revision: body.revision + 1 };
    return Response.json({ ok: true, revision: remote.revision });
  });
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("Google progress link and cross-device safety", () => {
  it("does not enable Google sync before explicit linking", () => {
    replaceInterviewProgress(state(["q-001"]));
    expect(isGoogleProgressLinked()).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("backs up local progress, links once and auto-syncs later local changes", async () => {
    const initial = state(["q-001"], ["q-002"], ["q-003"]);
    replaceInterviewProgress(initial);
    await linkGoogleProgress("google-user-a", "local", remote);
    expect(getLinkedGoogleUser()).toBe("google-user-a");
    expect(remote).toMatchObject({ revision: 1, state: initial });
    const archives = JSON.parse(localStorage.getItem("interview-progress-merge-archives-v1")!);
    expect(archives[0].state).toEqual(initial);
    replaceInterviewProgress(state(["q-001", "q-004"], ["q-002"], ["q-003"]));
    expect(await reconcileGoogleProgress("google-user-a")).toBe("synced");
    expect(remote.revision).toBe(2);
    expect(remote.state.learned["q-004"]).toBe(true);
  });

  it("detects concurrent device writes and leaves local data intact", async () => {
    replaceInterviewProgress(state(["q-001"]));
    await linkGoogleProgress("google-user-a", "local", remote);
    replaceInterviewProgress(state(["q-001", "q-002"]));
    remote = { state: state(["q-001"], ["q-003"]), revision: 2 };
    expect(await reconcileGoogleProgress("google-user-a")).toBe("conflict");
    expect(readInterviewProgress().learned["q-002"]).toBe(true);
    expect(remote.state.review["q-003"]).toBe(true);
  });

  it("imports a newer remote if local matches the last saved baseline", async () => {
    replaceInterviewProgress(state(["q-001"]));
    await linkGoogleProgress("google-user-a", "local", remote);
    remote = { revision: 2, state: state(["q-001", "q-005"]) };
    expect(await reconcileGoogleProgress("google-user-a")).toBe("synced");
    expect(readInterviewProgress().learned["q-005"]).toBe(true);
  });

  it("requires explicit user choice when local and remote have different data", async () => {
    const a = state(["q-001"], [], ["q-003"]);
    const b = state([], ["q-001"], ["q-004"]);
    expect(conservativeMerge(a, b)).toEqual(state([], ["q-001"], ["q-003", "q-004"]));
    replaceInterviewProgress(a);
    remote = { state: b, revision: 2 };
    await linkGoogleProgress("google-user-a", "conservative", remote);
    expect(remote.state.review["q-001"]).toBe(true);
    expect(readInterviewProgress().review["q-001"]).toBe(true);
  });

  it("never silently switches between Google accounts on the same browser", async () => {
    replaceInterviewProgress(state(["q-001"]));
    await linkGoogleProgress("google-user-a", "local", remote);
    await expect(linkGoogleProgress("google-user-b", "remote", remote)).rejects.toThrow("DIFFERENT_LINKED_GOOGLE_ACCOUNT");
    expect(getLinkedGoogleUser()).toBe("google-user-a");
    unlinkGoogleProgress("google-user-a");
    expect(getLinkedGoogleUser()).toBeNull();
    expect(readInterviewProgress().learned["q-001"]).toBe(true);
  });

  it("automatically restores D1 progress on a fresh device after login", async () => {
    remote = {state:state(["q-007"],["q-009"],["q-012"]),revision:4};
    prepareGoogleDevice("google-user-a");
    expect(await ensureAutoLinkedGoogleProgress("google-user-a")).toBe("synced");
    expect(getLinkedGoogleUser()).toBe("google-user-a");
    expect(readInterviewProgress()).toEqual(remote.state);
    expect(fetchMock.mock.calls.some(call=>call[1]?.method==="PUT")).toBe(false);
  });

  it("automatically activates empty matching Google progress", async () => {
    prepareGoogleDevice("google-user-a");
    expect(await ensureAutoLinkedGoogleProgress("google-user-a")).toBe("synced");
    expect(getLinkedGoogleUser()).toBe("google-user-a");
  });

  it("never uploads unclaimed device history without approval", async () => {
    replaceInterviewProgress(state(["q-001"]));
    prepareGoogleDevice("google-user-a");
    expect(await ensureAutoLinkedGoogleProgress("google-user-a")).toBe("conflict");
    expect(getLinkedGoogleUser()).toBeNull();
    expect(remote.revision).toBe(0);
  });

  it("keeps a separate device cache when a browser changes Google accounts", async () => {
    prepareGoogleDevice("google-user-a");
    await ensureAutoLinkedGoogleProgress("google-user-a");
    replaceInterviewProgress(state(["q-001"]));
    expect(await reconcileGoogleProgress("google-user-a")).toBe("synced");
    prepareGoogleDevice("google-user-b");
    expect(readInterviewProgress()).toEqual(state());
    expect(getLinkedGoogleUser()).toBeNull();
    remote={revision:0,state:state()};
    expect(await ensureAutoLinkedGoogleProgress("google-user-b")).toBe("synced");
    prepareGoogleDevice("google-user-a");
    expect(readInterviewProgress().learned["q-001"]).toBe(true);
    expect(getLinkedGoogleUser()).toBe("google-user-a");
  });

  it("does not import an old response after switching Google accounts", async () => {
    prepareGoogleDevice("google-user-a");
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    fetchMock.mockImplementationOnce(async () => {
      await gate;
      return Response.json({ok:true,state:state(["q-018"]),revision:4});
    });
    const inflight = ensureAutoLinkedGoogleProgress("google-user-a");
    prepareGoogleDevice("google-user-b");
    const bData = state([],["q-201"]);
    replaceInterviewProgress(bData);
    release();
    await expect(inflight).rejects.toThrow("ACCOUNT_SWITCHED");
    expect(readInterviewProgress()).toEqual(bData);
    expect(getLinkedGoogleUser()).toBeNull();
  });

  it("does not replace a local edit that arrives during first sync", async () => {
    prepareGoogleDevice("google-user-a");
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    fetchMock.mockImplementationOnce(async () => {
      await gate;
      return Response.json({ok:true,state:state(["q-015"]),revision:1});
    });
    const inflight = ensureAutoLinkedGoogleProgress("google-user-a");
    replaceInterviewProgress(state(["q-202"]));
    release();
    expect(await inflight).toBe("conflict");
    expect(readInterviewProgress()).toEqual(state(["q-202"]));
  });

  it("keeps local progress when account fetch is offline", async () => {
    replaceInterviewProgress(state(["q-001"]));
    await linkGoogleProgress("google-user-a", "local", remote);
    fetchMock.mockRejectedValueOnce(new Error("network offline"));
    await expect(fetchGoogleProgress()).rejects.toThrow("network offline");
    expect(readInterviewProgress().learned["q-001"]).toBe(true);
    expect(localStorage.getItem("quantavault_google_linked_user_v1")).toBe("google-user-a");
  });
});
