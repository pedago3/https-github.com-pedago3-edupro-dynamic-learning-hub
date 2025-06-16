
import { useState, useEffect } from 'react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  full_name: string;
  role: string;
}

interface Conversation {
  id: string;
  teacher_id: string;
  student_id: string;
  created_at: string;
  updated_at: string;
  otherUser: User;
}

export const ChatInterface = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    otherUser: User;
  } | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  useEffect(() => {
    // Éviter de refaire des requêtes trop fréquemment
    const now = Date.now();
    if (now - lastFetchTime < 5000) { // Minimum 5 secondes entre les requêtes
      return;
    }

    if (authLoading) {
      console.log('ChatInterface: Auth en cours de chargement...');
      return;
    }

    if (!user) {
      console.log('ChatInterface: Aucun utilisateur connecté');
      setError('Utilisateur non connecté');
      setLoading(false);
      return;
    }

    if (!profile) {
      console.log('ChatInterface: Profil non trouvé pour l\'utilisateur:', user.id);
      // Ne pas considérer cela comme une erreur bloquante
      setLoading(false);
      return;
    }

    console.log('ChatInterface: Utilisateur et profil chargés, récupération des conversations');
    setError(null);
    setLastFetchTime(now);
    fetchConversations();
    
    // Réduire la fréquence des mises à jour en temps réel
    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, [user, profile, authLoading]);

  const fetchConversations = async () => {
    if (!user || !profile) {
      console.log('ChatInterface: Impossible de récupérer les conversations - utilisateur ou profil manquant');
      return;
    }

    try {
      setLoading(true);
      console.log('Récupération des conversations pour:', user.id, 'avec le rôle:', profile.role);
      
      let query = supabase
        .from('chat_conversations')
        .select(`
          *,
          teacher:teacher_id(id, full_name, role),
          student:student_id(id, full_name, role)
        `);

      if (profile.role === 'teacher') {
        query = query.eq('teacher_id', user.id);
      } else {
        query = query.eq('student_id', user.id);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) {
        console.error('Erreur récupération conversations:', error);
        setError('Erreur lors du chargement des conversations');
        return;
      }

      console.log('Conversations récupérées:', data);

      const formattedConversations = data?.map((conv: any) => ({
        ...conv,
        otherUser: profile.role === 'teacher' ? conv.student : conv.teacher
      })) || [];

      setConversations(formattedConversations);
      setError(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur inattendue lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return () => {};

    console.log('Configuration de l\'abonnement temps réel pour:', user.id);
    
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations'
        },
        () => {
          // Éviter de refaire des requêtes trop fréquemment
          const now = Date.now();
          if (now - lastFetchTime > 3000) { // Minimum 3 secondes entre les mises à jour
            console.log('Mise à jour temps réel reçue, actualisation des conversations');
            setLastFetchTime(now);
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Nettoyage de l\'abonnement temps réel');
      supabase.removeChannel(channel);
    };
  };

  const handleSelectConversation = (conversationId: string, otherUser: User) => {
    setSelectedConversation({ id: conversationId, otherUser });
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  // Affichage pendant le chargement de l'authentification
  if (authLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Affichage si utilisateur non connecté
  if (!user) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vous devez être connecté pour accéder aux messages.</p>
        </div>
      </div>
    );
  }

  // Affichage si profil non chargé (sans erreur bloquante)
  if (!profile) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chargement du profil utilisateur...</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Actualiser
          </button>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLastFetchTime(0);
              fetchConversations();
            }}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Affichage pendant le chargement des conversations
  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px]">
      {selectedConversation ? (
        <ChatWindow
          conversationId={selectedConversation.id}
          otherUser={selectedConversation.otherUser}
          onBack={handleBack}
        />
      ) : (
        <ChatList 
          conversations={conversations}
          onSelectConversation={handleSelectConversation} 
        />
      )}
    </div>
  );
};
