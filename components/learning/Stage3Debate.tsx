"use client";

import React, { useState } from "react";
import type { DebateStatement } from "@/lib/learning-generator";
import { awardOperativeXp, markStageComplete, playHapticSound } from "@/lib/operative-store";
import { CheckCircle2, XCircle, ArrowRight, ShieldAlert, Sparkles, Scale } from "lucide-react";

interface Stage3DebateProps {
  slug: string;
  statements: DebateStatement[];
  onCompleteStage: () => void;
}

export function Stage3Debate({ slug, statements, onCompleteStage }: Stage3DebateProps) {
  const [userDecisions, setUserDecisions] = useState<Record<string, boolean>>({});
  const [awardedStatements, setAwardedStatements] = useState<Record<string, boolean>>({});

  const handleDecision = (statementId: string, choiceIsValid: boolean, actualIsValid: boolean) => {
    const isCorrect = choiceIsValid === actualIsValid;
    setUserDecisions((prev) => ({ ...prev, [statementId]: choiceIsValid }));

    if (!awardedStatements[statementId]) {
      setAwardedStatements((prev) => ({ ...prev, [statementId]: true }));
      if (isCorrect) {
        awardOperativeXp(20, "Architecture Judgment Correct");
        playHapticSound("success");
      } else {
        playHapticSound("error");
      }
    } else {
      playHapticSound("click");
    }
  };

  const answeredCount = Object.keys(userDecisions).length;
  const isAllAnswered = statements.length > 0 && answeredCount >= statements.length;

  const handleAdvance = () => {
    markStageComplete(slug, "debate", 50);
    onCompleteStage();
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-[#FF5400] text-xl tracking-widest">STAGE 03</span>
          <span className="h-px w-8 bg-[#FF5400]/60" />
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-400">
            PROS &amp; CONS · ARCHITECTURE JUDGMENT
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-zinc-100 tracking-wide leading-tight">
          JUDGE PRODUCTION PROPOSALS &amp; ANTI-PATTERNS
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl font-body leading-relaxed">
          Evaluate real-world engineering proposals below. Decide whether each recommendation represents a <span className="text-emerald-400 font-bold">Valid Production Pattern</span> or a <span className="text-red-400 font-bold">Flawed Anti-Pattern</span>.
        </p>
      </div>

      {/* Tally Bar */}
      <div className="bg-[#0d1117] border border-zinc-800 p-4 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Scale className="w-4 h-4 text-amber-500" />
          <span>STATEMENTS EVALUATED:</span>
          <span className="font-bold text-amber-400">{answeredCount} / {statements.length}</span>
        </div>
        <div className="text-zinc-500 text-[11px]">
          EARN 20 XP PER SOUND ARCHITECTURAL JUDGMENT
        </div>
      </div>

      {/* Statement Cards */}
      <div className="space-y-6">
        {statements.map((stmt, idx) => {
          const decision = userDecisions[stmt.id];
          const hasAnswered = decision !== undefined;
          const isCorrect = decision === stmt.isValid;

          return (
            <div
              key={stmt.id}
              className={`p-6 border transition-all notch-corner ${
                hasAnswered
                  ? isCorrect
                    ? "border-emerald-500/50 bg-emerald-950/20"
                    : "border-red-500/50 bg-red-950/20"
                  : "border-zinc-800 bg-[#0d1117] hover:border-zinc-700"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    <span className="text-[#FF5400] font-bold">SCENARIO {String(idx + 1).padStart(2, "0")}</span>
                    <span>•</span>
                    <span className="text-amber-400">{stmt.badgeTag}</span>
                    <span>•</span>
                    <span className="text-zinc-300 font-semibold">{stmt.scenario}</span>
                  </div>

                  <p className="text-zinc-200 text-sm sm:text-base font-body leading-relaxed">
                    &ldquo;{stmt.proposedAction}&rdquo;
                  </p>
                </div>

                {/* Decision Buttons */}
                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => handleDecision(stmt.id, true, stmt.isValid)}
                    className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      hasAnswered && decision === true
                        ? isCorrect
                          ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                          : "bg-red-500 text-white"
                        : "border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VALID</span>
                  </button>

                  <button
                    onClick={() => handleDecision(stmt.id, false, stmt.isValid)}
                    className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      hasAnswered && decision === false
                        ? isCorrect
                          ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                          : "bg-red-500 text-white"
                        : "border border-red-500/40 text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>FLAWED</span>
                  </button>
                </div>
              </div>

              {/* Reveal Explanation after Answer */}
              {hasAnswered && (
                <div className="mt-4 pt-4 border-t border-zinc-800/80 font-mono text-xs leading-relaxed animate-fadeIn">
                  <div className="flex items-start gap-2">
                    <span className={isCorrect ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      {isCorrect ? "✓ OPERATIVE JUDGMENT VERIFIED:" : "⚠ ARCHITECTURAL CORRECTION:"}
                    </span>
                    <span className="text-zinc-300 font-body">{stmt.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Advance Banner */}
      {isAllAnswered && (
        <div className="p-6 bg-emerald-950/40 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slideUp">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 font-mono text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>STAGE 03 DEBATE COMPLETE (+50 BONUS XP)</span>
            </div>
            <p className="text-zinc-400 text-xs font-mono">
              You have successfully audited all architectural propositions.
            </p>
          </div>

          <button
            onClick={handleAdvance}
            className="pulse-cta bg-[#FF5400] hover:bg-amber-500 text-black font-display text-lg tracking-wider px-8 py-3.5 flex items-center gap-3 transition-colors shrink-0"
          >
            <span>ADVANCE TO STAGE 04: FIELD TEST</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

export default Stage3Debate;
