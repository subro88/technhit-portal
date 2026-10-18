import React from "react";
import Link from "next/link";
import { Server, FileText, Edit3, Youtube, Shield, ArrowUpRight, LogOut, Activity } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="space-y-6">
      {/* Admin Studio Subheader Bar */}
      <div className="p-4 rounded-xl bg-cyber-900 border border-cyber-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-100">TechNHIT Studio Admin</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30">
                GITOPS ENGINE ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              {session?.user?.email || "admin@technhit.in"} (Master Operator)
            </div>
          </div>
        </div>

        {/* Studio Sub-Navigation */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-750 text-zinc-200 border border-cyber-border transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>POST DIRECTORY</span>
          </Link>
          <Link
            href="/admin/editor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan text-cyber-950 font-bold hover:bg-cyan-300 transition-colors cursor-pointer shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>MDX STUDIO</span>
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-850 hover:bg-red-950/40 hover:text-red-400 text-zinc-400 border border-cyber-border transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SWITCH SESSION</span>
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
