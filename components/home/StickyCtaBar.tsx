"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export function StickyCtaBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 600px
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`sticky-cta ${isVisible ? "visible" : ""}`}>
      <div className="bg-black/95 backdrop-blur-md border-t border-amber-500/40 shadow-2xl py-3.5 px-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-amber-400 tracking-[0.2em]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>LAB ENGINES ONLINE</span>
            </div>
            <div>
              <div className="font-display text-lg sm:text-2xl text-zinc-100 leading-none">
                JOIN 14,200+ SYSTEMS ARCHITECTS
              </div>
              <div className="font-mono text-[10px] text-zinc-500 tracking-[0.15em] uppercase mt-0.5 hidden md:block">
                KERNEL TUNING · CEPH AUTOMATION · LOCAL vLLM · 10+2 MATH
              </div>
            </div>
          </div>

          <Link
            href="#syndicate"
            className="pulse-btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-6 py-2.5 font-heading text-xs tracking-[0.2em] uppercase font-bold transition-all flex items-center gap-2.5 whitespace-nowrap shadow-md"
          >
            <span>JOIN SYNDICATE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
export default StickyCtaBar;
