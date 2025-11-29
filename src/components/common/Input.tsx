import type { ReactNode, ChangeEvent } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type InputType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "datetime-local"
    | "time"
    | "file"
    | "checkbox"
    | "radio"
    | "search"
    | "url"
    | "tel"
    | "range"
    | "color";

interface InputProps {
    name: string;
    label?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: InputType;
    disabled?: boolean;
    required?: boolean;
    icon?: ReactNode;
    className?: string;
    onClear?: () => void;
}

export default function Input({
    name,
    label,
    placeholder,
    value,
    onChange,
    onClear,
    type = "text",
    disabled = false,
    required = false,
    icon,
    className = "",
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const showError =
        required && (value === undefined || value === null || value === "");

    const isDateType =
        type === "date" || type === "datetime-local" || type === "time";

    const showClearButton =
        !isDateType && !disabled && !!value && onClear && String(value).length > 0;

    const isPassword = type === "password";

    return (
        <div
            className={`flex flex-col gap-1 w-full ${className}`}
            onClick={(e) => {
                const input =
                    (e.currentTarget.querySelector("input") as HTMLInputElement) || null;
                if (input && !disabled && isDateType) input.showPicker?.();
            }}
        >
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
                <input
                    id={name}
                    name={name}
                    type={isPassword && showPassword ? "text" : type}
                    {...(onChange
                        ? { value: value ?? "", onChange }
                        : { defaultValue: value ?? "" })}
                    disabled={disabled}
                    autoComplete={type === "password" ? "new-password" : "off"}
                    placeholder={placeholder}
                    className={`
            w-full h-[48px] rounded-sm px-4 ${isDateType ? "pr-4" : "pr-10"
                        } text-[16px]
            bg-mauve-light-1 dark:bg-mauve-dark-2
            border text-text-primary-light dark:text-text-primary-dark
            placeholder:text-mauve-light-10 dark:placeholder:text-mauve-dark-10
            focus:outline-none transition-colors duration-200 cursor-pointer
            ${showError
                            ? "border-red-500 focus:border-red-500"
                            : "border-mauve-light-6 dark:border-mauve-dark-5 focus:border-primary-light-9 dark:focus:border-primary-dark-7"
                        }
            [&::-webkit-calendar-picker-indicator]:opacity-100
            [&::-webkit-calendar-picker-indicator]:invert-[1]
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
          `}
                />

                {!isDateType && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {showClearButton && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClear?.();
                                }}
                                className="transition-all duration-200 ease-in-out opacity-100 scale-100 text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {isPassword && !showClearButton && (
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-dark transition-all"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        )}

                        {!isPassword && !showClearButton && icon && (
                            <div className="text-text-secondary-light dark:text-text-secondary-dark transition-opacity duration-200 opacity-100 pointer-events-none">
                                {icon}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showError && (
                <span className="text-[13px] text-red-500 mt-1">
                    Preencha este campo
                </span>
            )}
        </div>
    );
}
