import fs from "node:fs";
import path from "node:path";
import { containedPath, findProblemDirectory } from "@/lib/content/repository";

const MIME_TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml" };

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; filename: string; file: string[] }> }) {
  const { id, filename: scope, file } = await params;
  if (!/^\d+$/.test(id) || !["problem", "solution"].includes(scope) || file.length === 0) return new Response("Not found", { status: 404 });
  try {
    const directory = findProblemDirectory(Number(id));
    const filename = containedPath(directory, `assets/${scope}/${file.join("/")}`);
    const contentType = MIME_TYPES[path.extname(filename).toLowerCase()];
    if (!contentType || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) return new Response("Not found", { status: 404 });
    return new Response(fs.readFileSync(filename), { headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=0, must-revalidate" } });
  } catch { return new Response("Not found", { status: 404 }); }
}
