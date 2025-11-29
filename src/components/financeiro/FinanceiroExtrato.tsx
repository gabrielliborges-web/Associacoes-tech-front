import { ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { mockExtrato } from "../../mocks/financeiroMock";

export default function FinanceiroExtrato() {
    const [filtroTipo, setFiltroTipo] = useState<"todos" | "entrada" | "saida">("todos");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroData, setFiltroData] = useState("");

    const movimentacoes = useMemo(() => {
        return mockExtrato.filter((mov) => {
            const matchesTipo = filtroTipo === "todos" || mov.tipo === filtroTipo;
            const matchesCategoria =
                !filtroCategoria ||
                mov.categoria.toLowerCase().includes(filtroCategoria.toLowerCase());
            const matchesData = !filtroData || mov.data.startsWith(filtroData);
            return matchesTipo && matchesCategoria && matchesData;
        });
    }, [filtroTipo, filtroCategoria, filtroData]);

    const saldoTotal = movimentacoes.reduce((acc, mov) => {
        return acc + (mov.tipo === "entrada" ? mov.valor : -mov.valor);
    }, 0);

    const categorias = Array.from(new Set(mockExtrato.map((m) => m.categoria)));

    return (
        <div className="space-y-6">
            {/* Saldo Geral */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary-500/20 to-primary-500/5 p-6 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-wider text-white/60">
                    Saldo Período
                </p>
                <p className={`mt-2 text-4xl font-bold ${saldoTotal >= 0 ? "text-green-400" : "text-red-400"}`}>
                    R$ {Math.abs(saldoTotal).toFixed(2)}
                </p>
            </div>

            {/* Filtros */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-6">
                <div className="mb-4 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-white/60" />
                    <h3 className="font-semibold text-white">Filtros</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {/* Tipo */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white/80">Tipo</label>
                        <select
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value as any)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                        >
                            <option value="todos">Todos</option>
                            <option value="entrada">Entradas</option>
                            <option value="saida">Saídas</option>
                        </select>
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white/80">
                            Categoria
                        </label>
                        <select
                            value={filtroCategoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                        >
                            <option value="">Todas as categorias</option>
                            {categorias.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Data */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white/80">Data</label>
                        <input
                            type="date"
                            value={filtroData}
                            onChange={(e) => setFiltroData(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                        />
                    </div>
                </div>
            </div>

            {/* Extrato */}
            <div className="space-y-3">
                {movimentacoes.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
                        <p className="text-white/60">Nenhuma movimentação encontrada</p>
                    </div>
                ) : (
                    movimentacoes.map((mov) => (
                        <div
                            key={mov.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10"
                        >
                            <div className="flex items-center gap-4">
                                {/* Ícone e Categoria */}
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${mov.tipo === "entrada"
                                            ? "bg-green-500/20"
                                            : "bg-red-500/20"
                                        }`}
                                >
                                    {mov.tipo === "entrada" ? (
                                        <ArrowUpRight className="h-6 w-6 text-green-400" />
                                    ) : (
                                        <ArrowDownLeft className="h-6 w-6 text-red-400" />
                                    )}
                                </div>

                                {/* Info */}
                                <div>
                                    <p className="font-semibold text-white">{mov.descricao}</p>
                                    <div className="mt-1 flex items-center gap-3 text-xs text-white/60">
                                        <span className="rounded-full bg-white/10 px-2 py-1">
                                            {mov.categoria}
                                        </span>
                                        <span>{new Date(mov.data).toLocaleDateString("pt-BR")}</span>
                                        <span>{mov.usuarioNome}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Valor */}
                            <p
                                className={`text-right text-lg font-bold ${mov.tipo === "entrada"
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }`}
                            >
                                {mov.tipo === "entrada" ? "+" : "-"} R$ {mov.valor.toFixed(2)}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
