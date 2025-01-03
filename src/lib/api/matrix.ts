import { logger } from '../logger';

const MATRIX_API_URL = 'https://savematrixanalysis-cak4tc36na-uc.a.run.app';

export async function saveMatrixAnalysis(
  matrixId: string,
  fileId: string,
  responses: Record<string, string>,
  name: string,
  userId: string
) {
  try {
    logger.debug('Saving matrix analysis', { matrixId, fileId, name });

    const response = await fetch(MATRIX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify({
        matrixId,
        fileId,
        responses,
        name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save analysis');
    }

    const data = await response.json();
    return data.analysisId;
  } catch (error) {
    logger.error('Error saving matrix analysis:', error);
    throw error;
  }
}