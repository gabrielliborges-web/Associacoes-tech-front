import { Edit, Trash2, Info } from "lucide-react";
import type { Categoria } from "../../mocks/categoriasMock";

interface CategoriaTableProps {
    categorias: Categoria[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onDetails: (id: number) => void;
    selectedIds?: Set<number>;
    onSelectAll?: () => void;
    onSelectSingle?: (id: number) => void;
    onDeleteMultiple?: () => void;
    onClearSelection?: () => void;
}

export default function CategoriaTable({
    categorias,
    onEdit,
    onDelete,
    onDetails,
    selectedIds = new Set(),
    onSelectAll,
    onSelectSingle,
    onDeleteMultiple,
    onClearSelection,
}: CategoriaTableProps) {
    return (
        <div className="hidden lg:block overflow-x-auto rounded-2xl border backdrop-blur-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-white/5 dark:to-white/2 light:border-gray-200 light:bg-white w-full">
            {/* Selection bar */}
            {selectedIds.size > 0 && (
                <div className="border-b dark:border-white/10 light:border-gray-200 p-3 lg:p-4 bg-gradient-to-r dark:from-rose-500/10 dark:to-rose-600/10 light:from-rose-100/50 light:to-rose-200/50 flex items-center justify-between gap-4">
                    <p className="text-sm font-medium dark:text-white light:text-gray-900">
                        {selectedIds.size} categoria(s) selecionada(s)
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onDeleteMultiple}
                            className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg bg-red-500/20 dark:text-red-400 light:text-red-600 hover:bg-red-500/30 transition-all duration-300"
                        >
                            <Trash2 className="h-3.5 lg:h-4 w-3.5 lg:w-4" />
                            Deletar Selecionadas
                        </button>
                        <button
                            onClick={onClearSelection}
                            className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold rounded-lg dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20 light:bg-gray-200 light:text-gray-700 light:hover:bg-gray-300 transition-all duration-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b dark:border-white/10 light:border-gray-200">
                        <th className="px-4 lg:px-6 py-3 lg:py-4">
                            <input
                                type="checkbox"
                                checked={selectedIds.size > 0 && selectedIds.size === categorias.length}
                                onChange={onSelectAll}
                                className="h-4 w-4 cursor-pointer rounded dark:border-rose-500/30 dark:bg-rose-500/10 light:border-rose-300 light:bg-rose-100 text-rose-500 transition-colors"
                                title={selectedIds.size === categorias.length ? "Desselecionar todas" : "Selecionar todas"}
                            />
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700 whitespace-nowrap">
                            Nome
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700 whitespace-nowrap">
                            Descrição
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700 whitespace-nowrap">
                            Produtos
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700 whitespace-nowrap">
                            Status
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700 whitespace-nowrap">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-white/5 light:divide-gray-200 text-xs lg:text-sm">
                    {categorias.map((categoria) => (
                        <tr
                            key={categoria.id}
                            className={`group transition-all duration-300 ${selectedIds.has(categoria.id) ? 'dark:bg-rose-500/10 light:bg-rose-100/50' : 'dark:hover:bg-white/5 light:hover:bg-gray-50'}`}
                        >
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(categoria.id)}
                                    onChange={() => onSelectSingle?.(categoria.id)}
                                    className="h-4 w-4 cursor-pointer rounded dark:border-rose-500/30 dark:bg-rose-500/10 light:border-rose-300 light:bg-rose-100 text-rose-500 transition-colors"
                                />
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4 font-semibold dark:text-white light:text-gray-900 whitespace-nowrap">
                                {categoria.nome}
                            </td>
                            <td className="max-w-xs px-4 lg:px-6 py-3 lg:py-4 dark:text-white/70 light:text-gray-600">
                                <span className="line-clamp-1">
                                    {categoria.descricao || "-"}
                                </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium dark:text-white light:text-gray-900 whitespace-nowrap">
                                {categoria.produtosCount}
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <span
                                    className={`inline-flex rounded-full px-2 lg:px-3 py-0.5 lg:py-1 text-xs font-semibold whitespace-nowrap ${categoria.ativo
                                        ? "dark:bg-green-500/20 dark:text-green-400 light:bg-green-100 light:text-green-700"
                                        : "dark:bg-gray-500/20 dark:text-gray-400 light:bg-gray-200 light:text-gray-700"
                                        }`}
                                >
                                    {categoria.ativo ? "Ativa" : "Inativa"}
                                </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                                <div className="flex items-center gap-1 lg:gap-2">
                                    <button
                                        onClick={() => onDetails(categoria.id)}
                                        className="rounded-lg p-1.5 lg:p-2 transition-all duration-300 dark:bg-white/5 dark:text-white/70 dark:hover:bg-blue-500/20 dark:hover:text-blue-400 light:bg-gray-100 light:text-gray-600 light:hover:bg-blue-100 light:hover:text-blue-600 flex-shrink-0"
                                        title="Detalhes"
                                    >
                                        <Info className="h-3.5 lg:h-4 w-3.5 lg:w-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(categoria.id)}
                                        className="rounded-lg p-1.5 lg:p-2 transition-all duration-300 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/15 dark:hover:text-white light:bg-gray-100 light:text-gray-600 light:hover:bg-gray-200 light:hover:text-gray-900 flex-shrink-0"
                                        title="Editar"
                                    >
                                        <Edit className="h-3.5 lg:h-4 w-3.5 lg:w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(categoria.id)}
                                        className="rounded-lg p-1.5 lg:p-2 transition-all duration-300 dark:bg-white/5 dark:text-white/70 dark:hover:bg-red-500/20 dark:hover:text-red-400 light:bg-gray-100 light:text-gray-600 light:hover:bg-red-100 light:hover:text-red-600 flex-shrink-0"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-3.5 lg:h-4 w-3.5 lg:w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
