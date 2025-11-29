import { api } from "./api";

// Types
export interface Configuracao {
  id: number;
  saldoInicial: number;
  mesAtual: number;
  anoAtual: number;
  atualizadoEm: string;
}

export interface UpdateConfiguracaoRequest {
  saldoInicial?: number;
  mesAtual?: number;
}

// API Calls
export const getConfiguracao = async (): Promise<Configuracao> => {
  try {
    const response = await api.get("/configuracoes");
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    const message = apiError?.message || "Erro ao obter configurações.";
    throw new Error(message);
  }
};

export const updateConfiguracao = async (
  data: UpdateConfiguracaoRequest
): Promise<Configuracao> => {
  try {
    const response = await api.put("/configuracoes", data);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao atualizar configurações.";
    throw new Error(message);
  }
};
