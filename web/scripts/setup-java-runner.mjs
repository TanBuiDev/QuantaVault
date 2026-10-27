import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const context = fileURLToPath(new URL("../docker/java-runner", import.meta.url));
const result = spawnSync("docker", ["build", "--platform=linux/amd64", "--tag", "leetcode-java-runner:25", context], { stdio: "inherit", windowsHide: true });
if (result.error) console.error("Không thể gọi Docker. Hãy cài đặt và khởi động Docker Desktop.", result.error.message);
process.exitCode = result.status ?? 1;
