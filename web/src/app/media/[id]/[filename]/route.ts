import fs from "node:fs";
import path from "node:path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export function GET(request: Request, { params }: { params: Promise<{ id: string; filename: string }> }) {
  return params.then(({ id, filename }) => {
    if (!/^\d+$/.test(id) || filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
      return new Response("Not found", { status: 404 });
    }
    const root = findRoot(process.cwd());
    if (!root) return new Response("Not found", { status: 404 });
    const problemDir = findProblemDirectory(root, Number(id));
    if (!problemDir) return new Response("Not found", { status: 404 });
    const candidates = [path.join(problemDir, "assets", "problem", filename), path.join(problemDir, "assets", "solution", filename)];
    const filePath = candidates.find((candidate) => fs.existsSync(candidate));
    if (!filePath) return new Response("Not found", { status: 404 });
    const ext = path.extname(filename).toLowerCase();
    return new Response(fs.readFileSync(filePath), {
      headers: { "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  });
}

function findRoot(start: string): string | null {
  let current = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(current, "problems"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function findProblemDirectory(root: string, id: number): string | null {
  const sections = fs.readdirSync(path.join(root, "problems"), { withFileTypes: true });
  for (const section of sections) {
    if (!section.isDirectory()) continue;
    const sectionPath = path.join(root, "problems", section.name);
    for (const problem of fs.readdirSync(sectionPath, { withFileTypes: true })) {
      if (!problem.isDirectory() || !/^\d{4}-/.test(problem.name)) continue;
      if (Number(problem.name.slice(0, 4)) === id) return path.join(sectionPath, problem.name);
    }
  }
  return null;
}
