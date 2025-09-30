import React from "react";

const MediaSourceRenderer = ({
  audioStream,
  videoStream,
  sourceIndex,
}: {
  audioStream: MediaStream | null;
  videoStream: MediaStream | null;
  sourceIndex: number;
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

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
      {videoStream && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain rounded-lg"
        />
      )}

      {audioStream && (
        <audio ref={audioRef} autoPlay playsInline className="hidden" />
      )}
    </div>
  );
};

export default MediaSourceRenderer;
