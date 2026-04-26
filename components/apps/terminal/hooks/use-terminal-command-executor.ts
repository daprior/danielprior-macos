"use client";

import { useCallback, type MutableRefObject } from "react";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  MAIL_TO_URL,
  RESUME_URL,
  WEBSITE_URL,
  YOUTUBE_CHANNEL_URL,
} from "@/constants/media-links";
import { getOpenTargetMap, isSafeUrl } from "../utils";
import {
  ABOUT_LINES,
  CONTACT_LINES,
  getOpenUsageLines,
  HELP_LINES,
  LS_LINES,
  NEOFETCH_LINES,
  SKILLS_LINES,
} from "../content";
import { OPEN_TARGETS, MATRIX_INTERVAL_MS } from "../constants";
import { generateRandomMatrixLine } from "../utils";

const OPEN_URLS = getOpenTargetMap({
  github: GITHUB_URL,
  linkedin: LINKEDIN_URL,
  youtube: YOUTUBE_CHANNEL_URL,
  website: WEBSITE_URL,
  resume: RESUME_URL,
  mail: MAIL_TO_URL,
});

interface UseTerminalCommandExecutorOptions {
  commandHistory: string[];
  appendOutput: (
    texts: readonly string[],
    variant?: "normal" | "matrix",
  ) => void;
  appendPrompt: (raw: string) => void;
  clearScreen: () => void;
  flushTypewriter: () => void;
  stopMatrixMode: () => void;
  setIsMatrixMode: (nextValue: boolean) => void;
  matrixIntervalRef: MutableRefObject<ReturnType<typeof setInterval> | null>;
  playError: () => void;
  playRight: () => void;
  isDarkMode?: boolean;
}

export const useTerminalCommandExecutor = ({
  commandHistory,
  appendOutput,
  appendPrompt,
  clearScreen,
  flushTypewriter,
  stopMatrixMode,
  setIsMatrixMode,
  matrixIntervalRef,
  playError,
  playRight,
  isDarkMode,
}: UseTerminalCommandExecutorOptions) => {
  const openUrl = useCallback(
    (url: string) => {
      if (typeof window === "undefined") {
        appendOutput(["Cannot open URL in this environment.", ""]);
        return;
      }

      const safe = url.trim();
      if (!isSafeUrl(safe)) {
        appendOutput([
          "Refusing to open unsafe URL scheme.",
          "Allowed schemes: http, https, mailto",
          "",
        ]);
        return;
      }

      window.open(safe, "_blank", "noopener,noreferrer");
    },
    [appendOutput],
  );

  const executeCommand = useCallback(
    (cmd: string) => {
      flushTypewriter();

      const raw = cmd.trim();
      const parts = raw.split(/\s+/).filter(Boolean);
      const mainCommand = (parts[0] ?? "").toLowerCase();
      const args = parts.slice(1);

      appendPrompt(raw);

      let commandSucceeded = false;

      switch (mainCommand) {
        case "help":
          appendOutput(HELP_LINES);
          commandSucceeded = true;
          break;
        case "clear":
          clearScreen();
          commandSucceeded = true;
          break;
        case "echo":
          appendOutput([args.join(" "), ""]);
          commandSucceeded = true;
          break;
        case "date":
          appendOutput([new Date().toString(), ""]);
          commandSucceeded = true;
          break;
        case "ls":
          appendOutput(LS_LINES);
          commandSucceeded = true;
          break;
        case "whoami":
          appendOutput(["maen_ababneh", ""]);
          commandSucceeded = true;
          break;
        case "about":
          appendOutput(ABOUT_LINES);
          commandSucceeded = true;
          break;
        case "skills":
          appendOutput(SKILLS_LINES);
          commandSucceeded = true;
          break;
        case "contact":
          appendOutput(CONTACT_LINES);
          commandSucceeded = true;
          break;
        case "resume":
          appendOutput(["Opening resume...", ""]);
          openUrl(OPEN_URLS.resume);
          commandSucceeded = true;
          break;
        case "sudo":
          appendOutput(["Nice try! This incident will be reported. 🤨", ""]);
          commandSucceeded = true;
          break;
        case "matrix":
          if (matrixIntervalRef.current) {
            flushTypewriter();
            stopMatrixMode();
            appendOutput(["Matrix mode disabled.", ""]);
            commandSucceeded = true;
            break;
          }

          setIsMatrixMode(true);
          appendOutput(["Matrix mode enabled.", ""]);
          matrixIntervalRef.current = setInterval(() => {
            appendOutput([generateRandomMatrixLine()], "matrix");
          }, MATRIX_INTERVAL_MS);
          commandSucceeded = true;
          break;
        case "neofetch":
        case "fetch":
          appendOutput(NEOFETCH_LINES);
          commandSucceeded = true;
          break;
        case "open": {
          const targetRaw = args.join(" ").trim();
          const target = targetRaw.toLowerCase();

          if (!targetRaw) {
            appendOutput(getOpenUsageLines());
            break;
          }

          if (target in OPEN_URLS) {
            appendOutput([`Opening ${target}...`, ""]);
            openUrl(OPEN_URLS[target as keyof typeof OPEN_URLS]);
            commandSucceeded = true;
            break;
          }

          if (isSafeUrl(targetRaw)) {
            appendOutput(["Opening URL...", ""]);
            openUrl(targetRaw);
            commandSucceeded = true;
            break;
          }

          appendOutput([
            `Unknown target: ${targetRaw}`,
            `Available: ${OPEN_TARGETS.join(", ")}`,
            "",
          ]);
          break;
        }
        case "history": {
          const max = 20;
          const slice = commandHistory.slice(
            Math.max(0, commandHistory.length - max),
          );
          const startIndex = commandHistory.length - slice.length + 1;

          if (slice.length === 0) {
            appendOutput(["No history yet.", ""]);
            break;
          }

          appendOutput([
            ...slice.map((entry, index) => `${startIndex + index}  ${entry}`),
            "",
          ]);
          commandSucceeded = true;
          break;
        }
        case "theme": {
          const systemTheme =
            typeof isDarkMode === "boolean"
              ? isDarkMode
                ? "dark"
                : "light"
              : "unknown";

          appendOutput([
            `System theme: ${systemTheme}`,
            "Terminal: always dark",
            "",
          ]);
          commandSucceeded = true;
          break;
        }
        case "hack":
          appendOutput([
            "Establishing secure connection...",
            "Bypassing firewall...",
            "Access granted.",
            "",
          ]);
          commandSucceeded = true;
          break;
        default:
          playError();
          appendOutput([
            `Command not found: ${mainCommand}`,
            'Type "help" to see available commands',
            "",
          ]);
      }

      if (commandSucceeded) {
        playRight();
      }
    },
    [
      appendOutput,
      appendPrompt,
      clearScreen,
      commandHistory,
      flushTypewriter,
      isDarkMode,
      matrixIntervalRef,
      openUrl,
      playError,
      playRight,
      setIsMatrixMode,
      stopMatrixMode,
    ],
  );

  return { executeCommand };
};
