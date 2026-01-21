import { useAuthStore } from "@/stores/auth";
import { User } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useProfileForm(user: User | null) {
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const { logout, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const success = await updateUser(user.id, { name });
      if (success) {
        toast.success("Alterações salvas com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao salvar alterações");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = name !== user?.name;

  return {
    name,
    setName,
    loading,
    hasChanges,
    handleSave,
    handleLogout,
  };
}
