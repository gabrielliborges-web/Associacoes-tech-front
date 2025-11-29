import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Input from "../common/Input";
import Textarea from "../common/Textarea";

interface CategoriaFormProps {
    onClose: () => void;
    onSave: (data: { nome: string; descricao?: string; ativo?: boolean }) => void;
    initialData?: { nome: string; descricao?: string; ativo: boolean; id?: number };
    isLoading?: boolean;
}

export default function CategoriaForm({
    onClose,
    onSave,
    initialData,
    isLoading = false,
}: CategoriaFormProps) {
    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        ativo: true,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                nome: initialData.nome,
                descricao: initialData.descricao || "",
                ativo: initialData.ativo,
            });
        } else {
            setFormData({
                nome: "",
                descricao: "",
                ativo: true,
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        onSave({
            nome: formData.nome,
            descricao: formData.descricao,
            ativo: formData.ativo,
        });

        setFormData({
            nome: "",
            descricao: "",
            ativo: true,
        });
        setErrors({});
    };

    const handleClose = () => {
        setFormData({
            nome: "",
            descricao: "",
            ativo: true,
        });
        setErrors({});
        onClose();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 disabled:opacity-50"
                >
                    <ArrowLeft className="h-5 w-5 text-white/60 hover:text-white" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {initialData ? "Editar Categoria" : "Nova Categoria"}
                    </h1>
                    <p className="mt-1 text-sm text-white/50">
                        {initialData ? "Atualize os detalhes da categoria" : "Crie uma nova categoria para o seu estoque"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                        Nome <span className="text-rose-400">*</span>
                    </label>
                    <Input
                        name="nome"
                        value={formData.nome}
                        onChange={(e) => {
                            setFormData({ ...formData, nome: e.target.value });
                            if (errors.nome) setErrors({ ...errors, nome: "" });
                        }}
                        placeholder="Ex: Roupas"
                        disabled={isLoading}
                        className={errors.nome ? "border-red-500" : ""}
                    />
                    {errors.nome && (
                        <p className="mt-1 text-xs text-red-400">{errors.nome}</p>
                    )}
                </div>

                {/* Descrição */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                        Descrição
                    </label>
                    <Textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={(e) =>
                            setFormData({ ...formData, descricao: e.target.value })
                        }
                        placeholder="Descreva a categoria..."
                        disabled={isLoading}
                        rows={4}
                    />
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 rounded-lg p-4 bg-white/5 border border-white/10">
                    <input
                        type="checkbox"
                        id="ativo"
                        checked={formData.ativo}
                        onChange={(e) =>
                            setFormData({ ...formData, ativo: e.target.checked })
                        }
                        disabled={isLoading}
                        className="h-4 w-4 cursor-pointer rounded border-rose-500/30 bg-rose-500/10 text-rose-500 transition-colors"
                    />
                    <label
                        htmlFor="ativo"
                        className="cursor-pointer text-sm font-medium text-white"
                    >
                        Categoria Ativa
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-8">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 rounded-lg py-3 font-semibold text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 rounded-lg bg-gradient-to-r from-rose-400 to-rose-500 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-400/40 hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
