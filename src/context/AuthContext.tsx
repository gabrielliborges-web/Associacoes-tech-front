import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { LoginRequest, SignupRequest } from "../types/auth";
import { loginRequest, signupRequest } from "../lib/auth";
import toast from "react-hot-toast";
import type { User } from "../types/user";
import { useNavigation } from "./NavigationContext";

interface AuthContextProps {
    user: User | null;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    signup: (data: SignupRequest) => Promise<void>;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const { goTo, currentView } = useNavigation();

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false)
    }, []);

    useEffect(() => {
        if (loading) return;

        if (!user && currentView !== "login" && currentView !== "signup") {
            //goTo("login");
        }
    }, [currentView, goTo, loading, user]);


    const login = async (data: LoginRequest) => {
        try {
            const res = await loginRequest(data);
            debugger
            setUser(res.usuario);
            localStorage.setItem("usuario", JSON.stringify(res.usuario));
            localStorage.setItem("token", res.token);
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

    const logout = () => {
        setUser(null);
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        goTo("login");
    };

    const isAuthenticated = !!user;


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
    return context;
}
