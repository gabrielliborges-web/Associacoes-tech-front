import { api } from "./api";

// Types
export interface VendaItem {
  id: number;
  produtoId: number;
  quantidade: number;
  precoUnit: number;
  produto: {
    id: number;
    nome: string;
    descricao: string;
    estoque?: number;
  };
}

export interface Venda {
  id: number;
  formaPagamento: string;
  data: string;
  total: number | string;
  descricao?: string | null;
  usuarioId: number;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
  itens?: VendaItem[];
  criadoEm: string;
}

export interface CreateVendaRequest {
  formaPagamento: string;
  descricao?: string | null;
  data?: string | null;
  itens: {
    produtoId: number;
    quantidade: number;
    precoUnit: number;
  }[];
}

export interface FiltroListagemVenda {
  dataInicio?: string;
  dataFim?: string;
  formaPagamento?: string;
}

// API Calls
export const listVendas = async (
  filtros?: FiltroListagemVenda
): Promise<Venda[]> => {
  try {
    const params = new URLSearchParams();
    if (filtros?.dataInicio) params.append("dataInicio", filtros.dataInicio);
    if (filtros?.dataFim) params.append("dataFim", filtros.dataFim);
    if (filtros?.formaPagamento)
      params.append("formaPagamento", filtros.formaPagamento);

    const response = await api.get(`/vendas?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    const message = apiError?.message || "Erro ao listar vendas.";
    throw new Error(message);
  }
};

export const getVendaById = async (id: number): Promise<Venda> => {
  try {
    const response = await api.get(`/vendas/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao obter venda.";
    throw new Error(message);
  }
};

export const createVenda = async (data: CreateVendaRequest): Promise<Venda> => {
  try {
    const response = await api.post("/vendas", data);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao criar venda.";
    throw new Error(message);
  }
};

export const cancelVenda = async (id: number): Promise<any> => {
  try {
    const response = await api.post(`/vendas/${id}/cancelar`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao cancelar venda.";
    throw new Error(message);
  }
};
