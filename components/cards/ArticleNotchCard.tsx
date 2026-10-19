"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import type { Post } from "@/lib/posts";

interface ArticleNotchCardProps {
  post: Post;
  index: number;
  trackLabel?: string;
  hardwareTarget?: string;
}

export function ArticleNotchCard({
  post,
  index,
  trackLabel = "LINUX ADMIN",
  hardwareTarget = "UBUNTU 24.04 / DEBIAN 12",
}: ArticleNotchCardProps) {
  const postUrl = `/${post.category}/${post.slug}`;
  const indexFormatted = String(index + 1).padStart(2, "0");
  const complexityScore = 70 + ((index * 7) % 25);
  const tagLabel = post.tags && post.tags.length > 0 ? post.tags[0].toUpperCase() : hardwareTarget;

  return (
    <article className="notch-corner bg-[#0d1117] border border-zinc-800 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
      {/* Clickable absolute overlay for accessibility & mobile touch */}
      <Link href={postUrl} className="absolute inset-0 z-20" aria-label={`Read ${post.title}`}>
        <span className="sr-only">Read {post.title}</span>
      </Link>

      {/* Card Image Banner */}
      <div className="relative h-64 overflow-hidden bg-zinc-950">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80") {
                target.src = "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80";
              }
            }}
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:scale-105 group-hover:brightness-90 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
            <Terminal className="w-16 h-16 opacity-30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent pointer-events-none" />

        {/* Top-Left Index Tag */}
        <div className="absolute top-4 left-4 font-mono text-[11px] text-amber-400 tracking-[0.2em] bg-black/60 px-2 py-1 backdrop-blur-sm z-10 pointer-events-none">
          {indexFormatted} / {trackLabel}
        </div>

        {/* Top-Right Complexity Badge */}
        <div className="absolute top-4 right-4 px-2 py-1 bg-amber-500 text-black font-mono text-[10px] font-bold tracking-[0.15em] z-10 pointer-events-none">
          COMPLEXITY {complexityScore}%
        </div>
      </div>

      {/* Card Content */}
      <div className="p-7 flex-1 flex flex-col justify-between space-y-6 relative z-10 pointer-events-none">
        <div>
          <h3 className="font-display text-3xl sm:text-4xl leading-tight text-zinc-100 group-hover:text-amber-400 transition-colors">
            {post.title}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed mt-3 font-body line-clamp-3">
            {post.summary || "Comprehensive production blueprint and architecture configuration."}
          </p>
        </div>

        {/* Specs Matrix */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-zinc-800 font-mono text-xs">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">DURATION</div>
            <div className="text-zinc-200 font-bold mt-0.5">{post.readTime || 5} MIN READ</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">PUBLISHED</div>
            <div className="text-zinc-200 font-bold mt-0.5">{post.date}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">HARDWARE TARGET</div>
            <div className="text-amber-400 font-bold mt-0.5 truncate">{tagLabel}</div>
          </div>
        </div>

        {/* Action Link Footer */}
        <div className="flex items-center justify-between font-heading text-sm tracking-[0.2em] uppercase text-zinc-200 group-hover:text-amber-400 pt-2 transition-colors">
          <span>READ ARCHITECTURE BLUEPRINT</span>
          <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </article>
  );
}

export default ArticleNotchCard;
