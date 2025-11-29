import { useState } from "react";
import { X } from "lucide-react";
import { tiposEntrada } from "../../mocks/financeiroMock";

interface FinanceiroEntradaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    isLoading?: boolean;
}

export default function FinanceiroEntradaModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false,
}: FinanceiroEntradaModalProps) {
    const [formData, setFormData] = useState({
        tipo: "",
        valor: "",
        data: new Date().toISOString().split("T")[0],
        descricao: "",
    });
    const [erros, setErros] = useState<string[]>([]);

    const validar = () => {
        const novasErros: string[] = [];

        if (!formData.tipo) {
            novasErros.push("Tipo de entrada é obrigatório");
        }
        if (!formData.valor || Number(formData.valor) <= 0) {
            novasErros.push("Valor deve ser maior que zero");
        }
        if (!formData.data) {
            novasErros.push("Data é obrigatória");
        }

        setErros(novasErros);
        return novasErros.length === 0;
    };

    const handleSalvar = () => {
        if (!validar()) return;

        onSave({
            tipo: formData.tipo,
            valor: Number(formData.valor),
            data: new Date(formData.data).toISOString(),
            descricao: formData.observacao,
        });

        setFormData({
            tipo: "",
            valor: "",
            data: new Date().toISOString().split("T")[0],
            descricao: "",
        });
        setErros([]);
    };

    const handleFechar = () => {
        setFormData({
            tipo: "",
            valor: "",
            data: new Date().toISOString().split("T")[0],
            descricao: "",
        });
        setErros([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={handleFechar}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border border-white/10 bg-gradient-to-br from-[#050107] to-[#0a0510] p-6 shadow-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Nova Entrada</h2>
                        <p className="text-sm text-white/60">Registre uma nova entrada financeira</p>
                    </div>
                    <button
                        onClick={handleFechar}
                        className="rounded-lg p-2 transition-all duration-300 hover:bg-white/10"
                    >
                        <X className="h-6 w-6 text-white/60" />
                    </button>
                </div>

                {/* Erros */}
                {erros.length > 0 && (
                    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                        <ul className="space-y-1">
                            {erros.map((erro, idx) => (
                                <li key={idx} className="text-sm text-red-400">
                                    • {erro}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Tipo */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white/80">
                            Tipo de Entrada *
                        </label>
                        <select
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            disabled={isLoading}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50"
                        >
                            <option value="">Selecionar...</option>
                            {tiposEntrada.map((tipo) => (
                                <option key={tipo.id} value={tipo.nome}>
                                    {tipo.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Valor */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white/80">
                            Valor (R$) *
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.valor}
                            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                            placeholder="0.00"
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
                            value={formData.data}
                            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                            disabled={isLoading}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50"
                        />
                    </div>

                    {/* Observação */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white/80">
                            Observação
                        </label>
                        <textarea
                            value={formData.observacao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            placeholder="Adicione uma observação (opcional)"
                            rows={3}
                            disabled={isLoading}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50 resize-none"
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleFechar}
                            disabled={isLoading}
                            className="flex-1 rounded-lg border border-white/10 px-4 py-2 font-semibold text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSalvar}
                            disabled={isLoading}
                            className="flex-1 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50 disabled:opacity-50"
                        >
                            {isLoading ? "Salvando..." : "Salvar Entrada"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
