import { create } from 'zustand';
import { onSubscriptionStateChange } from '@/lib/stripe/client';
import type { StripeSubscription } from '@/lib/stripe/types';
import { logger } from '@/lib/logger';

interface SubscriptionState {
  subscription: StripeSubscription | null;
  loading: boolean;
  error: string | null;
  initialize: (userId: string) => () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  loading: false,
  error: null,

  initialize: (userId: string) => {
    set({ loading: true });
    
    const unsubscribe = onSubscriptionStateChange(userId, (subscription) => {
      set({ 
        subscription,
        loading: false,
        error: null
      });
    });

    return unsubscribe;
  }
}));