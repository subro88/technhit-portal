"use client";

import React from "react";
import { Activity, TrendingUp, TrendingDown, Zap } from "lucide-react";

interface MetricCardProps {
  value: string;
  label: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  accent?: "amber" | "cyan" | "emerald" | "purple";
}

const ACCENT_MAP = {
  amber: "text-[#FF5400] border-amber-500/40 bg-amber-500/10",
  cyan: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
  emerald: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  purple: "text-purple-400 border-purple-500/40 bg-purple-500/10",
};

export default function MetricCard({
  value,
  label,
  delta,
  trend = "up",
  accent = "amber",
}: MetricCardProps) {
  const accentClasses = ACCENT_MAP[accent] || ACCENT_MAP.amber;

  return (
    <div className="rounded-sm bg-[#0d1117] border border-zinc-800 p-4 sm:p-5 flex flex-col justify-between shadow-xl hover:border-zinc-700 transition-colors not-prose">
      <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 mb-2">
        <span className="uppercase tracking-widest">{label}</span>
        <Activity className="w-3.5 h-3.5 text-zinc-600" />
      </div>

      <div className="font-display text-3xl sm:text-4xl text-zinc-100 tracking-tight my-1">
        {value}
      </div>

      {delta && (
        <div className="flex items-center gap-1.5 mt-2 font-mono text-xs">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs border text-[10px] font-bold ${accentClasses}`}
          >
            {trend === "up" && <TrendingUp className="w-3 h-3" />}
            {trend === "down" && <TrendingDown className="w-3 h-3" />}
            {trend === "neutral" && <Zap className="w-3 h-3" />}
            {delta}
          </span>
        </div>
      )}
    </div>
  );
}

export function MetricGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
      {children}
    </div>
  );
}
