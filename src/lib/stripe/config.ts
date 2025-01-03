import { logger } from '../logger';

export const STRIPE_CONFIG = {
  prices: {
    premium: 'price_1QbSj4CQaBQTJmok0tJYAUFW',
    or: 'price_1QbSjiCQaBQTJmokerEqyWVq'
  },
  success_url: `${window.location.origin}/dashboard?success=true`,
  cancel_url: `${window.location.origin}/dashboard?canceled=true`
};

// Validate config
if (!STRIPE_CONFIG.prices.premium || !STRIPE_CONFIG.prices.or) {
  const error = 'Missing Stripe price IDs';
  logger.error(error);
  throw new Error(error);
}