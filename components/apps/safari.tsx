"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Home,
  Star,
  Plus,
  Search,
  Wifi,
} from "lucide-react";
import {
  SAFARI_FREQUENTLY_VISITED,
  SAFARI_SOCIAL_LINKS,
} from "@/constants/media-links";
import { ANIMATION_DELAYS_MS } from "@/constants/window-config";
import { useSettingsStore } from "@/store/useSettingsStore";

interface SafariProps {
  isDarkMode?: boolean;
}

export default function Safari({ isDarkMode = true }: SafariProps) {
  const [url, setUrl] = useState("https://danielprior.dev");
  const [isLoading, setIsLoading] = useState(false);
  const activeTab = "home";
  const wifiEnabled = useSettingsStore((s) => s.wifiEnabled);

  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const toolbarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const inputBg = isDarkMode ? "bg-gray-700" : "bg-gray-200";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const hoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, ANIMATION_DELAYS_MS.safariRefresh);
  };

  // Add a no internet connection view
  const renderNoInternetView = () => (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div
        className={`w-24 h-24 mb-6 flex items-center justify-center rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
      >
        <Wifi
          className={`w-12 h-12 ${isDarkMode ? "text-gray-600" : "text-gray-500"}`}
        />
      </div>
      <h2 className={`text-xl font-semibold mb-2 ${textColor}`}>
        You Are Not Connected to the Internet
      </h2>
      <p
        className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-6`}
      >
        This page can&apos;t be displayed because your computer is currently
        offline.
      </p>
      <button
        className={`px-4 py-2 rounded ${
          isDarkMode
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
        onClick={handleRefresh}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${bgColor} ${textColor}`}>
      {/* Toolbar */}
      <div
        className={`${toolbarBg} border-b ${borderColor} p-2 flex items-center space-x-2`}
      >
        <button
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          onClick={handleRefresh}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
        <button
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          <Home className="w-4 h-4" />
        </button>

        <div
          className={`flex-1 flex items-center ${inputBg} rounded px-3 py-1`}
        >
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full bg-transparent focus:outline-none text-sm ${textColor}`}
          />
        </div>

        <button
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Tab bar */}
      <div
        className={`${toolbarBg} border-b ${borderColor} px-2 flex items-center`}
      >
        <div
          className={`px-3 py-1 text-sm rounded-t flex items-center ${activeTab === "home" ? (isDarkMode ? "bg-gray-900" : "bg-white") : ""}`}
        >
          <span className="mr-2">Home</span>
          <button className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-gray-500">
            <span className="text-xs">×</span>
          </button>
        </div>
        <button
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {!wifiEnabled
          ? renderNoInternetView()
          : activeTab === "home" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">SNS Links</h2>

                <div className="grid grid-cols-5 sm:grid-cols-7 gap-6 mb-12">
                  {SAFARI_SOCIAL_LINKS.map((link, index) => (
                    <button
                      key={index}
                      className={`flex flex-col items-center p-4 rounded-lg ${hoverBg} cursor-pointer`}
                      onClick={() => setUrl(link.url)}
                      type="button"
                    >
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                        <Image
                          src={link.icon || "/placeholder.svg"}
                          alt={link.title}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <span className="text-sm text-center">{link.title}</span>
                    </button>
                  ))}
                </div>

                <h2 className="text-2xl font-bold mb-6">Frequently Visited</h2>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 mb-12">
                  {SAFARI_FREQUENTLY_VISITED.map((site, index) => (
                    <button
                      key={index}
                      className={`flex flex-col items-center p-4 rounded-lg ${hoverBg} cursor-pointer`}
                      onClick={() => setUrl(site.url)}
                      type="button"
                    >
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                        <Image
                          src={site.icon || "/placeholder.svg"}
                          alt={site.title}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <span className="text-sm text-center">{site.title}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8 max-w-2xl mx-auto">
                  <div className={`p-6 rounded-lg ${cardBg}`}>
                    <h3 className="text-xl font-semibold mb-4">
                      Daniel Prior - Portfolio
                    </h3>
                    <p className="mb-4">
                      Welcome to my portfolio website! I&apos;m a frontend
                      developer specializing in creating beautiful, responsive,
                      and user-friendly web applications.
                    </p>
                    <p className="mb-4">
                      With expertise in React, Next.js, TypeScript, and modern
                      CSS frameworks, I build performant web experiences that
                      users love.
                    </p>
                    <div className="flex justify-end">
                      <button
                        className={`px-4 py-2 rounded ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                      >
                        View Projects
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
