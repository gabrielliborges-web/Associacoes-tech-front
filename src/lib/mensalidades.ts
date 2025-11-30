import { api } from "./api";

export interface Mensalidade {
  id: number;
  associacaoId: number;
  usuarioId: number;
  ano: number;
  mes: number;
  valor: number;
  status: "ABERTA" | "PAGA" | "ATRASADA" | "ISENTA" | "CANCELADA";
  vencimento: string;
  dataPagamento?: string | null;
  formaPagamento?: string | null;
  comprovanteUrl?: string | null;
  observacoes?: string | null;
}

export const mensalidadesApi = {
  getMinhasMensalidades: async (ano: number): Promise<Mensalidade[]> => {
    const res = await api.get(`/financeiro/mensalidades/me?ano=${ano}`);
    return res.data;
  },

  getMensalidadesUsuario: async (
    usuarioId: number,
    ano: number
  ): Promise<Mensalidade[]> => {
    const res = await api.get(
      `/financeiro/mensalidades/usuario/${usuarioId}?ano=${ano}`
    );
    return res.data;
  },

  gerarMensalidadesAno: async (ano: number) => {
    const res = await api.post(`/financeiro/mensalidades/gerar-ano`, { ano });
    return res.data;
  },

  getConfig: async () => {
    const res = await api.get(`/financeiro/mensalidades/config`);
    return res.data;
  },

  upsertConfig: async (payload: {
    valorPadrao: number | string;
    diaVencimento: number;
    ativo?: boolean;
  }) => {
    const res = await api.post(`/financeiro/mensalidades/config`, payload);
    return res.data;
  },

  pagarMensalidade: async (
    id: number,
    payload: {
      dataPagamento?: string | Date;
      valorPago?: number;
      formaPagamento?: string;
      comprovanteUrl?: string;
      observacoes?: string;
    }
  ) => {
    const res = await api.put(`/financeiro/mensalidades/${id}/pagar`, payload);
    return res.data;
  },
};
