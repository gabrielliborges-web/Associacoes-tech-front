import { useState, useCallback, useEffect } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import ItemCompraRow from "./ItemCompraRow";
import { listProdutos } from "../../lib/produto";
import type { ProdutoResumo, ItemCompraMock, CompraMock } from "../../mocks/comprasMock";
import { useAuth } from "../../context/AuthContext";

interface NovaCompraFormProps {
    onClose: () => void;
    onSave: (compra: Omit<CompraMock, "id">) => void;
    isLoading?: boolean;
}

interface ItemForm extends ItemCompraMock {
    _tempId?: number;
}

export default function NovaCompraForm({
    onClose,
    onSave,
    isLoading = false,
}: NovaCompraFormProps) {
    const [fornecedor, setFornecedor] = useState("");
    const [data, setData] = useState(new Date().toISOString().split("T")[0]);
    const [descricao, setDescricao] = useState("");
    const [itens, setItens] = useState<ItemForm[]>([]);
    const [produtos, setProdutos] = useState<ProdutoResumo[]>([]);
    const { user } = useAuth();
    const [erros, setErros] = useState<string[]>([]);

    // Load produtos from API when component mounts
    useEffect(() => {
        loadProdutos();
    }, []);

    const loadProdutos = async () => {
        try {
            const data = await listProdutos();
            const produtosTransformados = (data as any[])
                .filter(p => p.ativo !== false)
                .map((p) => ({
                    id: p.id,
                    nome: p.nome,
                    precoVenda: p.preco || 0,
                    estoque: p.estoque || 0,
                    ativo: p.ativo !== false,
                }));
            setProdutos(produtosTransformados);
        } catch (error: any) {
            toast.error("Erro ao carregar produtos");
            console.error(error);
        }
    };

    const totalCompra = itens.reduce((sum, item) => sum + item.total, 0);
    const totalItens = itens.reduce((sum, item) => sum + item.quantidade, 0);

    const handleAddItem = useCallback(() => {
        const novoItem: ItemForm = {
            id: Date.now(),
            _tempId: Date.now(),
            produtoId: 0,
            produtoNome: "",
            quantidade: 1,
            custoUnit: 0,
            total: 0,
        };
        setItens((prev) => [...prev, novoItem]);
    }, []);

    const handleRemoveItem = useCallback((itemId: number) => {
        setItens((prev) => prev.filter((item) => item.id !== itemId));
    }, []);

    const handleChangeProduto = useCallback(
        (itemId: number, produtoId: number) => {
            setItens((prev) =>
                prev.map((item) => {
                    if (item.id === itemId) {
                        const prod = produtos.find((p) => p.id === produtoId);
                        return {
                            ...item,
                            produtoId,
                            produtoNome: prod?.nome || "",
                        };
                    }
                    return item;
                })
            );
        },
        [produtos]
    );

    const handleChangeQuantidade = useCallback((itemId: number, quantidade: number) => {
        setItens((prev) =>
            prev.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        quantidade,
                        total: quantidade * item.custoUnit,
                    };
                }
                return item;
            })
        );
    }, []);

    const handleChangeCusto = useCallback((itemId: number, custo: number) => {
        setItens((prev) =>
            prev.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        custoUnit: custo,
                        total: item.quantidade * custo,
                    };
                }
                return item;
            })
        );
    }, []);

    const validar = (): boolean => {
        const novasErros: string[] = [];

        if (!fornecedor.trim()) {
            novasErros.push("Fornecedor é obrigatório");
        }

        if (itens.length === 0) {
            novasErros.push("Adicione pelo menos um item");
        }

        itens.forEach((item, idx) => {
            if (!item.produtoId) {
                novasErros.push(`Item ${idx + 1}: Selecione um produto`);
            }
            if (!item.quantidade || item.quantidade <= 0) {
                novasErros.push(`Item ${idx + 1}: Quantidade deve ser > 0`);
            }
            if (!item.custoUnit || item.custoUnit <= 0) {
                novasErros.push(`Item ${idx + 1}: Custo unitário deve ser > 0`);
            }
        });

        setErros(novasErros);
        return novasErros.length === 0;
    };

    const handleSalvar = useCallback(() => {
        if (!validar()) return;

        const novaCompra: Omit<CompraMock, "id"> = {
            fornecedor,
            data: new Date(data).toISOString(),
            descricao: descricao || undefined,
            total: totalCompra,
            usuarioNome: user?.nome || "Usuário Desconhecido",
            itens: itens.map(({ _tempId, ...item }) => item),
        };

        onSave(novaCompra);
        resetarForm();
    }, [fornecedor, data, descricao, totalCompra, user?.nome, itens, onSave]);

    const resetarForm = () => {
        setFornecedor("");
        setData(new Date().toISOString().split("T")[0]);
        setDescricao("");
        setItens([]);
        setErros([]);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 disabled:opacity-50"
                >
                    <ArrowLeft className="h-5 w-5 text-white/60 hover:text-white" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Nova Compra</h1>
                    <p className="mt-1 text-sm text-white/50">Adicione uma nova entrada de estoque</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Erros */}
                {erros.length > 0 && (
                    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                        <p className="mb-2 text-sm font-semibold text-red-400">Erros encontrados:</p>
                        <ul className="space-y-1">
                            {erros.map((erro, idx) => (
                                <li key={idx} className="text-sm text-red-400">
                                    • {erro}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Seção 1 - Dados Gerais */}
                <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                        Dados Gerais
                    </h3>

                    <div className="grid gap-4 md:grid-cols-3">
                        {/* Fornecedor */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-white/80">
                                Fornecedor *
                            </label>
                            <input
                                type="text"
                                value={fornecedor}
                                onChange={(e) => setFornecedor(e.target.value)}
                                placeholder="Nome do fornecedor"
                                disabled={isLoading}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50"
                            />
                        </div>

                        {/* Data */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-white/80">
                                Data *
                            </label>
                            <input
                                type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                disabled={isLoading}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50"
                            />
                        </div>

                        {/* Usuário */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-white/80">
                                Usuário
                            </label>
                            <input
                                type="text"
                                value={user?.nome}
                                disabled
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/60 transition-all duration-300 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white/80">
                            Descrição
                        </label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Adicione uma descrição (opcional)"
                            disabled={isLoading}
                            rows={3}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50 resize-none"
                        />
                    </div>
                </div>

                {/* Seção 2 - Itens */}
                <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                            Itens da Compra
                        </h3>
                        <button
                            onClick={handleAddItem}
                            disabled={isLoading}
                            className="flex items-center gap-2 rounded-lg bg-primary-600/20 px-3 py-2 text-sm font-semibold text-primary-400 transition-all duration-300 hover:bg-primary-600/30 disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Adicionar Item</span>
                        </button>
                    </div>

                    {itens.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed border-white/10 py-8 text-center">
                            <p className="text-white/60">Nenhum item adicionado ainda</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {itens.map((item) => (
                                <ItemCompraRow
                                    key={item.id}
                                    item={item}
                                    produtos={produtos}
                                    onChangeProduto={handleChangeProduto}
                                    onChangeQuantidade={handleChangeQuantidade}
                                    onChangeCusto={handleChangeCusto}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Seção 3 - Resumo */}
                {itens.length > 0 && (
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-primary-600/20 to-primary-500/10 p-4 backdrop-blur-sm">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm text-white/60">Qtd. Total de Itens</p>
                                <p className="text-2xl font-bold text-primary-400">{totalItens}</p>
                            </div>
                            <div>
                                <p className="text-sm text-white/60">Total da Compra</p>
                                <p className="text-2xl font-bold text-primary-400">
                                    R$ {totalCompra.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-white/60">Itens Adicionados</p>
                                <p className="text-2xl font-bold text-white">{itens.length}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ações */}
                <div className="flex gap-3 pt-8">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 rounded-lg border border-white/10 px-4 py-3 font-semibold text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSalvar}
                        disabled={isLoading || itens.length === 0}
                        className="flex-1 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50 disabled:opacity-50"
                    >
                        {isLoading ? "Salvando..." : "Salvar Compra"}
                    </button>
                </div>
            </div>
        </div>
    );
}
