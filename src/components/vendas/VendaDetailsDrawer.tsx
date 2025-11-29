import { useEffect, useState } from "react";
import { X, Loader } from "lucide-react";
import { getVendaById } from "../../lib/venda";
import type { Venda } from "../../lib/venda";

interface VendaDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    vendaId: number | null;
}

interface VendaDetail {
    id: number;
    formaPagamento: string;
    data: string;
    total: number;
    descricao?: string | null;
    usuarioNome: string;
    itens: Array<{
        id: number;
        produtoId: number;
        produtoNome: string;
        quantidade: number;
        precoUnit: number;
        total: number;
    }>;
}

function transformVendaAPIToDetail(venda: Venda): VendaDetail {
    return {
        id: venda.id,
        formaPagamento: venda.formaPagamento,
        data: venda.data,
        total: typeof venda.total === "string" ? parseFloat(venda.total) : venda.total,
        descricao: venda.descricao || undefined,
        usuarioNome: venda.usuario?.nome || "Desconhecido",
        itens: (venda.itens || []).map((item) => ({
            id: item.id,
            produtoId: item.produtoId,
            produtoNome: item.produto.nome,
            quantidade: item.quantidade,
            precoUnit: typeof item.precoUnit === "string" ? parseFloat(item.precoUnit) : item.precoUnit,
            total:
                (typeof item.quantidade === "string" ? parseFloat(item.quantidade) : item.quantidade) *
                (typeof item.precoUnit === "string" ? parseFloat(item.precoUnit) : item.precoUnit),
        })),
    };
}

export default function VendaDetailsDrawer({ isOpen, onClose, vendaId }: VendaDetailsDrawerProps) {
    const [venda, setVenda] = useState<VendaDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && vendaId) {
            loadVenda();
        }
    }, [isOpen, vendaId]);

    const loadVenda = async () => {
        if (!vendaId) return;
        setIsLoading(true);
        try {
            const data = await getVendaById(vendaId);
            const transformed = transformVendaAPIToDetail(data as Venda);
            setVenda(transformed);
        } catch (error) {
            console.error("Erro ao carregar venda:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-gradient-to-br from-[#050107] to-[#0a0510] shadow-2xl border-l border-white/10 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-gradient-to-br from-[#050107] to-[#0a0510] p-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Detalhes da Venda</h2>
                        {venda && <p className="text-sm text-white/60">ID: {venda.id}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-all duration-300 hover:bg-white/10"
                    >
                        <X className="h-6 w-6 text-white/60 hover:text-white" />
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader className="h-8 w-8 animate-spin text-green-400" />
                    </div>
                ) : venda ? (
                    <div className="p-6 space-y-6">
                        {/* Informações Gerais */}
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
                                Informações Gerais
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-white/60">Forma de Pagamento</p>
                                    <p className="text-lg font-semibold text-white">{venda.formaPagamento}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-white/60">Data</p>
                                    <p className="text-lg font-semibold text-white">
                                        {new Date(venda.data).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-white/60">Usuário</p>
                                    <p className="text-lg font-semibold text-white">{venda.usuarioNome}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-white/60">Total</p>
                                    <p className="text-lg font-semibold text-green-400">R$ {venda.total.toFixed(2)}</p>
                                </div>
                            </div>

                            {venda.descricao && (
                                <div className="mt-4">
                                    <p className="text-xs text-white/60">Descrição</p>
                                    <p className="text-sm text-white">{venda.descricao}</p>
                                </div>
                            )}
                        </div>

                        {/* Itens */}
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
                                Itens da Venda ({venda.itens.length})
                            </h3>

                            <div className="space-y-3">
                                {venda.itens.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-lg border border-white/10 bg-white/5 p-3"
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <div>
                                                <p className="font-semibold text-white">{item.produtoNome}</p>
                                                <p className="text-xs text-white/60">ID Produto: {item.produtoId}</p>
                                            </div>
                                            <p className="text-right font-bold text-green-400">
                                                R$ {item.total.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="grid gap-2 text-sm sm:grid-cols-3">
                                            <div>
                                                <p className="text-xs text-white/60">Quantidade</p>
                                                <p className="font-semibold text-white">{item.quantidade}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-white/60">Preço Unitário</p>
                                                <p className="font-semibold text-white">R$ {item.precoUnit.toFixed(2)}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-white/60">Subtotal</p>
                                                <p className="font-semibold text-green-400">R$ {item.total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Resumo Total */}
                            <div className="mt-4 rounded-lg border border-green-600/30 bg-gradient-to-br from-green-600/10 to-green-700/5 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-white/60">Total</p>
                                        <p className="text-2xl font-bold text-green-400">R$ {venda.total.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-white/60">Quantidade de Itens</p>
                                        <p className="text-2xl font-bold text-white">{venda.itens.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-16">
                        <p className="text-white/60">Nenhuma informação disponível</p>
                    </div>
                )}
            </div>
        </>
    );
}
