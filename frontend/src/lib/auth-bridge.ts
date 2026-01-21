import { useAuthStore } from "@/stores/auth";

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const authBridge = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;

    try {
      const storage = localStorage.getItem("auth-storage");
      if (!storage) return null;

      const parsed = JSON.parse(storage);
      return parsed.state?.token || null;
    } catch (error) {
      console.error("Error parsing auth token", error);
      return null;
    }
  },
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;

    try {
      const storage = localStorage.getItem("auth-storage");
      if (!storage) return null;

      const parsed = JSON.parse(storage);
      return parsed.state?.refreshToken || null;
    } catch (error) {
      console.error("Error parsing auth refresh token", error);
      return null;
    }
  },
  logout: () => {
    if (typeof window === "undefined") return;

    useAuthStore.getState().logout();

    window.location.href = "/login";
  },
};
