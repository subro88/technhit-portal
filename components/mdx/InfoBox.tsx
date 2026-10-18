"use client";

import React from "react";
import { AlertCircle, Info, AlertTriangle, ShieldCheck } from "lucide-react";

interface InfoBoxProps {
  title?: string;
  type?: "note" | "warning" | "success" | "danger";
  children: React.ReactNode;
}

export default function InfoBox({
  title = "Notice",
  type = "note",
  children,
}: InfoBoxProps) {
  const getStyles = () => {
    switch (type) {
      case "warning":
        return {
          border: "border-cyber-amber/50",
          bg: "bg-cyber-amber/10",
          titleColor: "text-cyber-amber",
          icon: <AlertTriangle className="w-4 h-4 text-cyber-amber shrink-0" />,
        };
      case "success":
        return {
          border: "border-cyber-emerald/50",
          bg: "bg-cyber-emerald/10",
          titleColor: "text-cyber-emerald",
          icon: <ShieldCheck className="w-4 h-4 text-cyber-emerald shrink-0" />,
        };
      case "danger":
        return {
          border: "border-red-500/50",
          bg: "bg-red-500/10",
          titleColor: "text-red-400",
          icon: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
        };
      case "note":
      default:
        return {
          border: "border-cyber-cyan/50",
          bg: "bg-cyber-cyan/10",
          titleColor: "text-cyber-cyan",
          icon: <Info className="w-4 h-4 text-cyber-cyan shrink-0" />,
        };
    }
  };

  const style = getStyles();

  return (
    <div className={`my-5 p-4 rounded-xl border ${style.border} ${style.bg} backdrop-blur-sm transition-colors`}>
      <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold">
        {style.icon}
        <span className={style.titleColor}>{title}</span>
      </div>
      <div className="text-xs text-[var(--ink,#d4d4d8)] leading-relaxed font-sans">{children}</div>
    </div>
  );
}
