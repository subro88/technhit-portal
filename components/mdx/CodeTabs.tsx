"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, FileCode } from "lucide-react";

export interface CodeTabItem {
  label: string;
  lang?: string;
  code: string;
  filename?: string;
}

interface CodeTabsProps {
  tabs: CodeTabItem[];
  defaultTab?: number;
}

export default function CodeTabs({ tabs, defaultTab = 0 }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copied, setCopied] = useState(false);

  if (!tabs || tabs.length === 0) return null;

  const current = tabs[activeTab] || tabs[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-sm bg-[#07090e] border border-zinc-800 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Tab Navigation Header */}
      <div className="bg-[#0d1117] border-b border-zinc-800 flex items-center justify-between px-2 pt-1.5 overflow-x-auto">
        <div className="flex items-center gap-1">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs transition-all border-b-2 -mb-px rounded-t-xs ${
                  isActive
                    ? "bg-[#07090e] text-[#FF5400] border-[#FF5400] font-bold"
                    : "text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900/60"
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${isActive ? "text-[#FF5400]" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pr-2 pb-1.5">
          {current.filename && (
            <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
              {current.filename}
            </span>
          )}
          <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 border border-cyan-800/40 rounded-xs">
            {current.lang || "SHELL"}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-[11px] transition-all"
            title="Copy snippet"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-sans">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-sans">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <pre className="p-4 sm:p-5 overflow-x-auto text-zinc-100 bg-[#07090e] leading-relaxed">
        <code>{current.code}</code>
      </pre>
    </div>
  );
}
