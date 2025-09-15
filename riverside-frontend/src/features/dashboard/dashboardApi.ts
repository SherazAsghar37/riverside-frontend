import { api } from "../../api/api";

export async function fetchAllSessionsApi() {
  const response = await api.get('sessions/get-all-sessions');
  return response;
}

