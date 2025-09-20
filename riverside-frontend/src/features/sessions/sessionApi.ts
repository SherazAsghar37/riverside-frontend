import { api } from "../../api/api";

interface sendFinalCallToEndOfRecordingProps {
  sessionCode: string;
  userType: string;
  sessionId: string;
}

export async function createSessionApi(sessionName: string) {
  const response = await api.post("sessions/create-session", {
    name: sessionName,
  });
  return response;
}

export async function sendChunksToBackendApi(formData: any) {
  const response = await api.post(`recordings/chunks`, formData);
  return response;
}

export async function sendFinalCallToEndOfRecordingApi({
  sessionCode,
  userType,
  sessionId,
}: sendFinalCallToEndOfRecordingProps) {
  const response = await api.post(`recordings/merge-upload-s3`, {
    sessionCode,
    userType,
    sessionId,
  });
  return response;
}

export async function joinSessionApi(sessionCode: string) {
  const response = await api.post(`sessions/join-session/${sessionCode}`);
  return response;
}
