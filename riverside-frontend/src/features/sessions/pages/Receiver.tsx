// import { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import { sendChunksToBackend } from "../../../api/api";
// import SessionHeader from "../components/SessionHeader";
// import MyCamPreview from "../components/MyCamPreview";
// import ReceiverCallPreview from "../components/ReceiverCallPreview";
// import ReceiverSessionInfoCard from "../components/ReceiverSessionInfoCard";
// import ReceiverRecordingStatusCard from "../components/ReceiverRecordingStatusCard";
// import ReceiverAllRecordings from "../components/ReceiverAllRecordings";
// import { sendFinalCallToEndOfRecordingApi } from "../sessionApi";
// import useParticipantSessionControl from "../hooks/useParticipantSessionControl";
// import { useDispatch, useSelector } from "react-redux";
// import { setSessionInformation } from "../sessionSlice";
// import type { RootState } from "../../../app/store";

// export default function Receiver() {
//   // const videoRef = useRef<HTMLVideoElement>(null);
//   // const localVideoRef = useRef<HTMLVideoElement>(null);
//   // const [, setSocket] = useState<WebSocket>();
//   // const [, setRoomId] = useState<string>("");
//   // const [stream, setStream] = useState<MediaStream | null>(null);
//   // const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
//   // const [startRecordings, setStartRecordings] = useState<boolean>(false);
//   // const [videoUrl, setVideoUrl] = useState<string | null>(null);
//   // const [loaderStopRecording, setLoaderStopRecording] =
//   //   useState<boolean>(false);
//   // const [isRecording, setIsRecording] = useState(false);
//   // const [isConnected, setIsConnected] = useState(false);
//   // const [connectionStatus, setConnectionStatus] = useState("Connecting...");
//   // const [recordingDuration, setRecordingDuration] = useState(0);
//   // const location = useLocation();
//   // const navigate = useNavigate();
//   // const [readyForRecording, setReadyForRecording] = useState(false);
//   // const [stopRecording, setStopRecording] = useState(false);
//   // const sessionCode = location?.state?.sessionCode;
//   // const sessionId = location?.state?.sessionId;

//   // useEffect(() => {
//   //   if (!sessionCode || !sessionId) {
//   //     navigate("/");
//   //     return;
//   //   }

//   //   setRoomId(sessionCode);
//   //   const ws = new WebSocket("ws://localhost:8080/ws");

//   //   ws.onopen = () => {
//   //     if (sessionCode) {
//   //       ws.send(
//   //         JSON.stringify({
//   //           type: "join",
//   //           sessionId: sessionId,
//   //           token: localStorage.getItem("JWT"),
//   //         })
//   //       );
//   //       setSocket(ws);
//   //     }
//   //   };

//   //   ws.onclose = () => {
//   //     setIsConnected(false);
//   //     setConnectionStatus("Disconnected");
//   //   };

//   //   ws.onerror = () => {
//   //     setIsConnected(false);
//   //     setConnectionStatus("Connection Error");
//   //   };

//   //   const pc = new RTCPeerConnection();

//   //   ws.onmessage = async (event: any) => {
//   //     const msg = JSON.parse(event.data);
//   //     console.log("Message received: ", msg);
//   //     if (msg.type === "joined") {
//   //       setIsConnected(true);
//   //       setConnectionStatus("Connected");

//   //       console.log("WebSocket joined room:", sessionCode);
//   //     } else if (msg.type === "error") {
//   //       setIsConnected(false);
//   //       setConnectionStatus("Receiver Disconnected");
//   //       console.log("Error: ", msg.message);
//   //     } else if (msg.type === "message") {
//   //       const content = msg.content;
//   //       if (content.message === "sender-remote-description") {
//   //         await pc.setRemoteDescription(content.sdp);
//   //         const answer = await pc?.createAnswer();
//   //         await pc.setLocalDescription(answer);
//   //         ws?.send(JSON.stringify({ type: "create-answer", sdp: answer }));
//   //       } else if (content.message === "sender-iceCandidate") {
//   //         pc.addIceCandidate(content.candidate);
//   //       } else if (content.message === "start-recording") {
//   //         const socketSessionId = content.sessionId;
//   //         if (socketSessionId === sessionId) {
//   //           // set an state for ReadyToRecord.
//   //           setReadyForRecording(true);
//   //         }
//   //       } else if (content.message === "stop-recording") {
//   //         const socketSessionId = content.sessionId;
//   //         if (socketSessionId === sessionId) {
//   //           console.log("inside handle stop");
//   //           setStopRecording(true);
//   //         }
//   //       }
//   //     }
//   //   };

//   //   pc.ontrack = (event) => {
//   //     setStream(event.streams[0]);
//   //     console.log("Steram set! fires");
//   //   };

//   //   pc.onicecandidate = (event) => {
//   //     ws?.send(
//   //       JSON.stringify({
//   //         type: "receiver-iceCandidate",
//   //         candidate: event.candidate,
//   //       })
//   //     );
//   //   };

//   //   return () => {
//   //     ws.close();
//   //   };
//   // }, [sessionCode, sessionId, navigate]);

//   // useEffect(() => {
//   //   if (videoRef.current && stream) {
//   //     videoRef.current.srcObject = stream;
//   //     videoRef.current.play();
//   //   }

//   //   if (localVideoRef.current && stream) {
//   //     localVideoRef.current.srcObject = stream;
//   //     localVideoRef.current.play();
//   //   }

//   //   // added for recording triggers when stream is avialble
//   //   if (stream && readyForRecording) {
//   //     console.log("Final ");
//   //     startRecording();
//   //   }
//   // }, [stream, readyForRecording]);

//   // useEffect(() => {
//   //   let interval: NodeJS.Timeout;
//   //   if (isRecording) {
//   //     interval = setInterval(() => {
//   //       setRecordingDuration((prev) => prev + 1);
//   //     }, 1000);
//   //   }
//   //   return () => clearInterval(interval);
//   // }, [isRecording]);

//   // const formatDuration = (seconds: number) => {
//   //   const hrs = Math.floor(seconds / 3600);
//   //   const mins = Math.floor((seconds % 3600) / 60);
//   //   const secs = seconds % 60;
//   //   return `${hrs.toString().padStart(2, "0")}:${mins
//   //     .toString()
//   //     .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   // };

//   // const downloadVideo = () => {
//   //   if (videoUrl) {
//   //     const link = document.createElement("a");
//   //     link.href = videoUrl;
//   //     link.download = `recording-${sessionCode}-guest-${
//   //       new Date().toISOString().split("T")[0]
//   //     }.webm`;
//   //     document.body.appendChild(link);
//   //     link.click();
//   //     document.body.removeChild(link);
//   //   }
//   // };

//   // async function startRecording() {
//   //   setStartRecordings(true);
//   //   if (!stream) return;

//   //   const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
//   //   setRecorder(mediaRecorder);

//   //   mediaRecorder.start(3000);
//   //   setIsRecording(true);
//   //   setRecordingDuration(0);

//   //   let chunkIndex: number = 0;
//   //   mediaRecorder.ondataavailable = async (e: any) => {
//   //     if (e.data.size > 0) {
//   //       const blob = e.data;
//   //       await sendChunks(blob, chunkIndex);
//   //       chunkIndex++;
//   //     }
//   //   };

//   //   async function sendChunks(blob: Blob, chunkIndex: number) {
//   //     const formData = new FormData();
//   //     formData.append("chunk", blob);
//   //     formData.append("chunkIndex", chunkIndex.toString());
//   //     formData.append("sessionName", sessionCode);
//   //     formData.append("sessionCode", sessionId);
//   //     formData.append("userType", "receiver");

//   //     // const response = await axios.post('http://localhost:3001/api/v1/recordings/chunks', formData, {
//   //     //   headers: {
//   //     //     Authorization: `Bearer ${token}`
//   //     //   }
//   //     // });
//   //     const response = await sendChunksToBackend(formData);
//   //     console.log(response);
//   //   }

//   //   mediaRecorder.onstop = () => {
//   //     sendFinalCallToEndOfRecording();
//   //   };

//   //   async function sendFinalCallToEndOfRecording() {
//   //     const response = await sendFinalCallToEndOfRecordingApi({
//   //       sessionCode,
//   //       userType: "receiver",
//   //       sessionId,
//   //     });
//   //     const data = response.data;
//   //     setVideoUrl(data.url);
//   //     setLoaderStopRecording(false);
//   //     setIsRecording(false);
//   //   }
//   // }

//   // // const handleStartRecording = () => {
//   // //   console.log("handleStarteRecording called")
//   // //   if (recorder) {
//   // //     console.log("inside if rec am started!")
//   // //     recorder.start(3000);
//   // //     setIsRecording(true);
//   // //     setRecordingDuration(0);
//   // //   }
//   // // };

//   // useEffect(() => {
//   //   if (recorder && stopRecording) {
//   //     recorder.stop();
//   //     console.log("stopeed the recording!");
//   //     setLoaderStopRecording(true);
//   //     setIsRecording(false);
//   //   }
//   // }, [recorder, stopRecording]);

//   // // const handleStopRecording = () => {
//   // //   if (recorder) {
//   // //     recorder.stop();
//   // //     console.log("stopeed the recording!");
//   // //     setLoaderStopRecording(true);
//   // //      setIsRecording(false);
//   // //   }
//   // // };

//   const location = useLocation();
//   const navigate = useNavigate();
//   const roomName = location?.state?.sessionCode;
//   const sessionId = location?.state?.sessionId;

//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!roomName || !sessionId) {
//       navigate("/");
//       return;
//     }
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
//     streams,
//     startCall,
//     startRecording,
//     stopRecording,
//     formatDuration,
//   } = useParticipantSessionControl();
//   const firstEntry = streams.entries().next().value;
//   const stream = firstEntry ? firstEntry[1] : null;

//   console.log("Streams in Receiver: ", streams);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
//       <div className="container mx-auto px-4 py-6">
//         {/* Header */}
//         <SessionHeader
//           isConnected={isConnected}
//           connectionStatus={connectionStatus}
//         />
//         <MyCamPreview videoRef={videoRef} />
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Video Preview */}
//           <ReceiverCallPreview
//             videoRef={videoRef}
//             remoteVideoRef={stream}
//             formatDuration={formatDuration}
//           />
//           {/* Side Panel */}
//           <div className="space-y-6">
//             {/* Session Info */}
//             <ReceiverSessionInfoCard sessionCode={roomName} />

//             {/* Recording Status */}
//             <ReceiverRecordingStatusCard
//               stream={stream}
//               formatDuration={formatDuration}
//             />
//             {/* Recorded Video */}
//             <ReceiverAllRecordings sessionId={sessionId} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
