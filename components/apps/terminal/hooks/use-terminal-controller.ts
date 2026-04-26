"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";
import { useUISound } from "@/hooks/useUISounds";
import { useSettingsStore } from "@/store/useSettingsStore";
import type {
  LineAnimation,
  LineRole,
  LineVariant,
  TerminalLine,
  TerminalProps,
} from "@/types/apps/terminal";
import { getWelcomeLines } from "../content";
import { HISTORY_CAP, PROMPT_PREFIX } from "../constants";
import {
  getCommandMatches,
  getOpenTargetMatches,
  getTypeDuration,
} from "../utils";
import { useTerminalCommandExecutor } from "./use-terminal-command-executor";

gsap.registerPlugin(TextPlugin);

const getThemeClasses = (isMatrixMode: boolean) => ({
  bgColor: "bg-black",
  textColor: isMatrixMode ? "text-green-300" : "text-green-400",
  caretColor: isMatrixMode ? "caret-green-300" : "caret-green-400",
});

export const useTerminalController = ({ isDarkMode }: TerminalProps) => {
  const { playError, playRight } = useUISound();

  // useState
  const [input, setInput] = useState("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixMode, setIsMatrixMode] = useState(false);

  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  const shouldReduceMotion = prefersReducedMotion || reduceMotion;

  // Refs for mutable state that doesn't trigger re-renders
  const nextLineIdRef = useRef(5);
  const historyRef = useRef<TerminalLine[]>([]);
  const lineElsRef = useRef(new Map<number, HTMLSpanElement>());
  const typewriterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingTypewriterIdsRef = useRef<number[]>([]);
  const instantFillIdsRef = useRef(new Set<number>());
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const matrixIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const makeLine = useCallback(
    (
      text: string,
      role: LineRole,
      animation: LineAnimation,
      variant: LineVariant = "normal",
    ): TerminalLine => ({
      id: nextLineIdRef.current++,
      role,
      text,
      animation,
      variant,
    }),
    [],
  );

  const [history, setHistory] = useState<TerminalLine[]>(() => {
    const initial = getWelcomeLines(new Date().toLocaleString()).map((text) =>
      text.length === 0
        ? {
            id: 0,
            role: "blank" as const,
            text: "",
            animation: "none" as const,
            variant: "normal" as const,
          }
        : {
            id: 0,
            role: "output" as const,
            text,
            animation: "none" as const,
            variant: "normal" as const,
          },
    );
    return initial.map((line, index) => ({ ...line, id: index + 1 }));
  });

  const stopMatrixMode = useCallback(() => {
    if (matrixIntervalRef.current) {
      clearInterval(matrixIntervalRef.current);
      matrixIntervalRef.current = null;
    }
    setIsMatrixMode(false);
  }, []);

  const setInputWithCaret = useCallback((nextValue: string, caret: number) => {
    setInput(nextValue);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }, []);

  const registerEl = useCallback((id: number, el: HTMLSpanElement | null) => {
    if (!el) {
      lineElsRef.current.delete(id);
      return;
    }

    lineElsRef.current.set(id, el);

    if (instantFillIdsRef.current.has(id)) {
      const line = historyRef.current.find((entry) => entry.id === id);
      if (line) {
        gsap.killTweensOf(el);
        el.textContent = line.text;
      }
      instantFillIdsRef.current.delete(id);
    }
  }, []);

  const updateHistory = useCallback(
    (updater: (prev: TerminalLine[]) => TerminalLine[]) => {
      setHistory((prev) => {
        const next = updater(prev);
        historyRef.current = next;
        return next;
      });
    },
    [],
  );

  const flushTypewriter = useCallback(() => {
    if (typewriterTimelineRef.current) {
      typewriterTimelineRef.current.kill();
      typewriterTimelineRef.current = null;
    }

    for (const id of pendingTypewriterIdsRef.current) {
      instantFillIdsRef.current.add(id);
    }
    pendingTypewriterIdsRef.current = [];

    for (const line of historyRef.current) {
      if (line.animation !== "typewriter") continue;
      const el = lineElsRef.current.get(line.id);
      if (!el) {
        instantFillIdsRef.current.add(line.id);
        continue;
      }
      gsap.killTweensOf(el);
      el.textContent = line.text;
    }
  }, []);

  const interruptOutput = useCallback(() => {
    if (typewriterTimelineRef.current) {
      typewriterTimelineRef.current.kill();
      typewriterTimelineRef.current = null;
    }

    pendingTypewriterIdsRef.current = [];
    instantFillIdsRef.current.clear();

    for (const el of lineElsRef.current.values()) {
      gsap.killTweensOf(el);
    }

    stopMatrixMode();
  }, [stopMatrixMode]);

  const appendLines = useCallback(
    (lines: TerminalLine[]) => {
      updateHistory((prev) => {
        const next = [...prev, ...lines];

        if (next.length <= HISTORY_CAP) return next;

        const removed = next.slice(0, next.length - HISTORY_CAP);
        const removedIds = new Set(removed.map((line) => line.id));

        for (const line of removed) {
          lineElsRef.current.delete(line.id);
        }

        if (pendingTypewriterIdsRef.current.length > 0) {
          pendingTypewriterIdsRef.current =
            pendingTypewriterIdsRef.current.filter((id) => !removedIds.has(id));
        }

        for (const id of removedIds) {
          instantFillIdsRef.current.delete(id);
        }

        return next.slice(next.length - HISTORY_CAP);
      });
    },
    [updateHistory],
  );

  const clearScreen = useCallback(() => {
    flushTypewriter();
    stopMatrixMode();
    pendingTypewriterIdsRef.current = [];
    lineElsRef.current.clear();
    instantFillIdsRef.current.clear();
    updateHistory(() => [makeLine("", "blank", "none")]);
  }, [flushTypewriter, makeLine, stopMatrixMode, updateHistory]);

  const appendPrompt = useCallback(
    (raw: string) => {
      appendLines([makeLine(`${PROMPT_PREFIX} ${raw}`, "prompt", "none")]);
      appendLines([makeLine("", "blank", "none")]);
    },
    [appendLines, makeLine],
  );

  const appendOutput = useCallback(
    (texts: readonly string[], variant: "normal" | "matrix" = "normal") => {
      const lines = texts.map((text) => {
        if (text.length === 0) return makeLine("", "blank", "none", variant);

        return makeLine(
          text,
          "output",
          shouldReduceMotion ? "none" : "typewriter",
          variant,
        );
      });

      if (!shouldReduceMotion && variant === "normal") {
        for (const line of lines) {
          if (line.animation === "typewriter") {
            pendingTypewriterIdsRef.current.push(line.id);
          }
        }
      }

      appendLines(lines);
    },
    [appendLines, makeLine, shouldReduceMotion],
  );

  const { executeCommand } = useTerminalCommandExecutor({
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
  });

  const pumpTypewriterQueue = useCallback(() => {
    if (shouldReduceMotion) return;
    if (pendingTypewriterIdsRef.current.length === 0) return;

    if (!typewriterTimelineRef.current) {
      typewriterTimelineRef.current = gsap.timeline({
        defaults: { ease: "none" },
      });
    }

    const timeline = typewriterTimelineRef.current;

    while (pendingTypewriterIdsRef.current.length > 0) {
      const id = pendingTypewriterIdsRef.current[0];
      const el = lineElsRef.current.get(id);
      if (!el) break;

      pendingTypewriterIdsRef.current.shift();

      const line = historyRef.current.find((entry) => entry.id === id);
      if (!line) continue;

      gsap.killTweensOf(el);
      el.textContent = "";
      timeline.to(el, {
        duration: getTypeDuration(line.text, "normal"),
        text: line.text,
      });
    }
  }, [shouldReduceMotion]);

  const navigateHistory = useCallback(
    (direction: number) => {
      if (commandHistory.length === 0) return;

      const newIndex = historyIndex + direction;

      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else if (newIndex >= 0) {
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    },
    [commandHistory, historyIndex],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const isCtrlC =
        event.ctrlKey &&
        (event.key === "c" ||
          event.key === "C" ||
          ("code" in event && event.code === "KeyC"));
      const isCtrlL =
        event.ctrlKey &&
        (event.key === "l" ||
          event.key === "L" ||
          ("code" in event && event.code === "KeyL"));
      const isCtrlU =
        event.ctrlKey &&
        (event.key === "u" ||
          event.key === "U" ||
          ("code" in event && event.code === "KeyU"));
      const isCtrlA =
        event.ctrlKey &&
        (event.key === "a" ||
          event.key === "A" ||
          ("code" in event && event.code === "KeyA"));
      const isCtrlE =
        event.ctrlKey &&
        (event.key === "e" ||
          event.key === "E" ||
          ("code" in event && event.code === "KeyE"));
      const isCtrlW =
        event.ctrlKey &&
        (event.key === "w" ||
          event.key === "W" ||
          ("code" in event && event.code === "KeyW"));

      if (isCtrlC) {
        const selectionText =
          typeof window !== "undefined"
            ? (window.getSelection?.()?.toString() ?? "")
            : "";
        const target = event.currentTarget;
        const hasInputSelection =
          target.selectionStart !== null &&
          target.selectionEnd !== null &&
          target.selectionStart !== target.selectionEnd;

        if (hasInputSelection || selectionText.length > 0) return;

        event.preventDefault();
        interruptOutput();
        setInput("");
        appendLines([
          makeLine("^C", "output", "none"),
          makeLine("", "blank", "none"),
        ]);
        return;
      }

      if (isCtrlL) {
        event.preventDefault();
        clearScreen();
        return;
      }

      if (isCtrlA) {
        event.preventDefault();
        setInputWithCaret(input, 0);
        return;
      }

      if (isCtrlE) {
        event.preventDefault();
        setInputWithCaret(input, input.length);
        return;
      }

      if (isCtrlU) {
        event.preventDefault();
        const cursor = event.currentTarget.selectionStart ?? input.length;
        const nextValue = input.slice(cursor);
        setInputWithCaret(nextValue, 0);
        return;
      }

      if (isCtrlW) {
        event.preventDefault();
        const cursor = event.currentTarget.selectionStart ?? input.length;
        let index = cursor;

        while (index > 0 && /\s/.test(input[index - 1] ?? "")) index -= 1;
        while (index > 0 && !/\s/.test(input[index - 1] ?? "")) index -= 1;

        const nextValue = input.slice(0, index) + input.slice(cursor);
        setInputWithCaret(nextValue, index);
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        const cursor = event.currentTarget.selectionStart ?? input.length;

        if (cursor !== input.length) return;

        const trimmed = input.trimStart();
        const leadingSpaces = input.length - trimmed.length;
        const parts = trimmed.split(/\s+/).filter(Boolean);

        if (parts.length === 0) return;

        const first = (parts[0] ?? "").toLowerCase();

        if (parts.length === 1) {
          const matches = getCommandMatches(first);

          if (matches.length === 1) {
            const nextValue =
              " ".repeat(leadingSpaces) +
              matches[0] +
              (input.endsWith(" ") ? "" : " ");
            setInputWithCaret(nextValue, nextValue.length);
            return;
          }

          if (matches.length > 1) {
            flushTypewriter();
            appendOutput([matches.join("  "), ""]);
          }

          return;
        }

        if (first === "open" && parts.length === 2) {
          const secondRaw = parts[1] ?? "";
          const matches = getOpenTargetMatches(secondRaw.toLowerCase());

          if (matches.length === 1) {
            const prefixIndex = input
              .toLowerCase()
              .lastIndexOf(secondRaw.toLowerCase());
            const head = prefixIndex >= 0 ? input.slice(0, prefixIndex) : input;
            const nextValue =
              head + matches[0] + (input.endsWith(" ") ? "" : " ");
            setInputWithCaret(nextValue, nextValue.length);
            return;
          }

          if (matches.length > 1) {
            flushTypewriter();
            appendOutput([matches.join("  "), ""]);
          }
        }
      }

      if (event.key === "Enter" && input.trim()) {
        executeCommand(input);
        setCommandHistory((prev) => [...prev, input]);
        setHistoryIndex(-1);
        setInput("");
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        navigateHistory(-1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        navigateHistory(1);
      }
    },
    [
      appendLines,
      appendOutput,
      clearScreen,
      executeCommand,
      flushTypewriter,
      input,
      interruptOutput,
      makeLine,
      navigateHistory,
      setInputWithCaret,
    ],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      setPrefersReducedMotion(media?.matches ?? false);
    };

    syncReducedMotion();
    media?.addEventListener("change", syncReducedMotion);

    const handleClick = () => {
      inputRef.current?.focus();
    };

    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener("click", handleClick);
    }

    return () => {
      media?.removeEventListener("change", syncReducedMotion);
      if (terminal) {
        terminal.removeEventListener("click", handleClick);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      flushTypewriter();
      if (matrixIntervalRef.current) {
        clearInterval(matrixIntervalRef.current);
        matrixIntervalRef.current = null;
      }
    };
  }, [flushTypewriter]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    pumpTypewriterQueue();
  }, [history, pumpTypewriterQueue]);

  return {
    history,
    input,
    isMatrixMode,
    inputRef,
    terminalRef,
    shouldReduceMotion,
    registerEl,
    handleInputChange,
    handleKeyDown,
    ...getThemeClasses(isMatrixMode),
  };
};
