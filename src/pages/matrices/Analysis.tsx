import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatrixStore } from '@/store/matrix';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

interface ResponseState {
  [questionId: string]: {
    content: string;
    loading: boolean;
    history: string[];
    currentIndex: number;
  };
}

export function Analysis() {
  const { matrixId, fileId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { matrices, analyzeDocument, regenerateResponse, saveAnalysis } = useMatrixStore();
  const [responses, setResponses] = useState<ResponseState>({});
  const [saving, setSaving] = useState(false);
  const [analysisName, setAnalysisName] = useState('');

  const matrix = matrices.find(m => m.id === matrixId);

  useEffect(() => {
    if (!user || !matrixId || !fileId) {
      navigate('/matrices');
      return;
    }

    // Initialize responses with loading state
    if (matrix) {
      const initialResponses: ResponseState = {};
      matrix.questions.forEach(q => {
        initialResponses[q.id] = { 
          content: '', 
          loading: true,
          history: [],
          currentIndex: 0
        };
      });
      setResponses(initialResponses);

      // Start analysis for each question
      matrix.questions.forEach(async (question) => {
        try {
          const result = await analyzeDocument(matrixId, fileId);
          setResponses(prev => ({
            ...prev,
            [question.id]: { 
              content: result[question.id],
              loading: false,
              history: [result[question.id]],
              currentIndex: 0
            }
          }));
        } catch (error) {
          logger.error('Analysis failed:', error);
          setResponses(prev => ({
            ...prev,
            [question.id]: { 
              ...prev[question.id],
              content: 'Error analyzing question',
              loading: false
            }
          }));
        }
      });
    }
  }, [user, matrixId, fileId, matrix, analyzeDocument, navigate]);

  const handleRegenerate = async (questionId: string) => {
    try {
      setResponses(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], loading: true }
      }));

      const newResponse = await regenerateResponse(matrixId!, fileId!, questionId);
      
      setResponses(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          content: newResponse,
          loading: false,
          history: [...prev[questionId].history, newResponse],
          currentIndex: prev[questionId].history.length
        }
      }));
    } catch (error) {
      logger.error('Regeneration failed:', error);
      setResponses(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], loading: false }
      }));
    }
  };

  const handleNavigate = (questionId: string, direction: 'prev' | 'next') => {
    setResponses(prev => {
      const response = prev[questionId];
      const newIndex = direction === 'prev' 
        ? Math.max(0, response.currentIndex - 1)
        : Math.min(response.history.length - 1, response.currentIndex + 1);
      
      return {
        ...prev,
        [questionId]: {
          ...response,
          content: response.history[newIndex],
          currentIndex: newIndex
        }
      };
    });
  };

  const handleSave = async () => {
    if (!matrixId || !fileId || !analysisName.trim()) return;
    
    setSaving(true);
    try {
      const finalResponses = Object.entries(responses).reduce((acc, [questionId, data]) => {
        acc[questionId] = data.content;
        return acc;
      }, {} as Record<string, string>);
      
      await saveAnalysis(matrixId, fileId, finalResponses, analysisName);
      navigate('/matrices/analyses');
    } catch (error) {
      logger.error('Failed to save analysis:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!matrix) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Matrix not found</p>
          <Button onClick={() => navigate('/matrices')}>
            Return to matrices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/matrices')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {matrix.name}
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            {matrix.questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-medium mb-4">
                  {index + 1}. {question.text}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                    {responses[question.id]?.loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">
                        {responses[question.id]?.content || ''}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerate(question.id)}
                        disabled={responses[question.id]?.loading}
                      >
                        Regenerate
                      </Button>
                    </div>

                    {responses[question.id]?.history.length > 1 && (
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleNavigate(question.id, 'prev')}
                          disabled={responses[question.id]?.currentIndex === 0}
                        >
                          <ArrowLeftCircle className="w-5 h-5" />
                        </Button>
                        <span className="text-sm text-gray-500">
                          {responses[question.id]?.currentIndex + 1} / {responses[question.id]?.history.length}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleNavigate(question.id, 'next')}
                          disabled={responses[question.id]?.currentIndex === responses[question.id]?.history.length - 1}
                        >
                          <ArrowRightCircle className="w-5 h-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Analysis Name
                </label>
                <input
                  type="text"
                  value={analysisName}
                  onChange={(e) => setAnalysisName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Give this analysis a name..."
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={saving || !analysisName.trim()}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Analysis'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}