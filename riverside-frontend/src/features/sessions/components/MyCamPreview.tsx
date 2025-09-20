import type { RefObject } from "react";

interface MyCamPreviewProps {
  videoRef?: RefObject<HTMLVideoElement | null>;
}

function MyCamPreview({ videoRef }: MyCamPreviewProps) {
  return (
    <>
      <div className="w-2">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-32 h-20 sm:w-40 sm:h-24 rounded-lg border-2 border-white absolute bottom-6 right-6 shadow-lg"
        />
      </div>
    </>
  );
}

export default MyCamPreview;
