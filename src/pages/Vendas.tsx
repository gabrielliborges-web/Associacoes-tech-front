import { useState, useMemo, useCallback, useEffect } from "react";
import { TrendingUp, Plus, RefreshCw, Calendar, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { listVendas, createVenda, cancelVenda } from "../lib/venda";
import NovaVendaForm from "../components/vendas/NovaVendaForm";
import VendaDetailsDrawer from "../components/vendas/VendaDetailsDrawer";
import type { Venda as VendaAPI } from "../lib/venda";

type PeriodoFiltro = "hoje" | "semana" | "mes" | "todos";

interface Venda {
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

function transformVendaAPIToMock(venda: VendaAPI): Venda {
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

export default function Vendas() {
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedVendaId, setSelectedVendaId] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroFormaPagamento, setFiltroFormaPagamento] = useState<string>("");
    const [filtroPeriodo, setFiltroPeriodo] = useState<PeriodoFiltro>("todos");

    // Load vendas on mount
    useEffect(() => {
        loadVendas();
    }, []);

    // Load vendas from API
    const loadVendas = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await listVendas();
            const vendasTransformadas = (data as any as VendaAPI[]).map(transformVendaAPIToMock);
            setVendas(vendasTransformadas);
        } catch (error: any) {
            toast.error(error.message || "Erro ao carregar vendas");
            setVendas([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Filter logic
    const filteredVendas = useMemo(() => {
        let result = [...vendas];

        // Search by ID or text
        if (searchTerm) {
            result = result.filter(
                (v) =>
                    v.id.toString().includes(searchTerm) ||
                    v.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by payment method
        if (filtroFormaPagamento) {
            result = result.filter((v) => v.formaPagamento === filtroFormaPagamento);
        }

        // Filter by period
        if (filtroPeriodo !== "todos") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            result = result.filter((v) => {
                const vendaDate = new Date(v.data);

                if (filtroPeriodo === "hoje") {
                    return vendaDate.toDateString() === today.toDateString();
                } else if (filtroPeriodo === "semana") {
                    const oneWeekAgo = new Date(today);
                    oneWeekAgo.setDate(today.getDate() - 7);
                    return vendaDate >= oneWeekAgo && vendaDate <= today;
                } else if (filtroPeriodo === "mes") {
                    const oneMonthAgo = new Date(today);
                    oneMonthAgo.setMonth(today.getMonth() - 1);
                    return vendaDate >= oneMonthAgo && vendaDate <= today;
                }
                return true;
            });
        }

        // Sort by date descending
        result.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        return result;
    }, [vendas, searchTerm, filtroFormaPagamento, filtroPeriodo]);

    const handleRefresh = useCallback(async () => {
        await loadVendas();
        toast.success("Vendas recarregadas!");
    }, [loadVendas]);

    const handleCancelVenda = useCallback(
        async (id: number) => {
            setIsSaving(true);
            try {
                await cancelVenda(id);
                toast.success("Venda cancelada com sucesso!");
                await loadVendas();
            } catch (error: any) {
                toast.error(error.message || "Erro ao cancelar venda");
            } finally {
                setIsSaving(false);
            }
        },
        [loadVendas]
    );

    const handleNovaVenda = useCallback(
        async (data: {
            formaPagamento: string;
            descricao: string;
            itens: Array<{
                produtoId: number;
                quantidade: number;
                precoUnit: number;
            }>;
        }) => {
            setIsSaving(true);
            try {
                await createVenda({
                    formaPagamento: data.formaPagamento,
                    descricao: data.descricao || null,
                    data: new Date().toISOString(),
                    itens: data.itens,
                });
                toast.success("Venda criada com sucesso!");
                setIsFormOpen(false);
                await loadVendas();
            } catch (error: any) {
                toast.error(error.message || "Erro ao criar venda");
            } finally {
                setIsSaving(false);
            }
        },
        [loadVendas]
    );

    const totalVendas = filteredVendas.length;
    const totalValor = filteredVendas.reduce((sum, v) => sum + v.total, 0);

    // Mostrar formulário em tela cheia quando estiver aberto
    if (isFormOpen) {
        return (
            <div className="min-h-screen p-2 lg:p-8">
                <NovaVendaForm
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleNovaVenda}
                    isLoading={isSaving}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-2 lg:p-8">
            {/* Loading Spinner */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="text-center">
                        <Loader className="h-12 w-12 animate-spin text-green-400 mx-auto mb-4" />
                        <p className="text-white font-semibold">Carregando vendas...</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/20 p-2.5">
                            <TrendingUp className="h-6 w-6 text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white lg:text-4xl">Vendas</h1>
                    </div>
                    <p className="mt-2 text-white/60">Gerencie e registre suas vendas</p>
                </div>
                <div className="flex w-full gap-3 sm:w-auto">
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">Atualizar</span>
                    </button>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Nova Venda</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-sm">
                    <p className="text-sm font-medium text-white/70">Total de Vendas</p>
                    <p className="text-3xl font-bold text-white">{totalVendas}</p>
                    <p className="mt-2 text-xs text-white/50">neste período</p>
                </div>

                <div className="rounded-2xl border border-green-600/30 bg-gradient-to-br from-green-600/10 to-green-700/5 p-4 backdrop-blur-sm">
                    <p className="text-sm font-medium text-white/70">Total Arrecadado</p>
                    <p className="text-3xl font-bold text-green-400">R$ {totalValor.toFixed(2)}</p>
                    <p className="mt-2 text-xs text-white/50">período selecionado</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="grid gap-3 sm:grid-cols-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Buscar por ID ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/50 transition-colors focus:border-green-600 focus:bg-white/10 focus:outline-none"
                    />

                    {/* Payment Method Filter */}
                    <select
                        value={filtroFormaPagamento}
                        onChange={(e) => setFiltroFormaPagamento(e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white transition-colors focus:border-green-600 focus:bg-white/10 focus:outline-none"
                    >
                        <option value="">Todas as formas</option>
                        <option value="dinheiro">💵 Dinheiro</option>
                        <option value="pix">📱 Pix</option>
                        <option value="débito">🏧 Débito</option>
                        <option value="crédito">💳 Crédito</option>
                        <option value="fiado">📝 Fiado</option>
                    </select>

                    {/* Period Filter */}
                    <select
                        value={filtroPeriodo}
                        onChange={(e) => setFiltroPeriodo(e.target.value as PeriodoFiltro)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white transition-colors focus:border-green-600 focus:bg-white/10 focus:outline-none"
                    >
                        <option value="todos">📅 Todos os períodos</option>
                        <option value="hoje">Hoje</option>
                        <option value="semana">Última semana</option>
                        <option value="mes">Último mês</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {filteredVendas.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
                    <div className="rounded-full bg-white/10 p-4">
                        <Calendar className="h-8 w-8 text-white/40" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Nenhuma venda encontrada</h3>
                        <p className="mt-1 text-sm text-white/60">Tente ajustar seus filtros</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Grid view (Mobile) */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
                        {filteredVendas.map((venda) => (
                            <div
                                key={venda.id}
                                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-white/60">Forma de Pagamento</p>
                                        <p className="font-semibold text-white">{venda.formaPagamento}</p>
                                    </div>
                                    <p className="text-right">
                                        <p className="text-xs text-white/60">Total</p>
                                        <p className="font-bold text-green-400">R$ {venda.total.toFixed(2)}</p>
                                    </p>
                                </div>
                                <div className="mb-3 space-y-1 text-sm">
                                    <p className="text-white/80">
                                        <span className="text-white/60">Data:</span>{" "}
                                        {new Date(venda.data).toLocaleDateString("pt-BR")}
                                    </p>
                                    <p className="text-white/80">
                                        <span className="text-white/60">Usuário:</span> {venda.usuarioNome}
                                    </p>
                                    <p className="text-white/80">
                                        <span className="text-white/60">Itens:</span> {venda.itens.length}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedVendaId(venda.id);
                                            setIsDrawerOpen(true);
                                        }}
                                        className="flex-1 rounded-lg bg-green-600/20 py-2 text-sm font-semibold text-green-400 transition-all duration-300 hover:bg-green-600/30"
                                    >
                                        Detalhes
                                    </button>
                                    <button
                                        onClick={() => handleCancelVenda(venda.id)}
                                        disabled={isSaving}
                                        className="flex-1 rounded-lg bg-red-500/20 py-2 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/30 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table view (Desktop) */}
                    <div className="hidden lg:block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">
                                        Forma de Pagamento
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Data</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Total</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Itens</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">
                                        Usuário
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-white/70">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVendas.map((venda) => (
                                    <tr key={venda.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-6 py-4 text-sm text-white">{venda.id}</td>
                                        <td className="px-6 py-4 text-sm text-white">{venda.formaPagamento}</td>
                                        <td className="px-6 py-4 text-sm text-white/80">
                                            {new Date(venda.data).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-green-400">
                                            R$ {venda.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white">{venda.itens.length}</td>
                                        <td className="px-6 py-4 text-sm text-white">{venda.usuarioNome}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedVendaId(venda.id);
                                                        setIsDrawerOpen(true);
                                                    }}
                                                    className="rounded px-3 py-1 text-xs font-semibold text-green-400 hover:bg-green-600/20"
                                                >
                                                    Detalhes
                                                </button>
                                                <button
                                                    onClick={() => handleCancelVenda(venda.id)}
                                                    disabled={isSaving}
                                                    className="rounded px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Drawer Detalhes */}
            <VendaDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                vendaId={selectedVendaId}
            />
        </div>
    );
}
