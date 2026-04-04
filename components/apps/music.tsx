"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { MUSIC_PLAYLIST } from "@/constants/music-data";
import { useMediaStore } from "@/store/useMediaStore";

export default function Music() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const isPlaying = useMediaStore((s) => s.musicIsPlaying);
  const setIsPlaying = useMediaStore((s) => s.setMusicIsPlaying);
  const currentTrackIndex = useMediaStore((s) => s.musicTrackIndex);
  const setCurrentTrackIndex = useMediaStore((s) => s.setMusicTrackIndex);
  const volume = useMediaStore((s) => s.musicVolume);
  const setVolume = useMediaStore((s) => s.setMusicVolume);
  const isMuted = useMediaStore((s) => s.musicIsMuted);
  const setIsMuted = useMediaStore((s) => s.setMusicIsMuted);
  const toggleMute = useMediaStore((s) => s.toggleMusicMute);

  const audioRef = useRef<HTMLAudioElement>(null);

  const safeTrackIndex = Math.min(
    Math.max(0, currentTrackIndex),
    Math.max(0, MUSIC_PLAYLIST.length - 1),
  );

  useEffect(() => {
    if (safeTrackIndex !== currentTrackIndex) {
      setCurrentTrackIndex(safeTrackIndex);
    }
  }, [currentTrackIndex, safeTrackIndex, setCurrentTrackIndex]);

  const currentTrack = MUSIC_PLAYLIST[safeTrackIndex];

  const handleNext = useCallback(() => {
    const nextIndex =
      safeTrackIndex === MUSIC_PLAYLIST.length - 1 ? 0 : safeTrackIndex + 1;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  }, [safeTrackIndex, setCurrentTrackIndex, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleNext);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleNext);
    };
  }, [handleNext, safeTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, safeTrackIndex, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    const prevIndex =
      safeTrackIndex === 0 ? MUSIC_PLAYLIST.length - 1 : safeTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Music Player</h2>

      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 rounded-lg overflow-hidden mb-6">
          <Image
            src={currentTrack.cover || "/placeholder.svg"}
            alt={currentTrack.title}
            fill
            sizes="256px"
            className="object-cover"
          />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
          <p className="text-gray-600">{currentTrack.artist}</p>
        </div>

        <div className="w-full max-w-md mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleTimeChange}
            className="mb-4"
          />
        </div>

        <div className="flex items-center justify-center space-x-6 mb-6">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center w-full max-w-xs">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-100 mr-2"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.file} />
    </div>
  );
}
