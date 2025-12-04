import { api } from "../../api/api";

export async function createSessionApi() {
  const response = await api.post("sessions/create-session", {});
  return response;
}

export async function sendChunksToBackendApi(formData: any) {
  const response = await api.post(`recordings/chunks`, formData);
  return response;
}

export async function sendFinalCallToEndOfRecordingApi({
  sessionCode,
}: {
  sessionCode: string;
}) {
  const response = await api.post(`sessions/end-session/${sessionCode}`);
  return response;
}

// export async function joinSessionApi({ sessionCode }: { sessionCode: string }) {
//   const response = await api.post(`sessions/join-session/${sessionCode}`);
//   return response.data;
// }

export async function joinAsHostApi({ sessionCode }: { sessionCode: string }) {
  const response = await api.post(`sessions/join-as-host/${sessionCode}`);
  return response.data;
}

export async function sessionInformationApi({
  sessionCode,
  isHost,
}: {
  sessionCode: string;
  isHost: boolean;
}) {
  const response = await api.get(
    `sessions/information/${sessionCode}?isHost=${isHost}`
  );
  return response.data;
}

export async function startRecordingRequestApi({
  sessionCode,
}: {
  sessionCode: string;
}) {
  const response = await api.post(
    `session-recordings/start-recording/${sessionCode}`
  );
  return response;
}

export async function stopRecordingRequestApi({
  sessionCode,
}: {
  sessionCode: string;
}) {
  const response = await api.post(
    `session-recordings/stop-recording/${sessionCode}`
  );
  return response;
}

export async function startParticipantRecordingRequestApi({
  id,
  containsAudio,
  recordingType,
}: {
  id: string;
  containsAudio: boolean;
  recordingType: string;
}) {
  const response = await api.post(`participant-recordings/start-recording`, {
    sessionRecordingId: id,
    containsAudio,
    recordingType,
  });
  return response;
}

export async function stopParticipantRecordingRequestApi({
  id,
}: {
  id: string;
}) {
  const response = await api.post(
    `participant-recordings/stop-recording/${id}`
  );
  return response;
}

export async function startParticipantSpecificRecordingRequestApi({
  id,
  containsAudio,
  recordingType,
}: {
  id: string;
  containsAudio: boolean;
  recordingType: string;
}) {
  const response = await api.post(
    `participant-recordings/start-specific-recording`,
    {
      sessionRecordingId: id,
      containsAudio,
      recordingType,
    }
  );
  return response;
}

export async function stopParticipantSpecificRecordingRequestApi({
  id,
  recordingType,
}: {
  id: string;
  recordingType: string;
}) {
  const response = await api.post(
    `participant-recordings/stop-specific-recording`,
    {
      sessionRecordingId: id,
      recordingType,
    }
  );
  return response;
}
