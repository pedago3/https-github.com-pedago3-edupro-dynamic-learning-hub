
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { defaultRows, WEEKDAYS } from "@/components/teacher/courseAnnualScheduleUtils";

// Nouveau Row sans "hour"
export type Row = {
  semaine: string;
  mois: string;
  days: string[];
};

export const useCourseAnnualSchedule = ({
  selectedClass,
  selectedYear,
}: {
  selectedClass: string | null;
  selectedYear: string;
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>(defaultRows());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSchedule = useCallback(async () => {
    if (!selectedClass || !user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("course_annual_schedules")
      .select("*")
      .eq("teacher_id", user.id)
      .eq("school_year", selectedYear)
      .eq("course_id", selectedClass)
      .single();
    if (error || !data) {
      setRows(defaultRows());
      setIsLoading(false);
      return;
    }
    try {
      const weekly = JSON.parse(data.monday || "[]")[0]
        ? [
            JSON.parse(data.monday),
            JSON.parse(data.tuesday),
            JSON.parse(data.wednesday),
            JSON.parse(data.thursday),
            JSON.parse(data.friday),
          ]
        : null;
      if (weekly) {
        const loadedRows: Row[] = defaultRows().map((row, rowIdx) => ({
          semaine: row.semaine,
          mois: row.mois,
          days: weekly.map((dayArr) => dayArr[rowIdx] || ""),
        }));
        setRows(loadedRows);
      } else {
        setRows(defaultRows());
      }
    } catch (e) {
      setRows(defaultRows());
    }
    setIsLoading(false);
  }, [selectedClass, selectedYear, user]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleCellChange = (rowIdx: number, colIdx: number, value: string) => {
    const newRows = rows.map((row, i) =>
      i === rowIdx
        ? { ...row, days: row.days.map((d, j) => (j === colIdx ? value : d)) }
        : row
    );
    setRows(newRows);
  };

  const handleSave = async () => {
    if (!selectedClass || !user) {
      toast({ title: "Erreur", description: "Classe ou utilisateur manquant", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const weeklyByCol: string[][] = [0, 1, 2, 3, 4].map((weekdayIdx) =>
      rows.map((row) => row.days[weekdayIdx])
    );
    const payload = {
      teacher_id: user.id,
      course_id: selectedClass,
      school_year: selectedYear,
      monday: JSON.stringify(weeklyByCol[0]),
      tuesday: JSON.stringify(weeklyByCol[1]),
      wednesday: JSON.stringify(weeklyByCol[2]),
      thursday: JSON.stringify(weeklyByCol[3]),
      friday: JSON.stringify(weeklyByCol[4]),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("course_annual_schedules")
      .upsert(payload, { onConflict: "teacher_id,course_id,school_year" });

    if (error) {
      toast({ title: "Erreur lors de l’enregistrement", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Programmation enregistrée", description: "Votre emploi du temps a été sauvegardé !" });
    }
    setIsSaving(false);
  };

  return {
    rows,
    setRows,
    isLoading,
    isSaving,
    handleCellChange,
    handleSave,
    refetch: fetchSchedule,
  };
};
