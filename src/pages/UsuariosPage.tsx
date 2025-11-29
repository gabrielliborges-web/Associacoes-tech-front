import React from "react";

const UsuariosPage: React.FC = () => {
    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Usuários</h1>
                    <p className="text-sm text-muted-foreground">Gerencie contas com acesso à plataforma</p>
                </div>
                <div>
                    <button className="rounded-md bg-primary px-4 py-2 text-white">Novo usuário</button>
                </div>
            </header>

            <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Aqui vai a lista de usuários e permissões.</p>
            </div>
        </div>
    );
};

export default UsuariosPage;
