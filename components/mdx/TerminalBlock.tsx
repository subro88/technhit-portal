"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

interface TerminalBlockProps {
  command: string;
  title?: string;
  os?: string;
}

export default function TerminalBlock({
  command,
  title = "Terminal Command",
  os = "Linux",
}: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-xl bg-cyber-950 border border-cyber-border overflow-hidden shadow-xl font-mono text-xs">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cyber-900 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          {/* Mac/Terminal control dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>

          <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
          <span className="text-zinc-200 font-semibold">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyber-800 text-zinc-400 text-[10px] border border-cyber-border/60">
            {os}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-cyber-800 hover:bg-cyber-750 text-zinc-300 transition-colors cursor-pointer"
            aria-label="Copy command"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-cyber-emerald" />
                <span className="text-[10px] text-cyber-emerald">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span className="text-[10px]">COPY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Command Line */}
      <div className="p-4 overflow-x-auto text-zinc-200 flex items-start gap-3">
        <span className="text-cyber-cyan select-none">$</span>
        <code className="text-zinc-100 whitespace-pre">{command}</code>
      </div>
    </div>
  );
}
