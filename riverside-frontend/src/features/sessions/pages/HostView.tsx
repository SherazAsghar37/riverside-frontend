/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import type { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import useHostSessionControl from "../hooks/useHostSessionControl";
import HostControlSidebar from "../components/HostControlSidebar";
import HostControls from "../components/HostControls";
import HostCallPreview from "../components/HostCallPreview";
import InviteModel from "../components/InviteModel";

export default function HostView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionCode = searchParams.get("session-code");
  const sessionId = location?.state?.sessionId;

  const { isConnected, sessionInformation, mediasoup } = useSelector(
    (state: RootState) => state.session
  );

  const { auth } = useSelector((state: RootState) => state);

  //to validate if session exists or not yet started
  useEffect(() => {
    console.log("Session Code:", sessionCode);
    console.log("Session ID:", sessionId);
    if (!sessionCode) {
      navigate("/");
      return;
    }
    // dispatch(joinSessionAsHost({ sessionCode: sessionCode }) as any);
  }, [sessionId, sessionCode, navigate]);

  useEffect(() => {
    if (sessionInformation?.hostId == null) {
      console.log("Session Information:", sessionInformation);
      navigate(`/join-session/host?session-code=${sessionCode}`);
    }
  }, [sessionInformation, sessionCode]);

  useEffect(() => {
    if (sessionInformation && mediasoup.setupDone) {
      setupSession();
      console.log("herree");
    }
  }, [mediasoup]);

  useEffect(() => {
    console.log("isConnected changed: ", sessionInformation);
    if (!isConnected && sessionInformation?.sessionId != null) {
      connectSocket();
    }
  }, [isConnected, sessionInformation]);

  const {
    socket,
    streamState,
    screenStreamState,
    connectSocket,
    setupSession,
  } = useHostSessionControl();

  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <HostControlSidebar
        onInviteClick={() => setInviteOpen(true)}
        isHost={true}
        hostName={auth.user?.name}
        children={
          <div className="bg-background flex flex-col overflow-hidden">
            <div className="flex-1  max-h-[85vh] overflow-hidden px-3 pt-3">
              <HostCallPreview
                stream={streamState.stream}
                screenStreamState={screenStreamState.stream}
              />
            </div>
            <div className="flex-shrink-0">
              <HostControls isHost={true} socket={socket} />
            </div>
          </div>
        }
      />
      <InviteModel
        inviteOpen={inviteOpen}
        setInviteOpen={setInviteOpen}
        sessionCode={sessionCode}
      />
    </div>
  );
}
