import { Circle, Square, Video } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

interface SenderCallPreviewProps {
  socket: WebSocket | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  recorder: MediaRecorder | null;
  startCall: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  formatDuration: (seconds: number) => string;
}

const SenderCallPreview: React.FC<SenderCallPreviewProps> = ({
  socket,
  videoRef,
  recorder,
  startCall,
  startRecording,
  stopRecording,
  formatDuration,
}) => {
  const { recordingState, disableCallButton } = useSelector(
    (state: RootState) => state.session
  );

  return (
    <>
      <div className="lg:col-span-2">
        <div className="bg-black rounded-2xl overflow-hidden relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full aspect-video object-cover"
          />

          {/* Recording Indicator */}
          {recordingState.isRecording && (
            <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full">
              <Circle className="w-3 h-3 fill-current animate-pulse" />
              <span className="text-sm font-medium">
                REC {formatDuration(recordingState.recordingDuration)}
              </span>
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm rounded-full px-4 py-3">
              <button
                onClick={startCall}
                disabled={disableCallButton}
                className="bg-purple-600 hover:bg-purple-700 text-black text-2xl  font-weight:900 p-6  rounded-full transition-colors"
              >
                Start Call
                <Video className="w-33 h-5" />
              </button>
              {!socket ? (
                ""
              ) : (
                <>
                  {!recordingState.isRecording ? (
                    <button
                      onClick={startRecording}
                      disabled={!recorder}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white p-3 rounded-full transition-colors"
                    >
                      Record Video
                      <Circle className="w-22 h-6" />
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                    >
                      <p>Stop Recording</p>
                      <Square className="w-27 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SenderCallPreview;
