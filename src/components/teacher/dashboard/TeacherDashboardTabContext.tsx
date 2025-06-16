
import React, { createContext, useContext } from "react";

interface TeacherDashboardTabContextValue {
  setTab: (tab: string) => void;
}

const TeacherDashboardTabContext = createContext<TeacherDashboardTabContextValue | undefined>(undefined);

export const useTeacherDashboardTab = () => {
  const ctx = useContext(TeacherDashboardTabContext);
  if (!ctx) {
    throw new Error("useTeacherDashboardTab doit être utilisé dans TeacherDashboardTabProvider");
  }
  return ctx;
};

export const TeacherDashboardTabProvider: React.FC<{ setTab: (tab: string) => void; children: React.ReactNode }> = ({
  setTab,
  children,
}) => (
  <TeacherDashboardTabContext.Provider value={{ setTab }}>{children}</TeacherDashboardTabContext.Provider>
);
