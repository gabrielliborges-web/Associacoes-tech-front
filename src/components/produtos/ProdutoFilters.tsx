import { Search, Filter, SortAsc } from "lucide-react";

interface ProdutoFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: "todos" | "ativos" | "inativos";
    onStatusChange: (value: "todos" | "ativos" | "inativos") => void;
    categoriaFilter: number | null;
    onCategoriaChange: (value: number | null) => void;
    ordenacao: "nome" | "preco" | "estoque";
    onOrdenacaoChange: (value: "nome" | "preco" | "estoque") => void;
    categorias: Array<{ id: number; nome: string }>;
}

export default function ProdutoFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    categoriaFilter,
    onCategoriaChange,
    ordenacao,
    onOrdenacaoChange,
    categorias,
}: ProdutoFiltersProps) {
    return (
        <div className="space-y-4 rounded-2xl border p-4 backdrop-blur-sm dark:border-rose-500/20 dark:bg-gradient-to-br dark:from-rose-500/5 dark:to-rose-600/5 md:space-y-0 md:flex md:items-center md:gap-4 light:border-rose-200/50 light:bg-white">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 dark:text-white/40 light:text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-lg border py-2 pl-10 pr-4 text-sm transition-all duration-300 focus:outline-none dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-white dark:placeholder-white/50 dark:focus:border-rose-500/40 dark:focus:bg-rose-500/15 light:border-rose-200/50 light:bg-rose-50 light:text-gray-900 light:placeholder-gray-500 light:focus:border-rose-400 light:focus:bg-white"
                />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 dark:text-white/60 light:text-gray-500" />
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value as "todos" | "ativos" | "inativos")}
                    className="rounded-lg border py-2 px-3 text-sm transition-all duration-300 focus:outline-none dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-white dark:focus:border-rose-500/40 light:border-rose-200/50 light:bg-white light:text-gray-900 light:focus:border-rose-400"
                >
                    <option value="todos">Todos</option>
                    <option value="ativos">Ativos</option>
                    <option value="inativos">Inativos</option>
                </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
                <select
                    value={categoriaFilter || ""}
                    onChange={(e) => onCategoriaChange(e.target.value ? Number(e.target.value) : null)}
                    className="rounded-lg border py-2 px-3 text-sm transition-all duration-300 focus:outline-none dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-white dark:focus:border-rose-500/40 light:border-rose-200/50 light:bg-white light:text-gray-900 light:focus:border-rose-400"
                >
                    <option value="">Todas as categorias</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nome}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 dark:text-white/60 light:text-gray-500" />
                <select
                    value={ordenacao}
                    onChange={(e) => onOrdenacaoChange(e.target.value as "nome" | "preco" | "estoque")}
                    className="rounded-lg border py-2 px-3 text-sm transition-all duration-300 focus:outline-none dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-white dark:focus:border-rose-500/40 light:border-rose-200/50 light:bg-white light:text-gray-900 light:focus:border-rose-400"
                >
                    <option value="nome">Nome</option>
                    <option value="preco">Preço</option>
                    <option value="estoque">Estoque</option>
                </select>
            </div>
        </div>
    );
}
