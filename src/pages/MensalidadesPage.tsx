import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { mensalidadesApi, type Mensalidade } from "../lib/mensalidades";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../context/NavigationContext";

const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

export default function MensalidadesPage() {
    const { user } = useAuth();
    const { goTo } = useNavigation();
    const [ano, setAno] = useState<number>(new Date().getFullYear());
    const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
    const [loading, setLoading] = useState(false);

    const canManage = useMemo(() => {
        return (
            user?.perfilAssociacao === "ADMINISTRADOR" ||
            user?.perfilAssociacao === "DIRETOR" ||
            user?.perfilAssociacao === "TECNICO"
        );
    }, [user]);

    const load = async () => {
        try {
            setLoading(true);
            let data: Mensalidade[] = [];
            if (canManage && user && user.role !== "USER") {
                // se for manager, pode ver todos (dou preferência para rota admin)
                data = await mensalidadesApi.getMinhasMensalidades(ano);
            } else {
                data = await mensalidadesApi.getMinhasMensalidades(ano);
            }
            setMensalidades(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ano]);

    const handleGerarAno = async () => {
        try {
            setLoading(true);
            await mensalidadesApi.gerarMensalidadesAno(ano);
            await load();
            alert("Mensalidades geradas para o ano " + ano);
        } catch (err: any) {
            alert(err?.message || "Erro ao gerar mensalidades");
        } finally {
            setLoading(false);
        }
    };

    const handlePagar = async (m: Mensalidade) => {
        const confirmar = confirm(`Marcar ${monthNames[m.mes - 1]}/${m.ano} como paga?`);
        if (!confirmar) return;

        const forma = prompt("Forma de pagamento (PIX, DINHEIRO, BOLETO, CREDITO, DEBITO, TRANSFERENCIA, OUTRO)", "PIX");
        if (!forma) return;

        const comprovanteUrl = prompt("URL do comprovante (opcional)");
        const observacoes = prompt("Observações (opcional)");

        try {
            setLoading(true);
            await mensalidadesApi.pagarMensalidade(m.id, {
                dataPagamento: new Date().toISOString(),
                formaPagamento: forma,
                comprovanteUrl: comprovanteUrl || undefined,
                observacoes: observacoes || undefined,
            });
            await load();
            alert("Mensalidade marcada como paga.");
        } catch (err: any) {
            alert(err?.message || "Erro ao marcar como paga");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Mensalidades</h2>
                    <p className="text-sm text-gray-500">Carnê anual dos associados</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => goTo("home")}
                        className="rounded-lg border px-3 py-2 text-sm"
                    >
                        Voltar
                    </button>
                    <select
                        value={ano}
                        onChange={(e) => setAno(Number(e.target.value))}
                        className="rounded-lg border px-3 py-2 text-sm"
                    >
                        <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                        <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                        <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                    </select>
                    <button
                        onClick={handleGerarAno}
                        className="rounded-lg bg-primary-dark-9 px-3 py-2 text-sm text-white"
                    >
                        Gerar ano
                    </button>
                </div>
            </header>

            <section className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="text-left text-sm text-gray-600">
                            <th className="p-2">Mês</th>
                            <th className="p-2">Vencimento</th>
                            <th className="p-2">Valor</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Pagamento</th>
                            <th className="p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center">
                                    Carregando...
                                </td>
                            </tr>
                        ) : mensalidades.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center">
                                    Nenhuma mensalidade encontrada para o ano {ano}.
                                </td>
                            </tr>
                        ) : (
                            mensalidades.map((m) => (
                                <tr key={m.id} className="border-t">
                                    <td className="p-2">{monthNames[m.mes - 1]}</td>
                                    <td className="p-2">{format(new Date(m.vencimento), "dd/MM/yyyy")}</td>
                                    <td className="p-2">R$ {m.valor.toFixed(2)}</td>
                                    <td className="p-2">{m.status}</td>
                                    <td className="p-2">{m.dataPagamento ? format(new Date(m.dataPagamento), "dd/MM/yyyy") : "-"}</td>
                                    <td className="p-2">
                                        {m.status !== "PAGA" && (
                                            <button
                                                onClick={() => handlePagar(m)}
                                                className="rounded-md bg-green-600 px-3 py-1 text-sm text-white"
                                            >
                                                Marcar como paga
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
