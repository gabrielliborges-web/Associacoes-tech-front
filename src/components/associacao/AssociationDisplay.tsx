import type { Associacao } from "../../lib/associacao";

type Props = {
    associacao: Partial<Associacao>;
    onEdit?: () => void;
};

export default function AssociationDisplay({ associacao, onEdit }: Props) {
    const {
        nome,
        apelido,
        descricao,
        cidade,
        estado,
        logoUrl,
        regrasInternas,
        horarioPadraoInicio,
        horarioPadraoFim,
        tipoJogoPadrao,
    } = associacao || {};

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 border border-green-200 dark:border-green-800 rounded-3xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-green-100 dark:bg-green-900 flex items-center justify-center border-2 border-green-300 dark:border-green-700 shadow-md">
                            {logoUrl ? (
                                <img src={logoUrl} alt={nome ?? "Logo"} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-5xl md:text-6xl font-bold text-green-400">{(apelido || nome || "A").charAt(0).toUpperCase()}</div>
                            )}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 space-y-4">
                        {/* Name and Edit Button */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{nome || "Minha Associação"}</h2>
                                {apelido && <p className="text-lg text-green-600 dark:text-green-300 mt-1">{apelido}</p>}
                                <p className="text-gray-500 dark:text-gray-400 mt-2">
                                    <svg className="w-4 h-4 inline mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    {cidade ? `${cidade}${estado ? `, ${estado}` : ""}` : "Localização não informada"}
                                </p>
                            </div>
                            <button
                                onClick={onEdit}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
                                    <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                                </svg>
                                Editar
                            </button>
                        </div>

                        {/* Description */}
                        {descricao && (
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed border-l-4 border-green-500 pl-4">
                                {descricao}
                            </p>
                        )}

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {/* Regras */}
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Regras Internas
                                </h3>
                                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                    {regrasInternas || <span className="italic text-gray-400">Nenhuma regra definida</span>}
                                </div>
                            </div>

                            {/* Configurações */}
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    Configurações
                                </h3>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Horário padrão:</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-2">
                                            {horarioPadraoInicio || "--"} — {horarioPadraoFim || "--"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Tipo de jogo:</span>
                                        <span className="text-sm font-medium text-green-700 dark:text-green-300 ml-2 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                                            {tipoJogoPadrao || "BABA"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
