"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeContext";
import { Terminal, Compass } from "lucide-react";

export function ThemeSwitcher() {
  const pathname = usePathname();
  const { theme, toggleTheme, isFieldGuide } = useTheme();

  const isMathRoute =
    pathname.startsWith("/stem-10-plus-2") ||
    pathname.startsWith("/visual-lab");

  // Keep header clean on standard Linux/homelab cluster pages
  if (!isMathRoute) return null;

  return (
    <button
      onClick={toggleTheme}
      title={
        isFieldGuide
          ? "Switch to Cyber-Terminal Dark Theme"
          : "Switch to Visual Field Guide Drafting Theme"
      }
      className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded border transition-all duration-200 cursor-pointer text-xs font-mono select-none ${
        isFieldGuide
          ? "bg-[#FAF5E8] border-[#0B2545] text-[#0B2545] hover:bg-[#EDE3C9] shadow-sm"
          : "bg-white/5 border-white/10 text-zinc-300 hover:border-amber-500/50 hover:text-amber-400"
      }`}
    >
      {isFieldGuide ? (
        <>
          <Compass className="w-3.5 h-3.5 text-[#D75C2A] group-hover:rotate-45 transition-transform" />
          <span className="font-semibold tracking-wider uppercase text-[11px]">
            FIELD GUIDE
          </span>
        </>
      ) : (
        <>
          <Terminal className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold tracking-wider uppercase text-[11px]">
            TERMINAL
          </span>
        </>
      )}
      <span
        className={`w-1.5 h-1.5 rounded-full ml-0.5 ${
          isFieldGuide ? "bg-[#2A7553]" : "bg-emerald-400"
        } animate-pulse`}
      />
    </button>
  );
}
