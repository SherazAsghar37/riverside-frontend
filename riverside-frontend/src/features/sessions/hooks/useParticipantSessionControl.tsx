/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  setDisableCallButton,
  setRecordingDuration,
  stopRecording as stopRecordingState,
  initializeSessionState,
} from "../sessionSlice";
import { useAppDispatch } from "../../../hooks/ReduxHooks";
import useMediaRecorder from "./useMediaRecorder";
import { useWebSocketHandler } from "./useSocketHandler";
import { useMediasoup } from "./useMediasoup";
import { useNavigate } from "react-router-dom";

const useParticipantSessionControl = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // const [setParams] = useState({
  //   encoding: [
  //     { rid: "r0", maxBitrate: 100000, scalabilityMode: "S1T3" }, // Lowest quality layer
  //     { rid: "r1", maxBitrate: 300000, scalabilityMode: "S1T3" }, // Middle quality layer
  //     { rid: "r2", maxBitrate: 900000, scalabilityMode: "S1T3" }, // Highest quality layer
  //   ],
  //   codecOptions: { videoGoogleStartBitrate: 1000 },
  // });

  const { recordingState, sessionInformation } = useSelector(
    (state: RootState) => state.session
  );
  const isRecording = recordingState.isRecording;

  const {
    onRTPCapabilitiesReceived,
    createDevice,
    onSenderTransportCreated,
    onProducerCreated,
    onReceiveTransportCreated,
    onConsumerCreated,
    onNewProducerJoined,
  } = useMediasoup();

  const handleSessionEnded = (msg: any) => {
    console.log("Session ended by host:", msg);
    // Navigate to dashboard and clear session without closing transport
    navigate("/dashboard");
    setTimeout(() => {
      dispatch(initializeSessionState());
    }, 10);
  };

  const { socket } = useWebSocketHandler({
    sessionId: sessionInformation?.sessionId,
    token: localStorage.getItem("JWT") ?? "",

    createDevice,
    onRTPCapabilitiesReceived,
    onSenderTransportCreated,
    onProducerCreated,
    onReceiveTransportCreated,
    onConsumerCreated,
    onNewProducerJoined,
    onProducerPaused: () => {},
    onDisconnected: () => {},
    onSessionEnded: handleSessionEnded,
  });

  const { mediaRecorder, initializeMediaRecorder } = useMediaRecorder();

  useEffect(() => {
    if (sessionInformation?.sessionId) {
      console.log("here calling start call");
      startCall();
    }
  }, [sessionInformation?.sessionId]);

  const startCall = async () => {
    try {
      if (!stream) {
        dispatch(setDisableCallButton(true));
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        // let localParams = undefined;
        if (videoRef.current) {
          // const track = stream.getVideoTracks()[0];
          videoRef.current.srcObject = stream;
          // localParams = { ...params, track };
          // setParams((prev) => ({ ...prev, track }));
        }
        setStream(stream);
        initializeMediaRecorder(stream!);
        // RTP capabilities are requested automatically on socket join
      }

      return stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        dispatch(setRecordingDuration(recordingState.recordingDuration + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = () => {
    if (mediaRecorder) {
      socket?.send(
        JSON.stringify({
          type: "message",
          content: {
            message: "start-recording",
            roomId: sessionInformation?.sessionId,
          },
        })
      );
      mediaRecorder.start(3000);
      // dispatch(startRecordingState());
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      socket?.send(
        JSON.stringify({
          type: "message",
          content: {
            message: "stop-recording",
            roomId: sessionInformation?.sessionId,
          },
        })
      );
      dispatch(stopRecordingState());
    }
  };

  return {
    videoRef,
    socket,
    mediaRecorder,
    stream,
    startCall,
    startRecording,
    stopRecording,
    formatDuration,
    useWebSocketHandler,
  };
};

export default useParticipantSessionControl;
