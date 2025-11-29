import React from "react";

const JogosPage: React.FC = () => {
    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Jogos & Partidas</h1>
                    <p className="text-sm text-muted-foreground">Agenda, escalações e presenças</p>
                </div>
                <div>
                    <button className="rounded-md bg-primary px-4 py-2 text-white">Novo jogo</button>
                </div>
            </header>

            <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Aqui vai a agenda de jogos e partidas.</p>
            </div>
        </div>
    );
};

export default JogosPage;
