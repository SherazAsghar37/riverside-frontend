import { api } from "../../api/api";

export interface SessionInformationType {
  id: string;
  sessionCode: string;
  sessionName: string;
  createdAt: string;
  scheduledAt: string | null;
  status: string;
}

export async function fetchAllSessionsApi() {
  const response = await api.get("sessions/get-all-sessions");
  return response;
}
