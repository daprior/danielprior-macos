"use client";

import type React from "react";

import { useNotesStore } from "@/store/useNotesStore";

interface NotesProps {
  isDarkMode?: boolean;
}

export default function Notes({ isDarkMode = true }: NotesProps) {
  const notes = useNotesStore((s) => s.notes);
  const selectedNoteId = useNotesStore((s) => s.selectedNoteId);
  const selectNote = useNotesStore((s) => s.selectNote);
  const updateSelectedNoteContent = useNotesStore(
    (s) => s.updateSelectedNoteContent,
  );

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSelectedNoteContent(e.target.value);
  };

  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const sidebarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200";
  const selectedBg = isDarkMode ? "bg-gray-700" : "bg-gray-300";

  return (
    <div className={`flex h-full ${bgColor} ${textColor}`}>
      {/* Sidebar */}
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
              <p
                className={`text-sm mt-1 truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {note.content.split("\n")[0].replace(/^#+ /, "")}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Note content */}
      <div className="flex-1 flex flex-col">
        {selectedNote && (
          <>
            <div className={`p-3 border-b ${borderColor}`}>
              <h2 className="font-medium">{selectedNote.title}</h2>
              <p className="text-xs text-gray-500">{selectedNote.date}</p>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <textarea
                className={`w-full h-full resize-none ${bgColor} ${textColor} focus:outline-none`}
                value={selectedNote.content}
                onChange={handleContentChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
