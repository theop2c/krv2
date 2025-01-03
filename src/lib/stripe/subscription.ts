import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { StripeSubscription } from './types';
import { logger } from '../logger';

export function onSubscriptionStateChange(userId: string, callback: (subscription: StripeSubscription | null) => void) {
  const customersRef = collection(db, 'customers');
  const customerQuery = query(customersRef, where('userId', '==', userId));
  
  return onSnapshot(customerQuery, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }

    const customerId = snapshot.docs[0].id;
    const subscriptionsRef = collection(db, 'customers', customerId, 'subscriptions');
    
    return onSnapshot(subscriptionsRef, (subSnapshot) => {
      const subscription = subSnapshot.docs[0]?.data() as StripeSubscription | undefined;
      callback(subscription || null);
    });
  });
}