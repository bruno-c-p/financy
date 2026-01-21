import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, LogIn } from "lucide-react";
import { useSignupForm } from "@/hooks/useSignupForm";

export function Signup() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    loading,
    handleSubmit,
  } = useSignupForm();

  return (
    <div className="flex flex-col min-h-screen items-center bg-grayscale-100 p-12">
      <div className="mb-8">
        <img src="/logo.svg" alt="Financy Logo" className="h-8" />
      </div>

      <Card className="w-full max-w-[448px]">
        <CardHeader className="space-y-1 text-center p-8">
          <CardTitle className="text-xl font-bold tracking-tight text-grayscale-800">
            Criar conta
          </CardTitle>
          <CardDescription className="text-grayscale-600 text-base">
            Comece a controlar suas finanças ainda hoje
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 group">
              <Label
                htmlFor="name"
                className="text-grayscale-700 font-medium group-focus-within:text-brand-base transition-colors"
              >
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-grayscale-400 group-focus-within:text-brand-base transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="pl-10 h-11 bg-neutral-white border-grayscale-200 focus-visible:ring-primary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2 group">
              <Label
                htmlFor="email"
                className="text-grayscale-700 font-medium group-focus-within:text-brand-base transition-colors"
              >
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-grayscale-400 group-focus-within:text-brand-base transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@exemplo.com"
                  className="pl-10 h-11 bg-neutral-white border-grayscale-200 focus-visible:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2 group">
              <Label
                htmlFor="password"
                className="text-grayscale-700 font-medium group-focus-within:text-brand-base transition-colors"
              >
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-grayscale-400 group-focus-within:text-brand-base transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="pl-10 pr-10 h-11 bg-neutral-white border-grayscale-200 focus-visible:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-grayscale-400 hover:text-grayscale-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-grayscale-500">
                A senha deve ter no mínimo 8 caracteres
              </p>
            </div>

            <Button
              className="w-full h-11 text-base font-semibold bg-brand-base hover:bg-brand-dark"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-neutral-white border-t-transparent"></span>
                  Criando conta...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-grayscale-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-white px-2 text-grayscale-500">
                Ou
              </span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-grayscale-600">Já tem uma conta?</p>
            <Button
              variant="outline"
              className="w-full h-11 text-base font-medium border-grayscale-200 text-grayscale-700 hover:bg-grayscale-100"
              asChild
            >
              <Link to="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Fazer login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
