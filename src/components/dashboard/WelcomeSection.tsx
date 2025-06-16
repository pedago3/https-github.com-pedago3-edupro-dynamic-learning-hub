
import React from 'react';

export const WelcomeSection = () => {
  return (
    <div className="glass p-8 rounded-3xl border border-white/20 backdrop-blur-xl animate-fade-in">
      <div className="flex items-center gap-4 mb-4">
        <div>
          <h6 className="responsive-title">Bon retour dans votre espace !</h6>
          <p className="responsive-subtitle">Continuez votre parcours vers l'excellence</p>
        </div>
      </div>
    </div>
  );
};
