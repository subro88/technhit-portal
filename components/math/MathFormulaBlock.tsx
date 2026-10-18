"use client";

import React, { useState, useMemo } from "react";
import katex from "katex";
import { Copy, Check, FunctionSquare } from "lucide-react";

interface MathFormulaBlockProps {
  formula: string;
  label?: string;
  displayMode?: boolean;
}

export default function MathFormulaBlock({
  formula,
  label = "Mathematical Formula",
  displayMode = true,
}: MathFormulaBlockProps) {
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
      });
    } catch (e) {
      return formula;
    }
  }, [formula, displayMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg bg-[var(--paper-white,#0d1117)] border border-[var(--ink-faint,#1f2937)] overflow-hidden shadow-md text-inherit transition-colors">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--ink-faint,#1f2937)] bg-[var(--paper-warm,rgba(0,0,0,0.4))]">
        <div className="flex items-center gap-2">
          <FunctionSquare className="w-3.5 h-3.5 text-[var(--orange,#FF7A33)]" />
          <span className="font-grotesk text-xs tracking-wider uppercase font-semibold text-[var(--ink,#e4e4e7)]">
            {label}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[var(--ink-faint,#374151)] bg-[var(--paper-white,#161b22)] hover:border-[var(--orange,#FF7A33)] text-[var(--ink-soft,#a1a1aa)] hover:text-[var(--orange,#FF7A33)] transition-colors cursor-pointer font-mono text-[11px]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[var(--green,#10B981)]" />
              <span className="text-[10px] text-[var(--green,#10B981)] font-bold">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px]">COPY LATEX</span>
            </>
          )}
        </button>
      </div>

      <div className="p-6 flex items-center justify-center text-center overflow-x-auto min-h-[70px]">
        <div
          className="katex-rendered text-lg sm:text-xl text-[var(--ink,#f4f4f5)] selection:bg-[var(--orange-soft,rgba(255,84,0,0.2))]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
