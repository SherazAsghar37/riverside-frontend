// import { Circle, Video } from "lucide-react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../app/store";

// interface ReceiverCallPreviewProps {
//   videoRef: React.RefObject<HTMLVideoElement | null>;
//   remoteVideoRef: MediaStream | null;

//   formatDuration: (seconds: number) => string;
// }

// const ReceiverCallPreview: React.FC<ReceiverCallPreviewProps> = ({
//   videoRef,
//   remoteVideoRef,
//   formatDuration,
// }) => {
//   const { recordingState, disableCallButton } = useSelector(
//     (state: RootState) => state.session
//   );
//   const stream = remoteVideoRef;

//   return (
//     <>
//       <div className="lg:col-span-2">
//         <div className="bg-black rounded-2xl overflow-hidden relative">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             className="w-full aspect-video object-cover"
//           />
//           {/* <video
//             ref={stream}
//             autoPlay
//             playsInline
//             className="w-full aspect-video object-cover"
//           /> */}

//           {/* Recording Indicator */}
//           {recordingState.isRecording && (
//             <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full">
//               <Circle className="w-3 h-3 fill-current animate-pulse" />
//               <span className="text-sm font-medium">
//                 REC {formatDuration(recordingState.recordingDuration)}
//               </span>
//             </div>
//           )}

//           {/* Stream Status */}
//           {!stream && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
//               <div className="text-center text-gray-300">
//                 <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                 <p>Waiting for host to start stream...</p>
//               </div>
//             </div>
//           )}

//           {/* Controls Overlay */}
//           {/* {stream && (
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
//               <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
//                 {!startRecordings ? (
//                   <button
//                     onClick={startRecording}
//                     className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
//                   >
//                     Setup Recording
//                   </button>
//                 ) : (
//                   <>
//                     {!isRecording ? (
//                       <button
//                         onClick={handleStartRecording}
//                         className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
//                       >
//                         Start Recording
//                         <Circle className="w-25 h-7" />
//                       </button>
//                     ) : (
//                       <button
//                         onClick={handleStopRecording}
//                         className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
//                       >
//                         Stop Recording
//                         <Square className="w-25 h-7" />
//                       </button>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           )} */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ReceiverCallPreview;

import { Circle, Video } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../../../app/store";

interface ReceiverCallPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: MediaStream | null;
  formatDuration: (seconds: number) => string;
}

const ReceiverCallPreview: React.FC<ReceiverCallPreviewProps> = ({
  videoRef,
  remoteVideoRef,
  formatDuration,
}) => {
  const { recordingState } = useSelector((state: RootState) => state.session);
  console.log("Remote Video Ref in ReceiverCallPreview: ", remoteVideoRef);
  // Attach MediaStream to video element
  useEffect(() => {
    if (videoRef.current && remoteVideoRef) {
      videoRef.current.srcObject = remoteVideoRef;
    }
  }, [remoteVideoRef, videoRef]);

  return (
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

        {/* Stream Status */}
        {!remoteVideoRef && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
            <div className="text-center text-gray-300">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Waiting for host to start stream...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiverCallPreview;
