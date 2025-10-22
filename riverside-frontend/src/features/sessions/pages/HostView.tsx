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

export default function HostView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionCode = searchParams.get("session-code");
  const sessionId = location?.state?.sessionId;

  const dispatch = useDispatch();

  const {
    isConnected,
    connectionStatus,
    error,
    sessionInformation,
    mediasoup,
  } = useSelector((state: RootState) => state.session);

  const { auth } = useSelector((state: RootState) => state);

  //to validate if session exists or not yet started
  useEffect(() => {
    console.log("Session Code:", sessionCode);
    console.log("Session ID:", sessionId);
    if (!sessionCode) {
      navigate("/");
      return;
    }
    dispatch(joinSessionAsHost({ sessionCode: sessionCode }) as any);
  }, [sessionId, sessionCode, navigate]);

  useEffect(() => {
    if (sessionInformation?.hostId == null) {
      console.log("Session Information:", sessionInformation);
      navigate(`/join-session/host?session-code=${sessionCode}`);
    }
  }, [sessionInformation]);

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
    startRecording,
    stopRecording,
    formatDuration,
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
              <HostControls stream={streamState.stream} isHost={true} />
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

// return (
//   <div className="min-h-screen bg-background">
//     <div className="bg-background min-h-screen flex flex-col">
//       {/* Header */}
//       <div>
//         <HostSessionHeader />
//       </div>
//       <div className="">

//       </div>
//     </div>
//   </div>
// );

// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import SessionHeader from "../components/SessionHeader";
// import MyCamPreview from "../components/MyCamPreview";
// import SessionDetailsCard from "../components/SessionDetailsCard";
// import RecordingStatusCard from "../components/RecordingStatusCard";
// import type { RootState } from "../../../app/store";
// import { useDispatch, useSelector } from "react-redux";
// import { setSessionInformation } from "../sessionSlice";
// import AllRecordingsCard from "../components/AllRecordingsCard";
// import SenderCallPreview from "../components/SenderCallPreview";
// import useHostSessionControl from "../hooks/useHostSessionControl";
// import HostSessionHeader from "../components/HostSessionHeader";

// export default function HostView() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const roomName = location?.state?.sessionCode;
//   const sessionId = location?.state?.sessionId;

//   const dispatch = useDispatch();

//   useEffect(() => {
//     // if (!roomName || !sessionId) {
//     //   navigate("/");
//     //   return;
//     // }
//     dispatch(
//       setSessionInformation({ sessionCode: roomName, sessionId: sessionId })
//     );
//   }, [sessionId, roomName, navigate]);

//   const { isConnected, connectionStatus } = useSelector(
//     (state: RootState) => state.session
//   );

//   const {
//     socket,
//     videoRef,
//     mediaRecorder,
//     startCall,
//     startRecording,
//     stopRecording,
//     formatDuration,
//   } = useHostSessionControl();

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="bg-background min-h-screen flex flex-col">
//         {/* Header */}
//         <HostSessionHeader />
//         <SessionHeader
//           isConnected={isConnected}
//           connectionStatus={connectionStatus}
//         />
//         <MyCamPreview videoRef={videoRef} />

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Video Preview */}
//           <SenderCallPreview
//             socket={socket}
//             videoRef={videoRef}
//             recorder={mediaRecorder}
//             startCall={startCall}
//             startRecording={startRecording}
//             stopRecording={stopRecording}
//             formatDuration={formatDuration}
//           />

//           {/* Side Panel */}
//           <div className="space-y-6">
//             {/* Session Info */}
//             <SessionDetailsCard sessionCode={roomName} />

//             {/* Recording Status */}
//             <RecordingStatusCard
//               socket={socket}
//               initializeRecording={startCall}
//               formatDuration={formatDuration}
//             />

//             {/* {Recorded Video} */}
//             <AllRecordingsCard sessionId={sessionId} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
