import { Download, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllVideosApi } from "../../../api/api";
import type { RootState } from "../../../app/store";
import { useSelector } from "react-redux";

function AllRecordingsCard({ sessionId }: { sessionId: string }) {
  const [allVideoUrls, setAllVideoUrls] = useState([]);
  const { recordingState } = useSelector((state: RootState) => state.session);

  const getAllVideos = async () => {
    try {
      const response: any = await getAllVideosApi(sessionId);

      const data = response.data;
      console.log("Data:  ", data);

      const recordings = data.recordings;
      console.log("Recordings:  ", recordings);

      setAllVideoUrls(recordings);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (recordingState.isMerged === true) {
      getAllVideos();
      console.log("Function called");
    }
  }, [recordingState.isMerged]);

  const downloadVideo = () => {
    if (recordingState.videoUrl) {
      const link = document.createElement("a");
      link.href = recordingState.videoUrl;
      link.download = `recording-${sessionId}-${
        new Date().toISOString().split("T")[0]
      }.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">
          Get All Recordings
        </h3>
        <div className="text-center text-gray-300">
          <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <button
            onClick={getAllVideos}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
          >
            Get All Recordings
          </button>
        </div>
      </div>
      {allVideoUrls.map((vid: any) => {
        return (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Your Recording
            </h3>

            <div className="space-y-4">
              <video src={vid.s3Url} controls className="w-full rounded-lg" />

              <button
                onClick={downloadVideo}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Recording</span>
              </button>
            </div>
          </div>
        );
      })}

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

export default AllRecordingsCard;
