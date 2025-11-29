import { api } from "./api";

// Types
export interface EntradaFinanceira {
  id: number;
  tipo: string;
  descricao: string;
  valor: number;
  data: string;
  usuarioId: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateEntradaFinanceiraRequest {
  tipo: string;
  descricao: string;
  valor: number;
  data: string;
}

export interface UpdateEntradaFinanceiraRequest {
  tipo?: string;
  descricao?: string;
  valor?: number;
  data?: string;
}

export interface FiltroListagemEntradaFinanceira {
  dataInicio?: string;
  dataFim?: string;
  tipo?: string;
}

// API Calls
export const listEntradas = async (
  filtros?: FiltroListagemEntradaFinanceira
): Promise<EntradaFinanceira[]> => {
  try {
    const params = new URLSearchParams();
    if (filtros?.dataInicio) params.append("dataInicio", filtros.dataInicio);
    if (filtros?.dataFim) params.append("dataFim", filtros.dataFim);
    if (filtros?.tipo) params.append("tipo", filtros.tipo);

    const response = await api.get(
      `/entradas-financeiras?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    const message = apiError?.message || "Erro ao listar entradas financeiras.";
    throw new Error(message);
  }
};

export const getEntradaById = async (
  id: number
): Promise<EntradaFinanceira> => {
  try {
    const response = await api.get(`/entradas-financeiras/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao obter entrada financeira.";
    throw new Error(message);
  }
};

export const createEntrada = async (
  data: CreateEntradaFinanceiraRequest
): Promise<EntradaFinanceira> => {
  try {
    const response = await api.post("/entradas-financeiras", data);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao criar entrada financeira.";
    throw new Error(message);
  }
};

export const updateEntrada = async (
  id: number,
  data: UpdateEntradaFinanceiraRequest
): Promise<EntradaFinanceira> => {
  try {
    const response = await api.put(`/entradas-financeiras/${id}`, data);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message =
      apiError?.message || "Erro ao atualizar entrada financeira.";
    throw new Error(message);
  }
};

export const deleteEntrada = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/entradas-financeiras/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao deletar entrada financeira.";
    throw new Error(message);
  }
};
