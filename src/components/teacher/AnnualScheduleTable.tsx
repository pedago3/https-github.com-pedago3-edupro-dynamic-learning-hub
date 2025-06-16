
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnnualScheduleSelector } from "./AnnualScheduleSelector";
import { AnnualScheduleEditableTable } from "./AnnualScheduleEditableTable";
import { useCourseAnnualSchedule } from "@/hooks/useCourseAnnualSchedule";
import { defaultRows } from "./courseAnnualScheduleUtils";

interface AnnualScheduleTableProps {
  classes: Array<{ id: string; name: string }>;
  courses: Array<{ id: string; title: string }>;
}

export const AnnualScheduleTable: React.FC<AnnualScheduleTableProps> = ({
  classes,
  courses,
}) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(
    classes[0]?.id ?? null
  );
  const [selectedYear, setSelectedYear] = useState(() => {
    const year = new Date().getFullYear();
    return `${year}-${year + 1}`;
  });

  // Custom hook for supabase logic and rows state
  const {
    rows,
    isLoading,
    isSaving,
    handleCellChange,
    handleSave,
  } = useCourseAnnualSchedule({ selectedClass, selectedYear });

  const yearOptions = (() => {
    const y = new Date().getFullYear();
    return [
      `${y - 1}-${y}`,
      `${y}-${y + 1}`,
      `${y + 1}-${y + 2}`,
      `${y + 2}-${y + 3}`,
    ];
  })();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Programmation annuelle des cours</CardTitle>
      </CardHeader>
      <CardContent>
        <AnnualScheduleSelector
          classes={classes}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          years={yearOptions}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
        <AnnualScheduleEditableTable
          rows={rows}
          onCellChange={handleCellChange}
          isLoading={isLoading}
          isSaving={isSaving}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  );
};
