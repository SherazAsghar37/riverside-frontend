import { publicApi } from "../../api/api";

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
  const response = await publicApi.post("user/login", credentials, {
    headers: {},
  });
  return response.data;
}

export async function signUpApi(credentials: SignUpCredentials) {
  const response = await publicApi.post("user/signup", credentials, {
    headers: {},
  });
  return response;
}
