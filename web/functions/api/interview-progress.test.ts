import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { webcrypto } from "node:crypto";
import { handleInterviewProgress } from "./interview-progress";

const token = "a".repeat(64);
const url = "https://quantavault.pages.dev/api/interview-progress";
const state = { learned: { "q-008": true }, review: {}, bookmarks: { "q-008": true } };

function createDb() {
  let row: { owner: string; content: string; revision: number } | null = null;
  return {
    prepare(sql: string) {
      let values: unknown[] = [];
      return {
        bind(...args: unknown[]) { values = args; return this; },
        async first<T>() {
          if (!row || row.owner !== values[0]) return null;
          return { state_json: row.content, revision: row.revision } as T;
        },
        async run() {
          let changes = 0;
          if (sql.startsWith("INSERT") && sql.includes("ON CONFLICT(owner_hash) DO UPDATE")) {
            const [owner, content] = values as string[];
            if (row?.owner === owner) row = { owner, content, revision: row.revision + 1 };
            else row = { owner, content, revision: 1 };
            changes = 1;
          } else if (sql.startsWith("INSERT")) {
            const [owner, content] = values as string[];
            if (!row) { row = { owner, content, revision: 1 }; changes = 1; }
          } else if (sql.startsWith("UPDATE")) {
            const [content, owner, rev] = values as [string, string, number];
            if (row && row.owner === owner && row.revision === rev) {
              row = { owner, content, revision: rev + 1 };
              changes = 1;
            }
          }
          return { meta: { changes } };
        },
      };
    },
  };
}
function req(method: string, body?: unknown, auth = token) {
  return new Request(url, {
    method, headers: { Authorization: `Bearer ${auth}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

describe("Cloudflare D1 interview progress API", () => {
  beforeEach(() => vi.stubGlobal("crypto", webcrypto));
  afterEach(() => vi.unstubAllGlobals());

  it("rejects missing/weak authentication and unavailable DB", async () => {
    const db = createDb();
    expect((await handleInterviewProgress({ request: req("GET", undefined, "weak"), env: { INTERVIEW_DB: db } })).status).toBe(401);
    expect((await handleInterviewProgress({ request: req("GET"), env: {} })).status).toBe(503);
  });

  it("saves private progress, prevents stale writes, and permits explicit overwrite", async () => {
    const db = createDb();
    const env = { INTERVIEW_DB: db };
    const initial = await handleInterviewProgress({ request: req("GET"), env });
    expect(await initial.json()).toMatchObject({ revision: 0, state: { learned: {} } });
    const created = await handleInterviewProgress({ request: req("PUT", { state, revision: 0 }), env });
    expect(created.status).toBe(200);
    expect(await created.json()).toMatchObject({ revision: 1 });
    const read = await handleInterviewProgress({ request: req("GET"), env });
    expect(await read.json()).toMatchObject({ revision: 1, state });
    expect((await handleInterviewProgress({ request: req("PUT", { state, revision: 0 }), env })).status).toBe(409);
    const updated = await handleInterviewProgress({ request: req("PUT", { state, revision: 0, overwrite: true }), env });
    expect(await updated.json()).toMatchObject({ revision: 2 });
  });

  it("rejects cross-site write attempts and contradictory status", async () => {
    const db = createDb();
    const crossSite = new Request(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, Origin: "https://evil.example", "Content-Type": "application/json" },
      body: JSON.stringify({ state, revision: 0 }),
    });
    expect((await handleInterviewProgress({ request: crossSite, env: { INTERVIEW_DB: db } })).status).toBe(403);
    const conflicting = { learned: { "q-008": true }, review: { "q-008": true }, bookmarks: {} };
    expect((await handleInterviewProgress({ request: req("PUT", { state: conflicting, revision: 0 }), env: { INTERVIEW_DB: db } })).status).toBe(400);
  });
});
