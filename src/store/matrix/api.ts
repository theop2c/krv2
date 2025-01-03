import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logger } from '@/lib/logger';

// Function to save the analysis in Firestore
export async function saveMatrixAnalysisToDb(
  //matrixId: string,
  responses: Record<string, string>,
  name: string,
  userId: string
): Promise<string> {
  try {
    if (!userId) {
      throw new Error('User ID is required to save analysis');
    }

    const analysisData = {
     // matrixId,
      userId, // Ensure userId is included in the document
      name,
      responses: Object.entries(responses).map(([questionId, response]) => ({
        questionId,
        response: response.trim(),
      })),
      createdAt: serverTimestamp(),
    };

    // Log the full Firestore request for debugging
    logger.info('Firestore request:', JSON.stringify(analysisData, null, 2));
    logger.info('Firestore request:', analysisData);

    const docRef = await addDoc(collection(db, 'matrix_analyses'), analysisData);
    logger.info('Analysis saved successfully', { docId: docRef.id });

    return docRef.id;
  } catch (error) {
    logger.error('Error saving analysis', { error: error.message });
    throw error;
  }
}
