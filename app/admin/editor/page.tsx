"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MonacoMdxEditor from "@/components/admin/MonacoMdxEditor";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import DiagramGenerator from "@/components/admin/DiagramGenerator";
import YouTubeSyncModal from "@/components/admin/YouTubeSyncModal";
import { YouTubeVideoItem } from "@/lib/youtube";
import { 
  Save, GitCommit, ExternalLink, RefreshCw, Eye, 
  CheckCircle2, AlertCircle, Youtube, Sparkles, Layers,
  Terminal, ShieldCheck, ArrowLeft
} from "lucide-react";
import Link from "next/link";

function EditorContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("slug") || "deploying-local-ai-cluster-ollama-docker";
  const initialCat = searchParams.get("category") || "local-ai-inference";

  const [title, setTitle] = useState("Deploying Local AI Cluster with Ollama & Docker GPU Passthrough");
  const [slug, setSlug] = useState(initialSlug);
  const [category, setCategory] = useState(initialCat);
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const [youtubeId, setYoutubeId] = useState("dQw4w9WgXcQ");
  const [editorContent, setEditorContent] = useState(`---
title: "Deploying Local AI Cluster with Ollama & Docker GPU Passthrough"
date: "2026-10-18"
category: "local-ai-inference"
status: "Published"
youtubeId: "dQw4w9WgXcQ"
summary: "High-performance inference clustering with NVIDIA GPU pass-through on Ubuntu 24.04 LTS."
---

# Deploying Local AI Cluster with Ollama & Docker GPU Passthrough

In this companion guide to our **@TechBlogTutorial** video, we construct a scalable compute cluster for hosting LLMs completely offline.

<InfoBox title="Hardware Requisite" type="note">
Ensure NVIDIA CUDA drivers (v550+) and NVIDIA Container Toolkit are installed prior to starting the Docker swarm.
</InfoBox>

### 1. Verify NVIDIA GPU Container Runtime

Execute telemetry verification to confirm container GPU access:

<TerminalBlock command="docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi" title="NVIDIA Core Driver Verification" os="Ubuntu 24.04" />

### 2. Multi-Node Cluster Architecture

Below is our primary reverse proxy routing architecture diagram:

<ArchitectureDiagram type="cluster" title="Inference Routing Mesh" />

### 3. Deploying Ollama Service Stack

Run the containerized inference cluster daemon with automated restart policies:

<TerminalBlock command="docker compose -f docker-compose.ai.yml up -d --scale worker=2" title="Cluster Startup" os="Debian/Ubuntu" />
`);

  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState<{
    type: "success" | "warning" | "error";
    message: string;
    commitUrl?: string;
  } | null>(null);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);

  // Word & character stats
  const stats = useMemo(() => {
    const text = editorContent.replace(/^---[\s\S]*?---/, "").trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = editorContent.length;
    const readTime = Math.ceil(words / 200);
    return { words, chars, readTime };
  }, [editorContent]);

  // Insert snippet from DiagramGenerator
  const handleInsertSnippet = (snippet: string) => {
    setEditorContent((prev) => prev + snippet);
    setPublishFeedback({
      type: "success",
      message: "MDX Component inserted into document.",
    });
    setTimeout(() => setPublishFeedback(null), 3000);
  };

  // Import video companion
  const handleImportVideoDraft = (video: YouTubeVideoItem) => {
    setTitle(video.title);
    setSlug(video.suggestedSlug);
    setCategory("video-companions");
    setStatus("Draft");
    setYoutubeId(video.id);
    setEditorContent(video.suggestedMdx);
    setPublishFeedback({
      type: "success",
      message: `Loaded companion draft for: ${video.title}`,
    });
    setTimeout(() => setPublishFeedback(null), 3500);
  };

  // GitOps Publish Handler
  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishFeedback(null);

    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          slug,
          title,
          content: editorContent,
          commitMessage: `docs(${category}): publish ${title} via TechNHIT Studio`,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.git?.commitSha) {
          setPublishFeedback({
            type: "success",
            message: `GitOps Commit ${data.git.commitSha.slice(0, 7)} created on GitHub!`,
            commitUrl: data.git.htmlUrl,
          });
        } else if (data.git?.notice) {
          setPublishFeedback({
            type: "success",
            message: "Saved to local content/ MDX repository.",
          });
        } else if (data.git?.warning) {
          setPublishFeedback({
            type: "warning",
            message: data.git.warning,
          });
        }
      } else {
        setPublishFeedback({
          type: "error",
          message: data.error || "Failed to publish.",
        });
      }
    } catch (err: any) {
      setPublishFeedback({
        type: "error",
        message: err.message || "Network exception during publishing.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Metadata Control Bar */}
      <div className="p-4 rounded-xl bg-cyber-900 border border-cyber-border space-y-4 shadow-xl font-mono text-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase block mb-1">PUBLICATION TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-cyber-950 border border-cyber-border text-zinc-100 font-semibold focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase block mb-1">TARGET URL SLUG</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-cyber-950 border border-cyber-border text-zinc-100 focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase block mb-1">ENGINEERING TRACK</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-cyan cursor-pointer"
              >
                <option value="linux-server-admin">Linux Server Admin</option>
                <option value="clustering-virtualization">Clustering & Virtualization</option>
                <option value="local-ai-inference">Local AI Compute</option>
                <option value="stem-10-plus-2">10+2 Math & STEM Lab</option>
                <option value="video-companions">YouTube Companions</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase block mb-1">RELEASE STATUS</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-cyan cursor-pointer"
              >
                <option value="Published">Published (Live)</option>
                <option value="Draft">Draft (Internal)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 w-full lg:w-auto justify-end">
            <button
              onClick={() => setIsYoutubeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-600/40 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>SYNC YOUTUBE</span>
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyber-cyan text-cyber-950 font-bold hover:bg-cyan-300 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>COMMITTING...</span>
                </>
              ) : (
                <>
                  <GitCommit className="w-3.5 h-3.5" />
                  <span>PUBLISH TO GITHUB</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cyber-border text-[11px] text-zinc-400">
          <div className="flex items-center gap-4">
            <span>WORDS: {stats.words.toLocaleString()}</span>
            <span>CHARACTERS: {stats.chars.toLocaleString()}</span>
            <span>EST. READ TIME: {stats.readTime} MIN</span>
            <span>CURSOR: Ln {cursorLine}, Col {cursorCol}</span>
          </div>

          {publishFeedback && (
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-[11px] ${
                publishFeedback.type === "success"
                  ? "bg-emerald-950/60 border border-emerald-500/50 text-emerald-300"
                  : publishFeedback.type === "warning"
                  ? "bg-amber-950/60 border border-amber-500/50 text-amber-300"
                  : "bg-red-950/60 border border-red-500/50 text-red-300"
              }`}
            >
              {publishFeedback.type === "success" && <CheckCircle2 className="w-3.5 h-3.5" />}
              {publishFeedback.type === "warning" && <AlertCircle className="w-3.5 h-3.5" />}
              {publishFeedback.type === "error" && <AlertCircle className="w-3.5 h-3.5" />}
              <span>{publishFeedback.message}</span>
              {publishFeedback.commitUrl && (
                <a
                  href={publishFeedback.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline ml-1 font-bold flex items-center gap-1"
                >
                  VIEW COMMIT <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Split-Screen Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[640px]">
        {/* Left: Monaco MDX Code Studio */}
        <div className="flex flex-col h-[640px]">
          <div className="flex items-center justify-between px-4 py-2 bg-cyber-900 border border-b-0 border-cyber-border rounded-t-xl font-mono text-xs text-zinc-300">
            <span className="flex items-center gap-1.5 font-semibold text-cyber-cyan">
              <Terminal className="w-3.5 h-3.5" />
              MONACO MDX EDITOR // JETBRAINS MONO
            </span>
            <span className="text-[10px] text-zinc-500">UTF-8 // LF</span>
          </div>
          <div className="flex-1">
            <MonacoMdxEditor
              value={editorContent}
              onChange={setEditorContent}
              onCursorChange={(line, col) => {
                setCursorLine(line);
                setCursorCol(col);
              }}
            />
          </div>
        </div>

        {/* Right: Live MDX Preview */}
        <div className="flex flex-col h-[640px]">
          <div className="flex items-center justify-between px-4 py-2 bg-cyber-900 border border-b-0 border-cyber-border rounded-t-xl font-mono text-xs text-zinc-300">
            <span className="flex items-center gap-1.5 font-semibold text-cyber-emerald">
              <Eye className="w-3.5 h-3.5" />
              LIVE MDX PREVIEW
            </span>
            <span className="text-[10px] text-zinc-500">COMPONENTS ACTIVE</span>
          </div>
          <div className="flex-1 bg-cyber-950 border border-cyber-border rounded-b-xl p-6 overflow-y-auto shadow-2xl">
            <MdxRenderer content={editorContent} />
          </div>
        </div>
      </div>

      {/* Embedded Component Snippet Generator */}
      <DiagramGenerator onInsertSnippet={handleInsertSnippet} />

      {/* YouTube Modal */}
      <YouTubeSyncModal
        isOpen={isYoutubeModalOpen}
        onClose={() => setIsYoutubeModalOpen(false)}
        onSelectVideoDraft={handleImportVideoDraft}
      />
    </div>
  );
}

export default function AdminEditorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono text-cyber-cyan animate-pulse">MOUNTING MONACO STUDIO...</div>}>
      <EditorContent />
    </Suspense>
  );
}
