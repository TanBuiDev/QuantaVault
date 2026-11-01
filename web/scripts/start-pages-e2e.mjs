import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const webRoot = fileURLToPath(new URL("..", import.meta.url));
const artifact = path.resolve(webRoot, "cloudflare-pages");
if (!fs.existsSync(path.join(artifact, "_worker.js"))) throw new Error("Run npm run build:pages before testing Pages.");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "quantavault-pages-e2e-"));
// An empty cwd prevents Wrangler discovering developer .env/.dev.vars/functions.
const allowed = /^(?:PATH|PATHEXT|SystemRoot|WINDIR|COMSPEC|SYSTEMDRIVE|HOME|USERPROFILE|APPDATA|LOCALAPPDATA|TEMP|TMP|USERNAME|NUMBER_OF_PROCESSORS|PROCESSOR_ARCHITECTURE)$/i;
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => allowed.test(key)));
Object.assign(env, { WRANGLER_SEND_METRICS: "false", CI: "1" });
const child = spawn(process.execPath, [path.join(webRoot, "node_modules/wrangler/bin/wrangler.js"), "pages", "dev", artifact, "--ip", "127.0.0.1", "--port", "3200", "--compatibility-date", "2026-10-30"], { cwd: temporary, env, stdio: "inherit", windowsHide: true });
const clean = () => {
  const resolved = path.resolve(temporary);
  if (path.dirname(resolved) !== path.resolve(os.tmpdir()) || !path.basename(resolved).startsWith("quantavault-pages-e2e-")) throw new Error("Unsafe Pages fixture cleanup path.");
  fs.rmSync(resolved, { recursive: true, force: true });
};
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("error", error => { console.error(error); clean(); process.exitCode = 1; });
child.on("exit", code => { clean(); process.exitCode = code ?? 0; });
