import React from "react";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import TechArticleJsonLd from "@/components/seo/TechArticleJsonLd";
import VideoJsonLd from "@/components/seo/VideoJsonLd";
import DualModeArticleView from "@/components/article/DualModeArticleView";
import { ReadingCompanionDock } from "@/components/stem/ReadingCompanionDock";
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

export const revalidate = 60;

export default async function StemArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug("stem-10-plus-2", slug);

  if (!post) {
    notFound();
  }

  const recentPosts = getPostsByCategory("stem-10-plus-2").slice(0, 5);

  const articleUrl = `https://technhit.in/stem-10-plus-2/${post.slug}`;

  return (
    <>
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

      {/* Dual Mode View: Blog Mode & Gamified 6-Stage Learning Mode */}
      <DualModeArticleView post={post} recentPosts={recentPosts}>
        <MdxRenderer content={post.content} />
      </DualModeArticleView>

      {/* Floating Reading Companion Dock */}
      <ReadingCompanionDock />
    </>
  );
}

