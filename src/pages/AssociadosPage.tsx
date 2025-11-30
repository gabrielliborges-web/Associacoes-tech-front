import React, { useEffect, useState } from "react";
import { associadoApi, type Associado, type CreateAssociadoData, type UpdateAssociadoData } from "../lib/associado";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const posicoes = ["GOLEIRO", "ZAGUEIRO", "LATERAL", "VOLANTE", "MEIA", "ATACANTE"];
const pernas = ["DIREITA", "ESQUERDA", "AMBIDESTRO"];

function AssociadoCard({ associado, onEdit, onDelete }: {
    associado: Associado;
    onEdit: (a: Associado) => void;
    onDelete: (id: number) => void;
}) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md p-4 flex items-center gap-4 border border-green-200 dark:border-green-800">
            <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-green-100 dark:bg-green-900 flex items-center justify-center border-2 border-green-300 dark:border-green-700">
                    {associado.avatarUrl ? (
                        <img src={associado.avatarUrl} alt={associado.nome} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-2xl font-bold text-green-600">{associado.nome.charAt(0)}</span>
                    )}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-green-900 dark:text-green-200">{associado.nome}</span>
                    {associado.apelido && <span className="text-green-600 dark:text-green-300 text-sm">({associado.apelido})</span>}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${associado.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{associado.ativo ? "Ativo" : "Inativo"}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <span>Nº Camisa: <b>{associado.numeroCamisaPadrao || "-"}</b></span>
                    <span>Posição: <b>{associado.posicaoPreferida || "-"}</b></span>
                    <span>Perna: <b>{associado.pernaDominante || "-"}</b></span>
                    <span>Telefone: <b>{associado.telefone || "-"}</b></span>
                </div>
                <div className="mt-1 text-xs text-gray-400 truncate">{associado.email}</div>
            </div>
            <div className="flex flex-col gap-2">
                <button onClick={() => onEdit(associado)} className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700">Editar</button>
                <button onClick={() => onDelete(associado.id)} className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600">Desativar</button>
            </div>
        </div>
    );
}

function AssociadoForm({ associacaoId, onSave, initial, onCancel }: {
    associacaoId: number;
    onSave: (data: CreateAssociadoData | UpdateAssociadoData, id?: number) => void;
    initial?: Partial<Associado>;
    onCancel: () => void;
}) {
    const [form, setForm] = useState<CreateAssociadoData>(initial ? {
        nome: initial.nome || "",
        apelido: initial.apelido || "",
        email: initial.email || "",
        dataNascimento: initial.dataNascimento || "",
        telefone: initial.telefone || "",
        fotoUrl: initial.avatarUrl || "",
        numeroCamisaPadrao: initial.numeroCamisaPadrao,
        posicaoPreferida: initial.posicaoPreferida as any,
        pernaDominante: initial.pernaDominante as any,
        ativo: initial.ativo ?? true,
        observacoes: initial.observacoes || ""
    } : {
        nome: "",
        apelido: "",
        email: "",
        dataNascimento: "",
        telefone: "",
        fotoUrl: "",
        numeroCamisaPadrao: undefined,
        posicaoPreferida: undefined,
        pernaDominante: undefined,
        ativo: true,
        observacoes: ""
    });
    const [saving, setSaving] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value, type } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(form, initial?.id);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md p-6 border border-green-200 dark:border-green-800 max-w-xl mx-auto flex flex-col gap-4">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">{initial ? "Editar Associado" : "Novo Associado"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <input name="nome" value={form.nome} onChange={handleChange} required placeholder="Nome" className="rounded-lg border-green-300 dark:border-green-700 p-2 bg-white dark:bg-neutral-800" />
                    <input name="apelido" value={form.apelido} onChange={handleChange} placeholder="Apelido" className="rounded-lg border-green-300 dark:border-green-700 p-2 bg-white dark:bg-neutral-800" />
                    <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="E-mail" className="rounded-lg border-green-300 dark:border-green-700 p-2 bg-white dark:bg-neutral-800" />
                    <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" className="rounded-lg border-green-300 dark:border-green-700 p-2 bg-white dark:bg-neutral-800" />
                    <input name="numeroCamisaPadrao" value={form.numeroCamisaPadrao ?? ""} onChange={handleChange} type="number" placeholder="Nº Camisa" className="rounded-lg border-green-300 dark:border-green-700 p-2 bg-white dark:bg-neutral-800" />
                </div>
                <div className="flex flex-col gap-2">
                    <select name="posicaoPreferida" value={form.posicaoPreferida ?? ""} onChange={handleChange} className="rounded-lg border-green-300 dark:border-green-700 p-2 bg-white dark:bg-neutral-800">
                        <option value="">Posição</option>
                        {posicoes.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select name="pernaDominante" value={form.pernaDominante ?? ""} onChange={handleChange} className="rounded-lg border-green-300 dark:border-green-700 p-2 bg-white dark:bg-neutral-800">
                        <option value="">Perna dominante</option>
                        {pernas.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <input name="dataNascimento" value={form.dataNascimento ?? ""} onChange={handleChange} type="date" placeholder="Nascimento" className="rounded-lg border-green-300 dark:border-green-700 p-2 bg-white dark:bg-neutral-800" />
                    <textarea name="observacoes" value={form.observacoes ?? ""} onChange={handleChange} placeholder="Observações" className="rounded-lg border-green-300 dark:border-green-700 p-2 bg-white dark:bg-neutral-800" />
                </div>
            </div>
            <div className="flex gap-4 justify-end mt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg bg-neutral-100 text-gray-700 border border-neutral-300 hover:bg-neutral-200">Cancelar</button>
                <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700">{saving ? "Salvando..." : initial ? "Salvar" : "Criar"}</button>
            </div>
        </form>
    );
}

const AssociadosPage: React.FC = () => {
    const { associacao } = useAuth();
    const [associados, setAssociados] = useState<Associado[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState<Associado | null>(null);

    async function fetchAssociados() {
        if (!associacao?.id) return;
        setLoading(true);
        try {
            const data = await associadoApi.listAssociados(associacao.id);
            setAssociados(data);
        } catch (err) {
            toast.error("Erro ao buscar associados");
            setAssociados([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAssociados();
        // eslint-disable-next-line
    }, [associacao?.id]);

    async function handleSave(data: CreateAssociadoData | UpdateAssociadoData, id?: number) {
        try {
            if (id) {
                await associadoApi.updateAssociado(id, data);
                toast.success("Associado atualizado!");
            } else {
                await associadoApi.createAssociado(associacao!.id, data as CreateAssociadoData);
                toast.success("Associado criado!");
            }
            setShowForm(false);
            setEditData(null);
            fetchAssociados();
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Erro ao salvar associado");
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm("Deseja realmente desativar este associado?")) return;
        try {
            await associadoApi.deactivateAssociado(id);
            toast.success("Associado desativado!");
            fetchAssociados();
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Erro ao desativar associado");
        }
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">Associados</h1>
                    <p className="text-sm text-muted-foreground">Gerencie os jogadores e membros da sua associação</p>
                </div>
                <div>
                    <button
                        className="rounded-lg bg-green-600 hover:bg-green-700 px-5 py-2 text-white font-bold shadow-md"
                        onClick={() => { setShowForm(true); setEditData(null); }}
                    >
                        Novo Associado
                    </button>
                </div>
            </header>

            {showForm && (
                <AssociadoForm
                    associacaoId={associacao!.id}
                    onSave={handleSave}
                    initial={editData ?? undefined}
                    onCancel={() => { setShowForm(false); setEditData(null); }}
                />
            )}

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center text-gray-400">Carregando...</div>
                ) : (
                    associados.length === 0 ? (
                        <div className="text-center text-gray-400">Nenhum associado cadastrado.</div>
                    ) : (
                        associados.map((a) => (
                            <AssociadoCard
                                key={a.id}
                                associado={a}
                                onEdit={(a) => { setEditData(a); setShowForm(true); }}
                                onDelete={handleDelete}
                            />
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default AssociadosPage;
