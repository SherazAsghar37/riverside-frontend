import { Download } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

function ReceiverAllRecordings({ sessionId }: { sessionId: string }) {
  const { recordingState } = useSelector((state: RootState) => state.session);

  const downloadVideo = () => {
    if (recordingState.videoUrl) {
      const link = document.createElement("a");
      link.href = recordingState.videoUrl;
      link.download = `recording-${sessionId}-guest-${
        new Date().toISOString().split("T")[0]
      }.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <>
      {recordingState.videoUrl && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">
            Your Recording
          </h3>

          <div className="space-y-4">
            <video
              src={recordingState.videoUrl}
              controls
              className="w-full rounded-lg"
            />

            <button
              onClick={downloadVideo}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Recording</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReceiverAllRecordings;
