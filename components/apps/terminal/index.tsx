"use client";

import { TerminalHistoryLine } from "./components/history-line";
import { useTerminalController } from "./hooks/use-terminal-controller";
import type { TerminalProps } from "@/types/apps/terminal";
import { PROMPT_PREFIX } from "./constants";

export default function Terminal(props: TerminalProps) {
  const {
    bgColor,
    caretColor,
    handleInputChange,
    handleKeyDown,
    history,
    input,
    inputRef,
    registerEl,
    shouldReduceMotion,
    terminalRef,
    textColor,
  } = useTerminalController(props);

  return (
    <div
      ref={terminalRef}
      className={`h-full overflow-auto p-4 font-mono text-sm ${bgColor} ${textColor}`}
    >
      {history.map((line) => (
        <TerminalHistoryLine
          key={line.id}
          line={line}
          registerEl={registerEl}
          prefersReducedMotion={shouldReduceMotion}
        />
      ))}

      <div className="flex">
        <span className="mr-2">{PROMPT_PREFIX}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent outline-none ${caretColor} ${textColor}`}
          autoFocus
        />
      </div>
    </div>
  );
}
