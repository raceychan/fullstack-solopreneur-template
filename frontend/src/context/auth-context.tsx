import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { loginGetTokenTokenPost, getUserMeGet } from '@/client/sdk.gen';
import type { PublicUser, OAuth2Token } from '@/client/types.gen';

interface AuthContextType {
  user: PublicUser | undefined;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, userName?: string) => Promise<void>;
  loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getToken() {
  return localStorage.getItem('access_token');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch user if token exists
  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(undefined);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const resp = await getUserMeGet();
      if ('data' in resp && resp.data) {
        setUser(resp.data as PublicUser);
      } else {
        setUser(undefined);
      }
    } catch (err: any) {
      setUser(undefined);
      setError('Failed to fetch user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await loginGetTokenTokenPost({
        body: { username: email, password },
      });

      if (resp.error) {
        setError(resp.error.toString());
        return;
      }
      else{
        const token = resp.data.access_token;
        localStorage.setItem('access_token', token);
        await fetchUser();
        navigate({ to: '/' });
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to login');
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser, navigate]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(undefined);
    navigate({ to: '/sign-in' });
  }, [navigate]);

  // Signup stub (implement if backend supports it)
  const signup = useCallback(async (email: string, password: string, userName?: string) => {
    setError('Signup not implemented');
    // Implement signup logic if/when backend supports it
  }, []);

  // Google login stub
  const loginWithGoogle = useCallback(() => {
    setError('Google login not implemented');
    // Implement Google login if/when backend supports it
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, logout, signup, loginWithGoogle }}
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