import React from "react";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import TechArticleJsonLd from "@/components/seo/TechArticleJsonLd";
import VideoJsonLd from "@/components/seo/VideoJsonLd";
import Link from "next/link";
import { Code2, Calendar, Clock, ArrowLeft, Layers } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug("software-engineering", slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} | TechNHIT Software Systems`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://technhit.in/software-engineering/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function SoftwareEngineeringArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug("software-engineering", slug);

  if (!post) {
    notFound();
  }

  const articleUrl = `https://technhit.in/software-engineering/${post.slug}`;

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* JSON-LD Schemas */}
      <TechArticleJsonLd
        title={post.title}
        description={post.summary}
        datePublished={post.date}
        url={articleUrl}
        proficiencyLevel="Intermediate"
        dependencies={["PHP 8.x", "Laravel", "React 19", "Node.js", "MySQL"]}
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
          href="/software-engineering"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO SOFTWARE ENGINEERING TRACK</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-cyber-border">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
            FULL STACK & WEB SYSTEMS
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

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700 text-xs font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-invert prose-cyan max-w-none">
        <MdxRenderer content={post.content} />
      </div>
    </article>
  );
}
