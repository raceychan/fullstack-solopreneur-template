import React, { createContext, useContext, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { loginGetTokenApiV1TokenPost, getUserApiV1MeGet } from '@/client/sdk.gen';
import type { PublicUser, ProblemDetail } from '@/client/types.gen';
import { AxiosError } from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getAccessToken, setAccessToken } from "@/utils/auth-utils"

interface AuthContextType {
  user: PublicUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, userName?: string) => Promise<void>;
  loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



function useUserQuery() {
  return useQuery<PublicUser | null, unknown>({
    queryKey: ['me'],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) return null;

      const resp = await getUserApiV1MeGet();
      if (resp.error) {
        // Log error and stack trace
        const error = new Error(`getUserMeGet error: ${JSON.stringify(resp.error)}`);
        console.error(error);
        console.error(error.stack);
        throw error; // Optionally throw to trigger React Query's error state
      }
      return resp.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useUserQuery();

  const handleError = (error: unknown): string => {
    if (error instanceof AxiosError) {
      const new_error: ProblemDetail = {
        type_: "Network Error",
        status: 500,
        title: "Can't connect to server",
        detail: "Please try again later",
        instance: "Network Error",
      };
      return JSON.stringify(new_error);
    }
    return String(error);
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const resp = await loginGetTokenApiV1TokenPost({
        body: { username: email, password },
      });
      if (resp.error) {
        throw new Error(resp.error.toString());
      }
      const token_data = resp.data
      setAccessToken(token_data.access_token, token_data.expires_in)
      await queryClient.invalidateQueries({ queryKey: ['me'] });
    } catch (err: any) {
      throw new Error(handleError(err));
    }
  }, [queryClient, navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    queryClient.setQueryData(['me'], undefined);
    console.log("You are being logged out ")
    navigate({ to: '/sign-in' });
  }, [queryClient, navigate]);

  const signup = useCallback(async () => {
    throw new Error('Signup not implemented');
  }, []);

  const loginWithGoogle = useCallback(() => {
    throw new Error('Google login not implemented');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error: error ? handleError(error) : null,
        login,
        logout,
        signup,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
;