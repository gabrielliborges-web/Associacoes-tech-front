import { BarChart3, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface ResumoDREProps {
    receitas: {
        vendas: number;
        entradas: number;
    };
    despesas: {
        compras: number;
        gerais: number;
        ajustes: number;
    };
    mesAnterior?: {
        lucro: number;
    };
}

export default function ResumoDRE({
    receitas,
    despesas,
    mesAnterior,
}: ResumoDREProps) {
    const totalReceitas = receitas.vendas + receitas.entradas;
    const totalDespesas = despesas.compras + despesas.gerais + despesas.ajustes;
    const lucroAtual = totalReceitas - totalDespesas;
    const margemLucro = totalReceitas > 0 ? (lucroAtual / totalReceitas) * 100 : 0;

    const tendenciaLucro =
        mesAnterior && lucroAtual > mesAnterior.lucro ? "positiva" : "negativa";

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary-600/20 p-2.5">
                    <BarChart3 className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">DRE - Novembro</h3>
                    <p className="text-sm text-white/60">Demonstração de Resultado do Exercício</p>
                </div>
            </div>

            {/* Receitas Section */}
            <div className="mb-6 rounded-xl border border-green-600/20 bg-green-600/5 p-4">
                <h4 className="mb-4 text-sm font-semibold text-green-400">RECEITAS</h4>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Vendas</span>
                        <span className="font-semibold text-white">
                            R$ {receitas.vendas.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Entradas Financeiras</span>
                        <span className="font-semibold text-white">
                            R$ {receitas.entradas.toFixed(2)}
                        </span>
                    </div>

                    <div className="border-t border-green-600/20 pt-3 flex items-center justify-between">
                        <span className="font-semibold text-green-400">Total Receitas</span>
                        <span className="text-xl font-bold text-green-400">
                            R$ {totalReceitas.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Despesas Section */}
            <div className="mb-6 rounded-xl border border-red-600/20 bg-red-600/5 p-4">
                <h4 className="mb-4 text-sm font-semibold text-red-400">DESPESAS</h4>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Compras de Estoque</span>
                        <span className="font-semibold text-white">
                            R$ {despesas.compras.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Despesas Gerais</span>
                        <span className="font-semibold text-white">
                            R$ {despesas.gerais.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">Ajustes</span>
                        <span className="font-semibold text-white">
                            R$ {despesas.ajustes.toFixed(2)}
                        </span>
                    </div>

                    <div className="border-t border-red-600/20 pt-3 flex items-center justify-between">
                        <span className="font-semibold text-red-400">Total Despesas</span>
                        <span className="text-xl font-bold text-red-400">
                            R$ {totalDespesas.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Result Section */}
            <div
                className={`rounded-xl border-2 p-4 ${lucroAtual >= 0
                        ? "border-green-600/30 bg-green-600/5"
                        : "border-red-600/30 bg-red-600/5"
                    }`}
            >
                <div className="mb-4 flex items-center gap-2">
                    {lucroAtual >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-400" />
                    ) : (
                        <TrendingDown className="h-5 w-5 text-red-400" />
                    )}
                    <h4
                        className={`text-sm font-semibold ${lucroAtual >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        RESULTADO LÍQUIDO
                    </h4>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-white/70">Total Receitas - Total Despesas</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">
                            {lucroAtual >= 0 ? "Lucro" : "Prejuízo"}
                        </span>
                        <span
                            className={`text-2xl font-bold ${lucroAtual >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            R$ {Math.abs(lucroAtual).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-white/70">Margem de Lucro</span>
                        <span className="font-semibold text-white">
                            {margemLucro.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {tendenciaLucro === "negativa" && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-600/30 bg-red-600/5 p-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold text-red-400">Atenção</p>
                        <p className="text-white/70">
                            Lucro menor que o mês anterior. Considere revisar despesas.
                        </p>
                    </div>
                </div>
            )}

            {totalReceitas < totalDespesas && (
                <div className="mt-2 flex items-start gap-3 rounded-lg border border-red-600/30 bg-red-600/5 p-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold text-red-400">Atenção</p>
                        <p className="text-white/70">
                            Despesas excedem receitas. Investigue a origem.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
