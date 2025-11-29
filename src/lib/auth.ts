import type { SignupRequest, AuthResponse, LoginRequest } from "../types/auth";
import { api } from "./api";

export const signupRequest = async (
  data: SignupRequest
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/signup", data);
    return response.data;
  } catch (error: any) {
    console.error("Erro na requisição de signup:", error.response?.data);

    const apiError = error.response?.data;

    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }

    if (apiError?.error) {
      throw new Error(apiError.error);
    }

    throw new Error("Erro ao cadastrar usuário.");
  }
};

export const loginRequest = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;

    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }

    if (apiError?.error) {
      throw new Error(apiError.error);
    }

    throw new Error("Erro ao fazer login.");
  }
};
