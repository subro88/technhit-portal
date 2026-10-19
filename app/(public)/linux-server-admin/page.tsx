import React from "react";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import { ArticleNotchCard } from "@/components/cards/ArticleNotchCard";
import { Terminal, Shield, ArrowLeft, Cpu, Activity, HardDrive } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Linux Server Administration & Kernel Hardening | TechNHIT",
  description: "Enterprise Linux administration, ZFS storage arrays, sysctl kernel optimization, nftables firewalls, and systemd services.",
};

export const revalidate = 60;

export default function LinuxAdminPage() {
  const posts = getPostsByCategory("linux-server-admin");

  return (
    <div className="space-y-16 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Navigation Breadcrumb */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO CLUSTER OVERVIEW</span>
        </Link>
      </div>

      {/* Industrial Brutalist Header matching Homepage */}
      <div className="grid lg:grid-cols-12 gap-8 items-end border-b border-zinc-800 pb-12">
        <div className="lg:col-span-8 space-y-4">
          <div className="section-marker">
            <span>01 — LINUX KERNEL &amp; SERVER ADMINISTRATION</span>
          </div>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] text-zinc-100">
            BARE-METAL DISCIPLINE.<br />
            <span className="text-[#FF5400]">ZERO DOWNTIME.</span><br />
            <span className="text-stroke">PRODUCTION HARDENED.</span>
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl font-body max-w-3xl leading-relaxed pt-2">
            Every blueprint below is tested against live enterprise infrastructure. Production hardening for Debian 12, Ubuntu 24.04 LTS, and Rocky Linux: kernel sysctl tuning, nftables packet filtering, ZFS pools, and systemd daemon supervision.
          </p>
        </div>

        {/* Spec Strip Widget */}
        <div className="lg:col-span-4 bg-[#0d1117] border border-zinc-800 p-6 notch-corner space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-500" />
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-300">TRACK TELEMETRY</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">BLUEPRINTS</div>
              <div className="text-amber-400 font-bold text-lg mt-0.5">{posts.length} ARTICLES</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">MINIMUM KERNEL</div>
              <div className="text-zinc-200 font-bold text-lg mt-0.5">6.8+ LTS</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SECURITY</div>
              <div className="text-zinc-200 font-bold text-sm mt-0.5">NFTABLES / CIS</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">VERIFIED ON</div>
              <div className="text-emerald-400 font-bold text-sm mt-0.5">PROD CLUSTERS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Cards Grid matching Homepage Theme */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <span className="text-amber-500">//</span>
            <span>AVAILABLE PRODUCTION BLUEPRINTS ({posts.length})</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <ArticleNotchCard
              key={post.slug}
              post={post}
              index={index}
              trackLabel="LINUX ADMIN"
              hardwareTarget="UBUNTU 24.04 / DEBIAN 12"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
