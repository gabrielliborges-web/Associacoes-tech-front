import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from "lucide-react";
import type { Entrada, Despesa, ResumoFinanceiro } from "../../mocks/financeiroMock";

interface FinanceiroResumoProps {
    entradas: Entrada[];
    despesas: Despesa[];
    resumo: ResumoFinanceiro;
    graficos: {
        receitasVsDespesas: any[];
        receitasPorTipo: any[];
        despesasPorTipo: any[];
    };
}

export default function FinanceiroResumo({
    resumo,
    graficos,
}: FinanceiroResumoProps) {
    const { saldoAtual, receitasMes, despesasMes, lucro } = resumo;

    const alertas = [
        despesasMes > receitasMes && {
            tipo: "alert",
            mensagem: "Despesas excedem receitas este mês",
            cor: "text-red-400",
            bgCor: "bg-red-500/10",
            borderCor: "border-red-500/20",
        },
        saldoAtual < 0 && {
            tipo: "danger",
            mensagem: "Saldo negativo! Ação necessária",
            cor: "text-red-500",
            bgCor: "bg-red-500/20",
            borderCor: "border-red-500/40",
        },
        lucro < 0 && {
            tipo: "negative",
            mensagem: "Lucratividade negativa no período",
            cor: "text-orange-400",
            bgCor: "bg-orange-500/10",
            borderCor: "border-orange-500/20",
        },
    ].filter(Boolean);

    return (
        <div className="space-y-6">
            {/* Cards Principais */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Saldo Atual */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold uppercase tracking-wider text-white/60">
                            Saldo Atual
                        </p>
                        <Wallet className="h-5 w-5 text-primary-400" />
                    </div>
                    <p className={`text-3xl font-bold ${saldoAtual >= 0 ? "text-green-400" : "text-red-400"}`}>
                        R$ {Math.abs(saldoAtual).toFixed(2)}
                    </p>
                    <p className="mt-2 text-xs text-white/50">
                        {saldoAtual >= 0 ? "✓ Positivo" : "✗ Negativo"}
                    </p>
                </div>

                {/* Receitas do Mês */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/20 to-green-500/5 p-6 backdrop-blur-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold uppercase tracking-wider text-white/60">
                            Receitas
                        </p>
                        <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-400">R$ {receitasMes.toFixed(2)}</p>
                    <p className="mt-2 text-xs text-white/50">Este mês</p>
                </div>

                {/* Despesas do Mês */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/20 to-red-500/5 p-6 backdrop-blur-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold uppercase tracking-wider text-white/60">
                            Despesas
                        </p>
                        <TrendingDown className="h-5 w-5 text-red-400" />
                    </div>
                    <p className="text-3xl font-bold text-red-400">R$ {despesasMes.toFixed(2)}</p>
                    <p className="mt-2 text-xs text-white/50">Este mês</p>
                </div>

                {/* Lucro */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary-500/20 to-primary-500/5 p-6 backdrop-blur-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold uppercase tracking-wider text-white/60">
                            Lucro
                        </p>
                        <Wallet className="h-5 w-5 text-primary-400" />
                    </div>
                    <p className={`text-3xl font-bold ${lucro >= 0 ? "text-primary-400" : "text-orange-400"}`}>
                        R$ {Math.abs(lucro).toFixed(2)}
                    </p>
                    <p className="mt-2 text-xs text-white/50">
                        {lucro >= 0 ? "Positivo" : "Negativo"}
                    </p>
                </div>
            </div>

            {/* Alertas */}
            {alertas.length > 0 && (
                <div className="space-y-2">
                    {alertas.filter(Boolean).map((alerta: any, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center gap-3 rounded-xl border ${alerta.borderCor} ${alerta.bgCor} p-4 backdrop-blur-sm`}
                        >
                            <AlertCircle className={`h-5 w-5 flex-shrink-0 ${alerta.cor}`} />
                            <p className={`text-sm font-semibold ${alerta.cor}`}>{alerta.mensagem}</p>
                        </div>
                    ))}
                </div>
            )}            {/* Gráficos */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Receitas x Despesas */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-semibold text-white">Receitas vs Despesas</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={graficos.receitasVsDespesas}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(5, 1, 7, 0.95)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "0.75rem",
                                    color: "#fff",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
                            <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Receitas por Tipo */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-semibold text-white">Receitas por Tipo</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={graficos.receitasPorTipo}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => `${entry.name}: R$ ${entry.value.toFixed(0)}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {graficos.receitasPorTipo.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(5, 1, 7, 0.95)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "0.75rem",
                                    color: "#fff",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Despesas por Tipo */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:col-span-2 lg:col-span-1">
                    <h3 className="mb-4 text-lg font-semibold text-white">Despesas por Tipo</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={graficos.despesasPorTipo}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => `${entry.name}: R$ ${entry.value.toFixed(0)}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {graficos.despesasPorTipo.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(5, 1, 7, 0.95)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "0.75rem",
                                    color: "#fff",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
