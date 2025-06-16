
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Nouveau Row type sans "hour"
type Row = {
  semaine: string;
  mois: string;
  days: string[];
};
type AnnualScheduleEditableTableProps = {
  rows: Row[];
  onCellChange: (rowIdx: number, colIdx: number, value: string) => void;
  isLoading: boolean;
  isSaving: boolean;
  onSave: () => void;
};

const WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

export const AnnualScheduleEditableTable: React.FC<AnnualScheduleEditableTableProps> = ({
  rows,
  onCellChange,
  isLoading,
  isSaving,
  onSave,
}) => {
  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-muted">
            <th className="border px-3 py-2">Semaine</th>
            <th className="border px-3 py-2">Mois</th>
            {WEEKDAYS.map((day) => (
              <th key={day} className="border px-3 py-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              <td className="border px-3 py-2">{row.semaine}</td>
              <td className="border px-3 py-2">{row.mois}</td>
              {row.days.map((val, colIdx) => (
                <td className="border px-2 py-2" key={colIdx}>
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded bg-white"
                    placeholder="ex: Mathématiques"
                    value={val}
                    onChange={(e) =>
                      onCellChange(rowIdx, colIdx, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        onClick={onSave}
        disabled={isSaving || isLoading}
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : null}
        Enregistrer la programmation
      </Button>
    </div>
  );
};
