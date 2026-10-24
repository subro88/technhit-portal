"use client";

import React, { useState } from "react";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import {
  Sparkles,
  Copy,
  Check,
  Code2,
  Layers,
  Terminal,
  Bookmark as BookmarkIcon,
  FolderTree,
  Activity,
  Maximize2,
  Keyboard,
  AlertTriangle,
  FileDiff,
  Cpu,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface ComponentPreset {
  id: string;
  name: string;
  category: "Admonition" | "Code & Tabs" | "Procedure" | "Structure" | "Visual & Metric";
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultMdx: string;
}

const PRESETS: ComponentPreset[] = [
  {
    id: "callout",
    name: "Cyber Callout",
    category: "Admonition",
    icon: AlertTriangle,
    description: "System advisory, kernel warning, critical breaking hazard, or benchmark note with colored accents.",
    defaultMdx: `<Callout type="warning" title="PHP-FPM Socket Permission Hazard">
Ensure the \`www-data\` user has read/write permissions to \`/run/php/php8.3-fpm.sock\`. A misconfigured umask will cause Apache to return \`503 Service Unavailable\`.
</Callout>`,
  },
  {
    id: "codetabs",
    name: "Multi-Language CodeTabs",
    category: "Code & Tabs",
    icon: Code2,
    description: "Tabbed code viewer with language badges, copy-to-clipboard, and multi-OS/runtime switching.",
    defaultMdx: `<CodeTabs defaultTab={0}>
  <Tab label="Ubuntu 24.04 / Debian" lang="bash" filename="/etc/apache2/sites-available/app.conf">
sudo apt update && sudo apt install -y apache2 libapache2-mod-fcgid
sudo a2enmod proxy_fcgi setenvif
sudo systemctl restart apache2
  </Tab>
  <Tab label="RHEL 9 / Rocky Linux" lang="bash" filename="/etc/httpd/conf.d/app.conf">
sudo dnf install -y httpd php-fpm
sudo systemctl enable --now httpd php-fpm
  </Tab>
</CodeTabs>`,
  },
  {
    id: "steps",
    name: "Numbered Steps",
    category: "Procedure",
    icon: Layers,
    description: "Numbered procedural execution flow with illuminated node icons and connecting vertical tracks.",
    defaultMdx: `<Steps>
  <Step title="Verify Active Sockets" badge="PRE-FLIGHT">
Run \`ls -la /run/php/php*.sock\` to ensure all installed PHP versions are actively listening on their UNIX sockets.
  </Step>
  <Step title="Configure Apache VirtualHost" badge="CONFIG">
Map \`SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost"\` inside your VirtualHost block.
  </Step>
  <Step title="Reload Daemon and Test" badge="VALIDATION">
Execute \`sudo apache2ctl configtest && sudo systemctl reload apache2\` to apply routing without dropping active connections.
  </Step>
</Steps>`,
  },
  {
    id: "bookmark",
    name: "Bookmark Link Card",
    category: "Structure",
    icon: BookmarkIcon,
    description: "Rich reference card with preview image, domain pill, external link icon, and open source badge.",
    defaultMdx: `<Bookmark
  url="https://github.com/php/php-src"
  title="PHP: Hypertext Preprocessor Core Engine"
  description="The PHP core repository containing PHP-FPM event loop implementations, JIT compilers, and unix socket abstractions."
  domain="github.com/php"
  badge="CORE REPOSITORY"
  image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
/>`,
  },
  {
    id: "filetree",
    name: "Interactive FileTree",
    category: "Structure",
    icon: FolderTree,
    description: "Directory structure explorer with folder collapse, file highlights, and configuration comments.",
    defaultMdx: `<FileTree title="APACHE MULTI-PHP SYSTEM TOPOLOGY" rootPath="/etc/apache2/">
- sites-available/
  - 000-default.conf // Baseline virtualhost
  - app-php81.conf (highlight) // Proxied to php8.1-fpm.sock
  - app-php83.conf (highlight) // Proxied to php8.3-fpm.sock
- conf-available/
  - php8.1-fpm.conf
  - php8.3-fpm.conf
- mods-enabled/
  - proxy.load
  - proxy_fcgi.load
</FileTree>`,
  },
  {
    id: "metrics",
    name: "Metric Telemetry Cards",
    category: "Visual & Metric",
    icon: Activity,
    description: "High-impact performance telemetry capsules with trend arrows and comparative benchmark deltas.",
    defaultMdx: `<MetricGrid>
  <MetricCard value="-78.4%" label="TRANSFER SIZE" delta="Brotli vs Gzip" trend="down" accent="amber" />
  <MetricCard value="4.2 ms" label="TIME TO FIRST BYTE" delta="-62% Latency" trend="down" accent="cyan" />
  <MetricCard value="48.5K" label="THROUGHPUT (REQ/S)" delta="+185% Capacity" trend="up" accent="emerald" />
</MetricGrid>`,
  },
  {
    id: "medialightbox",
    name: "Media Lightbox",
    category: "Visual & Metric",
    icon: Maximize2,
    description: "Zoomable full-screen lightbox for high-resolution topology diagrams and server screenshots.",
    defaultMdx: `<MediaLightbox
  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
  alt="Apache mod_proxy_fcgi UNIX Socket Topology"
  caption="High-throughput UNIX Domain Socket communication between Apache worker threads and PHP-FPM pools"
/>`,
  },
  {
    id: "terminal",
    name: "Terminal Block",
    category: "Code & Tabs",
    icon: Terminal,
    description: "Interactive cyber shell terminal with OS pill, prompt indicator, and copy command trigger.",
    defaultMdx: `<TerminalBlock
  command="sudo a2enmod proxy_fcgi setenvif && sudo systemctl restart apache2"
  title="FastCGI Module Provisioning"
  os="Ubuntu 24.04 LTS"
/>`,
  },
  {
    id: "architecture",
    name: "Architecture Diagram",
    category: "Visual & Metric",
    icon: Cpu,
    description: "SVG diagram showing multi-node Proxmox clusters, Ceph mesh, or GPU inference pipelines.",
    defaultMdx: `<ArchitectureDiagram
  type="cluster"
  title="Proxmox VE 8 + Ceph High-Availability Cluster Topology"
/>`,
  },
  {
    id: "configdiff",
    name: "Configuration Diff",
    category: "Code & Tabs",
    icon: FileDiff,
    description: "Unified configuration diff highlighting added (+) and removed (-) lines with code font.",
    defaultMdx: `<ConfigDiff
  filename="/etc/apache2/mods-available/brotli.conf"
  diffText="<IfModule mod_brotli.c>
-    BrotliCompressionQuality 5
+    BrotliCompressionQuality 6
+    BrotliFilterNote Input instream
+    BrotliFilterNote Output outstream
+    BrotliFilterNote Ratio ratio
</IfModule>"
/>`,
  },
  {
    id: "kbd",
    name: "Mechanical Keycaps",
    category: "Code & Tabs",
    icon: Keyboard,
    description: "Mechanical cyber keycaps for terminal and editor keyboard shortcuts.",
    defaultMdx: `Press <Kbd>Ctrl</Kbd> + <Kbd>O</Kbd> to write out the buffer in nano, followed by <Kbd>Enter</Kbd> and <Kbd>Ctrl</Kbd> + <Kbd>X</Kbd> to save and exit.`,
  },
];

export default function MdxGeneratorPage() {
  const [selectedId, setSelectedId] = useState<string>("callout");
  const [mdxCode, setMdxCode] = useState<string>(PRESETS[0].defaultMdx);
  const [copied, setCopied] = useState(false);

  const currentPreset = PRESETS.find((p) => p.id === selectedId) || PRESETS[0];

  const handleSelectPreset = (preset: ComponentPreset) => {
    setSelectedId(preset.id);
    setMdxCode(preset.defaultMdx);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(mdxCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1700px] mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-sm bg-[#0d1117] border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3 font-mono text-xs">
            <span className="w-2.5 h-2.5 bg-[#FF5400] rotate-45 inline-block" />
            <span className="text-[#FF5400] font-bold tracking-[0.24em] uppercase">
              TECHNHIT STUDIO // MDX COMPONENT GENERATOR
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-zinc-100 uppercase tracking-wide">
            Interactive Engineering Component Suite
          </h1>
          <p className="mt-2 text-sm text-zinc-400 font-sans leading-relaxed">
            Generate and live-preview production-ready MDX components for server administration, cluster blueprints,
            and STEM field manuals. Customize code and click to copy straight into your article.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-6 py-3 rounded-xs bg-[#FF5400] hover:bg-amber-400 text-black font-display text-base tracking-wider uppercase font-bold transition-all shadow-[0_0_15px_rgba(255,84,0,0.3)] hover:scale-102 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>1-CLICK COPY MDX</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Catalog, Middle Code Editor, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Component Navigation: 3 Cols */}
        <div className="lg:col-span-3 space-y-2 bg-[#07090e] border border-zinc-800 p-4 rounded-sm shadow-xl">
          <div className="font-mono text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase px-2 mb-3">
            COMPONENT CATALOG ({PRESETS.length})
          </div>

          <div className="space-y-1.5">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = preset.id === selectedId;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left p-3 rounded-xs border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-[#0d1117] border-[#FF5400] shadow-[0_0_12px_rgba(255,84,0,0.15)]"
                      : "bg-transparent border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/60"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xs shrink-0 ${
                      isSelected
                        ? "bg-[#FF5400] text-black"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-display text-sm tracking-wide uppercase truncate ${
                          isSelected ? "text-amber-400 font-bold" : "text-zinc-200"
                        }`}
                      >
                        {preset.name}
                      </span>
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-xs bg-zinc-900 text-zinc-500 border border-zinc-800">
                        {preset.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans line-clamp-1 mt-1">
                      {preset.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle & Right: Code Inspector (4 Cols) + Live Canvas Preview (5 Cols) */}
        <div className="lg:col-span-9 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* MDX Code Editor Column */}
          <div className="flex flex-col bg-[#07090e] border border-zinc-800 rounded-sm shadow-xl overflow-hidden min-h-[560px]">
            {/* Editor Toolbar */}
            <div className="bg-[#0d1117] border-b border-zinc-800 px-4 py-3 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#FF5400]" />
                <span className="text-zinc-200 font-bold uppercase tracking-wider">
                  MDX SOURCE CODE
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "COPIED" : "COPY CODE"}</span>
              </button>
            </div>

            {/* Code Input */}
            <div className="p-4 flex-1 flex flex-col">
              <textarea
                value={mdxCode}
                onChange={(e) => setMdxCode(e.target.value)}
                spellCheck={false}
                className="w-full flex-1 min-h-[460px] p-4 bg-[#050608] border border-zinc-800/80 rounded-xs font-mono text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-amber-500 resize-none"
              />
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>EDIT CODE TO TEST REAL-TIME COMPILATION</span>
                <button
                  onClick={() => setMdxCode(currentPreset.defaultMdx)}
                  className="text-amber-400/80 hover:text-amber-400 hover:underline"
                >
                  RESET TO DEFAULT
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Canvas Column */}
          <div className="flex flex-col bg-[#07090e] border border-zinc-800 rounded-sm shadow-xl overflow-hidden min-h-[560px]">
            {/* Canvas Toolbar */}
            <div className="bg-[#0d1117] border-b border-zinc-800 px-4 py-3 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-200 font-bold uppercase tracking-wider">
                  LIVE ARTIFACT PREVIEW
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                ENGINE: MDXRENDERER 2.0
              </span>
            </div>

            {/* Rendered Live Component */}
            <div className="p-6 flex-1 overflow-y-auto bg-[#07090e]">
              <div className="rounded-sm border border-zinc-800/60 bg-[#07090e]/80 p-5 shadow-inner">
                <MdxRenderer content={mdxCode} />
              </div>

              {/* Usage Guide Tip */}
              <div className="mt-6 p-4 rounded-xs border border-zinc-800/80 bg-zinc-950/60 text-xs font-mono text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AUTHORING CHEATSHEET</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-400">
                  Paste this snippet directly into any <code className="text-cyan-400">content/**/*.mdx</code> post.
                  All components compile instantly with zero runtime overhead on both Blog Mode and Gamified Learning Mode.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
