import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { LogIn, FileText, Shield, Zap } from 'lucide-react';
import { logger } from '@/lib/logger';

export function Home() {
  const { user, signIn } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      logger.debug('User already logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      await signIn();
      navigate('/dashboard');
    } catch (error) {
      logger.error('Sign in failed:', error);
    }
  };

  // If user is logged in, don't render the home page content
  if (user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Analysez vos fichiers avec
              <span className="text-blue-600"> l'IA</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Téléversez vos documents et laissez notre assistant IA vous aider à mieux les comprendre.
              Obtenez des analyses, des résumés et des réponses à vos questions instantanément.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Button onClick={handleSignIn} size="lg" className="w-full sm:w-auto">
                <LogIn className="w-5 h-5 mr-2" />
                Commencer avec Google
              </Button>
            </div>
          </div>

          <div className="mt-24 grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Stockage Sécurisé</h3>
              <p className="mt-2 text-gray-500">Vos fichiers sont chiffrés et stockés en toute sécurité dans le cloud.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Analyse Rapide</h3>
              <p className="mt-2 text-gray-500">Obtenez des analyses instantanées de vos documents grâce à l'IA avancée.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Formats Multiples</h3>
              <p className="mt-2 text-gray-500">Compatible avec les documents PDF, Word et Excel.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}