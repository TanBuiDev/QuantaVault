"use client";

import { useEffect, useRef, useState, useId } from "react";
import { Check, Copy, Code, Eye, RefreshCw } from "lucide-react";
import DOMPurify from "dompurify";

interface MermaidRendererProps {
  chart: string;
}

interface MermaidInstance {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, text: string) => Promise<{ svg: string }>;
}

// The dependency is bundled into the site, rather than fetched from a CDN at runtime.
let mermaidPromise: Promise<MermaidInstance> | null = null;
let renderQueue = Promise.resolve();

function getMermaid(): Promise<MermaidInstance> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((module) => module.default).catch((error) => {
      mermaidPromise = null;
      throw error;
    });
  }
  return mermaidPromise;
}

export function MermaidRenderer({ chart }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const rawId = useId().replace(/:/g, "_");
  const uniqueId = `mermaid_${rawId}`;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        const mermaid = await getMermaid();
        if (!isMounted) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          // Keep diagram directives from overriding security and injecting CSS/HTML.
          secure: ["secure", "securityLevel", "startOnLoad", "maxTextSize", "maxEdges", "suppressErrorRendering", "htmlLabels", "themeCSS", "themeVariables", "fontFamily", "dompurifyConfig", "flowchart"],
          htmlLabels: false,
          flowchart: { htmlLabels: false },
          suppressErrorRendering: true,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          theme: isDark ? "dark" : "neutral",
          themeVariables: isDark
            ? {
                primaryColor: "#312e81",
                primaryTextColor: "#e2e8f0",
                primaryBorderColor: "#6366f1",
                lineColor: "#818cf8",
                secondaryColor: "#064e3b",
                tertiaryColor: "#1e293b",
              }
            : {
                primaryColor: "#e0e7ff",
                primaryTextColor: "#1e1b4b",
                primaryBorderColor: "#6366f1",
                lineColor: "#4f46e5",
              },
        });

        const { svg } = await mermaid.render(uniqueId + "_" + Date.now(), chart);
        if (isMounted) {
          setSvgContent(DOMPurify.sanitize(svg, {
            USE_PROFILES: { svg: true, svgFilters: true },
            FORBID_TAGS: ["a", "script", "foreignObject", "image", "iframe"],
          }));
          setError(null);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Không thể vẽ sơ đồ Mermaid";
          setError(message);
          setIsLoading(false);
        }
      }
    };

    // Mermaid has global configuration. Serialize config+render to avoid different
    // cards changing each other's theme while rendering asynchronously.
    renderQueue = renderQueue.then(renderDiagram, renderDiagram);

    return () => {
      isMounted = false;
    };
  }, [chart, uniqueId, isDark]);

  const handleCopy = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all hover:border-indigo-500/40">
      {/* Header Toolbar */}
      <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sơ đồ kiến trúc (Mermaid Diagram)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted-strong)] transition-all hover:text-[var(--foreground)]"
          >
            {showCode ? <Eye className="h-3.5 w-3.5" /> : <Code className="h-3.5 w-3.5" />}
            <span>{showCode ? "Xem đồ họa" : "Xem mã nguồn"}</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted-strong)] transition-all hover:text-[var(--foreground)]"
            title="Sao chép mã Mermaid"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Đã chép" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Main Diagram Area */}
      {showCode ? (
        <pre className="overflow-x-auto rounded-xl bg-[var(--code-surface)] p-3 text-xs leading-5 text-[var(--code-foreground)]">
          <code>{chart}</code>
        </pre>
      ) : isLoading ? (
        <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 text-[var(--muted)]">
          <RefreshCw className="h-5 w-5 animate-spin text-indigo-500" />
          <span className="text-xs">Đang dựng sơ đồ vector SVG...</span>
        </div>
      ) : error ? (
        <div className="space-y-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
          <p className="font-semibold">Không thể dựng đồ họa trực tiếp (Chế độ dự phòng mã nguồn):</p>
          <pre className="overflow-x-auto rounded-lg bg-[var(--code-surface)] p-3 text-xs text-[var(--code-foreground)]">
            <code>{chart}</code>
          </pre>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex justify-center overflow-x-auto py-2 [&_svg]:max-w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svgContent || "" }}
        />
      )}
    </div>
  );
}
