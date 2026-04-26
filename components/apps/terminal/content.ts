import { OPEN_TARGETS } from "./constants";

export const getWelcomeLines = (lastLogin: string) =>
  [
    `Last login: ${lastLogin}`,
    "Welcome to macOS Terminal",
    "Type 'help' to see available commands",
    "",
  ] as const;

export const HELP_LINES = [
  "Available commands:",
  "  help     - Show this help message",
  "  clear    - Clear the terminal",
  "  echo     - Print text",
  "  date     - Show current date and time",
  "  ls       - List files",
  "  whoami   - Show current user",
  "  about    - About me",
  "  skills   - My technical skills",
  "  contact  - Contact information",
  "  resume   - Open resume in new tab",
  "  matrix   - Toggle matrix mode",
  "  neofetch - Show system info",
  "  fetch    - Alias for neofetch",
  "  open     - Open a link (try: open github)",
  "  history  - Show recent commands",
  "  theme    - Show theme info",
  "  hack     - Definitely not hacking",
  "  sudo     - ...nope",
  "",
  "Shortcuts:",
  "  Ctrl+C - Interrupt output",
  "  Ctrl+L - Clear screen",
  "  Ctrl+U - Clear input before cursor",
  "  Ctrl+W - Delete previous word",
  "  Ctrl+A / Ctrl+E - Move cursor to start/end",
  "  Tab    - Autocomplete commands",
  "",
] as const;

export const LS_LINES = [
  "Documents",
  "Projects",
  "Downloads",
  "Desktop",
  "3D_Models",
  "Animations",
  "GTA_VI_Clone",
  "",
] as const;

export const ABOUT_LINES = [
  "┌──────────────────────────────────────────┐",
  "│ Maen Ababneh                             │",
  "│ Software Engineer & CS Student           │",
  "└──────────────────────────────────────────┘",
  "",
  "Welcome to my digital workspace!",
  "I am a software engineer and CS student at",
  "Al-Balqa Applied University in Jordan.",
  "I specialize in crafting high-performance,",
  "immersive web experiences that bridge the gap",
  "between complex logic and exceptional UI design.",
  "I have a deep passion for 3D on the web and",
  "micro-animations.",
  "",
] as const;

export const SKILLS_LINES = [
  "┌──────────────┐",
  "│   Skills     │",
  "└──────────────┘",
  "",
  "Frontend & Architecture:",
  "• React / Next.js (App Router)",
  "• TypeScript / JavaScript",
  "• Tailwind CSS",
  "• State Management (Zustand, Redux)",
  "• Clean Architecture & Performance",
  "",
  "Animation & 3D Web:",
  "• GSAP (Timeline, ScrollTrigger, FLIP)",
  "• Framer Motion",
  "• Three.js / React Three Fiber",
  "• WebGL",
  "",
  "Backend & Tools:",
  "• Node.js / Express",
  "• Git / GitHub",
  "• Vercel / Deployment pipelines",
  "",
] as const;

export const CONTACT_LINES = [
  "┌─────────┐",
  "│ Contact │",
  "└─────────┘",
  "",
  "Email:    hi@maenababneh.dev",
  "Website:  maenababneh.dev",
  "GitHub:   github.com/maenababneh",
  "LinkedIn: linkedin.com/in/maenababneh",
  "YouTube:  The Compass Tech",
  "",
] as const;

export const NEOFETCH_LINES = [
  "                 -`                    maen@macbook-pro",
  "                .o+`                   ----------------",
  "               `ooo/                   OS: macOS (sim)",
  "              `+oooo:                  Shell: zsh (sim)",
  "             `+oooooo:                 Stack: Next.js / React / TS",
  "             -+oooooo+:                UI: Tailwind / GSAP",
  "           `/:-:++oooo+:               Website: maenababneh.dev",
  "          `/++++/+++++++:              GitHub: github.com/maenababneh",
  "         `/++++++++++++++:             LinkedIn: linkedin.com/in/maenababneh",
  "        `/+++ooooooooooooo/`           YouTube: @thecompasstech",
  "       ./ooosssso++osssssso+`",
  "      .oossssso-````/ossssss+`",
  "     -osssssso.      :ssssssso.",
  "    :osssssss/        osssso+++.",
  "   /ossssssss/        +ssssooo/-",
  "  `/ossssso+/:-        -:/+osssso+-",
  " `+sso+:-`                 `.-/+oso:",
  "`++:.                           `-/+/",
  "",
  "Tip: try `open github` or `matrix`",
  "",
] as const;

export const getOpenUsageLines = () =>
  [
    "Usage: open <github|linkedin|youtube|website|resume|mail>",
    `Available: ${OPEN_TARGETS.join(", ")}`,
    "",
  ] as const;
