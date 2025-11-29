import CampoFutebol from "../components/common/CampoFutebol";

export default function Home() {
    // Simulando busca de dados com delay

    return (
        <div className="space-y-8 pb-6">
            {/* Header */}
            <div className="animate-fade-in space-y-2">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-white/60">
                    Indicadores gerais e visão financeira em tempo real
                </p>
            </div>

            {/* Campo de Futebol Interativo */}
            <CampoFutebol formation="4-3-3" onChange={(posicoes) => {
                // Você pode salvar ou usar as posições dos jogadores aqui
                console.log("Posições dos jogadores:", posicoes);
            }} />

        </div>
    );
}
