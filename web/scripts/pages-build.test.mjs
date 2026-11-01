import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { stagePagesSource, copyStudyMedia } from "./pages-build-utils.mjs";

test("staging whitelists source and omits credentials, tests, and local runtime routes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "quantavault-stage-test-"));
  try {
    const source = path.join(root, "web");
    for (const [file, value] of Object.entries({
      "src/app/page.tsx": "public page", "src/app/api/run-code/route.ts": "private runtime", "src/app/api/problems/route.ts": "export async function GET() {}",
      "src/app/api/study-plan/route.ts": "export async function GET() {}", "src/app/media/[id]/route.ts": "node media", "src/instrumentation.ts": "docker",
      "src/lib/foo.test.ts": "tests", "src/lib/foo.ts": "source", "src/test/setup.ts": "test setup", "src/.env": "private", ".env.local": "secret",
      "package.json": "{}", "tsconfig.json": "{}", "next.config.ts": "export default {};", "postcss.config.mjs": "export default {};", "public/logo.png": "logo",
    })) {
      const target = path.join(source, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, value);
    }
    const stage = path.join(root, "stage"); stagePagesSource(source, stage);
    assert.equal(fs.readFileSync(path.join(stage, "src/app/page.tsx"), "utf8"), "public page");
    for (const file of [".env.local", "src/.env", "src/instrumentation.ts", "src/app/api", "src/app/media", "src/lib/foo.test.ts", "src/test"]) assert.equal(fs.existsSync(path.join(stage, file)), false, file);
    assert.match(fs.readFileSync(path.join(stage, "src/app/content/problems.json/route.ts"), "utf8"), /force-static/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("exports media with scoped paths and rejects linked content", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "quantavault-media-test-"));
  try {
    const problem = path.join(root, "problems/arrays/0001-example");
    fs.mkdirSync(problem, { recursive: true }); fs.writeFileSync(path.join(problem, "meta.yaml"), "id: 1\n");
    for (const scope of ["problem", "solution"]) {
      fs.mkdirSync(path.join(problem, "assets", scope), { recursive: true }); fs.writeFileSync(path.join(problem, "assets", scope, "same.png"), scope);
    }
    const dest = path.join(root, "public"); copyStudyMedia(root, dest);
    for (const scope of ["problem", "solution"]) assert.equal(fs.readFileSync(path.join(dest, "media/1", scope, "same.png"), "utf8"), scope);
    fs.symlinkSync(path.join(root, "public"), path.join(problem, "assets", "problem", "linked"), process.platform === "win32" ? "junction" : "dir");
    assert.throws(() => copyStudyMedia(root, path.join(root, "public2")), /Linked/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
