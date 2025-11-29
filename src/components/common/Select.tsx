import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
    label?: string;
    value: string | number;
    content?: ReactNode;
}

interface SelectProps {
    name: string;
    label?: string;
    value?: string | number;
    onChange?: (value: string) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

export default function Select({
    name,
    label,
    value,
    onChange,
    options,
    placeholder = "Selecione...",
    disabled = false,
    required = false,
    className = "",
}: SelectProps) {
    const showError =
        required && (value === undefined || value === null || value === "");

    return (
        <div className={`flex flex-col gap-1 w-full ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className={`text-sm font-medium transition-colors duration-200 ${showError
                        ? "text-red-500"
                        : "text-text-secondary-light dark:text-text-secondary-dark"
                        }`}
                >
                    {label}
                </label>
            )}

            <div className="relative w-full">
                <select
                    id={name}
                    name={name}
                    disabled={disabled}
                    value={value ?? ""}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={`
            w-full h-[48px] appearance-none rounded-sm px-4 pr-10 text-[16px]
            bg-mauve-light-1 dark:bg-mauve-dark-2
            border text-text-primary-light dark:text-text-primary-dark
            focus:outline-none transition-colors duration-200 cursor-pointer
            ${showError
                            ? "border-red-500 focus:border-red-500"
                            : "border-mauve-light-6 dark:border-mauve-dark-5 focus:border-primary-light-9 dark:focus:border-primary-dark-7"
                        }
          `}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option
                            key={opt.value}
                            value={opt.value}
                            dangerouslySetInnerHTML={
                                typeof opt.content === "string"
                                    ? { __html: opt.content }
                                    : undefined
                            }
                        >
                            {typeof opt.content === "string" ? null : opt.content || opt.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark pointer-events-none" />
            </div>

            {showError && (
                <span className="text-[13px] text-red-500 mt-1">
                    Preencha este campo
                </span>
            )}
        </div>
    );
}
