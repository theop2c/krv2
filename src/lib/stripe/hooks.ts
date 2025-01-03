import { useEffect } from 'react';
import { useSubscriptionStore } from '@/store/subscription';
import { useAuthStore } from '@/store/auth';

export function useSubscription() {
  const { user } = useAuthStore();
  const { initialize, checkStatus, status, loading, error } = useSubscriptionStore();

  useEffect(() => {
    if (user) {
      const unsubscribe = initialize(user.id);
      checkStatus(user.id);
      return unsubscribe;
    }
  }, [user, initialize, checkStatus]);

  return { status, loading, error };
}