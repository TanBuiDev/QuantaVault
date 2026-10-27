export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { javaDockerRunner } = await import("./lib/runners/dockerJavaRunner");
    try { await javaDockerRunner.cleanupStale(); }
    catch { console.warn("Java runner unavailable. Start Docker Desktop before running Java; the study workspace remains available."); }
  }
}
