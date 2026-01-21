import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Login } from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";
import { ProfilePage } from "./pages/Profile";
import { CategoriesPage } from "./pages/Categories";
import { useAuthStore } from "./stores/auth";
import { Toaster } from "@/components/ui/sonner";
import { isTokenExpired } from "@/lib/auth-bridge";
import { useEffect } from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (isAuthenticated && token && isTokenExpired(token)) {
      logout();
    }
  }, [isAuthenticated, token, logout]);

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/profile" replace />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout>
                <CategoriesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
