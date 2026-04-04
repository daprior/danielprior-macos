"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
} from "lucide-react";

interface SpotifyProps {
  isDarkMode?: boolean;
}

const PLAYLIST = [
  {
    title: "Lofi Study Beat",
    artist: "Chill Artist",
    cover: "/cozy-corner-beats.png",
    file: "/lofi-study-112191.mp3",
    duration: "3:42",
  },
  {
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    cover: "/cool-blue-jazz.png",
    file: "/lofi-study-112191.mp3",
    duration: "2:56",
  },
  {
    title: "Sunny Morning",
    artist: "Alex Productions",
    cover: "/grand-piano-keys.png",
    file: "/lofi-study-112191.mp3",
    duration: "4:10",
  },
];

export default function Spotify({ isDarkMode = true }: SpotifyProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const secondaryBg = isDarkMode ? "bg-gray-800" : "bg-gray-100";

  const prepareForTrackChange = useCallback(() => {
    setIsAudioReady(false);
    setError(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const handlePrevious = () => {
    // Pause current track to avoid errors
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }

    prepareForTrackChange();
    setIsPlaying(true);
    setCurrentTrackIndex((prev) =>
      prev === 0 ? PLAYLIST.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    // Pause current track to avoid errors
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }

    prepareForTrackChange();
    setIsPlaying(true);
    setCurrentTrackIndex((prev) =>
      prev === PLAYLIST.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsAudioReady(true);
    };
    const handleEnd = () => {
      prepareForTrackChange();
      setCurrentTrackIndex((prev) =>
        prev === PLAYLIST.length - 1 ? 0 : prev + 1,
      );
      setIsPlaying(true);
    };
    const handleCanPlayThrough = () => setIsAudioReady(true);
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
      setError("Error loading audio");
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("ended", handleEnd);
    audio.addEventListener("error", handleError as EventListener);

    // Preload the audio
    audio.load();

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("ended", handleEnd);
      audio.removeEventListener("error", handleError as EventListener);
    };
  }, [currentTrackIndex, prepareForTrackChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isAudioReady) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          setError(
            "Playback was prevented by the browser. Try clicking play again.",
          );
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, isAudioReady]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!isAudioReady) {
      // If audio isn't ready yet, don't try to play
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Number.parseFloat(e.target.value);
    try {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    } catch (err) {
      console.error("Error setting time:", err);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const selectTrack = (index: number) => {
    if (index === currentTrackIndex) {
      togglePlay();
      return;
    }

    // First pause current track to avoid errors
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }

    prepareForTrackChange();
    setIsPlaying(true);
    setCurrentTrackIndex(index);
  };

  return (
    <div className={`h-full ${bgColor} ${textColor} flex flex-col`}>
      {/* Header */}
      <div className={`${secondaryBg} p-4 flex items-center justify-between`}>
        <div className="flex items-center">
          <Image
            src="/spotify.png"
            alt="Spotify"
            width={32}
            height={32}
            className="w-8 h-8 mr-3"
          />
          <h2 className="font-semibold">Spotify</h2>
        </div>
        <div className="flex space-x-2">
          <button className="p-1 rounded-full hover:bg-gray-700">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-700">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-48 h-48 mb-6 rounded-md overflow-hidden shadow-lg">
          <Image
            src={currentTrack.cover || "/placeholder.svg"}
            alt={`${currentTrack.title} cover`}
            width={192}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400">{currentTrack.artist}</p>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>
              {isAudioReady ? formatTime(duration) : currentTrack.duration}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleTimeChange}
            disabled={!isAudioReady}
            className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${
                (currentTime / (duration || 1)) * 100
              }%, #4D4D4D ${(currentTime / (duration || 1)) * 100}%, #4D4D4D 100%)`,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <button
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white"
            onClick={handlePrevious}
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            className={`p-3 ${isAudioReady ? "bg-white hover:scale-105" : "bg-gray-400"} rounded-full transition-transform`}
            onClick={togglePlay}
            disabled={!isAudioReady}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-black" />
            ) : (
              <Play className="w-8 h-8 text-black" />
            )}
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white"
            onClick={handleNext}
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume control */}
        <div className="flex items-center w-full max-w-xs">
          <button
            className="p-2 rounded-full hover:bg-gray-700 mr-2"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${(isMuted ? 0 : volume) * 100}%, #4D4D4D ${
                (isMuted ? 0 : volume) * 100
              }%, #4D4D4D 100%)`,
            }}
          />
        </div>
      </div>

      {/* Playlist */}
      <div className={`${secondaryBg} p-4`}>
        <h3 className="font-medium mb-2">Playlist</h3>
        <div className="space-y-2">
          {PLAYLIST.map((track, index) => (
            <button
              key={index}
              type="button"
              className={`flex items-center p-2 rounded cursor-pointer ${
                currentTrackIndex === index
                  ? "bg-green-900/30"
                  : "hover:bg-gray-700/30"
              }`}
              onClick={() => selectTrack(index)}
            >
              <div className="w-10 h-10 mr-3 rounded overflow-hidden">
                <Image
                  src={track.cover || "/placeholder.svg"}
                  alt={track.title}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${currentTrackIndex === index ? "text-green-500" : ""}`}
                >
                  {track.title}
                </p>
                <p className="text-xs text-gray-400">{track.artist}</p>
              </div>
              <div className="text-xs text-gray-400">{track.duration}</div>
            </button>
          ))}
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.file} preload="auto" />
    </div>
  );
}
