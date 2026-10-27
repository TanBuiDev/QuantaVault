import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const webRoot = fileURLToPath(new URL("..", import.meta.url));
const repository = path.dirname(webRoot);
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "leetcode-e2e-"));
const fixtureRoot = fs.realpathSync(fixture);
// Never run mutation E2E against the user's canonical content or an existing server.
for (const directory of ["problems", "study-plans"]) {
  fs.cpSync(path.join(repository, directory), path.join(fixtureRoot, directory), { recursive: true });
}
const child = spawn(process.execPath, [path.join(webRoot, "node_modules/next/dist/bin/next"), "start", "-H", "127.0.0.1", "-p", "3100"], {
  cwd: webRoot, stdio: "inherit", windowsHide: true,
  env: { ...process.env, CONTENT_ROOT: fixtureRoot, LOCAL_APP_ORIGIN: "http://127.0.0.1:3100", NEXT_TELEMETRY_DISABLED: "1" },
});
let cleaned = false;
function cleanup() {
  if (cleaned) return;
  cleaned = true;
  const actual = fs.realpathSync(fixtureRoot);
  const parent = fs.realpathSync(os.tmpdir());
  if (path.dirname(actual) !== parent || !path.basename(actual).startsWith("leetcode-e2e-")) throw new Error("Unsafe fixture cleanup path");
  fs.rmSync(actual, { recursive: true, force: true });
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("error", error => { console.error(error); cleanup(); process.exitCode = 1; });
child.on("exit", code => { cleanup(); process.exitCode = code ?? 0; });
