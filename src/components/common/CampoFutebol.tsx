import React, { useState } from "react";

// Tipos de formação
const FORMATIONS = {
    // Agora as posições são para campo horizontal (x/y invertidos e adaptados)
    "4-3-3": [
        // Goleiro
        { x: 5, y: 50 },
        // Zagueiros
        { x: 20, y: 20 },
        { x: 20, y: 40 },
        { x: 20, y: 60 },
        { x: 20, y: 80 },
        // Meio-campistas
        { x: 40, y: 30 },
        { x: 40, y: 50 },
        { x: 40, y: 70 },
        // Atacantes
        { x: 65, y: 35 },
        { x: 75, y: 50 },
        { x: 65, y: 65 },
        // Ponta
        { x: 90, y: 50 },
    ],
    "4-4-2": [
        { x: 5, y: 50 },
        { x: 20, y: 20 },
        { x: 20, y: 40 },
        { x: 20, y: 60 },
        { x: 20, y: 80 },
        { x: 40, y: 25 },
        { x: 40, y: 40 },
        { x: 40, y: 60 },
        { x: 40, y: 75 },
        { x: 65, y: 35 },
        { x: 65, y: 65 },
        { x: 90, y: 50 },
    ],
    "3-5-2": [
        { x: 5, y: 50 },
        { x: 20, y: 30 },
        { x: 20, y: 50 },
        { x: 20, y: 70 },
        { x: 40, y: 20 },
        { x: 40, y: 35 },
        { x: 40, y: 50 },
        { x: 40, y: 65 },
        { x: 40, y: 80 },
        { x: 65, y: 35 },
        { x: 65, y: 65 },
        { x: 90, y: 50 },
    ],
    "5-3-2": [
        { x: 5, y: 50 },
        { x: 20, y: 10 },
        { x: 20, y: 30 },
        { x: 20, y: 50 },
        { x: 20, y: 70 },
        { x: 20, y: 90 },
        { x: 40, y: 30 },
        { x: 40, y: 50 },
        { x: 40, y: 70 },
        { x: 65, y: 35 },
        { x: 65, y: 65 },
        { x: 90, y: 50 },
    ],
};

const PIN_COLORS = [
    "#16a34a", // Goleiro
    "#2563eb", "#2563eb", "#2563eb", "#2563eb", // Zagueiros
    "#f59e42", "#f59e42", "#f59e42", // Meio
    "#e11d48", "#e11d48", "#e11d48", // Ataque
    "#a21caf", // Ponta
];

export type JogadorPos = { x: number; y: number };

interface CampoFutebolProps {
    formation?: keyof typeof FORMATIONS;
    onChange?: (positions: JogadorPos[]) => void;
}

export const CampoFutebol: React.FC<CampoFutebolProps> = ({ formation = "4-3-3", onChange }) => {
    const [positions, setPositions] = useState<JogadorPos[]>(FORMATIONS[formation]);
    const [dragging, setDragging] = useState<number | null>(null);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Atualiza formação
    const handleFormationChange = (f: keyof typeof FORMATIONS) => {
        setPositions(FORMATIONS[f]);
        if (onChange) onChange(FORMATIONS[f]);
    };

    // Arrastar pino
    const handleMouseDown = (idx: number, e: React.MouseEvent) => {
        setDragging(idx);
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseUp = () => {
        setDragging(null);
        if (onChange) onChange(positions);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragging === null) return;
        const field = document.getElementById("campo-futebol");
        if (!field) return;
        const rect = field.getBoundingClientRect();
        let x = ((e.clientX - rect.left - offset.x) / rect.width) * 100;
        let y = ((e.clientY - rect.top - offset.y) / rect.height) * 100;
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));
        setPositions((prev) => prev.map((p, i) => (i === dragging ? { x, y } : p)));
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-4 flex gap-2 justify-center">
                {Object.keys(FORMATIONS).map((f) => (
                    <button
                        key={f}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${formation === f ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 border-emerald-600"}`}
                        onClick={() => handleFormationChange(f as keyof typeof FORMATIONS)}
                    >
                        {f}
                    </button>
                ))}
            </div>
            <div
                id="campo-futebol"
                className="relative aspect-[3/2] w-full bg-gradient-to-r from-green-700 to-green-500 rounded-3xl border-4 border-green-900 shadow-lg overflow-hidden"
                style={{ minHeight: 400 }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Linhas do campo horizontal */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Linhas horizontais */}
                    <div className="absolute left-0 right-0 top-[20%] h-1 bg-white/30" />
                    <div className="absolute left-0 right-0 top-[50%] h-1 bg-white/30" />
                    <div className="absolute left-0 right-0 bottom-[20%] h-1 bg-white/30" />
                    {/* Linhas verticais */}
                    <div className="absolute top-0 bottom-0 left-[15%] w-1 bg-white/30" />
                    <div className="absolute top-0 bottom-0 left-[50%] w-1 bg-white/30" />
                    <div className="absolute top-0 bottom-0 right-[15%] w-1 bg-white/30" />
                    {/* Grande área esquerda */}
                    <div className="absolute top-[25%] left-0 h-[50%] w-[12%] border-2 border-white/60 rounded-r-2xl" />
                    {/* Grande área direita */}
                    <div className="absolute top-[25%] right-0 h-[50%] w-[12%] border-2 border-white/60 rounded-l-2xl" />
                    {/* Gol esquerdo */}
                    <div className="absolute top-[40%] left-[-2%] h-[20%] w-[3%] bg-gray-200 rounded-r-xl border border-gray-400 shadow-lg" />
                    {/* Gol direito */}
                    <div className="absolute top-[40%] right-[-2%] h-[20%] w-[3%] bg-gray-200 rounded-l-xl border border-gray-400 shadow-lg" />
                </div>
                {/* Pinos dos jogadores */}
                {positions.map((pos, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: "absolute",
                            left: `calc(${pos.x}% - 22px)`,
                            top: `calc(${pos.y}% - 22px)`,
                            zIndex: 10,
                            cursor: "grab",
                            transition: dragging === idx ? "none" : "box-shadow 0.2s",
                        }}
                        onMouseDown={(e) => handleMouseDown(idx, e)}
                    >
                        <div
                            className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-white"
                            style={{
                                background: PIN_COLORS[idx] || "#16a34a",
                                boxShadow: dragging === idx ? "0 0 0 4px #f59e42" : "0 2px 8px #0002",
                            }}
                        >
                            {idx === 0 ? "G" : idx + 1}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
                Arraste os jogadores para montar sua escalação. As posições são salvas em tempo real.
            </div>
        </div>
    );
}

export default CampoFutebol;
