import Link from "next/link";
import { Terminal, ShieldAlert, ArrowLeft, Home, Server, Cpu, BookOpen } from "lucide-react";
import { TuxGearLogo } from "@/components/brand/TuxGearLogo";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-2xl w-full bg-zinc-950/90 border border-zinc-800 rounded-lg p-6 sm:p-10 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <TuxGearLogo size={32} showText={false} />
            <div>
              <span className="font-heading text-xs tracking-[0.2em] uppercase text-zinc-300 font-bold block">
                TechNHIT // Diagnostic Console
              </span>
              <span className="font-mono text-[10px] text-zinc-500">
                KERNEL_SUBSYSTEM: ROUTING_FAULT
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-[11px] text-amber-400 font-semibold tracking-wider">
              HTTP 404
            </span>
          </div>
        </div>

        {/* Diagnostic Panel */}
        <div className="bg-black/90 rounded border border-zinc-900 p-4 font-mono text-xs mb-8 space-y-2 text-zinc-400">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>[FAULT: OBJECT_NOT_FOUND_IN_CLUSTER_CATALOG]</span>
          </div>
          <p className="text-zinc-500 leading-relaxed text-[11px]">
            The requested target route or publication node does not exist in the active partition scheme or has been decommissioned.
          </p>
          <div className="pt-2 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[10px] text-zinc-500">
            <div>STATUS: <span className="text-zinc-300">UNRESOLVED</span></div>
            <div>CLUSTER_NODE: <span className="text-emerald-400">ONLINE</span></div>
            <div>ACTION: <span className="text-amber-400">ROLLBACK_OR_REDIRECT</span></div>
            <div>ENCRYPTION: <span className="text-zinc-300">TLS 1.3 / STRICT</span></div>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <h4 className="font-heading text-xs uppercase tracking-[0.18em] text-zinc-400 mb-4 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-amber-500" />
          <span>Available Execution Vectors</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link
            href="/"
            className="flex items-center gap-3 p-3 bg-zinc-900/60 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/40 rounded transition-all group"
          >
            <Home className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-heading text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors uppercase tracking-wider">
                Command Hub
              </div>
              <div className="font-mono text-[10px] text-zinc-500">Root Directory ( / )</div>
            </div>
          </Link>

          <Link
            href="/linux-server-admin"
            className="flex items-center gap-3 p-3 bg-zinc-900/60 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/40 rounded transition-all group"
          >
            <Terminal className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-heading text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors uppercase tracking-wider">
                Linux Administration
              </div>
              <div className="font-mono text-[10px] text-zinc-500">Production Rocky & Kernel</div>
            </div>
          </Link>

          <Link
            href="/clustering-virtualization"
            className="flex items-center gap-3 p-3 bg-zinc-900/60 hover:bg-emerald-500/10 border border-zinc-800 hover:border-emerald-500/40 rounded transition-all group"
          >
            <Server className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-heading text-xs font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors uppercase tracking-wider">
                Virtualization & Ceph
              </div>
              <div className="font-mono text-[10px] text-zinc-500">Proxmox VE & SDS</div>
            </div>
          </Link>

          <Link
            href="/stem-10-plus-2"
            className="flex items-center gap-3 p-3 bg-zinc-900/60 hover:bg-amber-500/10 border border-zinc-800 hover:border-amber-500/40 rounded transition-all group"
          >
            <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-heading text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors uppercase tracking-wider">
                10+2 STEM Mathematics
              </div>
              <div className="font-mono text-[10px] text-zinc-500">Visual Calculus & Fields</div>
            </div>
          </Link>
        </div>

        {/* Back Button */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Primary Cluster</span>
          </Link>
          <span className="font-mono text-[10px] text-zinc-600">
            CLUSTER_DOMAIN: TECHNHIT.IN
          </span>
        </div>
      </div>
    </div>
  );
}
