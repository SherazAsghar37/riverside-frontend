import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import type { RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { joinSessionAsHost, setSessionInformation } from "../sessionSlice";
import useHostSessionControl from "../hooks/useHostSessionControl";
import HostControlSidebar from "../components/HostControlSidebar";
import HostControls from "../components/HostControls";
import HostCallPreview from "../components/HostCallPreview";
import InviteModel from "../components/InviteModel";

export default function ParticipantView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionCode = searchParams.get("session-code");
  const sessionId = location?.state?.sessionId;

  const dispatch = useDispatch();

  const { isConnected, connectionStatus, error, sessionInformation } =
    useSelector((state: RootState) => state.session);

  //to validate if session exists or not yet started
  useEffect(() => {
    console.log("Session Code:", sessionCode);
    console.log("Session ID:", sessionId);
    if (!sessionCode || !sessionId) {
      navigate("/");
      return;
    }
    dispatch(joinSessionAsHost({ sessionCode: sessionCode }) as any);
  }, [sessionId, sessionCode, navigate]);

  useEffect(() => {
    if (sessionInformation && !isConnected) {
      connectSocket();
    } else {
      setupSession();
    }
  }, [sessionInformation, isConnected]);

  const {
    socket,
    streamRef,
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
        children={
          <div className="bg-background min-h-screen flex flex-col">
            <div className="flex flex-col flex-1 my-5">
              <HostCallPreview stream={streamRef.current} />
              <HostControls stream={streamRef.current} isHost={false} />
            </div>
          </div>
        }
      />
    </div>
  );
}
