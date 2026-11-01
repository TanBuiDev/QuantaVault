import { defineConfig, devices } from "@playwright/test";
import os from "node:os";
import path from "node:path";

export default defineConfig({
  testDir: "./e2e-pages",
  outputDir: path.join(os.tmpdir(), `quantavault-pages-results-${process.pid}`),
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3200", trace: "retain-on-failure" },
  projects: [{ name: "pages-chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node scripts/start-pages-e2e.mjs",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
