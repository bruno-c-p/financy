import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isTransactionsPage = location.pathname.startsWith("/transactions");
  const isCategoriesPage = location.pathname.startsWith("/categories");

  const handleProfile = () => {
    navigate("/profile");
  };

  if (!isAuthenticated) return null;

  return (
    <header className="w-full bg-white border-b border-grayscale-200 sticky top-0 z-50">
      <div className="px-8 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Financy" className="h-6" />
        </div>

        <nav className="flex items-center gap-10">
          <span className="text-sm font-normal text-grayscale-500 cursor-pointer hover:text-grayscale-800">
            Dashboard
          </span>
          <Link
            to="/"
            className={`text-sm ${
              isTransactionsPage
                ? "text-brand-base font-semibold"
                : "text-grayscale-500"
            }`}
          >
            <span className="hover:text-grayscale-800">Transações</span>
          </Link>
          <Link
            to="/categories"
            className={`text-sm ${
              isCategoriesPage
                ? "text-brand-base font-semibold"
                : "text-grayscale-500"
            }`}
          >
            <span
              className={`${
                isCategoriesPage ? "" : "hover:text-grayscale-800"
              }`}
            >
              Categorias
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Avatar
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleProfile}
            title="Perfil"
          >
            <AvatarFallback className="bg-grayscale-200 text-grayscale-600 font-medium text-sm">
              {user?.name?.substring(0, 2).toUpperCase() || "CT"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
