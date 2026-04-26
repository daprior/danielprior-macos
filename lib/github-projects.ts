import { PERSONAL_WEBSITES } from "@/constants/media-links";
import type { GitHubProjectSummary } from "@/types";

type GitHubRepositoryNode = {
  id: string;
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  updatedAt: string;
  primaryLanguage: {
    name: string;
    color: string | null;
  } | null;
  openGraphImageUrl: string | null;
  readme: {
    text?: string | null;
  } | null;
};

type GitHubGraphQLResponse = {
  data?: {
    viewer?: {
      pinnedItems?: {
        nodes?: Array<GitHubRepositoryNode | null> | null;
      } | null;
    } | null;
  };
  errors?: Array<{ message: string }>;
};

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const QUERY = `
  query PinnedRepositories {
    viewer {
      pinnedItems(first: 10, types: REPOSITORY) {
        nodes {
          ... on Repository {
            id
            name
            nameWithOwner
            description
            url
            homepageUrl
            stargazerCount
            updatedAt
            primaryLanguage {
              name
              color
            }
            openGraphImageUrl
            readme: object(expression: "HEAD:README.md") {
              ... on Blob {
                text
              }
            }
          }
        }
      }
    }
  }
`;

const clampText = (text: string, limit: number) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}…`;
};

const extractFirstImageUrl = (text: string) => {
  const match = text.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/i);
  return match?.[1] ?? null;
};

const extractRepoName = (url: string) => {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts.slice(0, 2).join("/");
  } catch {
    return url;
  }
};

const fallbackProjects = (): GitHubProjectSummary[] =>
  PERSONAL_WEBSITES.map((site, index) => {
    const readmePreview = clampText(site.description, 320);

    return {
      id: `fallback-${index}-${site.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: site.title,
      nameWithOwner: extractRepoName(site.githubUrl),
      description: site.description,
      url: site.githubUrl,
      homepageUrl: site.demoUrl,
      primaryLanguage: {
        name: "Project",
        color: "#facc15",
      },
      stargazerCount: 0,
      updatedAt: new Date().toISOString(),
      readmePreview,
      coverImageUrl: site.image,
      source: "fallback",
    };
  });

const normalizeRepository = (
  node: GitHubRepositoryNode,
): GitHubProjectSummary => {
  const readmeText = node.readme?.text?.trim() ?? "";
  const imageFromReadme = extractFirstImageUrl(readmeText);
  const readmePreview = readmeText || null;

  return {
    id: node.id,
    name: node.name,
    nameWithOwner: node.nameWithOwner,
    description: node.description,
    url: node.url,
    homepageUrl: node.homepageUrl,
    primaryLanguage: node.primaryLanguage,
    stargazerCount: node.stargazerCount,
    updatedAt: node.updatedAt,
    readmePreview,
    coverImageUrl: node.openGraphImageUrl ?? imageFromReadme,
    source: "github",
  };
};

export async function fetchPinnedGitHubProjects() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      projects: fallbackProjects(),
      source: "fallback" as const,
    };
  }

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "maenababneh-macos",
    },
    body: JSON.stringify({ query: QUERY }),
    cache: "no-store",
  });

  const result = (await response.json()) as GitHubGraphQLResponse;

  if (!response.ok || result.errors?.length) {
    throw new Error(
      result.errors?.[0]?.message ??
        `GitHub API request failed with ${response.status}`,
    );
  }

  const nodes = result.data?.viewer?.pinnedItems?.nodes ?? [];
  const projects = nodes
    .filter(Boolean)
    .map((node) => normalizeRepository(node as GitHubRepositoryNode));

  if (!projects.length) {
    return {
      projects: fallbackProjects(),
      source: "fallback" as const,
    };
  }

  return {
    projects,
    source: "github" as const,
  };
}
