
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { TeacherNotificationsBell } from "./TeacherNotificationsBell";

export const TeacherDashboardHeader = ({
  onSignOut,
  isSigningOut,
}: {
  onSignOut: () => void;
  isSigningOut: boolean;
}) => {
  const { profile } = useAuth();
  
  const getDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (profile?.username) {
      return profile.username;
    }
    return 'Enseignant';
  };

  return (
    <header
      className="relative pb-36 pt-8 shadow-xl z-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(30, 41, 59, 0.80), rgba(30, 41, 59, 0.8)),
          url('/lovable-uploads/4d3b17a2-7386-4378-b2d5-dfb17add85e2.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 gap-8 md:gap-0">
        <div className="flex items-center gap-4">
          <img
            src="/lovable-uploads/18fe1fbc-bc8a-43c5-b2ca-80fe1cad0f65.png"
            alt="Logo"
            className="h-14 w-14 rounded-full ring-4 ring-white/40 shadow-md bg-white/70 backdrop-blur"
          />
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow">
              Bienvenue {getDisplayName()}
            </h1>
            <p className="text-white/80">Gérez vos cours, élèves et ressources</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* NOTIFICATIONS */}
          <TeacherNotificationsBell />
          {/* SIGN OUT BUTTON */}
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center px-4 py-2 border border-white/40 rounded-xl shadow bg-white/20 text-white hover:bg-white/40 transition ml-2"
            disabled={isSigningOut}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            {isSigningOut ? "Déconnexion..." : "Déconnexion"}
          </button>
        </div>
      </div>
    </header>
  );
};
