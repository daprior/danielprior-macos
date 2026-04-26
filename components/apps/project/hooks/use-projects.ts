"use client";

import { useEffect, useState } from "react";
import type { GitHubProjectSummary } from "@/types";

type ApiResponse = {
  projects: GitHubProjectSummary[];
  source: "github" | "fallback" | "error";
  message?: string;
};

interface UseProjectsOptions {
  enabled: boolean;
}

export const useProjects = ({ enabled }: UseProjectsOptions) => {
  const [projects, setProjects] = useState<GitHubProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const loadProjects = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/github/projects", {
          cache: "no-store",
        });
        const data = (await response.json()) as ApiResponse;

        if (!response.ok) {
          throw new Error(data.message ?? "Failed to load projects");
        }

        if (!cancelled) {
          setProjects(data.projects);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load GitHub projects",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { projects, isLoading, error };
};
