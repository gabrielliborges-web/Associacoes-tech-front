import { X } from "lucide-react";
import { useState, useMemo } from "react";
import type { ItemVenda } from "../../mocks/vendasMock";
import ProdutoSelector from "./ProdutoSelector";
import VendaResumo from "./VendaResumo";

interface VendaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegistrar: (venda: {
        formaPagamento: string;
        itens: ItemVenda[];
        descricao: string;
    }) => void;
    isLoading?: boolean;
}

export default function VendaModal({
    isOpen,
    onClose,
    onRegistrar,
    isLoading = false,
}: VendaModalProps) {
    const [formaPagamento, setFormaPagamento] = useState<
        "dinheiro" | "pix" | "débito" | "crédito" | "fiado"
    >("pix");
    const [itens, setItens] = useState<ItemVenda[]>([]);
    const [observacao, setObservacao] = useState("");

    const total = useMemo(() => {
        return itens.reduce((sum, item) => sum + item.subtotal, 0);
    }, [itens]);

    const handleRegistrar = () => {
        if (itens.length === 0) {
            alert("Adicione pelo menos um produto!");
            return;
        }

        onRegistrar({
            formaPagamento,
            itens,
            observacao,
        });

        // Reset form
        setItens([]);
        setObservacao("");
        setFormaPagamento("pix");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                className="max-h-[95vh] w-[95%] max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#13081a]/95 to-[#0f061a]/95 shadow-2xl animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-r from-[#13081a]/95 to-[#1a0f2b]/95 px-6 py-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Nova Venda</h2>
                            <p className="text-sm text-white/60">Registre uma nova venda</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[calc(95vh-140px)] overflow-y-auto">
                    <div className="space-y-6 p-6">
                        {/* Forma de Pagamento */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">
                                Forma de Pagamento
                            </label>
                            <select
                                value={formaPagamento}
                                onChange={(e) =>
                                    setFormaPagamento(
                                        e.target.value as
                                        | "dinheiro"
                                        | "pix"
                                        | "débito"
                                        | "crédito"
                                        | "fiado"
                                    )
                                }
                                disabled={isLoading}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none disabled:opacity-50"
                            >
                                <option value="dinheiro">💵 Dinheiro</option>
                                <option value="pix">📱 Pix</option>
                                <option value="débito">🏧 Débito</option>
                                <option value="crédito">💳 Crédito</option>
                                <option value="fiado">📝 Fiado</option>
                            </select>
                        </div>

                        {/* Produto Selector */}
                        <div>
                            <ProdutoSelector itens={itens} onItensChange={setItens} />
                        </div>

                        {/* Observação */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">
                                Observação (opcional)
                            </label>
                            <textarea
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                disabled={isLoading}
                                placeholder="Adicione uma nota sobre a venda..."
                                className="min-h-20 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/50 transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Resumo */}
                        <VendaResumo itens={itens} total={total} />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 border-t border-white/10 bg-gradient-to-r from-[#13081a]/95 to-[#1a0f2b]/95 px-6 py-4 backdrop-blur-xl">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleRegistrar}
                            disabled={isLoading || itens.length === 0}
                            className="flex-1 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 active:scale-95"
                        >
                            {isLoading ? "Registrando..." : "Registrar Venda"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
