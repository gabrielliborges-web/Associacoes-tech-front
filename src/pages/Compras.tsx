import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, RefreshCw, ShoppingCart, Loader, Package } from "lucide-react";
import toast from "react-hot-toast";
import ComprasFilters from "../components/compras/ComprasFilters";
import ComprasTable from "../components/compras/ComprasTable";
import CompraDetailsDrawer from "../components/compras/CompraDetailsDrawer";
import NovaCompraForm from "../components/compras/NovaCompraForm";
import ConfirmModal from "../components/common/ConfirmModal";
import { listCompras, deleteCompra, createCompra } from "../lib/compra";
import type { CompraMock } from "../mocks/comprasMock";

interface CompraAPI {
    id: number;
    fornecedor: string | null;
    data: string;
    total: number;
    observacao: string | null;
    usuarioId: number;
    usuario: {
        id: number;
        nome: string;
        email: string;
    };
    itens: Array<{
        id: number;
        quantidade: number;
        custoUnit: number;
        produtoId: number;
        produto: {
            id: number;
            nome: string;
            descricao: string;
        };
    }>;
    criadoEm: string;
}

function transformCompraAPIToMock(compra: CompraAPI): CompraMock {
    return {
        id: compra.id,
        fornecedor: compra.fornecedor || "-",
        data: compra.data,
        total: typeof compra.total === 'string' ? parseFloat(compra.total) : compra.total,
        descricao: compra.observacao || undefined,
        usuarioNome: compra.usuario?.nome || "Desconhecido",
        itens: compra.itens.map((item) => ({
            id: item.id,
            produtoId: item.produtoId,
            produtoNome: item.produto.nome,
            quantidade: item.quantidade,
            custoUnit: typeof item.custoUnit === 'string' ? parseFloat(item.custoUnit) : item.custoUnit,
            total: (typeof item.quantidade === 'string' ? parseFloat(item.quantidade) : item.quantidade) * (typeof item.custoUnit === 'string' ? parseFloat(item.custoUnit) : item.custoUnit),
        })),
    };
}

export default function Compras() {
    const [compras, setCompras] = useState<CompraMock[]>([]);
    const [filtroFornecedor, setFiltroFornecedor] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCompraId, setSelectedCompraId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{
        isOpen: boolean;
        compraId: number | null;
    }>({
        isOpen: false,
        compraId: null,
    });

    // Load compras from API
    const loadCompras = useCallback(async () => {
        setIsLoading(true);
        try {
            const filtros = {
                ...(dataInicio && { dataInicio: new Date(dataInicio).toISOString() }),
                ...(dataFim && { dataFim: new Date(dataFim).toISOString() }),
                ...(filtroFornecedor && { fornecedor: filtroFornecedor }),
            };
            const data = await listCompras(filtros);
            const comprasTransformadas = (data as any as CompraAPI[]).map(transformCompraAPIToMock);
            setCompras(comprasTransformadas);
        } catch (error: any) {
            toast.error(error.message || "Erro ao carregar compras");
            setCompras([]);
        } finally {
            setIsLoading(false);
        }
    }, [dataInicio, dataFim, filtroFornecedor]);

    // Carregar compras quando monta ou quando filtros mudam
    useEffect(() => {
        loadCompras();
    }, [loadCompras]);

    // Usar compras já filtradas pelo servidor
    const filteredCompras = compras;

    // Selected compra for drawer
    const selectedCompra = useMemo(
        () => compras.find((c) => c.id === selectedCompraId) || null,
        [compras, selectedCompraId]
    );

    // Handle nova compra
    const handleNovaCompra = useCallback(() => {
        setIsFormOpen(true);
    }, []);

    // Handle salvar nova compra
    const handleSalvarCompra = useCallback(
        async (novaCompra: Omit<CompraMock, "id">) => {
            setIsSaving(true);
            try {
                const payload = {
                    fornecedor: novaCompra.fornecedor === "-" ? null : novaCompra.fornecedor,
                    data: new Date(novaCompra.data).toISOString(),
                    descricao: novaCompra.descricao || null,
                    itens: novaCompra.itens.map((item) => ({
                        produtoId: item.produtoId,
                        quantidade: item.quantidade,
                        custoUnit: item.custoUnit,
                    })),
                };

                await createCompra(payload);
                toast.success("Compra criada com sucesso!");
                setIsFormOpen(false);
                await loadCompras();
            } catch (error: any) {
                toast.error(error.message || "Erro ao criar compra");
            } finally {
                setIsSaving(false);
            }
        },
        [loadCompras]
    );

    // Handle detalhes
    const handleDetalhes = useCallback((id: number) => {
        setSelectedCompraId(id);
        setIsDrawerOpen(true);
    }, []);

    // Handle delete
    const handleDelete = useCallback((id: number) => {
        setConfirmDelete({ isOpen: true, compraId: id });
    }, []);

    // Handle confirm delete
    const handleConfirmDelete = useCallback(async () => {
        if (confirmDelete.compraId !== null) {
            setIsSaving(true);
            try {
                await deleteCompra(confirmDelete.compraId);
                toast.success("Compra excluída com sucesso!");
                setConfirmDelete({ isOpen: false, compraId: null });
                await loadCompras();
            } catch (error: any) {
                toast.error(error.message || "Erro ao excluir compra");
            } finally {
                setIsSaving(false);
            }
        }
    }, [confirmDelete.compraId, loadCompras]);

    // Handle refresh
    const handleRefresh = useCallback(async () => {
        setFiltroFornecedor("");
        setDataInicio("");
        setDataFim("");
        await loadCompras();
        toast.success("Compras recarregadas!");
    }, [loadCompras]);

    // Handle limpar filtros
    const handleLimparFiltros = useCallback(() => {
        setFiltroFornecedor("");
        setDataInicio("");
        setDataFim("");
    }, []);

    // Calculate KPIs
    const totalComprasCount = filteredCompras.length;
    const totalValor = filteredCompras.reduce((sum, c) => sum + c.total, 0);

    // Mostrar formulário em tela cheia quando estiver aberto
    if (isFormOpen) {
        return (
            <div className="min-h-screen p-2 lg:p-8">
                <NovaCompraForm
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSalvarCompra}
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
                        <Loader className="h-12 w-12 animate-spin text-primary-400 mx-auto mb-4" />
                        <p className="text-white font-semibold">Carregando compras...</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-primary-500/30 to-primary-600/20 p-2.5">
                            <Package className="h-6 w-6 text-primary-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white lg:text-4xl">Compras</h1>
                    </div>
                    <p className="mt-2 text-white/60">Gerencie suas compras e estoque</p>
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
                        onClick={handleNovaCompra}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Nova Compra</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-sm">
                    <p className="text-sm font-medium text-white/70">Total de Compras</p>
                    <p className="text-3xl font-bold text-white">{totalComprasCount}</p>
                    <p className="mt-2 text-xs text-white/50">neste período</p>
                </div>

                <div className="rounded-2xl border border-primary-600/30 bg-gradient-to-br from-primary-600/10 to-primary-700/5 p-4 backdrop-blur-sm">
                    <p className="text-sm font-medium text-white/70">Total Investido</p>
                    <p className="text-3xl font-bold text-primary-400">
                        R$ {totalValor.toFixed(2)}
                    </p>
                    <p className="mt-2 text-xs text-white/50">período selecionado</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="mb-8">
                <ComprasFilters
                    fornecedor={filtroFornecedor}
                    onFornecedorChange={setFiltroFornecedor}
                    dataInicio={dataInicio}
                    onDataInicioChange={setDataInicio}
                    dataFim={dataFim}
                    onDataFimChange={setDataFim}
                    onLimparFiltros={handleLimparFiltros}
                />
            </div>

            {/* Conteúdo */}
            {filteredCompras.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
                    <div className="mx-auto mb-4 inline-flex rounded-full bg-primary-500/20 p-4">
                        <ShoppingCart className="h-8 w-8 text-primary-400" />
                    </div>
                    <p className="text-lg font-semibold text-white">Nenhuma compra encontrada</p>
                    <p className="mt-2 text-white/60">
                        Tente ajustar os filtros ou adicionar uma nova compra
                    </p>
                    <button
                        onClick={handleNovaCompra}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                        <Plus className="h-4 w-4" />
                        Nova Compra
                    </button>
                </div>
            ) : (
                <>
                    {/* Grid Mobile */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:hidden">
                        {filteredCompras.map((compra) => (
                            <div
                                key={compra.id}
                                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-white/60">Fornecedor</p>
                                        <p className="font-semibold text-white">{compra.fornecedor || "-"}</p>
                                    </div>
                                    <p className="text-right">
                                        <p className="text-xs text-white/60">Total</p>
                                        <p className="font-bold text-primary-400">
                                            R$ {compra.total.toFixed(2)}
                                        </p>
                                    </p>
                                </div>
                                <div className="mb-3 space-y-1 text-sm">
                                    <p className="text-white/80">
                                        <span className="text-white/60">Data:</span> {new Date(compra.data).toLocaleDateString("pt-BR")}
                                    </p>
                                    <p className="text-white/80">
                                        <span className="text-white/60">Usuário:</span> {compra.usuarioNome}
                                    </p>
                                    <p className="text-white/80">
                                        <span className="text-white/60">Itens:</span> {compra.itens.length}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDetalhes(compra.id)}
                                        className="flex-1 rounded-lg bg-primary-600/20 py-2 text-sm font-semibold text-primary-400 transition-all duration-300 hover:bg-primary-600/30"
                                    >
                                        Detalhes
                                    </button>
                                    <button
                                        onClick={() => handleDelete(compra.id)}
                                        className="flex-1 rounded-lg bg-red-500/20 py-2 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/30"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabela Desktop */}
                    <ComprasTable
                        compras={filteredCompras}
                        onDetails={handleDetalhes}
                        onDelete={handleDelete}
                    />
                </>
            )}

            {/* Drawer Detalhes */}
            <CompraDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                compra={selectedCompra}
            />

            {/* Modal Confirmação Delete */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Excluir Compra"
                message="Tem certeza que deseja excluir essa compra? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                isDangerous={true}
                isLoading={isSaving}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, compraId: null })}
            />
        </div>
    );
}
