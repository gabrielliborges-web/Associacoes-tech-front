import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Input from "../common/Input";
import Textarea from "../common/Textarea";

interface CategoriaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { nome: string; descricao?: string; ativo?: boolean }) => void;
    initialData?: { nome: string; descricao?: string; ativo: boolean; id?: number };
    isLoading?: boolean;
}

export default function CategoriaModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    isLoading = false,
}: CategoriaModalProps) {
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
    }, [initialData, isOpen]);

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
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 dark:bg-black/40 light:bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                    onClick={handleClose}
                />
            )}

            {/* Modal */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-8 transition-all duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            >
                <div
                    className={`relative w-full max-w-md transform rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-transform duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border dark:border-rose-500/20 light:bg-gradient-to-br light:from-white light:to-rose-50/30 light:border light:border-rose-200/50 shadow-2xl ${isOpen ? "scale-100" : "scale-95"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white light:text-gray-900">
                                {initialData ? "Editar Categoria" : "Nova Categoria"}
                            </h2>
                            <p className="mt-1 text-xs dark:text-white/50 light:text-gray-500">
                                {initialData ? "Atualize os detalhes" : "Crie uma nova categoria"}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="rounded-lg p-2 transition-all duration-300 dark:hover:bg-white/10 light:hover:bg-rose-100/50 disabled:opacity-50"
                        >
                            <X className="h-5 w-5 dark:text-white/60 light:text-gray-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nome */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold dark:text-white light:text-gray-800">
                                Nome <span className="text-rose-400/70 dark:text-rose-400 light:text-rose-500">*</span>
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
                            <label className="mb-2 block text-sm font-semibold dark:text-white light:text-gray-800">
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
                                rows={3}
                            />
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3 rounded-lg p-3 dark:bg-white/5 light:bg-rose-100/30">
                            <input
                                type="checkbox"
                                id="ativo"
                                checked={formData.ativo}
                                onChange={(e) =>
                                    setFormData({ ...formData, ativo: e.target.checked })
                                }
                                disabled={isLoading}
                                className="h-4 w-4 cursor-pointer rounded dark:border-rose-500/30 dark:bg-rose-500/10 light:border-rose-300 light:bg-rose-100 text-rose-500 transition-colors"
                            />
                            <label
                                htmlFor="ativo"
                                className="cursor-pointer text-sm font-medium dark:text-white light:text-gray-800"
                            >
                                Categoria Ativa
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="flex-1 rounded-lg py-2.5 font-semibold transition-all duration-300 dark:text-white dark:hover:bg-white/10 light:text-gray-700 light:hover:bg-gray-100 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 rounded-lg bg-gradient-to-r from-rose-400 to-rose-500 py-2.5 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-400/40 hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
