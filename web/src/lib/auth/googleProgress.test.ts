// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleGoogleProgress } from "./googleProgress";
import { readGoogleAccount } from "./googleOAuth";

vi.mock("./googleOAuth", () => ({
  readGoogleAccount: vi.fn(),
}));
const ORIGIN = "https://quantavault.pages.dev";
const user = { id: "stable-google-id", name: "Demo", email: "demo@example.com", role: "user" as const };
const state = { learned: { "q-001": true }, review: { "q-089": true }, bookmarks: {} };
const make = (method: string, body?: unknown, origin = ORIGIN) => new Request(ORIGIN + "/api/google-progress", {
  method, ...(body === undefined ? {} : {
    body: JSON.stringify(body),
    headers: { Origin: origin, "Content-Type": "application/json" },
  }),
});
class Db {
  record: { state_json: string; revision: number } | null = null;
  writes = 0;
  prepare(sql: string) {
    let args: unknown[] = [];
    return {
      bind(...v: unknown[]) { args = v; return this; },
      first: async <T>(): Promise<T | null> => {
        if (sql.startsWith("SELECT state_json")) return this.record as T | null;
        throw new Error("wrong select");
      },
      run: async () => {
        if (sql.startsWith("INSERT INTO oauth_interview_progress")) {
          if (this.record) return { meta: { changes: 0 } };
          this.record = { state_json: args[1] as string, revision: 1 };
          this.writes++;
          return { meta: { changes: 1 } };
        }
        if (sql.startsWith("UPDATE oauth_interview_progress")) {
          if (!this.record || this.record.revision !== args[2]) return { meta: { changes: 0 } };
          this.record = { state_json: args[0] as string, revision: this.record.revision + 1 };
          this.writes++;
          return { meta: { changes: 1 } };
        }
        throw new Error("Unexpected SQL");
      },
    };
  }
}
let db: Db;
describe("Google account progress is separate from legacy bearer-code storage", () => {
  beforeEach(() => {
    db = new Db();
    vi.mocked(readGoogleAccount).mockResolvedValue(user);
  });
  it("requires an authenticated user", async () => {
    vi.mocked(readGoogleAccount).mockResolvedValueOnce(null);
    const response = await handleGoogleProgress(make("GET"), { INTERVIEW_DB: db });
    expect(response.status).toBe(401);
    expect(db.writes).toBe(0);
  });
  it("starts empty and saves only on an explicit same-origin PUT", async () => {
    const before = await handleGoogleProgress(make("GET"), { INTERVIEW_DB: db });
    expect(await before.json()).toMatchObject({ ok: true, revision: 0 });
    const put = await handleGoogleProgress(make("PUT", { state, revision: 0 }), { INTERVIEW_DB: db });
    expect(await put.json()).toMatchObject({ ok: true, revision: 1 });
    const after = await handleGoogleProgress(make("GET"), { INTERVIEW_DB: db });
    expect(await after.json()).toMatchObject({ revision: 1, state });
    expect(db.writes).toBe(1);
  });
  it("rejects cross-site CSRF writes", async () => {
    const response = await handleGoogleProgress(make("PUT", { state, revision: 0 }, "https://malicious.example"), { INTERVIEW_DB: db });
    expect(response.status).toBe(403);
    expect(db.writes).toBe(0);
  });
  it("uses optimistic revision and never silently overwrites newer account progress", async () => {
    expect((await handleGoogleProgress(make("PUT", { state, revision: 0 }), { INTERVIEW_DB: db })).status).toBe(200);
    expect((await handleGoogleProgress(make("PUT", { state, revision: 0 }), { INTERVIEW_DB: db })).status).toBe(409);
    const next = { learned: {}, review: { "q-001": true }, bookmarks: {} };
    expect((await handleGoogleProgress(make("PUT", { state: next, revision: 1 }), { INTERVIEW_DB: db })).status).toBe(200);
    expect((await handleGoogleProgress(make("PUT", { state, revision: 1 }), { INTERVIEW_DB: db })).status).toBe(409);
    expect(JSON.parse(db.record!.state_json)).toEqual(next);
    expect(db.writes).toBe(2);
  });
  it("rejects invalid progress and learned/review collisions", async () => {
    const bad = { learned: { "q-001": true }, review: { "q-001": true }, bookmarks: {} };
    expect((await handleGoogleProgress(make("PUT", { state: bad, revision: 0 }), { INTERVIEW_DB: db })).status).toBe(400);
    expect(db.writes).toBe(0);
  });
});
