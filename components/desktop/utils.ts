import { PERSONAL_WEBSITES } from "@/constants/media-links";
import type { GitHubProjectSummary } from "@/types";

export type ProjectsApiResponse = {
  projects: GitHubProjectSummary[];
  source: "github" | "fallback" | "error";
  message?: string;
};

export const getInitialProjectPosition = (index: number) => {
  const columns =
    typeof window === "undefined"
      ? 4
      : window.innerWidth < 1100
        ? 3
        : window.innerWidth < 1500
          ? 4
          : 5;
  const column = index % columns;
  const row = Math.floor(index / columns);

  return {
    x: 56 + column * 160,
    y: 92 + row * 138,
  };
};

export const fallbackProjects = (): GitHubProjectSummary[] =>
  PERSONAL_WEBSITES.map((site, index) => ({
    id: `fallback-${index}-${site.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: site.title,
    nameWithOwner: site.githubUrl.replace("https://github.com/", ""),
    description: site.description,
    url: site.githubUrl,
    homepageUrl: site.demoUrl,
    primaryLanguage: {
      name: "Project",
      color: "#facc15",
    },
    stargazerCount: 0,
    updatedAt: new Date().toISOString(),
    readmePreview: site.description,
    coverImageUrl: site.image,
    source: "fallback",
  }));
