import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type CoreView =
    | "home"
    | "produtos"
    | "categorias"
    | "compras"
    | "vendas"
    | "entradasFinanceiras"
    | "financeiro"
    | "configuracoes"
    | "login"
    | "signup";

export type AppView = CoreView;

interface NavigationContextValue {
    currentView: AppView;
    goTo: (view: AppView) => void;
    isCurrent: (view: AppView) => boolean;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

const DEFAULT_VIEW: AppView = "login";

function isValidView(value: string): value is AppView {
    return (
        value === "home" ||
        value === "produtos" ||
        value === "compras" ||
        value === "vendas" ||
        value === "entradasFinanceiras" ||
        value === "financeiro" ||
        value === "configuracoes" ||
        value === "login" ||
        value === "signup"
    );
}

export function NavigationProvider({ children }: { children: ReactNode }) {
    const [currentView, setCurrentView] = useState<AppView>(() => {
        try {
            const stored = localStorage.getItem("app:view");
            if (stored && isValidView(stored)) {
                return stored;
            }
        } catch (error) {
            console.error("Erro ao recuperar view salva", error);
        }
        return DEFAULT_VIEW;
    });

    useEffect(() => {
        try {
            localStorage.setItem("app:view", currentView);
        } catch (error) {
            console.error("Erro ao salvar view", error);
        }
    }, [currentView]);

    const goTo = useCallback((view: AppView) => {
        setCurrentView((prev) => {
            if (prev === view) {
                return prev; // evita re-render redundante
            }
            return view;
        });
    }, []);

    const isCurrent = useCallback((view: AppView) => currentView === view, [currentView]);

    const value = useMemo(
        () => ({
            currentView,
            goTo,
            isCurrent,
        }),
        [currentView, goTo, isCurrent]
    );
    console.log(currentView)
    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error("useNavigation deve ser usado dentro de NavigationProvider");
    }
    return context;
}
