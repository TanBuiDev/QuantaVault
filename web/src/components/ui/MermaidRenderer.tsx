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

function isLightHex(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length !== 6 && clean.length !== 3) return false;
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6;
}

export function adaptChartForDark(rawChart: string, isDark: boolean): string {
  if (!isDark) return rawChart;

  const subgraphIds = new Set<string>();
  const subgraphRegex = /subgraph\s+([A-Za-z0-9_]+)/g;
  let match: RegExpExecArray | null;
  while ((match = subgraphRegex.exec(rawChart)) !== null) {
    subgraphIds.add(match[1]);
  }

  return rawChart.replace(/style\s+([A-Za-z0-9_]+)\s+([^\n]+)/g, (fullLine, id, styleDefs) => {
    if (styleDefs.includes("fill-opacity") || styleDefs.includes("color:")) {
      return fullLine;
    }
    const fillMatch = styleDefs.match(/fill:\s*(#[0-9a-fA-F]{3,6})/);
    if (!fillMatch) return fullLine;
    const fillHex = fillMatch[1];
    if (isLightHex(fillHex)) {
      const isSubgraph = subgraphIds.has(id);
      const targetOpacity = isSubgraph ? "0.06" : "0.2";
      return `style ${id} ${styleDefs},fill-opacity:${targetOpacity}`;
    }
    return fullLine;
  });
}

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
                darkMode: true,
                background: "#0b0f19",
                mainBkg: "#1e293b",
                textColor: "#f8fafc",
                primaryColor: "#312e81",
                primaryTextColor: "#f8fafc",
                primaryBorderColor: "#6366f1",
                lineColor: "#818cf8",
                secondaryColor: "#064e3b",
                tertiaryColor: "#1e293b",
                edgeLabelBackground: "#1e293b",
                clusterBkg: "#0f172a",
                clusterBorder: "#334155",
                nodeBorder: "#6366f1",
                nodeTextColor: "#f8fafc",
                titleColor: "#f8fafc",
              }
            : {
                darkMode: false,
                background: "#ffffff",
                mainBkg: "#ffffff",
                textColor: "#0f172a",
                primaryColor: "#e0e7ff",
                primaryTextColor: "#0f172a",
                primaryBorderColor: "#6366f1",
                lineColor: "#4f46e5",
                edgeLabelBackground: "#ffffff",
                clusterBkg: "#f8fafc",
                clusterBorder: "#cbd5e1",
                nodeBorder: "#4f46e5",
                nodeTextColor: "#0f172a",
                titleColor: "#0f172a",
              },
        });

        const adaptedChart = adaptChartForDark(chart, isDark);
        const { svg } = await mermaid.render(uniqueId + "_" + Date.now(), adaptedChart);
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
          className="mermaid-renderer flex justify-center overflow-x-auto py-2 [&_svg]:max-w-full [&_svg]:h-auto
            dark:[&_.edgeLabel_rect]:fill-slate-900/95 dark:[&_.edgeLabel_rect]:stroke-slate-700/80
            [&_.edgeLabel_rect]:fill-white/95 [&_.edgeLabel_rect]:stroke-slate-200
            dark:[&_.edgeLabel_text]:!fill-slate-100 [&_.edgeLabel_text]:!fill-slate-900
            dark:[&_.edgeLabel_tspan]:!fill-slate-100 [&_.edgeLabel_tspan]:!fill-slate-900
            dark:[&_.cluster_text]:!fill-slate-100 [&_.cluster_text]:!fill-slate-900
            dark:[&_.cluster_tspan]:!fill-slate-100 [&_.cluster_tspan]:!fill-slate-900
            [&_.edgeLabel_text]:font-medium [&_.cluster_text]:font-semibold"
          dangerouslySetInnerHTML={{ __html: svgContent || "" }}
        />
      )}
    </div>
  );
}
