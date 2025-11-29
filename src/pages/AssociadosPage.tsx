import React from "react";

const AssociadosPage: React.FC = () => {
    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Associados</h1>
                    <p className="text-sm text-muted-foreground">Listagem de jogadores e associados</p>
                </div>
                <div>
                    <button className="rounded-md bg-primary px-4 py-2 text-white">Novo associado</button>
                </div>
            </header>

            <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Aqui vai a lista de associados (tabela/lista).</p>
            </div>
        </div>
    );
};

export default AssociadosPage;
