import React from "react";

interface VideoJsonLdProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  embedUrl: string;
}

export default function VideoJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  embedUrl,
}: VideoJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: name,
    description: description,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: uploadDate,
    embedUrl: embedUrl,
    publisher: {
      "@type": "Organization",
      name: "TechNHIT (@TechBlogTutorial)",
      logo: {
        "@type": "ImageObject",
        url: "https://technhit.in/logo.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
