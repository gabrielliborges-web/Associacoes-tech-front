import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { MovimentacaoExtrato } from "../../mocks/financeiroMock";

interface ExtratoTableProps {
    movimentacoes: MovimentacaoExtrato[];
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

export default function ExtratoTable({
    movimentacoes,
    currentPage,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}: ExtratoTableProps) {
    const totalPages = Math.ceil(movimentacoes.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedItems = movimentacoes.slice(
        startIdx,
        startIdx + itemsPerPage
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    let saldoAcumulado = 0;
    const movimentacoesComSaldo = paginatedItems.map((mov) => {
        saldoAcumulado +=
            mov.tipo === "entrada" ? mov.valor : -mov.valor;
        return { ...mov, saldoApos: saldoAcumulado };
    });

    return (
        <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-white/10 bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                    Data
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                    Tipo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                    Descrição
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-white/70">
                                    Entrada/Saída
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-white/70">
                                    Saldo após
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                    Usuário
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimentacoesComSaldo.map((mov, idx) => (
                                <tr
                                    key={mov.id}
                                    className={`border-t border-white/5 transition-colors hover:bg-white/10 ${idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                                        }`}
                                >
                                    <td className="px-6 py-4 text-sm text-white/80">
                                        <div>
                                            <p className="font-medium text-white">
                                                {formatDate(mov.data)}
                                            </p>
                                            <p className="text-xs text-white/50">
                                                {formatTime(mov.data)}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                            {mov.tipo === "entrada" ? (
                                                <>
                                                    <ArrowUpRight className="h-4 w-4 text-green-400" />
                                                    Entrada
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowDownLeft className="h-4 w-4 text-red-400" />
                                                    Saída
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-white">
                                                {mov.descricao}
                                            </p>
                                            <p className="text-xs text-white/50">{mov.categoria}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span
                                            className={`font-semibold ${mov.tipo === "entrada"
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                                }`}
                                        >
                                            {mov.tipo === "entrada" ? "+" : "-"}R${" "}
                                            {mov.valor.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span
                                            className={`font-semibold ${mov.saldoApos >= 0
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                                }`}
                                        >
                                            R$ {mov.saldoApos.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white/70">
                                        {mov.usuarioNome}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {movimentacoesComSaldo.map((mov) => (
                    <div
                        key={mov.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <p className="font-semibold text-white">
                                    {formatDate(mov.data)}
                                </p>
                                <p className="text-xs text-white/50">{formatTime(mov.data)}</p>
                            </div>
                            <div className="text-right">
                                <p
                                    className={`font-bold text-lg ${mov.tipo === "entrada"
                                            ? "text-green-400"
                                            : "text-red-400"
                                        }`}
                                >
                                    {mov.tipo === "entrada" ? "+" : "-"}R${" "}
                                    {mov.valor.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="mb-2 flex items-center gap-2">
                            {mov.tipo === "entrada" ? (
                                <ArrowUpRight className="h-4 w-4 text-green-400" />
                            ) : (
                                <ArrowDownLeft className="h-4 w-4 text-red-400" />
                            )}
                            <span className="text-sm font-medium text-white">
                                {mov.descricao}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-2">
                            <div>
                                <p className="text-xs text-white/50">Categoria</p>
                                <p className="text-sm text-white">{mov.categoria}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/50">Saldo após</p>
                                <p
                                    className={`text-sm font-semibold ${mov.saldoApos >= 0 ? "text-green-400" : "text-red-400"
                                        }`}
                                >
                                    R$ {mov.saldoApos.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-white/70">Itens por página:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none"
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <div className="flex items-center justify-between sm:justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="text-sm text-white/70">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            onPageChange(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="text-sm text-white/70">
                    Total: {movimentacoes.length} movimentações
                </div>
            </div>
        </div>
    );
}
