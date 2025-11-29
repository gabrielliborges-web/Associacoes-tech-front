import { useState, useMemo, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import CategoriaFilters from "../components/categorias/CategoriaFilters";
import CategoriaCard from "../components/categorias/CategoriaCard";
import CategoriaTable from "../components/categorias/CategoriaTable";
import CategoriaForm from "../components/categorias/CategoriaForm";
import CategoriaDrawer from "../components/categorias/CategoriaDrawer";
import CategoriaEmptyState from "../components/categorias/CategoriaEmptyState";
import ConfirmModal from "../components/common/ConfirmModal";
import { listCategorias, createCategoria, updateCategoria, deleteCategoria, type Categoria } from "../lib/categoria";

export default function Categorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"todos" | "ativas" | "inativas">("todos");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; categoriaId: number | null; isMultiple?: boolean }>({
        isOpen: false,
        categoriaId: null,
        isMultiple: false,
    });

    useEffect(() => {
        loadCategorias();
    }, []);

    const loadCategorias = async () => {
        try {
            setIsInitialLoading(true);
            const data = await listCategorias();
            setCategorias(data);
        } catch (error: any) {
            toast.error(error.message || "Erro ao carregar categorias");
            console.error("Erro ao carregar categorias:", error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    const filteredCategorias = useMemo(() => {
        return categorias.filter((categoria) => {
            const matchesSearch =
                categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                categoria.descricao?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "todos" ||
                (statusFilter === "ativas" && categoria.ativo) ||
                (statusFilter === "inativas" && !categoria.ativo);

            return matchesSearch && matchesStatus;
        });
    }, [categorias, searchTerm, statusFilter]);

    const selectedCategoria = useMemo(
        () => categorias.find((c) => c.id === selectedCategoriaId) || null,
        [categorias, selectedCategoriaId]
    );

    const handleCreateCategoria = () => {
        setEditingCategoria(null);
        setIsFormOpen(true);
    };

    const handleEditCategoria = (id: number) => {
        const categoria = categorias.find((c) => c.id === id);
        if (categoria) {
            setEditingCategoria(categoria);
            setIsFormOpen(true);
        }
    };

    const handleSaveCategoria = async (data: any) => {
        setIsLoading(true);
        try {
            if (editingCategoria) {
                const updatedCategoria = await updateCategoria(editingCategoria.id, {
                    nome: data.nome,
                    descricao: data.descricao,
                    ativo: data.ativo,
                });

                setCategorias((prev) =>
                    prev.map((c) =>
                        c.id === editingCategoria.id ? updatedCategoria : c
                    )
                );

                toast.success("✅ Categoria atualizada com sucesso!");
                console.log("✅ Categoria atualizada:", editingCategoria.id);
            } else {
                const newCategoria = await createCategoria({
                    nome: data.nome,
                    descricao: data.descricao,
                    ativo: data.ativo,
                });

                setCategorias((prev) => [...prev, newCategoria]);
                toast.success("✅ Categoria criada com sucesso!");
                console.log("✅ Categoria criada:", newCategoria.id);
            }

            setIsFormOpen(false);
            setEditingCategoria(null);
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar categoria");
            console.error("❌ Erro ao salvar categoria:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategoria = (id: number) => {
        setConfirmDelete({ isOpen: true, categoriaId: id });
    };



    const handleDetailsCategoria = (id: number) => {
        setSelectedCategoriaId(id);
        setIsDrawerOpen(true);
    };

    const handleRefresh = async () => {
        await loadCategorias();
        toast.success("✅ Categorias recarregadas!");
    };

    const handleSelectAll = () => {
        if (selectedIds.size === filteredCategorias.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredCategorias.map((c) => c.id)));
        }
    };

    const handleSelectSingle = (id: number) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleDeleteMultiple = () => {
        setConfirmDelete({ isOpen: true, categoriaId: null, isMultiple: true });
    };

    const handleClearSelection = () => {
        setSelectedIds(new Set());
    };

    const handleConfirmDeleteUpdated = async () => {
        if (confirmDelete.isMultiple && selectedIds.size > 0) {
            setIsLoading(true);
            try {
                let successCount = 0;
                let errorCount = 0;

                for (const id of selectedIds) {
                    try {
                        await deleteCategoria(id);
                        successCount++;
                    } catch (error) {
                        errorCount++;
                    }
                }

                setCategorias((prev) => prev.filter((c) => !selectedIds.has(c.id)));
                setSelectedIds(new Set());

                if (errorCount === 0) {
                    toast.success(`✅ ${successCount} categoria(s) excluída(s) com sucesso!`);
                } else {
                    toast.error(`❌ ${successCount} excluída(s), ${errorCount} erro(s)`);
                }
                console.log(`✅ Deletadas ${successCount} categorias`);
                setConfirmDelete({ isOpen: false, categoriaId: null, isMultiple: false });
            } catch (error: any) {
                toast.error(error.message || "Erro ao excluir categorias");
                console.error("❌ Erro ao excluir categorias:", error);
                setConfirmDelete({ isOpen: false, categoriaId: null, isMultiple: false });
            } finally {
                setIsLoading(false);
            }
        } else if (confirmDelete.categoriaId !== null && !confirmDelete.isMultiple) {
            setIsLoading(true);
            try {
                await deleteCategoria(confirmDelete.categoriaId);
                setCategorias((prev) => prev.filter((c) => c.id !== confirmDelete.categoriaId));
                toast.success("✅ Categoria excluída com sucesso!");
                console.log("✅ Categoria excluída:", confirmDelete.categoriaId);
                setConfirmDelete({ isOpen: false, categoriaId: null, isMultiple: false });
            } catch (error: any) {
                toast.error(error.message || "Erro ao excluir categoria");
                console.error("❌ Erro ao excluir categoria:", error);
                setConfirmDelete({ isOpen: false, categoriaId: null, isMultiple: false });
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full animate-spin opacity-20"></div>
                            <div className="absolute inset-2 bg-gradient-to-r from-rose-400 to-rose-500 rounded-full animate-pulse opacity-40"></div>
                            <div className="absolute inset-4 dark:bg-[#13081a] bg-white rounded-full"></div>
                        </div>
                    </div>
                    <p className="text-white/60 dark:text-white/60">Carregando categorias...</p>
                </div>
            </div>
        );
    }

    // Mostrar formulário em tela cheia quando estiver aberto
    if (isFormOpen) {
        return (
            <div className="w-full h-auto p-4 sm:p-6 lg:p-8">
                <CategoriaForm
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingCategoria(null);
                    }}
                    onSave={handleSaveCategoria}
                    initialData={editingCategoria ? {
                        ...editingCategoria,
                        produtosCount: 0
                    } as any : undefined}
                    isLoading={isLoading}
                />
            </div>
        );
    }

    return (
        <div className="w-full h-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white break-words">Categorias</h1>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/60">
                        {filteredCategorias.length} categoria{filteredCategorias.length !== 1 ? "s" : ""}{" "}
                        encontrada{filteredCategorias.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="flex w-full sm:w-auto gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-1 sm:gap-2 rounded-lg sm:rounded-xl border border-white/10 px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white/70 transition-all duration-300 hover:bg-white/5 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className="h-3 sm:h-4 w-3 sm:w-4" />
                        <span className="hidden sm:inline">Recarregar</span>
                    </button>
                    <button
                        onClick={handleCreateCategoria}
                        disabled={isLoading}
                        className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-1 sm:gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="h-3 sm:h-4 w-3 sm:w-4" />
                        <span className="hidden sm:inline">Nova Categoria</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div>
                <CategoriaFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={(value: string) =>
                        setStatusFilter(value as "todos" | "ativas" | "inativas")
                    }
                />
            </div>

            {/* Content */}
            {filteredCategorias.length === 0 ? (
                <CategoriaEmptyState onCreateClick={handleCreateCategoria} />
            ) : (
                <>
                    {/* Grid (Mobile/Tablet) */}
                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:hidden auto-rows-max">
                        {filteredCategorias.map((categoria) => (
                            <CategoriaCard
                                key={categoria.id}
                                categoria={{
                                    ...categoria,
                                } as any}
                                onEdit={() => handleEditCategoria(categoria.id)}
                                onDelete={() => handleDeleteCategoria(categoria.id)}
                                onDetails={() => handleDetailsCategoria(categoria.id)}
                            />
                        ))}
                    </div>

                    {/* Table (Desktop) */}
                    <div className="w-full overflow-x-auto">
                        <CategoriaTable
                            categorias={filteredCategorias.map(cat => ({
                                ...cat,
                            } as any))}
                            onEdit={handleEditCategoria}
                            onDelete={handleDeleteCategoria}
                            onDetails={handleDetailsCategoria}
                            selectedIds={selectedIds}
                            onSelectAll={handleSelectAll}
                            onSelectSingle={handleSelectSingle}
                            onDeleteMultiple={handleDeleteMultiple}
                            onClearSelection={handleClearSelection}
                        />
                    </div>
                </>
            )}

            {/* Drawer */}
            <CategoriaDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                categoria={selectedCategoria ? {
                    ...selectedCategoria,
                    produtosCount: 0
                } as any : null}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title={confirmDelete.isMultiple ? "Excluir Categorias" : "Excluir Categoria"}
                message={confirmDelete.isMultiple
                    ? `Tem certeza que deseja excluir ${selectedIds.size} categoria(s)? Esta ação não pode ser desfeita.`
                    : "Tem certeza que deseja excluir essa categoria? Esta ação não pode ser desfeita."
                }
                confirmText="Excluir"
                cancelText="Cancelar"
                isDangerous={true}
                isLoading={isLoading}
                onConfirm={handleConfirmDeleteUpdated}
                onCancel={() => setConfirmDelete({ isOpen: false, categoriaId: null, isMultiple: false })}
            />
        </div>
    );
}
