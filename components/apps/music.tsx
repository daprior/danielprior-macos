"use client";

import { useState, useRef, useEffect } from "react";
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
import { MUSIC_PLAYLIST } from "@/constant/music-data";
import { MUSIC_CONFIG } from "@/constant/ui-config";

export default function Music() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState<number>(MUSIC_CONFIG.defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = MUSIC_PLAYLIST[currentTrackIndex];

  const handleNext = () => {
    setCurrentTrackIndex((prev) =>
      prev === MUSIC_PLAYLIST.length - 1 ? 0 : prev + 1,
    );
    setIsPlaying(true);
  };

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
  }, [currentTrackIndex]);

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
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) =>
      prev === 0 ? MUSIC_PLAYLIST.length - 1 : prev - 1,
    );
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
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
