import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type CoreView =
    | "home"
    | "associacao"
    | "associados"
    | "jogos"
    | "estatisticas"
    | "galeria"
    | "usuarios"
    | "configuracoes";

export type AppView = CoreView;

interface NavigationContextValue {
    currentView: AppView;
    goTo: (view: AppView) => void;
    isCurrent: (view: AppView) => boolean;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

const DEFAULT_VIEW: AppView = "home";

function isValidView(value: string): value is AppView {
    return (
        value === "home" ||
        value === "associacao" ||
        value === "associados" ||
        value === "jogos" ||
        value === "estatisticas" ||
        value === "galeria" ||
        value === "usuarios" ||
        value === "configuracoes"
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
    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error("useNavigation deve ser usado dentro de NavigationProvider");
    }
    return context;
}
