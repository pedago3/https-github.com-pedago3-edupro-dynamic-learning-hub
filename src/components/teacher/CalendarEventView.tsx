
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, BookOpen, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

export const CalendarEventView = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Récupérer les événements du calendrier
  const { data: events } = useQuery({
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

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'lesson': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'assignment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'meeting': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'lesson': return <BookOpen className="h-3 w-3" />;
      case 'exam': return <Clock className="h-3 w-3" />;
      case 'assignment': return <Clock className="h-3 w-3" />;
      case 'meeting': return <Users className="h-3 w-3" />;
      default: return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case 'lesson': return 'Cours';
      case 'exam': return 'Examen';
      case 'assignment': return 'Devoir';
      case 'meeting': return 'Réunion';
      default: return eventType;
    }
  };

  // Filtrer les événements du jour sélectionné
  const selectedDayEvents = events?.filter(event => 
    isSameDay(new Date(event.start_date), selectedDate)
  ) || [];

  // Créer un objet avec les dates qui ont des événements
  const eventDates = events?.reduce((acc, event) => {
    const eventDate = new Date(event.start_date);
    const dateKey = format(eventDate, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, any[]>) || {};

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: fr });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendrier */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendrier des événements
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                </span>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="w-full"
              modifiers={{
                hasEvents: (date) => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  return eventDates[dateKey]?.length > 0;
                }
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Jours avec événements</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Événements du jour sélectionné */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucun événement ce jour
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border ${getEventTypeColor(event.event_type)}`}
                  >
                    <div className="flex items-start gap-2">
                      {getEventTypeIcon(event.event_type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatTime(event.start_date)} - {formatTime(event.end_date)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {getEventTypeLabel(event.event_type)}
                          </Badge>
                          {event.courses?.title && (
                            <Badge variant="outline" className="text-xs">
                              {event.courses.title}
                            </Badge>
                          )}
                          {event.classes?.name && (
                            <Badge variant="outline" className="text-xs">
                              {event.classes.name}
                            </Badge>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
