import React, { useEffect } from "react";
import MediaSourceRenderer from "./MediaSourceRenderer";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useConsumerContext } from "../contexts/ConsumerContext";
import { ConsumingStreamInformation } from "@/services/ConsumerManager";
interface HostCallPreviewProps {
  stream: MediaStream | null;
}

function HostCallPreview({ stream }: HostCallPreviewProps) {
  const videoRefElement = React.useRef<HTMLVideoElement>(null);
  const {
    consumersInformation,
    updateNotification,
  }: {
    consumersInformation: Map<string, ConsumingStreamInformation>;
    updateNotification: number;
  } = useConsumerContext();

  // Calculate total number of streams
  const calculateTotalStreams = () => {
    let consumerStreams = 0;
    Array.from(consumersInformation.values()).forEach((mediaSources) => {
      consumerStreams += Array.from(mediaSources.mediaSources.values()).filter(
        (source) => source !== null
      ).length;
    });
    return (stream ? 1 : 0) + consumerStreams; // Host stream + consumer streams
  };

  // Determine grid columns based on stream count
  const getGridColumns = (streamCount: number) => {
    if (streamCount <= 1) return "grid-cols-1";
    if (streamCount <= 2) return "grid-cols-1 md:grid-cols-2";
    if (streamCount <= 4) return "grid-cols-2 md:grid-cols-2";
    if (streamCount <= 6) return "grid-cols-2 md:grid-cols-3";
    if (streamCount <= 9) return "grid-cols-2 md:grid-cols-3 lg:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  const totalStreams = calculateTotalStreams();
  const gridCols = getGridColumns(totalStreams);

  React.useEffect(() => {
    if (stream && videoRefElement.current) {
      videoRefElement.current.srcObject = stream;

      // videoRefElement.current.play().catch((error) => {
      //   console.error("Error playing video:", error);
      // });
    }
  }, [stream]);

  useEffect(() => {
    console.log("Consumers Information Updated:", consumersInformation);
  }, [updateNotification]);

  return (
    console.log("Rendering HostCallPreview with stream:", consumersInformation),
    (
      <>
        <div className="flex items-center justify-center bg-card m-3 rounded-lg">
          <div className="w-full h-full rounded-lg aspect-[1920/1080] border-2 border-primary bg-[var(--muted-background)]">
            {/* Create a grid container for all video sources */}
            <div className={`grid ${gridCols} gap-2 p-2 h-full`}>
              {/* Host video */}
              {stream && (
                <div className="relative rounded-lg overflow-hidden bg-black min-h-0">
                  <video
                    ref={videoRefElement}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Consumer videos */}
              {Array.from(consumersInformation.values()).map(
                (mediaSources: ConsumingStreamInformation, index) =>
                  Array.from(mediaSources.mediaSources.values()).map(
                    (source, sourceIndex) =>
                      source && (
                        <div
                          key={`${index}-${sourceIndex}`}
                          className="relative rounded-lg overflow-hidden bg-black min-h-0"
                        >
                          <MediaSourceRenderer
                            videoStream={source.videoStream}
                            audioStream={source.audioStream}
                            sourceIndex={sourceIndex}
                          />
                        </div>
                      )
                  )
              )}
            </div>
          </div>
        </div>
      </>
    )
  );
}

export default HostCallPreview;
