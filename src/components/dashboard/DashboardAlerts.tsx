import * as LucideIcons from "lucide-react";

type CriticalidadeType = "critico" | "aviso" | "info";

interface Alerta {
    id: string;
    tipo: CriticalidadeType;
    titulo: string;
    descricao: string;
    icone: string;
}

interface DashboardAlertsProps {
    alertas: Alerta[];
}

const getAlertStyles = (tipo: CriticalidadeType) => {
    switch (tipo) {
        case "critico":
            return {
                bg: "bg-red-500/10",
                border: "border-red-500/30",
                badge: "bg-red-500/20 text-red-400",
                icon: "text-red-400",
            };
        case "aviso":
            return {
                bg: "bg-yellow-500/10",
                border: "border-yellow-500/30",
                badge: "bg-yellow-500/20 text-yellow-400",
                icon: "text-yellow-400",
            };
        case "info":
            return {
                bg: "bg-blue-500/10",
                border: "border-blue-500/30",
                badge: "bg-blue-500/20 text-blue-400",
                icon: "text-blue-400",
            };
        default:
            return {
                bg: "bg-white/5",
                border: "border-white/10",
                badge: "bg-white/10 text-white/70",
                icon: "text-white/50",
            };
    }
};

export default function DashboardAlerts({
    alertas,
}: DashboardAlertsProps) {
    const getIcon = (iconeName: string) => {
        const icons = LucideIcons as unknown as Record<string, React.ComponentType>;
        return icons[iconeName] as React.ComponentType<{ className: string }> | undefined;
    }; return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-6 backdrop-blur-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Alertas Inteligentes</h3>
                <p className="mt-1 text-sm text-white/60">Notificações importantes</p>
            </div>

            <div className="space-y-3">
                {alertas.map((alerta) => {
                    const styles = getAlertStyles(alerta.tipo);
                    const IconComponent = getIcon(alerta.icone);

                    return (
                        <div
                            key={alerta.id}
                            className={`group flex items-start gap-3 rounded-xl border ${styles.border} ${styles.bg} p-4 transition-all duration-300 hover:border-opacity-50`}
                        >
                            <div className={`mt-1 flex-shrink-0 rounded-lg p-2 ${styles.badge}`}>
                                {IconComponent ? (
                                    <IconComponent className="h-4 w-4" />
                                ) : (
                                    <div className="h-4 w-4" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white">
                                    {alerta.titulo}
                                </p>
                                <p className="mt-1 text-xs text-white/70">
                                    {alerta.descricao}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
