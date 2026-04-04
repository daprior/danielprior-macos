export interface AppRegistryItem {
  id: string;
  title: string;
  icon: string;
  component: string;
  isSystem?: boolean;
}

export const APP_REGISTRY: AppRegistryItem[] = [
  {
    id: "launchpad",
    title: "Launchpad",
    icon: "/launchpad.png",
    component: "Launchpad",
    isSystem: true,
  },
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari" },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes" },
  {
    id: "facetime",
    title: "FaceTime",
    icon: "/facetime.png",
    component: "FaceTime",
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: "/terminal.png",
    component: "Terminal",
  },
  { id: "github", title: "GitHub", icon: "/github.png", component: "GitHub" },
  {
    id: "youtube",
    title: "YouTube",
    icon: "/youtube.png",
    component: "YouTube",
  },
  {
    id: "spotify",
    title: "Spotify",
    icon: "/spotify.png",
    component: "Spotify",
  },
  { id: "snake", title: "Snake", icon: "/snake.png", component: "Snake" },
  {
    id: "weather",
    title: "Weather",
    icon: "/weather.png",
    component: "Weather",
  },
];

const DOCK_APP_IDS = [
  "launchpad",
  "safari",
  "mail",
  "vscode",
  "notes",
  "facetime",
  "terminal",
  "github",
  "youtube",
  "spotify",
] as const;

const indexById = new Map(APP_REGISTRY.map((app) => [app.id, app]));

export const DOCK_APPS: AppRegistryItem[] = DOCK_APP_IDS.map(
  (id) => indexById.get(id)!,
).filter(Boolean);
export const LAUNCHPAD_APPS: AppRegistryItem[] = APP_REGISTRY.filter(
  (app) => app.id !== "launchpad",
);
export const SPOTLIGHT_APPS: AppRegistryItem[] = LAUNCHPAD_APPS;
