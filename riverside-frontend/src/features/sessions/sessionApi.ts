import { api } from "../../api/api";

interface sendFinalCallToEndOfRecordingProps {
  sessionId: string;
}

export async function createSessionApi() {
  const response = await api.post("sessions/create-session", {});
  return response;
}

export async function sendChunksToBackendApi(formData: any) {
  const response = await api.post(`recordings/chunks`, formData);
  return response;
}

export async function sendFinalCallToEndOfRecordingApi({
  sessionId,
}: sendFinalCallToEndOfRecordingProps) {
  const response = await api.post(`sessions/end-session/${sessionId}`);
  return response;
}

export async function joinSessionApi({ sessionCode }: { sessionCode: string }) {
  const response = await api.post(`sessions/join-session/${sessionCode}`);
  return response.data;
}

export async function joinAsHostApi({ sessionCode }: { sessionCode: string }) {
  const response = await api.post(`sessions/join-as-host/${sessionCode}`);
  return response.data;
}

export async function sessionInformationApi({
  sessionCode,
}: {
  sessionCode: string;
}) {
  const response = await api.get(`sessions/information/${sessionCode}`);
  return response.data;
}
