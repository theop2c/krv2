import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';

admin.initializeApp();
const db = admin.firestore();

export const saveMatrixAnalysis = functions.https.onRequest(async (req, res) => {
  try {
    logger.info('Incoming request to saveMatrixAnalysis', { method: req.method });

    if (req.method !== 'POST') {
      logger.warn('Invalid request method', { method: req.method });
      res.status(405).send({ error: 'Only POST requests are allowed' });
      return;
    }

    const userId = req.headers['x-user-id'];
    if (!userId) {
      logger.error('Unauthorized request: Missing userId');
      res.status(401).send({ error: 'Unauthorized: Missing userId' });
      return;
    }

    const { matrixId, fileId, responses, name } = req.body;
    if (!matrixId || !fileId || !responses || !name) {
      logger.error('Invalid input data', { body: req.body });
      res.status(400).send({ error: 'Invalid input: Missing required fields' });
      return;
    }

    const formattedResponses = Object.entries(responses).map(([questionId, response]) => ({
      questionId,
      response: (response as string).trim(),
    }));

    const analysisData = {
      matrixId,
      fileId,
      userId,
      name: name.trim(),
      responses: formattedResponses,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    logger.debug('Saving matrix analysis data', analysisData);

    const docRef = await db.collection('matrix_analyses').add(analysisData);

    logger.info('Matrix analysis saved successfully', { analysisId: docRef.id });

    res.status(200).send({ success: true, analysisId: docRef.id });
  } catch (error) {
    logger.error('Error saving matrix analysis', { error: (error as Error).message });
    res.status(500).send({ error: 'Failed to save matrix analysis' });
  }
});