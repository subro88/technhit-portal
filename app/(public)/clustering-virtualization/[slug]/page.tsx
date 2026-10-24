import React from "react";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import MdxRenderer from "@/components/mdx/MdxRenderer";
import TechArticleJsonLd from "@/components/seo/TechArticleJsonLd";
import VideoJsonLd from "@/components/seo/VideoJsonLd";
import DualModeArticleView from "@/components/article/DualModeArticleView";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug("clustering-virtualization", slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} | TechNHIT Clustering & HA`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://technhit.in/clustering-virtualization/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export const revalidate = 60;

export default async function ClusteringArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug("clustering-virtualization", slug);

  if (!post) {
    notFound();
  }

  const articleUrl = `https://technhit.in/clustering-virtualization/${post.slug}`;

  return (
    <>
      <TechArticleJsonLd
        title={post.title}
        description={post.summary}
        datePublished={post.date}
        url={articleUrl}
        proficiencyLevel="Expert"
        dependencies={["Proxmox VE 8", "Ceph", "Corosync", "QDevice"]}
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
      <DualModeArticleView post={post}>
        <MdxRenderer content={post.content} />
      </DualModeArticleView>
    </>
  );
}

