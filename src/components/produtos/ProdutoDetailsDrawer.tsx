import { X, Calendar, DollarSign, Package, TrendingUp } from "lucide-react";
import type { Produto } from "../../mocks/produtosMock";

interface ProdutoDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    produto: Produto | null;
}

export default function ProdutoDetailsDrawer({
    isOpen,
    onClose,
    produto,
}: ProdutoDetailsDrawerProps) {
    if (!produto) return null;

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

    const margemLucro = produto.precoCompra
        ? (((produto.precoVenda - produto.precoCompra) / produto.precoVenda) * 100).toFixed(1)
        : "-";

    const temPromocao = produto.precoPromocional && produto.precoPromocional < produto.precoVenda;
    const descontoPromocional = temPromocao
        ? (((produto.precoVenda - produto.precoPromocional!) / produto.precoVenda) * 100).toFixed(1)
        : "0";

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
                    <h2 className="text-lg sm:text-xl font-bold dark:text-white light:text-gray-900">Detalhes do Produto</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-all duration-300 dark:hover:bg-white/10 light:hover:bg-rose-100/50"
                    >
                        <X className="h-5 w-5 dark:text-white/60 light:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar dark:scrollbar-track-transparent dark:scrollbar-thumb-white/20 light:scrollbar-track-gray-100 light:scrollbar-thumb-gray-400">
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br dark:from-rose-500/10 dark:to-rose-600/5 light:from-rose-100/40 light:to-rose-50/20">
                        <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x400?text=Sem+Imagem";
                            }}
                        />
                    </div>

                    {/* Details */}
                    <div className="space-y-6 p-4 sm:p-6">
                        {/* Title */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-600">
                                Nome do Produto
                            </p>
                            <p className="mt-2 text-xl sm:text-2xl font-bold dark:text-white light:text-gray-900">
                                {produto.nome}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${produto.ativo
                                    ? "dark:bg-rose-500/20 dark:text-rose-400 light:bg-rose-100 light:text-rose-700"
                                    : "dark:bg-gray-500/20 dark:text-gray-400 light:bg-gray-100 light:text-gray-600"
                                    }`}
                            >
                                {produto.ativo ? "Ativo" : "Inativo"}
                            </span>
                        </div>

                        {/* Description */}
                        {produto.descricao && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-600">
                                    Descrição
                                </p>
                                <p className="mt-2 leading-relaxed dark:text-white/80 light:text-gray-700">
                                    {produto.descricao}
                                </p>
                            </div>
                        )}

                        {/* Category */}
                        {produto.categoria && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-600">
                                    Categoria
                                </p>
                                <p className="mt-2 text-sm dark:text-white/80 light:text-gray-700">
                                    {produto.categoria.nome}
                                </p>
                            </div>
                        )}

                        {/* Preços */}
                        <div className="space-y-3 rounded-2xl p-4 dark:bg-gradient-to-br dark:from-rose-500/10 dark:to-rose-600/5 light:bg-gradient-to-br light:from-rose-100/50 light:to-rose-50/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 dark:text-rose-400 light:text-rose-600" />
                                    <span className="text-xs font-semibold dark:text-white/60 light:text-gray-600">Preço de Venda</span>
                                </div>
                                <p className="text-sm font-bold dark:text-rose-400 light:text-rose-600">
                                    R$ {produto?.precoVenda?.toFixed(2)}
                                </p>
                            </div>

                            {produto.precoCompra && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold dark:text-white/60 light:text-gray-600">Preço de Compra</span>
                                    <p className="text-sm dark:text-white/80 light:text-gray-700">
                                        R$ {produto.precoCompra.toFixed(2)}
                                    </p>
                                </div>
                            )}

                            {produto.precoPromocional && (
                                <div className="flex items-center justify-between pt-2 border-t dark:border-rose-500/20 light:border-rose-200/50">
                                    <span className="text-xs font-semibold dark:text-white/60 light:text-gray-600">
                                        Preço Promocional
                                    </span>
                                    <div className="text-right">
                                        <p className="text-sm font-bold dark:text-green-400 light:text-green-600">
                                            R$ {produto.precoPromocional.toFixed(2)}
                                        </p>
                                        <p className="text-xs dark:text-green-400/60 light:text-green-600/60">
                                            -{descontoPromocional}%
                                        </p>
                                    </div>
                                </div>
                            )}

                            {margemLucro !== "-" && (
                                <div className="flex items-center justify-between pt-2 border-t dark:border-rose-500/20 light:border-rose-200/50">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 dark:text-yellow-400 light:text-yellow-600" />
                                        <span className="text-xs font-semibold dark:text-white/60 light:text-gray-600">Margem de Lucro</span>
                                    </div>
                                    <p className="text-sm font-bold dark:text-yellow-400 light:text-yellow-600">
                                        {margemLucro}%
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="rounded-2xl p-4 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 light:bg-gradient-to-br light:from-gray-100 light:to-gray-50">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 dark:text-rose-400 light:text-rose-600" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-600">
                                        Estoque
                                    </p>
                                    <p className="mt-1 text-lg sm:text-2xl font-bold dark:text-white light:text-gray-900">
                                        {produto.estoque}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-4 border-t dark:border-rose-500/20 light:border-rose-200/50 pt-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 dark:text-rose-400/60 light:text-rose-500/70" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/50 light:text-gray-600">
                                        Criado em
                                    </p>
                                    <p className="mt-1 text-sm dark:text-white/70 light:text-gray-700">
                                        {formatDate(produto.criadoEm)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 dark:text-rose-400/60 light:text-rose-500/70" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/50 light:text-gray-600">
                                        Atualizado em
                                    </p>
                                    <p className="mt-1 text-sm dark:text-white/70 light:text-gray-700">
                                        {formatDate(produto.atualizadoEm)}
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
