
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './types';
import {
  getCachedProfile,
  setCachedProfile,
  getProfileFetchPromise,
  setProfileFetchPromise,
  deleteProfileFetchPromise
} from './profileCache';

export const fetchOrCreateProfile = async (user: User): Promise<Profile | null> => {
  try {
    // Vérifier le cache d'abord
    const cachedProfile = getCachedProfile(user.id);
    if (cachedProfile) {
      console.log('Profil trouvé dans le cache');
      return cachedProfile;
    }

    // Vérifier si une requête est déjà en cours
    const existingPromise = getProfileFetchPromise(user.id);
    if (existingPromise) {
      console.log('Requête de profil déjà en cours, attente...');
      return await existingPromise;
    }

    console.log('Récupération du profil pour:', user.id);
    
    // Créer une nouvelle promesse de récupération
    const fetchPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Erreur récupération profil:', error);
          return null;
        }

        if (!data) {
          console.log('Aucun profil trouvé, création en cours...');
          return await createProfileFromUser(user);
        }

        console.log('Profil trouvé:', data);
        setCachedProfile(user.id, data);
        return data;
      } catch (error) {
        console.error('Erreur dans fetchOrCreateProfile:', error);
        return null;
      } finally {
        deleteProfileFetchPromise(user.id);
      }
    })();

    setProfileFetchPromise(user.id, fetchPromise);
    return await fetchPromise;
  } catch (error) {
    console.error('Erreur dans fetchOrCreateProfile:', error);
    deleteProfileFetchPromise(user.id);
    return null;
  }
};

export const createProfileFromUser = async (user: User): Promise<Profile | null> => {
  try {
    console.log('Création du profil pour:', user.id);
    
    const profileData = {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || '',
      role: user.user_metadata?.role || 'student',
      username: user.user_metadata?.username || null
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Erreur création profil:', error);
      return null;
    }

    console.log('Profil créé:', data);
    setCachedProfile(user.id, data);
    return data;
  } catch (error) {
    console.error('Erreur dans createProfileFromUser:', error);
    return null;
  }
};
