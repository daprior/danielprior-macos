import type { Command, OpenTarget } from "@/types/apps/terminal";

export const PROMPT_PREFIX = "maen@macbook-pro ~ $";

export const OPEN_TARGETS: readonly OpenTarget[] = [
  "github",
  "linkedin",
  "youtube",
  "website",
  "resume",
  "mail",
] as const;

export const COMMANDS: readonly Command[] = [
  "help",
  "clear",
  "echo",
  "date",
  "ls",
  "whoami",
  "about",
  "skills",
  "contact",
  "resume",
  "matrix",
  "neofetch",
  "fetch",
  "open",
  "theme",
  "hack",
  "sudo",
  "history",
] as const;

export const TYPEWRITER_CHAR_SEC = 0.012;
export const TYPEWRITER_MIN_DURATION = 0.03;
export const MATRIX_CHAR_SEC = 0.0025;
export const MATRIX_MIN_DURATION = 0.02;
export const MATRIX_MAX_DURATION = 0.12;
export const HISTORY_CAP = 300;
export const MATRIX_INTERVAL_MS = 60;
