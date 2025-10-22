import Utils from "@/app/utils";
import React from "react";

const MediaSourceRenderer = ({
  audioStream,
  videoStream,
  sourceIndex,
  producerName,
}: {
  audioStream: MediaStream | null;
  videoStream: MediaStream | null;
  sourceIndex: number;
  producerName?: string | null;
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Check if video stream is available and enabled
  const isVideoAvailable =
    videoStream &&
    videoStream.getVideoTracks().length > 0 &&
    videoStream
      .getVideoTracks()
      .some((track) => track.enabled && track.readyState === "live");

  // Generate initials from producer name
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  React.useEffect(() => {
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  React.useEffect(() => {
    if (audioStream && audioRef.current) {
      audioRef.current.srcObject = audioStream;
    }
  }, [audioStream]);

  return (
    <div key={sourceIndex} className="relative w-full h-full">
      {isVideoAvailable ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain rounded-lg"
        />
      ) : (
        <div className="w-full h-full bg-dark-card rounded-lg flex items-center justify-center">
          <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(producerName)}
          </div>
        </div>
      )}

      {audioStream && (
        <audio ref={audioRef} autoPlay playsInline className="hidden" />
      )}

      {/* Username at bottom center */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-card bg-opacity-60 text-white px-3 py-1 rounded-md text-[12px]">
        {Utils.capitalize(producerName || "Participant")}
      </div>
    </div>
  );
};

export default MediaSourceRenderer;
