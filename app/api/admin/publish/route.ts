import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Octokit } from "@octokit/rest";
import { savePostLocally } from "@/lib/posts";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check admin session (or allow in dev if explicitly testing)
    const isAdmin = (session?.user as any)?.isAdmin;
    if (!session || !isAdmin) {
      // In local dev without session, check if authorization header is provided or allow local fallback
      const authHeader = req.headers.get("x-admin-key");
      const expectedKey = process.env.ADMIN_FALLBACK_PASSWORD || "TechNHIT#Cluster2026!";
      if (authHeader !== expectedKey && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized: Admin access required." }, { status: 401 });
      }
    }

    const body = await req.json();
    const { category, slug, content, title, commitMessage } = body;

    if (!category || !slug || !content) {
      return NextResponse.json({ error: "Missing required fields (category, slug, content)." }, { status: 400 });
    }

    // 1. Dual-Write: Always persist to local content/ filesystem
    const localFilePath = savePostLocally(category, slug, content);

    // 2. GitOps Publish: Sync to GitHub if GITHUB_PERSONAL_ACCESS_TOKEN is configured
    const pat = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    const owner = process.env.GITHUB_OWNER || "subro88";
    const repo = process.env.GITHUB_REPO || "technhit-portal";
    const branch = process.env.GITHUB_BRANCH || "main";

    let gitResult = null;

    if (pat && !pat.startsWith("ghp_placeholder") && pat.trim() !== "") {
      try {
        const octokit = new Octokit({ auth: pat });
        const filePath = `content/${category}/${slug}.mdx`;

        // Check if file exists to retrieve SHA
        let existingSha: string | undefined = undefined;
        try {
          const { data: fileData } = await octokit.repos.getContent({
            owner,
            repo,
            path: filePath,
            ref: branch,
          });
          if (!Array.isArray(fileData) && "sha" in fileData) {
            existingSha = fileData.sha;
          }
        } catch (e: any) {
          // File does not exist yet; will create new
        }

        const encodedContent = Buffer.from(content).toString("base64");
        const message = commitMessage || `docs(${category}): publish ${title || slug}`;

        const commitResponse = await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: filePath,
          message,
          content: encodedContent,
          branch,
          sha: existingSha,
        });

        gitResult = {
          commitSha: commitResponse.data.commit.sha,
          htmlUrl: commitResponse.data.commit.html_url,
          branch,
        };
      } catch (gitErr: any) {
        console.error("Octokit GitOps sync warning:", gitErr?.message || gitErr);
        gitResult = {
          warning: `Saved locally, but GitHub sync failed: ${gitErr?.message || "Unknown Git error"}`,
        };
      }
    } else {
      gitResult = {
        notice: "Saved to local content/ repository. (Configure GITHUB_PERSONAL_ACCESS_TOKEN in .env.local for automated GitHub commits).",
      };
    }

    return NextResponse.json({
      success: true,
      category,
      slug,
      localPath: localFilePath,
      git: gitResult,
    });
  } catch (err: any) {
    console.error("Publish API Error:", err);
    return NextResponse.json({ error: err.message || "Failed to publish post." }, { status: 500 });
  }
}
