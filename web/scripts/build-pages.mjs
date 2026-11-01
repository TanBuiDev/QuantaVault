import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { stagePagesSource, copyStudyMedia, verifyPagesArtifact } from "./pages-build-utils.mjs";
import { preparePagesDist } from "./prepare-pages-dist.mjs";

const webRoot = fileURLToPath(new URL("..", import.meta.url));
const repository = path.resolve(webRoot, "..");
const stage = fs.mkdtempSync(path.join(webRoot, ".pages-stage-"));
const cleanStage = () => {
  if (path.dirname(path.resolve(stage)) !== path.resolve(webRoot) || !path.basename(stage).startsWith(".pages-stage-")) throw new Error("Unsafe staging cleanup path.");
  fs.rmSync(stage, { recursive: true, force: true });
};
try {
  stagePagesSource(webRoot, stage);
  copyStudyMedia(repository, path.join(stage, "public"));
  fs.symlinkSync(path.join(webRoot, "node_modules"), path.join(stage, "node_modules"), process.platform === "win32" ? "junction" : "dir");
  // Build cannot inherit runtime credentials or arbitrary NEXT_PUBLIC values.
  const allowed = /^(?:PATH|PATHEXT|SystemRoot|WINDIR|COMSPEC|SYSTEMDRIVE|HOME|USERPROFILE|APPDATA|LOCALAPPDATA|TEMP|TMP|USERNAME|NUMBER_OF_PROCESSORS|PROCESSOR_ARCHITECTURE|HTTPS_PROXY|HTTP_PROXY|NO_PROXY|NODE_EXTRA_CA_CERTS|SSL_CERT_FILE)$/i;
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => allowed.test(key)));
  Object.assign(env, { NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1", QUANTAVAULT_PAGES_BUILD: "1", NEXT_PUBLIC_STUDY_MODE: "static", CONTENT_ROOT: repository });
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(webRoot, "node_modules/next/dist/bin/next"), "build"], { cwd: stage, env, stdio: "inherit", windowsHide: true });
    child.on("error", reject); child.on("exit", resolve);
  });
  if (code !== 0) throw new Error(`Static export failed with exit code ${code}.`);
  // Next uses distDir as the export destination (and .next for its internal build).
  await preparePagesDist(path.join(stage, "dist"));
  const plan = parse(fs.readFileSync(path.join(repository, "study-plans/top-interview-150/index.yaml"), "utf8"));
  const ids = plan.sections.flatMap(section => section.problems);
  verifyPagesArtifact(path.join(webRoot, "cloudflare-pages"), ids);
  console.log(`Verified static study export: ${ids.length} problems, HTML, navigation payloads and public assets.`);
} finally { cleanStage(); }
