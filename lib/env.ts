/**
 * TechNHIT Environment Configuration & Runtime Safety Guardrails
 * Enforces production HTTPS, canonical hostnames, and safe credentials loading.
 */

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",

  // Site URL: Guaranteed HTTPS in production per NHIT Suite key directives
  SITE_URL: (() => {
    const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://technhit.in";
    if (process.env.NODE_ENV === "production" && raw.startsWith("http://")) {
      return raw.replace("http://", "https://");
    }
    return raw.replace(/\/+$/, "");
  })(),

  // Auth Configuration
  AUTH_SECRET: process.env.AUTH_SECRET,
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || "admin@technhit.in,subroto@technhit.in,editor@technhit.in")
    .split(",")
    .map((e) => e.trim().toLowerCase()),
  ADMIN_FALLBACK_PASSWORD: process.env.ADMIN_FALLBACK_PASSWORD,

  // GitHub GitOps Ingestion
  GITHUB: {
    PAT: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    OWNER: process.env.GITHUB_OWNER || "subro88",
    REPO: process.env.GITHUB_REPO || "technhit-portal",
    BRANCH: process.env.GITHUB_BRANCH || "main",
  },

  // YouTube Ingest Engine
  YOUTUBE: {
    API_KEY: process.env.YOUTUBE_API_KEY,
    CHANNEL_HANDLE: process.env.YOUTUBE_CHANNEL_HANDLE || "@TechBlogTutorial",
  },
};
