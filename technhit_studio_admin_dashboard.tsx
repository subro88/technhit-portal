import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FileText, Plus, Trash2, Edit3, Copy, Eye, Save, Upload, Image, 
  Terminal, Server, Cpu, Database, Check, ExternalLink, Search, 
  Sliders, ChevronRight, Play, AlertCircle, RefreshCw, Layers, 
  FolderGit2, Sparkles, X, Download, Code, ArrowUpRight
} from 'lucide-react';

// --- INITIAL MOCK POSTS REPOSITORY ---
const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'Deploying Local AI Cluster with Ollama & Docker GPU Passthrough',
    slug: 'deploying-local-ai-cluster-ollama-docker',
    category: 'local-ai-inference',
    status: 'Published',
    date: '2026-10-14',
    wordCount: 1420,
    youtubeId: 'dQw4w9WgXcQ',
    content: `---
title: "Deploying Local AI Cluster with Ollama & Docker GPU Passthrough"
date: "2026-10-14"
category: "local-ai-inference"
status: "Published"
youtubeId: "dQw4w9WgXcQ"
summary: "High-performance inference clustering with NVIDIA GPU pass-through on Ubuntu 24.04 LTS."
---

# Deploying Local AI Cluster with Ollama

In this companion guide to our **@TechBlogTutorial** video, we construct a scalable compute cluster for hosting LLMs (Llama 3, Mistral, Qwen) completely offline.

<InfoBox title="Hardware Requisite">
Ensure NVIDIA CUDA drivers (v550+) and the NVIDIA Container Toolkit are installed prior to starting the Docker swarm.
</InfoBox>

### 1. Verify NVIDIA GPU Container Runtime

Execute the telemetry verification command to confirm container GPU access:

<TerminalBlock command="docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi" title="NVIDIA Core Driver Verification" os="Ubuntu 24.04" />

### 2. Multi-Node Cluster Architecture

Below is our primary reverse proxy routing architecture diagram:

<ArchitectureDiagram type="cluster" title="Inference Routing Mesh" />

### 3. Deploying Ollama Service Stack

Run the containerized inference cluster daemon with automated restart policies:

<TerminalBlock command="docker compose -f docker-compose.ai.yml up -d --scale worker=2" title="Cluster Startup" os="Debian/Ubuntu" />

\`\`\`yaml
# docker-compose.ai.yml
version: '3.8'
services:
  ollama-primary:
    image: ollama/ollama:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    ports:
      - "11434:11434"
    volumes:
      - /mnt/fast-nvme/models:/root/.ollama
\`\`\`

Now test prompt generation via curl:

<TerminalBlock command="curl http://192.168.1.120:11434/api/generate -d '{\\"model\\": \\"llama3\\", \\"prompt\\": \\"Explain ZFS RAIDZ2 in 2 lines\\"}'" title="Local Inference Test" os="bash" />
`
  },
  {
    id: 'post-2',
    title: 'High Availability Proxmox VE 8 Cluster with Ceph Storage',
    slug: 'proxmox-ve-8-ha-cluster-ceph',
    category: 'clustering-virtualization',
    status: 'Published',
    date: '2026-10-10',
    wordCount: 2150,
    youtubeId: 'eBGIQ7ZuuiU',
    content: `---
title: "High Availability Proxmox VE 8 Cluster with Ceph Storage"
date: "2026-10-10"
category: "clustering-virtualization"
status: "Published"
summary: "Step-by-step configuration of 3-node enterprise hypervisor cluster with shared Ceph block storage."
---

# High Availability Proxmox VE 8 Cluster

Building a quorum-backed 3-node cluster allows virtual machine live migration without 1 millisecond of packet loss.

<TerminalBlock command="pvecm create technhit-cluster --link0 10.10.10.1" title="Corosync Cluster Initialization" os="Proxmox 8.2" />

<ArchitectureDiagram type="network" title="3-Node Corosync & Ceph Network Map" />

<InfoBox title="Quorum Safety">
Never build a two-node cluster without a low-cost QDevice Raspberry Pi witness to avoid split-brain failure scenarios.
</InfoBox>
`
  },
  {
    id: 'post-3',
    title: 'Hardening Linux Kernel with sysctl & nftables Firewall rules',
    slug: 'hardening-linux-kernel-sysctl-nftables',
    category: 'linux-server-admin',
    status: 'Draft',
    date: '2026-10-17',
    wordCount: 940,
    youtubeId: '',
    content: `---
title: "Hardening Linux Kernel with sysctl & nftables Firewall rules"
date: "2026-10-17"
category: "linux-server-admin"
status: "Draft"
summary: "Kernel-level TCP stack hardening and modern packet filtering replacing iptables."
---

# Hardening Linux Server Kernels

Draft notes for upcoming video on **@TechBlogTutorial**. We disable IP forwarding and enable TCP SYN cookies.

<TerminalBlock command="sysctl -p /etc/sysctl.d/99-hardened.conf" title="Apply Sysctl Rules" os="Linux" />
`
  }
];

export default function TechNHITStudio() {
  const [activeTab, setActiveTab] = useState('editor'); // 'posts' | 'editor' | 'assets' | 'settings'
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [currentPostId, setCurrentPostId] = useState('post-1');
  
  // Editor state
  const currentPost = posts.find(p => p.id === currentPostId) || posts[0];
  const [editorCode, setEditorCode] = useState(currentPost.content);
  const [postTitle, setPostTitle] = useState(currentPost.title);
  const [postSlug, setPostSlug] = useState(currentPost.slug);
  const [postCategory, setPostCategory] = useState(currentPost.category);
  const [postStatus, setPostStatus] = useState(currentPost.status);
  const [youtubeId, setYoutubeId] = useState(currentPost.youtubeId || '');
  const [notification, setNotification] = useState(null);
  
  // Editor helpers
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);
  const textareaRef = useRef(null);

  // Asset state
  const [assets, setAssets] = useState([
    { id: 'a1', name: 'server-cluster-topology.svg', type: 'diagram', size: '14.2 KB', date: '2026-10-15', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60' },
    { id: 'a2', name: 'proxmox-gui-setup.webp', type: 'image', size: '184 KB', date: '2026-10-12', url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Sync editor when post is switched
  useEffect(() => {
    if (currentPost) {
      setEditorCode(currentPost.content);
      setPostTitle(currentPost.title);
      setPostSlug(currentPost.slug);
      setPostCategory(currentPost.category);
      setPostStatus(currentPost.status);
      setYoutubeId(currentPost.youtubeId || '');
    }
  }, [currentPostId]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Word & character stats
  const stats = useMemo(() => {
    const text = editorCode.replace(/^---[\s\S]*?---/, '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = editorCode.length;
    const lines = editorCode.split('\n').length;
    const readTime = Math.ceil(words / 200);
    return { words, chars, lines, readTime };
  }, [editorCode]);

  // Handle Save
  const handleSavePost = (newStatus = postStatus) => {
    const updated = posts.map(p => {
      if (p.id === currentPostId) {
        return {
          ...p,
          title: postTitle,
          slug: postSlug,
          category: postCategory,
          status: newStatus,
          youtubeId,
          content: editorCode,
          wordCount: stats.words,
          date: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });
    setPosts(updated);
    setPostStatus(newStatus);
    showNotification(`Post successfully saved as ${newStatus}`);
  };

  // Create new post
  const handleCreateNewPost = () => {
    const newId = `post-${Date.now()}`;
    const newPost = {
      id: newId,
      title: 'Untitled Server Guide',
      slug: `untitled-server-guide-${Date.now().toString().slice(-4)}`,
      category: 'linux-server-admin',
      status: 'Draft',
      date: new Date().toISOString().split('T')[0],
      wordCount: 120,
      youtubeId: '',
      content: `---
title: "Untitled Server Guide"
date: "${new Date().toISOString().split('T')[0]}"
category: "linux-server-admin"
status: "Draft"
summary: "Technical notes for @TechBlogTutorial publication."
---

# Untitled Server Guide

Enter your technical tutorial or YouTube companion commands here.

<InfoBox title="Quick Note">
Verify all commands before running on production clusters.
</InfoBox>

<TerminalBlock command="uname -r && uptime" title="System Check" os="Linux" />
`
    };
    setPosts([newPost, ...posts]);
    setCurrentPostId(newId);
    setActiveTab('editor');
    showNotification('Created new draft article');
  };

  // Delete post
  const handleDeletePost = (id) => {
    if (posts.length <= 1) {
      showNotification('Cannot delete the only remaining article.');
      return;
    }
    const filtered = posts.filter(p => p.id !== id);
    setPosts(filtered);
    if (currentPostId === id) {
      setCurrentPostId(filtered[0].id);
    }
    showNotification('Article deleted from workspace');
  };

  // Duplicate post
  const handleDuplicatePost = (post) => {
    const dupId = `post-${Date.now()}`;
    const duplicated = {
      ...post,
      id: dupId,
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy`,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0]
    };
    setPosts([duplicated, ...posts]);
    showNotification('Duplicated article as draft');
  };

  // Quick insertion helpers for editor
  const insertSnippet = (snippet) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = editorCode;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newText = before + snippet + after;
    setEditorCode(newText);
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 50);
  };

  // Track cursor position
  const handleTextareaSelect = (e) => {
    const text = e.target.value.substr(0, e.target.selectionStart);
    const lines = text.split('\n');
    setCursorLine(lines.length);
    setCursorCol(lines[lines.length - 1].length + 1);
  };

  // Download raw MDX
  const handleDownloadMDX = () => {
    const blob = new Blob([editorCode], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${postSlug}.mdx`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification(`Exported ${postSlug}.mdx`);
  };

  // Filtered posts for manager
  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex h-screen w-full bg-[#07090e] text-zinc-100 font-sans overflow-hidden select-none">
      
      {/* --- NOTIFICATION TOAST --- */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0e1420] border border-cyan-500/50 text-cyan-300 px-4 py-2.5 rounded-lg shadow-2xl font-mono text-xs backdrop-blur-md animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* --- WORKSPACE SIDEBAR --- */}
      <aside className="w-64 border-r border-zinc-800/80 bg-[#090c13] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Channel Telemetry */}
          <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-black font-black text-xs font-mono shadow-[0_0_15px_rgba(0,245,212,0.3)]">
                TN
              </div>
              <div>
                <h1 className="font-mono text-xs font-bold tracking-wider text-white">TECHNHIT STUDIO</h1>
                <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  @TechBlogTutorial
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'editor' 
                  ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/50' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Code className="w-4 h-4" />
                <span>MDX Editor Studio</span>
              </div>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Live</span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'posts' 
                  ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/50' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Post Manager</span>
              </div>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 font-mono">
                {posts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assets')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'assets' 
                  ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/50' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Image className="w-4 h-4" />
                <span>Assets & Diagrams</span>
              </div>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{assets.length}</span>
            </button>
          </nav>

          {/* Quick Category Jump */}
          <div className="px-4 pt-4 pb-2 text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
            Niche Channels
          </div>
          <div className="px-3 space-y-1 font-mono text-[11px]">
            <div className="flex items-center gap-2 px-3 py-1.5 text-zinc-400 hover:text-cyan-300 transition-colors">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>/linux-server-admin</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-zinc-400 hover:text-emerald-300 transition-colors">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>/clustering-virtual</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-zinc-400 hover:text-purple-300 transition-colors">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>/local-ai-inference</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-zinc-400 hover:text-amber-300 transition-colors">
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>/video-companions</span>
            </div>
          </div>
        </div>

        {/* Footer Quick Action */}
        <div className="p-3 border-t border-zinc-800/80">
          <button
            onClick={handleCreateNewPost}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-semibold font-mono text-xs py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(0,245,212,0.2)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Guide / Draft</span>
          </button>
        </div>
      </aside>

      {/* --- PRIMARY WORKSPACE CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#07090e]">

        {/* ============================================================== */}
        {/* VIEW 1: SPLIT SCREEN MONACO-STYLE MDX WORKBENCH                */}
        {/* ============================================================== */}
        {activeTab === 'editor' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Top Command Toolbar */}
            <header className="h-14 border-b border-zinc-800/80 bg-[#0a0d14] px-5 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-white focus:outline-none focus:border-b focus:border-cyan-400 px-1 py-0.5 w-72 md:w-96 truncate"
                  placeholder="Article Title..."
                />

                <span className="text-zinc-600">|</span>

                {/* Category Selector */}
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="linux-server-admin">Linux Server Admin</option>
                  <option value="clustering-virtualization">Clustering & Virtualization</option>
                  <option value="local-ai-inference">Local AI Inference</option>
                  <option value="video-companions">Video Companion</option>
                </select>

                {/* Status Toggle */}
                <button
                  onClick={() => setPostStatus(postStatus === 'Published' ? 'Draft' : 'Published')}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                    postStatus === 'Published'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                      : 'bg-amber-950/60 border-amber-500 text-amber-400'
                  }`}
                >
                  {postStatus}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadMDX}
                  title="Export .mdx file"
                  className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded hover:border-zinc-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleSavePost('Draft')}
                  className="px-3 py-1.5 text-xs font-mono bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition-colors"
                >
                  Save Draft
                </button>

                <button
                  onClick={() => handleSavePost('Published')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold bg-cyan-400 hover:bg-cyan-300 text-black rounded transition-all shadow-[0_0_15px_rgba(0,245,212,0.3)]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </header>

            {/* Quick Insertion Palette */}
            <div className="h-10 border-b border-zinc-800/80 bg-[#080b11] px-5 flex items-center justify-between text-xs font-mono text-zinc-400 shrink-0">
              <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                <span className="text-[10px] text-zinc-400 mr-2 uppercase tracking-wider">Snippets:</span>
                <button 
                  onClick={() => insertSnippet('<TerminalBlock command="curl -fsSL https://technhit.in/install.sh | bash" title="Install Script" os="Ubuntu" />\n')}
                  className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 hover:text-cyan-300 border border-zinc-800 rounded text-[11px] transition-colors"
                >
                  + TerminalBlock
                </button>
                <button 
                  onClick={() => insertSnippet('<ArchitectureDiagram type="cluster" title="Kubernetes Cluster Mesh" />\n')}
                  className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 hover:text-emerald-300 border border-zinc-800 rounded text-[11px] transition-colors"
                >
                  + ClusterDiagram
                </button>
                <button 
                  onClick={() => insertSnippet('<InfoBox title="Notice">\nImportant production note here.\n</InfoBox>\n')}
                  className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 hover:text-amber-300 border border-zinc-800 rounded text-[11px] transition-colors"
                >
                  + InfoBox
                </button>
                <button 
                  onClick={() => insertSnippet('```bash\n# Production config\nsudo systemctl restart docker\n```\n')}
                  className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800 rounded text-[11px] transition-colors"
                >
                  + CodeFence
                </button>
              </div>

              {/* YouTube video synchronization */}
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-red-400" />
                <span className="text-[11px] text-zinc-400">YT ID:</span>
                <input
                  type="text"
                  placeholder="e.g. dQw4w9WgXcQ"
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-200 w-28 focus:outline-none focus:border-red-400"
                />
              </div>
            </div>

            {/* Split Screen Container */}
            <div className="flex-1 flex min-h-0">
              
              {/* LEFT PANE: Monaco-Style Code Editor */}
              <div className="w-1/2 border-r border-zinc-800/80 flex flex-col bg-[#07090e]">
                <div className="h-7 bg-[#0b0e15] px-4 border-b border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{postSlug}.mdx</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <span>UTF-8</span>
                    <span>MDX / React</span>
                  </div>
                </div>

                <div className="flex-1 flex overflow-hidden font-mono text-xs leading-relaxed">
                  {/* Line Numbers Simulation */}
                  <div className="w-12 bg-[#090b11] py-4 text-right pr-3 select-none text-zinc-400 font-mono text-[11px] border-r border-zinc-900 shrink-0">
                    {Array.from({ length: Math.max(stats.lines, 30) }, (_, i) => (
                      <div 
                        key={i} 
                        className={i + 1 === cursorLine ? "text-cyan-400 font-bold bg-cyan-950/30" : ""}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Code Editor Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={editorCode}
                    onChange={(e) => setEditorCode(e.target.value)}
                    onKeyUp={handleTextareaSelect}
                    onClick={handleTextareaSelect}
                    className="flex-1 bg-[#07090e] p-4 text-zinc-200 resize-none focus:outline-none font-mono text-xs leading-relaxed selection:bg-cyan-900/60 selection:text-white"
                    spellCheck={false}
                  />
                </div>

                {/* Editor Status Bar */}
                <div className="h-6 bg-[#080b10] border-t border-zinc-800/80 px-4 flex items-center justify-between text-[10px] font-mono text-zinc-400 shrink-0">
                  <div className="flex items-center gap-4">
                    <span>Ln {cursorLine}, Col {cursorCol}</span>
                    <span>{stats.lines} Lines</span>
                    <span>{stats.words} Words</span>
                    <span>~{stats.readTime} min read</span>
                  </div>
                  <div className="flex items-center gap-3 text-emerald-400">
                    <span>Syntax: OK</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                </div>
              </div>

              {/* RIGHT PANE: Live MDX Rendered Output */}
              <div className="w-1/2 flex flex-col bg-[#05070a]">
                <div className="h-7 bg-[#0b0e15] px-4 border-b border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Telemetry Preview (Next.js Hybrid)</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">https://technhit.in/{postCategory}/{postSlug}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-8 text-zinc-300">
                  <PreviewRenderer content={editorCode} youtubeId={youtubeId} />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: POST MANAGER (DRAFTS / PUBLISHED / TABLE)               */}
        {/* ============================================================== */}
        {activeTab === 'posts' && (
          <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            {/* Header / Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  POST DIRECTORY & REPOSITORY
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Managed entries compiling to static Next.js route payloads in `/content`
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreateNewPost}
                  className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-semibold px-4 py-2 rounded-lg text-xs transition-colors shadow-[0_0_15px_rgba(0,245,212,0.25)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Guide</span>
                </button>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[#0b0e15] p-3 rounded-lg border border-zinc-800/80">
              <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-zinc-400 ml-1" />
                <input
                  type="text"
                  placeholder="Search articles by title, slug or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-full font-mono"
                />
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-zinc-400 text-[11px]">Category:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">All Channels</option>
                  <option value="linux-server-admin">Linux Server Admin</option>
                  <option value="clustering-virtualization">Clustering & Virtual</option>
                  <option value="local-ai-inference">Local AI Inference</option>
                  <option value="video-companions">Video Companions</option>
                </select>
              </div>
            </div>

            {/* Articles Table */}
            <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-[#090c13] shadow-2xl">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0e121b] border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Title & Slug</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Word Count</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white hover:text-cyan-400 cursor-pointer transition-colors"
                             onClick={() => { setCurrentPostId(post.id); setActiveTab('editor'); }}>
                          {post.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-2">
                          <span>/{post.slug}</span>
                          {post.youtubeId && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-red-400 bg-red-950/40 px-1.5 py-0.2 rounded border border-red-900/50">
                              <Play className="w-2.5 h-2.5 fill-red-400" /> YT Video
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] border ${
                          post.category === 'linux-server-admin' ? 'bg-cyan-950/50 text-cyan-300 border-cyan-800/50' :
                          post.category === 'clustering-virtualization' ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50' :
                          post.category === 'local-ai-inference' ? 'bg-purple-950/50 text-purple-300 border-purple-800/50' :
                          'bg-amber-950/50 text-amber-300 border-amber-800/50'
                        }`}>
                          {post.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                          post.status === 'Published' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'Published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {post.wordCount} words
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {post.date}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setCurrentPostId(post.id); setActiveTab('editor'); }}
                            title="Edit in Studio"
                            className="p-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 rounded transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicatePost(post)}
                            title="Duplicate as draft"
                            className="p-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 rounded transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            title="Delete article"
                            className="p-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-red-400 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-zinc-500 font-mono">
                        No articles found matching query criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: ASSETS & DIAGRAM GENERATOR                             */}
        {/* ============================================================== */}
        {activeTab === 'assets' && (
          <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-emerald-400" />
                  ASSET & DIAGRAM WORKBENCH
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Upload server diagrams, topologies, or generate inline SVG architecture plots
                </p>
              </div>

              <label className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Upload className="w-4 h-4" />
                <span>Upload Media</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const newAsset = {
                        id: `a-${Date.now()}`,
                        name: file.name,
                        type: file.type.includes('svg') ? 'diagram' : 'image',
                        size: `${(file.size / 1024).toFixed(1)} KB`,
                        date: new Date().toISOString().split('T')[0],
                        url: URL.createObjectURL(file)
                      };
                      setAssets([newAsset, ...assets]);
                      showNotification(`Asset ${file.name} uploaded`);
                    }
                  }}
                />
              </label>
            </div>

            {/* Quick Generator Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div 
                onClick={() => {
                  insertSnippet('\n<ArchitectureDiagram type="cluster" title="Kubernetes Cluster Mesh" />\n');
                  setActiveTab('editor');
                  showNotification('Inserted Cluster Diagram component into Editor');
                }}
                className="bg-[#0b0e15] border border-zinc-800 hover:border-cyan-500/60 p-4 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                    <Server className="w-4 h-4" /> Cluster Mesh Diagram
                  </span>
                  <Plus className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400" />
                </div>
                <p className="text-[11px] text-zinc-400">Generates 3-node HA routing matrix with ingress proxy and worker blades.</p>
              </div>

              <div 
                onClick={() => {
                  insertSnippet('\n<ArchitectureDiagram type="network" title="ZFS & Ceph Storage Fabric" />\n');
                  setActiveTab('editor');
                  showNotification('Inserted Storage Diagram component into Editor');
                }}
                className="bg-[#0b0e15] border border-zinc-800 hover:border-emerald-500/60 p-4 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Database className="w-4 h-4" /> Storage Topology
                  </span>
                  <Plus className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400" />
                </div>
                <p className="text-[11px] text-zinc-400">Generates Ceph pool, ZFS RAIDZ2 mirror blocks, and NVMe cache layer.</p>
              </div>

              <div 
                onClick={() => {
                  insertSnippet('\n<ArchitectureDiagram type="ai" title="Local LLM Inference Pipeline" />\n');
                  setActiveTab('editor');
                  showNotification('Inserted AI Pipeline component into Editor');
                }}
                className="bg-[#0b0e15] border border-zinc-800 hover:border-purple-500/60 p-4 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> AI Inference Pipeline
                  </span>
                  <Plus className="w-4 h-4 text-zinc-500 group-hover:text-purple-400" />
                </div>
                <p className="text-[11px] text-zinc-400">Generates Ollama/vLLM compute cards with PyTorch CUDA memory pipes.</p>
              </div>
            </div>

            {/* Asset Library Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="bg-[#090c13] border border-zinc-800/80 rounded-xl overflow-hidden group">
                  <div className="h-32 bg-zinc-950 relative overflow-hidden flex items-center justify-center">
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090c13] to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-zinc-900/90 text-cyan-400 px-2 py-0.5 rounded border border-zinc-800">
                      {asset.type}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-mono text-xs text-white truncate font-medium">{asset.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mt-1">
                      <span>{asset.size}</span>
                      <span>{asset.date}</span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                      <button
                        onClick={() => {
                          insertSnippet(`\n![${asset.name}](${asset.url})\n`);
                          setActiveTab('editor');
                          showNotification(`Inserted image tag into MDX`);
                        }}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Insert in Post
                      </button>
                      <button
                        onClick={() => {
                          setAssets(assets.filter(a => a.id !== asset.id));
                          showNotification('Asset removed');
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS: LIVE MDX SIMULATOR & RENDERER ---

function PreviewRenderer({ content, youtubeId }) {
  // Strip YAML frontmatter for rendering body
  const body = content.replace(/^---[\s\S]*?---/, '').trim();
  const lines = body.split('\n');

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Frontmatter Pill */}
      <div className="p-4 rounded-lg bg-[#0a0e16] border border-cyan-900/40 text-xs font-mono text-zinc-400 flex items-center justify-between">
        <div>
          <span className="text-cyan-400 font-bold uppercase tracking-wider">Live Preview Context</span>
          <p className="text-[11px] text-zinc-400 mt-0.5">Parsed via Next.js Shiki & Tailwind Typography Engine</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[10px]">MDX Remote</span>
        </div>
      </div>

      {/* Embedded YouTube companion video if configured */}
      {youtubeId && (
        <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-video relative shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="TechBlogTutorial Companion Video"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}

      {/* Render Markdown Blocks */}
      {lines.map((line, idx) => {
        // Heading 1
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-3xl font-extrabold text-white tracking-tight font-sans border-b border-zinc-800 pb-3 mt-6">{line.replace('# ', '')}</h1>;
        }
        // Heading 2
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold text-cyan-300 tracking-tight font-sans mt-6">{line.replace('## ', '')}</h2>;
        }
        // Heading 3
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-lg font-semibold text-zinc-100 font-sans mt-4">{line.replace('### ', '')}</h3>;
        }
        // Custom TerminalBlock component
        if (line.includes('<TerminalBlock')) {
          const cmdMatch = line.match(/command="([^"]+)"/);
          const titleMatch = line.match(/title="([^"]+)"/);
          const osMatch = line.match(/os="([^"]+)"/);
          return (
            <TerminalBlockComponent
              key={idx}
              command={cmdMatch ? cmdMatch[1] : 'ls -la'}
              title={titleMatch ? titleMatch[1] : 'Shell Command'}
              os={osMatch ? osMatch[1] : 'Linux'}
            />
          );
        }
        // Custom ArchitectureDiagram component
        if (line.includes('<ArchitectureDiagram')) {
          const typeMatch = line.match(/type="([^"]+)"/);
          const titleMatch = line.match(/title="([^"]+)"/);
          return (
            <ArchitectureDiagramComponent
              key={idx}
              type={typeMatch ? typeMatch[1] : 'cluster'}
              title={titleMatch ? titleMatch[1] : 'Cluster Architecture'}
            />
          );
        }
        // Custom InfoBox component
        if (line.includes('<InfoBox')) {
          const titleMatch = line.match(/title="([^"]+)"/);
          return (
            <div key={idx} className="p-4 my-4 rounded-lg bg-cyan-950/20 border-l-4 border-cyan-400 text-xs font-mono text-zinc-300">
              <span className="text-cyan-300 font-bold block mb-1">
                {titleMatch ? titleMatch[1] : 'Note'}
              </span>
              <span>Review requirements before executing cluster reconfiguration.</span>
            </div>
          );
        }
        // Standard paragraph
        if (line.trim() && !line.startsWith('```') && !line.startsWith('#') && !line.startsWith('---')) {
          return <p key={idx} className="text-sm text-zinc-300 leading-relaxed font-sans">{line}</p>;
        }
        return null;
      })}
    </div>
  );
}

// --- INTERACTIVE TERMINAL BLOCK COMPONENT ---
function TerminalBlockComponent({ command, title, os }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-lg bg-[#07090e] border border-zinc-800/90 font-mono text-xs overflow-hidden shadow-2xl">
      <div className="bg-[#0d1117] px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between text-zinc-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-zinc-200">{title}</span>
          <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{os}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-cyan-300 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-4 text-emerald-400 overflow-x-auto flex items-center gap-2">
        <span className="text-zinc-600 select-none">$</span>
        <code className="text-zinc-200">{command}</code>
      </div>
    </div>
  );
}

// --- LIVE ARCHITECTURE DIAGRAM GENERATOR ---
function ArchitectureDiagramComponent({ type, title }) {
  return (
    <div className="my-6 p-5 rounded-xl bg-[#080b12] border border-zinc-800 font-mono text-xs shadow-2xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-zinc-200">{title}</span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
          MESH STATUS: ACTIVE
        </span>
      </div>

      {/* Topology Flow Visualization */}
      <div className="grid grid-cols-3 gap-3 text-center my-3">
        <div className="p-3 bg-[#0d121c] border border-cyan-800/40 rounded-lg">
          <div className="text-cyan-400 font-bold mb-1">NODE 01</div>
          <div className="text-[10px] text-zinc-400">Ubuntu 24.04</div>
          <div className="mt-2 text-[10px] bg-cyan-950/60 text-cyan-300 py-0.5 rounded">Proxmox PVE</div>
        </div>

        <div className="p-3 bg-[#0d121c] border border-emerald-800/40 rounded-lg">
          <div className="text-emerald-400 font-bold mb-1">NODE 02</div>
          <div className="text-[10px] text-zinc-400">K8s Ingress</div>
          <div className="mt-2 text-[10px] bg-emerald-950/60 text-emerald-300 py-0.5 rounded">Traefik Proxy</div>
        </div>

        <div className="p-3 bg-[#0d121c] border border-purple-800/40 rounded-lg">
          <div className="text-purple-400 font-bold mb-1">NODE 03</div>
          <div className="text-[10px] text-zinc-400">GPU Compute</div>
          <div className="mt-2 text-[10px] bg-purple-950/60 text-purple-300 py-0.5 rounded">Ollama Matrix</div>
        </div>
      </div>

      <div className="text-center text-[10px] text-zinc-500 mt-2">
        ⇄ Corosync Cluster Ring: 10.10.10.0/24 (Sub-millisecond Latency) ⇄
      </div>
    </div>
  );
}