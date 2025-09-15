import type { RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { sendChunksToBackendApi, sendFinalCallToEndOfRecordingApi } from "../sessionApi";
import { setVideoUrl } from "../sessionSlice";

const useMediaRecorder = (stream: MediaStream): MediaRecorder => {

    const dispatch = useDispatch();

    const { sessionInformation } = useSelector((state: RootState) => state.session);

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    let chunkIndex: number = 0;
    mediaRecorder.ondataavailable = async (e: any) => {
      if (e.data.size > 0) {
        const blob = e.data;
        await sendChunks(blob, chunkIndex);
        chunkIndex++;
      }
    };

    async function sendChunks(blob: Blob, chunkIndex: number) {
      const formData = new FormData();
      formData.append("chunk", blob);
      formData.append("chunkIndex", chunkIndex.toString());
      formData.append("sessionId", sessionInformation?.sessionId || "");
      formData.append("sessionCode", sessionInformation?.sessionCode || "");
      formData.append("userType", "sender");

      const response = await sendChunksToBackendApi(formData);
      console.log(response);
    }

    mediaRecorder.onstop = () => {
      sendFinalCallToEndOfRecording();
    };

    async function sendFinalCallToEndOfRecording() {
      const response = await sendFinalCallToEndOfRecordingApi({
        sessionCode: sessionInformation?.sessionCode || "",
        userType: "sender",
        sessionId: sessionInformation?.sessionId || ""
      });

      const data = response.data;
      console.log("URL ", data.url);
      dispatch(setVideoUrl( data.url));
     
    }

    return mediaRecorder;

}

export default useMediaRecorder;