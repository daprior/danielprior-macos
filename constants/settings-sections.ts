export interface SettingsSection {
  id: string;
  name: string;
  icon:
    | "globe"
    | "display"
    | "sound"
    | "accessibility"
    | "wifi"
    | "bluetooth"
    | "bell"
    | "user"
    | "shield"
    | "keyboard"
    | "mouse"
    | "clock";
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  { id: "general", name: "General", icon: "globe" },
  { id: "appearance", name: "Appearance", icon: "display" },
  { id: "sound", name: "Sound", icon: "sound" },
  { id: "accessibility", name: "Accessibility", icon: "accessibility" },
  { id: "wifi", name: "Wi-Fi", icon: "wifi" },
  { id: "bluetooth", name: "Bluetooth", icon: "bluetooth" },
  { id: "notifications", name: "Notifications", icon: "bell" },
  { id: "users", name: "Users & Groups", icon: "user" },
  { id: "security", name: "Security", icon: "shield" },
  { id: "keyboard", name: "Keyboard", icon: "keyboard" },
  { id: "mouse", name: "Mouse", icon: "mouse" },
  { id: "time", name: "Date & Time", icon: "clock" },
];
