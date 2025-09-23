import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setSessionInformation } from "../sessionSlice";
import useHostSessionControl from "../hooks/useHostSessionControl";
import HostControlSidebar from "../components/HostControlSidebar";
import { Button } from "@/components/ui/button";
import { BsRecord2 } from "react-icons/bs";
import { RiMic2Line } from "react-icons/ri";
import { TbVideo } from "react-icons/tb";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { LuScreenShare } from "react-icons/lu";
import { ImPhoneHangUp } from "react-icons/im";

export default function HostView() {
  const location = useLocation();
  const navigate = useNavigate();
  const roomName = location?.state?.sessionCode;
  const sessionId = location?.state?.sessionId;

  const dispatch = useDispatch();

  useEffect(() => {
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
    <div className="min-h-screen bg-background">
      <HostControlSidebar
        children={
          <div className="bg-background min-h-screen flex flex-col">
            <div className="flex flex-col flex-1 my-5">
              {/* Video Container */}
              <div className="flex items-center justify-center bg-card m-3 rounded-lg">
                <div className="w-full h-full rounded-lg aspect-[1920/1080]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center gap-2 p-4">
                <Button className="bg-red-600 hover:bg-red-400">
                  <BsRecord2 className="!w-5 !h-7" />
                  <span>Record</span>
                </Button>
                <Button className="bg-light-card rounded-lg">
                  <RiMic2Line className="!w-5 !h-7" />
                </Button>
                <Button className="bg-light-card rounded-lg">
                  <TbVideo className="!w-5 !h-7" />
                </Button>
                <Button className="bg-light-card rounded-lg">
                  <HiOutlineSpeakerWave className="!w-5 !h-7" />
                </Button>
                <Button className="bg-light-card rounded-lg">
                  <LuScreenShare className="!w-5 !h-7" />
                </Button>
                <Button className="bg-red-950 hover:bg-red-900 rounded-lg">
                  <ImPhoneHangUp color="red" className="!w-5 !h-7" />
                </Button>
              </div>
            </div>
          </div>
        }
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
