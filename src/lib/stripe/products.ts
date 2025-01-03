import { logger } from '../logger';

export const STRIPE_PRICES = {
  premium: 'price_1QbSj4CQaBQTJmok0tJYAUFW',
  or: 'price_1QbSjiCQaBQTJmokerEqyWVq'
} as const;

if (!STRIPE_PRICES.premium || !STRIPE_PRICES.or) {
  const error = 'Missing Stripe price IDs';
  logger.error(error);
  throw new Error(error);
}

export const SUBSCRIPTION_TIERS = {
  freemium: {
    name: 'Freemium',
    features: [
      '5MB storage',
      '10 files',
      'Basic document analysis',
      'Standard support'
    ],
    price: 0
  },
  premium: {
    name: 'Premium',
    features: [
      '20MB storage',
      '50 files',
      'Advanced document analysis',
      'Priority support',
      'Custom analysis matrices'
    ],
    price: 8,
    priceId: STRIPE_PRICES.premium
  },
  or: {
    name: 'Gold',
    features: [
      '50MB storage',
      'Unlimited files',
      'Premium document analysis',
      '24/7 priority support',
      'Custom analysis matrices',
      'Advanced AI features',
      'Team collaboration'
    ],
    price: 18,
    priceId: STRIPE_PRICES.or
  }
} as const;