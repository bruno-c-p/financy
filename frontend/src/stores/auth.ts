import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apolloClient } from "@/lib/graphql/apollo";
import type { User, RegisterInput, LoginInput, UpdateUserInput } from "@/types";
import { REGISTER } from "@/lib/graphql/mutations/Register";
import { LOGIN } from "../lib/graphql/mutations/Login";
import { UPDATE_USER } from "@/lib/graphql/mutations/UpdateUser";

type RegisterMutationData = {
  register: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

type LoginMutationData = {
  login: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  updateUser: (id: string, updateData: UpdateUserInput) => Promise<boolean>;
  signup: (data: RegisterInput) => Promise<boolean>;
  login: (data: LoginInput) => Promise<boolean>;
  logout: () => void;
  setTokens: (token: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: async (loginData: LoginInput) => {
        try {
          const { data } = await apolloClient.mutate<
            LoginMutationData,
            { data: LoginInput }
          >({
            mutation: LOGIN,
            variables: {
              data: {
                email: loginData.email,
                password: loginData.password,
              },
            },
          });

          if (data?.login) {
            const { user, token, refreshToken } = data.login;
            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              },
              token,
              refreshToken,
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.log("Erro ao fazer o login");
          throw error;
        }
      },
      signup: async (registerData: RegisterInput) => {
        try {
          const { data } = await apolloClient.mutate<
            RegisterMutationData,
            { data: RegisterInput }
          >({
            mutation: REGISTER,
            variables: {
              data: {
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
              },
            },
          });
          if (data?.register) {
            const { token, user } = data.register;
            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              },
              token,
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.log("Erro ao fazer o cadastro");
          throw error;
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        apolloClient.clearStore();
      },
      updateUser: async (id: string, updateData: UpdateUserInput) => {
        const { data } = await apolloClient.mutate<{
          updateUser: User;
        }>({
          mutation: UPDATE_USER,
          variables: {
            id,
            data: updateData,
          },
        });

        if (data?.updateUser) {
          set((state) => ({
            user: {
              ...state.user!,
              ...data.updateUser,
            },
          }));
          return true;
        }
        return false;
      },
      setTokens: (token: string, refreshToken: string) => {
        set({ token, refreshToken });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
