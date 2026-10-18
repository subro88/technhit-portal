export interface YouTubeVideoItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  duration?: string;
  suggestedSlug: string;
  suggestedMdx: string;
}

export async function fetchChannelVideos(apiKey?: string): Promise<YouTubeVideoItem[]> {
  if (!apiKey || apiKey.startsWith("AIzaSyPlaceholder") || apiKey.trim() === "") {
    return getCuratedTechBlogTutorialVideos();
  }

  try {
    // 1. Resolve channel handle @TechBlogTutorial
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=TechBlogTutorial&type=video&maxResults=8&key=${apiKey}`;
    const res = await fetch(searchUrl, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.warn("YouTube API error, falling back to curated video stream:", res.statusText);
      return getCuratedTechBlogTutorialVideos();
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      return getCuratedTechBlogTutorialVideos();
    }

    return data.items.map((item: any) => {
      const vidId = item.id.videoId;
      const title = item.snippet.title;
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return {
        id: vidId,
        title: title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt.split("T")[0],
        thumbnail: item.snippet.thumbnails?.high?.url || `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
        suggestedSlug: slug,
        suggestedMdx: generateDraftMdx(title, slug, vidId, item.snippet.description),
      };
    });
  } catch (err) {
    console.error("YouTube Fetch Exception:", err);
    return getCuratedTechBlogTutorialVideos();
  }
}

export function generateDraftMdx(title: string, slug: string, videoId: string, description: string): string {
  const today = new Date().toISOString().split("T")[0];
  return `---
title: "${title.replace(/"/g, '\\"')}"
date: "${today}"
category: "video-companions"
status: "Draft"
youtubeId: "${videoId}"
summary: "${description.slice(0, 140).replace(/"/g, '\\"')}..."
---

# ${title}

In this companion guide to our **@TechBlogTutorial** video, we walk through the architecture, configuration files, and terminal setup demonstrated on YouTube.

<YouTubeEmbed videoId="${videoId}" title="${title.replace(/"/g, '\\"')}" />

<InfoBox title="Companion Note">
All configuration diffs and terminal snippets below directly correspond to the timestamps in the video.
</InfoBox>

### 1. Initial Verification

Verify your environment prerequisites before deploying the cluster:

<TerminalBlock command="uname -a && docker info" title="System Check" os="Linux" />
`;
}

export function getCuratedTechBlogTutorialVideos(): YouTubeVideoItem[] {
  return [
    {
      id: "dQw4w9WgXcQ",
      title: "Building an Autonomous Local AI Compute Cluster with Ollama & Docker GPU Passthrough",
      description: "Complete walkthrough setting up multi-GPU Docker Swarm for local LLM inference without cloud costs.",
      publishedAt: "2026-10-14",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      suggestedSlug: "autonomous-local-ai-compute-cluster-ollama",
      suggestedMdx: generateDraftMdx(
        "Building an Autonomous Local AI Compute Cluster with Ollama & Docker GPU Passthrough",
        "autonomous-local-ai-compute-cluster-ollama",
        "dQw4w9WgXcQ",
        "Complete walkthrough setting up multi-GPU Docker Swarm for local LLM inference."
      ),
    },
    {
      id: "eBGIQ7ZuuiU",
      title: "Proxmox VE 8.2 Enterprise HA Cluster with Ceph NVMe Storage Pool",
      description: "How to configure a 3-node quorum cluster with Ceph distributed block storage and zero downtime migration.",
      publishedAt: "2026-10-10",
      thumbnail: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800&auto=format&fit=crop&q=80",
      suggestedSlug: "proxmox-ve-8-2-ha-cluster-ceph-nvme",
      suggestedMdx: generateDraftMdx(
        "Proxmox VE 8.2 Enterprise HA Cluster with Ceph NVMe Storage Pool",
        "proxmox-ve-8-2-ha-cluster-ceph-nvme",
        "eBGIQ7ZuuiU",
        "How to configure a 3-node quorum cluster with Ceph distributed block storage."
      ),
    },
    {
      id: "3fumBcKC6RE",
      title: "Linux Kernel Network Hardening: sysctl, TCP SYN Cookies & nftables Rules",
      description: "Deep dive into kernel parameter tuning, mitigating DDoS flood attacks and replacing iptables with modern nftables.",
      publishedAt: "2026-10-05",
      thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80",
      suggestedSlug: "linux-kernel-network-hardening-sysctl-nftables",
      suggestedMdx: generateDraftMdx(
        "Linux Kernel Network Hardening: sysctl, TCP SYN Cookies & nftables Rules",
        "linux-kernel-network-hardening-sysctl-nftables",
        "3fumBcKC6RE",
        "Deep dive into kernel parameter tuning, mitigating DDoS flood attacks."
      ),
    },
    {
      id: "WUvTyaaNjfo",
      title: "10+2 Calculus & Physics: Physical & Geometric Meaning of Derivatives",
      description: "Interactive visual tutorial on instantaneous rate of change, tangent slopes, and particle dynamics for 10+2 STEM students.",
      publishedAt: "2026-10-02",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
      suggestedSlug: "10-plus-2-calculus-physics-derivatives-meaning",
      suggestedMdx: generateDraftMdx(
        "10+2 Calculus & Physics: Physical & Geometric Meaning of Derivatives",
        "10-plus-2-calculus-physics-derivatives-meaning",
        "WUvTyaaNjfo",
        "Interactive visual tutorial on instantaneous rate of change and tangent slopes for 10+2 STEM students."
      ),
    },
  ];
}
