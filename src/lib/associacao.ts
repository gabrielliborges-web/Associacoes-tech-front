import { api } from "./api";

export type Associacao = {
  id: number;
  nome: string;
  apelido?: string;
  descricao?: string;
  cidade?: string;
  estado?: string;
  logoUrl?: string;
  regrasInternas?: string;
  horarioPadraoInicio?: string;
  horarioPadraoFim?: string;
  tipoJogoPadrao?: "BABA" | "AMISTOSO" | "CAMPEONATO" | "TREINO";
  criadoEm?: string;
  atualizadoEm?: string;
};

export async function getMinhaAssociacao() {
  const { data } = await api.get<Associacao>("/associacao/minha");
  return data;
}

export async function updateMinhaAssociacao(payload: Partial<Associacao>) {
  // Sempre envia como FormData para garantir upload de arquivo
  let formData: FormData;
  if (payload instanceof FormData) {
    formData = payload;
  } else {
    formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
  }
  const { data } = await api.put<Associacao>("/associacao/minha", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function listAssociacoes() {
  const { data } = await api.get<Associacao[]>("/associacao");
  return data;
}

export async function getAssociacaoById(id: number) {
  const { data } = await api.get<Associacao>(`/associacao/${id}`);
  return data;
}

export async function createAssociacao(
  payload: Omit<Associacao, "id" | "criadoEm" | "atualizadoEm">
) {
  const { data } = await api.post<Associacao>("/associacao", payload);
  return data;
}

export async function updateAssociacao(
  id: number,
  payload: Partial<Associacao>
) {
  const { data } = await api.patch<Associacao>(`/associacao/${id}`, payload);
  return data;
}

export async function deleteAssociacao(id: number) {
  const { data } = await api.delete<{ success: boolean }>(`/associacao/${id}`);
  return data;
}
