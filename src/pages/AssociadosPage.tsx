import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

interface Usuario {
    id: number;
    nome: string;
    apelido?: string;
    email: string;
    numeroCamisaPadrao?: number;
    posicaoPreferida?: string;
    perfilAssociacao: string;
}

const AssociadosPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsuarios() {
            setLoading(true);
            try {
                // Exemplo: GET /usuarios (ajuste conforme backend)
                const res = await api.get("/usuarios");
                setUsuarios(res.data);
            } catch (err) {
                setUsuarios([]);
            } finally {
                setLoading(false);
            }
        }
        fetchUsuarios();
    }, []);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Jogadores / Usuários</h1>
                    <p className="text-sm text-muted-foreground">
                        Listagem de todos os jogadores da associação
                    </p>
                </div>
                <div>
                    <button className="rounded-md bg-primary px-4 py-2 text-white">
                        Novo jogador
                    </button>
                </div>
            </header>

            <div className="rounded-lg border p-4">
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr>
                                <th className="text-left">Nome</th>
                                <th className="text-left">Apelido</th>
                                <th className="text-left">E-mail</th>
                                <th className="text-left">Nº Camisa</th>
                                <th className="text-left">Posição</th>
                                <th className="text-left">Perfil</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.nome}</td>
                                    <td>{u.apelido || "-"}</td>
                                    <td>{u.email}</td>
                                    <td>{u.numeroCamisaPadrao || "-"}</td>
                                    <td>{u.posicaoPreferida || "-"}</td>
                                    <td>{u.perfilAssociacao}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AssociadosPage;
