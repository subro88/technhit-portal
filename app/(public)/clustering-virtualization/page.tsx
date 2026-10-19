import React from "react";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import { Server, Calendar, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clustering & Virtualization | Proxmox, Ceph & Kubernetes",
  description: "Enterprise virtualization clusters, Proxmox VE 8 high-availability, Ceph storage pools, Corosync quorum, and Docker Swarm mesh.",
};

export const revalidate = 60;

export default function ClusteringPage() {
  const posts = getPostsByCategory("clustering-virtualization");

  return (
    <div className="space-y-10">
      <div className="p-8 rounded-2xl bg-cyber-900 border border-cyber-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Server className="w-48 h-48 text-cyber-emerald" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-xs font-mono w-fit mb-3">
            <Server className="w-3.5 h-3.5" />
            <span>HIGH AVAILABILITY & HYPERVISORS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-100">
            Clustering & Virtualization
          </h1>
          <p className="text-sm text-zinc-400 font-sans mt-3 leading-relaxed">
            Multi-node Proxmox VE 8 configurations, Ceph distributed block pools, Corosync redundant link networks, live VM migration, and bare-metal Kubernetes clusters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/clustering-virtualization/${post.slug}`}
            className="group p-6 rounded-xl bg-cyber-900 border border-cyber-border hover:border-cyber-emerald/40 hover:bg-cyber-850 transition-all flex flex-col justify-between cursor-pointer shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                </span>
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime} MIN</span>
                </span>
              </div>

              <h2 className="text-lg font-bold font-mono text-zinc-100 group-hover:text-cyber-emerald transition-colors mt-2">
                {post.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                {post.summary}
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-cyber-border/40 text-xs font-mono text-zinc-400 group-hover:text-zinc-200">
              <span className="text-cyber-emerald">READ BLUEPRINT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
