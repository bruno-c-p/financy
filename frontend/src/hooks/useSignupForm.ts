import { useAuthStore } from "@/stores/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MIN_PASSWORD_LENGTH = 8;

export function useSignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const validatePassword = (password: string): boolean => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(
        `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      return;
    }

    setLoading(true);

    try {
      const success = await signup({ name, email, password });
      if (success) {
        toast.success("Cadastro realizado com sucesso!");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao realizar o cadastro");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
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
  };
}
