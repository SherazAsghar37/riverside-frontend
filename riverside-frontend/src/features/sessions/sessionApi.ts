import axios from "axios";
import { api } from "../../api/api";

interface sendFinalCallToEndOfRecordingProps{
    sessionCode:string;
    userType:string;
    sessionId:string;
}


export async function createSessionApi(sessionName: string) {
  const response = await api.post('sessions/create-session',  { name:sessionName },);
  return response;
}


export async function sendChunksToBackendApi(formData:any){
    const response = await axios.post(`recordings/chunks`, formData);
    return response;
}

export async function sendFinalCallToEndOfRecordingApi({ sessionCode, userType, sessionId }: sendFinalCallToEndOfRecordingProps) {
    const response = await axios.post(`recordings/merge-upload-s3`,
        { sessionCode, userType, sessionId }, {

      });
    return response;
}