"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";

interface TerminalProps {
  isDarkMode?: boolean;
}

export default function Terminal({ isDarkMode }: TerminalProps) {
  void isDarkMode;
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>(() => [
    `Last login: ${new Date().toLocaleString()}`,
    "Welcome to macOS Terminal",
    "Type 'help' to see available commands",
    "",
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Terminal is always dark
  const bgColor = "bg-black";
  const textColor = "text-green-400";

  useEffect(() => {
    // Focus input when terminal is clicked
    const handleClick = () => {
      inputRef.current?.focus();
    };

    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener("click", handleClick);
    }

    return () => {
      if (terminal) {
        terminal.removeEventListener("click", handleClick);
      }
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input);
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory(1);
    }
  };

  const navigateHistory = (direction: number) => {
    if (commandHistory.length === 0) return;

    const newIndex = historyIndex + direction;

    if (newIndex >= commandHistory.length) {
      setHistoryIndex(-1);
      setInput("");
    } else if (newIndex >= 0) {
      setHistoryIndex(newIndex);
      setInput(commandHistory[commandHistory.length - 1 - newIndex]);
    }
  };

  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    const args = command.split(" ");
    const mainCommand = args[0];

    // Add command to history
    setHistory((prev) => [...prev, `daniel@macbook-pro ~ $ ${cmd}`, ""]);

    // Process command
    switch (mainCommand) {
      case "help":
        setHistory((prev) => [
          ...prev,
          "Available commands:",
          "  help - Show this help message",
          "  clear - Clear the terminal",
          "  echo [text] - Print text",
          "  date - Show current date and time",
          "  ls - List files",
          "  whoami - Show current user",
          "  about - About me",
          "  skills - My technical skills",
          "  contact - Contact information",
          "",
        ]);
        break;

      case "clear":
        setHistory([""]);
        break;

      case "echo":
        const echoText = args.slice(1).join(" ");
        setHistory((prev) => [...prev, echoText, ""]);
        break;

      case "date":
        setHistory((prev) => [...prev, new Date().toString(), ""]);
        break;

      case "ls":
        setHistory((prev) => [
          ...prev,
          "Documents",
          "Projects",
          "Downloads",
          "Desktop",
          "Music",
          "Pictures",
          "Videos",
          "",
        ]);
        break;

      case "whoami":
        setHistory((prev) => [...prev, "daniel", ""]);
        break;

      case "about":
        setHistory((prev) => [
          ...prev,
          "┌─────────────────────────────────────┐",
          "│ Daniel Prior                        │",
          "│ Frontend Developer & UI/UX Designer │",
          "└─────────────────────────────────────┘",
          "",
          "I'm a passionate web developer with expertise in",
          "creating beautiful, responsive, and user-friendly",
          "web applications. I love working with modern",
          "frameworks and technologies to build",
          "seamless user experiences. I have a strong",
          "background in both frontend and backend",
          "development, and I'm always eager to learn",
          "new skills and improve my craft.",
          "",
        ]);
        break;

      case "skills":
        setHistory((prev) => [
          ...prev,
          "┌──────────────┐",
          "│   Skills     │",
          "└──────────────┘",
          "",
          "Frontend:",
          "• React / Next.js",
          "• Vue.js / Nuxt.js",
          "• TypeScript / JavaScript",
          "• Tailwind CSS / SCSS",
          "• UI/UX Design",
          "• Responsive Web Development",
          "• Vite / Webpack",
          "• WordPress, Umbraco etc.",
          "",
          "Backend:",
          "• Node.js / Express",
          "• PHP / Laravel / Slim",
          "• Python / Django",
          "• Rust & Go (learning)",
          "• SQL (MySQL, PostgreSQL)",
          "• NoSQL (MongoDB)",
          "• RESTful APIs / GraphQL",
          "",
          "Game Development:",
          "• Unity / Unreal Engine",
          "• C# & C++",
          "• Game Design Principles",
          "• Game Mechanics & Systems",
          "• Blender 3D / 3D Modeling",
          "• Animations for agri machinery & vehicles",
          "• Godot Engine",
          "",
          "DevOps & Tools:",
          "• Docker / Containerization",
          "• CI/CD Pipelines",
          "• Git / GitHub",
          "• Agile / Scrum Methodologies",
          "• AWS / Cloud Services",
          "• Linux / Unix",
          "",
        ]);
        break;

      case "contact":
        setHistory((prev) => [
          ...prev,
          "┌─────────┐",
          "│ Contact │",
          "└─────────┘",
          "",
          "Email: mail@danielprior.dk",
          "GitHub: github.com/daprior",
          "LinkedIn: linkedin.com/in/daniel-prior-53a679195/",
          "Website: danielprior.dev",
          "",
        ]);
        break;

      default:
        setHistory((prev) => [
          ...prev,
          `Command not found: ${mainCommand}`,
          'Type "help" to see available commands',
          "",
        ]);
    }
  };

  return (
    <div
      ref={terminalRef}
      className={`h-full ${bgColor} ${textColor} p-4 font-mono text-sm overflow-auto`}
    >
      {history.map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {line}
        </div>
      ))}

      <div className="flex">
        <span className="mr-2">daniel@macbook-pro ~ $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none caret-green-400 text-green-400"
          autoFocus
        />
      </div>
    </div>
  );
}
