"use client";

import React from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface StepProps {
  number?: string | number;
  title: string;
  badge?: string;
  children: React.ReactNode;
}

export function Step({ number, title, badge, children }: StepProps) {
  return (
    <div className="relative pl-9 sm:pl-11 pb-8 last:pb-2 group">
      {/* Vertical Track Connector */}
      <div className="absolute left-3.5 sm:left-4 top-8 bottom-0 w-px bg-zinc-800 group-last:hidden" />

      {/* Number Node Icon */}
      <div className="absolute left-0 top-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-[#0d1117] border border-amber-500/60 text-[#FF5400] flex items-center justify-center font-mono text-xs font-bold shadow-[0_0_10px_rgba(255,84,0,0.2)] group-hover:border-[#FF5400] group-hover:scale-105 transition-all">
        {number || "•"}
      </div>

      {/* Step Header */}
      <div className="flex flex-wrap items-center gap-2.5 mb-2">
        <h4 className="font-display text-base sm:text-lg tracking-wide uppercase text-zinc-100 group-hover:text-amber-400 transition-colors m-0">
          {title}
        </h4>
        {badge && (
          <span className="font-mono text-[10px] tracking-widest uppercase bg-zinc-900 border border-zinc-700/60 text-zinc-400 px-2 py-0.5 rounded-xs">
            {badge}
          </span>
        )}
      </div>

      {/* Step Content */}
      <div className="text-zinc-300 text-sm leading-relaxed font-sans space-y-3">
        {children}
      </div>
    </div>
  );
}

interface StepsProps {
  children: React.ReactNode;
}

export default function Steps({ children }: StepsProps) {
  return (
    <div className="my-8 rounded-sm bg-[#07090e]/60 border border-zinc-800/80 p-5 sm:p-7 shadow-xl">
      <div className="space-y-1">
        {React.Children.map(children, (child, idx) => {
          if (!React.isValidElement<StepProps>(child)) return child;
          // Inject number if not present
          const number = child.props.number ?? String(idx + 1).padStart(2, "0");
          return React.cloneElement(child, { number } as Partial<StepProps>);
        })}
      </div>
    </div>
  );
}
