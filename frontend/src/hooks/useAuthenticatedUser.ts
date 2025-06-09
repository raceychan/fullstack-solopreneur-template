import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/auth-context';
import type { UserProfileDto } from '@/client/types.gen';

/**
 * Hook that ensures user is authenticated and provides type-safe access to user data.
 * Automatically redirects to 401 page if user is null.
 * Returns a non-null user, allowing TypeScript to infer proper types.
 */
export function useAuthenticatedUser(): UserProfileDto {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate({ to: '/401' });
    }
  }, [user, navigate]);

  // TypeScript assertion - we redirect if user is null, so this should never be null
  // in the consuming component after the redirect effect runs
  return user as UserProfileDto;
}