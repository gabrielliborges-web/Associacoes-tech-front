import Input from "../common/Input";
import { handleChangeInput } from "../../utils/handleChangeInput";
import Select from "./Select";
import Textarea from "./Textarea";

export interface Field {
    internalName: string;
    label?: string;
    type:
    | "text"
    | "password"
    | "number"
    | "choice"
    | "datetime"
    | "date"
    | "user"
    | "usermulti"
    | "file"
    | "textarea"
    | "genremulti";

    value?: string | number | Date | string[];
    options?: string[];
    required?: boolean;
    colSpan?: 3 | 4 | 6 | 12;
}

export function buildInitialValues(fields: Field[]) {
    return fields.reduce((acc, field) => {
        acc[field.internalName] = field.value ?? "";
        return acc;
    }, {} as Record<string, any>);
}

interface FormsFieldsProps<T extends Record<string, any>> {
    fields: Field[];
    values: T;
    setValues: React.Dispatch<React.SetStateAction<T>>;
}

const colMap: Record<NonNullable<Field["colSpan"]>, string> = {
    3: "md:col-span-3",
    4: "md:col-span-4",
    6: "md:col-span-6",
    12: "md:col-span-12",
};

export default function FormsFields<T extends Record<string, any>>({
    fields,
    values,
    setValues,
}: FormsFieldsProps<T>) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {fields.map((field) => {
                const value = values[field.internalName];
                const showError =
                    field.required &&
                    (value === undefined ||
                        value === null ||
                        value === "" ||
                        (Array.isArray(value) && value.length === 0));

                const commonProps = {
                    name: field.internalName,
                    label: field.label,
                    required: field.required,
                    value,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChangeInput(e, setValues),
                };

                const colSpan = field.colSpan ?? 12;
                const colClass = colMap[colSpan];

                const errorMessage = showError && (
                    <span className="text-[13px] text-red-500 mt-1">Preencha este campo</span>
                );

                switch (field.type) {
                    case "text":
                    case "password":
                    case "number":
                        return (
                            <div key={field.internalName} className={`col-span-12 ${colClass}`}>
                                <Input
                                    {...commonProps}
                                    type={field.type}
                                    placeholder={field.label}
                                />
                            </div>
                        );

                    case "date":
                        return (
                            <div key={field.internalName} className={`col-span-12 ${colClass}`}>
                                <Input
                                    {...commonProps}
                                    type="date"
                                    placeholder={field.label}
                                />
                            </div>
                        );

                    case "datetime":
                        return (
                            <div key={field.internalName} className={`col-span-12 ${colClass}`}>
                                <Input
                                    {...commonProps}
                                    type="datetime-local"
                                    placeholder={field.label}
                                />
                            </div>
                        );

                    case "textarea":
                        return (
                            <div key={field.internalName} className={`col-span-12 ${colClass}`}>
                                <Textarea
                                    name={field.internalName}
                                    label={field.label}
                                    value={value || ""}
                                    onChange={(e) =>
                                        setValues({ ...values, [field.internalName]: e.target.value })
                                    }
                                    required={field.required}
                                />
                            </div>
                        );
                    case "file":
                        const file = values[field.internalName];
                        const fileName = file?.name || (typeof file === "string" ? file.split("/").pop() : "");
                        const previewUrl =
                            file instanceof File
                                ? URL.createObjectURL(file)
                                : typeof file === "string"
                                    ? file
                                    : null;

                        return (
                            <div key={field.internalName} className={`col-span-12 ${colClass}`}>
                                <label
                                    htmlFor={field.internalName}
                                    className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1 block"
                                >
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                <div
                                    className={`relative flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed transition-all
          ${showError ? "border-red-500 bg-red-500/5" : "border-mauve-dark-5 hover:border-primary-dark-6"}
          bg-mauve-dark-3 p-4 cursor-pointer group`}
                                    onClick={() =>
                                        document.getElementById(field.internalName)?.click()
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`w-8 h-8 ${showError ? "text-red-500" : "text-gray-400 group-hover:text-primary-dark-6"}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 16V4m0 0l-4 4m4-4l4 4M4 16h16"
                                        />
                                    </svg>

                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition">
                                        {fileName ? (
                                            <span className="text-white font-medium">{fileName}</span>
                                        ) : (
                                            <>Clique aqui</>
                                        )}
                                    </p>

                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="mt-2 rounded-sm w-full max-w-[200px] h-auto object-cover border border-mauve-dark-5"
                                        />
                                    )}

                                    <input
                                        id={field.internalName}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            setValues((prev) => ({
                                                ...prev,
                                                [field.internalName]: file || null,
                                            }));
                                        }}
                                        className="hidden"
                                    />
                                </div>

                                {showError && (
                                    <span className="text-[13px] text-red-500 mt-1 block">
                                        Preencha este campo
                                    </span>
                                )}
                            </div>
                        );
                    case "genremulti":
                        return (
                            <div key={field.internalName} className={`col-span-12 ${colClass}`}>
                                <GenreMultiField
                                    label={field.label}
                                    value={Array.isArray(values[field.internalName]) ? values[field.internalName] : []}
                                    onChange={(val) => setValues((prev) => ({ ...prev, [field.internalName]: val }))}
                                    required={field.required}
                                />
                                {errorMessage}
                            </div>
                        );


                    case "choice":
                        return (
                            <div key={field.internalName} className={`col-span-12 ${colClass}`}>
                                <Select
                                    name={field.internalName}
                                    label={field.label}
                                    options={field.options?.map((opt) => ({ label: opt, value: opt })) ?? []}
                                    value={values[field.internalName] ?? ""}
                                    onChange={(value: string) =>
                                        setValues((prev) => ({ ...prev, [field.internalName]: value }))
                                    }
                                />
                                {errorMessage}
                            </div>
                        );

                    case "user":
                        return (
                            <div key={field.internalName} className={`col-span-12 ${colClass}`}>
                                <UserField
                                    label={field.label}
                                    value={values[field.internalName] ?? { name: "", image: "" }}
                                    onChange={(val) =>
                                        setValues((prev) => ({ ...prev, [field.internalName]: val }))
                                    }
                                />
                                {errorMessage}
                            </div>
                        );

                    case "usermulti":
                        return (
                            <div key={field.internalName} className={`col-span-12 ${colClass}`}>
                                <UserMultiField
                                    label={field.label}
                                    value={Array.isArray(values[field.internalName]) ? values[field.internalName] : []}
                                    onChange={(val) =>
                                        setValues((prev) => ({ ...prev, [field.internalName]: val }))
                                    }
                                />
                                {errorMessage}
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>

    );
}

function UserField({
    value,
    onChange,
    label,
    required,
}: {
    label?: string;
    value?: { name: string } | { name: string; image: string } | string;
    required?: boolean;
    onChange: (val: { name: string; image: string }) => void;
}) {
    let parsedValue: { name: string; image: string } = { name: "", image: "" };

    try {
        if (typeof value === "object" && value !== null) {
            if (typeof value.name === "string" && value.name.startsWith("{")) {
                const parsed = JSON.parse(value.name);
                parsedValue = {
                    name: parsed.name ?? "",
                    image: parsed.image ?? "",
                };
            } else {
                parsedValue = {
                    name: value.name ?? "",
                    image: (value as any).image ?? "",
                };
            }
        } else if (typeof value === "string") {
            const parsed = JSON.parse(value);
            parsedValue = { name: parsed.name ?? "", image: parsed.image ?? "" };
        }
    } catch {
        parsedValue = { name: "", image: "" };
    }

    const showError = required && !parsedValue.name;
    const hasImage = parsedValue.image && parsedValue.image.startsWith("http");

    return (
        <div className="flex flex-col gap-3 p-4 border border-border-subtle/20 rounded-md bg-mauve-dark-3">
            {label && (
                <label className="font-medium text-sm text-text-secondary-dark flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                    name="name"
                    label="Nome"
                    value={parsedValue.name}
                    required={required}
                    onChange={(e) =>
                        onChange({ ...parsedValue, name: e.target.value })
                    }
                />
                <Input
                    name="image"
                    label="Imagem (URL)"
                    value={parsedValue.image}
                    onChange={(e) =>
                        onChange({ ...parsedValue, image: e.target.value })
                    }
                />
            </div>

            {hasImage && (
                <img
                    src={parsedValue.image}
                    alt="Preview"
                    className="mt-1 rounded-sm w-full max-w-[150px] h-[100px] object-cover border border-mauve-dark-5"
                />
            )}

            {showError && (
                <span className="text-[13px] text-red-500 mt-1">Preencha este campo</span>
            )}
        </div>
    );
}

function UserMultiField({
    label,
    value = [],
    onChange,
    required,
}: {
    label?: string;
    value?: { name: string }[];
    required?: boolean;
    onChange: (val: { name: string }[]) => void;
}) {
    const normalized = value.map((v) => {
        if (!v) return { name: "", image: "" };

        try {
            if (typeof v.name === "string" && v.name.startsWith("{")) {
                const parsed = JSON.parse(v.name);
                return { name: parsed.name ?? "", image: parsed.image ?? "" };
            }
        } catch {
        }

        return { name: v.name ?? "", image: (v as any).image ?? "" };
    });

    const showError = required && normalized.every((u) => !u.name);

    const updateUser = (index: number, updatedUser: { name: string; image: string }) => {
        const updated = normalized.map((u, i) => (i === index ? updatedUser : u));

        onChange(updated);
    };


    const addUser = () =>
        onChange([
            ...value,
            { name: JSON.stringify({ name: "", image: "" }) },
        ]);

    const removeUser = (index: number) => {
        const filtered = value.filter((_, i) => i !== index);
        onChange(filtered);
    };

    return (
        <div className="flex flex-col gap-3 p-4 border border-border-subtle/20 rounded-md bg-mauve-dark-3">
            {label && (
                <label className="font-medium text-sm text-text-secondary-dark flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {normalized.map((user, i) => {
                const hasImage = user.image && user.image.startsWith("http");

                return (
                    <div
                        key={i}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 relative bg-mauve-dark-2 p-3 rounded-md"
                    >
                        <Input
                            name={`user-${i}-name`}
                            label="Nome"
                            value={user.name}
                            required={required}
                            onChange={(e) =>
                                updateUser(i, { ...user, name: e.target.value })
                            }
                        />

                        <div className="flex flex-col gap-1">
                            <Input
                                name={`user-${i}-image`}
                                label="Imagem (URL)"
                                value={user.image}
                                onChange={(e) =>
                                    updateUser(i, { ...user, image: e.target.value })
                                }
                            />
                            {hasImage && (
                                <img
                                    src={user.image}
                                    alt={`Preview ${user.name}`}
                                    className="mt-1 rounded-sm w-full max-w-[150px] h-[100px] object-cover border border-mauve-dark-5"
                                />
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => removeUser(i)}
                            className="absolute -top-2 -right-2 text-red-400 hover:text-red-600 font-bold text-lg"
                            title="Remover"
                        >
                            ×
                        </button>
                    </div>
                );
            })}

            <button
                type="button"
                onClick={addUser}
                className="mt-2 text-sm text-primary-dark-6 hover:text-primary-dark-8 transition"
            >
                + Adicionar
            </button>

            {showError && (
                <span className="text-[13px] text-red-500 mt-1">
                    Adicione pelo menos um item
                </span>
            )}
        </div>
    );
}


function GenreMultiField({
    label,
    value = [],
    onChange,
    required,
}: {
    label?: string;
    value?: { name: string }[];
    required?: boolean;
    onChange: (val: { name: string }[]) => void;
}) {
    const normalized = value.map((v) => ({
        name: v?.name ?? "",
    }));

    const showError = required && normalized.every((g) => !g.name);

    const updateGenre = (index: number, newName: string) => {
        const updated = normalized.map((g, i) => (i === index ? { name: newName } : g));
        onChange(updated);
    };

    const addGenre = () => onChange([...normalized, { name: "" }]);
    const removeGenre = (index: number) =>
        onChange(normalized.filter((_, i) => i !== index));

    return (
        <div className="flex flex-col gap-3 p-4 border border-border-subtle/20 rounded-md bg-mauve-dark-3">
            {label && (
                <label className="font-medium text-sm text-text-secondary-dark flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {normalized.map((genre, i) => (
                <div
                    key={i}
                    className="flex items-center gap-2 bg-mauve-dark-2 p-3 rounded-md relative"
                >
                    <Input
                        name={`genre-${i}-name`}
                        label={`Gênero ${i + 1}`}
                        value={genre.name}
                        required={required}
                        onChange={(e) => updateGenre(i, e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => removeGenre(i)}
                        className="absolute -top-2 -right-2 text-red-400 hover:text-red-600 font-bold text-lg"
                        title="Remover"
                    >
                        ×
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addGenre}
                className="mt-2 text-sm text-primary-dark-6 hover:text-primary-dark-8 transition"
            >
                + Adicionar gênero
            </button>

            {showError && (
                <span className="text-[13px] text-red-500 mt-1">
                    Adicione pelo menos um gênero
                </span>
            )}
        </div>
    );
}


