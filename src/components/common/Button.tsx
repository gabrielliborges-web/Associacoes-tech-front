import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
    variant?: "primary" | "secondary" | "icon";
    children?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    isLoading?: boolean;
}

export default function Button({
    variant = "primary",
    children,
    onClick,
    disabled = false,
    className = "",
    isLoading = false,
}: ButtonProps) {
    const base =
        "font-montserrat rounded-sm transition-colors duration-200 flex items-center justify-center text-[16px] px-5 py-3 disabled:cursor-not-allowed disabled:opacity-70";

    const variants = {
        primary: `
      bg-primary-dark-7 
      hover:bg-primary-dark-8 
      active:bg-primary-dark-6 
      disabled:bg-mauve-dark-9 
      text-white
    `,
        secondary: `
      bg-mauve-dark-2 
      hover:bg-mauve-dark-3 
      active:bg-mauve-dark-4 
      disabled:bg-mauve-dark-5 
      text-white
    `,
        icon: `
      bg-mauve-dark-2 
      hover:bg-mauve-dark-3 
      active:bg-mauve-dark-4 
      disabled:bg-mauve-dark-5 
      w-[44px] h-[44px] 
      flex items-center justify-center 
      text-white
    `,
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
                children
            )}
        </button>
    );
}
