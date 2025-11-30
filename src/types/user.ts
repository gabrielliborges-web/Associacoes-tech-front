export type Role = "USER" | "ADMIN" | "SUPERADMIN";

export type PerfilAssociacao =
  | "ASSOCIADO"
  | "DIRETOR"
  | "TECNICO"
  | "ADMINISTRADOR";

export interface User {
  id: number;
  nome: string;
  email: string;
  avatarUrl?: string | null;
  role: Role;
  theme?: "DARK" | "LIGHT" | null;
  ativo: boolean;
  associacaoId?: number | null;
  perfilAssociacao?: PerfilAssociacao | null;

  // dados pessoais opcionais
  apelido?: string | null;
  telefone?: string | null;
  dataNascimento?: string | null;

  criadoEm?: string | Date;
  atualizadoEm?: string | Date;
}
