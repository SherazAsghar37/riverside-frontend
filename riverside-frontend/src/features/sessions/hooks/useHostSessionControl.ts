import { use, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  setDisableCallButton,
  setRecordingDuration,
  startRecording as startRecordingState,
  stopRecording as stopRecordingState,
} from "../sessionSlice";
import { useAppDispatch } from "../../../hooks/ReduxHooks";
import useMediaRecorder from "./useMediaRecorder";
import { useWebSocketHandler } from "./useSocketHandler";
import { useMediasoup } from "./useMediasoup";

const useHostSessionControl = () => {
  const dispatch = useAppDispatch();

  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [params, setParams] = useState({
    encoding: [
      { rid: "r0", maxBitrate: 100000, scalabilityMode: "S1T3" },
      { rid: "r1", maxBitrate: 300000, scalabilityMode: "S1T3" },
      { rid: "r2", maxBitrate: 900000, scalabilityMode: "S1T3" },
    ],
    codecOptions: { videoGoogleStartBitrate: 1000 },
  });

  const {
    recordingState,
    sessionInformation,
    disableCallButton,
    controlState,
    isConnected,
  } = useSelector((state: RootState) => state.session);

  const isRecording = recordingState.isRecording;

  useEffect(() => {
    onCameraToggle();
  }, [controlState.isCameraOff]);

  useEffect(() => {
    onAudioToggle();
  }, [controlState.isMuted]);

  const { mediaRecorder, initializeMediaRecorder } = useMediaRecorder();

  const {
    onRTPCapabilitiesReceived,
    createDevice,
    onSenderTransportCreated,
    onProducerCreated,
    onReceiveTransportCreated,
    onConsumerCreated,
    onNewProducerJoined,
    produceAudio,
    produceCamera,
    stopProducingScreen,
    stopProducingCamera,
  } = useMediasoup();

  const { socket, connectSocket } = useWebSocketHandler({
    sessionId: sessionInformation?.sessionId,
    token: localStorage.getItem("JWT") ?? "",

    createDevice,
    onRTPCapabilitiesReceived,
    onSenderTransportCreated,
    onProducerCreated,
    onReceiveTransportCreated,
    onConsumerCreated,
    onNewProducerJoined,
  });

  const setupSession = () => {
    //1. First get the RTP Capabilities from the server
    //2. Create a mediasoup Device
    //3. Create a send transport
    //4. create a consumer transport
    startProducingAudio();
    if (!controlState.isCameraOff) {
      startProducingCamera();
    }
  };

  const InitStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (controlState.isCameraOff) {
        stream.getVideoTracks().forEach((track) => (track.enabled = false));
      }
      if (controlState.isMuted) {
        stream.getAudioTracks().forEach((track) => (track.enabled = false));
      }
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const startProducingAudio = async () => {
    try {
      const stream = await InitStream();
      const track = stream.getAudioTracks()[0];
      const localParams = { ...params, track };
      produceAudio(stream, localParams);
    } catch (error) {
      console.error("Error in producing audio:", error);
    }
  };

  const onAudioToggle = () => {
    if (!controlState.isMuted) {
      streamRef.current
        ?.getAudioTracks()
        .forEach((track) => (track.enabled = false));
    } else {
      streamRef.current
        ?.getAudioTracks()
        .forEach((track) => (track.enabled = true));
    }
  };

  const onCameraToggle = () => {
    if (!controlState.isCameraOff) {
      streamRef.current
        ?.getVideoTracks()
        .forEach((track) => (track.enabled = true));
      const track = streamRef.current?.getVideoTracks()[0];
      const localParams = { ...params, track };

      produceCamera(streamRef.current!, localParams);
    } else {
      streamRef.current
        ?.getVideoTracks()
        .forEach((track) => (track.enabled = false));
    }
  };

  const startProducingCamera = async () => {
    try {
      const stream = await InitStream();
      const track = stream.getVideoTracks()[0];
      const localParams = { ...params, track };
      produceCamera(stream, localParams);
    } catch (error) {
      console.error("Error in producing camera:", error);
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
    //  initializeMediaRecorder(stream!);
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
      dispatch(startRecordingState());
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
    socket,
    streamRef,
    connectSocket,
    setupSession,
    startProducingCamera,
    startRecording,
    stopRecording,
    formatDuration,
  };
};

export default useHostSessionControl;
