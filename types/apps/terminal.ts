export type LineRole = "prompt" | "output" | "blank";
export type LineAnimation = "none" | "typewriter";
export type LineVariant = "normal" | "matrix";

export interface TerminalLine {
  id: number;
  role: LineRole;
  text: string;
  animation: LineAnimation;
  variant: LineVariant;
}

export interface TerminalProps {
  isDarkMode?: boolean;
}

export type OpenTarget =
  | "github"
  | "linkedin"
  | "youtube"
  | "website"
  | "resume"
  | "mail";

export type Command =
  | "help"
  | "clear"
  | "echo"
  | "date"
  | "ls"
  | "whoami"
  | "about"
  | "skills"
  | "contact"
  | "resume"
  | "matrix"
  | "neofetch"
  | "fetch"
  | "open"
  | "theme"
  | "hack"
  | "sudo"
  | "history";
