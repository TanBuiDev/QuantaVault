import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const webRoot = fileURLToPath(new URL("..", import.meta.url));

/** Consume a complete official Next.js export, not files from internal dist/server. */
export async function preparePagesDist(exportRoot) {
  if (!exportRoot || !fs.existsSync(path.join(exportRoot, "index.html"))) throw new Error("A complete Next.js static export is required. Run npm run build:pages.");
  const target = path.resolve(webRoot, "cloudflare-pages");
  if (path.dirname(target) !== path.resolve(webRoot) || path.basename(target) !== "cloudflare-pages") throw new Error("Unsafe Pages output path.");
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(exportRoot, target, { recursive: true });
  fs.writeFileSync(path.join(target, "_headers"), `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: SAMEORIGIN\n/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n`);
  fs.writeFileSync(path.join(target, "_routes.json"), JSON.stringify({ version: 1, include: ["/api/*"], exclude: [] }, null, 2));
  await esbuild.build({
    entryPoints: [path.join(webRoot, "scripts/pages-worker.ts")], outfile: path.join(target, "_worker.js"),
    bundle: true, format: "esm", platform: "browser", target: "es2022", tsconfig: path.join(webRoot, "tsconfig.json"),
  });
  console.log("Cloudflare Pages artifact ready:", target);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await preparePagesDist(process.argv[2]);
