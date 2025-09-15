import { api } from "../../api/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}



export async function loginApi(credentials: LoginCredentials) {
  const response = await api.post('user/login', credentials);
  return response.data;
}

export async function signUpApi(credentials: SignUpCredentials) {
  const response = await api.post('user/signup', credentials);
  return response;
}