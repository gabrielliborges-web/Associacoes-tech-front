import { X, Calendar, FileText, User, DollarSign, Package } from "lucide-react";
import type { CompraMock } from "../../mocks/comprasMock";

interface CompraDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    compra: CompraMock | null;
}

function formatarData(data: string): string {
    return new Date(data).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatarMoeda(valor: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

export default function CompraDetailsDrawer({
    isOpen,
    onClose,
    compra,
}: CompraDetailsDrawerProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-md overflow-y-auto border-l border-white/10 bg-gradient-to-br from-[#050107] to-[#0a0510] p-6 shadow-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Detalhes da Compra</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-all duration-300 hover:bg-white/10"
                    >
                        <X className="h-6 w-6 text-white/60 hover:text-white" />
                    </button>
                </div>

                {compra && (
                    <div className="space-y-6">
                        {/* Informações Gerais */}
                        <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                                Informações Gerais
                            </h3>

                            <div className="space-y-3">
                                {/* Fornecedor */}
                                {compra.fornecedor && (
                                    <div className="flex items-start gap-3">
                                        <DollarSign className="mt-1 h-5 w-5 text-primary-400/60" />
                                        <div>
                                            <p className="text-xs text-white/60">Fornecedor</p>
                                            <p className="text-sm font-semibold text-white">
                                                {compra.fornecedor}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Data */}
                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-1 h-5 w-5 text-primary-400/60" />
                                    <div>
                                        <p className="text-xs text-white/60">Data</p>
                                        <p className="text-sm font-semibold text-white">
                                            {formatarData(compra.data)}
                                        </p>
                                    </div>
                                </div>

                                {/* Usuário */}
                                <div className="flex items-start gap-3">
                                    <User className="mt-1 h-5 w-5 text-primary-400/60" />
                                    <div>
                                        <p className="text-xs text-white/60">Usuário</p>
                                        <p className="text-sm font-semibold text-white">
                                            {compra.usuarioNome}
                                        </p>
                                    </div>
                                </div>

                                {/* Descrição */}
                                {compra.descricao && (
                                    <div className="flex items-start gap-3">
                                        <FileText className="mt-1 h-5 w-5 text-primary-400/60" />
                                        <div>
                                            <p className="text-xs text-white/60">Descrição</p>
                                            <p className="text-sm font-semibold text-white">
                                                {compra.descricao}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary-400/60" />
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                                    Itens ({compra.itens.length})
                                </h3>
                            </div>

                            <div className="space-y-2">
                                {compra.itens.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between rounded-lg bg-white/5 p-3 text-sm"
                                    >
                                        <div>
                                            <p className="font-semibold text-white">
                                                {item.produtoNome}
                                            </p>
                                            <p className="text-xs text-white/60">
                                                Qtd: {item.quantidade} × {formatarMoeda(item.custoUnit)}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-primary-400">
                                            {formatarMoeda(item.total)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Divisor */}
                            <div className="border-t border-white/10" />

                            {/* Total */}
                            <div className="flex justify-between pt-2">
                                <p className="text-sm font-semibold text-white/80">Total:</p>
                                <p className="text-lg font-bold text-primary-400">
                                    {formatarMoeda(compra.total)}
                                </p>
                            </div>
                        </div>

                        {/* Ação */}
                        <button
                            onClick={onClose}
                            className="w-full rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50"
                        >
                            Fechar
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
