import React, { useEffect, useState } from "react";
import MediaSourceRenderer from "./MediaSourceRenderer";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useConsumerContext } from "../contexts/ConsumerContext";
import { ConsumingStreamInformation } from "@/services/ConsumerManager";
import { Pin, PinOff } from "lucide-react";

interface HostCallPreviewProps {
  stream: MediaStream | null;
  screenStreamState: MediaStream | null;
}

function HostCallPreview({ stream, screenStreamState }: HostCallPreviewProps) {
  const videoRefElement = React.useRef<HTMLVideoElement>(null);
  const screenVideoRefElement = React.useRef<HTMLVideoElement>(null);
  const [pinnedStream, setPinnedStream] = useState<string | null>(null);

  const {
    consumersInformation,
    updateNotification,
  }: {
    consumersInformation: Map<string, ConsumingStreamInformation>;
    updateNotification: number;
  } = useConsumerContext();

  const { controlState } = useSelector((state: RootState) => state.session);

  // Generate initials for host
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  const calculateTotalStreams = () => {
    let consumerStreams = 0;
    Array.from(consumersInformation.values()).forEach((mediaSources) => {
      consumerStreams += Array.from(mediaSources.mediaSources.values()).filter(
        (source) => source !== null
      ).length;
    });
    return (stream ? 1 : 0) + (screenStreamState ? 1 : 0) + consumerStreams;
  };

  // Determine grid columns based on stream count
  const getGridColumns = (streamCount: number) => {
    if (streamCount <= 1) return "grid-cols-1";
    if (streamCount === 3) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"; // 3 horizontally on md+
    if (streamCount <= 2) return "grid-cols-1 md:grid-cols-2";
    if (streamCount <= 4) return "grid-cols-2 md:grid-cols-2";
    if (streamCount <= 6) return "grid-cols-2 md:grid-cols-3";
    if (streamCount <= 9) return "grid-cols-2 md:grid-cols-3 lg:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  const totalStreams = calculateTotalStreams();
  const gridCols = getGridColumns(totalStreams);

  const handlePinToggle = (streamId: string) => {
    setPinnedStream((prevPinned) =>
      prevPinned === streamId ? null : streamId
    );
  };

  React.useEffect(() => {
    if (stream && videoRefElement.current) {
      if (videoRefElement.current) {
        videoRefElement.current.srcObject = null;
        videoRefElement.current.srcObject = stream;
      }
    }
  }, [controlState.isCameraOff, stream, screenStreamState, pinnedStream]);

  React.useEffect(() => {
    if (screenStreamState && screenVideoRefElement.current) {
      if (screenVideoRefElement.current) {
        screenVideoRefElement.current.srcObject = null;
        screenVideoRefElement.current.srcObject = screenStreamState;
      }
    }
  }, [controlState.isCameraOff, screenStreamState, pinnedStream, stream]);

  useEffect(() => {
    console.log("Consumers Information Updated:", consumersInformation);
  }, [updateNotification]);

  const { user } = useSelector((state: RootState) => state.auth);

  return (
    console.log("Rendering HostCallPreview with stream:", consumersInformation),
    console.log(
      "Rendering HostCallPreview with screen stream:",
      screenStreamState
    ),
    (
      <>
        <div className="flex items-center justify-center bg-card-light rounded-lg h-full overflow-hidden mx-5 py-3">
          <div className="w-full h-full rounded-lg border-4 border-primary bg-[var(--muted-background)] relative overflow-hidden">
            {/* Layout changes based on pinned state */}
            {pinnedStream ? (
              /* Pinned layout variations based on total stream count */
              (() => {
                // Helpers to render tiles
                const renderHost = (isPinned: boolean) => (
                  <div className="relative rounded-lg overflow-hidden bg-background w-full h-full">
                    {!controlState.isCameraOff ? (
                      <video
                        ref={videoRefElement}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-dark-card rounded-lg flex items-center justify-center">
                        <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {getInitials(user?.name ?? "Host User")}
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-card bg-opacity-60 text-white px-3 py-1 rounded-md text-[12px]">
                      {user?.name ?? ""}
                    </div>
                    <button
                      onClick={() => handlePinToggle("host")}
                      className="absolute top-2 right-2 bg-card bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-md transition-all"
                    >
                      {isPinned ? <PinOff size={18} /> : <Pin size={16} />}
                    </button>
                  </div>
                );

                const renderScreen = (isPinned: boolean) => (
                  <div className="relative rounded-lg overflow-hidden bg-background w-full h-full">
                    <video
                      ref={screenVideoRefElement}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handlePinToggle("screen")}
                      className="absolute top-2 right-2 bg-card bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-md transition-all"
                    >
                      {isPinned ? <PinOff size={18} /> : <Pin size={16} />}
                    </button>
                  </div>
                );

                type Tile = {
                  id: string;
                  node: React.ReactNode;
                  isPinned: boolean;
                };
                const tiles: Tile[] = [];

                // Host tile
                if (stream) {
                  const isPinned = pinnedStream === "host";
                  tiles.push({
                    id: "host",
                    node: renderHost(isPinned),
                    isPinned,
                  });
                }

                // Screen tile
                if (screenStreamState && controlState.isScreenSharing) {
                  const isPinned = pinnedStream === "screen";
                  tiles.push({
                    id: "screen",
                    node: renderScreen(isPinned),
                    isPinned,
                  });
                }

                // Consumer tiles
                Array.from(consumersInformation.values()).forEach(
                  (mediaSources: ConsumingStreamInformation, index) => {
                    Array.from(mediaSources.mediaSources.values()).forEach(
                      (source, sourceIndex) => {
                        const streamId = `consumer-${index}-${sourceIndex}`;
                        if (
                          !source ||
                          !(source.videoStream || source.audioStream)
                        )
                          return;
                        const isPinned = pinnedStream === streamId;
                        const node = (
                          <div
                            key={streamId}
                            className="relative rounded-lg overflow-hidden bg-black w-full h-full"
                          >
                            <MediaSourceRenderer
                              videoStream={source.videoStream}
                              audioStream={source.audioStream}
                              sourceIndex={sourceIndex}
                              producerName={
                                source.audioParams?.producerName ?? ""
                              }
                            />
                            <button
                              onClick={() => handlePinToggle(streamId)}
                              className="absolute top-2 right-2 bg-card bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-md transition-all z-10"
                            >
                              {isPinned ? (
                                <PinOff size={18} />
                              ) : (
                                <Pin size={16} />
                              )}
                            </button>
                          </div>
                        );
                        tiles.push({ id: streamId, node, isPinned });
                      }
                    );
                  }
                );

                const pinnedTile = tiles.find((t) => t.isPinned) || null;
                if (!pinnedTile) return null;
                const others = tiles
                  .filter((t) => t.id !== pinnedTile.id)
                  .map((t) => t.node);

                // Layout cases
                if (totalStreams === 1) {
                  // Only one: pinned takes all space
                  return (
                    <div className="w-full h-full p-2">
                      <div className="w-full h-full min-h-0">
                        {pinnedTile.node}
                      </div>
                    </div>
                  );
                }

                if (totalStreams === 2 || totalStreams === 3) {
                  // Pinned right ~75%, others left stacked
                  return (
                    <div className="flex h-full p-2 gap-2">
                      <div className="basis-1/4 min-w-0 flex flex-col gap-2 min-h-0">
                        {others.map((node, i) => (
                          <div key={i} className="flex-1 min-h-0">
                            {node}
                          </div>
                        ))}
                      </div>
                      <div className="basis-3/4 min-w-0 min-h-0">
                        <div className="w-full h-full min-h-0">
                          {pinnedTile.node}
                        </div>
                      </div>
                    </div>
                  );
                }

                // 4 or more: pinned on top full width, others below in grid
                return (
                  <div className="flex flex-col h-full p-2 gap-2">
                    <div className="flex-[6] min-h-0">
                      <div className="w-full h-full min-h-0">
                        {pinnedTile.node}
                      </div>
                    </div>
                    <div className="flex-[4] min-h-0">
                      <div
                        className={`grid gap-2 h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
                      >
                        {others.map((node, i) => (
                          <div key={i} className="min-h-0">
                            {node}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Normal grid layout when nothing is pinned */
              <div className={`grid ${gridCols} gap-2 p-2 h-full`}>
                {/* Host video */}
                {stream && (
                  <div className="relative rounded-lg overflow-hidden bg-background min-h-0">
                    {!controlState.isCameraOff ? (
                      <video
                        ref={videoRefElement}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-dark-card rounded-lg flex items-center justify-center">
                        <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {getInitials(user?.name ?? "Host User")}
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-card bg-opacity-60 text-white px-3 py-1 rounded-md text-[12px]">
                      {user?.name ?? ""}
                    </div>
                    <button
                      onClick={() => handlePinToggle("host")}
                      className="absolute top-2 right-2 bg-card bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-md transition-all"
                    >
                      <Pin size={16} />
                    </button>
                  </div>
                )}
                {/* Screen share */}
                {screenStreamState && controlState.isScreenSharing && (
                  <div className="relative rounded-lg overflow-hidden bg-background min-h-0">
                    <video
                      ref={screenVideoRefElement}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handlePinToggle("screen")}
                      className="absolute top-2 right-2 bg-card bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-md transition-all"
                    >
                      <Pin size={16} />
                    </button>
                  </div>
                )}

                {/* Consumer videos */}
                {Array.from(consumersInformation.values()).map(
                  (mediaSources: ConsumingStreamInformation, index) =>
                    Array.from(mediaSources.mediaSources.values()).map(
                      (source, sourceIndex) => {
                        const streamId = `consumer-${index}-${sourceIndex}`;
                        return source &&
                          (source.videoStream || source.audioStream) ? (
                          <div
                            key={streamId}
                            className="relative rounded-lg overflow-hidden bg-black min-h-0"
                          >
                            <MediaSourceRenderer
                              videoStream={source.videoStream}
                              audioStream={source.audioStream}
                              sourceIndex={sourceIndex}
                              producerName={
                                source.audioParams?.producerName ?? ""
                              }
                            />
                            <button
                              onClick={() => handlePinToggle(streamId)}
                              className="absolute top-2 right-2 bg-card bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-md transition-all z-10"
                            >
                              <Pin size={16} />
                            </button>
                          </div>
                        ) : null;
                      }
                    )
                )}
              </div>
            )}
          </div>
        </div>
      </>
    )
  );
}

export default HostCallPreview;
