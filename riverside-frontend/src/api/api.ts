import axios from "axios";

// const host = "https://d5f98db90077.ngrok-free.app";
const ip = "192.168.100.16:8080";
const host = `https://${ip}`;

export const wsBaseUrl = `wss://${ip}/ws`;
const baseURL = `${host}/api/v1/`;

export const publicApi = axios.create({
  baseURL: baseURL,
});

export const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("JWT");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Error", error);
    if (error.response?.status === 401) {
      console.log("Unauthorized");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

// Session api's
export async function fetchAllSessions() {
  const response = await api.get(`sessions/get-all-sessions`);
  return response;
}

export async function createSession(sessionName: string) {
  const response = await api.post(`sessions/create-session`, {
    name: sessionName,
  });
  return response;
}

// export async function joinSession(sessionCode: string | null) {
//   const response = await api.post(
//     `sessions/join-session/${sessionCode}`
//   );
//
//   return response;
// }

export async function getSession(sessionCode: string | null) {
  const response = await api.get(`sessions/get-session/${sessionCode}`);
  console.log(response.data.session.tracks);

  return response;
}

// user auth api's

export async function login(email: string, password: string) {
  const response = await axios.post(`${host}/api/v1/user/login`, {
    email: email,
    password: password,
  });
  return response;
}

export async function signUp(name: string, email: string, password: string) {
  const response = await axios.post(`${host}/api/v1/user/signup`, {
    name: name,
    email: email,
    password: password,
  });
  return response;
}

// Nsender & NReceiver api's
export async function sendChunksToBackend(formData: any) {
  const response = await api.post(`recordings/chunks`, formData);
  return response;
}

export async function sendFinalCallToEndOfRecording(
  roomName: string,
  userType: string,
  sessionId: string
) {
  const response = await api.post(`recordings/merge-upload-s3`, {
    sessionName: roomName,
    userType,
    sessionId,
  });
  return response;
}

export async function getAllVideosApi(sessionId: string) {
  const response = await api.get(`recordings/get-session-videos/${sessionId}`);
  return response;
}
