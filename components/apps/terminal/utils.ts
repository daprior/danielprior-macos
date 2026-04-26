import type { LineVariant, OpenTarget } from "@/types/apps/terminal";
import {
  COMMANDS,
  MATRIX_CHAR_SEC,
  MATRIX_MAX_DURATION,
  MATRIX_MIN_DURATION,
  OPEN_TARGETS,
  TYPEWRITER_CHAR_SEC,
  TYPEWRITER_MIN_DURATION,
} from "./constants";

export const getTypeDuration = (text: string, variant: LineVariant) => {
  const charCount = text.length;
  if (charCount === 0) return 0;

  if (variant === "matrix") {
    const duration = Math.max(charCount * MATRIX_CHAR_SEC, MATRIX_MIN_DURATION);
    return Math.min(duration, MATRIX_MAX_DURATION);
  }

  return Math.max(charCount * TYPEWRITER_CHAR_SEC, TYPEWRITER_MIN_DURATION);
};

export const isSafeUrl = (value: string) =>
  /^(https?:\/\/|mailto:|\/)/i.test(value.trim());

export const generateRandomMatrixLine = () => {
  const alphabet = "01abcdef0123456789#$%&*@";
  const length = 44 + Math.floor(Math.random() * 32);
  let out = "";

  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return out;
};

export const getCommandMatches = (prefix: string) =>
  COMMANDS.filter((command) => command.startsWith(prefix));

export const getOpenTargetMatches = (prefix: string) =>
  OPEN_TARGETS.filter((target) => target.startsWith(prefix));

export const getOpenTargetMap = (targets: Record<OpenTarget, string>) =>
  targets;
