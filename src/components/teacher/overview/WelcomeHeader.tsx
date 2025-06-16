
import React from 'react';
import { Sparkles } from 'lucide-react';

export const WelcomeHeader = () => {
  return (
    <div className="glass p-4 sm:p-6 lg:p-8 rounded-3xl border border-white/20 backdrop-blur-xl animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg animate-glow">
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="responsive-title">Bienvenue dans votre espace enseignant</h2>
          <p className="responsive-subtitle">Voici un aperçu de votre activité</p>
        </div>
      </div>
    </div>
  );
};
