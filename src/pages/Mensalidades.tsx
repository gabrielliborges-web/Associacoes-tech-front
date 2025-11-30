import React, { useEffect, useMemo, useState } from "react";
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
                // para cada associado buscar suas mensalidades e combinar
                const users = associados.length ? associados : [];
                const promises = users.map((u) => mensalidadesApi.getMensalidadesUsuario(u.id, ano));
                const resultados = await Promise.all(promises);
                const flat = resultados.flat();
                setMensalidades(flat);
            } else {
                // associado comum: só o próprio
                const data = await mensalidadesApi.getMinhasMensalidades(ano);
                setMensalidades(data);
            }
        } catch (err: any) {
            console.error(err);
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

    return (
        <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Mensalidades</h1>
                    <p className="text-sm text-gray-500">Controle do carnê dos associados ao longo do ano</p>
                </div>
                <div className="flex items-center gap-3">
                    <select value={anoSelecionado} onChange={(e) => setAnoSelecionado(Number(e.target.value))} className="rounded-lg border px-3 py-2">
                        <option value={anoSelecionado - 1}>{anoSelecionado - 1}</option>
                        <option value={anoSelecionado}>{anoSelecionado}</option>
                        <option value={anoSelecionado + 1}>{anoSelecionado + 1}</option>
                    </select>
                    {isManager && (
                        <button onClick={gerarAno} className="rounded-lg bg-primary-dark-9 px-3 py-2 text-sm text-white">
                            Gerar carnê do ano
                        </button>
                    )}
                </div>
            </header>

            <div className="flex items-center gap-3">
                <button onClick={() => setViewMode("mes")} className={`px-3 py-1 rounded-full ${viewMode === "mes" ? "bg-primary-dark-9 text-white" : "border"}`}>
                    Por mês
                </button>
                <button onClick={() => setViewMode("associado")} className={`px-3 py-1 rounded-full ${viewMode === "associado" ? "bg-primary-dark-9 text-white" : "border"}`}>
                    Por associado
                </button>
            </div>

            {viewMode === "mes" && (
                <section>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {MONTH_NAMES.map((name, idx) => {
                            const stat = statsByMonth[idx];
                            const destaque = new Date().getMonth() === idx && new Date().getFullYear() === anoSelecionado;
                            const total = stat.pagos + stat.abertos + stat.atrasados;
                            const pctPago = total === 0 ? 0 : (stat.pagos / total) * 100;
                            const color = pctPago >= 70 ? "bg-green-400" : pctPago >= 40 ? "bg-yellow-400" : "bg-red-400";
                            return (
                                <div key={name} onClick={() => setMesSelecionado(idx + 1)} className={`cursor-pointer rounded-2xl border p-4 ${destaque ? "ring-2 ring-primary-dark-7" : ""}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold">{name}</div>
                                            <div className="text-xs text-gray-500">{anoSelecionado}</div>
                                        </div>
                                        {destaque && <div className="text-xs text-white bg-primary-dark-9 px-2 py-1 rounded">Mês atual</div>}
                                    </div>
                                    <div className="mt-3 text-sm">
                                        <div>Pagos: <strong>{stat.pagos}</strong></div>
                                        <div>Em aberto: <strong>{stat.abertos}</strong></div>
                                        <div>Atrasados: <strong>{stat.atrasados}</strong></div>
                                    </div>
                                    <div className="h-2 rounded-full mt-3 bg-white/10 overflow-hidden">
                                        <div className={`${color} h-2`} style={{ width: `${pctPago}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {mesSelecionado && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Mensalidades de {MONTH_NAMES[mesSelecionado - 1]} / {anoSelecionado}</h3>
                                <div className="flex items-center gap-2">
                                    <input placeholder="Buscar associado" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="rounded border px-3 py-1" />
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="rounded border px-3 py-1">
                                        <option value="ALL">Todos</option>
                                        <option value="ABERTA">Apenas abertos</option>
                                        <option value="ATRASADA">Atrasados</option>
                                        <option value="PAGA">Pagos</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl border p-4">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-sm text-gray-600">
                                            <th className="p-2">Associado</th>
                                            <th className="p-2">Valor</th>
                                            <th className="p-2">Status</th>
                                            <th className="p-2">Vencimento</th>
                                            <th className="p-2">Pagamento</th>
                                            <th className="p-2">Forma</th>
                                            <th className="p-2">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7} className="p-4 text-center">Carregando...</td>
                                            </tr>
                                        ) : mensalidadesDoMes.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-4 text-center">Nenhuma mensalidade neste mês.</td>
                                            </tr>
                                        ) : (
                                            mensalidadesDoMes.map((m) => (
                                                <tr key={m.id} className="border-t">
                                                    <td className="p-2">{(m as any).usuario?.nome || (m as any).usuario?.apelido || `Usuário ${m.usuarioId}`}</td>
                                                    <td className="p-2">R$ {(m.valor || 0).toFixed(2)}</td>
                                                    <td className="p-2">
                                                        <span className={`px-2 py-1 rounded text-xs ${m.status === "PAGA" ? "bg-green-100 text-green-800" : m.status === "ABERTA" ? "bg-yellow-100 text-yellow-800" : m.status === "ATRASADA" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"}`}>
                                                            {m.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-2">{format(new Date(m.vencimento), "dd/MM/yyyy")}</td>
                                                    <td className="p-2">{m.dataPagamento ? format(new Date(m.dataPagamento), "dd/MM/yyyy") : "-"}</td>
                                                    <td className="p-2">{m.formaPagamento || "-"}</td>
                                                    <td className="p-2">
                                                        {m.status !== "PAGA" ? (
                                                            <button onClick={() => abrirModalPagamento(m)} className="rounded-md bg-green-600 px-3 py-1 text-sm text-white">Registrar pagamento</button>
                                                        ) : (
                                                            <button onClick={() => {
                                                                setMensalidadeSelecionada(m);
                                                                setModalOpen(true);
                                                            }} className="rounded-md border px-3 py-1 text-sm">Ver detalhes</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {viewMode === "associado" && (
                <section>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Por associado</h3>
                        <div className="flex items-center gap-2">
                            {isManager && (
                                <select onChange={(e) => setAssociadoSelecionadoId(Number(e.target.value) || null)} className="rounded border px-3 py-1">
                                    <option value="">Selecione um associado</option>
                                    {associados.map((a) => (
                                        <option key={a.id} value={a.id}>{a.nome} {a.apelido ? `(${a.apelido})` : ''}</option>
                                    ))}
                                </select>
                            )}
                            {!isManager && <div className="text-sm">Meu carnê</div>}
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold">Resumo do carnê {associadoSelecionadoId ? '' : ''}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <input placeholder="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="rounded border px-3 py-1" />
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="rounded border px-3 py-1">
                                    <option value="ALL">Todos</option>
                                    <option value="ABERTA">Abertos</option>
                                    <option value="ATRASADA">Atrasados</option>
                                    <option value="PAGA">Pagos</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            {/* resumo simples */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="rounded-lg border p-3">
                                    <div className="text-sm text-gray-500">Total de mensalidades</div>
                                    <div className="font-semibold">{mensalidadesAssociado.length}</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <div className="text-sm text-gray-500">Pagas</div>
                                    <div className="font-semibold">{mensalidadesAssociado.filter(m => m.status === 'PAGA').length}</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <div className="text-sm text-gray-500">Em aberto</div>
                                    <div className="font-semibold">{mensalidadesAssociado.filter(m => m.status === 'ABERTA').length}</div>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <div className="text-sm text-gray-500">Atrasadas</div>
                                    <div className="font-semibold">{mensalidadesAssociado.filter(m => m.status === 'ATRASADA').length}</div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-sm text-gray-600">
                                            <th className="p-2">Mês</th>
                                            <th className="p-2">Vencimento</th>
                                            <th className="p-2">Valor</th>
                                            <th className="p-2">Status</th>
                                            <th className="p-2">Pagamento</th>
                                            <th className="p-2">Forma</th>
                                            <th className="p-2">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan={7} className="p-4 text-center">Carregando...</td></tr>
                                        ) : mensalidadesDoAssociado.length === 0 ? (
                                            <tr><td colSpan={7} className="p-4 text-center">Nenhuma mensalidade encontrada.</td></tr>
                                        ) : (
                                            mensalidadesDoAssociado.map((m) => (
                                                <tr key={m.id} className="border-t">
                                                    <td className="p-2">{MONTH_NAMES[m.mes - 1]}</td>
                                                    <td className="p-2">{format(new Date(m.vencimento), 'dd/MM/yyyy')}</td>
                                                    <td className="p-2">R$ {(m.valor || 0).toFixed(2)}</td>
                                                    <td className="p-2"><span className={`px-2 py-1 rounded text-xs ${m.status === "PAGA" ? "bg-green-100 text-green-800" : m.status === "ABERTA" ? "bg-yellow-100 text-yellow-800" : m.status === "ATRASADA" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"}`}>{m.status}</span></td>
                                                    <td className="p-2">{m.dataPagamento ? format(new Date(m.dataPagamento), 'dd/MM/yyyy') : '-'}</td>
                                                    <td className="p-2">{m.formaPagamento || '-'}</td>
                                                    <td className="p-2">{m.status !== 'PAGA' ? <button onClick={() => abrirModalPagamento(m)} className="rounded-md bg-green-600 px-3 py-1 text-sm text-white">Registrar pagamento</button> : <button onClick={() => { setMensalidadeSelecionada(m); setModalOpen(true); }} className="rounded-md border px-3 py-1 text-sm">Ver</button>}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
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
                                    <div>R$ {(mensalidadeSelecionada.valor || 0).toFixed(2)}</div>
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
    const [comprovanteUrl, setComprovanteUrl] = useState<string>(mensalidade.comprovanteUrl || "");
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

            <div>
                <label className="block text-sm text-gray-600">URL do comprovante</label>
                <input value={comprovanteUrl} onChange={(e) => setComprovanteUrl(e.target.value)} placeholder="https://..." className={inputClass} />
            </div>

            <div>
                <label className="block text-sm text-gray-600">Observações</label>
                <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className={textareaClass} rows={3} />
            </div>

            <div className="flex items-center justify-end gap-2">
                <button onClick={onCancel} className={`rounded border px-3 py-2 ${isDark ? 'border-white/10 text-white' : ''}`}>Cancelar</button>
                <button onClick={() => onSave({ dataPagamento, formaPagamento, comprovanteUrl: comprovanteUrl || undefined, observacoes: observacoes || undefined })} disabled={loading} className="rounded bg-primary-dark-9 px-3 py-2 text-white">{loading ? 'Salvando...' : 'Salvar'}</button>
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

