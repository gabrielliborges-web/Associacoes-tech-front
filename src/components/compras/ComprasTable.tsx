import { Info, Trash2 } from "lucide-react";
import type { CompraMock } from "../../mocks/comprasMock";

interface ComprasTableProps {
    compras: CompraMock[];
    onDetails: (id: number) => void;
    onDelete: (id: number) => void;
}

function formatarData(data: string): string {
    return new Date(data).toLocaleDateString("pt-BR");
}

function formatarMoeda(valor: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

function somarQuantidades(itens: any[]): number {
    return itens.reduce((sum, item) => sum + item.quantidade, 0);
}

export default function ComprasTable({ compras, onDetails, onDelete }: ComprasTableProps) {
    if (compras.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
                <p className="text-white/60">Nenhuma compra encontrada.</p>
            </div>
        );
    }

    return (
        <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm md:block">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                            Data
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                            Fornecedor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                            Total
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                            Qtd. Itens
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                            Usuário
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {compras.map((compra) => (
                        <tr
                            key={compra.id}
                            className="transition-all duration-300 hover:bg-white/5"
                        >
                            <td className="px-6 py-4 text-sm font-medium text-white">
                                {formatarData(compra.data)}
                            </td>
                            <td className="px-6 py-4 text-sm text-white/80">
                                {compra.fornecedor || "-"}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-primary-400">
                                {formatarMoeda(compra.total)}
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                    {somarQuantidades(compra.itens)}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-white/80">
                                {compra.usuarioNome}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onDetails(compra.id)}
                                        className="rounded-lg p-2 transition-all duration-300 hover:bg-primary-500/20"
                                        title="Detalhes"
                                    >
                                        <Info className="h-4 w-4 text-primary-400" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(compra.id)}
                                        className="rounded-lg p-2 transition-all duration-300 hover:bg-red-500/20"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-400" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
