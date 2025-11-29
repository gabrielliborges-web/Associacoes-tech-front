import { useState, useCallback, useEffect } from "react";
import { Plus, ArrowLeft, X } from "lucide-react";
import toast from "react-hot-toast";
import { listProdutos } from "../../lib/produto";
import type { Produto } from "../../lib/produto";

interface NovaVendaFormProps {
    onClose: () => void;
    onSave: (venda: {
        formaPagamento: string;
        descricao: string;
        itens: Array<{
            produtoId: number;
            quantidade: number;
            precoUnit: number;
        }>;
    }) => void;
    isLoading?: boolean;
}

interface ItemForm {
    id: number;
    produtoId: number;
    produtoNome: string;
    quantidade: number;
    precoUnit: number;
    total: number;
}

export default function NovaVendaForm({
    onClose,
    onSave,
    isLoading = false,
}: NovaVendaFormProps) {
    const [formaPagamento, setFormaPagamento] = useState("dinheiro");
    const [descricao, setDescricao] = useState("");
    const [itens, setItens] = useState<ItemForm[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [erros, setErros] = useState<string[]>([]);

    // Load produtos when component mounts
    useEffect(() => {
        loadProdutos();
    }, []);

    const loadProdutos = async () => {
        try {
            const data = await listProdutos({ ativo: true });
            setProdutos(data as Produto[]);
        } catch (error: any) {
            toast.error("Erro ao carregar produtos");
        }
    };

    const totalVenda = itens.reduce((sum, item) => sum + item.total, 0);
    const totalItens = itens.reduce((sum, item) => sum + item.quantidade, 0);

    const handleAddItem = useCallback(() => {
        const novoItem: ItemForm = {
            id: Date.now(),
            produtoId: 0,
            produtoNome: "",
            quantidade: 1,
            precoUnit: 0,
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
                            precoUnit: prod?.preco || 0,
                            total: item.quantidade * (prod?.preco || 0),
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
                        total: quantidade * item.precoUnit,
                    };
                }
                return item;
            })
        );
    }, []);

    const handleChangePreco = useCallback((itemId: number, preco: number) => {
        setItens((prev) =>
            prev.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        precoUnit: preco,
                        total: item.quantidade * preco,
                    };
                }
                return item;
            })
        );
    }, []);

    const validar = (): boolean => {
        const novasErros: string[] = [];

        if (!formaPagamento) {
            novasErros.push("Forma de pagamento é obrigatória");
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
            if (!item.precoUnit || item.precoUnit <= 0) {
                novasErros.push(`Item ${idx + 1}: Preço unitário deve ser > 0`);
            }
        });

        setErros(novasErros);
        return novasErros.length === 0;
    };

    const handleSalvar = useCallback(() => {
        if (!validar()) return;

        onSave({
            formaPagamento,
            descricao,
            itens: itens.map(({ id, produtoNome, total, ...item }) => item),
        });

        setFormaPagamento("dinheiro");
        setDescricao("");
        setItens([]);
        setErros([]);
    }, [formaPagamento, descricao, itens, onSave]);

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
                    <h1 className="text-3xl font-bold text-white">Nova Venda</h1>
                    <p className="mt-1 text-sm text-white/50">Registre uma nova venda</p>
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

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Forma de Pagamento */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-white/80">
                                Forma de Pagamento *
                            </label>
                            <select
                                value={formaPagamento}
                                onChange={(e) => setFormaPagamento(e.target.value)}
                                disabled={isLoading}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50"
                            >
                                <option value="dinheiro">💵 Dinheiro</option>
                                <option value="pix">📱 Pix</option>
                                <option value="débito">🏧 Débito</option>
                                <option value="crédito">💳 Crédito</option>
                                <option value="fiado">📝 Fiado</option>
                            </select>
                        </div>

                        {/* Total */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-white/80">
                                Total
                            </label>
                            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white font-semibold">
                                R$ {totalVenda.toFixed(2)}
                            </div>
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

                {/* Seção 2 - Itens da Venda */}
                <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                            Itens da Venda
                        </h3>
                        <button
                            onClick={handleAddItem}
                            disabled={isLoading}
                            className="flex items-center gap-2 rounded-lg bg-green-600/20 px-3 py-2 text-sm font-semibold text-green-400 transition-all duration-300 hover:bg-green-600/30 disabled:opacity-50"
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
                                <div key={item.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-5 md:gap-2 md:p-3">
                                    {/* Produto */}
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-white/70">
                                            Produto
                                        </label>
                                        <select
                                            value={item.produtoId}
                                            onChange={(e) => handleChangeProduto(item.id, Number(e.target.value))}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                                        >
                                            <option value="">Selecionar...</option>
                                            {produtos.map((prod) => (
                                                <option key={prod.id} value={prod.id}>
                                                    {prod.nome} (Est: {prod.estoque})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Quantidade */}
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-white/70">
                                            Qtd
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={item.quantidade}
                                            onChange={(e) => handleChangeQuantidade(item.id, Number(e.target.value) || 0)}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* Preço Unitário */}
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-white/70">
                                            Preço
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.precoUnit}
                                            onChange={(e) => handleChangePreco(item.id, Number(e.target.value) || 0)}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* Subtotal */}
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-white/70">
                                            Subtotal
                                        </label>
                                        <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-green-400">
                                            R$ {item.total.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Remover */}
                                    <div className="flex flex-col items-end justify-end">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="rounded-lg p-2 transition-all duration-300 hover:bg-red-500/20"
                                            title="Remover item"
                                        >
                                            <X className="h-5 w-5 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Resumo */}
                {itens.length > 0 && (
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-green-600/20 to-green-500/10 p-4 backdrop-blur-sm">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm text-white/60">Qtd. Total de Itens</p>
                                <p className="text-2xl font-bold text-green-400">{totalItens}</p>
                            </div>
                            <div>
                                <p className="text-sm text-white/60">Total da Venda</p>
                                <p className="text-2xl font-bold text-green-400">
                                    R$ {totalVenda.toFixed(2)}
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
                        className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50"
                    >
                        {isLoading ? "Salvando..." : "Salvar Venda"}
                    </button>
                </div>
            </div>
        </div>
    );
}
