import React from "react";

const EstatisticasPage: React.FC = () => {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-2xl font-semibold">Estatísticas</h1>
                <p className="text-sm text-muted-foreground">Artilharia, presenças, cartões e rankings</p>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">Card placeholder - Artilharia</div>
                <div className="rounded-lg border p-4">Card placeholder - Presenças</div>
                <div className="rounded-lg border p-4">Card placeholder - Rankings</div>
            </div>
        </div>
    );
};

export default EstatisticasPage;
