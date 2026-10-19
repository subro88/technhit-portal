import React from "react";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import { Code2, Calendar, Clock, ArrowRight, Layers } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Engineering & Full Stack Web Architecture",
  description: "Modern full-stack engineering, Laravel ecosystem, React 19, Node.js runtimes, CodeIgniter architecture, and distributed database designs.",
};

export const revalidate = 60;

export default function SoftwareEngineeringPage() {
  const posts = getPostsByCategory("software-engineering");

  return (
    <div className="space-y-10">
      {/* Track Header */}
      <div className="p-8 rounded-2xl bg-cyber-900 border border-cyber-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Code2 className="w-48 h-48 text-cyber-cyan" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono w-fit mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>FULL STACK & WEB SYSTEMS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-100">
            Software Engineering & Web Systems
          </h1>
          <p className="text-sm text-zinc-400 font-sans mt-3 leading-relaxed">
            Architectural patterns, Laravel ecosystems, React/Next.js toolchains, Node.js multi-runtime orchestration, and production web engineering frameworks.
          </p>
        </div>
      </div>

      {/* Articles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/software-engineering/${post.slug}`}
            className="group p-6 rounded-xl bg-cyber-900 border border-cyber-border hover:border-cyber-cyan/40 hover:bg-cyber-850 transition-all flex flex-col justify-between cursor-pointer shadow-lg"
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

              <h2 className="text-lg font-bold font-mono text-zinc-100 group-hover:text-cyber-cyan transition-colors mt-2">
                {post.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                {post.summary}
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-mono text-cyber-cyan mt-4 group-hover:translate-x-1 transition-transform">
              <span>READ ARCHITECTURE BLUEPRINT</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
