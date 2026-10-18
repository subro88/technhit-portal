"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, Plus, Edit3, Trash2, Copy, Search, 
  Youtube, ArrowUpRight, CheckCircle2, Clock, 
  Terminal, Server, Cpu, BookOpen, Filter, Sparkles
} from "lucide-react";
import YouTubeSyncModal from "@/components/admin/YouTubeSyncModal";
import { YouTubeVideoItem } from "@/lib/youtube";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "Published" | "Draft";
  date: string;
  wordCount: number;
  youtubeId?: string;
}

const INITIAL_POSTS: PostItem[] = [
  {
    id: "post-1",
    title: "Deploying Local AI Cluster with Ollama & Docker GPU Passthrough",
    slug: "deploying-local-ai-cluster-ollama-docker",
    category: "local-ai-inference",
    status: "Published",
    date: "2026-10-14",
    wordCount: 1420,
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "post-2",
    title: "High Availability Proxmox VE 8 Cluster with Ceph Storage",
    slug: "proxmox-ve-8-ha-cluster-ceph",
    category: "clustering-virtualization",
    status: "Published",
    date: "2026-10-10",
    wordCount: 2150,
    youtubeId: "eBGIQ7ZuuiU",
  },
  {
    id: "post-3",
    title: "Hardening Linux Kernel with sysctl & nftables Firewall rules",
    slug: "hardening-linux-kernel-sysctl-nftables",
    category: "linux-server-admin",
    status: "Published",
    date: "2026-10-17",
    wordCount: 1680,
    youtubeId: "3fumBcKC6RE",
  },
  {
    id: "post-4",
    title: "10+2 Calculus: Physical & Geometric Meaning of Derivatives",
    slug: "10-plus-2-calculus-derivatives-rate-of-change",
    category: "stem-10-plus-2",
    status: "Published",
    date: "2026-10-16",
    wordCount: 1850,
    youtubeId: "WUvTyaaNjfo",
  },
];

export default function AdminDirectoryPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, categoryFilter]);

  // Analytics computation
  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "Published").length;
    const drafts = posts.filter((p) => p.status === "Draft").length;
    const words = posts.reduce((acc, p) => acc + p.wordCount, 0);
    return { total, published, drafts, words };
  }, [posts]);

  // Toggle status
  const toggleStatus = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === "Published" ? "Draft" : "Published";
          showToast(`Toggled ${p.slug} to ${nextStatus}`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Delete post
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this publication?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast("Post removed from repository.");
    }
  };

  // Import video draft
  const handleImportVideoDraft = (video: YouTubeVideoItem) => {
    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      title: video.title,
      slug: video.suggestedSlug,
      category: "video-companions",
      status: "Draft",
      date: video.publishedAt,
      wordCount: 420,
      youtubeId: video.id,
    };
    setPosts([newPost, ...posts]);
    showToast(`Imported YouTube Companion draft: "${video.title}"`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-cyber-900 border border-cyber-cyan text-cyber-cyan text-xs font-mono shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
          <span>{toast}</span>
        </div>
      )}

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-cyber-900 border border-cyber-border">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">TOTAL PUBLICATIONS</span>
          <span className="text-2xl font-bold font-mono text-zinc-100">{stats.total}</span>
        </div>
        <div className="p-4 rounded-xl bg-cyber-900 border border-cyber-border">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">PUBLISHED BLUEPRINTS</span>
          <span className="text-2xl font-bold font-mono text-cyber-emerald">{stats.published}</span>
        </div>
        <div className="p-4 rounded-xl bg-cyber-900 border border-cyber-border">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">ACTIVE DRAFTS</span>
          <span className="text-2xl font-bold font-mono text-cyber-amber">{stats.drafts}</span>
        </div>
        <div className="p-4 rounded-xl bg-cyber-900 border border-cyber-border">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">TOTAL REPOSITORY WORDS</span>
          <span className="text-2xl font-bold font-mono text-cyber-purple">{stats.words.toLocaleString()}</span>
        </div>
      </div>

      {/* Directory Action Bar */}
      <div className="p-4 rounded-xl bg-cyber-900 border border-cyber-border flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs shadow-xl">
        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides by title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-cyber-950 border border-cyber-border text-zinc-200 focus:outline-none focus:border-cyber-cyan cursor-pointer"
            >
              <option value="all">All Tracks</option>
              <option value="linux-server-admin">Linux Server Admin</option>
              <option value="clustering-virtualization">Clustering & Virtualization</option>
              <option value="local-ai-inference">Local AI Compute</option>
              <option value="stem-10-plus-2">10+2 Math & STEM</option>
              <option value="video-companions">YouTube Companions</option>
            </select>
          </div>
        </div>

        {/* Buttons: Sync YouTube + New Post */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsYoutubeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-600/40 hover:bg-red-600 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>SYNC YOUTUBE</span>
          </button>

          <Link
            href="/admin/editor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan text-cyber-950 font-bold hover:bg-cyan-300 transition-all cursor-pointer shrink-0 shadow-lg"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW PUBLICATION</span>
          </Link>
        </div>
      </div>

      {/* Publications Table */}
      <div className="rounded-xl bg-cyber-900 border border-cyber-border overflow-hidden shadow-2xl font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-cyber-950 border-b border-cyber-border text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3 font-semibold">Title & Slug</th>
                <th className="px-5 py-3 font-semibold">Track Category</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Word Count</th>
                <th className="px-5 py-3 font-semibold">Published Date</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/60">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-cyber-850/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-zinc-100 flex items-center gap-2">
                      <span>{post.title}</span>
                      {post.youtubeId && (
                        <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500">/{post.slug}</span>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-cyber-800 text-zinc-300 border border-cyber-border/60 text-[10px]">
                      {post.category}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleStatus(post.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer border ${
                        post.status === "Published"
                          ? "bg-cyber-emerald/15 text-cyber-emerald border-cyber-emerald/30 hover:bg-cyber-emerald/25"
                          : "bg-cyber-amber/15 text-cyber-amber border-cyber-amber/30 hover:bg-cyber-amber/25"
                      }`}
                    >
                      {post.status}
                    </button>
                  </td>

                  <td className="px-5 py-3.5 text-zinc-400">
                    {post.wordCount.toLocaleString()} words
                  </td>

                  <td className="px-5 py-3.5 text-zinc-400">
                    {post.date}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/editor?slug=${post.slug}&category=${post.category}`}
                        className="p-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-750 text-cyber-cyan transition-colors cursor-pointer"
                        title="Edit in Monaco Studio"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded-lg bg-cyber-800 hover:bg-red-950/40 text-red-400 transition-colors cursor-pointer"
                        title="Delete publication"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* YouTube Ingest Modal */}
      <YouTubeSyncModal
        isOpen={isYoutubeModalOpen}
        onClose={() => setIsYoutubeModalOpen(false)}
        onSelectVideoDraft={handleImportVideoDraft}
      />
    </div>
  );
}
