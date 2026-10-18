"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  aspectRatio?: string;
}

export default function YouTubeEmbed({
  videoId,
  title = "TechNHIT Video Companion Tutorial",
  aspectRatio = "aspect-video",
}: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="my-6 rounded-xl bg-cyber-950 border border-cyber-border overflow-hidden shadow-2xl">
      <div className={`relative w-full ${aspectRatio} bg-cyber-900 flex items-center justify-center`}>
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-950 via-cyber-950/40 to-transparent" />

            {/* Play Button Hub */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600/90 group-hover:bg-red-500 group-hover:scale-110 flex items-center justify-center text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all">
                <Play className="w-7 h-7 fill-current translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Title Bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-zinc-200">
              <span className="truncate font-semibold">{title}</span>
              <span className="text-[11px] text-zinc-400 shrink-0 ml-2">@TechBlogTutorial</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
