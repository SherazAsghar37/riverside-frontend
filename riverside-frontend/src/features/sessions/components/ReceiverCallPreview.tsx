import { Circle, Video } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "../../../app/store";

interface ReceiverCallPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: MediaStream | null;
  formatDuration: (seconds: number) => string;
}

const ReceiverCallPreview: React.FC<ReceiverCallPreviewProps> = ({
  videoRef,
  remoteVideoRef,
  formatDuration,
}) => {
  const { recordingState } = useSelector((state: RootState) => state.session);
  const [streamDebugInfo, setStreamDebugInfo] = useState<string>("");

  // Enhanced effect with better debugging
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement && remoteVideoRef) {
      console.log("=== Stream Assignment Debug ===");
      console.log("Video element exists:", !!videoElement);
      console.log("MediaStream exists:", !!remoteVideoRef);
      console.log("MediaStream active:", remoteVideoRef.active);
      console.log("MediaStream id:", remoteVideoRef.id);

      const tracks = remoteVideoRef.getTracks();
      console.log("Total tracks:", tracks.length);

      tracks.forEach((track, index) => {
        console.log(`Track ${index}:`, {
          kind: track.kind,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          id: track.id,
        });
      });

      // Set debug info for UI
      setStreamDebugInfo(
        `Active: ${remoteVideoRef.active}, Tracks: ${tracks.length}, ` +
          `Video tracks: ${tracks.filter((t) => t.kind === "video").length}`
      );

      // Assign stream to video element
      videoElement.srcObject = remoteVideoRef;

      // Add event listeners for debugging
      const handleLoadedMetadata = () => {
        console.log("Video metadata loaded");
        console.log(
          "Video dimensions:",
          videoElement.videoWidth,
          "x",
          videoElement.videoHeight
        );

        // Explicitly call play() when metadata is loaded
        videoElement
          .play()
          .then(() => console.log("Video play successful"))
          .catch((error) => {
            console.warn(
              "Autoplay prevented, user interaction may be required:",
              error
            );
            // You could show a play button here if needed
          });
      };

      const handleLoadedData = () => {
        console.log("Video data loaded");

        // Also try to play when data is loaded as a fallback
        if (videoElement.paused) {
          videoElement.play().catch(console.error);
        }
      };

      const handlePlay = () => {
        console.log("Video started playing");
      };

      const handleError = (e: any) => {
        console.error("Video error:", e);
      };

      const handleCanPlay = () => {
        console.log("Video can start playing");
        // Another opportunity to ensure playback starts
        if (videoElement.paused) {
          videoElement.play().catch(console.error);
        }
      };

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("loadeddata", handleLoadedData);
      videoElement.addEventListener("canplay", handleCanPlay);
      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("error", handleError);

      // Initial play attempt
      videoElement.play().catch(console.error);

      // Cleanup
      return () => {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoElement.removeEventListener("loadeddata", handleLoadedData);
        videoElement.removeEventListener("canplay", handleCanPlay);
        videoElement.removeEventListener("play", handlePlay);
        videoElement.removeEventListener("error", handleError);
      };
    } else {
      setStreamDebugInfo("No video element or stream");
      console.log("Missing:", {
        videoElement: !!videoElement,
        remoteVideoRef: !!remoteVideoRef,
      });
    }
  }, [remoteVideoRef, videoRef]);

  return (
    <div className="lg:col-span-2">
      <div className="bg-black rounded-2xl overflow-hidden relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={true}
          className="w-full aspect-video object-cover"
        />

        {/* Debug Info Overlay - Remove in production */}
        {process.env.NODE_ENV === "development" && remoteVideoRef && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-[10px]">
            {streamDebugInfo}
          </div>
        )}

        {/* Recording Indicator */}
        {recordingState.isRecording && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full">
            <Circle className="w-3 h-3 fill-current animate-pulse" />
            <span className="text-sm font-medium">
              REC {formatDuration(recordingState.recordingDuration)}
            </span>
          </div>
        )}

        {/* Stream Status */}
        {!remoteVideoRef && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
            <div className="text-center text-gray-300">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Waiting for host to start stream...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiverCallPreview;
