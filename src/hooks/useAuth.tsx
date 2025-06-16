
import { useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './auth/types';
import { AuthContext, useAuth } from './auth/AuthContext';
import { fetchOrCreateProfile } from './auth/profileManager';
import { clearProfileCache, setCachedProfile } from './auth/profileCache';
import { signUp as authSignUp, signIn as authSignIn, signOut as authSignOut } from './auth/authFunctions';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Configuration de l'écoute des changements d'état
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Utiliser setTimeout pour éviter les boucles
            setTimeout(async () => {
              if (mounted) {
                const userProfile = await fetchOrCreateProfile(session.user);
                if (mounted) {
                  setProfile(userProfile);
                }
              }
            }, 100);
          } else {
            setProfile(null);
            // Nettoyer le cache lors de la déconnexion
            clearProfileCache();
          }
          
          if (mounted && !initialized) {
            setLoading(false);
            setInitialized(true);
          }
        } catch (error) {
          console.error('Erreur dans onAuthStateChange:', error);
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
        }
      }
    );

    // Vérification de session existante
    const initializeAuth = async () => {
      try {
        console.log('Initialisation auth');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (!mounted) return;

        console.log('Session existante trouvée:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchOrCreateProfile(session.user);
          if (mounted) {
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string = 'student', username?: string) => {
    return await authSignUp(email, password, fullName, role, username);
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    try {
      setLoading(true);
      return await authSignIn(emailOrUsername, password);
    } catch (error) {
      console.error('Erreur dans signIn:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Nettoyer le cache
      clearProfileCache();
      
      await authSignOut();
      setProfile(null);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error && profile) {
        const updatedProfile = { ...profile, ...updates };
        setProfile(updatedProfile);
        setCachedProfile(user.id, updatedProfile);
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth };
