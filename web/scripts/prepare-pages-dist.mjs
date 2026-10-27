import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const distApp = path.join(webRoot, "dist", "server", "app");
const distStatic = path.join(webRoot, "dist", "static");
const targetDir = path.join(webRoot, "cloudflare-pages");

console.log("Preparing Cloudflare Pages static export directory...");

// Clean and recreate targetDir
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });

// Copy static assets
const targetStatic = path.join(targetDir, "_next", "static");
fs.mkdirSync(path.dirname(targetStatic), { recursive: true });
fs.cpSync(distStatic, targetStatic, { recursive: true });
console.log("Copied _next/static assets.");

// Copy public assets (brand-logo, favicon, etc.)
const publicDir = path.join(webRoot, "public");
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, targetDir, { recursive: true });
  console.log("Copied public assets (brand-logo, favicon) -> cloudflare-pages/");
}

// Helper to copy file
function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`Copied ${path.basename(src)} -> ${path.relative(targetDir, dest)}`);
  } else {
    console.warn(`Source file not found: ${src}`);
  }
}

// 1. Home / Dashboard
copyFile(path.join(distApp, "index.html"), path.join(targetDir, "index.html"));

// 2. Interview
copyFile(path.join(distApp, "interview.html"), path.join(targetDir, "interview", "index.html"));
copyFile(path.join(distApp, "interview.html"), path.join(targetDir, "interview.html"));

// 3. Problems
copyFile(path.join(distApp, "problems.html"), path.join(targetDir, "problems", "index.html"));
copyFile(path.join(distApp, "problems.html"), path.join(targetDir, "problems.html"));

// 4. 404
copyFile(path.join(distApp, "_not-found.html"), path.join(targetDir, "404.html"));

// 5. Cloudflare _headers file
const headersContent = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
`;
fs.writeFileSync(path.join(targetDir, "_headers"), headersContent, "utf-8");

// 6. Build Cloudflare Pages _worker.js for /api/* functions
import esbuild from "esbuild";

const workerEntry = `
import { onRequestPost, onRequestOptions } from './functions/api/publish.ts';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/publish' || url.pathname === '/api/publish/') {
      if (request.method === 'OPTIONS') {
        return onRequestOptions();
      }
      if (request.method === 'POST') {
        return onRequestPost({ request, env });
      }
      return new Response('Method Not Allowed', { status: 405 });
    }
    return env.ASSETS.fetch(request);
  }
};
`;

try {
  esbuild.buildSync({
    stdin: {
      contents: workerEntry,
      resolveDir: webRoot,
      loader: 'ts',
    },
    outfile: path.join(targetDir, "_worker.js"),
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
  });
  console.log("Successfully built Cloudflare Pages _worker.js bundle.");
} catch (err) {
  console.error("Failed to build _worker.js:", err);
  throw err;
}

// 7. Copy Cloudflare Pages Functions as fallback
const functionsSrc = path.join(webRoot, "functions");
const functionsDest = path.join(targetDir, "functions");
if (fs.existsSync(functionsSrc)) {
  fs.cpSync(functionsSrc, functionsDest, { recursive: true });
  console.log("Copied functions -> cloudflare-pages/functions");
}

console.log("Cloudflare Pages bundle ready at:", targetDir);

