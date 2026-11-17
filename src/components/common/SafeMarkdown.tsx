import React from 'react';
import { cn } from '@/lib/utils';

export interface InlineMarkdownProps {
  text: string;
}

/**
 * Parses safe inline Markdown (`**bold**`, `*italic*`, `` `code` ``, `[label](https://...)`)
 * into pure React elements without dangerouslySetInnerHTML.
 */
export const InlineMarkdown: React.FC<InlineMarkdownProps> = ({ text }) => {
  if (!text) return null;

  const tokenRegex = /(\*\*[^*\n]+?\*\*|\*[^*\n]+?\*|`[^`\n]+?`|\[[^\]\n]+?\]\(https?:\/\/[^\s)]+\))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `md-in-${keyCounter++}`;

    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={key} className="italic text-zinc-200">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={key}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-obsidian border border-hairline font-mono text-[0.85em] text-cyan-300"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[')) {
      const linkMatch = /^\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(token);
      if (linkMatch) {
        parts.push(
          <a
            key={key}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
};

export interface SafeMarkdownProps {
  content: string;
  className?: string;
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return false;
  return /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(trimmed);
}

/**
 * Pure React block + inline Markdown renderer supporting headings (mapped to h3/h4 so
 * SlidePlayer keeps strictly one h1 and one h2), tables, lists, blockquotes, and code blocks.
 */
export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ content, className }) => {
  if (!content || !content.trim()) return null;

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i++;
      continue;
    }

    // Fenced code block ```
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push(
        <pre
          key={`md-b-${blockKey++}`}
          className="my-3 p-4 rounded-lg bg-[#0a0a0d] border border-hairline font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap"
        >
          {codeLines.join('\n')}
        </pre>
      );
      continue;
    }

    // Pipe table (header row + separator row)
    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headers = splitTableRow(lines[i]);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().includes('|') && !isTableSeparator(lines[i])) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      blocks.push(
        <div
          key={`md-b-${blockKey++}`}
          className="my-4 overflow-x-auto rounded-lg border border-hairline bg-obsidian/70"
        >
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surface">
                {headers.map((header, hIdx) => (
                  <th
                    key={hIdx}
                    className="px-3.5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan-300"
                  >
                    <InlineMarkdown text={header} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-surface/40 transition-colors">
                  {headers.map((_, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2.5 text-zinc-300 align-top">
                      <InlineMarkdown text={row[cIdx] ?? ''} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Headings (#, ##, ###, ####) -> ALWAYS h3 / h4 so H1 & H2 stay unique
    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      if (level <= 2) {
        blocks.push(
          <h3
            key={`md-b-${blockKey++}`}
            className="mt-4 mb-1.5 text-base sm:text-lg font-bold text-white tracking-tight"
          >
            <InlineMarkdown text={headingText} />
          </h3>
        );
      } else {
        blocks.push(
          <h4
            key={`md-b-${blockKey++}`}
            className="mt-3.5 mb-1 text-sm sm:text-base font-semibold text-cyan-300"
          >
            <InlineMarkdown text={headingText} />
          </h4>
        );
      }
      i++;
      continue;
    }

    // Blockquote (> ...)
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote
          key={`md-b-${blockKey++}`}
          className="my-3 border-l-2 border-cyan-400 bg-obsidian/60 px-4 py-2.5 rounded-r-lg text-sm text-zinc-200 italic"
        >
          <InlineMarkdown text={quoteLines.join(' ')} />
        </blockquote>
      );
      continue;
    }

    // Unordered list (- ... or * ...)
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul
          key={`md-b-${blockKey++}`}
          className="my-2.5 list-disc pl-6 space-y-1.5 text-sm md:text-base text-zinc-200"
        >
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list (1. ...)
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push(
        <ol
          key={`md-b-${blockKey++}`}
          className="my-2.5 list-decimal pl-6 space-y-1.5 text-sm md:text-base text-zinc-200"
        >
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph (accumulate consecutive plain lines until blank or special block)
    const paraLines: string[] = [line];
    i++;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (
        !next ||
        next.startsWith('```') ||
        next.startsWith('#') ||
        next.startsWith('>') ||
        /^[-*]\s+/.test(next) ||
        /^\d+\.\s+/.test(next) ||
        (next.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
      ) {
        break;
      }
      paraLines.push(next);
      i++;
    }
    blocks.push(
      <p key={`md-b-${blockKey++}`} className="leading-relaxed text-zinc-200">
        <InlineMarkdown text={paraLines.join(' ')} />
      </p>
    );
  }

  return <div className={cn('space-y-3', className)}>{blocks}</div>;
};

export default SafeMarkdown;
