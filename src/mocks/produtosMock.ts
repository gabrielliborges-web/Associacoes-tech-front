export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  categoriaId?: number;
  categoria?: { id: number; nome: string };
  precoVenda: number;
  precoCompra?: number;
  precoPromocional?: number;
  estoque: number;
  ativo: boolean;
  imagem?: string;
  usuarioId?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export const produtosMock: Produto[] = [
  {
    id: 1,
    nome: "Gin Tanqueray",
    descricao: "Gin Premium Inglês com sabor clássico",
    categoriaId: 1,
    categoria: { id: 1, nome: "Bebidas" },
    precoVenda: 89.9,
    precoCompra: 45.0,
    precoPromocional: 79.9,
    estoque: 12,
    ativo: true,
    imagem: "https://via.placeholder.com/300x400?text=Gin+Tanqueray",
    criadoEm: new Date("2025-01-15").toISOString(),
    atualizadoEm: new Date("2025-11-20").toISOString(),
  },
  {
    id: 2,
    nome: "Vodka Smirnoff",
    descricao: "Vodka importada, destilada 3 vezes",
    categoriaId: 1,
    categoria: { id: 1, nome: "Bebidas" },
    precoVenda: 65.5,
    precoCompra: 32.0,
    precoPromocional: undefined,
    estoque: 8,
    ativo: true,
    imagem: "https://via.placeholder.com/300x400?text=Vodka+Smirnoff",
    criadoEm: new Date("2025-02-10").toISOString(),
    atualizadoEm: new Date("2025-11-19").toISOString(),
  },
  {
    id: 3,
    nome: "Rum Bacardi",
    descricao: "Rum das Caraíbas, sabor tropical",
    categoriaId: 1,
    categoria: { id: 1, nome: "Bebidas" },
    precoVenda: 72.0,
    precoCompra: 36.0,
    precoPromocional: 64.9,
    estoque: 3,
    ativo: true,
    imagem: "https://via.placeholder.com/300x400?text=Rum+Bacardi",
    criadoEm: new Date("2025-03-05").toISOString(),
    atualizadoEm: new Date("2025-11-21").toISOString(),
  },
  {
    id: 4,
    nome: "Vinho Tinto Reserva",
    descricao: "Vinho tinto premium envelhecido 5 anos",
    categoriaId: 1,
    categoria: { id: 1, nome: "Bebidas" },
    precoVenda: 120.0,
    precoCompra: 60.0,
    precoPromocional: undefined,
    estoque: 0,
    ativo: false,
    imagem: "https://via.placeholder.com/300x400?text=Vinho+Reserva",
    criadoEm: new Date("2025-04-12").toISOString(),
    atualizadoEm: new Date("2025-11-15").toISOString(),
  },
  {
    id: 5,
    nome: "Cerveja Artesanal IPA",
    descricao: "Cerveja artesanal com lúpulo importado",
    categoriaId: 1,
    categoria: { id: 1, nome: "Bebidas" },
    precoVenda: 15.9,
    precoCompra: 8.0,
    precoPromocional: 13.9,
    estoque: 45,
    ativo: true,
    imagem: "https://via.placeholder.com/300x400?text=Cerveja+IPA",
    criadoEm: new Date("2025-05-20").toISOString(),
    atualizadoEm: new Date("2025-11-18").toISOString(),
  },
  {
    id: 6,
    nome: "Whisky Single Malt",
    descricao: "Whisky escocês envelhecido 12 anos",
    categoriaId: 1,
    categoria: { id: 1, nome: "Bebidas" },
    precoVenda: 250.0,
    precoCompra: 125.0,
    precoPromocional: 220.0,
    estoque: 2,
    ativo: true,
    imagem: "https://via.placeholder.com/300x400?text=Whisky+Single+Malt",
    criadoEm: new Date("2025-06-10").toISOString(),
    atualizadoEm: new Date("2025-11-20").toISOString(),
  },
  {
    id: 7,
    nome: "Champagne Moët",
    descricao: "Champagne francês premium",
    categoriaId: 1,
    categoria: { id: 1, nome: "Bebidas" },
    precoVenda: 180.0,
    precoCompra: 90.0,
    precoPromocional: undefined,
    estoque: 5,
    ativo: true,
    imagem: "https://via.placeholder.com/300x400?text=Champagne+Moet",
    criadoEm: new Date("2025-07-08").toISOString(),
    atualizadoEm: new Date("2025-11-17").toISOString(),
  },
  {
    id: 8,
    nome: "Tequila Premium",
    descricao: "Tequila 100% agave azul",
    categoriaId: 1,
    categoria: { id: 1, nome: "Bebidas" },
    precoVenda: 95.0,
    precoCompra: 47.0,
    precoPromocional: 85.0,
    estoque: 0,
    ativo: true,
    imagem: "https://via.placeholder.com/300x400?text=Tequila+Premium",
    criadoEm: new Date("2025-08-22").toISOString(),
    atualizadoEm: new Date("2025-11-14").toISOString(),
  },
];

export const categoriasMockProdutos = [
  { id: 1, nome: "Bebidas" },
  { id: 2, nome: "Destilados" },
  { id: 3, nome: "Vinhos" },
  { id: 4, nome: "Cerveja" },
];
