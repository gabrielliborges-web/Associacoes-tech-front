export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  produtosCount: number;
  ativo: boolean;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

export const categoriasMock: Categoria[] = [
  {
    id: 1,
    nome: "Bebidas",
    descricao: "Refrigerantes, cervejas, drinks e energéticos",
    produtosCount: 12,
    ativo: true,
    dataCriacao: "2025-01-01",
    dataAtualizacao: "2025-01-15",
  },
  {
    id: 2,
    nome: "Destilados",
    descricao: "Vodka, gin, whisky e rum premium",
    produtosCount: 8,
    ativo: true,
    dataCriacao: "2025-01-02",
    dataAtualizacao: "2025-01-14",
  },
  {
    id: 3,
    nome: "Vinhos",
    descricao: "Tintos, brancos e rosés selecionados",
    produtosCount: 15,
    ativo: true,
    dataCriacao: "2025-01-03",
    dataAtualizacao: "2025-01-10",
  },
  {
    id: 4,
    nome: "Cervejas",
    descricao: "Cervejas artesanais e industriais",
    produtosCount: 6,
    ativo: true,
    dataCriacao: "2025-01-04",
    dataAtualizacao: "2025-01-12",
  },
  {
    id: 5,
    nome: "Licores",
    descricao: "Licores variados e bebidas doces",
    produtosCount: 0,
    ativo: false,
    dataCriacao: "2025-01-05",
    dataAtualizacao: "2025-01-05",
  },
];

interface Produto {
  id: number;
  nome: string;
}

export const produtosMockPorCategoria: Record<number, Produto[]> = {
  1: [
    { id: 1, nome: "Coca-Cola 2L" },
    { id: 2, nome: "Sprite 350ml" },
    { id: 3, nome: "Guaraná Antartica" },
    { id: 4, nome: "Água Mineral" },
  ],
  2: [
    { id: 5, nome: "Vodka Absolut" },
    { id: 6, nome: "Gin Tanqueray" },
    { id: 7, nome: "Whisky Jack Daniels" },
    { id: 8, nome: "Rum Bacardi" },
  ],
  3: [
    { id: 9, nome: "Vinho Tinto Chileno" },
    { id: 10, nome: "Vinho Branco Português" },
    { id: 11, nome: "Vinho Rosé" },
  ],
  4: [
    { id: 12, nome: "Heineken" },
    { id: 13, nome: "Brahma" },
    { id: 14, nome: "Ambev" },
    { id: 15, nome: "Artesanal Craft" },
  ],
};
