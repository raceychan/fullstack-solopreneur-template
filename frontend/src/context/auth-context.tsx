import React, { createContext, useContext, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Config } from "@/config";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { UseMutationResult } from "@tanstack/react-query";
import { PublicUser } from "@/client";

type ErrorResponse = {
  type: string;
  title: string;
  detail: string;
};

interface AuthContextType {
  loginMutation: UseMutationResult<
    void,
    ErrorResponse,
    { email: string; password: string }
  >;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, userName?: string) => void;
  user: PublicUser | undefined;
  isLoading: boolean;
  authError: ErrorResponse | null;
}
const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorResponse | null>(null);
  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const new_error = {
        type: "Network Error",
        title: "Can't connect to server",
        detail: "Please try again later",
      };
      setError(new_error);
    } else {
      setError(error as ErrorResponse);
    }
  };

  const signup = async (email: string, password: string, userName?: string) => {
    try {
      const resp = await AuthService.signup({
        body: { user_name: userName, email: email, password: password },
      });
      if (resp.error) {
        throw resp.error;
      }
      navigate({ to: "/login" });
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const { data: user, isLoading } = useQuery<PublicUser | undefined>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const resp = await AuthService.getPublicUser();
        if (resp.error) {
          throw resp.error;
        }
        return resp.data;
      } catch (error: unknown) {
        handleError(error);
        throw error;
      }
    },
    enabled: isLoggedIn(),
  });

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({
      body: { username: email, password: password },
    });

    if (response.error) {
      throw response.error;
    }
    const token = response.data;
    localStorage.setItem("access_token", token.access_token);
  };

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials.email, credentials.password),
    onSuccess: () => {
      navigate({ to: "/" });
    },
    onError: (error: ErrorResponse) => {
      handleError(error);
    },
  });

  const loginWithGoogle = async (): Promise<void> => {
    window.location.href = `${Config.API_AUTH_URL}/google`;
  };

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    queryClient.setQueryData(["user"], null);
    queryClient.invalidateQueries({ queryKey: ["user"] });
    navigate({ to: "/sign-in" });
  }, [navigate, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        loginMutation,
        loginWithGoogle,
        logout,
        signup,
        user,
        isLoading,
        authError: error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { isLoggedIn };
export default useAuth;