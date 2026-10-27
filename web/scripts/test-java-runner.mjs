import { spawnSync } from "node:child_process";
const result = spawnSync(process.execPath, ["node_modules/vitest/vitest.mjs", "run", "src/lib/runners/dockerJavaRunner.integration.test.ts"], {
  stdio: "inherit", env: { ...process.env, JAVA_DOCKER_INTEGRATION: "1" }, windowsHide: true,
});
process.exit(result.status ?? 1);
