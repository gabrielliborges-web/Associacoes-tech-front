import { Edit, Trash2, Info } from "lucide-react";
import { mockDespesas } from "../../mocks/financeiroMock";

interface FinanceiroDespesasProps {
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

function formatarData(data: string): string {
    return new Date(data).toLocaleDateString("pt-BR");
}

export default function FinanceiroDespesas({
    onEdit,
    onDelete,
}: FinanceiroDespesasProps) {
    const totalDespesas = mockDespesas.reduce((sum, d) => sum + d.valor, 0);

    return (
        <div className="space-y-6">
            {/* Resumo */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/20 to-red-500/5 p-6 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-wider text-white/60">
                    Total de Despesas
                </p>
                <p className="mt-2 text-4xl font-bold text-red-400">R$ {totalDespesas.toFixed(2)}</p>
                <p className="mt-2 text-sm text-white/60">{mockDespesas.length} despesas registradas</p>
            </div>

            {/* Tabela */}
            <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm md:block">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                                Tipo
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                                Descrição
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                                Valor
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                                Data
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                                Observações
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {mockDespesas.map((despesa) => (
                            <tr key={despesa.id} className="transition-all duration-300 hover:bg-white/5">
                                <td className="px-6 py-4">
                                    <span className="inline-flex rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
                                        {despesa.tipo}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-white/80">
                                    {despesa.descricao || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-red-400">
                                    - R$ {despesa.valor.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-sm text-white/80">
                                    {formatarData(despesa.data)}
                                </td>
                                <td className="px-6 py-4 text-sm text-white/80">
                                    {despesa.observacao || "-"}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="rounded-lg p-2 transition-all duration-300 hover:bg-primary-500/20"
                                            title="Detalhes"
                                        >
                                            <Info className="h-4 w-4 text-primary-400" />
                                        </button>
                                        <button
                                            onClick={() => onEdit?.(despesa.id)}
                                            className="rounded-lg p-2 transition-all duration-300 hover:bg-white/10"
                                            title="Editar"
                                        >
                                            <Edit className="h-4 w-4 text-white/70" />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(despesa.id)}
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

            {/* Grid Mobile */}
            <div className="grid gap-4 sm:grid-cols-2 md:hidden">
                {mockDespesas.map((despesa) => (
                    <div
                        key={despesa.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                    >
                        <div className="mb-3 flex items-start justify-between">
                            <span className="inline-flex rounded-full bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-400">
                                {despesa.tipo}
                            </span>
                            <p className="font-bold text-red-400">R$ {despesa.valor.toFixed(2)}</p>
                        </div>
                        <p className="mb-2 text-sm text-white/80">{despesa.descricao}</p>
                        <div className="mb-3 space-y-1 text-xs text-white/60">
                            <p>📅 {formatarData(despesa.data)}</p>
                            <p>📝 {despesa.observacao}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 rounded-lg bg-white/10 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-white/20">
                                Editar
                            </button>
                            <button className="flex-1 rounded-lg bg-red-500/20 py-2 text-xs font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/30">
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
