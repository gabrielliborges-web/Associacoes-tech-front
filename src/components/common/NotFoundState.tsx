import { Film } from "lucide-react";
import Button from "./Button";
import { useNavigation, type AppView } from "../../context/NavigationContext";

interface NotFoundStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    redirectView?: AppView;
}

export default function NotFoundState({
    title = "Filme não encontrado",
    description = "Parece que este filme não existe ou foi removido.",
    actionLabel = "Voltar para lista",
    redirectView = "home",
}: NotFoundStateProps) {
    const { goTo } = useNavigation();

    return (
        <div className="flex flex-col items-center justify-center text-center py-24 px-4">
            <Film className="w-16 h-16 text-gray-500 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
            <p className="text-gray-400 mb-6 max-w-md">{description}</p>
            <Button variant="primary" onClick={() => goTo(redirectView)}>
                {actionLabel}
            </Button>
        </div>
    );
}
