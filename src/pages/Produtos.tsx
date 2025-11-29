import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import ProdutoFilters from "../components/produtos/ProdutoFilters";
import ProdutoCard from "../components/produtos/ProdutoCard";
import ProdutoList from "../components/produtos/ProdutoList";
import ProdutoForm from "../components/produtos/ProdutoForm";
import ProdutoDetailsDrawer from "../components/produtos/ProdutoDetailsDrawer";
import ProdutoEmpty from "../components/produtos/ProdutoEmpty";
import ConfirmModal from "../components/common/ConfirmModal";
import { listProdutos, createProduto, updateProduto, deleteProduto, type Produto } from "../lib/produto";
import { listCategorias, type Categoria } from "../lib/categoria";

export default function ProdutosPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | "ativos" | "inativos">("todos");
    const [categoriaFilter, setCategoriaFilter] = useState<number | null>(null);
    const [ordenacao, setOrdenacao] = useState<"nome" | "preco" | "estoque">("nome");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProdutoId, setSelectedProdutoId] = useState<number | null>(null);
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; produtoId: number | null }>({
        isOpen: false,
        produtoId: null,
    });

    // Load produtos and categorias on mount
    useEffect(() => {
        loadData();
    }, []);

    // Load dados from API
    const loadData = async () => {
        try {
            setIsInitialLoading(true);
            const [produtosData, categoriasData] = await Promise.all([
                listProdutos(),
                listCategorias(),
            ]);
            setProdutos(produtosData);
            setCategorias(categoriasData);
        } catch (error: any) {
            toast.error(error.message || "Erro ao carregar dados");
            console.error("Erro ao carregar dados:", error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    // Filtered and sorted produtos
    const filteredProdutos = useMemo(() => {
        let result = produtos.filter((produto) => {
            // Search filter
            const matchesSearch =
                produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const matchesStatus =
                statusFilter === "todos" ||
                (statusFilter === "ativos" && produto.ativo) ||
                (statusFilter === "inativos" && !produto.ativo);

            // Category filter
            const matchesCategoria =
                !categoriaFilter || produto.categoriaId === categoriaFilter;

            return matchesSearch && matchesStatus && matchesCategoria;
        });

        // Sorting
        result = result.sort((a, b) => {
            switch (ordenacao) {
                case "nome":
                    return a.nome.localeCompare(b.nome);
                case "preco":
                    return Number(a.precoVenda) - Number(b.precoVenda);
                case "estoque":
                    return b.estoque - a.estoque;
                default:
                    return 0;
            }
        });

        return result;
    }, [produtos, searchTerm, statusFilter, categoriaFilter, ordenacao]);

    // Selected produto for drawer
    const selectedProduto = useMemo(
        () => produtos.find((p) => p.id === selectedProdutoId) || null,
        [produtos, selectedProdutoId]
    );

    // Handle create
    const handleCreateProduto = useCallback(() => {
        setEditingProduto(null);
        setIsFormOpen(true);
    }, []);

    // Handle edit
    const handleEditProduto = useCallback((id: number) => {
        const produto = produtos.find((p) => p.id === id);
        if (produto) {
            setEditingProduto(produto);
            setIsFormOpen(true);
        }
    }, [produtos]);

    // Handle save (create/update)
    const handleSaveProduto = useCallback(
        async (data: any) => {
            setIsLoading(true);
            try {
                if (editingProduto) {
                    // Update existing
                    const updatedProduto = await updateProduto(editingProduto.id, {
                        nome: data.nome,
                        descricao: data.descricao,
                        precoVenda: data.precoVenda,
                        precoCompra: data.precoCompra,
                        precoPromocional: data.precoPromocional,
                        estoque: data.estoque,
                        categoriaId: data.categoriaId,
                    }, data.file);

                    setProdutos((prev) =>
                        prev.map((p) => (p.id === editingProduto.id ? updatedProduto : p))
                    );

                    toast.success("✅ Produto atualizado com sucesso!");
                    console.log("✅ Produto atualizado:", editingProduto.id);
                } else {
                    // Create new
                    const newProduto = await createProduto(
                        {
                            nome: data.nome,
                            descricao: data.descricao,
                            precoVenda: data.precoVenda,
                            precoCompra: data.precoCompra,
                            precoPromocional: data.precoPromocional,
                            estoque: data.estoque,
                            categoriaId: data.categoriaId,
                            ativo: data.ativo,
                        },
                        data.file
                    );

                    setProdutos((prev) => [...prev, newProduto]);
                    toast.success("✅ Produto criado com sucesso!");
                    console.log("✅ Produto criado:", newProduto.id);
                }

                setIsFormOpen(false);
                setEditingProduto(null);
            } catch (error: any) {
                toast.error(error.message || "Erro ao salvar produto");
                console.error("❌ Erro ao salvar produto:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [editingProduto]
    );

    // Handle delete
    const handleDeleteProduto = useCallback((id: number) => {
        setConfirmDelete({ isOpen: true, produtoId: id });
    }, []);

    // Handle confirm delete
    const handleConfirmDelete = useCallback(async () => {
        if (confirmDelete.produtoId !== null) {
            setIsLoading(true);
            try {
                await deleteProduto(confirmDelete.produtoId);
                setProdutos((prev) => prev.filter((p) => p.id !== confirmDelete.produtoId));
                toast.success("✅ Produto excluído com sucesso!");
                console.log("✅ Produto excluído:", confirmDelete.produtoId);
                setConfirmDelete({ isOpen: false, produtoId: null });
            } catch (error: any) {
                toast.error(error.message || "Erro ao excluir produto");
                console.error("❌ Erro ao excluir produto:", error);
                setConfirmDelete({ isOpen: false, produtoId: null });
            } finally {
                setIsLoading(false);
            }
        }
    }, [confirmDelete.produtoId]);

    // Handle details
    const handleDetailsProduto = useCallback((id: number) => {
        setSelectedProdutoId(id);
        setIsDrawerOpen(true);
    }, []);

    // Handle refresh
    const handleRefresh = async () => {
        await loadData();
        setSearchTerm("");
        setStatusFilter("todos");
        setCategoriaFilter(null);
        setOrdenacao("nome");
        toast.success("✅ Produtos recarregados!");
    };

    // Loading state
    if (isInitialLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-spin opacity-20"></div>
                            <div className="absolute inset-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse opacity-40"></div>
                            <div className="absolute inset-4 dark:bg-[#13081a] bg-white rounded-full"></div>
                        </div>
                    </div>
                    <p className="text-white/60 dark:text-white/60">Carregando produtos...</p>
                </div>
            </div>
        );
    }

    // Mostrar formulário em tela cheia quando estiver aberto
    if (isFormOpen) {
        return (
            <div className="min-h-screen p-2 lg:p-8">
                <ProdutoForm
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingProduto(null);
                    }}
                    onSave={handleSaveProduto}
                    initialData={editingProduto as any}
                    isLoading={isLoading}
                    categorias={categorias.map((cat) => ({
                        id: cat.id,
                        nome: cat.nome,
                    }))}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-2 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white lg:text-4xl">Produtos</h1>
                    <p className="mt-2 text-white/60">
                        {filteredProdutos.length} produto{filteredProdutos.length !== 1 ? "s" : ""}{" "}
                        encontrado{filteredProdutos.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="flex w-full gap-3 sm:w-auto">
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 font-semibold text-white/70 transition-all duration-300 hover:bg-white/5 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">Recarregar</span>
                    </button>
                    <button
                        onClick={handleCreateProduto}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Novo Produto</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8">
                <ProdutoFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    categoriaFilter={categoriaFilter}
                    onCategoriaChange={setCategoriaFilter}
                    ordenacao={ordenacao}
                    onOrdenacaoChange={setOrdenacao}
                    categorias={categorias.map((cat) => ({
                        id: cat.id,
                        nome: cat.nome,
                    }))}
                />
            </div>

            {/* Content */}
            {filteredProdutos.length === 0 ? (
                <ProdutoEmpty onCreateClick={handleCreateProduto} />
            ) : (
                <>
                    {/* Grid (Mobile/Tablet) */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:hidden">
                        {filteredProdutos.map((produto) => (
                            <ProdutoCard
                                key={produto.id}
                                produto={produto as any}
                                onEdit={() => handleEditProduto(produto.id)}
                                onDelete={() => handleDeleteProduto(produto.id)}
                                onDetails={() => handleDetailsProduto(produto.id)}
                            />
                        ))}
                    </div>

                    {/* Table (Desktop) */}
                    <ProdutoList
                        produtos={filteredProdutos as any}
                        onEdit={handleEditProduto}
                        onDelete={handleDeleteProduto}
                        onDetails={handleDetailsProduto}
                    />
                </>
            )}

            {/* Drawer */}
            <ProdutoDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                produto={selectedProduto as any}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Excluir Produto"
                message="Tem certeza que deseja excluir esse produto? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                isDangerous={true}
                isLoading={isLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ isOpen: false, produtoId: null })}
            />
        </div>
    );
}
