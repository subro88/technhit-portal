"use client";

import React, { useState } from "react";
import TerminalBlock from "@/components/mdx/TerminalBlock";
import YouTubeEmbed from "@/components/mdx/YouTubeEmbed";
import ConfigDiff from "@/components/mdx/ConfigDiff";
import ArchitectureDiagram from "@/components/mdx/ArchitectureDiagram";
import MathFormulaBlock from "@/components/math/MathFormulaBlock";
import InfoBox from "@/components/mdx/InfoBox";
import CalculusFieldGuideHero from "@/components/math/CalculusFieldGuideHero";
import DerivativePlotter from "@/components/math/DerivativePlotter";
import RiemannSumVisualizer from "@/components/math/RiemannSumVisualizer";
import EpsilonDeltaExplorer from "@/components/math/EpsilonDeltaExplorer";
import ProofStepThrough from "@/components/math/ProofStepThrough";
import WorkedExampleCard from "@/components/math/WorkedExampleCard";
import { Check, Copy, Info, Lightbulb, AlertTriangle, ShieldAlert } from "lucide-react";

interface MdxRendererProps {
  content: string;
}

// Interactive Code Block with Copy Button
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl bg-[#07090e] border border-cyber-border shadow-2xl overflow-hidden font-mono text-xs">
      <div className="px-4 py-2 bg-[#0d1117] border-b border-cyber-border/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-semibold text-cyber-cyan uppercase tracking-wider ml-2">
            {lang || "SHELL"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyber-800 hover:bg-cyber-700 text-zinc-300 hover:text-white border border-cyber-border text-[11px] transition-all"
          title="Copy command to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 sm:p-5 overflow-x-auto text-zinc-100 bg-[#07090e] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Inline Markdown Parser for bold, italic, code, links, images
function parseInline(text: string): React.ReactNode {
  const tokens = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // 1. Markdown Image: ![alt](url)
    const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      tokens.push(
        <span key={`img-${keyIdx++}`} className="block my-4">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1]}
            className="rounded-lg border border-cyber-border shadow-lg max-w-full h-auto mx-auto"
            loading="lazy"
          />
          {imgMatch[1] && (
            <span className="block text-center text-xs text-zinc-500 mt-1 font-mono">
              {imgMatch[1]}
            </span>
          )}
        </span>
      );
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    // 2. Markdown Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      tokens.push(
        <a
          key={`link-${keyIdx++}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyber-cyan hover:underline underline-offset-4 decoration-cyber-cyan/50 font-medium transition-colors"
        >
          {parseInline(linkMatch[1])}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // 3. Inline Code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push(
        <code
          key={`code-${keyIdx++}`}
          className="px-1.5 py-0.5 rounded bg-cyber-800 text-cyber-cyan font-mono text-[13px] border border-cyber-border/60"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 4. Bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      tokens.push(
        <strong key={`bold-${keyIdx++}`} className="font-semibold text-zinc-100">
          {parseInline(boldMatch[1])}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 5. Italic: *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      tokens.push(
        <em key={`italic-${keyIdx++}`} className="italic text-zinc-300">
          {parseInline(italicMatch[1])}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // 6. Regular plain text chunk up to next special char
    const nextSpecial = remaining.search(/[!\[`*]/);
    if (nextSpecial === -1) {
      tokens.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      tokens.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return tokens.length === 1 && typeof tokens[0] === "string" ? tokens[0] : <>{tokens}</>;
}

export default function MdxRenderer({ content }: MdxRendererProps) {
  // CRITICAL: Normalize Windows CRLF (\r\n) and legacy Mac (\r) to standard LF (\n)
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Strip YAML frontmatter if present
  const cleanBody = normalized.replace(/^---[\s\S]*?---\n*/, "").trim();

  // Split into structural blocks by double newlines
  const blocks = cleanBody.split(/\n{2,}/);

  return (
    <div className="prose max-w-none space-y-6 text-[var(--fg,#d4d4d8)] leading-relaxed">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. TerminalBlock Custom Component
        const termMatch = trimmed.match(/<TerminalBlock\s+([^>]+)\/>/);
        if (termMatch) {
          const attrs = termMatch[1];
          const cmd = (attrs.match(/command="([^"]+)"/) || [])[1] || "";
          const title = (attrs.match(/title="([^"]+)"/) || [])[1] || "Terminal";
          const os = (attrs.match(/os="([^"]+)"/) || [])[1] || "Linux";
          return <TerminalBlock key={idx} command={cmd} title={title} os={os} />;
        }

        // 2. YouTubeEmbed Custom Component
        const ytMatch = trimmed.match(/<YouTubeEmbed\s+([^>]+)\/>/);
        if (ytMatch) {
          const attrs = ytMatch[1];
          const vidId = (attrs.match(/videoId="([^"]+)"/) || [])[1] || "";
          const title = (attrs.match(/title="([^"]+)"/) || [])[1] || "Video Companion";
          return <YouTubeEmbed key={idx} videoId={vidId} title={title} />;
        }

        // 3. ArchitectureDiagram
        const diagMatch = trimmed.match(/<ArchitectureDiagram\s+([^>]+)\/>/);
        if (diagMatch) {
          const attrs = diagMatch[1];
          const type = ((attrs.match(/type="([^"]+)"/) || [])[1] as any) || "cluster";
          const title = (attrs.match(/title="([^"]+)"/) || [])[1] || "Topology";
          return <ArchitectureDiagram key={idx} type={type} title={title} />;
        }

        // 4. MathFormulaBlock
        const mathMatch = trimmed.match(/<MathFormulaBlock\s+([^>]+)\/>/);
        if (mathMatch) {
          const attrs = mathMatch[1];
          const formula = (attrs.match(/formula="([^"]+)"/) || [])[1] || "";
          const label = (attrs.match(/label="([^"]+)"/) || [])[1] || "Formula";
          return <MathFormulaBlock key={idx} formula={formula} label={label} />;
        }

        // STEM 10+2 Specialized Interactive Modules
        if (trimmed.includes("<CalculusFieldGuideHero")) return <CalculusFieldGuideHero key={idx} />;
        if (trimmed.includes("<DerivativePlotter")) return <DerivativePlotter key={idx} />;
        if (trimmed.includes("<RiemannSumVisualizer")) return <RiemannSumVisualizer key={idx} />;
        if (trimmed.includes("<EpsilonDeltaExplorer")) return <EpsilonDeltaExplorer key={idx} />;
        const proofMatch = trimmed.match(/<ProofStepThrough(?:\s+title="([^"]+)")?\s*\/>/);
        if (proofMatch) return <ProofStepThrough key={idx} title={proofMatch[1]} />;

        const cardMatch = trimmed.match(/<WorkedExampleCard\s+([^>]+)\/>/);
        if (cardMatch) {
          const attrs = cardMatch[1];
          const tag = (attrs.match(/tag="([^"]+)"/) || [])[1] || "Problem";
          const cat = ((attrs.match(/categoryType="([^"]+)"/) || [])[1] as any) || "deriv";
          const title = (attrs.match(/title="([^"]+)"/) || [])[1] || "Worked Example";
          const statement = (attrs.match(/problemStatement="([^"]+)"/) || [])[1] || "";
          const answer = (attrs.match(/answer="([^"]+)"/) || [])[1] || "";
          const hintsAttr = (attrs.match(/hints=\{?\[([^\]]+)\]\}?/) || [])[1] || "";
          const hints = hintsAttr
            .split(/",\s*"/)
            .map((h) => h.replace(/^["'\s]+|["'\s]+$/g, ""));
          return (
            <WorkedExampleCard
              key={idx}
              tag={tag}
              categoryType={cat}
              title={title}
              problemStatement={statement}
              hints={hints}
              answer={answer}
            />
          );
        }

        // 5. ConfigDiff
        const diffMatch = trimmed.match(/<ConfigDiff\s+filename="([^"]+)"\s+diffText="([^"]+)"\s*\/>/);
        if (diffMatch) {
          return <ConfigDiff key={idx} filename={diffMatch[1]} diffText={diffMatch[2]} />;
        }

        // 6. InfoBox
        const infoMatch = trimmed.match(/<InfoBox(?:\s+title="([^"]+)")?(?:\s+type="([^"]+)")?>([\s\S]*?)<\/InfoBox>/);
        if (infoMatch) {
          return (
            <InfoBox key={idx} title={infoMatch[1] || "Notice"} type={(infoMatch[2] as any) || "note"}>
              {infoMatch[3]?.trim()}
            </InfoBox>
          );
        }

        // 7. Horizontal Rule
        if (trimmed === "---" || trimmed === "***" || trimmed === "<hr />" || trimmed === "<hr>") {
          return <hr key={idx} className="my-8 border-cyber-border" />;
        }

        // 8. GitHub Callout Alerts: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT]
        if (trimmed.startsWith(">")) {
          const lines = trimmed.split("\n").map((l) => l.replace(/^>\s?/, "").trim());
          const firstLine = lines[0] || "";
          let alertTitle = "Notice";
          let AlertIcon = Info;
          let alertColors = "border-cyber-cyan/40 bg-cyber-cyan/5 text-cyber-cyan";

          if (firstLine.includes("[!TIP]")) {
            alertTitle = "Cluster Recommendation";
            AlertIcon = Lightbulb;
            alertColors = "border-emerald-500/40 bg-emerald-500/5 text-emerald-400";
            lines.shift();
          } else if (firstLine.includes("[!WARNING]")) {
            alertTitle = "Warning";
            AlertIcon = AlertTriangle;
            alertColors = "border-amber-500/40 bg-amber-500/5 text-amber-400";
            lines.shift();
          } else if (firstLine.includes("[!IMPORTANT]")) {
            alertTitle = "Important";
            AlertIcon = ShieldAlert;
            alertColors = "border-red-500/40 bg-red-500/5 text-red-400";
            lines.shift();
          } else if (firstLine.includes("[!NOTE]")) {
            alertTitle = "Notice";
            AlertIcon = Info;
            alertColors = "border-cyber-cyan/40 bg-cyber-cyan/5 text-cyber-cyan";
            lines.shift();
          }

          return (
            <div
              key={idx}
              className={`my-6 rounded-xl border p-4 sm:p-5 shadow-lg ${alertColors}`}
            >
              <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold uppercase tracking-wider">
                <AlertIcon className="w-4 h-4 shrink-0" />
                <span>{alertTitle}</span>
              </div>
              <div className="text-sm text-zinc-300 leading-relaxed font-sans space-y-2">
                {lines.map((l, lIdx) => (
                  <p key={lIdx}>{parseInline(l)}</p>
                ))}
              </div>
            </div>
          );
        }

        // 9. Markdown Fenced Code Blocks: ```lang ... ```
        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const firstLine = lines[0].replace("```", "").trim();
          const lastLineIdx = lines.length - 1;
          const code = lines.slice(1, lines[lastLineIdx].startsWith("```") ? lastLineIdx : lines.length).join("\n");
          return <CodeBlock key={idx} code={code} lang={firstLine} />;
        }

        // 10. Headings: #, ##, ###, ####
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 tracking-tight pt-6 pb-2 border-b border-cyber-border">
              {parseInline(trimmed.replace("# ", ""))}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-semibold font-mono text-zinc-100 tracking-tight pt-5 pb-2">
              {parseInline(trimmed.replace("## ", ""))}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-medium font-mono text-cyber-cyan tracking-tight pt-4">
              {parseInline(trimmed.replace("### ", ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("#### ")) {
          return (
            <h4 key={idx} className="text-base sm:text-lg font-medium font-mono text-zinc-200 pt-3">
              {parseInline(trimmed.replace("#### ", ""))}
            </h4>
          );
        }

        // 11. Bullet Lists: Lines starting with "- " or "* "
        const listLines = trimmed.split("\n");
        const isBulletList = listLines.every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "));
        if (isBulletList) {
          return (
            <ul key={idx} className="my-4 space-y-2 pl-2">
              {listLines.map((line, lIdx) => {
                const itemText = line.trim().replace(/^[-*]\s+/, "");
                return (
                  <li key={lIdx} className="flex items-start gap-2.5 text-zinc-300 font-sans text-sm sm:text-base leading-relaxed">
                    <span className="text-cyber-cyan font-mono font-bold select-none shrink-0 mt-0.5">›</span>
                    <div>{parseInline(itemText)}</div>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 12. Numbered Lists: Lines starting with "1. ", "2. ", etc.
        const isNumList = listLines.every((line) => /^\d+\.\s+/.test(line.trim()));
        if (isNumList) {
          return (
            <ol key={idx} className="my-4 space-y-2 pl-2">
              {listLines.map((line, lIdx) => {
                const itemText = line.trim().replace(/^\d+\.\s+/, "");
                return (
                  <li key={lIdx} className="flex items-start gap-2.5 text-zinc-300 font-sans text-sm sm:text-base leading-relaxed">
                    <span className="text-amber-400 font-mono text-xs font-bold select-none shrink-0 mt-1">
                      [{String(lIdx + 1).padStart(2, "0")}]
                    </span>
                    <div>{parseInline(itemText)}</div>
                  </li>
                );
              })}
            </ol>
          );
        }

        // 13. Standard Paragraph with inline formatting
        return (
          <p key={idx} className="text-base sm:text-[16px] text-zinc-300 leading-relaxed font-sans my-3">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
