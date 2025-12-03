import { useDispatch } from "react-redux";
import {
  startParticipantRecordingRequestApi,
  stopParticipantRecordingRequestApi,
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
  const onStartRecording = async (msg: any) => {
    try {
      console.log("Screen Stream", screenStream);
      console.log("Camera Stream", cameraStream);
      if (msg.data.id) {
        const response = await startParticipantRecordingRequestApi({
          id: msg.data.id,
          containsAudio: !!screenStream?.getAudioTracks().length,
          recordingType: cameraStream ? "CAMERA" : "SCREEN",
        });
        if (response.status === 200) {
          dispatch(
            startRecording({
              sessionId: msg.id,
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
  return { onStartRecording, onStopRecording };
};

export default useRecordingHandler;
