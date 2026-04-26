export interface AppWindow {
  id: string;
  title: string;
  component: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data?: GitHubProjectSummary | null;
}

export interface GitHubProjectSummary {
  id: string;
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  primaryLanguage: {
    name: string;
    color: string | null;
  } | null;
  stargazerCount: number;
  updatedAt: string;
  readmePreview: string | null;
  coverImageUrl: string | null;
  source: "github" | "fallback";
}
