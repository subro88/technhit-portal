"use client";

import React, { useState } from "react";
import { Terminal, Layers, FileDiff, Youtube, AlertCircle, Plus, FunctionSquare } from "lucide-react";

interface DiagramGeneratorProps {
  onInsertSnippet: (snippet: string) => void;
}

export default function DiagramGenerator({ onInsertSnippet }: DiagramGeneratorProps) {
  const [activeType, setActiveType] = useState<"terminal" | "diagram" | "diff" | "formula" | "info">("terminal");

  // Terminal fields
  const [termCommand, setTermCommand] = useState("docker compose up -d");
  const [termTitle, setTermTitle] = useState("Start Services");
  const [termOs, setTermOs] = useState("Ubuntu 24.04");

  // Diagram fields
  const [diagType, setDiagType] = useState("cluster");
  const [diagTitle, setDiagTitle] = useState("Cluster Ingress Mesh");

  // Formula fields
  const [formulaText, setFormulaText] = useState("f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}");
  const [formulaLabel, setFormulaLabel] = useState("Differential Rate");

  // Diff fields
  const [diffFile, setDiffFile] = useState("/etc/sysctl.d/99-security.conf");
  const [diffText, setDiffText] = useState("+net.ipv4.tcp_syncookies = 1\n-net.ipv4.tcp_syncookies = 0");

  const handleInsert = () => {
    let snippet = "";
    if (activeType === "terminal") {
      snippet = `\n<TerminalBlock command="${termCommand.replace(/"/g, '\\"')}" title="${termTitle.replace(/"/g, '\\"')}" os="${termOs}" />\n`;
    } else if (activeType === "diagram") {
      snippet = `\n<ArchitectureDiagram type="${diagType}" title="${diagTitle.replace(/"/g, '\\"')}" />\n`;
    } else if (activeType === "formula") {
      snippet = `\n<MathFormulaBlock formula="${formulaText.replace(/"/g, '\\"')}" label="${formulaLabel.replace(/"/g, '\\"')}" />\n`;
    } else if (activeType === "diff") {
      snippet = `\n<ConfigDiff filename="${diffFile}" diffText="${diffText.replace(/"/g, '\\"')}" />\n`;
    } else if (activeType === "info") {
      snippet = `\n<InfoBox title="Architecture Rule" type="note">\nVerify quorum quorum configuration before initiating rolling reboot.\n</InfoBox>\n`;
    }

    onInsertSnippet(snippet);
  };

  return (
    <div className="p-4 bg-cyber-900 border border-cyber-border rounded-xl shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-3">
        <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyber-cyan" />
          MDX COMPONENT GENERATOR
        </span>
        <button
          onClick={handleInsert}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyber-cyan text-cyber-950 font-bold hover:bg-cyan-300 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>INSERT</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
        {[
          { id: "terminal", label: "Terminal", icon: Terminal },
          { id: "diagram", label: "Diagram", icon: Layers },
          { id: "formula", label: "10+2 Math", icon: FunctionSquare },
          { id: "diff", label: "Diff", icon: FileDiff },
          { id: "info", label: "Callout", icon: AlertCircle },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id as any)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                activeType === t.id
                  ? "bg-cyber-800 text-cyber-cyan border border-cyber-cyan/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Form */}
      {activeType === "terminal" && (
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">COMMAND</label>
            <input
              type="text"
              value={termCommand}
              onChange={(e) => setTermCommand(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-cyan"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">TITLE</label>
              <input
                type="text"
                value={termTitle}
                onChange={(e) => setTermTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-cyan"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">OS / RUNTIME</label>
              <input
                type="text"
                value={termOs}
                onChange={(e) => setTermOs(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-cyan"
              />
            </div>
          </div>
        </div>
      )}

      {activeType === "diagram" && (
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">TOPOLOGY TYPE</label>
            <select
              value={diagType}
              onChange={(e) => setDiagType(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-cyan"
            >
              <option value="cluster">Cluster Ingress & Workers Mesh</option>
              <option value="network">Proxmox Corosync & Ceph Network</option>
              <option value="stem">10+2 Phase Space & Vector Trajectory</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">TITLE</label>
            <input
              type="text"
              value={diagTitle}
              onChange={(e) => setDiagTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-cyan"
            />
          </div>
        </div>
      )}

      {activeType === "formula" && (
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">LATEX / FORMULA STRING</label>
            <input
              type="text"
              value={formulaText}
              onChange={(e) => setFormulaText(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-cyber-950 border border-cyber-border text-cyber-amber focus:outline-none focus:border-cyber-amber"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">LABEL</label>
            <input
              type="text"
              value={formulaLabel}
              onChange={(e) => setFormulaLabel(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-amber"
            />
          </div>
        </div>
      )}

      {activeType === "diff" && (
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">CONFIG FILENAME</label>
            <input
              type="text"
              value={diffFile}
              onChange={(e) => setDiffFile(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-purple"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">DIFF CONTENT (+ added, - removed)</label>
            <textarea
              rows={3}
              value={diffText}
              onChange={(e) => setDiffText(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-purple"
            />
          </div>
        </div>
      )}
    </div>
  );
}
