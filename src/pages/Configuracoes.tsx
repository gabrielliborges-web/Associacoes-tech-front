import React from "react";

const Configuracoes: React.FC = () => {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-2xl font-semibold">Configurações</h1>
                <p className="text-sm text-muted-foreground">Preferências do sistema e tema</p>
            </header>

            <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Aqui ficam as configurações gerais do sistema.</p>
            </div>
        </div>
    );
};

export default Configuracoes;
