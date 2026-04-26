"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import BootScreen from "@/components/boot-screen";
import LoginScreen from "@/components/login-screen";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSystemStore } from "@/store/useSystemStore";

const Desktop = dynamic(() => import("@/components/desktop/index"));
const SleepScreen = dynamic(() => import("@/components/sleep-screen"));
const ShutdownScreen = dynamic(() => import("@/components/shutdown-screen"));

type WebMCPToolInput = Record<string, unknown>;

type WebMCPContext = {
  tools: Array<{
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (input: WebMCPToolInput) => Promise<unknown>;
  }>;
};

type NavigatorWithModelContext = Navigator & {
  modelContext?: {
    registerTool?: (tool: {
      name: string;
      description: string;
      inputSchema: Record<string, unknown>;
      execute: (input: WebMCPToolInput) => Promise<unknown>;
      signal?: AbortSignal;
    }) => Promise<void> | void;
    provideContext?: (context: WebMCPContext) => Promise<void> | void;
  };
};

export default function HomeClient() {
  const systemState = useSystemStore((state) => state.systemState);
  const screenBrightness = useSettingsStore((state) => state.screenBrightness);

  useEffect(() => {
    const modelContext = (navigator as NavigatorWithModelContext).modelContext;
    const abortController = new AbortController();

    if (!modelContext) {
      return;
    }

    const context: WebMCPContext = {
      tools: [
        {
          name: "get_profile_summary",
          description:
            "Returns a concise profile summary and important portfolio links.",
          inputSchema: {
            type: "object",
            additionalProperties: false,
            properties: {},
          },
          execute: async () => ({
            name: "Maen Ababneh",
            role: "Full Stack Web Developer",
            website: "https://macos.maenababneh.dev",
            links: {
              github: "https://github.com/maenababneh",
              linkedin: "https://www.linkedin.com/in/maenababneh/",
              youtube: "https://www.youtube.com/@thecompasstech",
            },
          }),
        },
        {
          name: "get_featured_projects",
          description:
            "Fetches featured GitHub projects as shown in the portfolio.",
          inputSchema: {
            type: "object",
            additionalProperties: false,
            properties: {},
          },
          execute: async () => {
            const response = await fetch("/api/github/projects");

            if (!response.ok) {
              throw new Error("Unable to fetch featured projects");
            }

            return response.json();
          },
        },
        {
          name: "get_api_catalog_url",
          description:
            "Returns the URL for the API catalog used for automated discovery.",
          inputSchema: {
            type: "object",
            additionalProperties: false,
            properties: {},
          },
          execute: async () => ({
            apiCatalog: "/.well-known/api-catalog",
            openApi: "/openapi.json",
            serviceDocs: "/docs/api",
          }),
        },
      ],
    };

    if (modelContext.registerTool) {
      for (const tool of context.tools) {
        void modelContext.registerTool({
          ...tool,
          signal: abortController.signal,
        });
      }
    } else if (modelContext.provideContext) {
      void modelContext.provideContext(context);
    }

    return () => {
      abortController.abort();
    };
  }, []);

  const renderScreen = () => {
    switch (systemState) {
      case "booting":
      case "restarting":
        return <BootScreen />;

      case "login":
        return <LoginScreen />;

      case "desktop":
        return <Desktop />;

      case "shutdown":
        return <ShutdownScreen />;

      case "sleeping":
        return <SleepScreen />;

      default:
        return <BootScreen />;
    }
  };

  return (
    <div className="relative">
      {renderScreen()}

      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  );
}
