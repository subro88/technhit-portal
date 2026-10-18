"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Terminal } from "lucide-react";
import { TuxGearLogo } from "@/components/brand/TuxGearLogo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to console in production
    console.error("[TechNHIT Kernel Panic]", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      <div className="max-w-xl w-full bg-zinc-950 border border-red-900/50 rounded-lg p-6 sm:p-10 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <TuxGearLogo size={32} showText={false} />
            <div>
              <span className="font-heading text-xs tracking-[0.2em] uppercase text-red-400 font-bold block">
                TechNHIT // Execution Fault
              </span>
              <span className="font-mono text-[10px] text-zinc-500">
                STATUS: UNHANDLED_RUNTIME_EXCEPTION
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-[11px] text-red-400 font-semibold tracking-wider">
              PANIC
            </span>
          </div>
        </div>

        {/* Error Output */}
        <div className="bg-black/95 rounded border border-red-950 p-4 font-mono text-xs mb-6 space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="font-bold">FAULT_DIAGNOSTIC:</span>
          </div>
          <div className="p-2.5 bg-red-950/20 border border-red-900/30 rounded text-red-200 text-[11px] break-words">
            {error.message || "An unexpected cluster exception occurred during component execution."}
          </div>
          {error.digest && (
            <div className="text-[10px] text-zinc-500">
              FAULT_DIGEST_HASH: <span className="text-zinc-400 font-semibold">{error.digest}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-900">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-heading text-xs font-bold uppercase tracking-wider transition-colors rounded shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restart Subsystem (Reset)</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-heading text-xs font-bold uppercase tracking-wider transition-colors rounded"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>

        <div className="mt-6 flex justify-between items-center text-[10px] font-mono text-zinc-600">
          <span>HOST: TECHNHIT.IN</span>
          <span>CLUSTER SAFETY: ACTIVATED</span>
        </div>
      </div>
    </div>
  );
}
