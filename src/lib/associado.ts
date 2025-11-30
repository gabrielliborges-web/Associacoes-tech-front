import { api } from "./api";

export interface Associado {
  id: number;
  nome: string;
  apelido?: string;
  email: string;
  avatarUrl?: string;
  numeroCamisaPadrao?: number;
  posicaoPreferida?: string;
  pernaDominante?: string;
  dataNascimento?: string;
  telefone?: string;
  dataEntrada?: string;
  observacoes?: string;
  perfilAssociacao: string;
  ativo: boolean;
  associacao: {
    id: number;
    nome: string;
  };
}

export interface CreateAssociadoData {
  nome: string;
  apelido?: string;
  email: string;
  dataNascimento?: string;
  telefone?: string;
  fotoUrl?: string;
  numeroCamisaPadrao?: number;
  posicaoPreferida?:
    | "GOLEIRO"
    | "ZAGUEIRO"
    | "LATERAL"
    | "VOLANTE"
    | "MEIA"
    | "ATACANTE";
  pernaDominante?: "DIREITA" | "ESQUERDA" | "AMBIDESTRO";
  ativo?: boolean;
  observacoes?: string;
}

export interface UpdateAssociadoData extends Partial<CreateAssociadoData> {}

export const associadoApi = {
  // Listar associados da associação
  listAssociados: async (associacaoId: number): Promise<Associado[]> => {
    const response = await api.get(`/associacoes/${associacaoId}/associados`);
    return response.data;
  },

  // Obter associado por ID
  getAssociado: async (id: number): Promise<Associado> => {
    const response = await api.get(`/associados/${id}`);
    return response.data;
  },

  // Criar novo associado
  createAssociado: async (
    associacaoId: number,
    data: CreateAssociadoData
  ): Promise<Associado> => {
    const response = await api.post(
      `/associacoes/${associacaoId}/associados`,
      data
    );
    return response.data;
  },

  // Atualizar associado
  updateAssociado: async (
    id: number,
    data: UpdateAssociadoData
  ): Promise<Associado> => {
    const response = await api.patch(`/associados/${id}`, data);
    return response.data;
  },

  // Desativar associado
  deactivateAssociado: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/associados/${id}`);
    return response.data;
  },
};
