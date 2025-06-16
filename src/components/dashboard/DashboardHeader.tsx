
import { Button } from '@/components/ui/button';
import { LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStudentClass } from "@/hooks/useStudentClass";

export const DashboardHeader = () => {
  const { user, profile, signOut } = useAuth();
  const { data: classe, isLoading: loadingClasse } = useStudentClass();

  const handleSignOut = async () => {
    await signOut();
  };

  const displayName = profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'Élève';

  return (
    <div className="relative h-80 bg-cover bg-center" style={{
      backgroundImage: 'url(/lovable-uploads/9f471c72-1b0f-4dd0-aca6-c102fece8cf5.png)'
    }}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-pink-900/60"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="text-white animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg animate-glow">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Bienvenue {displayName}</h1>
              <div className="flex items-center gap-2 mt-1">
                {!loadingClasse && (
                  <span className="text-base font-medium text-white/90 bg-purple-600/40 rounded px-3 py-1 inline-block">
                    {classe?.name ? (
                      <>Classe&nbsp;
                        <span className="font-bold">{classe.name}</span>
                      </>
                    ) : (
                      <span className="italic text-purple-100">Aucune classe attribuée</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-xl text-purple-100">Suivez votre progression et continuez votre apprentissage</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="glass hover-lift transition-all duration-300 border-white/30 hover:border-white/50 bg-white/10 text-white"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};
