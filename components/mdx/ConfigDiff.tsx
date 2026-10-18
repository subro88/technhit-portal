"use client";

import React, { useState } from "react";
import { Sliders, Copy, Check, FileDiff } from "lucide-react";

interface DiffLine {
  type: "add" | "delete" | "normal";
  content: string;
}

interface ConfigDiffProps {
  filename?: string;
  diffText: string;
}

export default function ConfigDiff({
  filename = "configuration.diff",
  diffText,
}: ConfigDiffProps) {
  const [copied, setCopied] = useState(false);

  const lines: DiffLine[] = diffText.split("\n").map((line) => {
    if (line.startsWith("+")) return { type: "add", content: line.slice(1) };
    if (line.startsWith("-")) return { type: "delete", content: line.slice(1) };
    return { type: "normal", content: line.startsWith(" ") ? line.slice(1) : line };
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(diffText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-xl bg-cyber-950 border border-cyber-border overflow-hidden shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-cyber-900 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <FileDiff className="w-3.5 h-3.5 text-cyber-purple" />
          <span className="text-zinc-200 font-semibold">{filename}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-cyber-800 hover:bg-cyber-750 text-zinc-300 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-cyber-emerald" />
              <span className="text-[10px] text-cyber-emerald">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-zinc-400" />
              <span className="text-[10px]">COPY DIFF</span>
            </>
          )}
        </button>
      </div>

      <div className="py-2 overflow-x-auto">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`px-4 py-0.5 flex items-start gap-3 ${
              line.type === "add"
                ? "bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500"
                : line.type === "delete"
                ? "bg-red-950/40 text-red-300 border-l-2 border-red-500"
                : "text-zinc-300"
            }`}
          >
            <span className="w-3 select-none text-zinc-500">
              {line.type === "add" ? "+" : line.type === "delete" ? "-" : " "}
            </span>
            <span className="whitespace-pre">{line.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
