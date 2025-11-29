import type { ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface DrawerProps {
    title?: string;
    open: boolean;
    onClose: () => void;
    children?: ReactNode;
    footer?: ReactNode;
    position?: "left" | "right";
    className?: string;
}

export default function Drawer({
    title,
    open,
    onClose,
    children,
    footer,
    position = "right",
    className = "",
}: DrawerProps) {
    return (
        <div
            data-open={open}
            className={clsx(
                "fixed inset-0 z-50 bg-modal-overlay flex",
                "transition-all duration-500 ease-in-out",
                "opacity-0 pointer-events-none",
                "data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto"
            )}
        >

            <div
                onClick={(e) => e.stopPropagation()}
                data-open={open}
                className={clsx(
                    "relative h-full bg-mauve-dark-1 dark:bg-mauve-dark-2 shadow-xl flex flex-col",
                    "transition-transform duration-500 ease-in-out",
                    "w-[90%] sm:w-[75%] md:w-[565px]",
                    position === "right"
                        ? "translate-x-full data-[open=true]:translate-x-0 ml-auto"
                        : "-translate-x-full data-[open=true]:translate-x-0 mr-auto",
                    className
                )}
            >


                <div className="flex items-center justify-between border-b border-border-subtle/20 px-5 py-4">
                    <h2 className="text-lg font-semibold text-text-primary-dark">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-text-secondary-dark hover:text-text-primary-dark transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>


                <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin scrollbar-thumb-[#888]/50 scrollbar-track-transparent">
                    {children}
                </div>


                {footer && (
                    <div className="flex justify-end gap-3 px-5 py-4 border-t border-border-subtle/20">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
