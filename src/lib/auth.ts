import type {
  SignupRequest,
  AuthResponse,
  LoginRequest,
  SignupPrimeiroUsuarioRequest,
} from "../types/auth";
import { api } from "./api";

export const signupPrimeiroUsuarioRequest = async (
  data: SignupPrimeiroUsuarioRequest
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/signup-primeiro-usuario", data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro na requisição de signup primeiro usuário:",
      error.response?.data || error.message
    );
    console.error("Status:", error.response?.status);
    console.error("Dados enviados:", data);

    const apiError = error.response?.data;

    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }

    if (apiError?.error) {
      throw new Error(apiError.error);
    }

    // Se não houver resposta do servidor
    if (!error.response) {
      throw new Error(
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
      );
    }

    throw new Error(`Erro ao criar associação e usuário: ${error.message}`);
  }
};

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
