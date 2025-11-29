import { api } from "./api";

// Types
export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  precoVenda: number;
  precoCompra?: number;
  precoPromocional?: number;
  estoque: number;
  imagem?: string;
  ativo: boolean;
  categoriaId?: number;
  usuarioId: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateProdutoRequest {
  nome: string;
  descricao?: string;
  precoVenda: number;
  precoCompra?: number;
  precoPromocional?: number;
  estoque: number;
  categoriaId?: number;
  ativo?: boolean;
}

export interface UpdateProdutoRequest {
  nome?: string;
  descricao?: string;
  precoVenda?: number;
  precoCompra?: number;
  precoPromocional?: number;
  estoque?: number;
  categoriaId?: number;
}

export interface ChangeStatusRequest {
  ativo: boolean;
}

export interface FiltroListagemProduto {
  categoriaId?: number;
  ativo?: boolean;
  skip?: number;
  take?: number;
}

// API Calls
export const listProdutos = async (
  filtros?: FiltroListagemProduto
): Promise<Produto[]> => {
  try {
    const params = new URLSearchParams();
    if (filtros?.categoriaId)
      params.append("categoriaId", filtros.categoriaId.toString());
    if (filtros?.ativo !== undefined)
      params.append("ativo", filtros.ativo.toString());
    if (filtros?.skip) params.append("skip", filtros.skip.toString());
    if (filtros?.take) params.append("take", filtros.take.toString());

    const response = await api.get(`/produtos?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    const message = apiError?.message || "Erro ao listar produtos.";
    throw new Error(message);
  }
};

export const getProdutoById = async (id: number): Promise<Produto> => {
  try {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao obter produto.";
    throw new Error(message);
  }
};

export const createProduto = async (
  data: CreateProdutoRequest,
  file?: File
): Promise<Produto> => {
  try {
    const formData = new FormData();
    formData.append("nome", data.nome);
    if (data.descricao) formData.append("descricao", data.descricao);
    formData.append("precoVenda", data.precoVenda.toString());
    if (data.precoCompra !== undefined)
      formData.append("precoCompra", data.precoCompra.toString());
    if (data.precoPromocional !== undefined)
      formData.append("precoPromocional", data.precoPromocional.toString());
    formData.append("estoqueInicial", data.estoque.toString());
    if (data.categoriaId !== undefined)
      formData.append("categoriaId", data.categoriaId.toString());
    if (file) formData.append("imagem", file);

    const response = await api.post("/produtos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao criar produto.";
    throw new Error(message);
  }
};

export const updateProduto = async (
  id: number,
  data: UpdateProdutoRequest,
  file?: File
): Promise<Produto> => {
  try {
    const formData = new FormData();
    if (data.nome) formData.append("nome", data.nome);
    if (data.descricao) formData.append("descricao", data.descricao);
    if (data.precoVenda !== undefined)
      formData.append("precoVenda", data.precoVenda.toString());
    if (data.precoCompra !== undefined)
      formData.append("precoCompra", data.precoCompra.toString());
    if (data.precoPromocional !== undefined)
      formData.append("precoPromocional", data.precoPromocional.toString());
    if (data.estoque !== undefined)
      formData.append("estoque", data.estoque.toString());
    if (data.categoriaId !== undefined)
      formData.append("categoriaId", data.categoriaId.toString());
    if (file) formData.append("imagem", file);

    const response = await api.put(`/produtos/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao atualizar produto.";
    throw new Error(message);
  }
};

export const updateProdutoStatus = async (
  id: number,
  ativo: boolean
): Promise<Produto> => {
  try {
    const response = await api.patch(`/produtos/${id}/status`, { ativo });
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao atualizar status do produto.";
    throw new Error(message);
  }
};

export const deleteProduto = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao deletar produto.";
    throw new Error(message);
  }
};
