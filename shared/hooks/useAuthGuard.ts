
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { Routes } from '../constants/routes';

export function useAuthGuard() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(Routes.ONBOARDING);
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}
