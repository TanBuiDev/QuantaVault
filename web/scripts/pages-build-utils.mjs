import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const sourceExtensions = new Set([".ts", ".tsx", ".css", ".json", ".png", ".ico", ".svg"]);
const assetExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".woff", ".woff2", ".ttf"]);

function copyTree(source, target, accept) {
  if (!fs.existsSync(source)) return;
  const visit = (current, relative = "") => {
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Linked build input is not allowed: ${relative}`);
    const isDirectory = fs.statSync(current).isDirectory();
    if (!accept(relative.replaceAll("\\", "/"), isDirectory)) return;
    if (isDirectory) {
      for (const entry of fs.readdirSync(current)) visit(path.join(current, entry), path.join(relative, entry));
    } else {
      const destination = path.join(target, relative); fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.copyFileSync(current, destination);
    }
  };
  visit(source);
}

export function stagePagesSource(webRoot, stage) {
  fs.mkdirSync(stage, { recursive: true });
  for (const name of ["package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "postcss.config.mjs"]) {
    const source = path.join(webRoot, name);
    if (fs.existsSync(source)) fs.copyFileSync(source, path.join(stage, name));
  }
  copyTree(path.join(webRoot, "src"), path.join(stage, "src"), (relative, directory) => {
    if (/^(?:app\/(?:api|media)(?:\/|$)|instrumentation\.ts$|test(?:\/|$))/.test(relative) || /(?:^|\/)__tests__(?:\/|$)/.test(relative) || /\.(?:test|spec)\.[^.]+$/.test(relative)) return false;
    return directory || sourceExtensions.has(path.extname(relative));
  });
  copyTree(path.join(webRoot, "public"), path.join(stage, "public"), (relative, directory) => directory || assetExtensions.has(path.extname(relative).toLowerCase()));
  // Read endpoints become JSON assets at build time, never Functions.
  for (const [api, filename] of [["problems", "problems.json"], ["study-plan", "study-plan.json"]]) {
    const source = fs.readFileSync(path.join(webRoot, "src/app/api", api, "route.ts"), "utf8");
    const target = path.join(stage, "src/app/content", filename, "route.ts");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `export const dynamic = "force-static";\n${source}`);
  }
}

export function copyStudyMedia(repository, publicRoot) {
  const source = path.join(repository, "problems");
  for (const section of fs.readdirSync(source, { withFileTypes: true })) {
    if (section.isSymbolicLink()) throw new Error("Linked problem section is not allowed.");
    if (!section.isDirectory()) continue;
    for (const item of fs.readdirSync(path.join(source, section.name), { withFileTypes: true })) {
      if (item.isSymbolicLink()) throw new Error("Linked problem is not allowed.");
      if (!item.isDirectory()) continue;
      const directory = path.join(source, section.name, item.name);
      const meta = path.join(directory, "meta.yaml");
      if (!fs.existsSync(meta)) continue;
      if (fs.lstatSync(meta).isSymbolicLink()) throw new Error("Linked metadata is not allowed.");
      const { id } = parse(fs.readFileSync(meta, "utf8"));
      if (!Number.isSafeInteger(id) || id <= 0) throw new Error("Invalid problem id.");
      const assets = path.join(directory, "assets");
      if (fs.existsSync(assets) && fs.lstatSync(assets).isSymbolicLink()) throw new Error("Linked media is not allowed.");
      for (const scope of ["problem", "solution"]) copyTree(path.join(directory, "assets", scope), path.join(publicRoot, "media", String(id), scope), (relative, isDirectory) => isDirectory || assetExtensions.has(path.extname(relative).toLowerCase()));
    }
  }
}

export function verifyPagesArtifact(target, problemIds) {
  for (const id of problemIds) {
    if (!fs.existsSync(path.join(target, "problems", String(id), "index.html")) || !fs.existsSync(path.join(target, "problems", String(id), "index.txt"))) throw new Error(`Static HTML or navigation payload missing for problem ${id}.`);
  }
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (/^(?:\.env.*|\.dev\.vars.*|node_modules|scratch|functions|src)$/.test(entry.name) || /\.(?:pem|log|tmp|map)$/.test(entry.name)) throw new Error(`Unexpected private build artifact: ${entry.name}`);
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(filename);
      else if (/\.(?:js|json|txt|html)$/.test(entry.name)) {
        const text = fs.readFileSync(filename, "utf8");
        if (/\b(?:ghp_[A-Za-z0-9]{20,}|cfat_[A-Za-z0-9_-]{20,}|sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/.test(text)) throw new Error("Sensitive material detected in artifact.");
      }
    }
  };
  visit(target);
}
