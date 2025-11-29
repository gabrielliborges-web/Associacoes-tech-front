import { api } from "./api";

// Types
export interface Despesa {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  data: string;
  usuarioId: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateDespesaRequest {
  tipo: string;
  descricao: string;
  valor: number;
  data: string;
}

export interface UpdateDespesaRequest {
  tipo?: string;
  descricao?: string;
  valor?: number;
  data?: string;
}

export interface FiltroListagemDespesa {
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
  valorMinimo?: number;
  valorMaximo?: number;
}

// API Calls
export const listDespesas = async (
  filtros?: FiltroListagemDespesa
): Promise<Despesa[]> => {
  try {
    const params = new URLSearchParams();
    if (filtros?.tipo) params.append("tipo", filtros.tipo);
    if (filtros?.dataInicio) params.append("dataInicio", filtros.dataInicio);
    if (filtros?.dataFim) params.append("dataFim", filtros.dataFim);
    if (filtros?.valorMinimo !== undefined)
      params.append("valorMinimo", filtros.valorMinimo.toString());
    if (filtros?.valorMaximo !== undefined)
      params.append("valorMaximo", filtros.valorMaximo.toString());

    const response = await api.get(`/despesas?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao listar despesas.";
    throw new Error(message);
  }
};

export const getDespesaById = async (id: string): Promise<Despesa> => {
  try {
    const response = await api.get(`/despesas/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao obter despesa.";
    throw new Error(message);
  }
};

export const createDespesa = async (
  data: CreateDespesaRequest
): Promise<Despesa> => {
  try {
    const response = await api.post("/despesas", data);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao criar despesa.";
    throw new Error(message);
  }
};

export const updateDespesa = async (
  id: string,
  data: UpdateDespesaRequest
): Promise<Despesa> => {
  try {
    const response = await api.put(`/despesas/${id}`, data);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao atualizar despesa.";
    throw new Error(message);
  }
};

export const deleteDespesa = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/despesas/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao deletar despesa.";
    throw new Error(message);
  }
};
