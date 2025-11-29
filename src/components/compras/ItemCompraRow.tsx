import { Trash2 } from "lucide-react";
import type { ProdutoResumo, ItemCompraMock } from "../../mocks/comprasMock";

interface ItemCompraRowProps {
    item: ItemCompraMock;
    produtos: ProdutoResumo[];
    onChangeProduto: (itemId: number, produtoId: number) => void;
    onChangeQuantidade: (itemId: number, quantidade: number) => void;
    onChangeCusto: (itemId: number, custo: number) => void;
    onRemove: (itemId: number) => void;
}

export default function ItemCompraRow({
    item,
    produtos,
    onChangeProduto,
    onChangeQuantidade,
    onChangeCusto,
    onRemove,
}: ItemCompraRowProps) {
    const produtoSelecionado = produtos.find((p) => p.id === item.produtoId);

    return (
        <div className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-6 md:gap-4 md:p-3">
            {/* Produto */}
            <div>
                <label className="mb-2 block text-xs font-semibold text-white/70">
                    Produto
                </label>
                <select
                    value={item.produtoId}
                    onChange={(e) => onChangeProduto(item.id, Number(e.target.value))}
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
                <label className="mb-2 block text-xs font-semibold text-white/70">
                    Quantidade
                </label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={item.quantidade}
                    onChange={(e) => onChangeQuantidade(item.id, Number(e.target.value) || 0)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="0"
                />
            </div>

            {/* Custo Unitário */}
            <div>
                <label className="mb-2 block text-xs font-semibold text-white/70">
                    Custo Unit.
                </label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.custoUnit}
                    onChange={(e) => onChangeCusto(item.id, Number(e.target.value) || 0)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="0.00"
                />
            </div>

            {/* Total do Item */}
            <div>
                <label className="mb-2 block text-xs font-semibold text-white/70">
                    Total
                </label>
                <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-primary-400">
                    R$ {(item.quantidade * item.custoUnit).toFixed(2)}
                </div>
            </div>

            {/* Estoque e Ação */}
            <div>
                <label className="mb-2 block text-xs font-semibold text-white/70">
                    Estoque
                </label>
                <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    {produtoSelecionado?.estoque || "—"}
                </div>
            </div>

            {/* Botão Remover */}
            <div className="flex flex-col items-end justify-end">
                <button
                    onClick={() => onRemove(item.id)}
                    className="rounded-lg p-2 transition-all duration-300 hover:bg-red-500/20"
                    title="Remover item"
                >
                    <Trash2 className="h-5 w-5 text-red-400" />
                </button>
            </div>
        </div>
    );
}
