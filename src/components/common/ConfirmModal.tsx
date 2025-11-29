import { X, AlertCircle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    isDangerous?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isLoading = false,
    isDangerous = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 dark:bg-black/40 light:bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                    onClick={onCancel}
                />
            )}

            {/* Modal */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center px-4 py-8 transition-all duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            >
                <div
                    className={`relative w-full max-w-sm transform rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-transform duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border dark:border-rose-500/20 light:bg-gradient-to-br light:from-white light:to-rose-50/30 light:border light:border-rose-200/50 shadow-2xl ${isOpen ? "scale-100" : "scale-95"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="absolute right-4 top-4 rounded-lg p-2 transition-all duration-300 dark:hover:bg-white/10 light:hover:bg-rose-100/50 disabled:opacity-50"
                    >
                        <X className="h-5 w-5 dark:text-white/60 light:text-gray-400" />
                    </button>

                    {/* Content */}
                    <div className="text-center">
                        {/* Icon */}
                        <div className={`mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center ${isDangerous
                            ? "dark:bg-red-500/20 light:bg-red-100"
                            : "dark:bg-rose-500/20 light:bg-rose-100"
                            }`}>
                            <AlertCircle className={`h-6 w-6 ${isDangerous
                                ? "dark:text-red-400 light:text-red-600"
                                : "dark:text-rose-400 light:text-rose-600"
                                }`} />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold dark:text-white light:text-gray-900 mb-2">
                            {title}
                        </h2>

                        {/* Message */}
                        <p className="dark:text-white/70 light:text-gray-600 mb-8">
                            {message}
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="flex-1 rounded-lg py-2.5 font-semibold transition-all duration-300 dark:text-white dark:hover:bg-white/10 light:text-gray-700 light:hover:bg-gray-100 disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`flex-1 rounded-lg py-2.5 font-semibold text-white transition-all duration-300 disabled:opacity-50 ${isDangerous
                                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 active:scale-95"
                                    : "bg-gradient-to-r from-rose-400 to-rose-500 hover:shadow-lg hover:shadow-rose-400/40 hover:scale-105 active:scale-95"
                                    }`}
                            >
                                {isLoading ? "Deletando..." : confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
