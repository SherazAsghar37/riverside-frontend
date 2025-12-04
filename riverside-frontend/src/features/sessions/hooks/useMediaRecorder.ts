import type { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import { useState } from "react";

const useMediaRecorder = () => {
  const { sessionInformation } = useSelector(
    (state: RootState) => state.session
  );

  const [cameraRecorder, setCameraRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [screenRecorder, setScreenRecorder] = useState<MediaRecorder | null>(
    null
  );

  const startCameraRecording = (stream: MediaStream) => {
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    setupRecorder(recorder, "CAMERA");
    setCameraRecorder(recorder);
  };

  const startScreenRecording = (stream: MediaStream) => {
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    setupRecorder(recorder, "SCREEN");
    setScreenRecorder(recorder);
  };

  const setupRecorder = (
    mediaRecorder: MediaRecorder,
    recordingType: "CAMERA" | "SCREEN"
  ) => {
    let chunkIndex: number = 0;
    mediaRecorder.ondataavailable = async (e: any) => {
      if (e.data.size > 0) {
        const blob = e.data;
        await sendChunks(blob, chunkIndex, recordingType);
        chunkIndex++;
      }
    };
    mediaRecorder.onstop = () => {
      // sendFinalCallToEndOfRecording();
    };
    mediaRecorder.start(1000);
  };

  const stopCameraRecording = () => {
    if (cameraRecorder && cameraRecorder.state !== "inactive") {
      cameraRecorder.stop();
      setCameraRecorder(null);
    }
  };

  const stopScreenRecording = () => {
    if (screenRecorder && screenRecorder.state !== "inactive") {
      screenRecorder.stop();
      setScreenRecorder(null);
    }
  };

  async function sendChunks(
    blob: Blob,
    chunkIndex: number,
    recordingType: "CAMERA" | "SCREEN"
  ) {
    const formData = new FormData();
    formData.append("chunk", blob);
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("sessionId", sessionInformation?.sessionId || "");
    formData.append("sessionCode", sessionInformation?.sessionCode || "");
    formData.append("userType", "sender");
    formData.append("recordingType", recordingType);

    // const response = await sendChunksToBackendApi(formData);
    console.log("res");
  }

  return {
    cameraRecorder,
    screenRecorder,
    startCameraRecording,
    startScreenRecording,
    stopCameraRecording,
    stopScreenRecording,
  };
};

export default useMediaRecorder;
