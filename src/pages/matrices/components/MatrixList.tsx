import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatrixStore } from '@/store/matrix';
import { useAuthStore } from '@/store/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { MatrixEditor } from './MatrixEditor';
import { MatrixDeleteDialog } from '@/components/modals/MatrixDeleteDialog';

interface MatrixListProps {
  onSelectMatrix: (matrixId: string) => void;
}

export function MatrixList({ onSelectMatrix }: MatrixListProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { matrices, loading, error, fetchMatrices, deleteMatrix } = useMatrixStore();
  const [expandedMatrix, setExpandedMatrix] = useState<string | null>(null);
  const [editingMatrix, setEditingMatrix] = useState<string | null>(null);
  const [matrixToDelete, setMatrixToDelete] = useState<Matrix | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      fetchMatrices(user.id);
    }
  }, [user, fetchMatrices]);

  const handleAnalyze = (matrixId: string) => {
    navigate(`/matrices/${matrixId}/analyze`);
  };

  const toggleExpand = (matrixId: string) => {
    setExpandedMatrix(expandedMatrix === matrixId ? null : matrixId);
  };

  const handleDeleteConfirm = async () => {
    if (matrixToDelete) {
      await deleteMatrix(matrixToDelete.id);
      setMatrixToDelete(null);
    }
  };

  // Rest of the component remains the same until the render part where we add the delete button handler:

  return (
    <div className="grid gap-4">
      {matrices.map((matrix) => (
        <div 
          key={matrix.id} 
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-lg">{matrix.name}</h3>
                <button
                  onClick={() => toggleExpand(matrix.id)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  {expandedMatrix === matrix.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500">
                {matrix.questions.length} {t('matrices.questions')}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingMatrix(matrix.id)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {t('common.edit')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAnalyze(matrix.id)}
              >
                <FileText className="w-4 h-4 mr-2" />
                {t('common.analyze')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMatrixToDelete(matrix)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {expandedMatrix === matrix.id && (
            <div className="mt-4 space-y-2 pl-4 border-l-2 border-gray-200">
              {matrix.questions.map((question, index) => (
                <div key={question.id} className="text-gray-600">
                  {index + 1}. {question.text}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {editingMatrix && (
        <MatrixEditor
          matrix={matrices.find(m => m.id === editingMatrix)!}
          onClose={() => setEditingMatrix(null)}
          onSave={() => {
            setEditingMatrix(null);
            fetchMatrices(user!.id);
          }}
        />
      )}

      <MatrixDeleteDialog
        isOpen={!!matrixToDelete}
        matrixName={matrixToDelete?.name || ''}
        onClose={() => setMatrixToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}