import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import type { RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import {} from "../sessionSlice";
import useHostSessionControl from "../hooks/useHostSessionControl";
import HostControlSidebar from "../components/HostControlSidebar";
import HostControls from "../components/HostControls";
import HostCallPreview from "../components/HostCallPreview";

export default function ParticipantView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionCode = searchParams.get("session-code");
  const sessionId = location?.state?.sessionId;

  const dispatch = useDispatch();

  const {
    isConnected,

    sessionInformation,
    mediasoup,
  } = useSelector((state: RootState) => state.session);

  //to validate if session exists or not yet started
  useEffect(() => {
    if (!sessionCode) {
      navigate("/");
      return;
    }
    // dispatch(joinSessionAsParticipant({ sessionCode: sessionCode }) as any);
  }, [sessionId, sessionCode, navigate]);

  useEffect(() => {
    if (sessionInformation?.hostId == null) {
      console.log("Session Information:", sessionInformation);
      navigate(`/join-session?session-code=${sessionCode}`);
    }
  }, [sessionInformation, sessionCode]);

  useEffect(() => {
    if (
      sessionInformation?.hostId != null &&
      sessionInformation.sessionId != null &&
      mediasoup.setupDone
    ) {
      setupSession();
    }
  }, [mediasoup]);

  useEffect(() => {
    if (
      !isConnected &&
      sessionInformation?.sessionId != null &&
      sessionInformation?.hostId != null
    ) {
      connectSocket();
    }
  }, [isConnected, sessionInformation]);

  const {
    socket,
    streamState,
    screenStreamState,
    connectSocket,
    setupSession,
    startRecording,
    stopRecording,
    formatDuration,
  } = useHostSessionControl();

  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <HostControlSidebar
        onInviteClick={() => setInviteOpen(true)}
        hostName={sessionInformation?.hostName}
        isHost={false}
        children={
          <div className="bg-background min-h-screen flex flex-col">
            <div className="flex max-h-[85vh] flex-col flex-1 my-5">
              <HostCallPreview
                stream={streamState.stream}
                screenStreamState={screenStreamState.stream}
              />
              <HostControls
                stream={streamState.stream}
                isHost={false}
                socket={socket}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}
