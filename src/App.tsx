import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Categorias from "./pages/Categorias";
import NotFound from "./pages/NotFound";
import Produtos from "./pages/Produtos";
import Compras from "./pages/Compras";
import Vendas from "./pages/Vendas";
import EntradasFinanceiras from "./pages/EntradasFinanceiras";
import FinanceiroPage from "./pages/Financeiro";
import Configuracoes from "./pages/Configuracoes";
import { useAuth } from "./context/AuthContext";
import { useNavigation, type AppView } from "./context/NavigationContext";

function renderAuthenticatedView(view: AppView) {
  switch (view) {
    case "home":
      return <Home />;
    case "produtos":
      return <Produtos />;
    case "categorias":
      return <Categorias />;
    case "compras":
      return <Compras />;
    case "vendas":
      return <Vendas />;
    case "entradasFinanceiras":
      return <EntradasFinanceiras />;
    case "financeiro":
      return <FinanceiroPage />;
    case "configuracoes":
      return <Configuracoes />;
    default:
      return <NotFound />;
  }
}

function App() {
  const { isAuthenticated, user } = useAuth();
  const { currentView, goTo } = useNavigation();

  useEffect(() => {
    if (!isAuthenticated && currentView !== "login" && currentView !== "signup") {
      goTo("login");
    }
  }, [isAuthenticated, currentView, goTo]);

  useEffect(() => {
    if (isAuthenticated && user && (currentView === "login" || currentView === "signup")) {
      goTo("home");
    }
  }, [isAuthenticated, user, currentView, goTo]);

  if (!isAuthenticated) {
    return (
      <>
        {currentView === "signup" ? <Signup /> : <Login />}
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
