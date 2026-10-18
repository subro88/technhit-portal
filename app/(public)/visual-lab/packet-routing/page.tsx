import React from "react";
import PacketRoutingDiagram from "@/components/visual-lab/PacketRoutingDiagram";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cluster Packet Routing Simulation",
  description: "Interactive SVG cluster packet routing diagram demonstrating BGP Anycast ingress and worker node balancing.",
};

export default function PacketRoutingPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link
          href="/visual-lab"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-cyber-emerald transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO VISUAL LAB</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-100 flex items-center gap-2">
          <Send className="w-6 h-6 text-cyber-emerald" />
          <span>Cluster Ingress & Packet Routing</span>
        </h1>
        <p className="text-sm text-zinc-400 font-sans leading-relaxed">
          High-performance network simulation tracking BGP Anycast edge proxies, keepalived virtual IPs, and Ceph-backed worker node hops.
        </p>
      </div>

      <PacketRoutingDiagram />
    </div>
  );
}
