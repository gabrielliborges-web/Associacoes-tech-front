import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AssociacaoPage from "./pages/AssociacaoPage";
import AssociadosPage from "./pages/AssociadosPage";
import JogosPage from "./pages/JogosPage";
import EstatisticasPage from "./pages/EstatisticasPage";
import GaleriaPage from "./pages/GaleriaPage";
import UsuariosPage from "./pages/UsuariosPage";
import Configuracoes from "./pages/Configuracoes";
import { useAuth } from "./context/AuthContext";
import { useNavigation, type AppView } from "./context/NavigationContext";

function renderAuthenticatedView(view: AppView) {
  switch (view) {
    case "home":
      return <Home />;
    case "associacao":
      return <AssociacaoPage />;
    case "associados":
      return <AssociadosPage />;
    case "jogos":
      return <JogosPage />;
    case "estatisticas":
      return <EstatisticasPage />;
    case "galeria":
      return <GaleriaPage />;
    case "usuarios":
      return <UsuariosPage />;
    case "configuracoes":
      return <Configuracoes />;
    default:
      return <NotFound />;
  }
}

function App() {
  const { isAuthenticated } = useAuth();
  const { currentView, goTo } = useNavigation();
  const [authScreen, setAuthScreen] = useState<"login" | "signup">("login");

  // Quando o usuário autenticar, garante que a view atual do app seja 'home'
  useEffect(() => {
    if (isAuthenticated) {
      goTo("home");
    }
  }, [isAuthenticated, goTo]);

  if (!isAuthenticated) {
    return (
      <>
        {authScreen === "signup" ? (
          <Signup onSwitchAuth={(s) => setAuthScreen(s)} />
        ) : (
          <Login onSwitchAuth={(s) => setAuthScreen(s)} />
        )}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </>
    );
  }

  return (
    <>
      <AppLayout>
        {renderAuthenticatedView(currentView)}
      </AppLayout>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
