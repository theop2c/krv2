import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { onSubscriptionStateChange } from '../client';
import type { StripeSubscription } from '../types';

export function useSubscriptionStatus() {
  const { user } = useAuthStore();
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSubscriptionStateChange(user.id, (sub) => {
      setSubscription(sub);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return {
    subscription,
    loading,
    isActive: subscription?.status === 'active',
    willCancel: subscription?.cancel_at_period_end || false,
    renewalDate: subscription?.current_period_end 
      ? new Date(subscription.current_period_end * 1000)
      : null
  };
}