import React from "react";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import TechArticleJsonLd from "@/components/seo/TechArticleJsonLd";
import VideoJsonLd from "@/components/seo/VideoJsonLd";
import Link from "next/link";
import { Youtube, Calendar, Clock, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug("video-companions", slug);
  if (!post) return { title: "Companion Guide Not Found" };

  return {
    title: `${post.title} | @TechBlogTutorial Companion`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://technhit.in/video-companions/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function VideoCompanionArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug("video-companions", slug);

  if (!post) {
    notFound();
  }

  const articleUrl = `https://technhit.in/video-companions/${post.slug}`;

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <TechArticleJsonLd
        title={post.title}
        description={post.summary}
        datePublished={post.date}
        url={articleUrl}
        proficiencyLevel="Intermediate"
        dependencies={["YouTube Companion", "Docker", "Linux"]}
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

      <div>
        <Link
          href="/video-companions"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO VIDEO COMPANIONS TRACK</span>
        </Link>
      </div>

      <header className="space-y-4 pb-6 border-b border-cyber-border">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded bg-red-600/10 text-red-400 border border-red-600/30">
            @TECHBLOGTUTORIAL COMPANION
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

      <div className="bg-cyber-900 border border-cyber-border rounded-2xl p-6 sm:p-10 shadow-2xl">
        <MdxRenderer content={post.content} />
      </div>

      <footer className="p-6 rounded-xl bg-cyber-900 border border-cyber-border flex items-center justify-between font-mono text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyber-800 border border-cyber-border flex items-center justify-center text-red-500 font-bold">
            YT
          </div>
          <div>
            <div className="text-zinc-200 font-semibold">TechBlogTutorial YouTube Media Team</div>
            <div className="text-[11px] text-zinc-500">Autonomous Video Blueprint Publishing Engine</div>
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
            <span>WATCH ON YOUTUBE</span>
          </a>
        )}
      </footer>
    </article>
  );
}
