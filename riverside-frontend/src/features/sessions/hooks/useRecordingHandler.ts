import { useDispatch } from "react-redux";
import { useRef, useEffect } from "react";
import {
  startParticipantRecordingRequestApi,
  startParticipantSpecificRecordingRequestApi,
  stopParticipantRecordingRequestApi,
  stopParticipantSpecificRecordingRequestApi,
} from "../sessionApi";
import { setIsLoading, startRecording, stopRecording } from "../sessionSlice";

const useRecordingHandler = ({
  screenStream,
  cameraStream,
}: {
  screenStream: MediaStream | null;
  cameraStream: MediaStream | null;
}) => {
  const dispatch = useDispatch();

  const screenStreamRef = useRef<MediaStream | null>(screenStream);
  const cameraStreamRef = useRef<MediaStream | null>(cameraStream);

  useEffect(() => {
    screenStreamRef.current = screenStream;
  }, [screenStream]);

  useEffect(() => {
    cameraStreamRef.current = cameraStream;
  }, [cameraStream]);

  const onStartRecording = async (msg: any) => {
    try {
      const currentScreenStream = screenStreamRef.current;
      const currentCameraStream = cameraStreamRef.current;

      console.log("Screen Stream", currentScreenStream);
      console.log("Camera Stream", currentCameraStream);
      if (msg.data.id) {
        const response = await startParticipantRecordingRequestApi({
          id: msg.data.id,
          containsAudio: true,
          recordingType:
            currentCameraStream && currentScreenStream
              ? "BOTH"
              : currentCameraStream
              ? "CAMERA"
              : "SCREEN",
        });
        if (response.status === 200) {
          dispatch(
            startRecording({
              sessionId: msg.data.id,
              participantId: response.data.id,
            })
          );
        }
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error("Failed to start participant recording:", error);
    }
  };

  const onStartSpecificRecording = async (
    id: string,
    recordingType: string,
    containsAudio: boolean
  ) => {
    try {
      if (id) {
        await startParticipantSpecificRecordingRequestApi({
          id: id,
          containsAudio: containsAudio,
          recordingType: recordingType,
        });
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error("Failed to start participant recording:", error);
    }
  };

  const onStopRecording = async (msg: any) => {
    try {
      if (msg.data.id) {
        const response = await stopParticipantRecordingRequestApi({
          id: msg.data.id,
        });
        if (response.status === 200 || response.status === 204) {
          if (!msg.data.isHost) {
            dispatch(stopRecording());
          }
        }
      }
    } catch (error) {
      console.error("Failed to start participant recording:", error);
    }
  };

  const onStopSpecificRecording = async (id: string, recordingType: string) => {
    try {
      if (id) {
        await stopParticipantSpecificRecordingRequestApi({
          id: id,
          recordingType: recordingType,
        });
      }
    } catch (error) {
      console.error("Failed to start participant recording:", error);
    }
  };
  return {
    onStartRecording,
    onStopRecording,
    onStartSpecificRecording,
    onStopSpecificRecording,
  };
};

export default useRecordingHandler;
