import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, Sparkles, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../context/NavigationContext";
import toast from "react-hot-toast";
import { sendResetCode, validateResetCode, resetPassword } from "../lib/passwordReset";

export default function Login() {
    const { login } = useAuth();
    const { goTo } = useNavigation();
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
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#08050c] via-[#0f0615] to-[#08050c] dark:from-[#08050c] dark:via-[#0f0615] dark:to-[#08050c] from-white via-[#f9ecff] to-[#f6ddff]">
            {/* Efeitos de fundo animados */}
            <div className="pointer-events-none absolute inset-0">
                {/* Dark mode blobs */}
                <div className="dark:absolute hidden dark:block -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#ffa8d5]/30 via-[#c77dff]/20 to-transparent blur-[150px] opacity-70 animate-blob" />
                <div className="dark:absolute hidden dark:block -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#7209b7]/25 via-[#3c096c]/15 to-transparent blur-[150px] opacity-60 animate-blob animation-delay-2000" />
                <div className="dark:absolute hidden dark:block top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/5 via-[#f0cfff]/10 to-transparent blur-[120px]" />

                {/* Light mode blobs */}
                <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#d8b6ef]/40 via-[#f0b5d8]/30 to-transparent blur-[150px] opacity-60 animate-blob dark:hidden" />
                <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#c77dff]/30 via-[#e5b8ff]/20 to-transparent blur-[150px] opacity-50 animate-blob animation-delay-2000 dark:hidden" />
                <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#f0cfff]/30 via-white/40 to-transparent blur-[120px] dark:hidden" />
            </div>

            {/* Conteúdo */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Logo e Título */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f0b5d8] via-[#d4a9ff] to-[#c77dff] shadow-lg shadow-[#c77dff]/50 dark:from-[#f0b5d8] dark:via-[#d4a9ff] dark:to-[#c77dff]">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white dark:text-white from-[#2a143c] dark:from-white">MKP Finanças</h1>
                        <p className="mt-2 text-sm text-white/60 dark:text-white/60 text-[#7c547b]">Controle elegante de suas finanças</p>
                    </div>

                    {/* Card Principal */}
                    <div className="relative rounded-[28px] border border-white/15 dark:border-white/15 bg-white/10 dark:bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:bg-[#0f0615]/95 dark:border-white/5 bg-white/95 border-white/20">
                        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/5 dark:from-white/5 to-transparent opacity-50" />

                        <div className="relative z-10">
                            {step === "login" && (
                                <form onSubmit={handleLoginSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 dark:text-white/80 text-[#2a143c] mb-2">
                                            E-mail
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-white/40 dark:text-white/40 text-[#a260c4]" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="seu@email.com"
                                                className="w-full rounded-xl border border-white/20 dark:border-white/20 bg-white/10 dark:bg-white/10 py-2.5 pl-10 pr-4 text-white dark:text-white placeholder-white/40 dark:placeholder-white/40 transition focus:border-[#f0b5d8] dark:focus:border-[#f0b5d8] focus:outline-none focus:ring-1 focus:ring-[#f0b5d8] dark:focus:ring-[#f0b5d8] border-white/30 dark:border-white/20 bg-white/60 dark:bg-white/10 text-[#1a0f2b] dark:text-white placeholder-[#8e7fa3]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 dark:text-white/80 text-[#2a143c] mb-2">
                                            Senha
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-white/40 dark:text-white/40 text-[#a260c4]" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-white/20 dark:border-white/20 bg-white/10 dark:bg-white/10 py-2.5 pl-10 pr-10 text-white dark:text-white placeholder-white/40 dark:placeholder-white/40 transition focus:border-[#f0b5d8] dark:focus:border-[#f0b5d8] focus:outline-none focus:ring-1 focus:ring-[#f0b5d8] dark:focus:ring-[#f0b5d8] border-white/30 dark:border-white/20 bg-white/60 dark:bg-white/10 text-[#1a0f2b] dark:text-white placeholder-[#8e7fa3]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3.5 text-white/40 dark:text-white/40 hover:text-white/60 dark:hover:text-white/60 transition text-[#a260c4] dark:text-[#a260c4] hover:text-[#c77dff] dark:hover:text-[#c77dff]"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="h-4 w-4 rounded border-white/30 dark:border-white/30 bg-white/10 dark:bg-white/10 text-[#f0b5d8] dark:text-[#f0b5d8] focus:ring-[#f0b5d8] dark:focus:ring-[#f0b5d8] border-[#d8b6ef] dark:border-white/20 bg-white/60 dark:bg-white/10 text-[#c77dff] dark:text-[#c77dff]"
                                            />
                                            <span className="text-sm text-white/70 dark:text-white/70 text-[#7c547b]">Lembre de mim</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setStep("forgot")}
                                            className="text-sm text-[#f0b5d8] dark:text-[#f0b5d8] hover:text-[#ffc0e0] dark:hover:text-[#ffc0e0] transition text-[#c77dff] dark:text-[#f0b5d8] hover:text-[#9d4d9b]"
                                        >
                                            Esqueci a senha
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-11 mt-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[#f0b5d8] via-[#d4a9ff] to-[#c77dff] dark:from-[#f0b5d8] dark:via-[#d4a9ff] dark:to-[#c77dff] shadow-lg shadow-[#f0b5d8]/50 dark:shadow-[#f0b5d8]/50 hover:shadow-[#f0b5d8]/70 dark:hover:shadow-[#f0b5d8]/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed from-[#c77dff] dark:from-[#f0b5d8] to-[#b567e0] dark:to-[#c77dff]"
                                    >
                                        {loading ? "Entrando..." : "Entrar"}
                                    </button>

                                    <div className="relative mt-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/10 dark:border-white/10 border-[#e8d9f1]" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="bg-white/10 dark:bg-white/10 px-2 text-white/60 dark:text-white/60 bg-white/80 dark:bg-[#0f0615] text-[#7c547b] dark:text-white/60">Novo por aqui?</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => goTo("signup")}
                                        className="w-full h-11 mt-4 rounded-xl border border-white/20 dark:border-white/20 bg-white/5 dark:bg-white/5 font-semibold text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/10 hover:border-white/30 dark:hover:border-white/30 transition flex items-center justify-center gap-2 border-[#d8b6ef] dark:border-white/20 bg-white/20 dark:bg-white/5 text-[#2a143c] dark:text-white hover:bg-white/30 dark:hover:bg-white/10"
                                    >
                                        <UserPlus className="h-5 w-5" />
                                        Criar conta
                                    </button>
                                </form>
                            )}

                            {step === "forgot" && (
                                <form onSubmit={handleForgotSubmit} className="space-y-5">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-white dark:text-white text-[#2a143c]">Recuperar acesso</h2>
                                        <p className="text-sm text-white/60 dark:text-white/60 mt-1 text-[#7c547b]">Enviaremos um código para seu e-mail</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 dark:text-white/80 mb-2 text-[#2a143c]">
                                            E-mail
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-white/40 dark:text-white/40 text-[#a260c4]" />
                                            <input
                                                type="email"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                placeholder="seu@email.com"
                                                className="w-full rounded-xl border border-white/20 dark:border-white/20 bg-white/10 dark:bg-white/10 py-2.5 pl-10 pr-4 text-white dark:text-white placeholder-white/40 dark:placeholder-white/40 transition focus:border-[#f0b5d8] dark:focus:border-[#f0b5d8] focus:outline-none focus:ring-1 focus:ring-[#f0b5d8] dark:focus:ring-[#f0b5d8] border-white/30 dark:border-white/20 bg-white/60 dark:bg-white/10 text-[#1a0f2b] dark:text-white placeholder-[#8e7fa3]"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-11 rounded-xl font-semibold text-white bg-gradient-to-r from-[#f0b5d8] via-[#d4a9ff] to-[#c77dff] dark:from-[#f0b5d8] dark:via-[#d4a9ff] dark:to-[#c77dff] shadow-lg shadow-[#f0b5d8]/50 dark:shadow-[#f0b5d8]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed from-[#c77dff] dark:from-[#f0b5d8] to-[#b567e0] dark:to-[#c77dff]"
                                    >
                                        {loading ? "Enviando..." : "Enviar código"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStep("login")}
                                        className="w-full text-sm text-white/60 dark:text-white/60 hover:text-white/80 dark:hover:text-white/80 transition py-2 text-[#7c547b] dark:text-white/60 hover:text-[#5a3d68]"
                                    >
                                        Voltar ao login
                                    </button>
                                </form>
                            )}

                            {step === "reset" && (
                                <form onSubmit={handleResetSubmit} className="space-y-4">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-white dark:text-white text-[#2a143c]">Redefinir senha</h2>
                                        <p className="text-sm text-white/60 dark:text-white/60 mt-1 text-[#7c547b]">Insira o código e a nova senha</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 dark:text-white/80 mb-2 text-[#2a143c]">
                                            Código de recuperação
                                        </label>
                                        <input
                                            type="text"
                                            value={resetCode}
                                            onChange={(e) => setResetCode(e.target.value)}
                                            placeholder="Código de 6 dígitos"
                                            className="w-full rounded-xl border border-white/20 dark:border-white/20 bg-white/10 dark:bg-white/10 py-2.5 px-4 text-white dark:text-white placeholder-white/40 dark:placeholder-white/40 transition focus:border-[#f0b5d8] dark:focus:border-[#f0b5d8] focus:outline-none focus:ring-1 focus:ring-[#f0b5d8] dark:focus:ring-[#f0b5d8] border-white/30 dark:border-white/20 bg-white/60 dark:bg-white/10 text-[#1a0f2b] dark:text-white placeholder-[#8e7fa3]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 dark:text-white/80 mb-2 text-[#2a143c]">
                                            Nova senha
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-white/40 dark:text-white/40 text-[#a260c4]" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-white/20 dark:border-white/20 bg-white/10 dark:bg-white/10 py-2.5 pl-10 pr-4 text-white dark:text-white placeholder-white/40 dark:placeholder-white/40 transition focus:border-[#f0b5d8] dark:focus:border-[#f0b5d8] focus:outline-none focus:ring-1 focus:ring-[#f0b5d8] dark:focus:ring-[#f0b5d8] border-white/30 dark:border-white/20 bg-white/60 dark:bg-white/10 text-[#1a0f2b] dark:text-white placeholder-[#8e7fa3]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 dark:text-white/80 mb-2 text-[#2a143c]">
                                            Confirmar senha
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-white/40 dark:text-white/40 text-[#a260c4]" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-white/20 dark:border-white/20 bg-white/10 dark:bg-white/10 py-2.5 pl-10 pr-4 text-white dark:text-white placeholder-white/40 dark:placeholder-white/40 transition focus:border-[#f0b5d8] dark:focus:border-[#f0b5d8] focus:outline-none focus:ring-1 focus:ring-[#f0b5d8] dark:focus:ring-[#f0b5d8] border-white/30 dark:border-white/20 bg-white/60 dark:bg-white/10 text-[#1a0f2b] dark:text-white placeholder-[#8e7fa3]"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-11 rounded-xl font-semibold text-white bg-gradient-to-r from-[#f0b5d8] via-[#d4a9ff] to-[#c77dff] dark:from-[#f0b5d8] dark:via-[#d4a9ff] dark:to-[#c77dff] shadow-lg shadow-[#f0b5d8]/50 dark:shadow-[#f0b5d8]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 from-[#c77dff] dark:from-[#f0b5d8] to-[#b567e0] dark:to-[#c77dff]"
                                    >
                                        {loading ? "Redefinindo..." : "Redefinir senha"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStep("login")}
                                        className="w-full text-sm text-white/60 dark:text-white/60 hover:text-white/80 dark:hover:text-white/80 transition py-2 text-[#7c547b] dark:text-white/60 hover:text-[#5a3d68]"
                                    >
                                        Voltar ao login
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center text-xs text-white/50 dark:text-white/50 text-[#8e7fa3]">
                        <p>Seus dados estão protegidos com criptografia de ponta a ponta</p>
                    </div>
                </div>
            </div>

            {/* Estilo de animação customizada */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}
