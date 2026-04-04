"use client";

import type React from "react";

import { useState } from "react";

interface NotesProps {
  isDarkMode?: boolean;
}

export default function Notes({ isDarkMode = true }: NotesProps) {
  // Update the notes state with enhanced content
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "About Me",
      content: `# Daniel Prior
Frontend Developer & Full Stack Engineer

## Skills
### Frontend
- React/Next.js
- Vue.js/Nuxt.js
- TypeScript/JavaScript
- Tailwind CSS/SCSS
- UI/UX Design
- Responsive Web Development
- Vite/Webpack
- Wordpress, Umbraco etc.

### Backend
- Node.js/Express
- PHP/Laravel/Slim
- Python/Django
- Rust & GO (learning)
- SQL (MySQL, PostgreSQL)
- NoSQL (MongoDB)
- RESTful APIs/GraphQL

### Game Development
- Unity/Unreal Engine
- C# & C++
- Game Design Principles
- Game Mechanics & Systems
- Blender 3D/3D Modeling
- Animations for agricultural machinery and vehicles
- Godot Engine

### DevOps & Tools
- Docker/Containerization
- CI/CD Pipelines
- Git/GitHub
- Agile/Scrum Methodologies
- AWS/Cloud Services
- Linux/Unix

## Experience
Currently working as a Senior Full Stack Developer, focusing on building accessible, performant, and scalable web applications. Experienced in leading development teams and implementing best practices for modern web development.

## Contact
Email: mail@danielprior.dk
GitHub: github.com/daprior
Portfolio: danielprior.dev`,
      date: "Today, 10:30 AM",
    },
    {
      id: 2,
      title: "Learning Goals",
      content: `# Learning Goals

## Career & Independence
- Network with like-minded professionals and mentors
- Build a personal brand and online presence
- Work on meaningful AI projects with real-world impact
- Enhance knowledge in industries I'm passionate about (fintech, finance, web3 and automotive)

## Technical Skills
- Master Rust for performance-critical applications and systems programming
- Improve Go proficiency for backend services and microservices
- Deepen knowledge of AI/ML frameworks and practical applications
- Make popular games with Unity and Unreal Engine

## Personal Projects
- Develop an indie game from concept to release
- Build AI-powered tools that enhance creative workflows
- Create open-source libraries that solve real problems
- Contribute to projects I use and admire

## Learning Approach
- Focus on deep understanding rather than surface-level knowledge
- Build complete projects rather than just tutorials and unfinished projects
- Share knowledge and experiences with the community
- Maintain a balance between breadth and depth of skills`,
      date: "Yesterday, 3:15 PM",
    },
  ]);

  const [selectedNoteId, setSelectedNoteId] = useState(1);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const handleNoteSelect = (id: number) => {
    setSelectedNoteId(id);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the note content
    setNotes(
      notes.map((note) => {
        if (note.id === selectedNoteId) {
          return { ...note, content: e.target.value };
        }
        return note;
      }),
    );
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
              onClick={() => handleNoteSelect(note.id)}
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
