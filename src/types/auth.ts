export interface SignupPrimeiroUsuarioRequest {
  nomeUsuario: string;
  email: string;
  senha: string;
  nomeAssociacao: string;
  apelidoAssociacao?: string;
  cidade?: string;
  estado?: string;
  theme?: "LIGHT" | "DARK";
}

export interface Associacao {
  id: number;
  nome: string;
  apelido?: string | null;
  cidade?: string | null;
  estado?: string | null;
  logoUrl?: string | null;
}

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
    associacaoId?: number;
    perfilAssociacao?: string;
    role?: string;
  };
  token: string;
  associacao?: Associacao;
}
