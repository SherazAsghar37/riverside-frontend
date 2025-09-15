import type { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import { Circle, Loader, Video } from "lucide-react";

interface RecordingStatusCardProps {
  socket: WebSocket | null;
  initializeRecording: () => void;
  formatDuration: (seconds: number) => string;
}

function RecordingStatusCard({
  socket,
  initializeRecording,
  formatDuration,
}: RecordingStatusCardProps) {
  const { recordingState } = useSelector((state: RootState) => state.session);
  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recording Status
        </h3>

        <div className="space-y-3">
          {!socket && (
            <div className="text-center">
              <button
                onClick={initializeRecording}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Initialize Recording
              </button>
            </div>
          )}

          {socket &&
            !recordingState.isRecording &&
            !recordingState.videoUrl && (
              <div className="text-center text-gray-300">
                <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Ready to record</p>
              </div>
            )}

          {recordingState.isRecording && (
            <div className="text-center">
              <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-2">
                <Circle className="w-4 h-4 inline mr-2 fill-current animate-pulse" />
                Recording in progress
              </div>
              <p className="text-2xl font-mono text-white">
                {formatDuration(recordingState.recordingDuration)}
              </p>
            </div>
          )}

          {recordingState.loaderStopRecording && (
            <div className="text-center">
              <Loader className="w-6 h-6 mx-auto mb-2 text-purple-400 animate-spin" />
              <p className="text-sm text-gray-300">Processing recording...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RecordingStatusCard;
