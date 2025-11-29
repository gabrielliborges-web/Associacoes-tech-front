import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, Trophy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { FC } from "react";
import toast from "react-hot-toast";
import { sendResetCode, validateResetCode, resetPassword } from "../lib/passwordReset";

type LoginProps = {
    onSwitchAuth?: (screen: "login" | "signup") => void;
};

const Login: FC<LoginProps> = ({ onSwitchAuth }) => {
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState<"login" | "forgot" | "reset">("login");
    const [resetEmail, setResetEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Restaurar credenciais ao carregar se "Lembre de mim" estava ativado
    useEffect(() => {
        const savedEmail = localStorage.getItem("mkp:rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!email || !password) {
                toast.error("Preencha todos os campos");
                return;
            }

            await login({
                email,
                senha: password,
            });

            // Salvar email se "Lembre de mim" estiver ativado
            if (rememberMe) {
                localStorage.setItem("mkp:rememberedEmail", email);
            } else {
                localStorage.removeItem("mkp:rememberedEmail");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Erro ao fazer login");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!resetEmail) {
                toast.error("Informe seu e-mail");
                return;
            }
            await sendResetCode(resetEmail);
            toast.success("Código enviado para seu e-mail!");
            setStep("reset");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Erro ao enviar código");
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!resetCode || !newPassword || !confirmPassword) {
                toast.error("Preencha todos os campos");
                return;
            }

            if (newPassword !== confirmPassword) {
                toast.error("As senhas não coincidem");
                return;
            }

            await validateResetCode(resetEmail, resetCode);
            await resetPassword(resetEmail, resetCode, newPassword);
            toast.success("Senha redefinida com sucesso!");
            setStep("login");
            setResetEmail("");
            setResetCode("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Erro ao redefinir senha");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-[#060606]">
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Left - Hero (campo de futebol) */}
                <div className="relative w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full h-full rounded-b-3xl lg:rounded-none overflow-hidden">
                        <div className="relative h-full w-full bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 p-8 lg:p-16 text-white">
                            {/* Field lines and center circle */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/40 transform -translate-y-1/2" />
                                <div className="absolute left-1/4 right-1/4 top-1/4 h-[2px] bg-white/20" />
                                <div className="absolute left-1/4 right-1/4 bottom-1/4 h-[2px] bg-white/20" />
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-white/25 w-40 h-40" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(255,255,255,0.02)_100%)]" />
                            </div>

                            <div className="relative z-10 max-w-xl">
                                <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">Bem-vindo à Arena da Associação</h1>
                                <p className="mt-4 text-lg text-emerald-100 max-w-lg">Organize seus jogos, gerencie associados, acompanhe estatísticas e compartilhe a galeria do time — tudo em um só lugar.</p>

                                <div className="mt-8 flex gap-4">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium">
                                        <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.91 4 9.27l5.91-.99L12 2z" /></svg>
                                        Dashboard do time
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm">Agenda & Jogos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Card de login */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                    <div className="w-full max-w-md bg-white dark:bg-[#0b0b0b] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-emerald-600 text-white p-3">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Entrar em campo</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Acesse o painel da sua associação</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            {step === "login" && (
                                <form onSubmit={handleLoginSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                                        <div className="relative mt-2">
                                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="seu@associacao.com"
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                                        <div className="relative mt-2">
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-11 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                                            Lembrar-me
                                        </label>
                                        <button type="button" onClick={() => setStep("forgot")} className="text-sm text-emerald-600 hover:underline">Esqueci minha senha</button>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-3 font-semibold disabled:opacity-60"
                                        >
                                            {loading ? (
                                                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75" /></svg>
                                            ) : null}
                                            {loading ? "Autenticando..." : "Entrar em campo"}
                                        </button>
                                    </div>

                                    <div className="pt-4">
                                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">Novo por aqui?</div>
                                        <div className="mt-3">
                                            <button type="button" onClick={() => onSwitchAuth?.("signup")} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900">Criar minha conta</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {step === "forgot" && (
                                <form onSubmit={handleForgotSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail de recuperação</label>
                                        <div className="relative mt-2">
                                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="seu@associacao.com" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-3 font-semibold disabled:opacity-60">{loading ? "Enviando..." : "Enviar código"}</button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setStep("login")} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2">Voltar ao login</button>
                                    </div>
                                </form>
                            )}

                            {step === "reset" && (
                                <form onSubmit={handleResetSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Código de recuperação</label>
                                        <input value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder="Código" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nova senha</label>
                                        <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="••••••" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar senha</label>
                                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="••••••" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#070707] py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                    </div>
                                    <div>
                                        <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-3 font-semibold disabled:opacity-60">{loading ? "Redefinindo..." : "Redefinir senha"}</button>
                                    </div>
                                    <div>
                                        <button type="button" onClick={() => setStep("login")} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2">Voltar ao login</button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-400">Seus dados estão protegidos</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
