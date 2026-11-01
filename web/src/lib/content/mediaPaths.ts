/** Scope is part of the URL so identical basenames cannot shadow one another. */
export function mediaUrl(problemId: number, mediaPath: string): string {
  const match = /^(?:\.\/)?assets\/(problem|solution)\/(.+)$/.exec(mediaPath);
  if (!match || !Number.isSafeInteger(problemId) || problemId <= 0) throw new Error("Invalid study media path.");
  const segments = match[2].split("/");
  if (segments.some(segment => !segment || segment === "." || segment === ".." || segment.includes("\\") || segment.includes(":"))) throw new Error("Invalid study media path.");
  return `/media/${problemId}/${match[1]}/${segments.map(encodeURIComponent).join("/")}`;
}

export function rewriteMediaMarkdown(markdown: string | null, problemId: number): string | null {
  if (markdown === null) return null;
  return markdown.replace(/(?:\.\/)?assets\/(?:problem|solution)\/[^\s)"'<>]+/g, path => mediaUrl(problemId, path));
}
