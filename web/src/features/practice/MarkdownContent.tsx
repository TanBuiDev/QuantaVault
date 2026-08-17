import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <div className="max-w-none space-y-4 text-sm leading-7 text-[var(--muted-strong)] sm:text-[15.5px] sm:leading-7 [&_a]:font-semibold [&_a]:text-[var(--primary-strong)] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--border-strong)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--muted)] [&_code]:rounded-md [&_code]:bg-[var(--surface-hover)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[var(--foreground)] [&_h1]:mt-2 [&_h1]:text-2xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:text-[var(--foreground)] [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[var(--foreground)] [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:max-w-[78ch] [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:bg-[var(--code-surface)] [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[var(--code-foreground)] [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[var(--border)] [&_td]:p-2 [&_th]:border [&_th]:border-[var(--border)] [&_th]:bg-[var(--surface-hover)] [&_th]:p-2 [&_th]:text-[var(--foreground)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
