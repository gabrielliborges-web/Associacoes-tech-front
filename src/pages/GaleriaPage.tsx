import React from "react";

const GaleriaPage: React.FC = () => {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-2xl font-semibold">Galeria</h1>
                <p className="text-sm text-muted-foreground">Fotos e vídeos dos jogos da associação</p>
            </header>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="h-32 rounded bg-gray-200" />
                <div className="h-32 rounded bg-gray-200" />
                <div className="h-32 rounded bg-gray-200" />
                <div className="h-32 rounded bg-gray-200" />
            </div>
        </div>
    );
};

export default GaleriaPage;
