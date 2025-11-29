export interface SignupRequest {
  nome: string;
  email: string;
  senha: string;
  theme?: "LIGHT" | "DARK";
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  usuario: {
    id: string;
    nome: string;
    email: string;
    theme: string;
    createdAt: string;
  };
  token: string;
}
