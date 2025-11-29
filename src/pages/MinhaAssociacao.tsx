import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMinhaAssociacao, updateMinhaAssociacao } from "../lib/associacao";

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
            // Converte FormData para objeto
            const dataObj: { [key: string]: any } = {};
            formData.forEach((value, key) => {
                dataObj[key] = value;
            });
            await updateMinhaAssociacao(dataObj);
            toast.success("Associação atualizada!");
            setEditMode(false);
            setDadosOriginais(prev => ({ ...prev, ...dataObj }));
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

    // Classes utilitárias para cards, inputs, botões
    const cardClass = "bg-white border border-neutral-200 rounded-2xl p-6 w-full";
    const inputClass = "input w-full border border-neutral-200 rounded-xl p-2 mt-1 text-gray-900 focus:border-primary focus:ring-primary";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-1";
    const btnPrimary = "btn btn-primary w-full md:w-auto px-6 py-2 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition disabled:opacity-60";
    const btnDefault = "btn w-full md:w-auto px-6 py-2 rounded-xl font-bold bg-neutral-100 text-gray-700 border border-neutral-300 hover:bg-neutral-200 transition";

    // Header + card compacto
    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Minha Associação</h1>
                    <p className="text-gray-500 text-base mb-2">Gerencie os dados oficiais do seu baba</p>
                </div>
                <div className={cardClass + " flex items-center gap-4 md:w-[320px]"}>
                    {dados.logoUrl ? (
                        <img src={dados.logoUrl} alt="Logo" className="w-16 h-16 rounded-full border border-neutral-200" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-2xl text-gray-400">?</div>
                    )}
                    <div>
                        <div className="font-bold text-lg text-gray-900">{dados.nome || "Nome da associação"}</div>
                        <div className="text-sm text-gray-500">{dados.apelido}</div>
                        <div className="text-xs text-gray-400">{dados.cidade}{dados.estado ? `/${dados.estado}` : ""}</div>
                    </div>
                </div>
            </div>

            {/* Display ou Edit */}
            {!editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dados da associação */}
                    <div className={cardClass + " flex flex-col gap-4"}>
                        <h2 className="font-semibold text-lg text-gray-900 mb-2">Dados da associação</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className={labelClass}>Nome</span>
                                <div className="text-gray-800 font-medium">{dados.nome}</div>
                            </div>
                            <div>
                                <span className={labelClass}>Apelido</span>
                                <div className="text-gray-800 font-medium">{dados.apelido}</div>
                            </div>
                            <div className="md:col-span-2">
                                <span className={labelClass}>Descrição / Sobre</span>
                                <div className="text-gray-700">{dados.descricao || <span className="italic text-gray-400">Sem descrição</span>}</div>
                            </div>
                            <div>
                                <span className={labelClass}>Cidade</span>
                                <div className="text-gray-800 font-medium">{dados.cidade}</div>
                            </div>
                            <div>
                                <span className={labelClass}>Estado</span>
                                <div className="text-gray-800 font-medium">{dados.estado}</div>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-2 mt-2">
                                <span className={labelClass}>Logo (URL)</span>
                                {dados.logoUrl ? (
                                    <img src={dados.logoUrl} alt="Logo" className="w-10 h-10 rounded-full border border-neutral-200 ml-2" />
                                ) : (
                                    <span className="italic text-gray-400">Não informada</span>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Regras internas */}
                    <div className={cardClass + " flex flex-col gap-4"}>
                        <h2 className="font-semibold text-lg text-gray-900 mb-2">Regras internas</h2>
                        <span className={labelClass}>Regras do baba</span>
                        <div className="text-gray-700 whitespace-pre-line min-h-[80px]">{dados.regrasInternas || <span className="italic text-gray-400">Nenhuma regra cadastrada</span>}</div>
                        <span className="text-xs text-gray-400 mt-1">Descreva aqui as regras combinadas do grupo (ex.: horário de chegada, faltas, disciplina, etc.)</span>
                    </div>
                    {/* Configurações do baba */}
                    <div className={cardClass + " flex flex-col gap-4 md:col-span-2"}>
                        <h2 className="font-semibold text-lg text-gray-900 mb-2">Configurações do baba</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <span className={labelClass}>Horário início</span>
                                <div className="text-gray-800 font-medium">{dados.horarioPadraoInicio || <span className="italic text-gray-400">Não definido</span>}</div>
                            </div>
                            <div>
                                <span className={labelClass}>Horário fim</span>
                                <div className="text-gray-800 font-medium">{dados.horarioPadraoFim || <span className="italic text-gray-400">Não definido</span>}</div>
                            </div>
                            <div>
                                <span className={labelClass}>Tipo de jogo padrão</span>
                                <div className="text-gray-800 font-medium">{TIPO_JOGO_OPCOES.find(opt => opt.value === dados.tipoJogoPadrao)?.label || <span className="italic text-gray-400">Não definido</span>}</div>
                            </div>
                        </div>
                    </div>
                    {/* Botão editar */}
                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button
                            type="button"
                            className={btnPrimary}
                            onClick={() => setEditMode(true)}
                        >
                            Editar informações
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dados da associação */}
                    <div className={cardClass + " flex flex-col gap-4"}>
                        <h2 className="font-semibold text-lg text-gray-900 mb-2">Dados da associação</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nome</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={dados.nome}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Apelido</label>
                                <input
                                    type="text"
                                    name="apelido"
                                    value={dados.apelido}
                                    onChange={handleChange}
                                    className={inputClass}
                                    disabled={loading || saving}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Descrição / Sobre</label>
                                <input
                                    type="text"
                                    name="descricao"
                                    value={dados.descricao}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Sobre a associação"
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Cidade</label>
                                <input
                                    type="text"
                                    name="cidade"
                                    value={dados.cidade}
                                    onChange={handleChange}
                                    className={inputClass}
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Estado</label>
                                <input
                                    type="text"
                                    name="estado"
                                    value={dados.estado}
                                    onChange={handleChange}
                                    className={inputClass}
                                    disabled={loading || saving}
                                />
                            </div>
                            <div className="md:col-span-2 flex items-center gap-2 mt-2">
                                <label className={labelClass}>Logo (URL)</label>
                                <input
                                    type="text"
                                    name="logoUrl"
                                    value={dados.logoUrl}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="URL da logo"
                                    disabled={loading || saving}
                                />
                                {dados.logoUrl && (
                                    <img src={dados.logoUrl} alt="Logo" className="w-10 h-10 rounded-full border border-neutral-200 ml-2" />
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Regras internas */}
                    <div className={cardClass + " flex flex-col gap-4"}>
                        <h2 className="font-semibold text-lg text-gray-900 mb-2">Regras internas</h2>
                        <label className={labelClass}>Regras do baba</label>
                        <textarea
                            name="regrasInternas"
                            value={dados.regrasInternas}
                            onChange={handleChange}
                            className={inputClass + " min-h-[120px]"}
                            maxLength={1000}
                            disabled={loading || saving}
                        />
                        <span className="text-xs text-gray-400 mt-1">Descreva aqui as regras combinadas do grupo (ex.: horário de chegada, faltas, disciplina, etc.)</span>
                    </div>
                    {/* Configurações do baba */}
                    <div className={cardClass + " flex flex-col gap-4 md:col-span-2"}>
                        <h2 className="font-semibold text-lg text-gray-900 mb-2">Configurações do baba</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Horário início</label>
                                <input
                                    type="time"
                                    name="horarioPadraoInicio"
                                    value={dados.horarioPadraoInicio}
                                    onChange={handleChange}
                                    className={inputClass}
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Horário fim</label>
                                <input
                                    type="time"
                                    name="horarioPadraoFim"
                                    value={dados.horarioPadraoFim}
                                    onChange={handleChange}
                                    className={inputClass}
                                    disabled={loading || saving}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Tipo de jogo padrão</label>
                                <select
                                    name="tipoJogoPadrao"
                                    value={dados.tipoJogoPadrao}
                                    onChange={handleChange}
                                    className={inputClass}
                                    disabled={loading || saving}
                                >
                                    {TIPO_JOGO_OPCOES.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Botões de ação */}
                    <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-2 mt-4">
                        <button
                            type="button"
                            className={btnDefault}
                            onClick={handleCancelEdit}
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={btnPrimary}
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
