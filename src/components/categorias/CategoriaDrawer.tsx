import { X, Calendar, Package } from "lucide-react";
import type { Categoria } from "../../mocks/categoriasMock";
import { produtosMockPorCategoria } from "../../mocks/categoriasMock";

interface CategoriaDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    categoria: Categoria | null;
}

export default function CategoriaDrawer({
    isOpen,
    onClose,
    categoria,
}: CategoriaDrawerProps) {
    if (!categoria) return null;

    const produtos = produtosMockPorCategoria[categoria.id] || [];

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return "-";
        try {
            return new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(date));
        } catch {
            return String(date);
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 dark:bg-black/40 light:bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform backdrop-blur-xl transition-transform duration-300 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:border-l dark:border-rose-500/20 light:bg-gradient-to-b light:from-white light:to-rose-50/30 light:border-l light:border-rose-200/50 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur dark:border-b dark:border-rose-500/20 dark:bg-gray-900/50 light:border-b light:border-rose-200/50 light:bg-white/50">
                    <h2 className="text-lg sm:text-xl font-bold dark:text-white light:text-gray-900">Detalhes da Categoria</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-all duration-300 dark:hover:bg-white/10 light:hover:bg-rose-100/50"
                    >
                        <X className="h-5 w-5 dark:text-white/60 light:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar dark:scrollbar-track-transparent dark:scrollbar-thumb-white/20 light:scrollbar-track-gray-100 light:scrollbar-thumb-gray-400">
                    {/* Icon */}
                    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br dark:from-rose-500/10 dark:to-rose-600/5 light:from-rose-100/40 light:to-rose-50/20">
                        <div className="flex h-full items-center justify-center text-6xl">
                            📦
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-6 p-4 sm:p-6">
                        {/* Title */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-600">
                                Nome
                            </p>
                            <p className="mt-2 text-xl sm:text-2xl font-bold dark:text-white light:text-gray-900">
                                {categoria.nome}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${categoria.ativo
                                    ? "dark:bg-rose-500/20 dark:text-rose-400 light:bg-rose-100 light:text-rose-700"
                                    : "dark:bg-gray-500/20 dark:text-gray-400 light:bg-gray-100 light:text-gray-600"
                                    }`}
                            >
                                {categoria.ativo ? "Ativa" : "Inativa"}
                            </span>
                        </div>

                        {/* Description */}
                        {categoria.descricao && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-600">
                                    Descrição
                                </p>
                                <p className="mt-2 leading-relaxed dark:text-white/80 light:text-gray-700">
                                    {categoria.descricao}
                                </p>
                            </div>
                        )}

                        {/* Products Count */}
                        <div className="rounded-2xl p-4 dark:bg-gradient-to-br dark:from-rose-500/10 dark:to-rose-600/5 light:bg-gradient-to-br light:from-rose-100/50 light:to-rose-50/30">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 dark:text-rose-400 light:text-rose-600" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-600">
                                        Quantidade de Produtos
                                    </p>
                                    <p className="mt-1 text-lg sm:text-2xl font-bold dark:text-white light:text-gray-900">
                                        {categoria.produtosCount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Products List */}
                        {produtos.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-600">
                                    Produtos
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {produtos.map((produto) => (
                                        <div
                                            key={produto.id}
                                            className="flex items-center gap-2 rounded-full backdrop-blur px-3 py-2 dark:bg-gradient-to-r dark:from-rose-500/20 dark:to-rose-600/20 light:bg-gradient-to-r light:from-rose-100 light:to-rose-50"
                                        >
                                            <span className="text-sm font-medium dark:text-rose-300 light:text-rose-700">
                                                {produto.nome}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dates */}
                        <div className="space-y-4 dark:border-rose-500/20 light:border-rose-200/50 border-t pt-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 dark:text-rose-400/60 light:text-rose-500/70" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/50 light:text-gray-600">
                                        Data de Criação
                                    </p>
                                    <p className="mt-1 text-sm dark:text-white/70 light:text-gray-700">
                                        {formatDate(categoria.dataCriacao)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 dark:text-rose-400/60 light:text-rose-500/70" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-600">
                                        Última Atualização
                                    </p>
                                    <p className="mt-1 text-sm dark:text-white/80 light:text-gray-700">
                                        {formatDate(categoria.dataAtualizacao)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
