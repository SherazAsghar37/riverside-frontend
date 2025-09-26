import React from "react";
interface HostCallPreviewProps {
  stream: MediaStream | null;
}

function HostCallPreview({ stream }: HostCallPreviewProps) {
  const videoRefElement = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (stream && videoRefElement.current) {
      videoRefElement.current.srcObject = stream;
      videoRefElement.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [stream]);
  return (
    <>
      <div className="flex items-center justify-center bg-card m-3 rounded-lg ">
        <div className="w-full h-full rounded-lg aspect-[1920/1080] border-2  border-primary flex items-center justify-center bg-[var(--muted-background)]">
          <video
            ref={videoRefElement}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </div>
    </>
  );
}

export default HostCallPreview;
