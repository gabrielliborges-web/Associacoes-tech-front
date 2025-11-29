export interface Movie {
  id: number;
  title: string;
  tagline: string;
  description?: string;
  releaseDate?: string;
  duration?: number;
  indicativeRating?: number;
  imageCover?: string;
  imagePoster?: string;
  linkPreview?: string;
  director?: string;
  language?: string;
  country?: string;
  ratingAvg?: number;
  status: "DRAFT" | "PUBLISHED";
  visibility: "PUBLIC" | "PRIVATE";
  genres: { id: number; name: string }[];
  user: { id: number; name: string; email?: string };
  createdAt: string;
}

export interface MovieListResponse {
  data: Movie[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MovieFilters {
  search?: string;
  status?: "DRAFT" | "PUBLISHED";
  visibility?: "PUBLIC" | "PRIVATE";
  genre?: string;
  orderBy?: "title" | "releaseDate" | "ratingAvg" | "createdAt";
  order?: "asc" | "desc";
}

export interface MoviesState {
  data: Movie[];
  loading: boolean;
  page: number;
  totalPages: number;
  limit: number;
  filters: MovieFilters;
}

export interface MovieFormData {
  id?: number;
  title: string;
  originalTitle?: string;
  description?: string;
  releaseDate?: string;
  duration?: number | string;
  imageCover?: File | null;
  imagePoster?: File | null;
  linkPreview?: string;
  actors?: string[];
  director?: string;
  producers?: string[];
  language?: string;
  country?: string;
  budget?: number | string;
  revenue?: number | string;
  profit?: number | string;
  ratingAvg?: number | string;
  status: "DRAFT" | "PUBLISHED";
  visibility: "PRIVATE" | "PUBLIC";
}
