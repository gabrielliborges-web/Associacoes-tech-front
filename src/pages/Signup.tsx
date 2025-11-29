import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Trophy, User, MapPin, Building2, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import type { FC } from "react";

type SignupProps = {
    onSwitchAuth?: (screen: "login" | "signup") => void;
};

type SignupStep = "usuario" | "associacao";

const Signup: FC<SignupProps> = ({ onSwitchAuth }) => {
    const { signupPrimeiroUsuario } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<SignupStep>("usuario");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Dados do usuário
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Dados da associação
    const [nomeAssociacao, setNomeAssociacao] = useState("");
    const [apelidoAssociacao, setApelidoAssociacao] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();

        // Validações do Step 1
        if (!nomeUsuario.trim()) {
            toast.error("Digite seu nome");
            return;
        }
        if (!email.trim()) {
            toast.error("Digite seu e-mail");
            return;
        }
        if (!senha) {
            toast.error("Digite uma senha");
            return;
        }
        if (senha.length < 8) {
            toast.error("A senha deve ter no mínimo 8 caracteres");
            return;
        }
        if (senha !== confirmPassword) {
            toast.error("As senhas não coincidem");
            return;
        }

        setStep("associacao");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validações do Step 2
        if (!nomeAssociacao.trim()) {
            toast.error("Digite o nome da associação");
            return;
        }

        setLoading(true);
        try {
            await signupPrimeiroUsuario({
                nomeUsuario: nomeUsuario.trim(),
                email: email.trim(),
                senha,
                nomeAssociacao: nomeAssociacao.trim(),
                apelidoAssociacao: apelidoAssociacao.trim() || undefined,
                cidade: cidade.trim() || undefined,
                estado: estado.trim() || undefined,
                theme: "DARK",
            });
        } catch (err: any) {
            console.error("Erro no signup:", err);
            toast.error(err?.message || "Erro ao criar conta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-[#060606]">
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Left - Hero */}
                <div className="relative w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full h-full rounded-b-3xl lg:rounded-none overflow-hidden">
                        <div className="relative h-full w-full bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 p-8 lg:p-16 text-white">
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/40 -translate-y-1/2" />
                                <div className="absolute left-1/4 right-1/4 top-1/4 h-[2px] bg-white/20" />
                                <div className="absolute left-1/4 right-1/4 bottom-1/4 h-[2px] bg-white/20" />
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-white/25 w-40 h-40" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(255,255,255,0.02)_100%)]" />
                            </div>
                            <div className="relative z-10 max-w-xl">
                                <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">Crie a conta da sua Associação</h1>
                                <p className="mt-4 text-lg text-emerald-100 max-w-lg">Organize jogos, cadastre associados e acompanhe estatísticas.</p>
                                <div className="mt-8 flex gap-4">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium">
                                        <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.91 4 9.27l5.91-.99L12 2z" /></svg>
                                        Gestão de jogos
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm">Galeria & Estatísticas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right - Card signup */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                    <div className="w-full max-w-md bg-white dark:bg-[#0b0b0b] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-emerald-600 text-white p-3">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Conta</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {step === "usuario" ? "Passo 1 de 2 - Seus dados" : "Passo 2 de 2 - Dados da associação"}
                                </p>
                            </div>
                        </div>

                        {/* Indicador de progresso */}
                        <div className="mt-6 flex gap-2">
                            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === "usuario" ? "bg-emerald-600" : "bg-emerald-600"}`} />
                            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === "associacao" ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"}`} />
                        </div>

                        <div className="mt-6">
                            {step === "usuario" ? (
                                <form onSubmit={handleNextStep} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seu nome</label>
                                        <div className="relative mt-2">
                                            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                value={nomeUsuario}
                                                onChange={(e) => setNomeUsuario(e.target.value)}
                                                placeholder="Seu nome completo"
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                                        <div className="relative mt-2">
                                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                type="email"
                                                placeholder="seu@email.com"
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                                        <div className="relative mt-2">
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                value={senha}
                                                onChange={(e) => setSenha(e.target.value)}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-11 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar senha</label>
                                        <div className="relative mt-2">
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-11 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-3 font-semibold">
                                            Próximo
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="pt-2">
                                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">Já tem uma conta?</div>
                                        <div className="mt-3">
                                            <button type="button" onClick={() => onSwitchAuth?.("login")} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 dark:text-gray-400">
                                                Fazer login
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da associação *</label>
                                        <div className="relative mt-2">
                                            <Trophy className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                value={nomeAssociacao}
                                                onChange={(e) => setNomeAssociacao(e.target.value)}
                                                placeholder="Ex: Associação Baba do Domingo"
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apelido</label>
                                        <div className="relative mt-2">
                                            <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                value={apelidoAssociacao}
                                                onChange={(e) => setApelidoAssociacao(e.target.value)}
                                                placeholder="Ex: Baba do Zé (opcional)"
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cidade</label>
                                        <div className="relative mt-2">
                                            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                value={cidade}
                                                onChange={(e) => setCidade(e.target.value)}
                                                placeholder="Cidade (opcional)"
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                                        <div className="relative mt-2">
                                            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                value={estado}
                                                onChange={(e) => setEstado(e.target.value.toUpperCase())}
                                                placeholder="UF (opcional)"
                                                maxLength={2}
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep("usuario")}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 font-semibold hover:bg-gray-50 dark:hover:bg-gray-900"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-[2] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-3 font-semibold disabled:opacity-60"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Criando...
                                                </>
                                            ) : (
                                                "Criar minha associação"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                        <div className="mt-6 text-center text-xs text-gray-400">Ao se cadastrar, você aceita os Termos de Serviço</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
