import { create } from 'zustand';
import { logger } from '@/lib/logger';
import { saveAnalysisAction } from './actions';
import type { MatrixState } from './types';
import { useAuthStore } from '../auth';

export const useMatrixStore = create<MatrixState>((set, get) => ({
  matrices: [],
  analyses: [],
  loading: false,
  error: null,

  saveAnalysis: async (responses: Record<string, string>, name: string) => {
  //saveAnalysis: async (matrixId: string, responses: Record<string, string>, name: string) => {
    try {
      set({ loading: true, error: null });

      const user = useAuthStore.getState().user;
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      // Save the analysis
      const analysis = await saveAnalysisAction(
       // matrixId,
        responses,
        name,
        user.id
      );

      // Update the store with the new analysis
      set((state) => ({
        analyses: [...state.analyses, analysis],
        loading: false,
      }));

      return analysis.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save analysis';
      logger.error('Error in saveAnalysis:', error);
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchMatrices: async (userId: string) => {
    // Fetch matrices logic here
  },

  fetchAnalyses: async (userId: string) => {
    // Fetch analyses logic here
  },

  fetchAllAnalyses: async (userId: string) => {
    // Fetch all analyses logic here
  },
}));
