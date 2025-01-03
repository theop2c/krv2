import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { STRIPE_CONFIG } from './config';
import { getOrCreateCustomer } from './customer';
import { logger } from '../logger';

export async function createCheckoutSession(priceId: string, userId: string): Promise<string> {
  try {
    logger.debug('Creating checkout session', { priceId, userId });
    
    const customerId = await getOrCreateCustomer(userId);
    
    const checkoutSessionRef = collection(db, 'customers', customerId, 'checkout_sessions');
    const docRef = await addDoc(checkoutSessionRef, {
      price: priceId,
      success_url: STRIPE_CONFIG.successUrl,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      allow_promotion_codes: true,
      mode: 'subscription',
      metadata: {
        userId
      }
    });

    return new Promise<string>((resolve, reject) => {
      const unsubscribe = onSnapshot(docRef, (snap) => {
        const data = snap.data();
        if (data?.error) {
          unsubscribe();
          reject(new Error(data.error.message));
        }
        if (data?.url) {
          unsubscribe();
          resolve(data.url);
        }
      });

      setTimeout(() => {
        unsubscribe();
        reject(new Error('Checkout session creation timeout'));
      }, 10000);
    });
  } catch (error) {
    logger.error('Error creating checkout session:', error);
    throw error;
  }
}