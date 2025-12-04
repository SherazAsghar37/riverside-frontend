/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  setRecordingDuration,
  setScreenShareState,
  initializeSessionState,
  stopRecording,
} from "../sessionSlice";
import { useAppDispatch } from "../../../hooks/ReduxHooks";
import { useWebSocketHandler } from "./useSocketHandler";
import { useMediasoup } from "./useMediasoup";
import { useNavigate } from "react-router-dom";
import useRecordingHandler from "./useRecordingHandler";
import useMediaRecorder from "./useMediaRecorder";

const useHostSessionControl = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [streamState, setStreamState] = useState<{
    stream: MediaStream | null;
  }>({ stream: null });
  const [screenStreamState, setScreenStreamState] = useState<{
    stream: MediaStream | null;
  }>({ stream: null });

  const [videoParams] = useState({
    encodings: [
      { rid: "r0", maxBitrate: 100000, scalabilityMode: "S1T3" },
      { rid: "r1", maxBitrate: 300000, scalabilityMode: "S1T3" },
      { rid: "r2", maxBitrate: 900000, scalabilityMode: "S1T3" },
    ],
    codecOptions: { videoGoogleStartBitrate: 1000 },
  });

  const [audioParams] = useState({
    encodings: [
      { maxBitrate: 64000 }, // Single encoding for audio
    ],
    codecOptions: {
      opusStereo: true,
      opusDtx: true, // Discontinuous transmission
      opusFec: true, // Forward error correction
    },
  });

  const { recordingState, sessionInformation, controlState } = useSelector(
    (state: RootState) => state.session
  );

  const isRecording = recordingState.isRecording;

  useEffect(() => {
    onCameraToggle();
  }, [controlState.isCameraOff]);

  useEffect(() => {
    onAudioToggle();
  }, [controlState.isMuted]);

  useEffect(() => {
    onScreenShareToggle();
  }, [controlState.isScreenSharing]);

  useEffect(() => {
    InitStream();
    console.log("stream has initialized", streamRef.current);
  }, []);

  const {
    onRTPCapabilitiesReceived,
    createDevice,
    onSenderTransportCreated,
    onProducerCreated,
    onReceiveTransportCreated,
    onConsumerCreated,
    onNewProducerJoined,
    onProducerPaused,
    produceAudio,
    pauseProducingAudio,
    resumeProducingAudio,
    produceCamera,
    pauseProducingCamera,
    resumeProducingCamera,
    produceScreen,
    produceScreenAudio,
    stopProducingScreen,
    stopProducingScreenAudio,

    onDisconnected,
  } = useMediasoup();

  const handleSessionEnded = (msg: any) => {
    console.log("Session ended by host:", msg);
    dispatch(stopRecording());
    // Navigate to dashboard and clear session without closing transport
    navigate("/dashboard");
    setTimeout(() => {
      dispatch(initializeSessionState());
    }, 10);
  };

  const {
    onStartRecording,
    onStopRecording,
    onStartSpecificRecording,
    onStopSpecificRecording,
  } = useRecordingHandler({
    screenStream: screenStreamState.stream,
    cameraStream: streamState.stream,
  });

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
    onProducerPaused,
    onDisconnected,
    onSessionEnded: handleSessionEnded,
    onStartRecording: onStartRecording,
    onStopRecording: onStopRecording,
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
      setStreamState({ stream: stream });
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const initScreenStream = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      screenStreamRef.current = screenStream;
      setScreenStreamState({ stream: screenStream });
      return screenStream;
    } catch (error) {
      console.error("Error accessing display media:", error);
    }
  };

  const startProducingAudio = async () => {
    try {
      const stream = await InitStream();
      const track = stream.getAudioTracks()[0];
      const localParams = { ...audioParams, track };
      produceAudio(stream, localParams);
    } catch (error) {
      console.error("Error in producing audio:", error);
    }
  };

  const onAudioToggle = () => {
    if (controlState.isMuted) {
      console.log("Disabling audio tracks");
      streamRef.current
        ?.getAudioTracks()
        .forEach((track) => (track.enabled = false));
      pauseProducingAudio();
    } else {
      streamRef.current
        ?.getAudioTracks()
        .forEach((track) => (track.enabled = true));
      resumeProducingAudio();
    }
    setStreamState({ stream: streamRef.current });
  };

  const onCameraToggle = async () => {
    if (controlState.isCameraOff) {
      if (streamRef.current && streamRef.current.getVideoTracks().length > 0) {
        streamRef.current
          .getVideoTracks()
          .forEach((track) => (track.enabled = false));
        pauseProducingCamera();
      }
    } else {
      if (
        !streamRef.current ||
        streamRef.current.getVideoTracks().length === 0
      ) {
        await startProducingCamera();
      } else {
        streamRef.current
          .getVideoTracks()
          .forEach((track) => (track.enabled = true));

        resumeProducingCamera();
        setStreamState({ stream: streamRef.current });
      }
    }
  };

  const startProducingCamera = async () => {
    try {
      console.log("here in start producing camera");
      const stream = await InitStream();
      const track = stream.getVideoTracks()[0];
      const localParams = { ...videoParams, track };
      produceCamera(stream, localParams);
    } catch (error) {
      console.error("Error in producing camera:", error);
    }
  };

  const startProducingScreen = async (screenStream: MediaStream) => {
    try {
      const track = screenStream.getVideoTracks()[0];
      if (track) {
        track.onended = () => {
          dispatch(setScreenShareState(false) as any);
        };
      }
      const localParams = { ...videoParams, track };
      produceScreen(screenStream, localParams);
    } catch (error) {
      console.error("Error in producing screen:", error);
    }
  };

  const startProducingScreenAudio = async (screenStream: MediaStream) => {
    try {
      const audioTracks = screenStream.getAudioTracks();

      if (!audioTracks || audioTracks.length === 0) {
        console.log(
          "No audio track found in the shared screen — skipping audio production."
        );
        return;
      }

      const track = audioTracks[0];

      // Sometimes a track may exist but be 'muted' or 'inactive'
      if (track.readyState === "ended" || track.muted) {
        console.log("Audio track is not active or muted — skipping.");
        return;
      }

      const localAudioParams = { ...audioParams, track };
      await produceScreenAudio(screenStream, localAudioParams);
    } catch (error) {
      console.error("Error in producing screen with audio:", error);
    }
  };

  const onScreenShareToggle = async () => {
    if (controlState.isScreenSharing) {
      console.log("Starting Screen Share");
      const screenStream = await initScreenStream();
      startProducingScreen(screenStream);
      startProducingScreenAudio(screenStream);
    } else {
      console.log("Stopping Screen Share");

      // Stop producing logic
      stopProducingScreen();
      const audioTracks = streamRef.current.getAudioTracks();

      if (audioTracks && audioTracks.length === 0) {
        stopProducingScreenAudio();
      }

      // Properly stop screen capture tracks
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      screenStreamRef.current = null;
      setScreenStreamState({ stream: null });
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

  const {
    cameraRecorder,
    screenRecorder,
    startCameraRecording,
    startScreenRecording,
    stopCameraRecording,
    stopScreenRecording,
  } = useMediaRecorder();

  useEffect(() => {
    if (recordingState.isRecording) {
      console.log("Recording started");
      if (streamRef.current && !cameraRecorder) {
        startCameraRecording(streamRef.current);
      }
      if (screenStreamRef.current && !screenRecorder) {
        startScreenRecording(screenStreamRef.current);
      }
    } else {
      if (cameraRecorder) {
        stopCameraRecording();
      }
      if (screenRecorder) {
        stopScreenRecording();
      }
    }
  }, [
    recordingState.isRecording,
    streamRef.current,
    screenStreamRef.current,
    cameraRecorder,
    screenRecorder,
  ]);

  useEffect(() => {
    if (controlState.isScreenSharing && recordingState.isRecording) {
      onStartSpecificRecording(
        recordingState.recordingSessionId,
        "SCREEN",
        !!screenStreamRef.current?.getAudioTracks().length
      );
    } else if (!controlState.isScreenSharing && recordingState.isRecording) {
      onStopSpecificRecording(recordingState.recordingSessionId, "SCREEN");
    }
  }, [controlState.isScreenSharing]);

  return {
    socket,
    streamState,
    screenStreamState,
    connectSocket,
    setupSession,
    startProducingCamera,
    formatDuration,
  };
};

export default useHostSessionControl;
