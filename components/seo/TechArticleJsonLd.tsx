import React from "react";

interface TechArticleJsonLdProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  authorName?: string;
  proficiencyLevel?: "Beginner" | "Intermediate" | "Expert";
  dependencies?: string[];
}

export default function TechArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  url,
  authorName = "TechNHIT Engineering",
  proficiencyLevel = "Intermediate",
  dependencies = ["Linux", "Docker", "NVIDIA CUDA"],
}: TechArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Person",
      name: authorName,
      url: "https://technhit.in",
    },
    publisher: {
      "@type": "Organization",
      name: "TechNHIT",
      url: "https://technhit.in",
      logo: {
        "@type": "ImageObject",
        url: "https://technhit.in/logo.png",
      },
    },
    proficiencyLevel: proficiencyLevel,
    dependencies: dependencies.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
