"use client";

import React, { useState, useRef } from "react";

interface MathTermPopoverProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
}

export default function MathTermPopover({
  term,
  definition,
  children,
}: MathTermPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={triggerRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="math-term relative inline-block cursor-help transition-colors font-medium border-b border-dashed border-[var(--ink-faint,#6b7280)] hover:border-[var(--orange,#FF7A33)] hover:text-[var(--orange,#FF7A33)]"
    >
      {children || term}

      {isOpen && (
        <span
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[var(--ink,#090d16)] text-[var(--paper,#f4f4f5)] text-xs rounded shadow-2xl border border-[var(--ink-soft,rgba(255,255,255,0.1))] pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95"
        >
          <strong className="block font-grotesk text-[10px] tracking-widest uppercase text-[var(--orange-bright,#FF7A33)] mb-1">
            Definition: {term}
          </strong>
          <span className="font-newsreader italic leading-snug block">
            {definition}
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--ink,#090d16)]" />
        </span>
      )}
    </span>
  );
}
