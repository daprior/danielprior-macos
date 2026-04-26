"use client";

import { useMemo } from "react";
import type React from "react";
import { normalizeAssetUrl } from "../utils";

interface UseProjectMarkdownComponentsOptions {
  isDarkMode: boolean;
  projectUrl?: string;
}

export const useProjectMarkdownComponents = ({
  isDarkMode,
  projectUrl,
}: UseProjectMarkdownComponentsOptions) => {
  return useMemo(
    () => ({
      img: ({ src, alt, ...props }: React.ComponentPropsWithoutRef<"img">) => {
        const normalizedSrc = normalizeAssetUrl(src, projectUrl);
        if (!normalizedSrc) return null;

        return (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={normalizedSrc}
            alt={alt ?? "Markdown image"}
            loading="lazy"
            {...props}
            className={`my-4 inline-block h-auto max-w-full rounded-lg object-contain shadow-sm ${props.className || ""}`}
          />
        );
      },
      video: ({
        src,
        controls,
        children,
        poster,
        ...props
      }: React.ComponentPropsWithoutRef<"video">) => {
        const normalizedSrc = normalizeAssetUrl(src, projectUrl);
        return normalizedSrc ? (
          <video
            src={normalizedSrc}
            controls={controls ?? true}
            poster={normalizeAssetUrl(poster, projectUrl)}
            className="my-4 w-full rounded-2xl border border-white/10 bg-black shadow-lg"
            {...props}
          >
            {children}
          </video>
        ) : null;
      },
      source: ({ src, ...props }: React.ComponentPropsWithoutRef<"source">) => {
        const normalizedSrc = normalizeAssetUrl(src, projectUrl);
        return normalizedSrc ? <source src={normalizedSrc} {...props} /> : null;
      },
      iframe: ({
        src,
        title,
        ...props
      }: React.ComponentPropsWithoutRef<"iframe">) => {
        const normalizedSrc = normalizeAssetUrl(src, projectUrl);
        return normalizedSrc ? (
          <iframe
            src={normalizedSrc}
            title={title ?? "Embedded content"}
            className="my-4 aspect-video w-full rounded-2xl border border-white/10 bg-black shadow-lg"
            allowFullScreen
            {...props}
          />
        ) : null;
      },
      table: ({ children }: { children?: React.ReactNode }) => (
        <div className="my-4 w-full overflow-x-auto pb-2">
          <table className="w-full min-w-[400px] border-collapse text-sm">
            {children}
          </table>
        </div>
      ),
      th: ({ children }: { children?: React.ReactNode }) => (
        <th
          className={`border-b p-2 text-left font-semibold ${isDarkMode ? "border-white/20" : "border-gray-300"}`}
        >
          {children}
        </th>
      ),
      td: ({ children }: { children?: React.ReactNode }) => (
        <td
          className={`border-b p-2 ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
        >
          {children}
        </td>
      ),
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="mb-4 text-2xl font-bold tracking-tight">{children}</h1>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="mt-6 mb-3 text-xl font-semibold">{children}</h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="mt-5 mb-2 text-lg font-semibold">{children}</h3>
      ),
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-3 leading-7">{children}</p>
      ),
      ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="mb-3 list-disc space-y-1 pl-6">{children}</ul>
      ),
      ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="mb-3 list-decimal space-y-1 pl-6">{children}</ol>
      ),
      li: ({ children }: { children?: React.ReactNode }) => (
        <li className="leading-7">{children}</li>
      ),
      a: ({
        href,
        children,
      }: {
        href?: string;
        children?: React.ReactNode;
      }) => (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={
            isDarkMode
              ? "text-cyan-300 hover:text-cyan-200 break-words"
              : "text-cyan-700 hover:text-cyan-800 break-words"
          }
        >
          {children}
        </a>
      ),
      code: ({
        inline,
        children,
      }: {
        inline?: boolean;
        children?: React.ReactNode;
      }) =>
        inline ? (
          <code
            className={`rounded px-1 py-0.5 text-[0.85em] ${isDarkMode ? "bg-white/10 text-white" : "bg-black/5 text-gray-900"}`}
          >
            {children}
          </code>
        ) : (
          <code
            className={`block overflow-x-auto rounded-2xl border p-4 text-sm ${isDarkMode ? "border-white/10 bg-black/30 text-gray-100" : "border-gray-200 bg-gray-50 text-gray-900"}`}
          >
            {children}
          </code>
        ),
      pre: ({ children }: { children?: React.ReactNode }) => (
        <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-100">
          {children}
        </pre>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote
          className={`border-l-4 pl-4 italic ${isDarkMode ? "border-white/20 text-gray-300" : "border-gray-300 text-gray-700"}`}
        >
          {children}
        </blockquote>
      ),
    }),
    [isDarkMode, projectUrl],
  );
};
