import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  setDisableCallButton,
  setRecordingDuration,
  startRecording as startRecordingState,
  stopRecording as stopRecordingState,
} from "../sessionSlice";
import { useAppDispatch } from "../../../hooks/ReduxHooks";
import useMediaRecorder from "../hooks/useMediaRecorder";
import { useWebSocketHandler } from "../hooks/useSocketHandler";
import { useMediasoup } from "../hooks/useMediasoup";

const useSessionControl = () => {
  const dispatch = useAppDispatch();

  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [params, setParams] = useState({
    encoding: [
      { rid: "r0", maxBitrate: 100000, scalabilityMode: "S1T3" }, // Lowest quality layer
      { rid: "r1", maxBitrate: 300000, scalabilityMode: "S1T3" }, // Middle quality layer
      { rid: "r2", maxBitrate: 900000, scalabilityMode: "S1T3" }, // Highest quality layer
    ],
    codecOptions: { videoGoogleStartBitrate: 1000 },
  });

  const { recordingState, sessionInformation, disableCallButton } = useSelector(
    (state: RootState) => state.session
  );
  const isRecording = recordingState.isRecording;

  const {
    onRTPCapabilitiesReceived,
    createDevice,
    onSenderTransportCreated,
    onProducerCreated,
  } = useMediasoup();

  const { socket } = useWebSocketHandler({
    sessionId: sessionInformation?.sessionId,
    token: localStorage.getItem("JWT") ?? "",
    url: "ws://localhost:8080/ws",
    createDevice,
    onRTPCapabilitiesReceived,
    onSenderTransportCreated,
    onProducerCreated,
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        dispatch(setRecordingDuration(recordingState.recordingDuration + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startCall = async () => {
    try {
      if (!stream) {
        dispatch(setDisableCallButton(true));
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          const track = stream.getVideoTracks()[0];
          videoRef.current.srcObject = stream;
          setParams((current) => ({ ...current, track }));
        }
        setStream(stream);
      }
      const recorder = useMediaRecorder(stream!);
      setRecorder(recorder);
      return stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = () => {
    if (recorder) {
      socket?.send(
        JSON.stringify({
          type: "message",
          content: {
            message: "start-recording",
            roomId: sessionInformation?.sessionId,
          },
        })
      );
      recorder.start(3000);
      dispatch(startRecordingState());
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
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
    recorder,
    startCall,
    startRecording,
    stopRecording,
    formatDuration,
    useWebSocketHandler,
  };
};

export default useSessionControl;
