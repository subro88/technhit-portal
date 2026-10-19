import React from "react";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import TechArticleJsonLd from "@/components/seo/TechArticleJsonLd";
import VideoJsonLd from "@/components/seo/VideoJsonLd";
import Link from "next/link";
import { Terminal, Calendar, Clock, ArrowLeft, Share2, Youtube, Shield } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug("linux-server-admin", slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} | TechNHIT Linux Admin`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://technhit.in/linux-server-admin/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export const revalidate = 60;

export default async function LinuxArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug("linux-server-admin", slug);

  if (!post) {
    notFound();
  }

  const articleUrl = `https://technhit.in/linux-server-admin/${post.slug}`;

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* JSON-LD Schemas */}
      <TechArticleJsonLd
        title={post.title}
        description={post.summary}
        datePublished={post.date}
        url={articleUrl}
        proficiencyLevel="Expert"
        dependencies={["Ubuntu 24.04", "Linux Kernel", "sysctl", "nftables"]}
      />

      {post.youtubeId && (
        <VideoJsonLd
          name={post.title}
          description={post.summary}
          thumbnailUrl={`https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`}
          uploadDate={post.date}
          embedUrl={`https://www.youtube.com/embed/${post.youtubeId}`}
        />
      )}

      {/* Back Link */}
      <div>
        <Link
          href="/linux-server-admin"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO LINUX ADMIN TRACK</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-cyber-border">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
            LINUX SYSADMIN
          </span>
          <span className="text-zinc-500">•</span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.date}</span>
          </span>
          <span className="text-zinc-500">•</span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime} MIN READ</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-mono text-zinc-100 tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base text-zinc-400 font-sans leading-relaxed">
          {post.summary}
        </p>
      </header>

      {/* Article Body Rendered via MdxRenderer */}
      <div className="bg-cyber-900 border border-cyber-border rounded-2xl p-6 sm:p-10 shadow-2xl">
        <MdxRenderer content={post.content} />
      </div>

      {/* Footer Author Box */}
      <footer className="p-6 rounded-xl bg-cyber-900 border border-cyber-border flex items-center justify-between font-mono text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyber-800 border border-cyber-border flex items-center justify-center text-cyber-cyan font-bold">
            TN
          </div>
          <div>
            <div className="text-zinc-200 font-semibold">TechNHIT Engineering Team</div>
            <div className="text-[11px] text-zinc-500">Autonomous Infrastructure & Linux Kernel Lab</div>
          </div>
        </div>

        {post.youtubeId && (
          <a
            href={`https://youtube.com/watch?v=${post.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-600/40 hover:bg-red-600 hover:text-white transition-all"
          >
            <Youtube className="w-4 h-4 fill-current" />
            <span>WATCH COMPANION</span>
          </a>
        )}
      </footer>
    </article>
  );
}
