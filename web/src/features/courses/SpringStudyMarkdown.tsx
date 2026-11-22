"use client";

import { useMemo } from "react";
import type { LanguageMode } from "@/components/ui/LanguageModeToggle";
import { MarkdownContent } from "@/features/practice/MarkdownContent";

type StudyBlock =
  | { type: "heading"; level: number; en: string; vi?: string; number?: string; id?: string }
  | { type: "pair"; en: string; vi: string }
  | { type: "bullets"; items: Array<{ en: string; vi: string }> }
  | { type: "raw"; markdown: string }
  | { type: "vi-only"; vi: string };

const HEADING = /^(#{1,6})[ \t]+(.+)$/;
const EN_PARAGRAPH = /^\*\*EN:\*\*\s*(.*)$/;
const VI_PARAGRAPH = /^\*\*VI:\*\*\s*(.*)$/;
const VI_ONLY = /^\*\*(?:VI-NOTE|Giải thích \(VI\)|Ghi chú):\*\*\s*(.+)$/;
const EN_BULLET = /^[ \t]*[-*+][ \t]+\*\*EN:\*\*\s*(.*)$/;
const VI_BULLET = /^[ \t]+\*\*VI:\*\*\s*(.*)$/;
const NUMBER_PREFIX = /^(\d+(?:\.\d+)*\.)\s+/;

function splitHeading(title: string) {
  // The final spaced slash separates languages, not slashes within technical names.
  const separator = title.lastIndexOf(" / ");
  const en = separator === -1 ? title : title.slice(0, separator).trim();
  const vi = separator === -1 ? undefined : title.slice(separator + 3).trim();
  const number = en.match(NUMBER_PREFIX)?.[1];
  return { en, vi, number };
}

/**
 * Parse only the explicit bilingual teaching convention. Keep all other Markdown
 * (fenced code, ordinary lists, tables, quotes, callouts) as Markdown, unchanged.
 */
export function parseSpringStudyMarkdown(markdown: string): StudyBlock[] {
  if (!markdown.trim()) return [];
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: StudyBlock[] = [];
  const raw: string[] = [];
  let sectionIndex = 0;
  const flushRaw = () => {
    const text = raw.join("\n").trim();
    if (text) blocks.push({ type: "raw", markdown: text });
    raw.length = 0;
  };

  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    const trimmed = line.trimStart();
    const fenceMark = trimmed.startsWith(String.fromCharCode(96).repeat(3))
      ? String.fromCharCode(96).repeat(3)
      : trimmed.startsWith("~~~") ? "~~~" : null;

    // Never inspect identifiers, headings or language labels inside a code fence.
    if (fenceMark) {
      const fenced = [line];
      i++;
      while (i < lines.length) {
        fenced.push(lines[i]);
        const end = lines[i].trimStart();
        i++;
        if (end.startsWith(fenceMark)) break;
      }
      raw.push(...fenced);
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      flushRaw();
      const level = heading[1].length;
      const titles = splitHeading(heading[2]);
      blocks.push({
        type: "heading", level, ...titles,
        id: level === 2 ? "spring-study-section-" + sectionIndex++ : undefined
      });
      i++;
      continue;
    }

    const firstBullet = line.match(EN_BULLET);
    const nextBullet = lines[i + 1]?.match(VI_BULLET);
    if (firstBullet && nextBullet) {
      flushRaw();
      const items: Array<{ en: string; vi: string }> = [];
      let cursor = i;
      while (cursor < lines.length) {
        const en = lines[cursor]?.match(EN_BULLET);
        const vi = lines[cursor + 1]?.match(VI_BULLET);
        if (!en || !vi) break;
        items.push({ en: en[1], vi: vi[1] });
        cursor += 2;
        while (lines[cursor]?.trim() === "" && lines[cursor + 1]?.match(EN_BULLET)) cursor++;
      }
      blocks.push({ type: "bullets", items });
      i = cursor;
      continue;
    }

    const viOnly = line.match(VI_ONLY);
    if (viOnly) {
      flushRaw();
      blocks.push({ type: "vi-only", vi: viOnly[1] });
      i++;
      continue;
    }

    const en = line.match(EN_PARAGRAPH);
    if (en) {
      let next = i + 1;
      while (lines[next]?.trim() === "") next++;
      const vi = lines[next]?.match(VI_PARAGRAPH);
      if (vi) {
        flushRaw();
        blocks.push({ type: "pair", en: en[1], vi: vi[1] });
        i = next + 1;
        continue;
      }
    }

    // Decorative separators from the old study-guide format are not needed.
    if (line.trim() === "---" && raw.every((entry) => !entry.trim())) {
      i++;
      continue;
    }

    raw.push(line);
    i++;
  }
  flushRaw();
  return blocks;
}

function headingTitle(block: Extract<StudyBlock, { type: "heading" }>, mode: LanguageMode) {
  if (mode !== "vi" || !block.vi) return block.en;
  return (block.number ? block.number + " " : "") + block.vi;
}

export function getSpringStudySections(markdown: string, mode: LanguageMode) {
  return parseSpringStudyMarkdown(markdown)
    .filter((block): block is Extract<StudyBlock, { type: "heading" }> =>
      block.type === "heading" && block.level === 2)
    .map((block) => ({
      id: block.id as string,
      title: headingTitle(block, mode)
    }));
}

/** A plain-text/Markdown projection for exports and compatibility checks. */
export function transformBilingualMarkdown(raw: string, mode: LanguageMode): string {
  return parseSpringStudyMarkdown(raw).map((block) => {
    switch (block.type) {
      case "heading": {
        const heading = "#".repeat(block.level) + " " + headingTitle(block, mode);
        return mode === "bilingual" && block.vi ? heading + "\n\n*" + block.vi + "*" : heading;
      }
      case "pair":
        return mode === "en" ? block.en : mode === "vi" ? block.vi
          : block.en + "\n\n" + block.vi;
      case "bullets":
        return block.items.map((item) => mode === "en" ? "- " + item.en
          : mode === "vi" ? "- " + item.vi
          : "- " + item.en + "\n  " + item.vi).join("\n");
      case "vi-only":
        return mode === "en" ? "" : block.vi;
      case "raw":
        return block.markdown;
    }
  }).join("\n\n").trim();
}

interface SpringStudyMarkdownProps {
  markdown: string;
  mode: LanguageMode;
  query?: string;
}

const EN_STYLE = "!text-[var(--foreground)] [&_p]:!my-0 [&_p]:!max-w-none";
const VI_STYLE = "!text-inherit [&_p]:!my-0 [&_p]:!max-w-none [&_p]:!text-inherit [&_strong]:!text-inherit [&_em]:!text-inherit [&_li]:!text-inherit";
const HEADING_STYLE = "[&_h1]:!my-0 [&_h2]:!my-0 [&_h3]:!my-0 [&_h4]:!my-0 [&_h5]:!my-0 [&_h6]:!my-0";
const VI_COLOR = "text-[#0E7490] dark:text-[#7DD3E8]";

function StudyLanguageText({ text, language, highlight = false }: {
  text: string;
  language: "vi" | "en";
  highlight?: boolean;
}) {
  return (
    <div lang={language} data-study-language={language} className={highlight ? VI_COLOR : "text-[var(--foreground)]"}>
      <MarkdownContent markdown={text} fullWidth className={highlight ? VI_STYLE : EN_STYLE} />
    </div>
  );
}

/** A scoped renderer; generic interview/LeetCode Markdown is unaffected. */
export function SpringStudyMarkdown({ markdown, mode, query = "" }: SpringStudyMarkdownProps) {
  const blocks = useMemo(() => parseSpringStudyMarkdown(markdown), [markdown]);
  const visibleBlocks = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return blocks;
    return blocks.filter((block) => {
      if (block.type === "heading") return true;
      if (block.type === "raw") return block.markdown.toLocaleLowerCase().includes(q);
      if (block.type === "vi-only") return mode !== "en" && block.vi.toLocaleLowerCase().includes(q);
      if (block.type === "pair") return (block.en + " " + block.vi).toLocaleLowerCase().includes(q);
      return block.items.some((item) =>
        (item.en + " " + item.vi).toLocaleLowerCase().includes(q));
    });
  }, [blocks, query, mode]);

  return (
    <div data-spring-study-content className="mx-auto w-full max-w-[880px] min-w-0 space-y-6">
      {visibleBlocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <div key={block.id ?? "heading-" + index} id={block.id} className="scroll-mt-24 space-y-1.5">
              <MarkdownContent
                markdown={"#".repeat(block.level) + " " + headingTitle(block, mode)}
                fullWidth
                className={HEADING_STYLE + " " + EN_STYLE}
              />
              {mode === "bilingual" && block.vi && (
                <div data-study-language="vi" className={VI_COLOR + " text-sm sm:text-[15px]"}>
                  <MarkdownContent markdown={block.vi} fullWidth className={VI_STYLE + " !leading-6"} />
                </div>
              )}
            </div>
          );
        }
        if (block.type === "vi-only") {
          return mode === "en" ? null : (
            <div key={"vi-note-" + index} data-study-vi-note>
              <StudyLanguageText text={block.vi} language="vi" highlight={mode === "bilingual"} />
            </div>
          );
        }
        if (block.type === "pair") {
          return (
            <div key={"pair-" + index} data-study-pair className="space-y-1.5">
              {mode !== "vi" && <StudyLanguageText text={block.en} language="en" />}
              {mode !== "en" && <StudyLanguageText text={block.vi} language="vi" highlight={mode === "bilingual"} />}
            </div>
          );
        }
        if (block.type === "bullets") {
          const items = query.trim() ? block.items.filter((item) =>
            (item.en + " " + item.vi).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
            : block.items;
          return (
            <ul key={"bullets-" + index} data-study-bullets className="ml-5 list-disc space-y-3 pl-1">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="pl-1">
                  <div className="space-y-1.5">
                    {mode !== "vi" && <StudyLanguageText text={item.en} language="en" />}
                    {mode !== "en" && <StudyLanguageText text={item.vi} language="vi" highlight={mode === "bilingual"} />}
                  </div>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <div key={"raw-" + index} data-study-raw className="min-w-0">
            <MarkdownContent markdown={block.markdown} fullWidth />
          </div>
        );
      })}
    </div>
  );
}
