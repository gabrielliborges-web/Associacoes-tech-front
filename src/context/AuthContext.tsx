import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { LoginRequest, SignupRequest, SignupPrimeiroUsuarioRequest, Associacao } from "../types/auth";
import { loginRequest, signupRequest, signupPrimeiroUsuarioRequest } from "../lib/auth";
import toast from "react-hot-toast";
import type { User } from "../types/user";
import { useNavigation } from "./NavigationContext";

interface AuthContextProps {
    user: User | null;
    associacao: Associacao | null;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    signup: (data: SignupRequest) => Promise<void>;
    signupPrimeiroUsuario: (data: SignupPrimeiroUsuarioRequest) => Promise<void>;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [associacao, setAssociacao] = useState<Associacao | null>(null);
    const [loading, setLoading] = useState(true);
    const { goTo } = useNavigation();

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        const storedToken = localStorage.getItem("token");
        const storedAssociacao = localStorage.getItem("associacao");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            if (storedAssociacao) {
                setAssociacao(JSON.parse(storedAssociacao));
            }
        }
        setLoading(false)
    }, []);

    useEffect(() => {
        if (loading) return;

        // Não há mais views de login/signup no NavigationContext
        // A autenticação é gerenciada pelo App.tsx com authScreen local
    }, [loading, user]);


    const login = async (data: LoginRequest) => {
        try {
            const res = await loginRequest(data);
            setUser(res.usuario);
            localStorage.setItem("usuario", JSON.stringify(res.usuario));
            localStorage.setItem("token", res.token);

            if (res.associacao) {
                setAssociacao(res.associacao);
                localStorage.setItem("associacao", JSON.stringify(res.associacao));
            }

            toast.success("Login realizado com sucesso!");
            goTo("home");
        } catch (err: any) {
            console.error("Erro no login:", err);
            toast.error(err.message);
        }
    };

    const signup = async (data: SignupRequest) => {
        try {
            const res = await signupRequest(data);
            setUser(res.usuario);
            localStorage.setItem("usuario", JSON.stringify(res.usuario));
            localStorage.setItem("token", res.token);
            toast.success("Conta criada com sucesso!");
            goTo("home");
        } catch (err: any) {
            console.error("Erro no cadastro:", err);
            toast.error(err.message || "Erro ao cadastrar usuário");
        }
    };

    const signupPrimeiroUsuario = async (data: SignupPrimeiroUsuarioRequest) => {
        try {
            const res = await signupPrimeiroUsuarioRequest(data);
            setUser(res.usuario);
            localStorage.setItem("usuario", JSON.stringify(res.usuario));
            localStorage.setItem("token", res.token);

            if (res.associacao) {
                setAssociacao(res.associacao);
                localStorage.setItem("associacao", JSON.stringify(res.associacao));
            }

            toast.success("Associação criada com sucesso!");
            goTo("home");
        } catch (err: any) {
            console.error("Erro no cadastro:", err);
            toast.error(err.message || "Erro ao criar associação e usuário");
        }
    };

    const logout = () => {
        setUser(null);
        setAssociacao(null);
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        localStorage.removeItem("associacao");
        // Não redireciona - App.tsx detecta ausência de user e mostra tela de login
    };

    const isAuthenticated = !!user;


    return (
        <AuthContext.Provider value={{ user, associacao, isAuthenticated, login, signup, signupPrimeiroUsuario, logout, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
    return context;
}
