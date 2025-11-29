export interface Produto {
  id: number;
  nome: string;
  precoVenda: number;
  categoria: string;
}

export interface ItemVenda {
  produtoId: number;
  quantidade: number;
  precoUnit: number;
  subtotal: number;
}

export interface Venda {
  id: number;
  data: string;
  formaPagamento: "dinheiro" | "pix" | "débito" | "crédito" | "fiado";
  total: number;
  itens: ItemVenda[];
  observacao?: string;
}

export const produtosMock: Produto[] = [
  {
    id: 1,
    nome: "Whisky Red Label",
    precoVenda: 89.9,
    categoria: "Destilados",
  },
  { id: 2, nome: "Gin Tanqueray", precoVenda: 129.9, categoria: "Destilados" },
  { id: 3, nome: "Cerveja Heineken", precoVenda: 6.99, categoria: "Cervejas" },
  { id: 4, nome: "Cerveja Brahma", precoVenda: 4.99, categoria: "Cervejas" },
  {
    id: 5,
    nome: "Vinho Tinto Família Zuccardi",
    precoVenda: 65.0,
    categoria: "Vinhos",
  },
  { id: 6, nome: "Vodka Smirnoff", precoVenda: 79.9, categoria: "Destilados" },
  { id: 7, nome: "Rum Bacardi", precoVenda: 59.9, categoria: "Destilados" },
  { id: 8, nome: "Espumante Freixenet", precoVenda: 45.0, categoria: "Vinhos" },
];

export const vendasMock: Venda[] = [
  {
    id: 104,
    data: "2025-01-12",
    formaPagamento: "pix",
    total: 249.8,
    descricao: "Cliente satisfeito",
    itens: [
      { produtoId: 1, quantidade: 2, precoUnit: 89.9, subtotal: 179.8 },
      { produtoId: 3, quantidade: 10, precoUnit: 6.99, subtotal: 69.9 },
    ],
  },
  {
    id: 103,
    data: "2025-01-11",
    formaPagamento: "dinheiro",
    total: 329.7,
    descricao: "Entrega no fim de semana",
    itens: [
      { produtoId: 2, quantidade: 2, precoUnit: 129.9, subtotal: 259.8 },
      { produtoId: 5, quantidade: 1, precoUnit: 65.0, subtotal: 65.0 },
    ],
  },
  {
    id: 102,
    data: "2025-01-10",
    formaPagamento: "crédito",
    total: 515.7,
    descricao: "Promocão de bebidas premium",
    itens: [
      { produtoId: 2, quantidade: 1, precoUnit: 129.9, subtotal: 129.9 },
      { produtoId: 1, quantidade: 3, precoUnit: 89.9, subtotal: 269.7 },
      { produtoId: 8, quantidade: 2, precoUnit: 45.0, subtotal: 90.0 },
    ],
  },
  {
    id: 101,
    data: "2025-01-09",
    formaPagamento: "débito",
    total: 159.8,
    descricao: "",
    itens: [{ produtoId: 6, quantidade: 2, precoUnit: 79.9, subtotal: 159.8 }],
  },
  {
    id: 100,
    data: "2025-01-08",
    formaPagamento: "fiado",
    total: 65.0,
    descricao: "Cliente recorrente - pagar próxima venda",
    itens: [{ produtoId: 5, quantidade: 1, precoUnit: 65.0, subtotal: 65.0 }],
  },
  {
    id: 99,
    data: "2025-01-07",
    formaPagamento: "pix",
    total: 319.7,
    descricao: "",
    itens: [
      { produtoId: 3, quantidade: 20, precoUnit: 6.99, subtotal: 139.8 },
      { produtoId: 7, quantidade: 3, precoUnit: 59.9, subtotal: 179.7 },
    ],
  },
];
