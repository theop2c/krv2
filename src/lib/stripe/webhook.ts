import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { logger } from '../logger';
import type { SubscriptionTier } from './types';

// Map Stripe price IDs to user roles
const PRICE_ROLE_MAP: Record<string, SubscriptionTier> = {
  'price_1QbSj4CQaBQTJmok0tJYAUFW': 'premium', // Replace with your actual premium price ID
  'price_1QbSjiCQaBQTJmokerEqyWVq': 'or'       // Replace with your actual gold price ID
};

export async function handleSubscriptionChange(
  event: any
) {
  try {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const priceId = subscription.items.data[0].price.id;
    const status = subscription.status;

    // Get user document by customer ID
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('stripeCustomerId', '==', customerId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      logger.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;

    // Determine new role based on subscription status and price
    let newRole: SubscriptionTier = 'gratuit';
    if (status === 'active' && priceId in PRICE_ROLE_MAP) {
      newRole = PRICE_ROLE_MAP[priceId];
    }

    // Update user role in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole,
      subscriptionStatus: status,
      subscriptionUpdatedAt: new Date(),
      subscriptionPriceId: status === 'active' ? priceId : null
    });

    logger.info('User subscription updated:', { 
      userId, 
      newRole, 
      status,
      priceId 
    });
  } catch (error) {
    logger.error('Error handling subscription change:', error);
    throw error;
  }
}

export async function handlePaymentSuccess(
  event: any
) {
  try {
    const paymentIntent = event.data.object;
    const customerId = paymentIntent.customer;

    // Get user document
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('stripeCustomerId', '==', customerId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      logger.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;

    // Update payment status in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      lastPaymentStatus: 'succeeded',
      lastPaymentDate: new Date()
    });

    logger.info('Payment success recorded:', { userId });
  } catch (error) {
    logger.error('Error handling payment success:', error);
    throw error;
  }
}