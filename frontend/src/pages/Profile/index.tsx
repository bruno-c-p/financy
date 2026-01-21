import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, User, Mail } from "lucide-react";
import { useProfileForm } from "@/hooks/useProfileForm";
import { useAuthStore } from "@/stores/auth";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { name, setName, loading, handleSave, handleLogout } =
    useProfileForm(user);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-80px)] bg-grayscale-100">
      <Card className="w-full max-w-[480px] shadow-sm border-grayscale-200">
        <CardContent className="pt-10 pb-10 px-8 flex flex-col items-center">
          <Avatar className="size-16 mb-4">
            <AvatarFallback className="bg-grayscale-200 text-grayscale-600 text-2xl font-medium">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-xl font-semibold text-grayscale-900 mb-1">
            {user.name}
          </h1>
          <p className="text-sm text-grayscale-500 mb-0">{user.email}</p>

          <div className="w-full h-px bg-grayscale-200 my-6" />

          <div className="w-full space-y-6">
            <div className="space-y-2 group">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-grayscale-700 group-focus-within:text-brand-base transition-colors"
              >
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-grayscale-400 group-focus-within:text-brand-base transition-colors" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-grayscale-700 group-focus-within:text-brand-base transition-colors"
              >
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-grayscale-400 group-focus-within:text-brand-base transition-colors" />
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="pl-10 h-11 bg-grayscale-100 text-grayscale-500"
                />
              </div>
              <p className="text-xs text-grayscale-400">
                O e-mail não pode ser alterado
              </p>
            </div>

            <div className="pt-2 space-y-3">
          <Button
            type="submit"
            className="w-full h-11 bg-brand-base hover:bg-brand-dark text-neutral-white font-medium"
            disabled={loading}
            onClick={handleSave}
          >
                {loading ? "Salvando..." : "Salvar alterações"}
              </Button>

              <Button
                variant="outline"
                className="w-full h-11 border-grayscale-200 hover:bg-grayscale-200 flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 text-feedback-danger" />
                <span className="text-grayscale-700">Sair da conta</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
