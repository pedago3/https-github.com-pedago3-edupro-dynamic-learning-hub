
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Search, Plus, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

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
  unreadCount?: number;
  lastMessage?: string;
}

interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string, otherUser: User) => void;
}

export const ChatList = ({ conversations, onSelectConversation }: ChatListProps) => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [conversationsWithMeta, setConversationsWithMeta] = useState<Conversation[]>([]);

  useEffect(() => {
    fetchAvailableUsers();
    fetchConversationMeta();
  }, [profile]);

  useEffect(() => {
    setConversationsWithMeta(conversations);
    fetchConversationMeta();
  }, [conversations]);

  const fetchAvailableUsers = async () => {
    if (!profile) return;

    try {
      const targetRole = profile.role === 'teacher' ? 'student' : 'teacher';
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('role', targetRole)
        .neq('id', user?.id);

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setAvailableUsers(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchConversationMeta = async () => {
    if (!conversations.length) return;

    try {
      const conversationIds = conversations.map(conv => conv.id);
      
      // Fetch last message and unread count for each conversation
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('conversation_id, message, created_at, read, sender_id')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      const conversationMeta = conversations.map(conv => {
        const convMessages = messages?.filter(msg => msg.conversation_id === conv.id) || [];
        const lastMessage = convMessages[0];
        const unreadCount = convMessages.filter(msg => !msg.read && msg.sender_id !== user?.id).length;

        return {
          ...conv,
          lastMessage: lastMessage?.message || '',
          unreadCount
        };
      });

      setConversationsWithMeta(conversationMeta);
    } catch (error) {
      console.error('Error fetching conversation meta:', error);
    }
  };

  const createConversation = async () => {
    if (!selectedUserId || !user || !profile) return;

    try {
      const conversationData = profile.role === 'teacher' 
        ? { teacher_id: user.id, student_id: selectedUserId }
        : { teacher_id: selectedUserId, student_id: user.id };

      const { data, error } = await supabase
        .from('chat_conversations')
        .insert(conversationData)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Une conversation avec cet utilisateur existe déjà');
        } else {
          console.error('Error creating conversation:', error);
          toast.error('Erreur lors de la création de la conversation');
        }
        return;
      }

      toast.success('Conversation créée avec succès');
      setIsDialogOpen(false);
      setSelectedUserId('');
      
      // Find the other user
      const otherUser = availableUsers.find(u => u.id === selectedUserId);
      if (otherUser && data) {
        onSelectConversation(data.id, otherUser);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la création de la conversation');
    }
  };

  const filteredConversations = conversationsWithMeta.filter(conv =>
    conv.otherUser?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversations
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle conversation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Sélectionner un ${profile?.role === 'teacher' ? 'étudiant' : 'enseignant'}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || 'Utilisateur sans nom'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={createConversation} disabled={!selectedUserId} className="w-full">
                  Créer la conversation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Aucune conversation</p>
              <p className="text-sm">
                {searchTerm 
                  ? 'Aucune conversation ne correspond à votre recherche'
                  : 'Commencez une nouvelle conversation en cliquant sur "Nouveau"'
                }
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectConversation(conversation.id, conversation.otherUser)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {conversation.otherUser?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">
                        {conversation.otherUser?.full_name || 'Utilisateur sans nom'}
                      </p>
                      <div className="flex items-center gap-2">
                        {conversation.unreadCount && conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.updated_at)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage || 'Aucun message'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
