import { useEffect, useMemo, useState } from "react";
import { mensalidadesApi } from "../lib/mensalidades";
import type { Mensalidade } from "../lib/mensalidades";
import { useAuth } from "../context/AuthContext";
import { associadoApi } from "../lib/associado";
import type { Associado } from "../lib/associado";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useTheme } from "../hooks/useTheme";

const MONTH_NAMES = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

type ViewMode = "mes" | "associado";

export default function Mensalidades() {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const associacaoId = user?.associacaoId;

    const [anoSelecionado, setAnoSelecionado] = useState<number>(
        new Date().getFullYear()
    );
    const [viewMode, setViewMode] = useState<ViewMode>("mes");
    const [mesSelecionado, setMesSelecionado] = useState<number | null>(
        new Date().getMonth() + 1
    );

    const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
    const [mensalidadesAssociado, setMensalidadesAssociado] = useState<Mensalidade[]>([]);
    const [associados, setAssociados] = useState<Associado[]>([]);
    const [associadoSelecionadoId, setAssociadoSelecionadoId] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [mensalidadeSelecionada, setMensalidadeSelecionada] = useState<Mensalidade | null>(null);
    const [showConfigModal, setShowConfigModal] = useState(false);


    const isManager = useMemo(() => {
        return (
            user?.perfilAssociacao === "ADMINISTRADOR" ||
            user?.perfilAssociacao === "DIRETOR" ||
            user?.perfilAssociacao === "TECNICO"
        );
    }, [user]);

    // Carrega associados (apenas para admin)
    useEffect(() => {
        if (!associacaoId) return;
        if (!isManager) return;
        (async () => {
            try {
                const data = await associadoApi.listAssociados(associacaoId);
                setAssociados(data);
            } catch (err: any) {
                console.error(err);
            }
        })();
    }, [associacaoId, isManager]);

    // Verifica se existe configuração da mensalidade; se não existir, abre modal para criar
    useEffect(() => {
        if (!associacaoId) return;
        (async () => {
            try {
                await mensalidadesApi.getConfig();
                setShowConfigModal(false);
            } catch (err: any) {
                // Se 404 ou erro indicando ausência de config, abrir modal
                console.warn("ConfigMensalidade não encontrada, abrindo modal de configuração.", err?.response?.status);
                setShowConfigModal(true);
            }
        })();
    }, [associacaoId]);

    // Carrega mensalidades do usuário logado (por associado view)
    useEffect(() => {
        if (!associacaoId) return;
        const load = async () => {
            setLoading(true);
            try {
                if (!isManager) {
                    const data = await mensalidadesApi.getMinhasMensalidades(anoSelecionado);
                    setMensalidadesAssociado(data);
                }
            } catch (err: any) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [associacaoId, anoSelecionado, isManager]);

    // Função que carrega mensalidades por usuário (admin) ou agrega por mês
    const carregarParaMes = async (ano: number) => {
        if (!associacaoId) return;
        setLoading(true);
        try {
            if (isManager) {
                // administrador: buscar todas as mensalidades da associação (mais eficiente)
                const data = await mensalidadesApi.getMensalidadesAssociacao(ano);
                setMensalidades(data);
            } else {
                // associado comum: só o próprio
                const data = await mensalidadesApi.getMinhasMensalidades(ano);
                setMensalidades(data);
            }
        } catch (err: any) {
            console.error(err);
            // Se o erro for devido à falta de configuração, abrir modal de configuração
            const msg = err?.response?.data?.error || err?.message || "";
            const lower = String(msg).toLowerCase();
            if (lower.includes("configura") || lower.includes("mensalidade não encontrada") || lower.includes("configuração")) {
                setShowConfigModal(true);
                return;
            }
            toast.error(err?.message || "Erro ao carregar mensalidades");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarParaMes(anoSelecionado);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anoSelecionado, associados, isManager]);

    // Quando selecionar associado (admin) carrega o carnê dele
    useEffect(() => {
        if (!associadoSelecionadoId) return;
        const load = async () => {
            setLoading(true);
            try {
                const data = await mensalidadesApi.getMensalidadesUsuario(associadoSelecionadoId, anoSelecionado);
                setMensalidadesAssociado(data);
            } catch (err: any) {
                console.error(err);
                toast.error(err?.message || "Erro ao carregar carnê do associado");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [associadoSelecionadoId, anoSelecionado]);

    const statsByMonth = useMemo(() => {
        const stats = Array.from({ length: 12 }, () => ({ pagos: 0, abertos: 0, atrasados: 0 }));
        mensalidades.forEach((m) => {
            const idx = m.mes - 1;
            if (m.status === "PAGA") stats[idx].pagos++;
            else if (m.status === "ABERTA") stats[idx].abertos++;
            else if (m.status === "ATRASADA") stats[idx].atrasados++;
        });
        return stats;
    }, [mensalidades]);

    const abrirModalPagamento = (m: Mensalidade) => {
        setMensalidadeSelecionada(m);
        setModalOpen(true);
    };

    const fecharModal = () => {
        setModalOpen(false);
        setMensalidadeSelecionada(null);
    };

    const handleSalvarPagamento = async (payload: {
        dataPagamento?: string;
        formaPagamento?: string;
        comprovanteUrl?: string;
        observacoes?: string;
    }) => {
        if (!mensalidadeSelecionada) return;
        setLoadingAction(true);
        try {
            await mensalidadesApi.pagarMensalidade(mensalidadeSelecionada.id, payload);
            toast.success("Pagamento registrado com sucesso");
            // Atualiza listas
            if (viewMode === "mes") {
                await carregarParaMes(anoSelecionado);
            } else {
                if (associadoSelecionadoId) {
                    const data = await mensalidadesApi.getMensalidadesUsuario(associadoSelecionadoId, anoSelecionado);
                    setMensalidadesAssociado(data);
                } else {
                    const data = await mensalidadesApi.getMinhasMensalidades(anoSelecionado);
                    setMensalidadesAssociado(data);
                }
            }
            fecharModal();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || "Erro ao registrar pagamento");
        } finally {
            setLoadingAction(false);
        }
    };

    const gerarAno = async () => {
        if (!isManager) return;
        setLoading(true);
        try {
            await mensalidadesApi.gerarMensalidadesAno(anoSelecionado);
            toast.success("Mensalidades geradas para o ano");
            await carregarParaMes(anoSelecionado);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || "Erro ao gerar mensalidades");
        } finally {
            setLoading(false);
        }
    };

    // Modal de configuração quando não existir ConfigMensalidade
    const handleSaveConfig = async (payload: { valorPadrao: number | string; diaVencimento: number; ativo?: boolean }) => {
        setLoading(true);
        try {
            await mensalidadesApi.upsertConfig(payload);
            toast.success("Configuração salva com sucesso");
            setShowConfigModal(false);
            await carregarParaMes(anoSelecionado);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || "Erro ao salvar configuração");
        } finally {
            setLoading(false);
        }
    };

    // Filtros locais
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ABERTA" | "PAGA" | "ATRASADA">("ALL");

    const mensalidadesDoMes = useMemo(() => {
        if (!mesSelecionado) return [] as Mensalidade[];
        return mensalidades
            .filter((m) => m.mes === mesSelecionado)
            .filter((m) => {
                if (statusFilter === "ALL") return true;
                return m.status === statusFilter;
            })
            .filter((m) => {
                if (!searchTerm) return true;
                const termo = searchTerm.toLowerCase();
                const nome = (m as any).usuario?.nome || "";
                const apelido = (m as any).usuario?.apelido || "";
                return nome.toLowerCase().includes(termo) || apelido.toLowerCase().includes(termo);
            });
    }, [mensalidades, mesSelecionado, searchTerm, statusFilter]);

    const mensalidadesDoAssociado = useMemo(() => {
        return mensalidadesAssociado
            .filter((m) => (statusFilter === "ALL" ? true : m.status === statusFilter))
            .filter((m) => {
                if (!searchTerm) return true;
                const termo = searchTerm.toLowerCase();
                return (m as any).usuario?.nome?.toLowerCase?.().includes(termo) || (m as any).usuario?.apelido?.toLowerCase?.().includes(termo);
            });
    }, [mensalidadesAssociado, searchTerm, statusFilter]);

    // Cálculos para o mês atual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const isCurrentYear = anoSelecionado === currentYear;
    const currentMonthIdx = isCurrentYear ? currentMonth : -1;
    const statAtual = currentMonthIdx >= 0 ? statsByMonth[currentMonthIdx] : { pagos: 0, abertos: 0, atrasados: 0 };
    const totalAtual = statAtual.pagos + statAtual.abertos + statAtual.atrasados;
    const pctPagoAtual = totalAtual === 0 ? 0 : (statAtual.pagos / totalAtual) * 100;

    return (
        <div className="flex flex-col gap-6 pb-8">
            {/* Header com controles */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mensalidades</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Controle do carnê dos associados</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <select
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium dark:text-white"
                    >
                        <option value={anoSelecionado - 1}>{anoSelecionado - 1}</option>
                        <option value={anoSelecionado}>{anoSelecionado}</option>
                        <option value={anoSelecionado + 1}>{anoSelecionado + 1}</option>
                    </select>
                    {isManager && (
                        <button
                            onClick={gerarAno}
                            className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                        >
                            Gerar carnê do ano
                        </button>
                    )}
                </div>
            </header>

            {/* Tabs: Por mês / Por associado */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setViewMode("mes")}
                    className={`px-4 py-3 font-medium border-b-2 transition ${viewMode === "mes" ? "border-purple-600 text-purple-600 dark:text-purple-400" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}
                >
                    Por mês
                </button>
                <button
                    onClick={() => setViewMode("associado")}
                    className={`px-4 py-3 font-medium border-b-2 transition ${viewMode === "associado" ? "border-purple-600 text-purple-600 dark:text-purple-400" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}
                >
                    Por associado
                </button>
            </div>

            {viewMode === "mes" && (
                <section className="space-y-6">
                    {/* Hero Card: Mês Atual */}
                    {isCurrentYear && (
                        <MesAtualHero
                            mes={currentMonth + 1}
                            ano={anoSelecionado}
                            stats={statAtual}
                            total={totalAtual}
                            pctPago={pctPagoAtual}
                            onVerMensalidades={() => setMesSelecionado(currentMonth + 1)}
                        />
                    )}

                    {/* Grid de Meses */}
                    <MesesGrid
                        anosel={anoSelecionado}
                        statsByMonth={statsByMonth}
                        mesSelecionado={mesSelecionado}
                        onSelectMonth={(m) => setMesSelecionado(m)}
                        currentMonth={currentMonthIdx}
                    />

                    {/* Tabela de Mensalidades */}
                    {mesSelecionado && (
                        <MensalidadesTabela
                            mes={mesSelecionado}
                            ano={anoSelecionado}
                            dados={mensalidadesDoMes}
                            loading={loading}
                            searchTerm={searchTerm}
                            statusFilter={statusFilter}
                            onChangeSearch={setSearchTerm}
                            onChangeStatusFilter={setStatusFilter}
                            onRegistrarPagamento={abrirModalPagamento}
                        />
                    )}
                </section>
            )}

            {viewMode === "associado" && (
                <section className="space-y-6">
                    {/* Seletor de Associado */}
                    {isManager ? (
                        <div className={`rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Selecionar associado
                            </label>
                            <select
                                onChange={(e) => setAssociadoSelecionadoId(Number(e.target.value) || null)}
                                className={`w-full rounded-lg border px-4 py-2 font-medium transition ${isDark ? 'bg-gray-800 border-gray-600 text-white focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'} focus:ring-2 focus:ring-opacity-50`}
                            >
                                <option value="">Escolha um associado...</option>
                                {associados.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.nome} {a.apelido ? `(${a.apelido})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className={`rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Meu carnê de mensalidades
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                Acompanhe suas mensalidades ao longo do ano
                            </p>
                        </div>
                    )}

                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`rounded-lg border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <p className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                Total
                            </p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {mensalidadesAssociado.length}
                            </p>
                        </div>
                        <div className={`rounded-lg border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <p className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                Pagos
                            </p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                {mensalidadesAssociado.filter(m => m.status === 'PAGA').length}
                            </p>
                        </div>
                        <div className={`rounded-lg border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <p className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                Abertos
                            </p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                {mensalidadesAssociado.filter(m => m.status === 'ABERTA').length}
                            </p>
                        </div>
                        <div className={`rounded-lg border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <p className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                Atrasados
                            </p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                {mensalidadesAssociado.filter(m => m.status === 'ATRASADA').length}
                            </p>
                        </div>
                    </div>

                    {/* Tabela */}
                    <div className={`rounded-2xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
                        {/* Filtros */}
                        <div className={`rounded-lg border flex flex-col md:flex-row gap-3 p-4 mb-6 ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm transition ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'} focus:ring-2 focus:ring-opacity-50`}
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${isDark ? 'bg-gray-800 border-gray-600 text-white focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'} focus:ring-2 focus:ring-opacity-50`}
                            >
                                <option value="ALL">Todos os status</option>
                                <option value="PAGA">Pagos</option>
                                <option value="ABERTA">Abertos</option>
                                <option value="ATRASADA">Atrasados</option>
                            </select>
                        </div>

                        {/* Tabela de Meses */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Mês
                                        </th>
                                        <th className={`text-center py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Vencimento
                                        </th>
                                        <th className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Valor
                                        </th>
                                        <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Status
                                        </th>
                                        <th className={`text-center py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Pagamento
                                        </th>
                                        <th className={`text-center py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Forma
                                        </th>
                                        <th className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Ação
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className={`py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Carregando...
                                            </td>
                                        </tr>
                                    ) : mensalidadesDoAssociado.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className={`py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Nenhuma mensalidade encontrada
                                            </td>
                                        </tr>
                                    ) : (
                                        mensalidadesDoAssociado.map((m) => {
                                            const statusBadges: Record<string, { icon: string; bg: string; text: string }> = {
                                                PAGA: {
                                                    icon: "✓",
                                                    bg: isDark ? "bg-green-900/30 text-green-200" : "bg-green-100 text-green-700",
                                                    text: "Paga",
                                                },
                                                ABERTA: {
                                                    icon: "⏳",
                                                    bg: isDark ? "bg-yellow-900/30 text-yellow-200" : "bg-yellow-100 text-yellow-700",
                                                    text: "Aberta",
                                                },
                                                ATRASADA: {
                                                    icon: "⚠",
                                                    bg: isDark ? "bg-red-900/30 text-red-200" : "bg-red-100 text-red-700",
                                                    text: "Atrasada",
                                                },
                                            };
                                            const badge = statusBadges[m.status] || statusBadges.ABERTA;
                                            return (
                                                <tr
                                                    key={m.id}
                                                    className={`border-b transition ${isDark ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-200 hover:bg-gray-50'}`}
                                                >
                                                    <td className={`py-3 px-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {MONTH_NAMES[m.mes - 1]}
                                                    </td>
                                                    <td className={`text-center py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {format(new Date(m.vencimento), 'dd/MM/yy')}
                                                    </td>
                                                    <td className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        R$ {Number(m.valor || 0).toFixed(2)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg}`}>
                                                            {badge.icon} {badge.text}
                                                        </span>
                                                    </td>
                                                    <td className={`text-center py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {m.dataPagamento ? format(new Date(m.dataPagamento), 'dd/MM/yy') : '—'}
                                                    </td>
                                                    <td className={`text-center py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {m.formaPagamento || '—'}
                                                    </td>
                                                    <td className="text-right py-3 px-4">
                                                        {m.status !== 'PAGA' ? (
                                                            <button
                                                                onClick={() => abrirModalPagamento(m)}
                                                                className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-3 py-1.5 text-xs font-semibold text-white transition"
                                                            >
                                                                Registrar
                                                            </button>
                                                        ) : (
                                                            <span className={`text-xs font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                                                ✓ Pago
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* Modal de pagamento simples */}
            {modalOpen && mensalidadeSelecionada && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm'}`}>
                    <div className={`w-full max-w-2xl rounded-2xl p-6 ${isDark ? 'bg-[#0b0b0d] text-white border border-white/5 shadow-lg' : 'bg-white text-[#1a1027] border border-gray-200 shadow-md'}`}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Registrar pagamento</h3>
                            <button onClick={fecharModal} className="text-sm">Fechar</button>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3">
                            <div>
                                <label className="text-sm text-gray-600">Associado</label>
                                <div className="font-semibold">{(mensalidadeSelecionada as any).usuario?.nome || `Usuário ${mensalidadeSelecionada.usuarioId}`}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-gray-600">Mês / Ano</label>
                                    <div>{MONTH_NAMES[mensalidadeSelecionada.mes - 1]} / {mensalidadeSelecionada.ano}</div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Valor</label>
                                    <div>R$ {Number(mensalidadeSelecionada.valor || 0).toFixed(2)}</div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Data de vencimento</label>
                                <div>{format(new Date(mensalidadeSelecionada.vencimento), 'dd/MM/yyyy')}</div>
                            </div>

                            <hr />

                            <PagamentoForm mensalidade={mensalidadeSelecionada} onCancel={fecharModal} onSave={handleSalvarPagamento} loading={loadingAction} />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de configuração: aparece quando não existe ConfigMensalidade */}
            {showConfigModal && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm'}`}>
                    <div className={`w-full max-w-lg rounded-2xl p-6 ${isDark ? 'bg-gray-800 text-white border border-white/5 shadow-lg' : 'bg-white text-[#1a1027] border border-gray-200 shadow-md'}`}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Configuração de Mensalidade</h3>
                            <button onClick={() => setShowConfigModal(false)} className="text-sm">Fechar</button>
                        </div>
                        <div className="mt-4">
                            <ConfigForm onCancel={() => setShowConfigModal(false)} onSave={handleSaveConfig} loading={loading} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PagamentoForm({ mensalidade, onCancel, onSave, loading }: {
    mensalidade: Mensalidade;
    onCancel: () => void;
    onSave: (payload: { dataPagamento?: string; formaPagamento?: string; comprovanteUrl?: string; observacoes?: string }) => void;
    loading?: boolean;
}) {
    const [dataPagamento, setDataPagamento] = useState<string>(new Date().toISOString().slice(0, 10));
    const [formaPagamento, setFormaPagamento] = useState<string>("PIX");
    // const [comprovanteUrl, setComprovanteUrl] = useState<string>(mensalidade.comprovanteUrl || "");
    const [observacoes, setObservacoes] = useState<string>(mensalidade.observacoes || "");
    const { isDark } = useTheme();

    const inputClass = `w-full rounded border px-3 py-2 ${isDark ? 'bg-[#0b0b0d] text-white border-white/10 placeholder:text-white/60' : 'bg-white text-[#1a1027]'}`;
    const textareaClass = `w-full rounded border px-3 py-2 ${isDark ? 'bg-[#0b0b0d] text-white border-white/10 placeholder:text-white/60' : 'bg-white text-[#1a1027]'}`;
    const selectClass = `w-full rounded border px-3 py-2 ${isDark ? 'bg-[#0b0b0d] text-white border-white/10' : 'bg-white text-[#1a1027]'}`;

    return (
        <div className="grid grid-cols-1 gap-3">
            <div>
                <label className="block text-sm text-gray-600">Data de pagamento</label>
                <input type="date" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)} className={inputClass} />
            </div>

            <div>
                <label className="block text-sm text-gray-600">Forma de pagamento</label>
                <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} className={selectClass}>
                    <option>PIX</option>
                    <option>DINHEIRO</option>
                    <option>BOLETO</option>
                    <option>CREDITO</option>
                    <option>DEBITO</option>
                    <option>TRANSFERENCIA</option>
                    <option>OUTRO</option>
                </select>
            </div>
            {/* 
            <div>
                <label className="block text-sm text-gray-600">URL do comprovante</label>
                <input value={comprovanteUrl} onChange={(e) => setComprovanteUrl(e.target.value)} placeholder="https://..." className={inputClass} />
            </div> */}

            <div>
                <label className="block text-sm text-gray-600">Observações</label>
                <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className={textareaClass} rows={3} />
            </div>

            <div className="flex items-center justify-end gap-2">
                <button onClick={onCancel} className={`rounded border px-3 py-2 ${isDark ? 'border-white/10 text-white' : ''}`}>Cancelar</button>
                <button onClick={() => onSave({ dataPagamento, formaPagamento, comprovanteUrl: undefined, observacoes: observacoes || undefined })} disabled={loading} className="rounded bg-primary-dark-9 px-3 py-2 text-white">{loading ? 'Salvando...' : 'Salvar'}</button>
            </div>
        </div>
    );
}

function ConfigForm({ onCancel, onSave, loading }: {
    onCancel: () => void;
    onSave: (payload: { valorPadrao: number | string; diaVencimento: number; ativo?: boolean }) => void;
    loading?: boolean;
}) {
    const { isDark } = useTheme();

    const [valorPadrao, setValorPadrao] = useState<string>("0.00");
    const [diaVencimento, setDiaVencimento] = useState<number>(10);
    const [ativo, setAtivo] = useState<boolean>(true);

    const inputClass = `w-full rounded border px-3 py-2 ${isDark ? 'bg-[#0b0b0d] text-white border-white/10 placeholder:text-white/60' : 'bg-white text-[#1a1027]'}`;

    return (
        <div className="grid grid-cols-1 gap-3">
            <div>
                <label className={`block text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}>Valor padrão (R$)</label>
                <input value={valorPadrao} onChange={(e) => setValorPadrao(e.target.value)} className={inputClass} />
            </div>
            <div>
                <label className={`block text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}>Dia do vencimento (1-28)</label>
                <input type="number" min={1} max={28} value={diaVencimento} onChange={(e) => setDiaVencimento(Number(e.target.value))} className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
                <input id="ativo" type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
                <label htmlFor="ativo" className={`text-sm ${isDark ? 'text-white' : ''}`}>Ativo</label>
            </div>
            <div className="flex items-center justify-end gap-2">
                <button onClick={onCancel} className={`rounded border px-3 py-2 ${isDark ? 'border-white/10 text-white' : ''}`}>Cancelar</button>
                <button onClick={() => onSave({ valorPadrao: valorPadrao, diaVencimento, ativo })} disabled={loading} className="rounded bg-primary-dark-9 px-3 py-2 text-white">{loading ? 'Salvando...' : 'Salvar configuração'}</button>
            </div>
        </div>
    );
}

// Modal de configuração (aparece quando não existe config)
// renderizado no topo do componente via estado `showConfigModal`
// Aqui usamos mensalidadesApi.upsertConfig através de handleSaveConfig
// showConfigModal é controlado no componente principal

/* ========================================
   HERO CARD: MÊS ATUAL
======================================== */
function MesAtualHero({
    mes,
    ano,
    stats,
    total,
    pctPago,
    onVerMensalidades
}: {
    mes: number;
    ano: number;
    stats: { pagos: number; abertos: number; atrasados: number };
    total: number;
    pctPago: number;
    onVerMensalidades: () => void;
}) {
    const { isDark } = useTheme();
    const mesNome = MONTH_NAMES[mes - 1];

    const getProgressColor = (pct: number) => {
        if (pct >= 70) return "from-green-500 to-green-600";
        if (pct >= 40) return "from-yellow-500 to-yellow-600";
        return "from-red-500 to-red-600";
    };

    return (
        <div className={`rounded-2xl border ${isDark ? 'bg-gradient-to-br from-purple-900/30 to-transparent border-purple-500/20' : 'bg-gradient-to-br from-purple-50 to-transparent border-purple-200'} p-6 md:p-8`}>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-purple-500/20 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
                            Mês atual
                        </span>
                    </div>
                    <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {mesNome} / {ano}
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Visão geral das mensalidades deste mês
                    </p>
                </div>
                <button
                    onClick={onVerMensalidades}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${isDark ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                >
                    Ver detalhes ↓
                </button>
            </div>

            {/* Grid de stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className={`rounded-lg p-4 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
                    <p className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Pagos</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{stats.pagos}</p>
                </div>
                <div className={`rounded-lg p-4 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
                    <p className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Em aberto</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{stats.abertos}</p>
                </div>
                <div className={`rounded-lg p-4 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
                    <p className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Atrasados</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{stats.atrasados}</p>
                </div>
                <div className={`rounded-lg p-4 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} col-span-2 md:col-span-2`}>
                    <p className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{total}</p>
                </div>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Taxa de mensalidades pagas
                    </p>
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {pctPago.toFixed(0)}%
                    </p>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <div
                        className={`h-full bg-gradient-to-r ${getProgressColor(pctPago)} transition-all duration-500`}
                        style={{ width: `${pctPago}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

/* ========================================
   GRID DE MESES
======================================== */
function MesesGrid({
    anosel,
    statsByMonth,
    mesSelecionado,
    onSelectMonth,
    currentMonth,
}: {
    anosel: number;
    statsByMonth: { pagos: number; abertos: number; atrasados: number }[];
    mesSelecionado: number | null;
    onSelectMonth: (m: number) => void;
    currentMonth: number;
}) {
    const { isDark } = useTheme();
    const [open, setOpen] = useState(true);

    const others = MONTH_NAMES.map((name, idx) => ({ name, idx })).filter((it) => it.idx !== currentMonth);

    const getProgressColor = (pct: number) => {
        if (pct >= 70) return "bg-green-400";
        if (pct >= 40) return "bg-yellow-400";
        return "bg-red-400";
    };

    return (
        <div className="space-y-4">
            {/* Toggle */}
            <div className="flex items-center justify-end">
                <button
                    onClick={() => setOpen((s) => !s)}
                    className={`text-sm font-medium flex items-center gap-1 transition ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
                >
                    {open ? '▼' : '▶'} {open ? 'Ocultar meses' : 'Ver todos os meses'}
                </button>
            </div>

            {/* Grid */}
            {open && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {others.map(({ name, idx }) => {
                        const stat = statsByMonth[idx];
                        const total = stat.pagos + stat.abertos + stat.atrasados;
                        const pctPago = total === 0 ? 0 : (stat.pagos / total) * 100;
                        const isSelected = mesSelecionado === idx + 1;

                        return (
                            <button
                                key={name}
                                onClick={() => onSelectMonth(idx + 1)}
                                className={`text-left rounded-xl border transition ${isSelected
                                    ? isDark
                                        ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500'
                                        : 'bg-purple-100 border-purple-400 ring-2 ring-purple-400'
                                    : isDark
                                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                    } p-4 group`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className={`font-semibold ${isDark ? 'text-white group-hover:text-gray-200' : 'text-gray-900 group-hover:text-gray-700'}`}>
                                            {name}
                                        </p>
                                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                                            {anosel}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1 text-xs mb-3">
                                    <div className="flex justify-between">
                                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Pagos:</span>
                                        <span className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                            {stat.pagos}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Abertos:</span>
                                        <span className={`font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                            {stat.abertos}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Atrasados:</span>
                                        <span className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                            {stat.atrasados}
                                        </span>
                                    </div>
                                </div>

                                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                                    <div
                                        className={`h-full ${getProgressColor(pctPago)} transition-all`}
                                        style={{ width: `${pctPago}%` }}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ========================================
   TABELA DE MENSALIDADES
======================================== */
function MensalidadesTabela({
    mes,
    ano,
    dados,
    loading,
    searchTerm,
    statusFilter,
    onChangeSearch,
    onChangeStatusFilter,
    onRegistrarPagamento,
}: {
    mes: number;
    ano: number;
    dados: Mensalidade[];
    loading: boolean;
    searchTerm: string;
    statusFilter: "ALL" | "ABERTA" | "PAGA" | "ATRASADA";
    onChangeSearch: (term: string) => void;
    onChangeStatusFilter: (status: any) => void;
    onRegistrarPagamento: (m: Mensalidade) => void;
}) {
    const { isDark } = useTheme();
    const mesNome = MONTH_NAMES[mes - 1];

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { icon: string; bg: string; text: string }> = {
            PAGA: {
                icon: "✓",
                bg: isDark ? "bg-green-900/30 text-green-200" : "bg-green-100 text-green-700",
                text: "Paga",
            },
            ABERTA: {
                icon: "⏳",
                bg: isDark ? "bg-yellow-900/30 text-yellow-200" : "bg-yellow-100 text-yellow-700",
                text: "Aberta",
            },
            ATRASADA: {
                icon: "⚠",
                bg: isDark ? "bg-red-900/30 text-red-200" : "bg-red-100 text-red-700",
                text: "Atrasada",
            },
        };
        const badge = badges[status] || badges.ABERTA;
        return badge;
    };

    return (
        <div className={`rounded-2xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
            {/* Header */}
            <div className="mb-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Mensalidades de {mesNome} / {ano}
                </h3>

                {/* Filtros */}
                <div className={`rounded-lg border flex flex-col md:flex-row gap-3 p-4 ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Buscar associado..."
                            value={searchTerm}
                            onChange={(e) => onChangeSearch(e.target.value)}
                            className={`w-full rounded-lg border px-3 py-2 text-sm transition ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'} focus:ring-2 focus:ring-opacity-50`}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => onChangeStatusFilter(e.target.value)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${isDark ? 'bg-gray-800 border-gray-600 text-white focus:ring-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'} focus:ring-2 focus:ring-opacity-50`}
                    >
                        <option value="ALL">Todos os status</option>
                        <option value="PAGA">Pagos</option>
                        <option value="ABERTA">Abertos</option>
                        <option value="ATRASADA">Atrasados</option>
                    </select>
                </div>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Associado
                            </th>
                            <th className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Valor
                            </th>
                            <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Status
                            </th>
                            <th className={`text-center py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Vencimento
                            </th>
                            <th className={`text-center py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Pagamento
                            </th>
                            <th className={`text-center py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Forma
                            </th>
                            <th className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Ação
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className={`py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Carregando...
                                </td>
                            </tr>
                        ) : dados.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={`py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Nenhuma mensalidade encontrada
                                </td>
                            </tr>
                        ) : (
                            dados.map((m) => {
                                const badge = getStatusBadge(m.status);
                                return (
                                    <tr
                                        key={m.id}
                                        className={`border-b transition ${isDark ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <td className={`py-3 px-4 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${isDark ? 'bg-purple-600' : 'bg-purple-500'}`}>
                                                    {((m as any).usuario?.nome || `U`)[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">
                                                        {(m as any).usuario?.nome || `Usuário ${m.usuarioId}`}
                                                    </p>
                                                    {(m as any).usuario?.apelido && (
                                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            ({(m as any).usuario.apelido})
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            R$ {Number(m.valor || 0).toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg}`}>
                                                {badge.icon} {badge.text}
                                            </span>
                                        </td>
                                        <td className={`text-center py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {format(new Date(m.vencimento), "dd/MM/yy")}
                                        </td>
                                        <td className={`text-center py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {m.dataPagamento ? format(new Date(m.dataPagamento), "dd/MM/yy") : "—"}
                                        </td>
                                        <td className={`text-center py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {m.formaPagamento || "—"}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {m.status !== "PAGA" ? (
                                                <button
                                                    onClick={() => onRegistrarPagamento(m)}
                                                    className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-3 py-1.5 text-xs font-semibold text-white transition"
                                                >
                                                    Registrar
                                                </button>
                                            ) : (
                                                <span className={`text-xs font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                                    ✓ Pago
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

