"use client";

import React, { useState, useEffect } from "react";
import { ZoomIn, X, Maximize2 } from "lucide-react";

interface MediaLightboxProps {
  src: string;
  alt?: string;
  caption?: string;
}

export default function MediaLightbox({ src, alt = "Diagram", caption }: MediaLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <figure className="my-8 not-prose">
      {/* Thumbnail Trigger */}
      <div
        onClick={() => setIsOpen(true)}
        className="group relative cursor-zoom-in rounded-sm overflow-hidden border border-zinc-800 bg-[#0d1117] hover:border-amber-500/80 transition-all shadow-xl"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto max-h-[500px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
          loading="lazy"
        />

        {/* Hover Zoom Overlay Badge */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm border border-zinc-700 text-amber-400 font-mono text-[10px] tracking-widest px-2.5 py-1 rounded-xs flex items-center gap-1.5 shadow-lg">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>CLICK TO ENLARGE</span>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center font-mono text-xs text-zinc-400 tracking-wider">
          <span className="text-[#FF5400] mr-1.5">//</span>
          {caption}
        </figcaption>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-[#07090e]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          {/* Top Bar with Close */}
          <div className="w-full max-w-6xl flex items-center justify-between mb-4 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5400] animate-pulse" />
              <span className="uppercase tracking-widest text-zinc-300 font-bold">{alt}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-zinc-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 text-[#FF5400]" />
              <span>ESC / CLOSE</span>
            </button>
          </div>

          {/* Modal Image Display */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl max-h-[82vh] w-full flex flex-col items-center justify-center border border-zinc-800 bg-[#0d1117] rounded-sm p-2 shadow-2xl overflow-hidden"
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[75vh] w-auto max-w-full object-contain mx-auto select-none"
            />
            {caption && (
              <p className="mt-2 text-xs font-mono text-zinc-400 text-center tracking-wide">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </figure>
  );
}
