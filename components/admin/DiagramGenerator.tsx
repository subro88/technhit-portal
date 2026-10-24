"use client";

import React, { useState } from "react";
import {
  Terminal,
  Layers,
  FileDiff,
  AlertCircle,
  Plus,
  FunctionSquare,
  Code2,
  ListOrdered,
  FolderTree,
  Bookmark as BookmarkIcon,
  Activity,
  Image as ImageIcon,
  Keyboard,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import Link from "next/link";

interface DiagramGeneratorProps {
  onInsertSnippet: (snippet: string) => void;
}

type ComponentType =
  | "callout"
  | "codetabs"
  | "steps"
  | "filetree"
  | "bookmark"
  | "metric"
  | "terminal"
  | "diagram"
  | "diff"
  | "formula"
  | "lightbox"
  | "kbd";

export default function DiagramGenerator({ onInsertSnippet }: DiagramGeneratorProps) {
  const [activeType, setActiveType] = useState<ComponentType>("callout");
  const [copied, setCopied] = useState(false);

  // 1. Callout fields
  const [calloutType, setCalloutType] = useState<"info" | "warning" | "danger" | "tip" | "success" | "benchmark">("benchmark");
  const [calloutTitle, setCalloutTitle] = useState("KVM NUMA Node Pinning Mandate");
  const [calloutText, setCalloutText] = useState("Direct core affinity prevents L3 cache thrashing across dual-socket EPYC sockets.");

  // 2. CodeTabs fields
  const [tab1Filename, setTab1Filename] = useState("docker-compose.yml");
  const [tab1Lang, setTab1Lang] = useState("yaml");
  const [tab1Code, setTab1Code] = useState("version: '3.8'\nservices:\n  vllm:\n    image: vllm/vllm-openai:latest\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - capabilities: [gpu]");
  const [tab2Filename, setTab2Filename] = useState(".env.cluster");
  const [tab2Lang, setTab2Lang] = useState("bash");
  const [tab2Code, setTab2Code] = useState("VLLM_API_KEY=sk-prod-internal-9902\nMODEL=Qwen/Qwen2.5-Coder-32B-Instruct\nTENSOR_PARALLEL_SIZE=2");

  // 3. Steps fields
  const [step1Title, setStep1Title] = useState("Kernel Hugepages Allocation");
  const [step1Badge, setStep1Badge] = useState("HOST OS");
  const [step1Content, setStep1Content] = useState("Configure 2MB transparent hugepages in `/etc/default/grub` to optimize memory page table lookups.");
  const [step2Title, setStep2Title] = useState("Configure ROCm / CUDA Device Mapping");
  const [step2Badge, setStep2Badge] = useState("DRIVER");
  const [step2Content, setStep2Content] = useState("Verify CDI configuration file `/etc/cdi/nvidia.yaml` to mount tensor cores without host collisions.");

  // 4. FileTree fields
  const [treeContent, setTreeContent] = useState(
`- /etc/apache2/
  - sites-available/
    - 000-default.conf
    - app-php81.conf (highlight) // Proxies to PHP 8.1 FPM
    - app-php83.conf // Dedicated modern backend
  - mods-enabled/
    - proxy.load
    - proxy_fcgi.load (highlight)
  - ports.conf`
  );

  // 5. Bookmark fields
  const [bmTitle, setBmTitle] = useState("vLLM Distributed Serving Architecture");
  const [bmUrl, setBmUrl] = useState("https://docs.vllm.ai/en/latest/serving/distributed_serving.html");
  const [bmDesc, setBmDesc] = useState("Official high-throughput and memory-efficient LLM inference engine documentation.");
  const [bmSource, setBmSource] = useState("Official Docs");

  // 6. Metric fields
  const [metricLabel, setMetricLabel] = useState("P99 Inference Latency");
  const [metricValue, setMetricValue] = useState("48.2 ms");
  const [metricDelta, setMetricDelta] = useState("-62% vs Native");
  const [metricTrend, setMetricTrend] = useState<"up" | "down" | "neutral">("down");
  const [metricAccent, setMetricAccent] = useState<"amber" | "cyan" | "emerald" | "purple">("cyan");

  // 7. Terminal fields
  const [termCommand, setTermCommand] = useState("docker compose up -d --scale worker=4");
  const [termTitle, setTermTitle] = useState("Cluster Mesh Bootstrap");
  const [termOs, setTermOs] = useState("Ubuntu 24.04 LTS");

  // 8. Diagram fields
  const [diagType, setDiagType] = useState("cluster");
  const [diagTitle, setDiagTitle] = useState("Cluster Ingress & Workers Mesh");

  // 9. Diff fields
  const [diffFile, setDiffFile] = useState("/etc/sysctl.d/99-security.conf");
  const [diffText, setDiffText] = useState("+net.ipv4.tcp_syncookies = 1\n-net.ipv4.tcp_syncookies = 0\n+net.ipv4.tcp_max_syn_backlog = 8192");

  // 10. Formula fields
  const [formulaText, setFormulaText] = useState("f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}");
  const [formulaLabel, setFormulaLabel] = useState("Instantaneous Rate of Change");

  // 11. Lightbox fields
  const [mediaSrc, setMediaSrc] = useState("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80");
  const [mediaAlt, setMediaAlt] = useState("Server Rack High Density Layout");
  const [mediaCaption, setMediaCaption] = useState("Fig 2.1 — High density 42U rack telemetry configuration with dual redundant PSUs.");

  // 12. Kbd fields
  const [kbdKeys, setKbdKeys] = useState("Ctrl + Shift + P");

  // Generate Current Snippet
  const getGeneratedSnippet = (): string => {
    switch (activeType) {
      case "callout":
        return `\n<Callout type="${calloutType}" title="${calloutTitle}">\n${calloutText}\n</Callout>\n`;

      case "codetabs":
        return `\n<CodeTabs>\n<Tab filename="${tab1Filename}" language="${tab1Lang}">\n\`\`\`${tab1Lang}\n${tab1Code}\n\`\`\`\n</Tab>\n<Tab filename="${tab2Filename}" language="${tab2Lang}">\n\`\`\`${tab2Lang}\n${tab2Code}\n\`\`\`\n</Tab>\n</CodeTabs>\n`;

      case "steps":
        return `\n<Steps>\n<Step title="${step1Title}" badge="${step1Badge}">\n${step1Content}\n</Step>\n<Step title="${step2Title}" badge="${step2Badge}">\n${step2Content}\n</Step>\n</Steps>\n`;

      case "filetree":
        return `\n<FileTree>\n${treeContent}\n</FileTree>\n`;

      case "bookmark":
        return `\n<Bookmark\n  title="${bmTitle}"\n  url="${bmUrl}"\n  description="${bmDesc}"\n  source="${bmSource}"\n/>\n`;

      case "metric":
        return `\n<MetricGrid>\n  <MetricCard\n    label="${metricLabel}"\n    value="${metricValue}"\n    delta="${metricDelta}"\n    trend="${metricTrend}"\n    accent="${metricAccent}"\n  />\n</MetricGrid>\n`;

      case "terminal":
        return `\n<TerminalBlock command="${termCommand.replace(/"/g, '\\"')}" title="${termTitle.replace(/"/g, '\\"')}" os="${termOs}" />\n`;

      case "diagram":
        return `\n<ArchitectureDiagram type="${diagType}" title="${diagTitle.replace(/"/g, '\\"')}" />\n`;

      case "diff":
        return `\n<ConfigDiff filename="${diffFile}" diffText="${diffText.replace(/"/g, '\\"')}" />\n`;

      case "formula":
        return `\n<MathFormulaBlock formula="${formulaText.replace(/"/g, '\\"')}" label="${formulaLabel.replace(/"/g, '\\"')}" />\n`;

      case "lightbox":
        return `\n<MediaLightbox\n  src="${mediaSrc}"\n  alt="${mediaAlt}"\n  caption="${mediaCaption}"\n/>\n`;

      case "kbd":
        return kbdKeys
          .split("+")
          .map((k) => `<Kbd>${k.trim()}</Kbd>`)
          .join(" + ");

      default:
        return "";
    }
  };

  const handleInsert = () => {
    const snippet = getGeneratedSnippet();
    onInsertSnippet(snippet);
  };

  const handleCopySnippet = () => {
    const snippet = getGeneratedSnippet();
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const componentsList: { id: ComponentType; label: string; icon: React.ElementType; tag: string }[] = [
    { id: "callout", label: "Callout", icon: AlertCircle, tag: "ALERT" },
    { id: "codetabs", label: "CodeTabs", icon: Code2, tag: "MULTI-FILE" },
    { id: "steps", label: "Steps", icon: ListOrdered, tag: "TIMELINE" },
    { id: "filetree", label: "FileTree", icon: FolderTree, tag: "DIRECTORY" },
    { id: "bookmark", label: "Bookmark", icon: BookmarkIcon, tag: "LINK CARD" },
    { id: "metric", label: "MetricCard", icon: Activity, tag: "TELEMETRY" },
    { id: "terminal", label: "Terminal", icon: Terminal, tag: "CLI" },
    { id: "diagram", label: "Diagram", icon: Layers, tag: "MESH" },
    { id: "diff", label: "Diff", icon: FileDiff, tag: "PATCH" },
    { id: "formula", label: "10+2 Math", icon: FunctionSquare, tag: "KATEX" },
    { id: "lightbox", label: "Lightbox", icon: ImageIcon, tag: "ZOOM" },
    { id: "kbd", label: "Keycap", icon: Keyboard, tag: "SHORTCUT" },
  ];

  return (
    <div className="p-4 sm:p-5 bg-cyber-900 border border-cyber-border rounded-xl shadow-2xl font-mono text-xs">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyber-border mb-3.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyber-cyan" />
          <span className="font-bold text-zinc-100 tracking-wider text-xs sm:text-sm">
            MDX COMPONENT GENERATOR
          </span>
          <span className="px-2 py-0.5 rounded-xs bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400">
            12 COMPONENTS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/mdx-generator"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 border border-zinc-700 transition-colors text-[11px]"
            title="Open dedicated full-screen MDX visual studio in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>FULL STUDIO</span>
          </Link>

          <button
            onClick={handleCopySnippet}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors text-[11px] cursor-pointer"
            title="Copy MDX snippet to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "COPIED" : "COPY"}</span>
          </button>

          <button
            onClick={handleInsert}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyber-cyan text-cyber-950 font-bold hover:bg-cyan-300 transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.3)] text-[11px]"
          >
            <Plus className="w-4 h-4" />
            <span>INSERT SNIPPET</span>
          </button>
        </div>
      </div>

      {/* Component Tabs Bar */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-zinc-700">
        {componentsList.map((item) => {
          const Icon = item.icon;
          const isActive = activeType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveType(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-zinc-800 text-cyber-cyan border border-cyber-cyan/50 shadow-[0_0_10px_rgba(0,245,212,0.15)]"
                  : "bg-cyber-950/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Form Body */}
      <div className="bg-cyber-950 border border-zinc-800 rounded-lg p-3.5 sm:p-4 mb-3.5">
        {/* 1. Callout */}
        {activeType === "callout" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">CALLOUT VARIANT</label>
                <select
                  value={calloutType}
                  onChange={(e) => setCalloutType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="benchmark">Benchmark (Purple)</option>
                  <option value="tip">Tip / Performance (Amber)</option>
                  <option value="info">Info / Architecture (Cyan)</option>
                  <option value="success">Success / Verified (Emerald)</option>
                  <option value="warning">Warning / Caution (Orange)</option>
                  <option value="danger">Danger / Critical (Rose)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">HEADER TITLE</label>
                <input
                  type="text"
                  value={calloutTitle}
                  onChange={(e) => setCalloutTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyber-cyan"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">MESSAGE / DIRECTIVE</label>
              <textarea
                rows={2}
                value={calloutText}
                onChange={(e) => setCalloutText(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyber-cyan"
              />
            </div>
          </div>
        )}

        {/* 2. CodeTabs */}
        {activeType === "codetabs" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 border border-zinc-800 p-2.5 rounded bg-zinc-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyber-cyan">TAB 1</span>
                  <input
                    type="text"
                    value={tab1Lang}
                    onChange={(e) => setTab1Lang(e.target.value)}
                    placeholder="Lang (e.g. yaml)"
                    className="w-20 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]"
                  />
                </div>
                <input
                  type="text"
                  value={tab1Filename}
                  onChange={(e) => setTab1Filename(e.target.value)}
                  placeholder="Filename"
                  className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                />
                <textarea
                  rows={4}
                  value={tab1Code}
                  onChange={(e) => setTab1Code(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono"
                />
              </div>

              <div className="space-y-2 border border-zinc-800 p-2.5 rounded bg-zinc-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyber-purple">TAB 2</span>
                  <input
                    type="text"
                    value={tab2Lang}
                    onChange={(e) => setTab2Lang(e.target.value)}
                    placeholder="Lang (e.g. bash)"
                    className="w-20 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]"
                  />
                </div>
                <input
                  type="text"
                  value={tab2Filename}
                  onChange={(e) => setTab2Filename(e.target.value)}
                  placeholder="Filename"
                  className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                />
                <textarea
                  rows={4}
                  value={tab2Code}
                  onChange={(e) => setTab2Code(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Steps */}
        {activeType === "steps" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 border border-zinc-800 p-2.5 rounded bg-zinc-900/40">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-amber-400">STEP 01</span>
                  <input
                    type="text"
                    value={step1Badge}
                    onChange={(e) => setStep1Badge(e.target.value)}
                    placeholder="Badge (e.g. HOST OS)"
                    className="w-24 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]"
                  />
                </div>
                <input
                  type="text"
                  value={step1Title}
                  onChange={(e) => setStep1Title(e.target.value)}
                  placeholder="Title"
                  className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                />
                <textarea
                  rows={3}
                  value={step1Content}
                  onChange={(e) => setStep1Content(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs"
                />
              </div>

              <div className="space-y-2 border border-zinc-800 p-2.5 rounded bg-zinc-900/40">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-amber-400">STEP 02</span>
                  <input
                    type="text"
                    value={step2Badge}
                    onChange={(e) => setStep2Badge(e.target.value)}
                    placeholder="Badge (e.g. DRIVER)"
                    className="w-24 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]"
                  />
                </div>
                <input
                  type="text"
                  value={step2Title}
                  onChange={(e) => setStep2Title(e.target.value)}
                  placeholder="Title"
                  className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                />
                <textarea
                  rows={3}
                  value={step2Content}
                  onChange={(e) => setStep2Content(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. FileTree */}
        {activeType === "filetree" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-zinc-500">INDENTED DIRECTORY HIERARCHY</label>
              <span className="text-[10px] text-zinc-500">Append (highlight) and // comment</span>
            </div>
            <textarea
              rows={6}
              value={treeContent}
              onChange={(e) => setTreeContent(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-xs focus:outline-none focus:border-cyber-cyan"
            />
          </div>
        )}

        {/* 5. Bookmark */}
        {activeType === "bookmark" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">RESOURCE TITLE</label>
                <input
                  type="text"
                  value={bmTitle}
                  onChange={(e) => setBmTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">SOURCE / TAG</label>
                <input
                  type="text"
                  value={bmSource}
                  onChange={(e) => setBmSource(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">DESTINATION URL</label>
              <input
                type="text"
                value={bmUrl}
                onChange={(e) => setBmUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-cyan-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">DESCRIPTION</label>
              <input
                type="text"
                value={bmDesc}
                onChange={(e) => setBmDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300"
              />
            </div>
          </div>
        )}

        {/* 6. Metric */}
        {activeType === "metric" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">VALUE</label>
                <input
                  type="text"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-amber-400 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">LABEL</label>
                <input
                  type="text"
                  value={metricLabel}
                  onChange={(e) => setMetricLabel(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">DELTA</label>
                <input
                  type="text"
                  value={metricDelta}
                  onChange={(e) => setMetricDelta(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">ACCENT</label>
                <select
                  value={metricAccent}
                  onChange={(e) => setMetricAccent(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
                >
                  <option value="cyan">Neon Cyan</option>
                  <option value="amber">Cyber Amber</option>
                  <option value="emerald">Emerald</option>
                  <option value="purple">Purple</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 7. Terminal */}
        {activeType === "terminal" && (
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">COMMAND</label>
              <input
                type="text"
                value={termCommand}
                onChange={(e) => setTermCommand(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyber-cyan"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">TITLE</label>
                <input
                  type="text"
                  value={termTitle}
                  onChange={(e) => setTermTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">OS / RUNTIME</label>
                <input
                  type="text"
                  value={termOs}
                  onChange={(e) => setTermOs(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* 8. Diagram */}
        {activeType === "diagram" && (
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">TOPOLOGY TYPE</label>
              <select
                value={diagType}
                onChange={(e) => setDiagType(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
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
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
              />
            </div>
          </div>
        )}

        {/* 9. Diff */}
        {activeType === "diff" && (
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">CONFIG FILENAME</label>
              <input
                type="text"
                value={diffFile}
                onChange={(e) => setDiffFile(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">DIFF CONTENT (+ added, - removed)</label>
              <textarea
                rows={3}
                value={diffText}
                onChange={(e) => setDiffText(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
              />
            </div>
          </div>
        )}

        {/* 10. Formula */}
        {activeType === "formula" && (
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">LATEX / FORMULA STRING</label>
              <input
                type="text"
                value={formulaText}
                onChange={(e) => setFormulaText(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-amber-400 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">LABEL</label>
              <input
                type="text"
                value={formulaLabel}
                onChange={(e) => setFormulaLabel(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
              />
            </div>
          </div>
        )}

        {/* 11. Lightbox */}
        {activeType === "lightbox" && (
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">IMAGE URL</label>
              <input
                type="text"
                value={mediaSrc}
                onChange={(e) => setMediaSrc(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">ALT TEXT</label>
                <input
                  type="text"
                  value={mediaAlt}
                  onChange={(e) => setMediaAlt(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">CAPTION</label>
                <input
                  type="text"
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* 12. Kbd */}
        {activeType === "kbd" && (
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-1">HOTKEY COMBINATION (separated by +)</label>
              <input
                type="text"
                value={kbdKeys}
                onChange={(e) => setKbdKeys(e.target.value)}
                placeholder="e.g. Ctrl + Shift + P"
                className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-amber-400 font-mono"
              />
            </div>
            <p className="text-[10px] text-zinc-500">
              Each key will be wrapped in mechanical cyber keycap tags (<code className="text-zinc-300">&lt;Kbd&gt;</code>).
            </p>
          </div>
        )}
      </div>

      {/* Code Snippet Preview */}
      <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-[11px] text-zinc-400 font-mono overflow-x-auto max-h-24">
        <div className="text-[9px] text-zinc-600 mb-1 tracking-wider uppercase">GENERATED CODE SNIPPET (PREVIEW)</div>
        <pre className="text-zinc-300 whitespace-pre-wrap">{getGeneratedSnippet().trim()}</pre>
      </div>
    </div>
  );
}
