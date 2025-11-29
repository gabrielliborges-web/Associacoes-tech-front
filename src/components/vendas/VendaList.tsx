import { ChevronRight, X } from "lucide-react";
import type { Venda } from "../../mocks/vendasMock";
import { produtosMock } from "../../mocks/vendasMock";

interface VendaListProps {
    vendas: Venda[];
    onSelectVenda: (venda: Venda) => void;
    selectedId?: number;
    isDrawerOpen?: boolean;
    onCloseDrawer?: () => void;
}

const formaPagamentoLabel: Record<string, string> = {
    dinheiro: "💵 Dinheiro",
    pix: "📱 Pix",
    débito: "🏧 Débito",
    crédito: "💳 Crédito",
    fiado: "📝 Fiado",
};

export default function VendaList({
    vendas,
    onSelectVenda,
    selectedId,
    isDrawerOpen,
    onCloseDrawer,
}: VendaListProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString + "T00:00:00");
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const selectedVenda = vendas.find((v) => v.id === selectedId);

    return (
        <>
            {/* Mobile: Grid de cards */}
            <div className="grid gap-3 md:hidden">
                {vendas.map((venda) => {
                    const totalItens = venda.itens.reduce(
                        (sum, item) => sum + item.quantidade,
                        0
                    );

                    return (
                        <button
                            key={venda.id}
                            type="button"
                            onClick={() => onSelectVenda(venda)}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:bg-white/10 hover:border-primary-600/50 active:scale-95"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-white">#{venda.id}</span>
                                <span className="text-xs font-medium text-primary-400">
                                    {totalItens} item{totalItens !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <p className="text-xs text-white/60 mb-2">
                                {formatDate(venda.data)} · {formaPagamentoLabel[venda.formaPagamento]}
                            </p>

                            <div className="flex items-end justify-between">
                                <span className="text-sm text-white/70">Total:</span>
                                <span className="text-lg font-bold text-green-400">
                                    R$ {venda.total.toFixed(2)}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-white/10 bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                    Data
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                    Forma de Pagamento
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                    Itens
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-white/70">
                                    Total
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-white/70">
                                    Ação
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendas.map((venda, idx) => {
                                const totalItens = venda.itens.reduce(
                                    (sum, item) => sum + item.quantidade,
                                    0
                                );

                                return (
                                    <tr
                                        key={venda.id}
                                        className={`border-t border-white/5 transition-colors hover:bg-white/10 ${idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                                            }`}
                                    >
                                        <td className="px-6 py-4 text-sm font-semibold text-white">
                                            #{venda.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/80">
                                            {formatDate(venda.data)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/80">
                                            {formaPagamentoLabel[venda.formaPagamento]}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-primary-600/30 px-3 py-1 text-xs font-semibold text-primary-300">
                                                {totalItens} item{totalItens !== 1 ? "s" : ""}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-semibold text-green-400">
                                                R$ {venda.total.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => onSelectVenda(venda)}
                                                className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white hover:border-primary-600/50 active:scale-95"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drawer Details */}
            {isDrawerOpen && selectedVenda && (
                <div className="fixed inset-0 z-40 flex items-start justify-end bg-black/60 backdrop-blur-sm lg:hidden">
                    <div
                        className="h-full w-full max-w-sm overflow-hidden rounded-l-3xl border-l border-white/10 bg-gradient-to-b from-[#13081a]/95 to-[#0f061a]/95 shadow-2xl animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-r from-[#13081a]/95 to-[#1a0f2b]/95 px-6 py-4 backdrop-blur-xl flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Detalhes da Venda</h2>
                            <button
                                type="button"
                                onClick={onCloseDrawer}
                                className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="max-h-[calc(100vh-80px)] overflow-y-auto p-6 space-y-6">
                            {/* Informações Gerais */}
                            <div>
                                <h3 className="mb-3 text-sm font-semibold text-white/70">
                                    Informações Gerais
                                </h3>
                                <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white/70">ID:</span>
                                        <span className="font-semibold text-white">
                                            #{selectedVenda.id}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white/70">Data:</span>
                                        <span className="font-semibold text-white">
                                            {formatDate(selectedVenda.data)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white/70">Pagamento:</span>
                                        <span className="font-semibold text-white">
                                            {formaPagamentoLabel[selectedVenda.formaPagamento]}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Itens */}
                            <div>
                                <h3 className="mb-3 text-sm font-semibold text-white/70">
                                    Itens ({selectedVenda.itens.length})
                                </h3>
                                <div className="space-y-2">
                                    {selectedVenda.itens.map((item, idx) => {
                                        const produto = produtosMock.find(
                                            (p) => p.id === item.produtoId
                                        );
                                        return (
                                            <div
                                                key={idx}
                                                className="rounded-lg border border-white/10 bg-white/5 p-3"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-white">
                                                        {produto?.nome}
                                                    </span>
                                                    <span className="text-xs font-semibold text-primary-400">
                                                        {item.quantidade}x
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-white/60">
                                                        R$ {item.precoUnit.toFixed(2)} un
                                                    </span>
                                                    <span className="text-sm font-bold text-green-400">
                                                        R$ {item.subtotal.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Observação */}
                            {selectedVenda.observacao && (
                                <div>
                                    <h3 className="mb-3 text-sm font-semibold text-white/70">
                                        Observação
                                    </h3>
                                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                                        <p className="text-sm text-white/80">
                                            {selectedVenda.observacao}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="rounded-lg border border-primary-600/30 bg-gradient-to-br from-primary-600/10 to-primary-700/5 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-white">Total:</span>
                                    <span className="text-2xl font-bold text-green-400">
                                        R$ {selectedVenda.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
