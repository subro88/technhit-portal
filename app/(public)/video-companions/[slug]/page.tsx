import React from "react";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import TechArticleJsonLd from "@/components/seo/TechArticleJsonLd";
import VideoJsonLd from "@/components/seo/VideoJsonLd";
import DualModeArticleView from "@/components/article/DualModeArticleView";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ mode?: string }>;
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

export const revalidate = 60;

export default async function VideoCompanionArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const initialMode =
    sp.mode === "learning"
      ? "learning"
      : sp.mode === "simulation"
      ? "simulation"
      : "blog";
  const post = getPostBySlug("video-companions", slug);

  if (!post) {
    notFound();
  }

  const recentPosts = getPostsByCategory("video-companions").slice(0, 5);

  const articleUrl = `https://technhit.in/video-companions/${post.slug}`;

  return (
    <>
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

      {/* Dual Mode View: Blog Mode & Gamified 6-Stage Learning Mode */}
      <DualModeArticleView post={post} recentPosts={recentPosts} initialMode={initialMode}>
        <MdxRenderer content={post.content} />
      </DualModeArticleView>
    </>
  );
}

