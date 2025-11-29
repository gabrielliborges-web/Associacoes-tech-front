import { useMemo } from "react";
import {
    Wallet2,
    TrendingUp,
    TrendingDown,
    Target,
    RotateCcw,
} from "lucide-react";
import DashboardCard from "../components/dashboard/DashboardCard";
import DashboardChartArea from "../components/dashboard/DashboardChartArea";
import DashboardChartPie from "../components/dashboard/DashboardChartPie";
import DashboardMovementsList from "../components/dashboard/DashboardMovementsList";
import DashboardAlerts from "../components/dashboard/DashboardAlerts";
import { dashboardMock } from "../mocks/dashboardData";

export default function Home() {
    // Simulando busca de dados com delay
    const data = useMemo(() => dashboardMock, []);

    return (
        <div className="space-y-8 pb-6">
            {/* Header */}
            <div className="animate-fade-in space-y-2">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-white/60">
                    Indicadores gerais e visão financeira em tempo real
                </p>
            </div>

            {/* Cards de Indicadores */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
                <DashboardCard
                    icon={Wallet2}
                    title="Saldo Atual"
                    value={data.cards.saldoAtual}
                    variation={data.cards.variacao.saldo}
                    format="currency"
                />
                <DashboardCard
                    icon={TrendingUp}
                    title="Receitas do Mês"
                    value={data.cards.receitasMes}
                    variation={data.cards.variacao.receitas}
                    format="currency"
                />
                <DashboardCard
                    icon={TrendingDown}
                    title="Despesas do Mês"
                    value={data.cards.despesasMes}
                    variation={data.cards.variacao.despesas}
                    format="currency"
                />
                <DashboardCard
                    icon={Target}
                    title="Lucro / Resultado"
                    value={data.cards.lucroMes}
                    variation={data.cards.variacao.lucro}
                    format="currency"
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 animate-fade-in">
                <div className="lg:col-span-2">
                    <DashboardChartArea data={data.receitasDespesas} />
                </div>
                <div>
                    <DashboardChartPie data={data.distribuicaoEntradas} />
                </div>
            </div>

            {/* Movimentações + Alertas */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 animate-fade-in">
                <div className="lg:col-span-2">
                    <DashboardMovementsList movimentos={data.movimentacoesRecentes} />
                </div>
                <div>
                    <DashboardAlerts alertas={data.alertas} />
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm text-white/60">
                    <RotateCcw className="h-4 w-4" />
                    <span>Última atualização há alguns segundos</span>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/15"
                >
                    <RotateCcw className="h-4 w-4" />
                    Atualizar
                </button>
            </div>
        </div>
    );
}
