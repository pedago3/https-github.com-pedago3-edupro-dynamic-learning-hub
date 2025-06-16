
import { supabase } from '@/integrations/supabase/client';

export const signUp = async (email: string, password: string, fullName: string, role: string = 'student', username?: string) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          username: username?.toLowerCase() || null,
        },
      },
    });

    return { error };
  } catch (error) {
    return { error };
  }
};

export const signIn = async (emailOrUsername: string, password: string) => {
  try {
    // Déterminer si c'est un email ou un nom d'utilisateur
    const isEmail = emailOrUsername.includes('@');

    if (isEmail) {
      // Connexion par email
      const { error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password,
      });
      return { error };
    } else {
      // Connexion par nom d'utilisateur - rechercher l'email correspondant
      console.log('Recherche du profil pour le nom d\'utilisateur:', emailOrUsername);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailOrUsername.toLowerCase())
        .maybeSingle();

      if (profileError || !profile) {
        console.error('Profil non trouvé pour:', emailOrUsername, profileError);
        return { error: new Error('Nom d\'utilisateur ou mot de passe incorrect') };
      }

      const userEmail = profile.email;

      if (!userEmail) {
        return { error: new Error('Nom d\'utilisateur ou mot de passe incorrect') };
      }

      console.log('Email trouvé pour le pseudo:', userEmail);

      // Se connecter avec l'email trouvé
      const { error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      });

      return { error };
    }
  } catch (error) {
    console.error('Erreur dans signIn:', error);
    return { error };
  }
};

export const signOut = async () => {
  try {
    console.log('Déconnexion utilisateur');
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Erreur déconnexion:', error);
  }
};
