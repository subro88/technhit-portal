"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Eye } from "lucide-react";

interface WorkedExampleCardProps {
  tag: string;
  categoryType?: "deriv" | "integ" | "lim";
  title: string;
  problemStatement: string;
  hints: string[];
  answer: string;
}

export default function WorkedExampleCard({
  tag,
  categoryType = "deriv",
  title,
  problemStatement,
  hints,
  answer,
}: WorkedExampleCardProps) {
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [answerShown, setAnswerShown] = useState<boolean>(false);

  const getTagColor = () => {
    switch (categoryType) {
      case "deriv":
        return "border-[var(--orange,#FF7A33)] text-[var(--orange,#FF7A33)]";
      case "integ":
        return "border-[var(--green,#10B981)] text-[var(--green,#10B981)]";
      case "lim":
      default:
        return "border-[var(--ink,#71717a)] text-[var(--ink,#e4e4e7)]";
    }
  };

  const getDotColor = () => {
    switch (categoryType) {
      case "deriv":
        return "bg-[var(--orange,#FF7A33)]";
      case "integ":
        return "bg-[var(--green,#10B981)]";
      case "lim":
      default:
        return "bg-[var(--ink,#71717a)]";
    }
  };

  const revealNextHint = () => {
    if (hintsRevealed < hints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--ink,#1f2937)] bg-[var(--paper-white,#0d1117)] p-6 shadow-lg hover:border-[var(--orange,#FF7A33)] transition-colors flex flex-col justify-between">
      <div>
        {/* Category Tag */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-grotesk tracking-widest uppercase font-semibold mb-3 ${getTagColor()}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
          <span>{tag}</span>
        </div>

        {/* Title */}
        <h4 className="font-grotesk text-xl font-bold text-[var(--ink,#f4f4f5)] mb-2">
          {title}
        </h4>

        {/* Statement */}
        <p className="font-newsreader text-sm sm:text-base text-[var(--ink-2,#d4d4d8)] leading-relaxed mb-4">
          {problemStatement}
        </p>

        {/* Progressive Hints Container */}
        {hintsRevealed > 0 && (
          <div className="space-y-2 border-t border-dashed border-[var(--ink-faint,#1f2937)] pt-3 mb-4">
            {hints.slice(0, hintsRevealed).map((hint, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-[var(--paper-warm,rgba(0,0,0,0.3))] text-xs font-mono text-[var(--ink,#e4e4e7)] animate-in fade-in slide-in-from-top-1 duration-200 border-l-2 border-[var(--orange,#FF7A33)]"
              >
                <span className="font-bold text-[var(--orange,#FF7A33)] mr-2">
                  HINT {String(idx + 1).padStart(2, "0")}:
                </span>
                <span>{hint}</span>
              </div>
            ))}
          </div>
        )}

        {/* Answer Revealed */}
        {answerShown && (
          <div className="p-3 rounded bg-[var(--ink,#050811)] text-[var(--paper,#f4f4f5)] font-mono text-xs sm:text-sm border border-[var(--green,#10B981)] animate-in zoom-in-95 duration-200 mb-4">
            <span className="font-bold text-[var(--green,#10B981)] mr-2">
              SOLUTION:
            </span>
            <span>{answer}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-[var(--ink-trace,#1f2937)] flex items-center justify-between gap-3">
        <button
          onClick={revealNextHint}
          disabled={hintsRevealed >= hints.length}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-grotesk tracking-wider uppercase font-semibold border transition-colors cursor-pointer ${
            hintsRevealed >= hints.length
              ? "border-[var(--ink-faint,#374151)] text-[var(--ink-soft,#71717a)] opacity-60 cursor-not-allowed"
              : "border-[var(--orange,#FF7A33)] text-[var(--orange,#FF7A33)] hover:bg-[var(--orange,#FF7A33)] hover:text-white"
          }`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
          <span>
            {hintsRevealed >= hints.length
              ? "All Hints Revealed"
              : `Reveal Hint (${hintsRevealed}/${hints.length})`}
          </span>
        </button>

        <button
          onClick={() => setAnswerShown(!answerShown)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-grotesk tracking-wider uppercase font-semibold border transition-colors cursor-pointer ${
            answerShown
              ? "border-[var(--green,#10B981)] bg-[var(--green,#10B981)] text-white"
              : "border-[var(--ink-faint,#374151)] text-[var(--ink-soft,#a1a1aa)] hover:border-[var(--ink,#f4f4f5)] hover:text-[var(--ink,#f4f4f5)]"
          }`}
        >
          {answerShown ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Answer Revealed</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Show Answer</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
