import { Edit, Trash2, Info, Tag } from "lucide-react";
import type { Produto } from "../../mocks/produtosMock";

interface ProdutoCardProps {
    produto: Produto;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onDetails: (id: number) => void;
}

function getEstoqueColor(estoque: number) {
    if (estoque > 10) return "dark:bg-green-500/20 dark:text-green-400 light:bg-green-100 light:text-green-700";
    if (estoque >= 5) return "dark:bg-yellow-500/20 dark:text-yellow-400 light:bg-yellow-100 light:text-yellow-700";
    return "dark:bg-red-500/20 dark:text-red-400 light:bg-red-100 light:text-red-700";
}

export default function ProdutoCard({
    produto,
    onEdit,
    onDelete,
    onDetails,
}: ProdutoCardProps) {
    const preco = Number(produto.precoPromocional || produto.precoVenda);
    const temPromocao = produto.precoPromocional && produto.precoPromocional < produto.precoVenda;

    console.log({
        preco,
        temPromocao,
        produto
    })

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 dark:border-rose-500/20 dark:bg-gradient-to-br dark:from-white/5 dark:to-white/2 dark:hover:border-rose-500/40 dark:hover:shadow-lg dark:hover:shadow-rose-500/10 light:border-rose-200/50 light:bg-gradient-to-br light:from-rose-50/30 light:to-white light:hover:border-rose-300/50 light:hover:shadow-lg light:hover:shadow-rose-200/30">
            {/* Image */}
            <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br dark:from-rose-500/10 dark:to-rose-600/5 light:from-rose-100/40 light:to-rose-50/20">
                <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x400?text=Sem+Imagem";
                    }}
                />

                {/* Badge - Status Ativo */}
                {produto.ativo && (
                    <div className="absolute right-2 top-2">
                        <span className="inline-flex rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-400 dark:text-rose-300">
                            Ativo
                        </span>
                    </div>
                )}

                {/* Badge - Promoção */}
                {temPromocao && (
                    <div className="absolute left-2 top-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                            <Tag className="h-3 w-3" />
                            Promoção
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    <h3 className="truncate text-sm font-semibold dark:text-white light:text-gray-900">
                        {produto.nome}
                    </h3>
                    <p className="line-clamp-1 text-xs dark:text-white/50 light:text-gray-500">
                        {produto.categoria?.nome || "Sem categoria"}
                    </p>
                </div>

                {/* Prices */}
                <div className="space-y-1">
                    {temPromocao && (
                        <p className="text-xs line-through dark:text-white/40 light:text-gray-400">
                            R$ {Number(produto?.precoVenda)?.toFixed(2)}
                        </p>
                    )}
                    <p className="text-lg font-bold dark:text-rose-400 light:text-rose-600">
                        R$ {preco.toFixed(2)}
                    </p>
                </div>

                {/* Stock Badge */}
                <div className="flex items-center justify-between rounded-lg px-3 py-2 dark:bg-white/5 light:bg-gray-100">
                    <span className="text-xs font-semibold dark:text-white/60 light:text-gray-600">Estoque:</span>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstoqueColor(produto.estoque)}`}>
                        {produto.estoque}
                    </span>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                    <button
                        onClick={() => onDetails(produto.id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 dark:bg-white/10 dark:text-white dark:hover:bg-rose-500/20 dark:hover:text-rose-300 light:bg-rose-100/50 light:text-gray-700 light:hover:bg-rose-200"
                        title="Detalhes"
                    >
                        <Info className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Detalhes</span>
                    </button>
                    <button
                        onClick={() => onEdit(produto.id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 dark:bg-white/10 dark:text-white dark:hover:bg-rose-500/20 light:bg-gray-100 light:text-gray-700 light:hover:bg-rose-100"
                        title="Editar"
                    >
                        <Edit className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                        onClick={() => onDelete(produto.id)}
                        className="flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 light:bg-rose-100 light:text-rose-700 light:hover:bg-rose-200"
                        title="Excluir"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
