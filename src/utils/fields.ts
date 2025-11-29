import type { Field } from "../components/common/FormsFields";

export const fieldsSearch: Field[] = [
  {
    internalName: "search",
    label: "Busca Geral",
    type: "text",
    value: "",
    colSpan: 12,
  },

  {
    internalName: "originalTitle",
    label: "Título Original",
    type: "text",
    value: "",
    colSpan: 12,
  },

  {
    internalName: "releaseDateStart",
    label: "Lançamento (De)",
    type: "datetime",
    required: true,
    value: "",
    colSpan: 6,
  },
  {
    internalName: "releaseDateEnd",
    label: "Lançamento (Até)",
    required: true,
    type: "datetime",
    value: "",
    colSpan: 6,
  },

  {
    internalName: "director",
    label: "Diretor",
    type: "text",
    value: "",
    colSpan: 6,
  },

  {
    internalName: "language",
    label: "Idioma",
    type: "text",
    value: "",
    colSpan: 3,
  },
  {
    internalName: "country",
    label: "País",
    type: "text",
    value: "",
    colSpan: 3,
  },

  {
    internalName: "indicativeRating",
    label: "Classificação Indicativa (≤)",
    type: "number",
    value: "",
    colSpan: 6,
  },

  {
    internalName: "minDuration",
    label: "Duração Mínima (min)",
    type: "number",
    value: "",
    colSpan: 6,
  },
  {
    internalName: "maxDuration",
    label: "Duração Máxima (min)",
    type: "number",
    value: "",
    colSpan: 6,
  },

  {
    internalName: "minRatingAvg",
    label: "Nota Média Mínima",
    type: "number",
    value: "",
    colSpan: 6,
  },
  {
    internalName: "maxRatingAvg",
    label: "Nota Média Máxima",
    type: "number",
    value: "",
    colSpan: 6,
  },

  {
    internalName: "status",
    label: "Status",
    type: "choice",
    options: ["DRAFT", "PUBLISHED"],
    value: "",
    colSpan: 6,
  },
  {
    internalName: "visibility",
    label: "Visibilidade",
    type: "choice",
    options: ["PRIVATE", "PUBLIC"],
    value: "",
    colSpan: 6,
  },
];

export const fieldsCreateMovie: Field[] = [
  {
    internalName: "title",
    label: "Título",
    type: "text",
    value: "",
    required: true,
    colSpan: 12,
  },
  {
    internalName: "originalTitle",
    label: "Título Original",
    required: true,
    type: "text",
    value: "",
    colSpan: 12,
  },
  {
    internalName: "tagline",
    label: "Tagline",
    type: "text",
    value: "",
    required: true,
    colSpan: 12,
  },

  {
    internalName: "description",
    label: "Descrição",
    required: true,
    type: "text",
    value: "",
    colSpan: 12,
  },
  {
    internalName: "genres",
    label: "Gêneros",
    type: "genremulti",
    value: [],
    required: false,
    colSpan: 12,
  },

  {
    internalName: "imageCover",
    label: "Imagem de Capa",
    required: true,
    type: "file",
    value: "",
    colSpan: 12,
  },
  {
    internalName: "imagePoster",
    label: "Imagem do Pôster",
    required: true,
    type: "file",
    value: "",
    colSpan: 12,
  },

  {
    internalName: "releaseDate",
    label: "Data de Lançamento",
    required: true,
    type: "datetime",
    value: "",
    colSpan: 6,
  },
  {
    internalName: "duration",
    label: "Duração (minutos)",
    type: "number",
    value: "",
    colSpan: 6,
  },

  {
    internalName: "linkPreview",
    label: "Link do Trailer/Teaser",
    required: true,
    type: "text",
    value: "",
    colSpan: 12,
  },

  {
    internalName: "actors",
    label: "Atores",
    type: "usermulti",
    value: [],
    colSpan: 12,
  },
  {
    internalName: "director",
    label: "Diretor",
    type: "user",
    value: "",
    colSpan: 12,
  },
  {
    internalName: "producers",
    label: "Produtores",
    type: "usermulti",
    value: [],
    colSpan: 12,
  },

  {
    internalName: "language",
    label: "Idioma",
    type: "text",
    value: "",
    colSpan: 6,
  },
  {
    internalName: "country",
    label: "País",
    type: "text",
    value: "",
    colSpan: 6,
  },

  {
    internalName: "budget",
    label: "Orçamento (USD)",
    type: "number",
    value: "",
    colSpan: 4,
  },
  {
    internalName: "revenue",
    label: "Receita (USD)",
    type: "number",
    value: "",
    colSpan: 4,
  },
  {
    internalName: "profit",
    label: "Lucro (USD)",
    type: "number",
    value: "",
    colSpan: 4,
  },

  {
    internalName: "ratingAvg",
    label: "Avaliação Média (%)",
    required: true,
    type: "number",
    value: "",
    colSpan: 6,
  },

  {
    internalName: "status",
    label: "Status",
    type: "choice",
    required: true,
    options: ["DRAFT", "PUBLISHED"],
    value: "",
    colSpan: 6,
  },
  {
    internalName: "visibility",
    label: "Visibilidade",
    type: "choice",
    required: true,
    options: ["PRIVATE", "PUBLIC"],
    value: "",
    colSpan: 6,
  },
];
