import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { logger } from '../logger';
import type { StripeSubscription } from './types';

export async function createCheckoutSession(priceId: string, userId: string) {
  try {
    logger.debug('Creating checkout session', { priceId, userId });
    
    // Get user document first to verify user exists
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      logger.error('User not found', { userId });
      throw new Error('User not found');
    }

    // Get or create customer document
    const customersRef = collection(db, 'customers');
    const customerQuery = query(customersRef, where('userId', '==', userId));
    const customerSnapshot = await getDocs(customerQuery);
    
    let customerId;
    if (customerSnapshot.empty) {
      const customerDoc = await addDoc(customersRef, {
        userId,
        email: userDoc.data().email,
        createdAt: new Date()
      });
      customerId = customerDoc.id;
    } else {
      customerId = customerSnapshot.docs[0].id;
    }

    // Create checkout session
    const checkoutSessionRef = collection(db, 'customers', customerId, 'checkout_sessions');
    const docRef = await addDoc(checkoutSessionRef, {
      price: priceId,
      success_url: window.location.origin + '/dashboard?success=true',
      cancel_url: window.location.origin + '/dashboard?canceled=true',
      allow_promotion_codes: true,
      mode: 'subscription',
      metadata: {
        userId
      }
    });

    // Wait for the redirect URL
    return new Promise<string>((resolve, reject) => {
      const unsubscribe = onSnapshot(docRef, (snap) => {
        const { error, url } = snap.data() || {};
        if (error) {
          unsubscribe();
          reject(new Error(error.message));
        }
        if (url) {
          unsubscribe();
          resolve(url);
        }
      });

      // Add timeout
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

export function onSubscriptionStateChange(userId: string, callback: (subscription: StripeSubscription | null) => void) {
  const customersRef = collection(db, 'customers');
  const customerQuery = query(customersRef, where('userId', '==', userId));
  
  return onSnapshot(customerQuery, (snapshot) => {
    if (!snapshot.empty) {
      const customerId = snapshot.docs[0].id;
      const subscriptionsRef = collection(db, 'customers', customerId, 'subscriptions');
      
      const unsubscribe = onSnapshot(subscriptionsRef, (subSnapshot) => {
        const subscription = subSnapshot.docs[0]?.data() as StripeSubscription | undefined;
        callback(subscription || null);
      });
      
      return unsubscribe;
    } else {
      callback(null);
    }
  });
}