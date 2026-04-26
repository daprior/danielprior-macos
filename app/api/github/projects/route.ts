import { NextResponse } from "next/server";
import { fetchPinnedGitHubProjects } from "@/lib/github-projects";

export async function GET() {
  try {
    const payload = await fetchPinnedGitHubProjects();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "private, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load GitHub projects";

    return NextResponse.json(
      {
        projects: [],
        source: "error",
        message,
      },
      {
        status: 500,
      },
    );
  }
}
