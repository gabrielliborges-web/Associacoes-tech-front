import { api } from "./api";

// Types
export interface Movimentacao {
  id: number;
  tipo: string;
  valor: number;
  data: string;
  descricao: string;
  entrada: boolean;
  usuarioId: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface DashboardResumo {
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
  saldoMes: number;
}

export interface RegistrarAjusteRequest {
  tipo: string;
  valor: number;
  data: string;
  descricao: string;
  entrada: boolean;
}

export interface FiltroListagemMovimentacao {
  dataInicio?: string;
  dataFim?: string;
  tipo?: string;
  entrada?: boolean;
}

// API Calls
export const listMovimentacoes = async (
  filtros?: FiltroListagemMovimentacao
): Promise<Movimentacao[]> => {
  try {
    const params = new URLSearchParams();
    if (filtros?.dataInicio) params.append("dataInicio", filtros.dataInicio);
    if (filtros?.dataFim) params.append("dataFim", filtros.dataFim);
    if (filtros?.tipo) params.append("tipo", filtros.tipo);
    if (filtros?.entrada !== undefined)
      params.append("entrada", filtros.entrada.toString());

    const response = await api.get(`/movimentacoes?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    const message =
      apiError?.message || "Erro ao listar movimentações financeiras.";
    throw new Error(message);
  }
};

export const getMovimentacaoById = async (
  id: number
): Promise<Movimentacao> => {
  try {
    const response = await api.get(`/movimentacoes/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message =
      apiError?.message || "Erro ao obter movimentação financeira.";
    throw new Error(message);
  }
};

export const getDashboardResumo = async (): Promise<DashboardResumo> => {
  try {
    const response = await api.get("/movimentacoes/dashboard/resumo");
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    const message = apiError?.message || "Erro ao obter resumo do dashboard.";
    throw new Error(message);
  }
};

export const getSaldoAtual = async (): Promise<number> => {
  try {
    const response = await api.get("/movimentacoes/saldo/atual");
    return response.data.saldoAtual;
  } catch (error: any) {
    const apiError = error.response?.data;
    const message = apiError?.message || "Erro ao obter saldo atual.";
    throw new Error(message);
  }
};

export const registrarAjuste = async (
  data: RegistrarAjusteRequest
): Promise<Movimentacao> => {
  try {
    const response = await api.post("/movimentacoes/ajuste", data);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao registrar ajuste.";
    throw new Error(message);
  }
};
