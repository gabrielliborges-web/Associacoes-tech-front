import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMinhaAssociacao, updateMinhaAssociacao } from "../lib/associacao";
import AssociationDisplay from "../components/associacao/AssociationDisplay";
import type { Associacao } from "../lib/associacao";

const TIPO_JOGO_OPCOES = [
    { value: "BABA", label: "Baba" },
    { value: "AMISTOSO", label: "Amistoso" },
    { value: "CAMPEONATO", label: "Campeonato" },
    { value: "TREINO", label: "Treino" },
];

export default function MinhaAssociacao() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [dados, setDados] = useState({
        nome: "",
        apelido: "",
        descricao: "",
        cidade: "",
        estado: "",
        logoUrl: "",
        regrasInternas: "",
        horarioPadraoInicio: "",
        horarioPadraoFim: "",
        tipoJogoPadrao: "BABA",
    });
    const [dadosOriginais, setDadosOriginais] = useState(dados);

    useEffect(() => {
        setLoading(true);
        getMinhaAssociacao()
            .then((data) => {
                setDados((prev) => ({ ...prev, ...data }));
                setDadosOriginais((prev) => ({ ...prev, ...data }));
            })
            .catch(() => toast.error("Erro ao buscar associação"))
            .finally(() => setLoading(false));
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setDados((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            // Garante que tipoJogoPadrao seja correto
            if (!["BABA", "AMISTOSO", "CAMPEONATO", "TREINO"].includes(formData.get("tipoJogoPadrao") as string)) {
                formData.set("tipoJogoPadrao", "BABA");
            }
            // Remove logoUrl se o file for enviado
            if (formData.get("logo") instanceof File && (formData.get("logo") as File).size > 0) {
                formData.delete("logoUrl");
            }
            await updateMinhaAssociacao(formData);
            toast.success("Associação atualizada!");
            setEditMode(false);
            // Atualiza dadosOriginais com resposta da API
            getMinhaAssociacao().then((data) => {
                setDadosOriginais((prev) => ({ ...prev, ...data }));
                setDados((prev) => ({ ...prev, ...data }));
            });
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setSaving(false);
        }
    }

    function handleCancelEdit() {
        setDados(dadosOriginais);
        setEditMode(false);
    }

    // Header + card compacto
    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Minha Associação</h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">Gerencie os dados oficiais do seu baba</p>
            </div>

            {/* Display ou Edit */}
            {!editMode ? (
                <div className="w-full max-w-4xl mx-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Perfil / imagem e dados */}
                        <div className="bg-white dark:bg-neutral-900 border border-green-200 dark:border-green-800 rounded-2xl p-6 shadow-md">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-28 h-28 rounded-full overflow-hidden bg-green-100 dark:bg-green-900 flex items-center justify-center border-2 border-green-300 dark:border-green-700">
                                    {dados.logoUrl ? (
                                        // logoUrl pode ser string vazia
                                        <img src={dados.logoUrl} alt={dados.nome} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-green-600">{(dados.nome || "").charAt(0)}</span>
                                    )}
                                </div>
                                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{dados.nome} {dados.apelido ? <span className="text-sm text-green-600 dark:text-green-300">({dados.apelido})</span> : null}</h2>
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{dados.cidade}{dados.estado ? ` · ${dados.estado}` : ''}</div>
                                <div className="mt-3 flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                                    <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="text-xs text-gray-500">Horário</div>
                                        <div className="font-medium">{dados.horarioPadraoInicio || '--'} - {dados.horarioPadraoFim || '--'}</div>
                                    </div>
                                    <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="text-xs text-gray-500">Tipo</div>
                                        <div className="font-medium">{dados.tipoJogoPadrao || '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Descrição / Sobre</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-line">{dados.descricao || 'Ainda não há descrição.'}</p>
                            </div>
                        </div>

                        {/* Regras */}
                        <div className="bg-white dark:bg-neutral-900 border border-green-200 dark:border-green-800 rounded-2xl p-6 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Regras internas</h3>
                            <p className="mt-3 text-gray-600 dark:text-gray-300 whitespace-pre-line">{dados.regrasInternas || 'Nenhuma regra definida.'}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white hover:opacity-95 transition"
                        >
                            Editar associação
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto flex flex-col gap-8 p-2 md:p-6">
                    <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Editar Associação</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-base font-semibold text-green-700 dark:text-green-300 mb-2">Nome</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={dados.nome}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-600 rounded-xl p-4 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all shadow-sm"
                                    required
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-green-700 dark:text-green-300 mb-2">Apelido</label>
                                <input
                                    type="text"
                                    name="apelido"
                                    value={dados.apelido}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-600 rounded-xl p-4 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all shadow-sm"
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-green-700 dark:text-green-300 mb-2">Descrição / Sobre</label>
                                <textarea
                                    name="descricao"
                                    value={dados.descricao}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-600 rounded-xl p-4 text-lg min-h-[80px] focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all shadow-sm"
                                    placeholder="Sobre a associação"
                                    disabled={loading || saving}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-base font-semibold text-green-700 dark:text-green-300 mb-2">Cidade</label>
                                <input
                                    type="text"
                                    name="cidade"
                                    value={dados.cidade}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-600 rounded-xl p-4 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all shadow-sm"
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-green-700 dark:text-green-300 mb-2">Estado</label>
                                <input
                                    type="text"
                                    name="estado"
                                    value={dados.estado}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-600 rounded-xl p-4 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all shadow-sm"
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-green-700 dark:text-green-300 mb-2">Logo</label>
                                <input
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-600 rounded-xl p-4 text-lg file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-600 file:text-white file:font-bold file:cursor-pointer shadow-sm"
                                    disabled={loading || saving}
                                />
                                {dados.logoUrl && (
                                    <img src={dados.logoUrl} alt="Logo" className="w-16 h-16 rounded-full border-2 border-green-500 mt-2 shadow-md" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 mt-8">
                        <div className="flex-1">
                            <label className="block text-base font-semibold text-green-700 dark:text-green-300 mb-2">Regras internas</label>
                            <textarea
                                name="regrasInternas"
                                value={dados.regrasInternas}
                                onChange={handleChange}
                                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-600 rounded-xl p-4 text-lg min-h-[120px] focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all shadow-sm"
                                maxLength={1000}
                                disabled={loading || saving}
                            />
                            <span className="text-xs text-gray-400 mt-1">Descreva aqui as regras combinadas do grupo (ex.: horário de chegada, faltas, disciplina, etc.)</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-6">
                            <div>
                                <label className="block text-base font-semibold text-green-700 dark:text-green-300 mb-2">Horário início</label>
                                <input
                                    type="time"
                                    name="horarioPadraoInicio"
                                    value={dados.horarioPadraoInicio}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-600 rounded-xl p-4 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all shadow-sm"
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-green-700 dark:text-green-300 mb-2">Horário fim</label>
                                <input
                                    type="time"
                                    name="horarioPadraoFim"
                                    value={dados.horarioPadraoFim}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-600 rounded-xl p-4 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all shadow-sm"
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-green-700 dark:text-green-300 mb-2">Tipo de jogo padrão</label>
                                <select
                                    name="tipoJogoPadrao"
                                    value={dados.tipoJogoPadrao}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-600 rounded-xl p-4 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all shadow-sm"
                                    disabled={loading || saving}
                                >
                                    {TIPO_JOGO_OPCOES.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 justify-end mt-8">
                        <button
                            type="button"
                            className="px-8 py-3 rounded-xl font-bold bg-neutral-100 text-gray-700 border border-neutral-300 hover:bg-neutral-200 hover:scale-105 transition-all duration-200 shadow-sm"
                            onClick={handleCancelEdit}
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-green-600 to-green-700 text-white hover:scale-105 hover:shadow-lg transition-all duration-200 shadow-sm"
                            disabled={loading || saving}
                        >
                            {saving ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </form>
            )}
            {loading && <div className="mt-8 text-center text-gray-400">Carregando dados...</div>}
        </div>
    );
}
