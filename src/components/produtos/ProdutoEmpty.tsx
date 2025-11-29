import { Plus } from "lucide-react";

interface ProdutoEmptyProps {
    onCreateClick: () => void;
}

export default function ProdutoEmpty({ onCreateClick }: ProdutoEmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-16 text-center backdrop-blur-sm dark:border-rose-500/20 dark:bg-gradient-to-br dark:from-rose-500/5 dark:to-rose-600/5 light:border-rose-200/50 light:bg-rose-50/30">
            {/* Icon */}
            <div className="mb-4 rounded-full p-6 dark:bg-rose-500/10 light:bg-rose-100">
                <span className="text-6xl">📦</span>
            </div>

            {/* Text */}
            <h3 className="mb-2 text-2xl font-bold dark:text-white light:text-gray-900">
                Nenhum Produto Encontrado
            </h3>
            <p className="mb-6 dark:text-white/60 light:text-gray-600">
                Comece adicionando seu primeiro produto ao catálogo.
            </p>

            {/* Button */}
            <button
                onClick={onCreateClick}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-400/40 hover:scale-105 active:scale-95"
            >
                <Plus className="h-5 w-5" />
                Adicionar Produto
            </button>
        </div>
    );
}
