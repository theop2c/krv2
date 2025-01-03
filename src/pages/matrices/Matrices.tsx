import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatrixForm } from './components/MatrixForm';
import { MatrixList } from './components/MatrixList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function Matrices() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Matrices d'Analyse</h1>
              <p className="text-gray-600">Créez et gérez vos matrices de questions</p>
            </div>
            <div className="space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/matrices/analyses')}
              >
                Voir l'historique
              </Button>
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? 'Annuler' : 'Nouvelle Matrice'}
              </Button>
            </div>
          </div>

          {showForm ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <MatrixForm onComplete={() => setShowForm(false)} />
            </div>
          ) : (
            <MatrixList onSelectMatrix={(matrixId) => navigate(`/matrices/${matrixId}`)} />
          )}
        </div>
      </div>
    </div>
  );
}