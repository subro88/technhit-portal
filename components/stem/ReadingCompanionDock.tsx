"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/ThemeContext";
import { Compass, Terminal, ArrowUp, Minus, Plus } from "lucide-react";

export function ReadingCompanionDock() {
  const { theme, toggleTheme, isFieldGuide } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState(17);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(
          100,
          Math.max(0, Math.round((window.scrollY / totalHeight) * 100))
        );
        setScrollProgress(currentProgress);
        setIsVisible(window.scrollY > 300);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.min(22, Math.max(15, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.setProperty(
      "--article-font-size",
      `${newSize}px`
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Reading Controls and Progress"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--paper-white,#0d1117)]/95 backdrop-blur-md border border-[var(--ink-faint,#1f2937)] shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
    >
      {/* 1. Theme Switcher */}
      <button
        onClick={toggleTheme}
        aria-label={
          isFieldGuide
            ? "Switch to Cyber-Terminal Dark Theme"
            : "Switch to Visual Field Guide Drafting Theme"
        }
        title={
          isFieldGuide
            ? "Switch to Cyber-Terminal Dark Theme"
            : "Switch to Archimedean Field Guide Drafting Theme"
        }
        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[var(--paper-warm,#161b22)] text-[var(--ink,#f4f4f5)] border border-transparent hover:border-[var(--ink-faint,#374151)] transition-colors cursor-pointer group focus-visible:ring-2 focus-visible:ring-[var(--orange,#FF7A33)] outline-none"
      >
        {isFieldGuide ? (
          <Compass className="w-5 h-5 text-[var(--orange,#D75C2A)] group-hover:rotate-45 transition-transform duration-300" />
        ) : (
          <Terminal className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
        )}
      </button>

      <div className="w-[1px] h-6 bg-[var(--ink-trace,rgba(255,255,255,0.15))]" />

      {/* 2. Font Size Controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => adjustFontSize(-1)}
          disabled={fontSize <= 15}
          aria-label="Decrease font size"
          title="Decrease font size"
          className="w-9 h-11 flex items-center justify-center rounded-l-full hover:bg-[var(--paper-warm,#161b22)] disabled:opacity-30 disabled:cursor-not-allowed text-[var(--ink,#f4f4f5)] transition-colors cursor-pointer font-grotesk text-xs font-bold focus-visible:ring-2 focus-visible:ring-[var(--orange,#FF7A33)] outline-none"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span
          className="text-[11px] font-mono font-semibold text-[var(--ink-soft,#a1a1aa)] px-1 select-none min-w-[28px] text-center"
          title={`Body font size: ${fontSize}px`}
        >
          {fontSize}
        </span>

        <button
          onClick={() => adjustFontSize(1)}
          disabled={fontSize >= 22}
          aria-label="Increase font size"
          title="Increase font size"
          className="w-9 h-11 flex items-center justify-center rounded-r-full hover:bg-[var(--paper-warm,#161b22)] disabled:opacity-30 disabled:cursor-not-allowed text-[var(--ink,#f4f4f5)] transition-colors cursor-pointer font-grotesk text-xs font-bold focus-visible:ring-2 focus-visible:ring-[var(--orange,#FF7A33)] outline-none"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-[1px] h-6 bg-[var(--ink-trace,rgba(255,255,255,0.15))]" />

      {/* 3. Reading Progress & Back to Top */}
      <button
        onClick={scrollToTop}
        aria-label={`Scroll to top. You have read ${scrollProgress} percent of this article`}
        title={`Article read: ${scrollProgress}%. Click to jump back to top.`}
        className="h-11 px-3 flex items-center gap-1.5 rounded-full hover:bg-[var(--paper-warm,#161b22)] text-[var(--ink,#f4f4f5)] border border-transparent hover:border-[var(--ink-faint,#374151)] transition-colors cursor-pointer group focus-visible:ring-2 focus-visible:ring-[var(--orange,#FF7A33)] outline-none"
      >
        <span className="font-mono text-xs font-bold text-[var(--orange,#FF7A33)]">
          {scrollProgress}%
        </span>
        <ArrowUp className="w-3.5 h-3.5 text-[var(--ink-soft,#a1a1aa)] group-hover:text-[var(--orange,#FF7A33)] group-hover:-translate-y-0.5 transition-all" />
      </button>
    </aside>
  );
}
