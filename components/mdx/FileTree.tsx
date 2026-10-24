"use client";

import React, { useState } from "react";
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown, FileText } from "lucide-react";

export interface FileTreeItem {
  name: string;
  type?: "file" | "folder";
  highlight?: boolean;
  comment?: string;
  children?: FileTreeItem[];
}

interface FileTreeProps {
  title?: string;
  rootPath?: string;
  items: FileTreeItem[];
}

function TreeNode({ item, depth = 0 }: { item: FileTreeItem; depth?: number }) {
  const isFolder = item.type === "folder" || (item.children && item.children.length > 0);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="font-mono text-xs select-none">
      <div
        onClick={() => isFolder && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${depth * 18}px` }}
        className={`flex items-center gap-2 py-1 px-2 rounded-xs transition-colors ${
          isFolder ? "cursor-pointer hover:bg-zinc-900/80" : "hover:bg-zinc-900/50"
        } ${item.highlight ? "bg-amber-500/10 text-amber-300 font-bold border-l-2 border-[#FF5400]" : "text-zinc-300"}`}
      >
        {isFolder ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-500/80 shrink-0" />
            )}
            <span className="font-semibold tracking-wide text-zinc-200">{item.name}</span>
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            <FileCode className={`w-3.5 h-3.5 shrink-0 ${item.highlight ? "text-[#FF5400]" : "text-cyan-400/80"}`} />
            <span className={item.highlight ? "text-amber-300" : "text-zinc-300"}>{item.name}</span>
          </>
        )}

        {item.comment && (
          <span className="ml-auto text-[10px] text-zinc-500 font-mono tracking-wide truncate pl-2">
            // {item.comment}
          </span>
        )}
      </div>

      {isFolder && isOpen && item.children && (
        <div className="relative">
          {/* Subtle vertical guide line */}
          <div
            style={{ left: `${depth * 18 + 14}px` }}
            className="absolute top-0 bottom-1 w-px bg-zinc-800/80"
          />
          {item.children.map((child, idx) => (
            <TreeNode key={idx} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({
  title = "DIRECTORY STRUCTURE",
  rootPath = "/etc/systemd/system/",
  items,
}: FileTreeProps) {
  return (
    <div className="my-6 rounded-sm bg-[#07090e] border border-zinc-800 shadow-2xl overflow-hidden not-prose">
      {/* Header */}
      <div className="bg-[#0d1117] border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5400]" />
          <span className="font-display uppercase text-zinc-200 tracking-wider text-xs font-bold">
            {title}
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
          PATH: <strong className="text-cyan-400">{rootPath}</strong>
        </span>
      </div>

      {/* Tree Content */}
      <div className="p-3 sm:p-4 bg-[#07090e] space-y-0.5">
        {items.map((item, idx) => (
          <TreeNode key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}
