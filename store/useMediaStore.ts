import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { noopStorage } from "@/store/noop-storage";
import { MUSIC_CONFIG } from "@/constants/ui-config";

type MediaState = {
  musicIsPlaying: boolean;
  musicTrackIndex: number;
  musicVolume: number;
  musicIsMuted: boolean;

  spotifyIsPlaying: boolean;
  spotifyTrackIndex: number;
  spotifyVolume: number;
  spotifyIsMuted: boolean;
};

type MediaActions = {
  setMusicIsPlaying: (playing: boolean) => void;
  setMusicTrackIndex: (index: number) => void;
  setMusicVolume: (volume: number) => void;
  setMusicIsMuted: (muted: boolean) => void;
  toggleMusicMute: () => void;

  setSpotifyIsPlaying: (playing: boolean) => void;
  setSpotifyTrackIndex: (index: number) => void;
  setSpotifyVolume: (volume: number) => void;
  setSpotifyIsMuted: (muted: boolean) => void;
  toggleSpotifyMute: () => void;
};

export type MediaStore = MediaState & MediaActions;

export const useMediaStore = create<MediaStore>()(
  persist(
    (set, get) => ({
      musicIsPlaying: false,
      musicTrackIndex: 0,
      musicVolume: MUSIC_CONFIG.defaultVolume,
      musicIsMuted: false,

      spotifyIsPlaying: false,
      spotifyTrackIndex: 0,
      spotifyVolume: 0.7,
      spotifyIsMuted: false,

      setMusicIsPlaying: (playing) => set({ musicIsPlaying: playing }),
      setMusicTrackIndex: (index) => set({ musicTrackIndex: index }),
      setMusicVolume: (volume) => set({ musicVolume: volume }),
      setMusicIsMuted: (muted) => set({ musicIsMuted: muted }),
      toggleMusicMute: () => set({ musicIsMuted: !get().musicIsMuted }),

      setSpotifyIsPlaying: (playing) => set({ spotifyIsPlaying: playing }),
      setSpotifyTrackIndex: (index) => set({ spotifyTrackIndex: index }),
      setSpotifyVolume: (volume) => set({ spotifyVolume: volume }),
      setSpotifyIsMuted: (muted) => set({ spotifyIsMuted: muted }),
      toggleSpotifyMute: () => set({ spotifyIsMuted: !get().spotifyIsMuted }),
    }),
    {
      name: STORAGE_KEYS.mediaState,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      partialize: (state) => ({
        musicTrackIndex: state.musicTrackIndex,
        musicVolume: state.musicVolume,
        musicIsMuted: state.musicIsMuted,
        spotifyTrackIndex: state.spotifyTrackIndex,
        spotifyVolume: state.spotifyVolume,
        spotifyIsMuted: state.spotifyIsMuted,
      }),
    },
  ),
);
