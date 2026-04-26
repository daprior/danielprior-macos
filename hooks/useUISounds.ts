"use client";

import { Howl } from "howler";
import { useSoundStore } from "@/store/useSoundStore";

const BASE_VOLUME = {
  startup: 0.6,
  login: 0.5,
  emptyTrash: 0.6,
  dockClick: 0.3,
  pop: 0.4,
  swoosh: 0.4,
  closeWindow: 0.4,
  switchOn: 0.5,
  switchOff: 0.5,
  error: 0.5,
} as const;

const startupSound = new Howl({
  src: ["/sounds/startup.mp3"],
  volume: BASE_VOLUME.startup,
});

const loginSound = new Howl({
  src: ["/sounds/login.mp3"],
  volume: BASE_VOLUME.login,
});

const emptyTrashSound = new Howl({
  src: ["/sounds/empty-trash.wav"],
  volume: BASE_VOLUME.emptyTrash,
});

const dockClickSound = new Howl({
  src: ["/sounds/dock-click.mp3"],
  volume: BASE_VOLUME.dockClick,
});

const popSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/v1773943467/pop_s8jg5e.mp3",
  ],
  volume: BASE_VOLUME.pop,
});

const swooshSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/v1773774578/exit-swoosh_upsgno.mp3",
  ],
  volume: BASE_VOLUME.swoosh,
});

const closeWindowSound = new Howl({
  src: ["/sounds/window-swoosh-reverse.mp3"],
  volume: BASE_VOLUME.closeWindow,
});

const switchOnSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/v1773943467/switch-on_shryj3.mp3",
  ],
  volume: BASE_VOLUME.switchOn,
});

const switchOffSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/v1773943467/switch-off_iuunnh.mp3",
  ],
  volume: BASE_VOLUME.switchOff,
});

const errorSound = new Howl({
  src: ["/sounds/error-funk.mp3"],
  volume: BASE_VOLUME.error,
});

const rightClickSound = new Howl({
  src: ["/sounds/right.mp3"],
  volume: 0.4,
});

const disabledSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773947091/disable-sound_q9ziqx.mp3",
  ],
  volume: 0.5,
});

const lastPlayedAtByKey: Record<string, number> = {};

export function useUISound() {
  const shouldMute = () => {
    const { sfxMuted, sfxVolume } = useSoundStore.getState();
    if (sfxMuted || sfxVolume <= 0) return true;
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  };

  const applyVolume = (sound: Howl, baseVolume: number) => {
    const { sfxVolume } = useSoundStore.getState();
    const scaled = Math.max(0, Math.min(1, baseVolume * (sfxVolume / 100)));
    sound.volume(scaled);
  };

  const play = (
    sound: Howl,
    baseVolume: number,
    options?: { singleInstance?: boolean; cooldownMs?: number; key?: string },
  ) => {
    if (shouldMute()) return;
    const key = options?.key;
    const cooldownMs = options?.cooldownMs ?? 0;

    if (options?.singleInstance && sound.playing()) return;

    if (key && cooldownMs > 0) {
      const now = Date.now();
      const lastPlayedAt = lastPlayedAtByKey[key] ?? 0;
      if (now - lastPlayedAt < cooldownMs) return;
      lastPlayedAtByKey[key] = now;
    }

    applyVolume(sound, baseVolume);
    sound.play();
  };

  return {
    playStartup: () => {
      play(startupSound, BASE_VOLUME.startup, {
        key: "startup",
        singleInstance: true,
        cooldownMs: 250,
      });
    },
    playLogin: () => {
      play(loginSound, BASE_VOLUME.login, {
        key: "login",
        singleInstance: true,
        cooldownMs: 300,
      });
    },
    playEmptyTrash: () => {
      play(emptyTrashSound, BASE_VOLUME.emptyTrash);
    },
    playDockClick: () => {
      play(dockClickSound, BASE_VOLUME.dockClick);
    },
    playPop: () => {
      play(popSound, BASE_VOLUME.pop);
    },
    playSwoosh: () => {
      play(swooshSound, BASE_VOLUME.swoosh, {
        key: "swoosh",
        singleInstance: true,
        cooldownMs: 300,
      });
    },
    playCloseWindow: () => {
      play(emptyTrashSound, BASE_VOLUME.emptyTrash);
    },
    playMinimizeWindow: () => {
      play(closeWindowSound, BASE_VOLUME.closeWindow);
    },
    playSwitchOn: () => {
      play(switchOnSound, BASE_VOLUME.switchOn);
    },
    playSwitchOff: () => {
      play(switchOffSound, BASE_VOLUME.switchOff);
    },
    playError: () => {
      play(errorSound, BASE_VOLUME.error);
    },
    playRight: () => {
      play(rightClickSound, 0.4);
    },
    playDisabled: () => {
      play(disabledSound, 0.5);
    },
  };
}
