import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import type { Produto } from "../../lib/produto";

interface ProdutoFormProps {
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
    estoque: string;
    imagem: string;
    ativo: boolean;
}

interface FormErrors {
    [key: string]: string;
}

export default function ProdutoForm({
    onClose,
    onSave,
    initialData,
    isLoading = false,
    categorias,
}: ProdutoFormProps) {
    const [formData, setFormData] = useState<FormData>({
        nome: initialData?.nome || "",
        descricao: initialData?.descricao || "",
        categoriaId: initialData?.categoriaId || null,
        precoVenda: initialData?.precoVenda?.toString() || "",
        precoCompra: initialData?.precoCompra?.toString() || "",
        precoPromocional: initialData?.precoPromocional?.toString() || "",
        estoque: initialData?.estoque?.toString() || "",
        imagem: initialData?.imagem || "",
        ativo: initialData?.ativo ?? true,
    });

    const [imagemFile, setImagemFile] = useState<File | null>(null);
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

        if (formData.precoCompra) {
            const precoCompra = parseFloat(formData.precoCompra);
            if (isNaN(precoCompra) || precoCompra < 0) {
                newErrors.precoCompra = "Preço de compra deve ser um número válido >= 0";
            }
        }

        if (formData.precoPromocional) {
            const precoPromocional = parseFloat(formData.precoPromocional);
            if (isNaN(precoPromocional) || precoPromocional < 0) {
                newErrors.precoPromocional = "Preço promocional deve ser um número válido >= 0";
            } else if (parseFloat(formData.precoVenda) && precoPromocional > parseFloat(formData.precoVenda)) {
                newErrors.precoPromocional = "Preço promocional não pode ser maior que preço de venda";
            }
        }

        const estoque = parseFloat(formData.estoque);
        if (!formData.estoque || isNaN(estoque) || estoque < 0) {
            newErrors.estoque = "Estoque é obrigatório e deve ser maior ou igual a 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagemFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
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
            categoriaId: formData.categoriaId ?? undefined,
            precoVenda: parseFloat(formData.precoVenda),
            precoCompra: formData.precoCompra ? parseFloat(formData.precoCompra) : undefined,
            precoPromocional: formData.precoPromocional ? parseFloat(formData.precoPromocional) : undefined,
            estoque: parseFloat(formData.estoque),
            imagem: imagePreview || undefined,
            ativo: formData.ativo,
            file: imagemFile,
        } as any);

        setFormData({
            nome: "",
            descricao: "",
            categoriaId: null,
            precoVenda: "",
            precoCompra: "",
            precoPromocional: "",
            estoque: "",
            imagem: "",
            ativo: true,
        });
        setImagemFile(null);
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
            estoque: "",
            imagem: "",
            ativo: true,
        });
        setImagemFile(null);
        setImagePreview("");
        setErrors({});
        onClose();
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
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
                        {initialData ? "Editar Produto" : "Novo Produto"}
                    </h1>
                    <p className="mt-1 text-sm text-white/50">
                        {initialData ? "Atualize os detalhes do produto" : "Crie um novo produto no seu catálogo"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                        Imagem do Produto
                    </label>
                    <div className="flex gap-4 flex-col sm:flex-row">
                        {/* Preview */}
                        <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center flex-shrink-0">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-white/30" />
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
                                className="flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold transition-all duration-300 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50"
                            >
                                <Upload className="h-4 w-4" />
                                Fazer Upload
                            </button>
                            <p className="text-xs text-white/50 mt-2">
                                PNG, JPG até 5MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nome */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                        Nome <span className="text-blue-400">*</span>
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
                        placeholder="Descreva o produto..."
                        disabled={isLoading}
                        rows={4}
                    />
                </div>

                {/* Categoria */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
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
                        className="w-full rounded-lg border border-blue-500/20 bg-blue-500/10 text-white py-2 px-3 text-sm transition-all duration-300 focus:border-blue-500/40 focus:outline-none"
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
                        <label className="mb-2 block text-sm font-semibold text-white">
                            Preço de Venda <span className="text-blue-400">*</span>
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
                            className={`w-full rounded-lg border py-2 px-3 text-sm transition-all duration-300 border-blue-500/20 bg-blue-500/10 text-white focus:border-blue-500/40 focus:outline-none ${errors.precoVenda ? "border-red-500" : ""}`}
                        />
                        {errors.precoVenda && (
                            <p className="mt-1 text-xs text-red-400">{errors.precoVenda}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white">
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
                            className={`w-full rounded-lg border py-2 px-3 text-sm transition-all duration-300 border-blue-500/20 bg-blue-500/10 text-white focus:border-blue-500/40 focus:outline-none ${errors.precoCompra ? "border-red-500" : ""}`}
                        />
                        {errors.precoCompra && (
                            <p className="mt-1 text-xs text-red-400">{errors.precoCompra}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white">
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
                            className={`w-full rounded-lg border py-2 px-3 text-sm transition-all duration-300 border-blue-500/20 bg-blue-500/10 text-white focus:border-blue-500/40 focus:outline-none ${errors.precoPromocional ? "border-red-500" : ""}`}
                        />
                        {errors.precoPromocional && (
                            <p className="mt-1 text-xs text-red-400">{errors.precoPromocional}</p>
                        )}
                    </div>
                </div>

                {/* Estoque */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                        Estoque <span className="text-blue-400">*</span>
                    </label>
                    <input
                        type="number"
                        step="1"
                        min="0"
                        value={formData.estoque}
                        onChange={(e) => {
                            setFormData({ ...formData, estoque: e.target.value });
                            if (errors.estoque) setErrors({ ...errors, estoque: "" });
                        }}
                        placeholder="0"
                        disabled={isLoading}
                        className={`w-full rounded-lg border py-2 px-3 text-sm transition-all duration-300 border-blue-500/20 bg-blue-500/10 text-white focus:border-blue-500/40 focus:outline-none ${errors.estoque ? "border-red-500" : ""}`}
                    />
                    {errors.estoque && (
                        <p className="mt-1 text-xs text-red-400">{errors.estoque}</p>
                    )}
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
                        className="h-4 w-4 cursor-pointer rounded border-blue-500/30 bg-blue-500/10 text-blue-500 transition-colors"
                    />
                    <label
                        htmlFor="ativo"
                        className="cursor-pointer text-sm font-medium text-white"
                    >
                        Produto Ativo
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
                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
