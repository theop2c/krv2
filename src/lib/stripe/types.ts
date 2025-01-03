export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  features: string[];
  price: number;
}

export interface StripeSubscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | null;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

export type SubscriptionTier = 'gratuit' | 'premium' | 'or';

export interface StripeWebhookHandlers {
  'customer.subscription.created': (event: any) => Promise<void>;
  'customer.subscription.updated': (event: any) => Promise<void>;
  'customer.subscription.deleted': (event: any) => Promise<void>;
  'payment_intent.succeeded': (event: any) => Promise<void>;
}