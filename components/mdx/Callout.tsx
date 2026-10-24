"use client";

import React from "react";
import {
  Info,
  AlertTriangle,
  Flame,
  Lightbulb,
  CheckCircle2,
  Terminal,
  Activity,
  LucideIcon,
} from "lucide-react";

export type CalloutType = "info" | "warning" | "danger" | "tip" | "success" | "benchmark";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const CALLOUT_CONFIG: Record<
  CalloutType,
  {
    border: string;
    bg: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    icon: LucideIcon;
    defaultTitle: string;
  }
> = {
  info: {
    border: "border-cyan-500/50 hover:border-cyan-400",
    bg: "bg-cyan-950/20",
    text: "text-cyan-400",
    badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
    badgeText: "NOTE //",
    icon: Info,
    defaultTitle: "System Advisory",
  },
  warning: {
    border: "border-amber-500/50 hover:border-amber-400",
    bg: "bg-amber-950/20",
    text: "text-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    badgeText: "CAUTION //",
    icon: AlertTriangle,
    defaultTitle: "Operational Warning",
  },
  danger: {
    border: "border-red-500/50 hover:border-red-400",
    bg: "bg-red-950/25",
    text: "text-red-400",
    badgeBg: "bg-red-500/15 border-red-500/30 text-red-300",
    badgeText: "CRITICAL //",
    icon: Flame,
    defaultTitle: "Breaking Hazard",
  },
  tip: {
    border: "border-emerald-500/50 hover:border-emerald-400",
    bg: "bg-emerald-950/20",
    text: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    badgeText: "PROTIP //",
    icon: Lightbulb,
    defaultTitle: "Kernel Optimization",
  },
  success: {
    border: "border-teal-500/50 hover:border-teal-400",
    bg: "bg-teal-950/20",
    text: "text-teal-400",
    badgeBg: "bg-teal-500/10 border-teal-500/30 text-teal-300",
    badgeText: "VERIFIED //",
    icon: CheckCircle2,
    defaultTitle: "Verification Complete",
  },
  benchmark: {
    border: "border-purple-500/50 hover:border-purple-400",
    bg: "bg-purple-950/20",
    text: "text-purple-400",
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    badgeText: "BENCHMARK //",
    icon: Activity,
    defaultTitle: "Performance Telemetry",
  },
};

export default function Callout({
  type = "info",
  title,
  children,
}: CalloutProps) {
  const config = CALLOUT_CONFIG[type] || CALLOUT_CONFIG.info;
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      className={`my-6 rounded-sm border-l-4 border ${config.border} ${config.bg} p-4 sm:p-5 transition-colors font-sans text-sm shadow-lg`}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <Icon className={`w-4 h-4 shrink-0 ${config.text}`} />
        <span
          className={`font-mono text-[10px] tracking-widest font-bold px-2 py-0.5 rounded-xs border ${config.badgeBg}`}
        >
          {config.badgeText}
        </span>
        <span className={`font-display text-sm uppercase tracking-wider font-bold ${config.text}`}>
          {displayTitle}
        </span>
      </div>
      <div className="text-zinc-300 leading-relaxed pl-6 text-[13px] sm:text-sm font-normal">
        {children}
      </div>
    </div>
  );
}
