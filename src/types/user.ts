export interface User {
  id: number;
  nome: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  theme?: "DARK" | "LIGHT" | null;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}
