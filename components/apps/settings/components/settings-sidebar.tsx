import {
  Accessibility,
  Bell,
  Bluetooth,
  Clock,
  DiscIcon as Display,
  Globe,
  Keyboard,
  Mouse,
  Shield,
  User,
  Volume2,
  Wifi,
} from "lucide-react";
import { SETTINGS_SECTIONS } from "@/constants/settings-sections";

interface SettingsSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isDarkMode: boolean;
  sidebarBg: string;
  hoverBg: string;
}

const iconMap = {
  globe: Globe,
  display: Display,
  sound: Volume2,
  accessibility: Accessibility,
  wifi: Wifi,
  bluetooth: Bluetooth,
  bell: Bell,
  user: User,
  shield: Shield,
  keyboard: Keyboard,
  mouse: Mouse,
  clock: Clock,
} as const;

export function SettingsSidebar({
  activeSection,
  setActiveSection,
  isDarkMode,
  sidebarBg,
  hoverBg,
}: SettingsSidebarProps) {
  return (
    <div
      className={`w-16 sm:w-64 shrink-0 h-full overflow-y-auto ${sidebarBg} p-2`}
    >
      <div className="space-y-1">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = iconMap[section.icon];
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              aria-label={section.name}
              title={section.name}
              className={`flex w-full items-center justify-center sm:justify-start px-2 sm:px-3 py-2 rounded cursor-pointer transition-colors ${
                isActive
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : hoverBg
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <div className="mr-0 sm:mr-3">
                <Icon className="w-5 h-5" />
              </div>
              <span className="sr-only sm:not-sr-only">{section.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
