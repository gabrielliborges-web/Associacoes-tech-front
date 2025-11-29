import { TrendingUp } from "lucide-react";
import type { ItemVenda } from "../../mocks/vendasMock";
import { produtosMock } from "../../mocks/vendasMock";

interface VendaResumoProps {
    itens: ItemVenda[];
    total: number;
}

export default function VendaResumo({ itens, total }: VendaResumoProps) {
    const getProdutoNome = (produtoId: number) => {
        return produtosMock.find((p) => p.id === produtoId)?.nome || "Produto";
    };

    return (
        <div className="rounded-2xl border border-primary-600/20 bg-gradient-to-br from-primary-600/10 to-primary-700/5 p-6 backdrop-blur-sm">
            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-green-500/20 p-2.5">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-white/70">Resumo da Venda</p>
                    <p className="text-xs text-white/50">Entrada de receita</p>
                </div>
            </div>

            {/* Items List */}
            <div className="mb-6 space-y-2 border-t border-white/10 pt-4">
                {itens.length === 0 ? (
                    <p className="text-sm text-white/50 italic">Nenhum item adicionado</p>
                ) : (
                    itens.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 transition-colors hover:bg-white/10"
                        >
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">
                                    {getProdutoNome(item.produtoId)}
                                </p>
                                <p className="text-xs text-white/50">
                                    {item.quantidade}x → R$ {item.precoUnit.toFixed(2)}
                                </p>
                            </div>
                            <span className="text-sm font-semibold text-green-400">
                                +R$ {item.subtotal.toFixed(2)}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Total Items & Total */}
            <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Total de itens:</span>
                    <span className="font-semibold text-white">
                        {itens.reduce((sum, item) => sum + item.quantidade, 0)}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-3">
                    <span className="font-medium text-white">Total da venda:</span>
                    <span className="text-2xl font-bold text-green-400">
                        R$ {total.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Badge */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs font-semibold text-green-400">
                    Entrada de Receita
                </span>
            </div>
        </div>
    );
}
