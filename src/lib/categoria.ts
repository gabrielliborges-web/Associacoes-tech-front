import { api } from "./api";

// Types
export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateCategoriaRequest {
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

export interface UpdateCategoriaRequest {
  nome?: string;
  descricao?: string;
  ativo?: boolean;
}

// API Calls
export const listCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get("/categorias");
    return response.data.data || response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    const message = apiError?.message || "Erro ao listar categorias.";
    throw new Error(message);
  }
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  try {
    const response = await api.get(`/categorias/${id}`);
    return response.data.data || response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao obter categoria.";
    throw new Error(message);
  }
};

export const createCategoria = async (
  data: CreateCategoriaRequest
): Promise<Categoria> => {
  try {
    const response = await api.post("/categorias", data);
    return response.data.data || response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao criar categoria.";
    throw new Error(message);
  }
};

export const updateCategoria = async (
  id: number,
  data: UpdateCategoriaRequest
): Promise<Categoria> => {
  try {
    const response = await api.put(`/categorias/${id}`, data);
    return response.data.data || response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao atualizar categoria.";
    throw new Error(message);
  }
};

export const deleteCategoria = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao deletar categoria.";
    throw new Error(message);
  }
};
