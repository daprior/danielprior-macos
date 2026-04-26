import Image from "next/image";
import {
  CALENDLY_URL,
  GITHUB_URL,
  PHONE_URL,
  WEBSITE_URL,
} from "@/constants/media-links";

interface GeneralSectionProps {
  cardBg: string;
  secondaryText: string;
  isReducedMotion: boolean;
  globalMusicMuted: boolean;
  sfxMuted: boolean;
  isDarkMode: boolean;
}

export function GeneralSection({
  cardBg,
  secondaryText,
  isReducedMotion,
  globalMusicMuted,
  sfxMuted,
  isDarkMode,
}: GeneralSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">About This Mac</h2>

      <div className="space-y-6">
        <div className={`${cardBg} p-5 rounded-xl`}>
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/20">
              <Image
                src="https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto/f_auto/v1772971236/Profile_lfmhs0.png"
                alt="Maen Ababneh"
                fill
                sizes="96px"
                className="object-cover"
                quality={80}
                loading="lazy"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold">maenOS v1.0</p>
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
                  Verified Developer
                </span>
              </div>
              <p className={secondaryText}>
                Crafted with modern web technologies.
              </p>
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-xl space-y-4`}>
          <h3 className="text-lg font-medium">System Information</h3>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>System</span>
              <span className="font-medium">maenOS v1.0</span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Developer</span>
              <span className="font-medium">Maen Ababneh</span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-lg bg-black/10 p-3 md:col-span-2">
              <span className={secondaryText}>Processor / Technologies</span>
              <span className="text-right font-medium">
                Next.js 15, React 19, Zustand, GSAP
              </span>
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-xl space-y-4`}>
          <h3 className="text-lg font-medium">Live Status</h3>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Reduce Motion</span>
              <span className="font-medium">
                {isReducedMotion ? "On" : "Off"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Global Music Mute</span>
              <span className="font-medium">
                {globalMusicMuted ? "On" : "Off"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>SFX</span>
              <span className="font-medium">
                {sfxMuted ? "Muted" : "Enabled"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-black/10 p-3">
              <span className={secondaryText}>Theme</span>
              <span className="font-medium">
                {isDarkMode ? "Dark" : "Light"}
              </span>
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-xl space-y-3`}>
          <h3 className="text-lg font-medium">Quick Links</h3>
          <div className="flex flex-wrap gap-2">
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-600"
            >
              See my work
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
            >
              Book a call
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-600"
            >
              GitHub
            </a>
            <a
              href={PHONE_URL}
              className="rounded-md bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-600"
            >
              Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
