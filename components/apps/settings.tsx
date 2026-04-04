"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Wifi,
  Bluetooth,
  Bell,
  DiscIcon as Display,
  Clock,
  Keyboard,
  Mouse,
  Globe,
} from "lucide-react";
import { SETTINGS_SECTIONS } from "@/constant/settings-sections";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("general");

  const iconMap = {
    globe: Globe,
    display: Display,
    wifi: Wifi,
    bluetooth: Bluetooth,
    bell: Bell,
    user: User,
    shield: Shield,
    keyboard: Keyboard,
    mouse: Mouse,
    clock: Clock,
  } as const;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-2">
        <div className="space-y-1">
          {SETTINGS_SECTIONS.map((section) => {
            const Icon = iconMap[section.icon];

            return (
              <button
                key={section.id}
                type="button"
                className={`flex items-center px-3 py-2 rounded cursor-pointer ${
                  activeSection === section.id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <div className="mr-3">
                  <Icon className="w-5 h-5" />
                </div>
                <span>{section.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeSection === "general" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">General</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">About</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="mb-2">
                    <strong>macOS Portfolio:</strong> Version 1.0
                  </p>
                  <p className="mb-2">
                    <strong>Chip:</strong> Apple M1
                  </p>
                  <p>
                    <strong>Serial Number:</strong> PORTFOLIO123456
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Software Update</h3>
                <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">Your portfolio is up to date</p>
                    <p className="text-sm text-gray-600">macOS Portfolio 1.0</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Check Now
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Language & Region</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Preferred language</p>
                    <select className="px-3 py-1 border rounded">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Region</p>
                    <select className="px-3 py-1 border rounded">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "appearance" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Appearance</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Theme</h3>
                <div className="flex space-x-4">
                  <div className="border-2 border-blue-500 p-1 rounded-lg">
                    <div className="bg-white w-32 h-24 rounded flex flex-col">
                      <div className="h-6 bg-gray-200 rounded-t"></div>
                      <div className="flex-1"></div>
                    </div>
                    <p className="text-center mt-2 font-medium">Light</p>
                  </div>

                  <div className="border-2 border-gray-300 p-1 rounded-lg">
                    <div className="bg-gray-800 w-32 h-24 rounded flex flex-col">
                      <div className="h-6 bg-gray-700 rounded-t"></div>
                      <div className="flex-1"></div>
                    </div>
                    <p className="text-center mt-2 font-medium">Dark</p>
                  </div>

                  <div className="border-2 border-gray-300 p-1 rounded-lg">
                    <div className="bg-gradient-to-b from-white to-gray-800 w-32 h-24 rounded flex flex-col">
                      <div className="h-6 bg-gradient-to-b from-gray-200 to-gray-700 rounded-t"></div>
                      <div className="flex-1"></div>
                    </div>
                    <p className="text-center mt-2 font-medium">Auto</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Accent Color</h3>
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-gray-300"></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Highlight Color</h3>
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-gray-300"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection !== "general" && activeSection !== "appearance" && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                {SETTINGS_SECTIONS.find((s) => s.id === activeSection)?.name}
              </h2>
              <p className="text-gray-500">This section is under development</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
