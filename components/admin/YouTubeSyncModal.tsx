"use client";

import React, { useState, useEffect } from "react";
import { Youtube, X, RefreshCw, Plus, Check, ExternalLink } from "lucide-react";
import { YouTubeVideoItem } from "@/lib/youtube";

interface YouTubeSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideoDraft: (video: YouTubeVideoItem) => void;
}

export default function YouTubeSyncModal({
  isOpen,
  onClose,
  onSelectVideoDraft,
}: YouTubeSyncModalProps) {
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/youtube/sync");
      const data = await res.json();
      if (data.success && data.videos) {
        setVideos(data.videos);
      } else {
        setError(data.error || "Failed to load channel videos.");
      }
    } catch (err: any) {
      setError(err.message || "Network exception fetching YouTube videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVideos();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-cyber-900 border border-cyber-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cyber-border bg-cyber-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-semibold text-zinc-100 flex items-center gap-2">
                YouTube Ingest: @TechBlogTutorial
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Auto-generate video companion MDX tutorials with embedded schema
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-cyber-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 font-mono text-xs text-cyber-cyan">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Querying YouTube Data API v3...</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-300">
              {error}
            </div>
          )}

          {!loading &&
            videos.map((video) => (
              <div
                key={video.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-cyber-950 border border-cyber-border hover:border-cyber-cyan/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded-lg border border-cyber-border shrink-0"
                  />
                  <div>
                    <h4 className="font-mono text-xs font-semibold text-zinc-100 line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-mono mt-1 line-clamp-1">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 mt-1.5">
                      <span>PUBLISHED: {video.publishedAt}</span>
                      <span>ID: {video.id}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectVideoDraft(video);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-cyan hover:text-cyber-950 border border-cyber-border text-xs font-mono text-zinc-200 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>IMPORT DRAFT</span>
                </button>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyber-border bg-cyber-950 flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>YOUTUBE_API_KEY: ACTIVE</span>
          <button
            onClick={fetchVideos}
            className="flex items-center gap-1 text-cyber-cyan hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>REFRESH FEED</span>
          </button>
        </div>
      </div>
    </div>
  );
}
