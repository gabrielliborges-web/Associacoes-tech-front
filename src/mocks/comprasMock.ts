export interface ProdutoResumo {
  id: number;
  nome: string;
  categoria?: string;
  precoVenda: number;
  precoCompra?: number;
  estoque: number;
  ativo: boolean;
}

export interface ItemCompraMock {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  custoUnit: number;
  total: number;
}

export interface CompraMock {
  id: number;
  fornecedor?: string;
  data: string;
  total: number;
  descricao?: string;
  usuarioNome: string;
  itens: ItemCompraMock[];
}

export const mockProdutosCompra: ProdutoResumo[] = [
  {
    id: 1,
    nome: "Gim Premium",
    categoria: "Bebidas Alcoólicas",
    precoVenda: 89.99,
    precoCompra: 45.5,
    estoque: 25,
    ativo: true,
  },
  {
    id: 2,
    nome: "Vodka Importada",
    categoria: "Bebidas Alcoólicas",
    precoVenda: 129.99,
    precoCompra: 65.0,
    estoque: 18,
    ativo: true,
  },
  {
    id: 3,
    nome: "Rum Escuro",
    categoria: "Bebidas Alcoólicas",
    precoVenda: 99.99,
    precoCompra: 52.0,
    estoque: 12,
    ativo: true,
  },
  {
    id: 4,
    nome: "Vinho Tinto Reserva",
    categoria: "Bebidas Alcoólicas",
    precoVenda: 149.99,
    precoCompra: 78.0,
    estoque: 30,
    ativo: true,
  },
  {
    id: 5,
    nome: "Cerveja Premium (Cx 12)",
    categoria: "Bebidas",
    precoVenda: 45.9,
    precoCompra: 22.5,
    estoque: 50,
    ativo: true,
  },
  {
    id: 6,
    nome: "Champagne Francês",
    categoria: "Bebidas Alcoólicas",
    precoVenda: 199.99,
    precoCompra: 105.0,
    estoque: 8,
    ativo: true,
  },
  {
    id: 7,
    nome: "Whisky Escocês",
    categoria: "Bebidas Alcoólicas",
    precoVenda: 179.99,
    precoCompra: 92.0,
    estoque: 15,
    ativo: true,
  },
  {
    id: 8,
    nome: "Tequila Ouro",
    categoria: "Bebidas Alcoólicas",
    precoVenda: 119.99,
    precoCompra: 60.0,
    estoque: 10,
    ativo: true,
  },
];

export const mockCompras: CompraMock[] = [
  {
    id: 1,
    fornecedor: "Distribuidora Bebidas Brasil",
    data: "2025-11-15T14:30:00Z",
    total: 1850.5,
    descricao: "Compra regular mensal",
    usuarioNome: "João Silva",
    itens: [
      {
        id: 1,
        produtoId: 1,
        produtoNome: "Gim Premium",
        quantidade: 10,
        custoUnit: 45.5,
        total: 455.0,
      },
      {
        id: 2,
        produtoId: 4,
        produtoNome: "Vinho Tinto Reserva",
        quantidade: 15,
        custoUnit: 78.0,
        total: 1170.0,
      },
      {
        id: 3,
        produtoId: 5,
        produtoNome: "Cerveja Premium (Cx 12)",
        quantidade: 5,
        custoUnit: 22.5,
        total: 112.5,
      },
    ],
  },
  {
    id: 2,
    fornecedor: "Fornecedor Premium Ltda",
    data: "2025-11-10T10:15:00Z",
    total: 2340.0,
    descricao: "Bebidas importadas especiais",
    usuarioNome: "Maria Santos",
    itens: [
      {
        id: 4,
        produtoId: 2,
        produtoNome: "Vodka Importada",
        quantidade: 12,
        custoUnit: 65.0,
        total: 780.0,
      },
      {
        id: 5,
        produtoId: 6,
        produtoNome: "Champagne Francês",
        quantidade: 8,
        custoUnit: 105.0,
        total: 840.0,
      },
      {
        id: 6,
        produtoId: 7,
        produtoNome: "Whisky Escocês",
        quantidade: 6,
        custoUnit: 92.0,
        total: 552.0,
      },
      {
        id: 7,
        produtoId: 8,
        produtoNome: "Tequila Ouro",
        quantidade: 3,
        custoUnit: 60.0,
        total: 180.0,
      },
    ],
  },
  {
    id: 3,
    fornecedor: "Distribuição Rápida",
    data: "2025-11-05T09:45:00Z",
    total: 1245.75,
    descricao: "Reposição emergencial",
    usuarioNome: "Carlos Oliveira",
    itens: [
      {
        id: 8,
        produtoId: 3,
        produtoNome: "Rum Escuro",
        quantidade: 8,
        custoUnit: 52.0,
        total: 416.0,
      },
      {
        id: 9,
        produtoId: 5,
        produtoNome: "Cerveja Premium (Cx 12)",
        quantidade: 20,
        custoUnit: 22.5,
        total: 450.0,
      },
      {
        id: 10,
        produtoId: 1,
        produtoNome: "Gim Premium",
        quantidade: 5,
        custoUnit: 45.5,
        total: 227.5,
      },
      {
        id: 11,
        produtoId: 4,
        produtoNome: "Vinho Tinto Reserva",
        quantidade: 3,
        custoUnit: 78.0,
        total: 234.0,
      },
    ],
  },
  {
    id: 4,
    fornecedor: "Bebidas do Brasil",
    data: "2025-10-28T15:20:00Z",
    total: 890.25,
    usuarioNome: "Ana Costa",
    itens: [
      {
        id: 12,
        produtoId: 5,
        produtoNome: "Cerveja Premium (Cx 12)",
        quantidade: 25,
        custoUnit: 22.5,
        total: 562.5,
      },
      {
        id: 13,
        produtoId: 2,
        produtoNome: "Vodka Importada",
        quantidade: 4,
        custoUnit: 65.0,
        total: 260.0,
      },
      {
        id: 14,
        produtoId: 8,
        produtoNome: "Tequila Ouro",
        quantidade: 2,
        custoUnit: 60.0,
        total: 120.0,
      },
    ],
  },
  {
    id: 5,
    fornecedor: "Imports Bebidas Gourmet",
    data: "2025-10-20T11:00:00Z",
    total: 3120.0,
    descricao: "Compra especial para evento",
    usuarioNome: "João Silva",
    itens: [
      {
        id: 15,
        produtoId: 6,
        produtoNome: "Champagne Francês",
        quantidade: 12,
        custoUnit: 105.0,
        total: 1260.0,
      },
      {
        id: 16,
        produtoId: 7,
        produtoNome: "Whisky Escocês",
        quantidade: 10,
        custoUnit: 92.0,
        total: 920.0,
      },
      {
        id: 17,
        produtoId: 4,
        produtoNome: "Vinho Tinto Reserva",
        quantidade: 8,
        custoUnit: 78.0,
        total: 624.0,
      },
      {
        id: 18,
        produtoId: 3,
        produtoNome: "Rum Escuro",
        quantidade: 4,
        custoUnit: 52.0,
        total: 208.0,
      },
    ],
  },
];

export const mockUsuarios = [
  { id: 1, nome: "João Silva" },
  { id: 2, nome: "Maria Santos" },
  { id: 3, nome: "Carlos Oliveira" },
  { id: 4, nome: "Ana Costa" },
];
