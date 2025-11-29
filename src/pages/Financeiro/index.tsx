import { useState, useMemo, useCallback } from "react";
import {
    DollarSign,
    Plus,
    Download,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Settings2,
} from "lucide-react";
import type { Entrada, Despesa, MovimentacaoExtrato, AjusteManual } from "../../mocks/financeiroMock";
import {
    mockEntradas,
    mockDespesas,
    mockExtrato,
    mockResumoFinanceiro,
    mockAjustes,
    dadosGraficosReceitasVsDespesas,
    dadosReceitasPorTipo,
    dadosDespesasPorTipo,
} from "../../mocks/financeiroMock";
import FinanceiroResumo from "../../components/financeiro/FinanceiroResumo";
import ExtratoTable from "../../components/financeiro/ExtratoTable";
import ResumoDRE from "../../components/financeiro/ResumoDRE";
import FinanceiroEntradaModal from "../../components/financeiro/FinanceiroEntradaModal";
import FinanceiroDespesaModal from "../../components/financeiro/FinanceiroDespesaModal";
import AjusteManualModal from "../../components/financeiro/AjusteManualModal";

type TabAtiva = "resumo" | "extrato" | "entradas" | "despesas" | "dre";

export default function FinanceiroPage() {
    const [activeTab, setActiveTab] = useState<TabAtiva>("resumo");
    const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false);
    const [isDespesaModalOpen, setIsDespesaModalOpen] = useState(false);
    const [isAjusteModalOpen, setIsAjusteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // State para dados
    const [entradas, setEntradas] = useState<Entrada[]>(mockEntradas);
    const [despesas, setDespesas] = useState<Despesa[]>(mockDespesas);
    const [movimentacoes, setMovimentacoes] =
        useState<MovimentacaoExtrato[]>(mockExtrato);
    const [ajustes, setAjustes] = useState<AjusteManual[]>(mockAjustes);

    // State para paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filtros
    const [filtroExtratoTipo, setFiltroExtratoTipo] = useState<string>("");
    const [filtroDataInicio, setFiltroDataInicio] = useState("");
    const [filtroDataFim, setFiltroDataFim] = useState("");

    // Calcular totais
    const totalEntradas = useMemo(
        () => entradas.reduce((sum, e) => sum + e.valor, 0),
        [entradas]
    );
    const totalDespesas = useMemo(
        () => despesas.reduce((sum, d) => sum + d.valor, 0),
        [despesas]
    );
    // Movimentações filtradas
    const filteredMovimentacoes = useMemo(() => {
        let result = [...movimentacoes];

        if (filtroExtratoTipo) {
            result = result.filter((m) => m.tipo === filtroExtratoTipo);
        }

        if (filtroDataInicio) {
            const dataInicio = new Date(filtroDataInicio);
            result = result.filter(
                (m) => new Date(m.data) >= dataInicio
            );
        }

        if (filtroDataFim) {
            const dataFim = new Date(filtroDataFim);
            dataFim.setDate(dataFim.getDate() + 1);
            result = result.filter(
                (m) => new Date(m.data) < dataFim
            );
        }

        return result;
    }, [movimentacoes, filtroExtratoTipo, filtroDataInicio, filtroDataFim]);

    // Handlers
    const handleSalvarEntrada = useCallback(
        async (data: {
            tipo: string;
            valor: number;
            data: string;
            descricao: string;
        }) => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            const novaEntrada: Entrada = {
                id: Math.max(...entradas.map((e) => e.id), 0) + 1,
                tipo: data.tipo,
                valor: data.valor,
                data: data.data,
                descricao: data.observacao,
                usuarioNome: "João Silva",
            }; setEntradas([novaEntrada, ...entradas]);
            setIsEntradaModalOpen(false);
            setIsLoading(false);
            console.log("✅ Entrada registrada:", novaEntrada);
        },
        [entradas]
    );

    const handleSalvarDespesa = useCallback(
        async (data: {
            tipo: string;
            descricao: string;
            valor: number;
            data: string;
            descricao: string;
        }) => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            const novaDespesa: Despesa = {
                id: Math.max(...despesas.map((d) => d.id), 0) + 1,
                tipo: data.tipo,
                descricao: data.descricao,
                valor: data.valor,
                data: data.data,
                descricao: data.observacao,
                usuarioNome: "João Silva",
            }; setDespesas([novaDespesa, ...despesas]);
            setIsDespesaModalOpen(false);
            setIsLoading(false);
            console.log("✅ Despesa registrada:", novaDespesa);
        },
        [despesas]
    );

    const handleSalvarAjuste = useCallback(
        async (data: {
            tipo: "entrada" | "saida";
            descricao: string;
            valor: number;
            data: string;
            motivo: string;
        }) => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            const novoAjuste: AjusteManual = {
                id: Math.max(...ajustes.map((a) => a.id), 0) + 1,
                tipo: data.tipo === "saida" ? "saida" : "entrada",
                descricao: data.descricao,
                valor: data.valor,
                data: data.data,
                usuarioNome: "João Silva",
                motivo: data.motivo,
            };

            setAjustes([novoAjuste, ...ajustes]);

            // Adicionar também à movimentação
            const novaMovimentacao: MovimentacaoExtrato = {
                id: Math.max(...movimentacoes.map((m) => m.id), 0) + 1,
                tipo: data.tipo === "saida" ? "saida" : "entrada",
                descricao: data.descricao,
                valor: data.valor,
                data: data.data,
                categoria: "Ajuste Manual",
                usuarioNome: "João Silva",
            };
            setMovimentacoes([novaMovimentacao, ...movimentacoes]);

            setIsAjusteModalOpen(false);
            setIsLoading(false);
            console.log("✅ Ajuste registrado:", novoAjuste);
        },
        [ajustes, movimentacoes]
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 p-2.5">
                            <DollarSign className="h-6 w-6 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Financeiro</h1>
                    </div>
                    <p className="text-white/60">
                        Visão completa de entradas, despesas e fluxo de caixa
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setIsEntradaModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Entrada</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsDespesaModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Despesa</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsAjusteModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-medium text-white transition-all hover:bg-white/10 active:scale-95"
                    >
                        <Settings2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Ajuste</span>
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-medium text-white transition-all hover:bg-white/10 active:scale-95"
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Saldo Atual */}
                <div className="rounded-2xl border border-blue-600/30 bg-gradient-to-br from-blue-600/10 to-blue-700/5 p-4">
                    <p className="text-sm font-medium text-blue-400">Saldo Atual</p>
                    <p className="mt-2 text-3xl font-bold text-white">
                        R$ {mockResumoFinanceiro.saldoAtual.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-white/50">em caixa</p>
                </div>

                {/* Receitas do Mês */}
                <div className="rounded-2xl border border-green-600/30 bg-gradient-to-br from-green-600/10 to-green-700/5 p-4">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-green-400">Receitas</p>
                        <TrendingUp className="h-4 w-4 text-green-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-white">
                        R$ {totalEntradas.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-white/50">novembro</p>
                </div>

                {/* Despesas do Mês */}
                <div className="rounded-2xl border border-red-600/30 bg-gradient-to-br from-red-600/10 to-red-700/5 p-4">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-red-400">Despesas</p>
                        <TrendingDown className="h-4 w-4 text-red-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-white">
                        R$ {totalDespesas.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-white/50">novembro</p>
                </div>

                {/* Lucro */}
                <div
                    className={`rounded-2xl border-2 p-4 ${mockResumoFinanceiro.lucro >= 0
                        ? "border-green-600/30 bg-gradient-to-br from-green-600/10 to-green-700/5"
                        : "border-red-600/30 bg-gradient-to-br from-red-600/10 to-red-700/5"
                        }`}
                >
                    <p
                        className={`text-sm font-medium ${mockResumoFinanceiro.lucro >= 0
                            ? "text-green-400"
                            : "text-red-400"
                            }`}
                    >
                        Lucro/Prejuízo
                    </p>
                    <p
                        className={`mt-2 text-3xl font-bold ${mockResumoFinanceiro.lucro >= 0
                            ? "text-green-400"
                            : "text-red-400"
                            }`}
                    >
                        R$ {Math.abs(mockResumoFinanceiro.lucro).toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                        {mockResumoFinanceiro.lucro >= 0 ? "lucro" : "prejuízo"}
                    </p>
                </div>
            </div>

            {/* Alerts */}
            {totalDespesas > totalEntradas && (
                <div className="flex items-start gap-3 rounded-xl border border-yellow-600/30 bg-yellow-600/5 p-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-400 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold text-yellow-400">Atenção</p>
                        <p className="text-white/70">
                            Despesas excedem receitas este mês. Considere revisar gastos.
                        </p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/10 pb-px">
                {(["resumo", "extrato", "entradas", "despesas", "dre"] as const).map(
                    (tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => {
                                setActiveTab(tab);
                                setCurrentPage(1);
                            }}
                            className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-all ${activeTab === tab
                                ? "border-b-2 border-primary-600 text-primary-400"
                                : "text-white/70 hover:text-white"
                                }`}
                        >
                            {tab === "resumo" && "📊 Resumo"}
                            {tab === "extrato" && "📝 Extrato"}
                            {tab === "entradas" && "📈 Entradas"}
                            {tab === "despesas" && "📉 Despesas"}
                            {tab === "dre" && "📋 DRE"}
                        </button>
                    )
                )}
            </div>

            {/* Tab Content */}
            <div className="animate-fadeIn">
                {activeTab === "resumo" && (
                    <FinanceiroResumo
                        entradas={entradas}
                        despesas={despesas}
                        resumo={mockResumoFinanceiro}
                        graficos={{
                            receitasVsDespesas: dadosGraficosReceitasVsDespesas,
                            receitasPorTipo: dadosReceitasPorTipo,
                            despesasPorTipo: dadosDespesasPorTipo,
                        }}
                    />
                )}

                {activeTab === "extrato" && (
                    <div className="space-y-4">
                        {/* Filtros */}
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-white">
                                        Tipo
                                    </label>
                                    <select
                                        value={filtroExtratoTipo}
                                        onChange={(e) => {
                                            setFiltroExtratoTipo(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none"
                                    >
                                        <option value="">Todos</option>
                                        <option value="entrada">Entradas</option>
                                        <option value="saida">Saídas</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-white">
                                        Data Início
                                    </label>
                                    <input
                                        type="date"
                                        value={filtroDataInicio}
                                        onChange={(e) => {
                                            setFiltroDataInicio(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-white">
                                        Data Fim
                                    </label>
                                    <input
                                        type="date"
                                        value={filtroDataFim}
                                        onChange={(e) => {
                                            setFiltroDataFim(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tabela */}
                        <ExtratoTable
                            movimentacoes={filteredMovimentacoes}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                )}

                {activeTab === "entradas" && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-green-600/30 bg-green-600/5 p-4">
                            <p className="text-sm font-medium text-green-400">
                                Total de Entradas
                            </p>
                            <p className="mt-2 text-3xl font-bold text-white">
                                R$ {totalEntradas.toFixed(2)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-white/10 bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                                Valor
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                                Data
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                                Usuário
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entradas.map((e, idx) => (
                                            <tr
                                                key={e.id}
                                                className={`border-t border-white/5 hover:bg-white/10 ${idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                                                    }`}
                                            >
                                                <td className="px-6 py-4 text-sm text-white">{e.tipo}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-green-400">
                                                    +R$ {e.valor.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white/70">
                                                    {new Date(e.data).toLocaleDateString("pt-BR")}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white/70">
                                                    {e.usuarioNome}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "despesas" && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
                            <p className="text-sm font-medium text-red-400">
                                Total de Despesas
                            </p>
                            <p className="mt-2 text-3xl font-bold text-white">
                                R$ {totalDespesas.toFixed(2)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-white/10 bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                                Descrição
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                                Valor
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                                Data
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white/70">
                                                Usuário
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {despesas.map((d, idx) => (
                                            <tr
                                                key={d.id}
                                                className={`border-t border-white/5 hover:bg-white/10 ${idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                                                    }`}
                                            >
                                                <td className="px-6 py-4 text-sm text-white">{d.tipo}</td>
                                                <td className="px-6 py-4 text-sm text-white/70">
                                                    {d.descricao || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-red-400">
                                                    -R$ {d.valor.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white/70">
                                                    {new Date(d.data).toLocaleDateString("pt-BR")}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white/70">
                                                    {d.usuarioNome}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "dre" && (
                    <ResumoDRE
                        receitas={{
                            vendas: totalEntradas * 0.67,
                            entradas: totalEntradas * 0.33,
                        }}
                        despesas={{
                            compras: totalDespesas * 0.6,
                            gerais: totalDespesas * 0.3,
                            ajustes: totalDespesas * 0.1,
                        }}
                        mesAnterior={{ lucro: 1500 }}
                    />
                )}
            </div>

            {/* Modals */}
            <FinanceiroEntradaModal
                isOpen={isEntradaModalOpen}
                onClose={() => setIsEntradaModalOpen(false)}
                onSave={handleSalvarEntrada}
                isLoading={isLoading}
            />

            <FinanceiroDespesaModal
                isOpen={isDespesaModalOpen}
                onClose={() => setIsDespesaModalOpen(false)}
                onSave={handleSalvarDespesa}
                isLoading={isLoading}
            />

            <AjusteManualModal
                isOpen={isAjusteModalOpen}
                onClose={() => setIsAjusteModalOpen(false)}
                onRegistrar={handleSalvarAjuste}
                isLoading={isLoading}
            />
        </div>
    );
}
