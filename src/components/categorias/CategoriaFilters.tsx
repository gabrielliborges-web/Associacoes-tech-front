import { Search, Filter } from "lucide-react";

interface CategoriaFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: "todos" | "ativas" | "inativas";
    onStatusChange: (value: "todos" | "ativas" | "inativas") => void;
}

export default function CategoriaFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
}: CategoriaFiltersProps) {
    return (
        <div className="rounded-xl sm:rounded-2xl border p-3 sm:p-4 backdrop-blur-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 dark:border-white/10 dark:bg-gradient-to-br dark:from-white/5 dark:to-white/2 light:border-gray-200 light:bg-white">
            {/* Busca */}
            <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 -translate-y-1/2 dark:text-white/40 light:text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 pl-9 sm:pl-10 text-xs sm:text-sm transition-all duration-300 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/50 dark:focus:border-white/30 dark:focus:bg-white/10 light:border-gray-200 light:bg-gray-50 light:text-gray-900 light:placeholder-gray-500 light:focus:border-primary-500 light:focus:bg-white"
                />
            </div>

            {/* Filtro de Status */}
            <div className="flex items-center gap-2 min-w-fit">
                <Filter className="h-3.5 sm:h-4 w-3.5 sm:w-4 dark:text-white/60 light:text-gray-500 flex-shrink-0" />
                <select
                    value={statusFilter}
                    onChange={(e) =>
                        onStatusChange(e.target.value as "todos" | "ativas" | "inativas")
                    }
                    className="rounded-lg border px-2 sm:px-3 py-2 text-xs sm:text-sm transition-all duration-300 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30 dark:focus:bg-white/10 light:border-gray-200 light:bg-white light:text-gray-900 light:focus:border-primary-500"
                >
                    <option value="todos" className="dark:bg-[#13081a] dark:text-white light:bg-white light:text-gray-900">
                        Todas
                    </option>
                    <option value="ativas" className="dark:bg-[#13081a] dark:text-white light:bg-white light:text-gray-900">
                        Ativas
                    </option>
                    <option value="inativas" className="dark:bg-[#13081a] dark:text-white light:bg-white light:text-gray-900">
                        Inativas
                    </option>
                </select>
            </div>
        </div>
    );
}
