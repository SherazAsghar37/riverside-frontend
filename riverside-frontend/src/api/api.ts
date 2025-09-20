import axios from "axios";

const token = localStorage.getItem("JWT");
const host = "http://192.168.100.16:8080";

export const wsBaseUrl = `ws://${host}/ws`;
const baseURL = `${host}/api/v1/`;

export const publicApi = axios.create({
  baseURL: baseURL,
});

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Session api's
export async function fetchAllSessions() {
  const response = await axios.get(
    `http://192.168.100.16:8080/api/v1/sessions/get-all-sessions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function createSession(sessionName: string) {
  const response = await axios.post(
    `http://192.168.100.16:8080/api/v1/sessions/create-session`,
    { name: sessionName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function joinSession(sessionCode: string | null) {
  const response = await axios.post(
    `http://192.168.100.16:8080/api/v1/sessions/join-session/${sessionCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}

export async function getSession(sessionCode: string | null) {
  const response = await axios.get(
    `http://192.168.100.16:3001/api/v1/sessions/get-session/${sessionCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data.session.tracks);

  return response;
}

// user auth api's

export async function login(email: string, password: string) {
  const response = await axios.post(
    "http://192.168.100.16:8080/api/v1/user/login",
    {
      email: email,
      password: password,
    }
  );
  return response;
}

export async function signUp(name: string, email: string, password: string) {
  const response = await axios.post(
    `http://192.168.100.16:8080/api/v1/user/signup`,
    {
      name: name,
      email: email,
      password: password,
    }
  );
  return response;
}

// Nsender & NReceiver api's
export async function sendChunksToBackend(formData: any) {
  const response = await axios.post(
    `http://192.168.100.16:3001/api/v1/recordings/chunks`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function sendFinalCallToEndOfRecording(
  roomName: string,
  userType: string,
  sessionId: string
) {
  const response = await axios.post(
    `http://192.168.100.16:3001/api/v1/recordings/merge-upload-s3`,
    { sessionName: roomName, userType, sessionId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function getAllVideosApi(sessionId: string) {
  const response = await axios.get(
    `http://192.168.100.16:3001/api/v1/recordings/get-session-videos/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}
