
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 flex flex-col md:flex-row items-center justify-center p-0 relative overflow-hidden">
      {/* Grid pattern and animated blobs (décor en arrière-plan) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-grid-gray-400/[0.05] bg-[size:50px_50px]" />
      </div>
      {/* IMAGE SECTION GAUCHE */}
      <div className="relative w-full md:w-1/2 h-60 md:h-[550px] flex items-center justify-center mb-6 md:mb-0 md:mr-6 z-10">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80"
            alt="Image de synthèse d'une salle de classe moderne avec des ordinateurs"
            className="object-cover w-full h-full rounded-b-3xl md:rounded-3xl shadow-2xl border border-white/30"
          />
        </div>
        {/* Icône flottante */}
        <div className="absolute -bottom-4 right-6 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center animate-float shadow-xl">
          <span className="text-xl">🌐</span>
        </div>
      </div>

      {/* FORM COLUMN DROITE */}
      <div className="w-full max-w-md md:w-[420px] flex flex-col justify-center relative z-10 mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl mb-6 animate-float">
            <span className="text-3xl font-bold text-white">E</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-shimmer">
            EduPro
          </h1>
          <p className="text-gray-700 text-lg font-medium">
            Votre plateforme éducative de nouvelle génération
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-4"></div>
        </div>
        <AuthForm mode={mode} onModeChange={setMode} />
        <div className="mt-12 text-center text-gray-500 text-sm animate-fade-in animation-delay-2000">
          <p>© 2024 EduPro. Propulsé par l'innovation.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
