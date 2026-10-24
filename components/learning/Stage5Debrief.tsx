"use client";

import React, { useState } from "react";
import type { DebriefRule } from "@/lib/learning-generator";
import { awardOperativeXp, markStageComplete, playHapticSound } from "@/lib/operative-store";
import { CheckCircle2, ArrowRight, Stamp, AlertOctagon, Sparkles } from "lucide-react";

interface Stage5DebriefProps {
  slug: string;
  rules: DebriefRule[];
  onCompleteStage: () => void;
}

export function Stage5Debrief({ slug, rules, onCompleteStage }: Stage5DebriefProps) {
  const [stampedRules, setStampedRules] = useState<Record<string, boolean>>({});

  const handleStamp = (ruleId: string) => {
    if (stampedRules[ruleId]) return;
    playHapticSound("success");
    setStampedRules((prev) => ({ ...prev, [ruleId]: true }));
    awardOperativeXp(10, "Golden Rule Stamped");
  };

  const stampedCount = Object.keys(stampedRules).length;
  const allStamped = rules.length > 0 && stampedCount >= rules.length;

  const handleAdvance = () => {
    markStageComplete(slug, "debrief", 50);
    onCompleteStage();
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-[#FF5400] text-xl tracking-widest">STAGE 05</span>
          <span className="h-px w-8 bg-[#FF5400]/60" />
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-400">
            DEBRIEF &amp; CONSOLIDATION · GOLDEN RULES
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-zinc-100 tracking-wide leading-tight">
          STAMP PRODUCTION RULES INTO OPERATIONAL MEMORY
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl font-body leading-relaxed">
          Before taking the final technical exam, review and stamp the non-negotiable golden rules of deployment. Click each rule stamp to verify comprehension.
        </p>
      </div>

      {/* Progress Counter */}
      <div className="bg-[#0d1117] border border-zinc-800 p-4 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Stamp className="w-4 h-4 text-amber-500" />
          <span>RULES STAMPED:</span>
          <span className="font-bold text-amber-400">{stampedCount} / {rules.length}</span>
        </div>
        <div className="text-zinc-500 text-[11px]">
          STAMP ALL RULES TO UNLOCK FINAL CERTIFICATION EXAM
        </div>
      </div>

      {/* Rule Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {rules.map((item) => {
          const isStamped = !!stampedRules[item.id];

          return (
            <div
              key={item.id}
              className={`p-6 border transition-all notch-corner flex flex-col justify-between space-y-5 ${
                isStamped
                  ? "border-emerald-500/50 bg-emerald-950/20 shadow-lg"
                  : "border-zinc-800 bg-[#0d1117] hover:border-zinc-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-display text-2xl text-[#FF5400]">
                    RULE // {item.number}
                  </span>
                  {isStamped && (
                    <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>STAMPED</span>
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl sm:text-2xl text-zinc-100 leading-snug">
                  {item.title}
                </h3>

                <p className="text-zinc-300 text-xs sm:text-sm font-body leading-relaxed">
                  {item.rule}
                </p>

                {/* Anti-Pattern Warning */}
                <div className="bg-red-950/30 border border-red-500/20 p-3 rounded-sm flex items-start gap-2 font-mono text-[11px] text-red-300">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-400">AVOID ANTI-PATTERN:</span> {item.antiPattern}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80">
                <button
                  onClick={() => handleStamp(item.id)}
                  disabled={isStamped}
                  className={`w-full py-2.5 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isStamped
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default"
                      : "bg-zinc-900 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-black"
                  }`}
                >
                  <Stamp className="w-3.5 h-3.5" />
                  <span>{isStamped ? "RULE INTERNALIZED (+10 XP)" : "STAMP INTO MEMORY (+10 XP)"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advance Banner */}
      {allStamped && (
        <div className="p-6 bg-emerald-950/40 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slideUp">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 font-mono text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>ALL RULES STAMPED (+50 BONUS XP)</span>
            </div>
            <p className="text-zinc-400 text-xs font-mono">
              Ready for the final scenario exam and official badge certification.
            </p>
          </div>

          <button
            onClick={handleAdvance}
            className="pulse-cta bg-[#FF5400] hover:bg-amber-500 text-black font-display text-lg tracking-wider px-8 py-3.5 flex items-center gap-3 transition-colors shrink-0"
          >
            <span>ADVANCE TO FINAL EXAM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

export default Stage5Debrief;
