import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
    icon: LucideIcon;
    title: string;
    value: number | string;
    variation: number;
    format?: "currency" | "percentage" | "number";
}

export default function DashboardCard({
    icon: Icon,
    title,
    value,
    variation,
    format = "currency",
}: DashboardCardProps) {
    const isPositive = variation >= 0;
    const formattedValue =
        format === "currency"
            ? `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : format === "percentage"
                ? `${value}%`
                : value;

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:from-white/8 hover:to-white/4 hover:shadow-lg dark:border-white/10 dark:from-white/5 dark:to-white/2 dark:hover:border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark-9/0 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

            <div className="relative flex items-start justify-between">
                <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-primary-dark-9/30 to-primary-dark-8/20 p-2.5 text-primary-dark-9 transition-transform duration-300 group-hover:scale-110">
                            <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                            {title}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-bold text-white">{formattedValue}</h3>

                        <div
                            className={`inline-flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            <span>{isPositive ? "↑" : "↓"}</span>
                            <span>{Math.abs(variation)}%</span>
                            <span className="text-xs font-normal text-white/50">vs mês</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-gradient-to-br from-primary-dark-9/5 to-transparent blur-2xl transition-all duration-300 group-hover:h-32 group-hover:w-32" />
        </div>
    );
}
