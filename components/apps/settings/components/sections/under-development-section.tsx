import { SETTINGS_SECTIONS } from "@/constants/settings-sections";

interface UnderDevelopmentSectionProps {
  activeSection: string;
  subtleText: string;
}

export function UnderDevelopmentSection({
  activeSection,
  subtleText,
}: UnderDevelopmentSectionProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">
          {
            SETTINGS_SECTIONS.find((section) => section.id === activeSection)
              ?.name
          }
        </h2>
        <p className={subtleText}>This section is under development</p>
      </div>
    </div>
  );
}
