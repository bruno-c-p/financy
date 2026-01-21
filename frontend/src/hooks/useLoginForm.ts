import { useAuthStore } from "@/stores/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login({ email, password });
      if (success) {
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Falha ao realizar o login!");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    loading,
    handleSubmit,
  };
}
