import { Edit, Trash2, Info } from "lucide-react";
import type { Categoria } from "../../mocks/categoriasMock";

interface CategoriaCardProps {
    categoria: Categoria;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onDetails: (id: number) => void;
}

export default function CategoriaCard({
    categoria,
    onEdit,
    onDelete,
    onDetails,
}: CategoriaCardProps) {
    return (
        <div className="group flex flex-col h-full overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300 dark:border-rose-500/20 dark:bg-gradient-to-br dark:from-white/5 dark:to-white/2 dark:hover:border-rose-500/40 dark:hover:shadow-lg dark:hover:shadow-rose-500/10 light:border-rose-200/50 light:bg-gradient-to-br light:from-rose-50/30 light:to-white light:hover:border-rose-300/50 light:hover:shadow-lg light:hover:shadow-rose-200/30">
            {/* Ícone */}
            <div className="relative h-28 sm:h-40 w-full overflow-hidden bg-gradient-to-br dark:from-rose-500/10 dark:to-rose-600/5 light:from-rose-100/40 light:to-rose-50/20 flex-shrink-0">
                <div className="flex h-full items-center justify-center">
                    <div className="text-3xl sm:text-5xl">📦</div>
                </div>

                {/* Status Badge */}
                <div className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2">
                    <span
                        className={`inline-flex rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold ${categoria.ativo
                            ? "dark:bg-rose-500/20 dark:text-rose-400 light:bg-rose-100 light:text-rose-700"
                            : "dark:bg-gray-500/20 dark:text-gray-400 light:bg-gray-100 light:text-gray-600"
                            }`}
                    >
                        {categoria.ativo ? "Ativa" : "Inativa"}
                    </span>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="flex flex-1 flex-col gap-2 sm:gap-3 p-3 sm:p-4">
                <div className="min-w-0">
                    <h3 className="truncate text-xs sm:text-sm font-semibold dark:text-white light:text-gray-900">
                        {categoria.nome}
                    </h3>
                    <p className="line-clamp-2 text-xs dark:text-white/50 light:text-gray-600">
                        {categoria.descricao || "Sem descrição"}
                    </p>
                </div>

                {/* Contador de produtos */}
                <div className="flex items-center gap-1 sm:gap-2 rounded-lg dark:bg-rose-500/10 light:bg-rose-100/50 px-2 sm:px-3 py-1.5 sm:py-2 flex-shrink-0">
                    <span className="text-xs font-semibold dark:text-white/60 light:text-gray-700">Produtos:</span>
                    <span className="font-bold dark:text-rose-400 light:text-rose-600 text-xs sm:text-sm">
                        {categoria.produtosCount}
                    </span>
                </div>

                {/* Ações */}
                <div className="mt-auto flex gap-1 sm:gap-2">
                    <button
                        onClick={() => onDetails(categoria.id)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium transition-all duration-300 dark:bg-white/10 dark:text-white dark:hover:bg-rose-500/20 dark:hover:text-rose-300 light:bg-rose-100/50 light:text-gray-700 light:hover:bg-rose-200"
                        title="Detalhes"
                    >
                        <Info className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">Detalhes</span>
                    </button>
                    <button
                        onClick={() => onEdit(categoria.id)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium transition-all duration-300 dark:bg-white/10 dark:text-white dark:hover:bg-rose-500/20 light:bg-gray-100 light:text-gray-700 light:hover:bg-rose-100"
                        title="Editar"
                    >
                        <Edit className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                        onClick={() => onDelete(categoria.id)}
                        className="flex items-center justify-center rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium transition-all duration-300 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 light:bg-rose-100 light:text-rose-700 light:hover:bg-rose-200 flex-shrink-0"
                        title="Excluir"
                    >
                        <Trash2 className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
