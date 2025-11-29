import Button from "../components/common/Button";
import { useNavigation } from "../context/NavigationContext";

export default function NotFound() {
    const { goTo } = useNavigation();

    return (
        <main className="relative w-full flex items-center justify-center text-center">

            <div className="relative z-10 max-w-lg mx-auto p-8 bg-[#ebeaf8]/[0.06] border border-[#ebeaf8]/[0.08] rounded-md backdrop-blur-sm shadow-lg flex flex-col items-center gap-6">
                <h1 className="text-7xl font-extrabold text-primary-dark-9">404</h1>
                <h2 className="text-2xl font-semibold text-text-primary-dark">
                    Página não encontrada
                </h2>
                <p className="text-text-secondary-dark max-w-md">
                    Opa! Parece que você tentou acessar uma página que não existe ou foi
                    movida. Que tal voltar para a página inicial?
                </p>

                <Button variant="primary" className="px-6 py-3" onClick={() => goTo("home")}>
                    Voltar para Home
                </Button>
            </div>
        </main>
    );
}
