import React from "react";

const AssociacaoPage: React.FC = () => {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-2xl font-semibold">Minha Associação</h1>
                <p className="text-sm text-muted-foreground">
                    Configure os dados da sua associação: nome, logo, cidade e regras do baba.
                </p>
            </header>

            {/* Placeholder para formulário de edição da associação */}
            <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                    Aqui vai o formulário de cadastro/edição da associação.
                </p>
            </div>
        </div>
    );
};

export default AssociacaoPage;
