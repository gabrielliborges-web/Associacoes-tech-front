import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMinhaAssociacao, updateMinhaAssociacao } from "../lib/associacao";

const TIPO_JOGO_OPCOES = [
    { value: "BABA", label: "Baba" },
    { value: "AMISTOSO", label: "Amistoso" },
    { value: "CAMPEONATO", label: "Campeonato" },
    { value: "TREINO", label: "Treino" },
];

const getTipoJogoLabel = (tipo?: string) => {
    return TIPO_JOGO_OPCOES.find((opt) => opt.value === tipo)?.label || tipo || "-";
};

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
        ativa: true,
        usuarios: [],
        jogos: [],
        galerias: [],
        configMensalidade: null as any,
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
            if (!["BABA", "AMISTOSO", "CAMPEONATO", "TREINO"].includes(formData.get("tipoJogoPadrao") as string)) {
                formData.set("tipoJogoPadrao", "BABA");
            }
            if (formData.get("logo") instanceof File && (formData.get("logo") as File).size > 0) {
                formData.delete("logoUrl");
            }
            await updateMinhaAssociacao(formData);
            toast.success("Associação atualizada!");
            setEditMode(false);
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

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-center text-gray-400">Carregando dados da associação...</div>
            </div>
        );
    }

    if (editMode) {
        return <EditAssociationForm dados={dados} handleChange={handleChange} handleSubmit={handleSubmit} handleCancelEdit={handleCancelEdit} saving={saving} loading={loading} />;
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header / Profile Banner */}
            <AssociationHeaderProfile dados={dados} onEdit={() => setEditMode(true)} />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <AssociationStatsCards dados={dados} />

                {/* Content Grid */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sobre + Regras (left) */}
                    <div className="lg:col-span-2 space-y-6">
                        <AssociationAboutCard descricao={dados.descricao} />
                        <AssociationRulesCard regrasInternas={dados.regrasInternas} />
                    </div>

                    {/* Settings (right) */}
                    <div>
                        <AssociationSettingsCard dados={dados} />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========================================
   HEADER / PROFILE COMPONENT
======================================== */
function AssociationHeaderProfile({ dados, onEdit }: { dados: any; onEdit: () => void }) {
    return (
        <div className="relative w-full">
            {/* Cover Image / Faixa */}
            <div className="h-32 sm:h-40 relative"></div>

            {/* Content overlay */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 relative z-10 pb-6">
                    {/* Logo + Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        {/* Logo */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-700 flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
                            {dados.logoUrl ? (
                                <img src={dados.logoUrl} alt={dados.nome} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-300">
                                    {(dados.nome || "").charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 pb-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{dados.nome}</h1>
                            {dados.apelido && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Também conhecido como: <span className="font-semibold">{dados.apelido}</span>
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {dados.cidade}
                                    {dados.estado && ` · ${dados.estado}`}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${dados.ativa ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                                    {dados.ativa ? "Ativa" : "Inativa"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botão Editar */}
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition whitespace-nowrap"
                    >
                        Editar associação
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ========================================
   STATS CARDS COMPONENT
======================================== */
function AssociationStatsCards({ dados }: { dados: any }) {
    const stats = [
        { label: "Associados", value: dados.usuarios?.length || 0, icon: "👥" },
        { label: "Jogos", value: dados.jogos?.length || 0, icon: "⚽" },
        { label: "Álbuns", value: dados.galerias?.length || 0, icon: "📸" },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}

/* ========================================
   ABOUT CARD COMPONENT
======================================== */
function AssociationAboutCard({ descricao }: { descricao?: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Sobre a associação</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {descricao || (
                    <span className="italic text-gray-400">
                        Nenhuma descrição cadastrada ainda. Clique em editar para contar a história da sua associação.
                    </span>
                )}
            </p>
        </div>
    );
}

/* ========================================
   RULES CARD COMPONENT
======================================== */
function AssociationRulesCard({ regrasInternas }: { regrasInternas?: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Regras internas</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {regrasInternas || (
                    <span className="italic text-gray-400">
                        Nenhuma regra interna cadastrada. Adicione as regras do baba para organizar a casa.
                    </span>
                )}
            </p>
        </div>
    );
}

/* ========================================
   SETTINGS CARD COMPONENT
======================================== */
function AssociationSettingsCard({ dados }: { dados: any }) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Configurações do baba</h2>

            {/* Tipo de Jogo */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">Tipo de jogo padrão</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{getTipoJogoLabel(dados.tipoJogoPadrao)}</p>
            </div>

            {/* Horário */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">Horário padrão</p>
                {dados.horarioPadraoInicio && dados.horarioPadraoFim ? (
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {dados.horarioPadraoInicio} às {dados.horarioPadraoFim}
                    </p>
                ) : (
                    <p className="text-base text-gray-400 italic">Não configurado</p>
                )}
            </div>

            {/* Mensalidade */}
            {dados.configMensalidade ? (
                <>
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">Valor mensalidade</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            R$ {Number(dados.configMensalidade.valorPadrao || 0).toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">Dia de vencimento</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Dia {dados.configMensalidade.diaVencimento}</p>
                    </div>
                </>
            ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Mensalidade não configurada. Configure na seção de Mensalidades.
                </div>
            )}
        </div>
    );
}

/* ========================================
   EDIT FORM COMPONENT
======================================== */
function EditAssociationForm({
    dados,
    handleChange,
    handleSubmit,
    handleCancelEdit,
    saving,
    loading,
}: {
    dados: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleCancelEdit: () => void;
    saving: boolean;
    loading: boolean;
}) {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Editar Associação</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Grid de campos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                        <input
                            type="text"
                            name="nome"
                            value={dados.nome}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                            required
                            disabled={loading || saving}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Apelido</label>
                        <input
                            type="text"
                            name="apelido"
                            value={dados.apelido}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                            disabled={loading || saving}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cidade</label>
                        <input
                            type="text"
                            name="cidade"
                            value={dados.cidade}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                            disabled={loading || saving}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Estado</label>
                        <input
                            type="text"
                            name="estado"
                            value={dados.estado}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                            disabled={loading || saving}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipo de jogo padrão</label>
                        <select
                            name="tipoJogoPadrao"
                            value={dados.tipoJogoPadrao}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                            disabled={loading || saving}
                        >
                            {TIPO_JOGO_OPCOES.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Logo</label>
                        <input
                            type="file"
                            name="logo"
                            accept="image/*"
                            className="w-full text-sm text-gray-600 dark:text-gray-400 file:bg-blue-600 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-2 file:cursor-pointer"
                            disabled={loading || saving}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Horário início</label>
                        <input
                            type="time"
                            name="horarioPadraoInicio"
                            value={dados.horarioPadraoInicio}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                            disabled={loading || saving}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Horário fim</label>
                        <input
                            type="time"
                            name="horarioPadraoFim"
                            value={dados.horarioPadraoFim}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                            disabled={loading || saving}
                        />
                    </div>
                </div>

                {/* Descrição */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Descrição / Sobre</label>
                    <textarea
                        name="descricao"
                        value={dados.descricao}
                        onChange={handleChange}
                        placeholder="Conte a história da sua associação..."
                        className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition min-h-[100px]"
                        disabled={loading || saving}
                    />
                </div>

                {/* Regras Internas */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Regras internas</label>
                    <textarea
                        name="regrasInternas"
                        value={dados.regrasInternas}
                        onChange={handleChange}
                        placeholder="Descreva as regras combinadas do grupo..."
                        className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition min-h-[120px]"
                        maxLength={1000}
                        disabled={loading || saving}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{dados.regrasInternas.length} / 1000 caracteres</span>
                </div>

                {/* Botões */}
                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        onClick={handleCancelEdit}
                        disabled={saving}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                        disabled={loading || saving}
                    >
                        {saving ? "Salvando..." : "Salvar alterações"}
                    </button>
                </div>
            </form>
        </div>
    );
}
