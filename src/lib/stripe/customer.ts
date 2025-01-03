import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { logger } from '../logger';

export async function getOrCreateCustomer(userId: string) {
  try {
    // First verify user exists
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    // Look for existing customer
    const customersRef = collection(db, 'customers');
    const customerQuery = query(customersRef, where('userId', '==', userId));
    const customerSnapshot = await getDocs(customerQuery);

    if (!customerSnapshot.empty) {
      return customerSnapshot.docs[0].id;
    }

    // Create new customer
    const customerDoc = await addDoc(customersRef, {
      userId,
      createdAt: new Date()
    });

    logger.info('Created new customer', { userId, customerId: customerDoc.id });
    return customerDoc.id;
  } catch (error) {
    logger.error('Error in getOrCreateCustomer:', error);
    throw error;
  }
}