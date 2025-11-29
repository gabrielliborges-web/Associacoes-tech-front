import { ArrowUpCircle, Info } from "lucide-react";
import type { Venda } from "../../mocks/vendasMock";
import { produtosMock } from "../../mocks/vendasMock";

interface VendaCardProps {
    venda: Venda;
    onViewDetails: (venda: Venda) => void;
}

const formaPagamentoLabel: Record<string, string> = {
    dinheiro: "💵 Dinheiro",
    pix: "📱 Pix",
    débito: "🏧 Débito",
    crédito: "💳 Crédito",
    fiado: "📝 Fiado",
};

export default function VendaCard({ venda, onViewDetails }: VendaCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString + "T00:00:00");
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const totalItens = venda.itens.reduce((sum, item) => sum + item.quantidade, 0);
    const produtoNome =
        produtosMock.find((p) => p.id === venda.itens[0]?.produtoId)?.nome ||
        "Produto";

    return (
        <button
            type="button"
            onClick={() => onViewDetails(venda)}
            className="group w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/3 to-transparent p-4 shadow-lg transition-all duration-300 hover:border-primary-600/50 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.01] active:scale-95"
        >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/20 p-2.5 shadow-lg">
                        <ArrowUpCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-white">#{venda.id}</p>
                        <p className="text-xs text-white/50">{formatDate(venda.data)}</p>
                    </div>
                </div>

                <div className="rounded-full bg-primary-600/30 px-2.5 py-1 text-xs font-semibold text-primary-300">
                    {totalItens} item{totalItens !== 1 ? "s" : ""}
                </div>
            </div>

            {/* Product Preview */}
            <div className="mb-4 rounded-lg border border-white/5 bg-white/5 px-3 py-2">
                <p className="truncate text-sm text-white/80">{produtoNome}</p>
                {venda.itens.length > 1 && (
                    <p className="text-xs text-white/50">
                        +{venda.itens.length - 1} produto{venda.itens.length - 1 !== 1 ? "s" : ""}
                    </p>
                )}
            </div>

            {/* Info Row */}
            <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-white/70">
                    {formaPagamentoLabel[venda.formaPagamento]}
                </span>
                <span className="text-xs font-medium text-white/70">
                    {venda.observacao ? (
                        <span title={venda.observacao} className="inline-flex gap-1 items-center cursor-help">
                            <Info className="h-3 w-3" />
                            Obs.
                        </span>
                    ) : (
                        <span className="text-white/40">—</span>
                    )}
                </span>
            </div>

            {/* Total */}
            <div className="flex items-end justify-between border-t border-white/10 pt-3">
                <span className="text-xs font-medium text-white/70">Total</span>
                <span className="text-2xl font-bold text-green-400">
                    R$ {venda.total.toFixed(2)}
                </span>
            </div>
        </button>
    );
}
