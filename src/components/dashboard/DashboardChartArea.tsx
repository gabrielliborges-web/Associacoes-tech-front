import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
    data: string;
    receitas: number;
    despesas: number;
}

interface DashboardChartAreaProps {
    data: ChartDataPoint[];
}

export default function DashboardChartArea({ data }: DashboardChartAreaProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        Receitas vs Despesas
                    </h3>
                    <p className="mt-1 text-sm text-white/60">Últimos 30 dias</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8E4EC6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8E4EC6" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="data"
                        stroke="rgba(255,255,255,0.5)"
                        style={{ fontSize: "12px" }}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        style={{ fontSize: "12px" }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(20, 20, 30, 0.95)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "12px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                        }}
                        formatter={(value) =>
                            `R$ ${Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`
                        }
                        labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="line"
                        formatter={(value) => (
                            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
                                {value === "receitas" ? "Receitas" : "Despesas"}
                            </span>
                        )}
                    />
                    <Area
                        type="monotone"
                        dataKey="receitas"
                        stroke="#8E4EC6"
                        fillOpacity={1}
                        fill="url(#colorReceitas)"
                        isAnimationActive={true}
                        animationDuration={800}
                    />
                    <Area
                        type="monotone"
                        dataKey="despesas"
                        stroke="#FF6B6B"
                        fillOpacity={1}
                        fill="url(#colorDespesas)"
                        isAnimationActive={true}
                        animationDuration={800}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
