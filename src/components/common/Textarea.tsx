import type { ChangeEvent } from "react";

interface TextareaProps {
    name: string;
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    required?: boolean;
    rows?: number;
    className?: string;
}

export default function Textarea({
    name,
    label,
    placeholder,
    value = "",
    onChange,
    disabled = false,
    required = false,
    rows = 5,
    className = "",
}: TextareaProps) {
    const showError = required && (value === undefined || value === null || value === "");

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
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows={rows}
                    className={`
            w-full rounded-sm px-4 py-3 resize-none
            bg-mauve-light-1 dark:bg-mauve-dark-2
            border text-text-primary-light dark:text-text-primary-dark
            placeholder:text-mauve-light-10 dark:placeholder:text-mauve-dark-10
            focus:outline-none transition-colors duration-200 cursor-pointer
            ${showError
                            ? "border-red-500 focus:border-red-500"
                            : "border-mauve-light-6 dark:border-mauve-dark-5 focus:border-primary-light-9 dark:focus:border-primary-dark-7"
                        }
          `}
                />
            </div>

            {showError && (
                <span className="text-[13px] text-red-500 mt-1">Preencha este campo</span>
            )}
        </div>
    );
}
