import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SessionHeader from "../components/SessionHeader";
import MyCamPreview from "../components/MyCamPreview";
import SessionDetailsCard from "../components/SessionDetailsCard";
import RecordingStatusCard from "../components/RecordingStatusCard";
import type { RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setSessionInformation } from "../sessionSlice";
import AllRecordingsCard from "../components/AllRecordingsCard";
import SenderCallPreview from "../components/SenderCallPreview";
import useHostSessionControl from "../hooks/useHostSessionControl";

export default function Sender() {
  const location = useLocation();
  const navigate = useNavigate();
  const roomName = location?.state?.sessionCode;
  const sessionId = location?.state?.sessionId;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!roomName || !sessionId) {
      navigate("/");
      return;
    }
    dispatch(
      setSessionInformation({ sessionCode: roomName, sessionId: sessionId })
    );
  }, [sessionId, roomName, navigate]);

  const { isConnected, connectionStatus } = useSelector(
    (state: RootState) => state.session
  );

  const {
    socket,
    videoRef,
    mediaRecorder,
    startCall,
    startRecording,
    stopRecording,
    formatDuration,
  } = useHostSessionControl();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <SessionHeader
          isConnected={isConnected}
          connectionStatus={connectionStatus}
        />
        <MyCamPreview videoRef={videoRef} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Preview */}
          <SenderCallPreview
            socket={socket}
            videoRef={videoRef}
            recorder={mediaRecorder}
            startCall={startCall}
            startRecording={startRecording}
            stopRecording={stopRecording}
            formatDuration={formatDuration}
          />

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Session Info */}
            <SessionDetailsCard sessionCode={roomName} />

            {/* Recording Status */}
            <RecordingStatusCard
              socket={socket}
              initializeRecording={startCall}
              formatDuration={formatDuration}
            />

            {/* {Recorded Video} */}
            <AllRecordingsCard sessionId={sessionId} />
          </div>
        </div>
      </div>
    </div>
  );
}
