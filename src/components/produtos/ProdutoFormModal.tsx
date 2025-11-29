import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import type { Produto } from "../../mocks/produtosMock";

interface ProdutoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Produto, "id" | "criadoEm" | "atualizadoEm">) => void;
    initialData?: Produto;
    isLoading?: boolean;
    categorias: Array<{ id: number; nome: string }>;
}

interface FormData {
    nome: string;
    descricao: string;
    categoriaId: number | null;
    precoVenda: string;
    precoCompra: string;
    precoPromocional: string;
    imagem: string;
    ativo: boolean;
}

interface FormErrors {
    [key: string]: string;
}

export default function ProdutoFormModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    isLoading = false,
    categorias,
}: ProdutoFormModalProps) {
    const [formData, setFormData] = useState<FormData>({
        nome: initialData?.nome || "",
        descricao: initialData?.descricao || "",
        categoriaId: initialData?.categoriaId || null,
        precoVenda: initialData?.precoVenda.toString() || "",
        precoCompra: initialData?.precoCompra?.toString() || "",
        precoPromocional: initialData?.precoPromocional?.toString() || "",
        imagem: initialData?.imagem || "",
        ativo: initialData?.ativo ?? true,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [imagePreview, setImagePreview] = useState<string>(initialData?.imagem || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
        }

        const precoVenda = parseFloat(formData.precoVenda);
        if (!formData.precoVenda || isNaN(precoVenda) || precoVenda <= 0) {
            newErrors.precoVenda = "Preço de venda é obrigatório e deve ser maior que 0";
        }

        const precoCompra = parseFloat(formData.precoCompra);
        if (formData.precoCompra && (isNaN(precoCompra) || precoCompra < 0)) {
            newErrors.precoCompra = "Preço de compra deve ser maior ou igual a 0";
        }

        const precoPromocional = parseFloat(formData.precoPromocional);
        if (formData.precoPromocional && (isNaN(precoPromocional) || precoPromocional < 0)) {
            newErrors.precoPromocional = "Preço promocional deve ser maior ou igual a 0";
        }

        if (formData.precoPromocional && precoPromocional > precoVenda) {
            newErrors.precoPromocional = "Preço promocional não pode ser maior que preço de venda";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData({ ...formData, imagem: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        onSave({
            nome: formData.nome,
            descricao: formData.descricao || undefined,
            categoriaId: formData.categoriaId || undefined,
            precoVenda: parseFloat(formData.precoVenda),
            precoCompra: formData.precoCompra ? parseFloat(formData.precoCompra) : undefined,
            precoPromocional: formData.precoPromocional ? parseFloat(formData.precoPromocional) : undefined,
            imagem: formData.imagem || undefined,
            ativo: formData.ativo,
            estoque: initialData?.estoque || 0,
            usuarioId: initialData?.usuarioId,
            categoria: initialData?.categoria,
        });

        setFormData({
            nome: "",
            descricao: "",
            categoriaId: null,
            precoVenda: "",
            precoCompra: "",
            precoPromocional: "",
            imagem: "",
            ativo: true,
        });
        setImagePreview("");
        setErrors({});
    };

    const handleClose = () => {
        setFormData({
            nome: "",
            descricao: "",
            categoriaId: null,
            precoVenda: "",
            precoCompra: "",
            precoPromocional: "",
            imagem: "",
            ativo: true,
        });
        setImagePreview("");
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
                    className={`relative w-full max-w-2xl transform rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-transform duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border dark:border-rose-500/20 light:bg-gradient-to-br light:from-white light:to-rose-50/30 light:border light:border-rose-200/50 shadow-2xl max-h-[90vh] overflow-y-auto ${isOpen ? "scale-100" : "scale-95"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between sticky top-0 dark:bg-gray-900 light:bg-white/50 -mx-6 -mt-6 px-6 pt-6 pb-4 backdrop-blur">
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white light:text-gray-900">
                                {initialData ? "Editar Produto" : "Novo Produto"}
                            </h2>
                            <p className="mt-1 text-xs dark:text-white/50 light:text-gray-500">
                                {initialData ? "Atualize os detalhes do produto" : "Crie um novo produto no seu catálogo"}
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold dark:text-white light:text-gray-800">
                                Imagem do Produto
                            </label>
                            <div className="flex gap-4 flex-col sm:flex-row">
                                {/* Preview */}
                                <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br dark:from-rose-500/10 dark:to-rose-600/5 light:from-rose-100/40 light:to-rose-50/20 flex items-center justify-center flex-shrink-0">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="h-8 w-8 dark:text-white/30 light:text-gray-300" />
                                    )}
                                </div>

                                {/* Upload Button */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageUpload}
                                        disabled={isLoading}
                                        className="flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold transition-all duration-300 dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/30 light:bg-rose-100 light:text-rose-700 light:hover:bg-rose-200 disabled:opacity-50"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Fazer Upload
                                    </button>
                                    <p className="text-xs dark:text-white/50 light:text-gray-500 mt-2">
                                        PNG, JPG até 5MB
                                    </p>
                                </div>
                            </div>
                        </div>

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
                                placeholder="Ex: Gin Tanqueray"
                                disabled={isLoading}
                                className={errors.nome ? "border-red-500" : ""}
                            />
                            {errors.nome && (
                                <p className="mt-1 text-xs text-red-400">{errors.nome}</p>
                            )}
                        </div>

                        {/* Descricao */}
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
                                placeholder="Descreva o produto..."
                                disabled={isLoading}
                                rows={3}
                            />
                        </div>

                        {/* Categoria */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold dark:text-white light:text-gray-800">
                                Categoria
                            </label>
                            <select
                                value={formData.categoriaId || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        categoriaId: e.target.value ? Number(e.target.value) : null,
                                    })
                                }
                                disabled={isLoading}
                                className="w-full rounded-lg border py-2 px-3 text-sm transition-all duration-300 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-white dark:focus:border-rose-500/40 light:border-rose-200/50 light:bg-rose-50 light:text-gray-900 focus:outline-none"
                            >
                                <option value="">Selecione uma categoria</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Preços */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-semibold dark:text-white light:text-gray-800">
                                    Preço de Venda <span className="text-rose-400/70 dark:text-rose-400 light:text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.precoVenda}
                                    onChange={(e) => {
                                        setFormData({ ...formData, precoVenda: e.target.value });
                                        if (errors.precoVenda) setErrors({ ...errors, precoVenda: "" });
                                    }}
                                    placeholder="0.00"
                                    disabled={isLoading}
                                    className={`w-full rounded-lg border py-2 px-3 text-sm transition-all duration-300 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-white dark:focus:border-rose-500/40 light:border-rose-200/50 light:bg-rose-50 light:text-gray-900 focus:outline-none ${errors.precoVenda ? "border-red-500" : ""}`}
                                />
                                {errors.precoVenda && (
                                    <p className="mt-1 text-xs text-red-400">{errors.precoVenda}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold dark:text-white light:text-gray-800">
                                    Preço de Compra
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.precoCompra}
                                    onChange={(e) => {
                                        setFormData({ ...formData, precoCompra: e.target.value });
                                        if (errors.precoCompra) setErrors({ ...errors, precoCompra: "" });
                                    }}
                                    placeholder="0.00"
                                    disabled={isLoading}
                                    className={`w-full rounded-lg border py-2 px-3 text-sm transition-all duration-300 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-white dark:focus:border-rose-500/40 light:border-rose-200/50 light:bg-rose-50 light:text-gray-900 focus:outline-none ${errors.precoCompra ? "border-red-500" : ""}`}
                                />
                                {errors.precoCompra && (
                                    <p className="mt-1 text-xs text-red-400">{errors.precoCompra}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold dark:text-white light:text-gray-800">
                                    Preço Promocional
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.precoPromocional}
                                    onChange={(e) => {
                                        setFormData({ ...formData, precoPromocional: e.target.value });
                                        if (errors.precoPromocional) setErrors({ ...errors, precoPromocional: "" });
                                    }}
                                    placeholder="0.00"
                                    disabled={isLoading}
                                    className={`w-full rounded-lg border py-2 px-3 text-sm transition-all duration-300 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-white dark:focus:border-rose-500/40 light:border-rose-200/50 light:bg-rose-50 light:text-gray-900 focus:outline-none ${errors.precoPromocional ? "border-red-500" : ""}`}
                                />
                                {errors.precoPromocional && (
                                    <p className="mt-1 text-xs text-red-400">{errors.precoPromocional}</p>
                                )}
                            </div>
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
                                Produto Ativo
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
                                {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
