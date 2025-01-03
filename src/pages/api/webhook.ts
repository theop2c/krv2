import { handleSubscriptionChange, handlePaymentSuccess } from '@/lib/stripe/webhook';
import { logger } from '@/lib/logger';

const webhookHandlers: StripeWebhookHandlers = {
  'customer.subscription.created': handleSubscriptionChange,
  'customer.subscription.updated': handleSubscriptionChange,
  'customer.subscription.deleted': handleSubscriptionChange,
  'payment_intent.succeeded': handlePaymentSuccess
};

export async function handleWebhook(req: Request) {
  try {
    const event = await req.json();
    const handler = webhookHandlers[event.type as keyof StripeWebhookHandlers];

    if (handler) {
      await handler(event);
      return new Response('Webhook handled successfully', { status: 200 });
    }

    return new Response(`Unhandled webhook type: ${event.type}`, { status: 400 });
  } catch (error) {
    logger.error('Webhook error:', error);
    return new Response('Webhook error', { status: 500 });
  }
}