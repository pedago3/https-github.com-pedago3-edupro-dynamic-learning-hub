import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Clock, MapPin, Users, BookOpen, CalendarDays } from 'lucide-react';
import { CalendarEventView } from './CalendarEventView';

export const ActivityCalendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showEventForm, setShowEventForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    class_id: '',
    start_date: '',
    end_date: '',
    event_type: 'lesson'
  });

  // Récupérer les cours de l'enseignant
  const { data: courses } = useQuery({
    queryKey: ['teacher-courses-for-calendar', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data } = await supabase
        .from('courses')
        .select('id, title')
        .eq('teacher_id', user.id);
      
      return data || [];
    },
    enabled: !!user
  });

  // Récupérer les classes de l'enseignant
  const { data: classes } = useQuery({
    queryKey: ['teacher-classes-for-calendar', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user.id);
      
      return data || [];
    },
    enabled: !!user
  });

  // Récupérer les événements du calendrier
  const { data: events, isLoading } = useQuery({
    queryKey: ['teacher-calendar-events', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await supabase
        .from('calendar_events')
        .select(`
          *,
          courses (title),
          classes (name)
        `)
        .eq('teacher_id', user.id)
        .order('start_date', { ascending: true });

      return data || [];
    },
    enabled: !!user
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { data: event, error } = await supabase
        .from('calendar_events')
        .insert({
          title: data.title,
          description: data.description,
          course_id: data.course_id || null,
          class_id: data.class_id || null,
          start_date: data.start_date,
          end_date: data.end_date,
          event_type: data.event_type,
          teacher_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return event;
    },
    onSuccess: () => {
      toast({
        title: "Événement créé avec succès",
        description: "Votre événement a été ajouté au calendrier."
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      
      setFormData({
        title: '',
        description: '',
        course_id: '',
        class_id: '',
        start_date: '',
        end_date: '',
        event_type: 'lesson'
      });
      setShowEventForm(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'événement. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error('Erreur création événement:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.start_date || !formData.end_date) {
      toast({
        title: "Erreur",
        description: "Le titre, la date de début et la date de fin sont requis.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être postérieure à la date de début.",
        variant: "destructive"
      });
      return;
    }

    createEventMutation.mutate(formData);
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'lesson': return 'bg-blue-100 text-blue-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'assignment': return 'bg-yellow-100 text-yellow-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'lesson': return <BookOpen className="h-4 w-4" />;
      case 'exam': return <Clock className="h-4 w-4" />;
      case 'assignment': return <Clock className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendrier d'activité</h2>
        <Button 
          onClick={() => setShowEventForm(!showEventForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouvel événement
        </Button>
      </div>

      {showEventForm && (
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel événement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de l'événement *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre de l'événement..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="event_type">Type d'événement</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lesson">Cours</SelectItem>
                    <SelectItem value="exam">Examen</SelectItem>
                    <SelectItem value="assignment">Devoir</SelectItem>
                    <SelectItem value="meeting">Réunion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course">Cours (optionnel)</Label>
                  <Select
                    value={formData.course_id || "none"}
                    onValueChange={(value) => setFormData({ ...formData, course_id: value === "none" ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun cours</SelectItem>
                      {courses?.filter(course => course.id && course.title).map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class">Classe (optionnel)</Label>
                  <Select
                    value={formData.class_id || "none"}
                    onValueChange={(value) => setFormData({ ...formData, class_id: value === "none" ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune classe</SelectItem>
                      {classes?.filter(classItem => classItem.id && classItem.name).map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Date et heure de début *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">Date et heure de fin *</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de l'événement..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={createEventMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  {createEventMutation.isPending ? 'Création...' : 'Créer l\'événement'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowEventForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Vue Calendrier
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Vue Liste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <CalendarEventView />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          {events?.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun événement</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par créer votre premier événement.
                </p>
                <Button onClick={() => setShowEventForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un événement
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {events?.map((event: any) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${getEventTypeColor(event.event_type)}`}>
                          {getEventTypeIcon(event.event_type)}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{event.title}</h3>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDateTime(event.start_date)} - {formatDateTime(event.end_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getEventTypeColor(event.event_type)}>
                              {event.event_type === 'lesson' ? 'Cours' :
                               event.event_type === 'exam' ? 'Examen' :
                               event.event_type === 'assignment' ? 'Devoir' :
                               event.event_type === 'meeting' ? 'Réunion' : event.event_type}
                            </Badge>
                            {event.courses?.title && (
                              <Badge variant="secondary">{event.courses.title}</Badge>
                            )}
                            {event.classes?.name && (
                              <Badge variant="outline">{event.classes.name}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
