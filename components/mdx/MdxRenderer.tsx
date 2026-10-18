"use client";

import React from "react";
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

interface MdxRendererProps {
  content: string;
}

export default function MdxRenderer({ content }: MdxRendererProps) {
  // Strip YAML frontmatter if present
  const cleanBody = content.replace(/^---[\s\S]*?---/, "").trim();

  // Split into structural blocks (paragraphs, headers, custom XML tags, code blocks)
  const blocks = cleanBody.split(/\n{2,}/);

  return (
    <div className="prose max-w-none space-y-6 text-[var(--fg,#d4d4d8)] leading-relaxed">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // 1. TerminalBlock
        const termMatch = trimmed.match(/<TerminalBlock\s+([^>]+)\/>/);
        if (termMatch) {
          const attrs = termMatch[1];
          const cmd = (attrs.match(/command="([^"]+)"/) || [])[1] || "";
          const title = (attrs.match(/title="([^"]+)"/) || [])[1] || "Terminal";
          const os = (attrs.match(/os="([^"]+)"/) || [])[1] || "Linux";
          return <TerminalBlock key={idx} command={cmd} title={title} os={os} />;
        }

        // 2. YouTubeEmbed
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

        // 4a. CalculusFieldGuideHero
        if (trimmed.includes("<CalculusFieldGuideHero")) {
          return <CalculusFieldGuideHero key={idx} />;
        }

        // 4b. DerivativePlotter
        if (trimmed.includes("<DerivativePlotter")) {
          return <DerivativePlotter key={idx} />;
        }

        // 4c. RiemannSumVisualizer
        if (trimmed.includes("<RiemannSumVisualizer")) {
          return <RiemannSumVisualizer key={idx} />;
        }

        // 4d. EpsilonDeltaExplorer
        if (trimmed.includes("<EpsilonDeltaExplorer")) {
          return <EpsilonDeltaExplorer key={idx} />;
        }

        // 4e. ProofStepThrough
        const proofMatch = trimmed.match(/<ProofStepThrough(?:\s+title="([^"]+)")?\s*\/>/);
        if (proofMatch) {
          return <ProofStepThrough key={idx} title={proofMatch[1]} />;
        }

        // 4f. WorkedExampleCard
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

        // 7. Markdown Fenced Code Blocks
        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const lang = lines[0].replace("```", "").trim();
          const code = lines.slice(1, -1).join("\n");
          return (
            <div key={idx} className="my-5 rounded-xl bg-[#07090e] border border-[var(--ink-faint,#1f2937)] shadow-xl overflow-hidden font-mono text-xs">
              {lang && (
                <div className="px-4 py-1.5 bg-[#0d1117] border-b border-white/10 text-[10px] text-amber-400 font-semibold uppercase flex items-center justify-between">
                  <span>{lang}</span>
                  <span className="text-[9px] text-zinc-500 font-mono">EMBEDDED INSTRUMENT</span>
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-zinc-100 bg-[#07090e]">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // 8. Headings
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-2xl sm:text-3xl font-bold font-grotesk text-[var(--ink,#f4f4f5)] tracking-tight pt-4 border-b border-[var(--ink-faint,rgba(255,255,255,0.15))] pb-3 transition-colors">
              {trimmed.replace("# ", "")}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-semibold font-grotesk text-[var(--ink,#f4f4f5)] tracking-tight pt-3 transition-colors">
              {trimmed.replace("## ", "")}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-lg font-semibold font-grotesk text-[var(--orange,#00F5D4)] pt-2 transition-colors">
              {trimmed.replace("### ", "")}
            </h3>
          );
        }

        // 9. Standard Paragraph with inline bolding & code formatting
        return (
          <p key={idx} className="text-base sm:text-[17px] text-[var(--ink,#d4d4d8)] leading-[1.65] font-newsreader transition-colors">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
