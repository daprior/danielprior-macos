import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type React from "react";
import type { AppWindowContentProps } from "@/types/components/window";

const AppLoader = () => (
  <div className="flex items-center justify-center h-full w-full bg-inherit">
    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
  </div>
);

const Notes = dynamic(() => import("@/components/apps/notes/index"), {
  loading: () => <AppLoader />,
});
const GitHub = dynamic(() => import("@/components/apps/github"), {
  loading: () => <AppLoader />,
});
const Safari = dynamic(() => import("@/components/apps/safari"), {
  loading: () => <AppLoader />,
});
const VSCode = dynamic(() => import("@/components/apps/vscode"), {
  loading: () => <AppLoader />,
});
const FaceTime = dynamic(() => import("@/components/apps/facetime"), {
  loading: () => <AppLoader />,
});
const Terminal = dynamic(() => import("@/components/apps/terminal"), {
  loading: () => <AppLoader />,
});
const Mail = dynamic(() => import("@/components/apps/mail"), {
  loading: () => <AppLoader />,
});
const Contact = dynamic(() => import("@/components/apps/contact"), {
  loading: () => <AppLoader />,
});
const YouTube = dynamic(() => import("@/components/apps/youtube"), {
  loading: () => <AppLoader />,
});
const Spotify = dynamic(() => import("@/components/apps/spotify"), {
  loading: () => <AppLoader />,
});
const Snake = dynamic(() => import("@/components/apps/snake/index"), {
  loading: () => <AppLoader />,
});
const Weather = dynamic(() => import("@/components/apps/weather/index"), {
  loading: () => <AppLoader />,
});
const Projects = dynamic(() => import("@/components/apps/project/index"), {
  loading: () => <AppLoader />,
});
const Settings = dynamic(() => import("@/components/apps/settings/index"), {
  loading: () => <AppLoader />,
});

const HireMe = dynamic(() => import("@/components/apps/hire-me"), {
  loading: () => <AppLoader />,
});

export const componentMap: Record<
  string,
  React.ComponentType<AppWindowContentProps>
> = {
  Notes,
  GitHub,
  Safari,
  VSCode,
  FaceTime,
  Terminal,
  Mail,
  Contact,
  YouTube,
  Spotify,
  Snake,
  Weather,
  Projects,
  Settings,
  HireMe,
};
