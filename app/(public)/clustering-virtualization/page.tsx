import React from "react";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import { ArticleNotchCard } from "@/components/cards/ArticleNotchCard";
import { Server, ArrowLeft, Network, ShieldCheck, HardDrive, Cpu } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clustering & Virtualization | Proxmox, Ceph & Kubernetes | TechNHIT",
  description: "Enterprise virtualization clusters, Proxmox VE 8 high-availability, Ceph storage pools, Corosync quorum, DRBD 9 synchronous storage, and K3s ARM edge micro-clusters.",
};

export const revalidate = 60;

export default function ClusteringPage() {
  const posts = getPostsByCategory("clustering-virtualization");

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

      {/* Industrial Brutalist Header matching Linux Admin & Homepage */}
      <div className="grid lg:grid-cols-12 gap-8 items-end border-b border-zinc-800 pb-12">
        <div className="lg:col-span-8 space-y-4">
          <div className="section-marker">
            <span>02 — HIGH-AVAILABILITY CLUSTERING &amp; VIRTUALIZATION</span>
          </div>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] text-zinc-100">
            ZERO SINGLE POINT OF FAILURE.<br />
            <span className="text-[#FF5400]">QUORUM LOCKED.</span><br />
            <span className="text-stroke">PRODUCTION RESILIENT.</span>
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl font-body max-w-3xl leading-relaxed pt-2">
            Enterprise hypervisor clusters, multi-node Proxmox VE 8 fabrics, distributed Ceph block pools, Corosync Totem dual-ring consensus, DRBD 9 synchronous storage, and low-power ARM K3s edge micro-clusters with autonomous disconnected operation.
          </p>
        </div>

        {/* Spec Strip Widget */}
        <div className="lg:col-span-4 bg-[#0d1117] border border-zinc-800 p-6 notch-corner space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-500" />
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
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">QUORUM ENGINE</div>
              <div className="text-zinc-200 font-bold text-lg mt-0.5">COROSYNC 3</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">STORAGE FABRIC</div>
              <div className="text-zinc-200 font-bold text-sm mt-0.5">CEPH &amp; DRBD 9</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">TARGET PLATFORM</div>
              <div className="text-emerald-400 font-bold text-sm mt-0.5">PROXMOX / K3S</div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Cards Grid matching Linux Admin & Homepage Theme */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <span className="text-amber-500">//</span>
            <span>AVAILABLE PRODUCTION BLUEPRINTS ({posts.length})</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const isK3s = post.slug.includes("k3s") || post.slug.includes("arm");
            const isCorosync = post.slug.includes("corosync") || post.slug.includes("mysql");

            const trackLabel = isK3s ? "EDGE K3S" : isCorosync ? "HA CLUSTERING" : "CLUSTERING";
            const hardwareTarget = isK3s
              ? "ARM64 SBC / WIREGUARD"
              : isCorosync
              ? "PROXMOX VE 8 / DRBD 9"
              : "PROXMOX VE 8 / CEPH";

            return (
              <ArticleNotchCard
                key={post.slug}
                post={post}
                index={index}
                trackLabel={trackLabel}
                hardwareTarget={hardwareTarget}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
