import React from "react";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import TechArticleJsonLd from "@/components/seo/TechArticleJsonLd";
import VideoJsonLd from "@/components/seo/VideoJsonLd";
import { ReadingCompanionDock } from "@/components/stem/ReadingCompanionDock";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowLeft, Youtube, FunctionSquare } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug("stem-10-plus-2", slug);
  if (!post) return { title: "Lesson Not Found" };

  return {
    title: `${post.title} | TechNHIT 10+2 STEM Lab`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://technhit.in/stem-10-plus-2/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function StemArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug("stem-10-plus-2", slug);

  if (!post) {
    notFound();
  }

  const articleUrl = `https://technhit.in/stem-10-plus-2/${post.slug}`;

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <TechArticleJsonLd
        title={post.title}
        description={post.summary}
        datePublished={post.date}
        url={articleUrl}
        proficiencyLevel="Intermediate"
        dependencies={["Calculus", "Vectors", "10+2 Physics"]}
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
          href="/stem-10-plus-2"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ink-soft,#a1a1aa)] hover:text-[var(--orange,#FF7A33)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO 10+2 STEM LAB</span>
        </Link>
      </div>

      <header className="space-y-4 pb-6 border-b border-[var(--ink-faint,rgba(255,255,255,0.1))]">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded bg-[var(--orange-soft,rgba(255,84,0,0.1))] text-[var(--orange,#FF7A33)] border border-[var(--orange,#FF7A33)] font-grotesk tracking-wider font-semibold">
            10+2 MATHEMATICS & DRAWINGS
          </span>
          <span className="text-[var(--ink-faint,#71717a)]">•</span>
          <span className="flex items-center gap-1 text-[var(--ink-soft,#a1a1aa)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.date}</span>
          </span>
          <span className="text-[var(--ink-faint,#71717a)]">•</span>
          <span className="flex items-center gap-1 text-[var(--ink-soft,#a1a1aa)]">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime} MIN READ</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-grotesk text-[var(--ink,#f4f4f5)] tracking-tight leading-tight transition-colors">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--ink-2,#a1a1aa)] font-newsreader italic leading-relaxed transition-colors">
          {post.summary}
        </p>
      </header>

      <div className="bg-[var(--paper-white,#0d1117)] border border-[var(--ink-faint,#1f2937)] text-[var(--ink,#d4d4d8)] rounded-2xl p-6 sm:p-10 shadow-2xl transition-colors">
        <MdxRenderer content={post.content} />
      </div>

      <footer className="p-6 rounded-xl bg-[var(--paper-white,#0d1117)] border border-[var(--ink-faint,#1f2937)] flex items-center justify-between font-mono text-xs text-[var(--ink-soft,#a1a1aa)] transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--paper-warm,#1f2937)] border border-[var(--ink-faint,#374151)] flex items-center justify-center text-[var(--orange,#FF7A33)] font-bold text-lg font-newsreader">
            π
          </div>
          <div>
            <div className="text-[var(--ink,#e4e4e7)] font-semibold font-grotesk">TechNHIT STEM Faculty</div>
            <div className="text-[11px] text-[var(--ink-soft,#71717a)] font-mono">Department of Applied Mathematics & Physics</div>
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
            <span>WATCH VIDEO LESSON</span>
          </a>
        )}
      </footer>

      {/* Floating Reading Companion Dock */}
      <ReadingCompanionDock />
    </article>
  );
}
