"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Globe, Star } from "lucide-react";
import type { GitHubProjectSummary } from "@/types";
import { formatUpdatedAt } from "../utils";

interface ProjectCardProps {
  project: GitHubProjectSummary;
  isDarkMode: boolean;
}

export function ProjectCard({ project, isDarkMode }: ProjectCardProps) {
  const cardBg = isDarkMode ? "bg-white/5" : "bg-gray-50";
  const borderColor = isDarkMode ? "border-white/10" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const mutedTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";

  return (
    <article
      className={`overflow-hidden rounded-2xl border ${borderColor} ${cardBg} shadow-lg transition-transform duration-200 hover:-translate-y-1`}
    >
      <div className="relative h-40 overflow-hidden">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={project.name}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
            quality={80}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
          <div>
            <h3 className="truncate text-lg font-semibold">{project.name}</h3>
            <p className="text-xs text-white/75">{project.nameWithOwner}</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs backdrop-blur-md">
            <Star className="h-3.5 w-3.5" />
            {project.stargazerCount}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <p className={`line-clamp-3 text-sm ${mutedTextColor}`}>
          {project.description ?? "No description provided."}
        </p>

        <div
          className={`flex flex-wrap items-center gap-2 text-xs ${textColor}`}
        >
          {project.primaryLanguage ? (
            <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/10">
              {project.primaryLanguage.name}
            </span>
          ) : null}
          <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/10">
            Updated {formatUpdatedAt(project.updatedAt)}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
          {project.homepageUrl ? (
            <Link
              href={project.homepageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            >
              <Globe className="h-4 w-4" />
              Live Demo
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
