"use client";

import React, { useState, useEffect } from "react";
import katex from "katex";
import { ArrowRight, RotateCcw, CheckCircle } from "lucide-react";

interface ProofStep {
  title: string;
  latex: string;
  explanation?: string;
}

const DEFAULT_PROOF: ProofStep[] = [
  {
    title: "01 · First Principles Limit Definition",
    latex: "\\frac{d}{dx}[\\sin x] = \\lim_{h \\to 0} \\frac{\\sin(x+h) - \\sin x}{h}",
    explanation: "Begin directly from the definition of the derivative as the limit of the difference quotient.",
  },
  {
    title: "02 · Angle-Addition Trigonometric Expansion",
    latex: "\\sin(x + h) = \\sin x \\cos h + \\cos x \\sin h",
    explanation: "Apply the angle addition identity to unpack the perturbed function term.",
  },
  {
    title: "03 · Grouping into Canonical Limits",
    latex: "\\frac{d}{dx}[\\sin x] = \\cos x \\cdot \\lim_{h\\to 0}\\frac{\\sin h}{h} - \\sin x \\cdot \\lim_{h\\to 0}\\frac{1 - \\cos h}{h}",
    explanation: "Isolate the terms independent of h (cos x and sin x) outside the limit operators.",
  },
  {
    title: "04 · Classical Limits Evaluation",
    latex: "\\lim_{h \\to 0} \\frac{\\sin h}{h} = 1 \\quad \\text{and} \\quad \\lim_{h \\to 0} \\frac{1 - \\cos h}{h} = 0",
    explanation: "Evaluate the two fundamental limits geometrically derived from the unit circle.",
  },
  {
    title: "05 · Rigorous Synthesis",
    latex: "\\boxed{\\frac{d}{dx}[\\sin x] = \\cos x} \\quad \\blacksquare",
    explanation: "Multiply and simplify: cos(x) · 1 - sin(x) · 0 = cos(x). The derivative of sine is cosine.",
  },
];

interface ProofStepThroughProps {
  title?: string;
  steps?: ProofStep[];
}

export default function ProofStepThrough({
  title = "The derivative of sin(x) is cos(x)",
  steps = DEFAULT_PROOF,
}: ProofStepThroughProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const advance = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const reset = () => {
    setCurrentStep(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "n" || e.key === "N") {
        advance();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const progressPct = (currentStep / steps.length) * 100;
  const isComplete = currentStep >= steps.length;

  return (
    <div className="my-10 max-w-4xl mx-auto rounded-xl border border-[var(--ink,#1f2937)] bg-[var(--paper-white,#0d1117)] p-6 sm:p-8 shadow-xl transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--ink-faint,#1f2937)]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[var(--orange,#FF7A33)] text-[var(--orange,#FF7A33)] text-[10px] font-grotesk tracking-widest uppercase font-semibold mb-2">
            Step-Through Proof
          </span>
          <h3 className="font-grotesk text-xl sm:text-2xl font-bold text-[var(--ink,#f4f4f5)]">
            {title}
          </h3>
        </div>

        <div className="font-mono text-xs text-[var(--ink-soft,#a1a1aa)]">
          Step <span className="text-[var(--orange,#FF7A33)] font-bold">{currentStep}</span> of {steps.length}
        </div>
      </div>

      {/* Proof Steps Container */}
      <div className="space-y-4 min-h-[220px]">
        {steps.slice(0, currentStep).map((step, idx) => {
          let formulaHtml = "";
          try {
            formulaHtml = katex.renderToString(step.latex, {
              displayMode: true,
              throwOnError: false,
            });
          } catch (e) {
            formulaHtml = step.latex;
          }

          return (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[var(--paper-warm,rgba(0,0,0,0.3))] border border-[var(--ink-trace,#1f2937)] transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-xs font-bold text-[var(--orange,#FF7A33)] tracking-wider">
                  {step.title}
                </span>
              </div>

              <div
                className="py-2 overflow-x-auto text-center text-[var(--ink,#f4f4f5)] text-base sm:text-lg"
                dangerouslySetInnerHTML={{ __html: formulaHtml }}
              />

              {step.explanation && (
                <p className="mt-2 text-xs sm:text-sm font-newsreader italic text-[var(--ink-2,#a1a1aa)] leading-relaxed">
                  {step.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar & Actions */}
      <div className="mt-8 pt-4 border-t border-[var(--ink-faint,#1f2937)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-1/2">
          <div className="w-full h-1.5 bg-[var(--ink-trace,#1f2937)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--orange,#FF7A33)] transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[var(--ink-soft,#71717a)] mt-1 block">
            Press 'N' key or click next to step forward
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--ink-faint,#374151)] text-xs font-grotesk uppercase tracking-wider text-[var(--ink-soft,#a1a1aa)] hover:text-[var(--ink,#f4f4f5)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={advance}
            disabled={isComplete}
            className={`flex items-center gap-2 px-5 py-2 rounded text-xs font-grotesk uppercase tracking-widest font-bold transition-all shadow-md cursor-pointer ${
              isComplete
                ? "bg-[var(--green,#10B981)] text-white opacity-90 cursor-default"
                : "bg-[var(--orange,#FF7A33)] hover:bg-[var(--orange-bright,#ff9800)] text-white"
            }`}
          >
            {isComplete ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Proof Complete ∎</span>
              </>
            ) : (
              <>
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
