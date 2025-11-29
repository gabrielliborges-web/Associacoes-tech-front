import { Edit, Trash2, Info, Tag } from "lucide-react";
import type { Produto } from "../../mocks/produtosMock";

interface ProdutoListProps {
    produtos: Produto[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onDetails: (id: number) => void;
}

function getEstoqueColor(estoque: number) {
    if (estoque > 10) return "dark:bg-green-500/20 dark:text-green-400 light:bg-green-100 light:text-green-700";
    if (estoque >= 5) return "dark:bg-yellow-500/20 dark:text-yellow-400 light:bg-yellow-100 light:text-yellow-700";
    return "dark:bg-red-500/20 dark:text-red-400 light:bg-red-100 light:text-red-700";
}

export default function ProdutoList({
    produtos,
    onEdit,
    onDelete,
    onDetails,
}: ProdutoListProps) {
    return (
        <div className="hidden md:block overflow-x-auto rounded-2xl border backdrop-blur-sm dark:border-rose-500/20 dark:bg-gradient-to-br dark:from-white/5 dark:to-white/2 light:border-rose-200/50 light:bg-white">
            <table className="w-full">
                <thead>
                    <tr className="border-b dark:border-rose-500/20 light:border-rose-200/50">
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Produto
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Categoria
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Preço
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Estoque
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider dark:text-white/60 light:text-gray-700">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-rose-500/10 light:divide-rose-200/30">
                    {produtos.map((produto) => {
                        const preco = Number(produto.precoPromocional || produto.precoVenda);
                        const temPromocao = produto.precoPromocional && produto.precoPromocional < produto.precoVenda;

                        return (
                            <tr
                                key={produto.id}
                                className="group transition-all duration-300 dark:hover:bg-white/5 light:hover:bg-gray-50"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={produto.imagem}
                                            alt={produto.nome}
                                            className="h-10 w-10 rounded-lg object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=Sem";
                                            }}
                                        />
                                        <div>
                                            <p className="text-sm font-semibold dark:text-white light:text-gray-900">
                                                {produto.nome}
                                            </p>
                                            <p className="text-xs dark:text-white/50 light:text-gray-500">
                                                ID: {produto.id}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm dark:text-white/80 light:text-gray-700">
                                    {produto.categoria?.nome || "-"}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        {temPromocao && (
                                            <p className="text-xs line-through dark:text-white/40 light:text-gray-400">
                                                R$ {(Number(produto?.precoVenda))?.toFixed(2)}
                                            </p>
                                        )}
                                        <p className="text-sm font-bold dark:text-rose-400 light:text-rose-600">
                                            R$ {preco.toFixed(2)}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getEstoqueColor(produto.estoque)}`}>
                                        {produto.estoque}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${produto.ativo
                                            ? "dark:bg-rose-500/20 dark:text-rose-400 light:bg-rose-100 light:text-rose-700"
                                            : "dark:bg-gray-500/20 dark:text-gray-400 light:bg-gray-100 light:text-gray-600"
                                            }`}>
                                            {produto.ativo ? "Ativo" : "Inativo"}
                                        </span>
                                        {temPromocao && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-400">
                                                <Tag className="h-3 w-3" />
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onDetails(produto.id)}
                                            className="rounded-lg p-2 transition-all duration-300 dark:hover:bg-rose-500/20 light:hover:bg-rose-100"
                                            title="Detalhes"
                                        >
                                            <Info className="h-4 w-4 dark:text-rose-400 light:text-rose-600" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(produto.id)}
                                            className="rounded-lg p-2 transition-all duration-300 dark:hover:bg-white/10 light:hover:bg-gray-100"
                                            title="Editar"
                                        >
                                            <Edit className="h-4 w-4 dark:text-white/70 light:text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(produto.id)}
                                            className="rounded-lg p-2 transition-all duration-300 dark:hover:bg-red-500/20 light:hover:bg-red-100"
                                            title="Excluir"
                                        >
                                            <Trash2 className="h-4 w-4 dark:text-red-400 light:text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
