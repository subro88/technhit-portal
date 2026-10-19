import React from "react";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import { Cpu, Calendar, Clock, ArrowRight, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local AI & GPU Compute Clusters | Ollama, vLLM & CUDA",
  description: "Self-hosted private LLM compute clusters, Ollama, vLLM, CUDA containerization, Docker GPU pass-through, and multi-node inference.",
};

export const revalidate = 60;

export default function LocalAiPage() {
  const posts = getPostsByCategory("local-ai-inference");

  return (
    <div className="space-y-10">
      <div className="p-8 rounded-2xl bg-cyber-900 border border-cyber-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Cpu className="w-48 h-48 text-cyber-purple" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple text-xs font-mono w-fit mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>LOCAL AI & GPU ACCELERATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-100">
            Local AI & GPU Inference Clusters
          </h1>
          <p className="text-sm text-zinc-400 font-sans mt-3 leading-relaxed">
            High-performance offline inference clustering, NVIDIA Container Toolkit configurations, Ollama multi-worker scaling, vLLM high-throughput paging, and private LLM routing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/local-ai-inference/${post.slug}`}
            className="group p-6 rounded-xl bg-cyber-900 border border-cyber-border hover:border-cyber-purple/40 hover:bg-cyber-850 transition-all flex flex-col justify-between cursor-pointer shadow-lg"
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

              <h2 className="text-lg font-bold font-mono text-zinc-100 group-hover:text-cyber-purple transition-colors mt-2">
                {post.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                {post.summary}
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-cyber-border/40 text-xs font-mono text-zinc-400 group-hover:text-zinc-200">
              <span className="text-cyber-purple">READ BLUEPRINT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
