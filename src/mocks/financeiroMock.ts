export interface Entrada {
  id: number;
  tipo: string;
  valor: number;
  data: string;
  observacao?: string;
  usuarioNome: string;
}

export interface Despesa {
  id: number;
  tipo: string;
  descricao?: string;
  valor: number;
  data: string;
  observacao?: string;
  usuarioNome: string;
}

export interface MovimentacaoExtrato {
  id: number;
  tipo: "entrada" | "saida";
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  usuarioNome: string;
}

export interface ResumoFinanceiro {
  saldoAtual: number;
  receitasMes: number;
  despesasMes: number;
  lucro: number;
}

export interface AjusteManual {
  id: number;
  tipo: "entrada" | "saida";
  descricao: string;
  valor: number;
  data: string;
  usuarioNome: string;
  motivo: string;
}

// Mock Entradas
export const mockEntradas: Entrada[] = [
  {
    id: 1,
    tipo: "Venda",
    valor: 350.5,
    data: "2025-11-20T14:30:00Z",
    descricao: "Venda de bebidas - Evento",
    usuarioNome: "João Silva",
  },
  {
    id: 2,
    tipo: "Devolução",
    valor: 89.9,
    data: "2025-11-19T10:15:00Z",
    descricao: "Devolução - Produto danificado",
    usuarioNome: "Maria Santos",
  },
  {
    id: 3,
    tipo: "Reembolso",
    valor: 125.0,
    data: "2025-11-18T09:45:00Z",
    descricao: "Reembolso de despesa corporativa",
    usuarioNome: "Carlos Oliveira",
  },
  {
    id: 4,
    tipo: "Venda",
    valor: 892.3,
    data: "2025-11-17T15:20:00Z",
    descricao: "Venda grande - Restaurante",
    usuarioNome: "João Silva",
  },
  {
    id: 5,
    tipo: "Aluguel",
    valor: 500.0,
    data: "2025-11-16T08:00:00Z",
    descricao: "Receita de aluguel - Sala",
    usuarioNome: "Ana Costa",
  },
];

// Mock Despesas
export const mockDespesas: Despesa[] = [
  {
    id: 1,
    tipo: "Fornecedor",
    descricao: "Compra de bebidas premium",
    valor: 2350.0,
    data: "2025-11-20T11:00:00Z",
    descricao: "Fornecedor Premium Ltda",
    usuarioNome: "João Silva",
  },
  {
    id: 2,
    tipo: "Utilities",
    descricao: "Conta de água e energia",
    valor: 450.5,
    data: "2025-11-18T09:30:00Z",
    descricao: "Mês de outubro",
    usuarioNome: "Maria Santos",
  },
  {
    id: 3,
    tipo: "Equipamento",
    descricao: "Geladeira nova para estoque",
    valor: 2800.0,
    data: "2025-11-15T14:00:00Z",
    descricao: "Marca X - Premium",
    usuarioNome: "Carlos Oliveira",
  },
  {
    id: 4,
    tipo: "Salário",
    descricao: "Folha de pagamento",
    valor: 5000.0,
    data: "2025-11-10T16:45:00Z",
    descricao: "Mês de outubro - 2 funcionários",
    usuarioNome: "Ana Costa",
  },
  {
    id: 5,
    tipo: "Marketing",
    descricao: "Publicidade digital",
    valor: 350.0,
    data: "2025-11-08T10:30:00Z",
    descricao: "Google Ads - Campanha outubro",
    usuarioNome: "João Silva",
  },
];

// Mock Extrato (combinando entradas e saídas)
export const mockExtrato: MovimentacaoExtrato[] = [
  {
    id: 1,
    tipo: "entrada",
    descricao: "Venda #103",
    valor: 350.5,
    data: "2025-11-20T14:30:00Z",
    categoria: "Venda",
    usuarioNome: "João Silva",
  },
  {
    id: 2,
    tipo: "saida",
    descricao: "Compra de bebidas premium",
    valor: 2350.0,
    data: "2025-11-20T11:00:00Z",
    categoria: "Fornecedor",
    usuarioNome: "João Silva",
  },
  {
    id: 3,
    tipo: "entrada",
    descricao: "Devolução - Produto",
    valor: 89.9,
    data: "2025-11-19T10:15:00Z",
    categoria: "Devolução",
    usuarioNome: "Maria Santos",
  },
  {
    id: 4,
    tipo: "saida",
    descricao: "Conta de água e energia",
    valor: 450.5,
    data: "2025-11-18T09:30:00Z",
    categoria: "Utilities",
    usuarioNome: "Maria Santos",
  },
  {
    id: 5,
    tipo: "entrada",
    descricao: "Reembolso",
    valor: 125.0,
    data: "2025-11-18T09:45:00Z",
    categoria: "Reembolso",
    usuarioNome: "Carlos Oliveira",
  },
  {
    id: 6,
    tipo: "saida",
    descricao: "Geladeira nova para estoque",
    valor: 2800.0,
    data: "2025-11-15T14:00:00Z",
    categoria: "Equipamento",
    usuarioNome: "Carlos Oliveira",
  },
  {
    id: 7,
    tipo: "entrada",
    descricao: "Venda grande - Restaurante",
    valor: 892.3,
    data: "2025-11-17T15:20:00Z",
    categoria: "Venda",
    usuarioNome: "João Silva",
  },
  {
    id: 8,
    tipo: "saida",
    descricao: "Folha de pagamento",
    valor: 5000.0,
    data: "2025-11-10T16:45:00Z",
    categoria: "Salário",
    usuarioNome: "Ana Costa",
  },
];

// Mock para Resumo
export const mockResumoFinanceiro: ResumoFinanceiro = {
  saldoAtual: 8420.7,
  receitasMes: 2457.7,
  despesasMes: 11051.0,
  lucro: -8593.3,
};

// Dados para gráficos
export const dadosGraficosReceitasVsDespesas = [
  { mes: "Set", receitas: 3200, despesas: 2800 },
  { mes: "Out", receitas: 2800, despesas: 3500 },
  { mes: "Nov", receitas: 2457.7, despesas: 11051 },
];

export const dadosReceitasPorTipo = [
  { name: "Venda", value: 1643.7, color: "#10b981" },
  { name: "Devolução", value: 89.9, color: "#3b82f6" },
  { name: "Reembolso", value: 125.0, color: "#8b5cf6" },
  { name: "Aluguel", value: 500.0, color: "#ec4899" },
];

export const dadosDespesasPorTipo = [
  { name: "Fornecedor", value: 2350, color: "#ef4444" },
  { name: "Utilities", value: 450.5, color: "#f97316" },
  { name: "Equipamento", value: 2800, color: "#eab308" },
  { name: "Salário", value: 5000, color: "#06b6d4" },
  { name: "Marketing", value: 350, color: "#6366f1" },
];

export const mockUsuarios = [
  { id: 1, nome: "João Silva" },
  { id: 2, nome: "Maria Santos" },
  { id: 3, nome: "Carlos Oliveira" },
  { id: 4, nome: "Ana Costa" },
];

export const tiposEntrada = [
  { id: 1, nome: "Venda" },
  { id: 2, nome: "Devolução" },
  { id: 3, nome: "Reembolso" },
  { id: 4, nome: "Aluguel" },
  { id: 5, nome: "Outro" },
];

export const tiposDespesa = [
  { id: 1, nome: "Fornecedor" },
  { id: 2, nome: "Utilities" },
  { id: 3, nome: "Equipamento" },
  { id: 4, nome: "Salário" },
  { id: 5, nome: "Marketing" },
  { id: 6, nome: "Outro" },
];

// Mock para ajustes manuais
export const mockAjustes: AjusteManual[] = [
  {
    id: 1,
    tipo: "entrada",
    descricao: "Ajuste de diferença de caixa",
    valor: 50.0,
    data: "2025-11-19T16:00:00Z",
    usuarioNome: "João Silva",
    motivo: "Conferência de caixa - diferença positiva",
  },
  {
    id: 2,
    tipo: "saida",
    descricao: "Crédito do cliente - devolução",
    valor: 120.0,
    data: "2025-11-18T14:30:00Z",
    usuarioNome: "Maria Santos",
    motivo: "Crédito para compra futura",
  },
];
