"use client";

import { useMemo, type ReactNode } from "react";

export const useNotesMarkdownComponents = (isDarkMode: boolean) => {
  return useMemo(() => {
    const normalizeHref = (rawHref?: string) => {
      if (!rawHref) return undefined;
      if (rawHref.startsWith("#")) return rawHref;
      if (rawHref.startsWith("/")) return rawHref;
      if (rawHref.startsWith("//")) return `https:${rawHref}`;

      if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(rawHref)) return rawHref;

      return `https://${rawHref}`;
    };

    const linkClass = isDarkMode
      ? "text-blue-400 hover:text-blue-300"
      : "text-blue-600 hover:text-blue-700";
    const inlineCodeClass = isDarkMode
      ? "bg-gray-800 text-gray-100"
      : "bg-gray-100 text-gray-800";
    const blockBg = isDarkMode ? "bg-gray-800" : "bg-gray-100";
    const blockBorder = isDarkMode ? "border-gray-700" : "border-gray-200";

    return {
      h1: ({ children }: { children?: ReactNode }) => (
        <h1 className="text-2xl font-bold mb-4">{children}</h1>
      ),
      h2: ({ children }: { children?: ReactNode }) => (
        <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <h3 className="text-lg font-semibold mt-5 mb-2">{children}</h3>
      ),
      p: ({ children }: { children?: ReactNode }) => (
        <p className="leading-7 mb-3">{children}</p>
      ),
      ul: ({ children }: { children?: ReactNode }) => (
        <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>
      ),
      ol: ({ children }: { children?: ReactNode }) => (
        <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>
      ),
      li: ({ children }: { children?: ReactNode }) => (
        <li className="leading-7">{children}</li>
      ),
      a: ({ href, children }: { href?: string; children?: ReactNode }) => (
        <a
          href={normalizeHref(href)}
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            if (!normalizeHref(href)) e.preventDefault();
          }}
        >
          {children}
        </a>
      ),
      pre: ({ children }: { children?: ReactNode }) => (
        <pre
          className={`p-3 rounded-lg overflow-x-auto border ${blockBorder} ${blockBg} mb-3`}
        >
          {children}
        </pre>
      ),
      code: ({
        inline,
        children,
      }: {
        inline?: boolean;
        children?: ReactNode;
      }) =>
        inline ? (
          <code
            className={`px-1 py-0.5 rounded ${inlineCodeClass} text-[0.85em]`}
          >
            {children}
          </code>
        ) : (
          <code className="text-sm">{children}</code>
        ),
    };
  }, [isDarkMode]);
};
