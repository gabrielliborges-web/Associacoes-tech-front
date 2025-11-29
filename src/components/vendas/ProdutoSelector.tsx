import { Trash2, Plus } from "lucide-react";
import { useState } from "react";
import type { ItemVenda } from "../../mocks/vendasMock";
import { produtosMock } from "../../mocks/vendasMock";

interface ProdutoSelectorProps {
    itens: ItemVenda[];
    onItensChange: (itens: ItemVenda[]) => void;
}

export default function ProdutoSelector({
    itens,
    onItensChange,
}: ProdutoSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProdutoId, setSelectedProdutoId] = useState<number | null>(null);
    const [quantidade, setQuantidade] = useState(1);

    const filteredProdutos = produtosMock.filter(
        (p) =>
            p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddItem = () => {
        if (!selectedProdutoId || quantidade <= 0) return;

        const produto = produtosMock.find((p) => p.id === selectedProdutoId);
        if (!produto) return;

        const existingItem = itens.find((item) => item.produtoId === selectedProdutoId);

        if (existingItem) {
            // Update quantity if already exists
            const updatedItens = itens.map((item) =>
                item.produtoId === selectedProdutoId
                    ? {
                        ...item,
                        quantidade: item.quantidade + quantidade,
                        subtotal:
                            (item.quantidade + quantidade) * item.precoUnit,
                    }
                    : item
            );
            onItensChange(updatedItens);
        } else {
            // Add new item
            const newItem: ItemVenda = {
                produtoId: selectedProdutoId,
                quantidade,
                precoUnit: produto.precoVenda,
                subtotal: quantidade * produto.precoVenda,
            };
            onItensChange([...itens, newItem]);
        }

        setQuantidade(1);
        setSelectedProdutoId(null);
        setSearchTerm("");
    };

    const handleRemoveItem = (produtoId: number) => {
        onItensChange(itens.filter((item) => item.produtoId !== produtoId));
    };

    return (
        <div className="space-y-4">
            {/* Search and Input */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <label className="mb-3 block text-sm font-medium text-white">
                    Adicionar Produtos
                </label>

                <div className="mb-3 flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar produto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/50 transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none"
                    />
                </div>

                {/* Dropdown Products */}
                {searchTerm && filteredProdutos.length > 0 && (
                    <div className="mb-3 max-h-40 overflow-y-auto rounded-lg border border-white/10 bg-white/5">
                        {filteredProdutos.map((produto) => (
                            <button
                                key={produto.id}
                                type="button"
                                onClick={() => {
                                    setSelectedProdutoId(produto.id);
                                    setSearchTerm("");
                                }}
                                className="w-full border-b border-white/5 px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10 last:border-b-0"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{produto.nome}</span>
                                    <span className="text-xs text-primary-400">
                                        R$ {produto?.precoVenda?.toFixed(2)}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Selected Product Display & Quantity */}
                {selectedProdutoId && (
                    <div className="rounded-lg bg-white/10 p-3">
                        <p className="mb-3 text-sm font-medium text-white">
                            {produtosMock.find((p) => p.id === selectedProdutoId)?.nome}
                        </p>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="1"
                                value={quantidade}
                                onChange={(e) =>
                                    setQuantidade(Math.max(1, parseInt(e.target.value) || 1))
                                }
                                className="w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-white text-center transition-colors focus:border-primary-600 focus:bg-white/10 focus:outline-none"
                            />

                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary-600/80 px-3 py-2 font-medium text-white transition-all hover:bg-primary-600 active:scale-95"
                            >
                                <Plus className="h-4 w-4" />
                                Adicionar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Items List */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <label className="mb-3 block text-sm font-medium text-white">
                    Itens selecionados ({itens.length})
                </label>

                <div className="space-y-2">
                    {itens.length === 0 ? (
                        <p className="text-sm text-white/50 italic">
                            Nenhum produto adicionado
                        </p>
                    ) : (
                        itens.map((item) => {
                            const produto = produtosMock.find((p) => p.id === item.produtoId);
                            return (
                                <div
                                    key={item.produtoId}
                                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {produto?.nome}
                                        </p>
                                        <p className="text-xs text-white/50">
                                            {item.quantidade}x R$ {item.precoUnit.toFixed(2)} = R${" "}
                                            {item.subtotal.toFixed(2)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(item.produtoId)}
                                        className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 transition-all hover:bg-red-500/20 active:scale-95"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-400" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
