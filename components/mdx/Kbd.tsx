"use client";

import React from "react";

interface KbdProps {
  children: React.ReactNode;
}

export default function Kbd({ children }: KbdProps) {
  return (
    <kbd className="inline-flex items-center justify-center font-mono text-[11px] font-semibold text-zinc-200 bg-[#161b22] border-b-2 border border-zinc-700/80 px-1.5 py-0.5 rounded-xs mx-0.5 shadow-xs uppercase tracking-wider select-none hover:border-amber-500/80 hover:text-amber-300 transition-colors">
      {children}
    </kbd>
  );
}
