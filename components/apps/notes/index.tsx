"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { NotesProps } from "@/types/apps/notes";
import { useNotesContentAnimation } from "./hooks/use-notes-content-animation";
import { useNotesController } from "./hooks/use-notes-controller";
import { useNotesMarkdownComponents } from "./hooks/use-notes-markdown-components";

export default function Notes({ isDarkMode = true }: NotesProps) {
  const {
    notes,
    selectedNote,
    selectedNoteId,
    selectNote,
    reduceMotion,
    viewMode,
    setViewMode,
    handleContentChange,
    textColor,
    bgColor,
    sidebarBg,
    borderColor,
    hoverBg,
    selectedBg,
    toggleBg,
    toggleHoverBg,
    toggleText,
    previewTextColor,
  } = useNotesController({ isDarkMode });

  const markdownComponents = useNotesMarkdownComponents(isDarkMode);
  const { contentRef } = useNotesContentAnimation({
    reduceMotion,
    selectedNoteId,
    viewMode,
  });

  return (
    <div className={`flex h-full ${bgColor} ${textColor}`}>
      <div
        className={`w-64 ${sidebarBg} border-r ${borderColor} flex flex-col`}
      >
        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-medium">Notes</h2>
          <button className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {notes.map((note) => (
            <button
              key={note.id}
              type="button"
              className={`w-full text-left p-3 ${selectedNoteId === note.id ? selectedBg : hoverBg}`}
              onClick={() => selectNote(note.id)}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{note.date}</p>
              <p className={`text-sm mt-1 truncate ${previewTextColor}`}>
                {note.content.split("\n")[0].replace(/^#+ /, "")}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedNote && (
          <>
            <div
              className={`p-3 border-b ${borderColor} flex items-start justify-between gap-3`}
            >
              <div>
                <h2 className="font-medium">{selectedNote.title}</h2>
                <p className="text-xs text-gray-500">{selectedNote.date}</p>
              </div>
              <button
                type="button"
                className={`px-2 py-1 text-xs rounded border ${borderColor} ${toggleBg} ${toggleHoverBg} ${toggleText}`}
                onClick={() =>
                  setViewMode((mode) =>
                    mode === "preview" ? "edit" : "preview",
                  )
                }
              >
                {viewMode === "preview" ? "Edit" : "Preview"}
              </button>
            </div>

            <div className="flex-1 relative overflow-hidden bg-inherit">
              {viewMode === "preview" ? (
                <div
                  ref={contentRef}
                  className="absolute inset-0 overflow-y-auto p-5 md:p-8"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    skipHtml
                    components={markdownComponents}
                  >
                    {selectedNote.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <textarea
                  className={`absolute inset-0 w-full h-full resize-none overflow-y-auto p-5 md:p-8 bg-transparent ${textColor} focus:outline-none leading-relaxed`}
                  value={selectedNote.content}
                  onChange={handleContentChange}
                  spellCheck="false"
                  placeholder="Start typing your note in Markdown..."
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
