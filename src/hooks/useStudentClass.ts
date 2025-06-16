
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useStudentClass() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-class", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      // Récupérer le profile pour avoir la class_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("class_id, full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile?.class_id) return null;

      // Récupérer la classe correspondant au class_id
      const { data: classe } = await supabase
        .from("classes")
        .select("id, name")
        .eq("id", profile.class_id)
        .maybeSingle();

      return classe;
    }
  });
}
