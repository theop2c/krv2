import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatrixStore } from '@/store/matrix';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Clock, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';

export function Analyses() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { matrices, analyses, loading, error, fetchMatrices, fetchAllAnalyses } = useMatrixStore();
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        logger.warn('No user found, redirecting to login');
        navigate('/');
        return;
      }

      try {
        logger.info('Loading matrices and analyses', { userId: user.id });
        setLoadingError(null);
        // Load both matrices and analyses in parallel
        await Promise.all([
          fetchMatrices(user.id),
          fetchAllAnalyses(user.id)
        ]);
        logger.debug('Data loaded successfully', {
          matricesCount: matrices.length,
          analysesCount: analyses.length
        });
      } catch (err) {
        logger.error('Failed to load data', err);
        setLoadingError('Failed to load analyses. Please try again later.');
      }
    }

    loadData();
  }, [user, navigate, fetchMatrices, fetchAllAnalyses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || loadingError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 mb-4">{error || loadingError}</p>
            <Button onClick={() => navigate('/matrices')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to matrices
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Rest of the component remains the same */}
    </div>
  );
}