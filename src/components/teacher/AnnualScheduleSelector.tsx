
import React from "react";

interface AnnualScheduleSelectorProps {
  classes: Array<{ id: string; name: string }>;
  selectedClass: string | null;
  onClassChange: (classId: string) => void;
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export const AnnualScheduleSelector: React.FC<AnnualScheduleSelectorProps> = ({
  classes,
  selectedClass,
  onClassChange,
  years,
  selectedYear,
  onYearChange,
}) => (
  <div className="flex flex-wrap gap-4 mb-4 items-center">
    <div>
      <label className="block font-medium mb-1">Classe</label>
      <select
        className="border px-2 py-1 rounded"
        value={selectedClass ?? ""}
        onChange={(e) => onClassChange(e.target.value)}
      >
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block font-medium mb-1">Année scolaire</label>
      <select
        className="border px-2 py-1 rounded"
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
      >
        {years.map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>
    </div>
  </div>
);

