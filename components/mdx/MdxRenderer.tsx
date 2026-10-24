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
import Callout from "@/components/mdx/Callout";
import CodeTabs from "@/components/mdx/CodeTabs";
import Steps, { Step } from "@/components/mdx/Steps";
import Bookmark from "@/components/mdx/Bookmark";
import MediaLightbox from "@/components/mdx/MediaLightbox";
import FileTree from "@/components/mdx/FileTree";
import Kbd from "@/components/mdx/Kbd";
import MetricCard, { MetricGrid } from "@/components/mdx/MetricCard";
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

// ASCII / Indented Bullet Directory Tree Parser
function parseAsciiTree(text: string) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const rootItems: any[] = [];
  const stack: { depth: number; item: any }[] = [];

  for (const line of lines) {
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;
    const clean = line.trim().replace(/^[-*•]\s+/, "");

    let comment: string | undefined;
    let mainText = clean;
    const commentIdx = clean.indexOf("//");
    if (commentIdx !== -1) {
      comment = clean.substring(commentIdx + 2).trim();
      mainText = clean.substring(0, commentIdx).trim();
    }

    const highlight = mainText.includes("[highlight]") || mainText.includes("(highlight)");
    const name = mainText.replace(/\[highlight\]|\(highlight\)/g, "").trim();
    const isFolder = name.endsWith("/") || (!name.includes(".") && !name.includes("file"));

    const item: any = {
      name,
      type: isFolder ? "folder" : "file",
      highlight,
      comment,
      children: isFolder ? [] : undefined,
    };

    while (stack.length > 0 && stack[stack.length - 1].depth >= indent) {
      stack.pop();
    }

    if (stack.length === 0) {
      rootItems.push(item);
    } else {
      const parent = stack[stack.length - 1].item;
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    }

    if (isFolder) {
      stack.push({ depth: indent, item });
    }
  }

  return rootItems;
}

// Inline Markdown Parser for linked images, images, links, code, bold, italic, kbd
function parseInline(text: string): React.ReactNode {
  const tokens = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // 1. Linked Image: [![alt](src)](href)
    const linkedImgMatch = remaining.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/);
    if (linkedImgMatch) {
      tokens.push(
        <a
          key={`linked-img-${keyIdx++}`}
          href={linkedImgMatch[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="block my-6 group"
        >
          <img
            src={linkedImgMatch[2]}
            alt={linkedImgMatch[1]}
            className="rounded-xl border border-cyber-border group-hover:border-cyber-cyan/50 shadow-xl max-w-full h-auto mx-auto transition-all"
            loading="lazy"
          />
          {linkedImgMatch[1] && (
            <span className="block text-center text-xs text-zinc-500 group-hover:text-cyber-cyan mt-1.5 font-mono transition-colors">
              {linkedImgMatch[1]}
            </span>
          )}
        </a>
      );
      remaining = remaining.slice(linkedImgMatch[0].length);
      continue;
    }

    // 2. Standalone Markdown Image: ![alt](url)
    const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      tokens.push(
        <span key={`img-${keyIdx++}`} className="block my-6">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1]}
            className="rounded-xl border border-cyber-border shadow-xl max-w-full h-auto mx-auto"
            loading="lazy"
          />
          {imgMatch[1] && (
            <span className="block text-center text-xs text-zinc-500 mt-1.5 font-mono">
              {imgMatch[1]}
            </span>
          )}
        </span>
      );
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    // 3. Markdown Link: [text](url)
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

    // 4. Inline Keycap: <Kbd>key</Kbd> or <kbd>key</kbd>
    const kbdMatch = remaining.match(/^<(?:Kbd|kbd)>([^<]+)<\/(?:Kbd|kbd)>/i);
    if (kbdMatch) {
      tokens.push(<Kbd key={`kbd-${keyIdx++}`}>{kbdMatch[1]}</Kbd>);
      remaining = remaining.slice(kbdMatch[0].length);
      continue;
    }

    // 5. Inline Code: `code`
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

    // 6. Bold: **text**
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

    // 7. Italic: *text*
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

    // 8. Regular plain text chunk up to next special char
    const nextSpecial = remaining.search(/[!\[`<*]/);
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

  // Extract all code blocks first into placeholders to prevent blank lines inside code blocks from breaking fences
  const codeBlocks: { lang: string; code: string }[] = [];
  const withPlaceholders = cleanBody.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)\n```/g, (_, lang, code) => {
    const token = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push({ lang: lang || "SHELL", code: code.trim() });
    return `\n\n${token}\n\n`;
  });

  // Split into structural blocks by double newlines
  const blocks = withPlaceholders.split(/\n{2,}/);

  return (
    <div className="prose max-w-none space-y-6 text-[var(--fg,#d4d4d8)] leading-relaxed">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. CodeBlock via Placeholder
        const codeTokenMatch = trimmed.match(/^__CODE_BLOCK_(\d+)__$/);
        if (codeTokenMatch) {
          const cb = codeBlocks[parseInt(codeTokenMatch[1], 10)];
          if (cb) {
            return <CodeBlock key={idx} code={cb.code} lang={cb.lang} />;
          }
        }

        // 2. TerminalBlock Custom Component
        const termMatch = trimmed.match(/<TerminalBlock\s+([^>]+)\/>/);
        if (termMatch) {
          const attrs = termMatch[1];
          const cmd = (attrs.match(/command="([^"]+)"/) || [])[1] || "";
          const title = (attrs.match(/title="([^"]+)"/) || [])[1] || "Terminal";
          const os = (attrs.match(/os="([^"]+)"/) || [])[1] || "Linux";
          return <TerminalBlock key={idx} command={cmd} title={title} os={os} />;
        }

        // 3. YouTubeEmbed Custom Component
        const ytMatch = trimmed.match(/<YouTubeEmbed\s+([^>]+)\/>/);
        if (ytMatch) {
          const attrs = ytMatch[1];
          const vidId = (attrs.match(/videoId="([^"]+)"/) || [])[1] || "";
          const title = (attrs.match(/title="([^"]+)"/) || [])[1] || "Video Companion";
          return <YouTubeEmbed key={idx} videoId={vidId} title={title} />;
        }

        // 4. ArchitectureDiagram
        const diagMatch = trimmed.match(/<ArchitectureDiagram\s+([^>]+)\/>/);
        if (diagMatch) {
          const attrs = diagMatch[1];
          const type = ((attrs.match(/type="([^"]+)"/) || [])[1] as any) || "cluster";
          const title = (attrs.match(/title="([^"]+)"/) || [])[1] || "Topology";
          return <ArchitectureDiagram key={idx} type={type} title={title} />;
        }

        // 5. MathFormulaBlock
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

        // 6. ConfigDiff
        const diffMatch = trimmed.match(/<ConfigDiff\s+filename="([^"]+)"\s+diffText="([^"]+)"\s*\/>/);
        if (diffMatch) {
          return <ConfigDiff key={idx} filename={diffMatch[1]} diffText={diffMatch[2]} />;
        }

        // 7. InfoBox
        const infoMatch = trimmed.match(/<InfoBox(?:\s+title="([^"]+)")?(?:\s+type="([^"]+)")?>([\s\S]*?)<\/InfoBox>/);
        if (infoMatch) {
          return (
            <InfoBox key={idx} title={infoMatch[1] || "Notice"} type={(infoMatch[2] as any) || "note"}>
              {infoMatch[3]?.trim()}
            </InfoBox>
          );
        }

        // 7b. Callout Component
        const calloutMatch = trimmed.match(/<Callout(?:\s+type="([^"]+)")?(?:\s+title="([^"]+)")?>([\s\S]*?)<\/Callout>/);
        if (calloutMatch) {
          return (
            <Callout
              key={idx}
              type={(calloutMatch[1] as any) || "info"}
              title={calloutMatch[2]}
            >
              {parseInline(calloutMatch[3]?.trim())}
            </Callout>
          );
        }

        // 7c. CodeTabs Component
        const codeTabsBlockMatch = trimmed.match(/<CodeTabs(?:\s+defaultTab=\{?(\d+)\}?)?>([\s\S]*?)<\/CodeTabs>/);
        if (codeTabsBlockMatch) {
          const defTab = codeTabsBlockMatch[1] ? parseInt(codeTabsBlockMatch[1], 10) : 0;
          const rawInner = codeTabsBlockMatch[2];
          const tabMatches = [...rawInner.matchAll(/<Tab\s+label="([^"]+)"(?:\s+lang="([^"]+)")?(?:\s+filename="([^"]+)")?>([\s\S]*?)<\/Tab>/g)];
          const tabs = tabMatches.map((m) => {
            let code = m[4].trim();
            const cbMatch = code.match(/__CODE_BLOCK_(\d+)__/);
            let lang = m[2];
            if (cbMatch) {
              const cb = codeBlocks[parseInt(cbMatch[1], 10)];
              if (cb) {
                code = cb.code;
                lang = lang || cb.lang;
              }
            }
            return {
              label: m[1],
              lang: lang || "bash",
              filename: m[3],
              code: code.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").trim(),
            };
          });
          return <CodeTabs key={idx} tabs={tabs} defaultTab={defTab} />;
        }

        // 7d. Steps & Step Component
        const stepsMatch = trimmed.match(/<Steps>([\s\S]*?)<\/Steps>/);
        if (stepsMatch) {
          const inner = stepsMatch[1];
          const stepMatches = [...inner.matchAll(/<Step\s+title="([^"]+)"(?:\s+badge="([^"]+)")?(?:\s+number="([^"]+)")?>([\s\S]*?)<\/Step>/g)];
          return (
            <Steps key={idx}>
              {stepMatches.map((sm, sIdx) => {
                let stepContent = sm[4].trim();
                const cbMatch = stepContent.match(/__CODE_BLOCK_(\d+)__/);
                if (cbMatch) {
                  const cb = codeBlocks[parseInt(cbMatch[1], 10)];
                  if (cb) {
                    return (
                      <Step key={sIdx} title={sm[1]} badge={sm[2]} number={sm[3] || String(sIdx + 1).padStart(2, "0")}>
                        <CodeBlock code={cb.code} lang={cb.lang} />
                      </Step>
                    );
                  }
                }
                return (
                  <Step key={sIdx} title={sm[1]} badge={sm[2]} number={sm[3] || String(sIdx + 1).padStart(2, "0")}>
                    {parseInline(stepContent)}
                  </Step>
                );
              })}
            </Steps>
          );
        }

        // 7e. Bookmark Component
        const bookmarkMatch = trimmed.match(/<Bookmark\s+([^>]+)\/>/);
        if (bookmarkMatch) {
          const attrs = bookmarkMatch[1];
          const url = (attrs.match(/url="([^"]+)"/) || [])[1] || "#";
          const title = (attrs.match(/title="([^"]+)"/) || [])[1] || url;
          const description = (attrs.match(/description="([^"]+)"/) || [])[1];
          const domain = (attrs.match(/domain="([^"]+)"/) || [])[1];
          const image = (attrs.match(/image="([^"]+)"/) || [])[1];
          const badge = (attrs.match(/badge="([^"]+)"/) || [])[1] || "REFERENCE";
          return (
            <Bookmark
              key={idx}
              url={url}
              title={title}
              description={description}
              domain={domain}
              image={image}
              badge={badge}
            />
          );
        }

        // 7f. MediaLightbox Component
        const mediaMatch = trimmed.match(/<MediaLightbox\s+([^>]+)\/>/);
        if (mediaMatch) {
          const attrs = mediaMatch[1];
          const src = (attrs.match(/src="([^"]+)"/) || [])[1] || "";
          const alt = (attrs.match(/alt="([^"]+)"/) || [])[1] || "Diagram";
          const caption = (attrs.match(/caption="([^"]+)"/) || [])[1];
          return <MediaLightbox key={idx} src={src} alt={alt} caption={caption} />;
        }

        // 7g. FileTree Component
        const fileTreeMatch = trimmed.match(/<FileTree(?:\s+title="([^"]+)")?(?:\s+rootPath="([^"]+)")?>([\s\S]*?)<\/FileTree>/);
        if (fileTreeMatch) {
          const title = fileTreeMatch[1] || "DIRECTORY STRUCTURE";
          const rootPath = fileTreeMatch[2] || "/etc/";
          const items = parseAsciiTree(fileTreeMatch[3].trim());
          return <FileTree key={idx} title={title} rootPath={rootPath} items={items} />;
        }

        // 7h. MetricCard and MetricGrid Components
        const metricGridMatch = trimmed.match(/<MetricGrid>([\s\S]*?)<\/MetricGrid>/);
        if (metricGridMatch) {
          const inner = metricGridMatch[1];
          const cardMatches = [...inner.matchAll(/<MetricCard\s+([^>]+)\/>/g)];
          return (
            <MetricGrid key={idx}>
              {cardMatches.map((cm, cIdx) => {
                const attrs = cm[1];
                const value = (attrs.match(/value="([^"]+)"/) || [])[1] || "0";
                const label = (attrs.match(/label="([^"]+)"/) || [])[1] || "Metric";
                const delta = (attrs.match(/delta="([^"]+)"/) || [])[1];
                const trend = ((attrs.match(/trend="([^"]+)"/) || [])[1] as any) || "up";
                const accent = ((attrs.match(/accent="([^"]+)"/) || [])[1] as any) || "amber";
                return (
                  <MetricCard
                    key={cIdx}
                    value={value}
                    label={label}
                    delta={delta}
                    trend={trend}
                    accent={accent}
                  />
                );
              })}
            </MetricGrid>
          );
        }

        const singleMetricMatch = trimmed.match(/<MetricCard\s+([^>]+)\/>/);
        if (singleMetricMatch) {
          const attrs = singleMetricMatch[1];
          const value = (attrs.match(/value="([^"]+)"/) || [])[1] || "0";
          const label = (attrs.match(/label="([^"]+)"/) || [])[1] || "Metric";
          const delta = (attrs.match(/delta="([^"]+)"/) || [])[1];
          const trend = ((attrs.match(/trend="([^"]+)"/) || [])[1] as any) || "up";
          const accent = ((attrs.match(/accent="([^"]+)"/) || [])[1] as any) || "amber";
          return (
            <MetricCard
              key={idx}
              value={value}
              label={label}
              delta={delta}
              trend={trend}
              accent={accent}
            />
          );
        }

        // 8. Horizontal Rule
        if (trimmed === "---" || trimmed === "***" || trimmed === "<hr />" || trimmed === "<hr>") {
          return <hr key={idx} className="my-8 border-cyber-border" />;
        }

        // 9. GitHub Callout Alerts: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT]
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

        // 10. Headings: #, ##, ###, ####
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 tracking-tight pt-6 pb-2 border-b border-cyber-border">
              {parseInline(trimmed.replace("# ", ""))}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          const rawText = trimmed.replace("## ", "").trim();
          const cleanId = rawText
            .toLowerCase()
            .replace(/^\d+[\.\)]\s*/, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          return (
            <h2 id={cleanId} key={idx} className="scroll-mt-24 text-xl sm:text-2xl font-semibold font-mono text-zinc-100 tracking-tight pt-8 pb-2">
              {parseInline(rawText)}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          const rawText = trimmed.replace("### ", "").trim();
          const cleanId = rawText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          return (
            <h3 id={cleanId} key={idx} className="scroll-mt-24 text-lg sm:text-xl font-medium font-mono text-cyber-cyan tracking-tight pt-5">
              {parseInline(rawText)}
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

        // 13. Fallback for standalone ``` if unclosed
        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const firstLine = lines[0].replace("```", "").trim();
          const code = lines.slice(1).join("\n").replace(/```$/, "").trim();
          return <CodeBlock key={idx} code={code} lang={firstLine} />;
        }

        // 14. Standard Paragraph with inline formatting
        return (
          <p key={idx} className="text-base sm:text-[16px] text-zinc-300 leading-relaxed font-sans my-3">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
