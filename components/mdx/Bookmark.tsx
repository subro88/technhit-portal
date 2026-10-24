"use client";

import React from "react";
import { ExternalLink, Globe, Github, BookOpen } from "lucide-react";

interface BookmarkProps {
  url: string;
  title: string;
  description?: string;
  domain?: string;
  image?: string;
  badge?: string;
}

export default function Bookmark({
  url,
  title,
  description,
  domain,
  image,
  badge = "REFERENCE",
}: BookmarkProps) {
  let displayDomain = domain;
  if (!displayDomain) {
    try {
      displayDomain = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      displayDomain = url;
    }
  }

  const isGitHub = displayDomain?.includes("github.com");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 block group not-prose"
    >
      <div className="flex flex-col sm:flex-row items-stretch overflow-hidden rounded-sm bg-[#0d1117] border border-zinc-800 hover:border-amber-500/80 transition-all duration-300 shadow-xl group-hover:shadow-[0_0_20px_rgba(255,84,0,0.15)]">
        {image && (
          <div className="relative w-full sm:w-52 md:w-60 h-36 sm:h-auto shrink-0 bg-black/50 overflow-hidden border-b sm:border-b-0 sm:border-r border-zinc-800">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] sm:bg-gradient-to-r sm:from-transparent sm:to-[#0d1117]/60" />
          </div>
        )}

        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px]">
              <span className="text-[#FF5400] font-bold tracking-widest uppercase bg-[#FF5400]/10 px-2 py-0.5 border border-[#FF5400]/30 rounded-xs">
                {badge}
              </span>
              <span className="text-zinc-500">//</span>
              <span className="text-zinc-400 flex items-center gap-1 truncate">
                {isGitHub ? <Github className="w-3 h-3 text-zinc-300" /> : <Globe className="w-3 h-3 text-cyan-400" />}
                {displayDomain}
              </span>
            </div>

            <h4 className="font-display text-base sm:text-lg tracking-wide uppercase text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-1 mb-1.5">
              {title}
            </h4>

            {description && (
              <p className="text-xs sm:text-sm text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-amber-400 transition-colors">
            <span className="truncate text-[11px] text-zinc-400 group-hover:text-amber-400/90 font-mono">
              {url}
            </span>
            <span className="flex items-center gap-1 shrink-0 text-[#FF5400] font-bold text-[11px] ml-3">
              OPEN SOURCE <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
