"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FaceTimeProps {
  isDarkMode?: boolean;
}

export default function FaceTime({ isDarkMode = true }: FaceTimeProps) {
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";

  // Start camera when component mounts

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Store stream reference for cleanup
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    startCamera();

    // Clean up function to ensure camera is turned off when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL and save to state
        const photoUrl = canvas.toDataURL("image/png");
        setCapturedPhotos((prev) => [...prev, photoUrl]);
      }
    }
  };

  const deletePhoto = (index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`h-full flex flex-col ${bgColor} ${textColor}`}>
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="w-full max-w-2xl aspect-video rounded-xl bg-black overflow-hidden relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onCanPlay={() => setIsCameraAvailable(true)}
            className="w-full h-full object-cover"
          />

          {!isCameraAvailable && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-center p-4">
                Camera access is not available. Please check your browser
                permissions.
              </p>
            </div>
          )}
        </div>

        {/* Hidden canvas for capturing photos */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Capture button */}
        {isCameraAvailable && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Button
              className={`w-16 h-16 rounded-full bg-white hover:bg-gray-200 text-black`}
              onClick={capturePhoto}
            >
              <ImageIcon className="w-8 h-8" />
            </Button>
          </div>
        )}
      </div>

      {/* Captured photos gallery */}
      {capturedPhotos.length > 0 && (
        <div
          className={`p-4 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
        >
          <h3 className="text-sm font-medium mb-2">Captured Photos</h3>
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {capturedPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Captured photo ${index + 1}`}
                  width={96}
                  height={96}
                  className="h-24 w-auto rounded object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deletePhoto(index)}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
