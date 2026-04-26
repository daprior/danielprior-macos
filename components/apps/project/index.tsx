"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Loader2,
  Star,
} from "lucide-react";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { GitHubProjectSummary } from "@/types";
import { formatUpdatedAt } from "./utils";
import { ProjectCard } from "./components/project-card";
import { useProjectMarkdownComponents } from "./hooks/use-project-markdown-components";
import { useProjects } from "./hooks/use-projects";

interface ProjectsProps {
  isDarkMode?: boolean;
  project?: GitHubProjectSummary | null;
}

export default function Projects({
  isDarkMode = true,
  project,
}: ProjectsProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const mutedTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const panelBg = isDarkMode ? "bg-[#0c1120]" : "bg-white";
  const borderColor = isDarkMode ? "border-white/10" : "border-gray-200";
  const markdownComponents = useProjectMarkdownComponents({
    isDarkMode,
    projectUrl: project?.url,
  });

  const { projects, isLoading, error } = useProjects({ enabled: !project });
  const summaryProjects = useMemo(() => projects, [projects]);

  if (project) {
    return (
      <div className={`h-full overflow-y-auto ${panelBg} ${textColor}`}>
        <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col gap-6 p-6 lg:p-8">
          <div
            className={`overflow-hidden rounded-3xl border ${borderColor} shadow-2xl`}
          >
            <div className="relative h-72 overflow-hidden">
              {project.coverImageUrl ? (
                <Image
                  src={project.coverImageUrl}
                  alt={project.name}
                  fill
                  sizes="(min-width: 1024px) 100vw, 100vw"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-slate-950" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-white/75">
                      <Github className="h-4 w-4" />
                      {project.nameWithOwner}
                    </div>
                    <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white lg:text-5xl">
                      {project.name}
                    </h2>
                    <p className="max-w-3xl text-sm text-white/80 lg:text-base">
                      {project.description ?? "No description provided."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                    <Star className="h-5 w-5" />
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                        Stars
                      </div>
                      <div className="text-lg font-semibold">
                        {project.stargazerCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* التعديل هنا: استخدام grid-cols-1 للشاشات الصغيرة، و 3 أعمدة للكبيرة لمرونة أكبر */}
            <div className="grid gap-6 p-6 lg:grid-cols-3 lg:p-8">
              {/* القسم الأول: التفاصيل والـ README (يأخذ عمودين من أصل 3) */}
              <div className="space-y-5 lg:col-span-2 min-w-0">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div
                    className={`rounded-2xl border ${borderColor} bg-white/5 p-4`}
                  >
                    <p
                      className={`text-xs uppercase tracking-[0.2em] ${mutedTextColor}`}
                    >
                      Language
                    </p>
                    <p className="mt-2 font-semibold">
                      {project.primaryLanguage?.name ?? "Unknown"}
                    </p>
                  </div>
                  <div
                    className={`rounded-2xl border ${borderColor} bg-white/5 p-4`}
                  >
                    <p
                      className={`text-xs uppercase tracking-[0.2em] ${mutedTextColor}`}
                    >
                      Updated
                    </p>
                    <p className="mt-2 font-semibold">
                      {formatUpdatedAt(project.updatedAt)}
                    </p>
                  </div>
                  <div
                    className={`rounded-2xl border ${borderColor} bg-white/5 p-4`}
                  >
                    <p
                      className={`text-xs uppercase tracking-[0.2em] ${mutedTextColor}`}
                    >
                      Source
                    </p>
                    <p className="mt-2 font-semibold capitalize">
                      {project.source}
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-3xl border ${borderColor} bg-white/5 p-5`}
                >
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4" />
                    README File
                  </div>
                  <div
                    className={`max-h-[32rem] overflow-x-hidden overflow-y-auto break-words rounded-2xl border p-4 text-sm leading-7 ${isDarkMode ? "border-white/10 bg-black/20 text-gray-200" : "border-gray-200 bg-white text-gray-800"}`}
                  >
                    {project.readmePreview ? (
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {project.readmePreview}
                      </ReactMarkdown>
                    ) : (
                      <p className={mutedTextColor}>
                        No README preview was found for this repository.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* القسم الثاني: Actions (يأخذ عموداً واحداً، ومكانه مضمون ولن يختفي) */}
              <div className="space-y-4 lg:col-span-1 min-w-0">
                <div
                  className={`rounded-3xl border ${borderColor} bg-white/5 p-5 sticky top-6`}
                >
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                    <ArrowUpRight className="h-4 w-4" />
                    Actions
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90"
                    >
                      <Github className="h-4 w-4" />
                      Open on GitHub
                      <ExternalLink className="h-4 w-4" />
                    </Link>

                    {project.homepageUrl ? (
                      <Link
                        href={project.homepageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
                      >
                        <Globe className="h-4 w-4" />
                        Open Live Demo
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-y-auto ${panelBg} ${textColor}`}>
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-6 p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight">Projects</h2>
            <p className={mutedTextColor}>
              Featured repositories pulled from your GitHub pinned projects.
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isLoading
              ? "Loading pinned repositories..."
              : `${summaryProjects.length} projects`}
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex min-h-[24rem] items-center justify-center rounded-3xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading project folders...
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {summaryProjects.map((item) => (
              <ProjectCard
                key={item.id}
                project={item}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
