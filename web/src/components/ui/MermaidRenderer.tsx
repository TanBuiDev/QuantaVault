"use client";

import { useEffect, useRef, useState, useId } from "react";
import { Check, Copy, Code, Eye, RefreshCw } from "lucide-react";

interface MermaidRendererProps {
  chart: string;
}

// Module-level cache so we only load mermaid once across the entire application
let mermaidPromise: Promise<any> | null = null;

function getMermaid() {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if ((window as any).mermaid) return Promise.resolve((window as any).mermaid);
  if (!mermaidPromise) {
    mermaidPromise = (async () => {
      try {
        // Dynamic import from high-speed jsDelivr CDN
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const mod = await import(/* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");
        const mermaid = mod.default || mod;
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        });
        (window as any).mermaid = mermaid;
        return mermaid;
      } catch (err) {
        mermaidPromise = null;
        throw err;
      }
    })();
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

  const renderDiagram = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mermaid = await getMermaid();
      // Re-initialize theme in case dark mode toggled
      const isDark = document.documentElement.classList.contains("dark");
      mermaid.initialize({
        startOnLoad: false,
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
      setSvgContent(svg);
    } catch (err: any) {
      setError(err?.message || "Không thể vẽ sơ đồ Mermaid");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    renderDiagram();
  }, [chart]);

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
          <p className="font-semibold">⚠️ Không thể dựng đồ họa trực tiếp (Chế độ dự phòng mã nguồn):</p>
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
