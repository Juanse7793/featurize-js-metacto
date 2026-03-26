import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { LoginInput, RegisterInput } from "@/validations";
import type { User } from "@/types";

export function useAuth() {
  const navigate = useNavigate();
  const { setAuth, clearAuth } = useAuthStore();

  async function login(data: LoginInput): Promise<User> {
    const response = await authService.login(data.email, data.password);
    setAuth(response.user, response.access);
    return response.user;
  }

  async function register(data: RegisterInput): Promise<User> {
    const response = await authService.register(
      data.name,
      data.email,
      data.password,
    );
    setAuth(response.user, response.access);
    return response.user;
  }

  function logout(): void {
    clearAuth();
    navigate("/auth");
  }

  return { login, register, logout };
}
