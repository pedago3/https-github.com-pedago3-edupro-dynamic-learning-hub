
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export type TeacherNotification = {
  id: string;
  teacher_id: string;
  student_id: string;
  course_id: string | null;
  type_validation: string;
  date_validation: string;
  payload: any;
  read: boolean | null;
  created_at: string;
};

export function useTeacherNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<TeacherNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("teacher_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (!error && data) {
      setNotifications(data as TeacherNotification[]);
    }
    setLoading(false);
  }, [user]);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    await supabase
      .from("teacher_notifications")
      .update({ read: true })
      .eq("id", id);
  };

  // Efface toutes les notifications du prof connecté
  const clearAllNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("teacher_notifications")
      .delete()
      .eq("teacher_id", user.id);
    if (!error) {
      setNotifications([]);
      toast({
        title: "Notifications effacées",
        description: "Toutes vos notifications ont été supprimées.",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'effacer les notifications.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  // Subscribe to realtime
  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const channel = supabase.channel("teacher-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "teacher_notifications",
          filter: `teacher_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as TeacherNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    loading,
    fetchNotifications,
    markAsRead,
    clearAllNotifications,
  };
}


