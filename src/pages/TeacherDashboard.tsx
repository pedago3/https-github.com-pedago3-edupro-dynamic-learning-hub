
import { Navigate } from 'react-router-dom';
import { Tabs } from '@/components/ui/tabs';
import { useTeacherDashboard } from '@/hooks/useTeacherDashboard';
import { TeacherDashboardTabProvider } from '@/components/teacher/dashboard/TeacherDashboardTabContext';
import { TeacherDashboardHeader } from '@/components/teacher/dashboard/TeacherDashboardHeader';
import { TeacherDashboardTabs } from '@/components/teacher/dashboard/TeacherDashboardTabs';
import { TeacherDashboardContent } from '@/components/teacher/dashboard/TeacherDashboardContent';
import { TeacherDashboardBackground } from '@/components/teacher/dashboard/TeacherDashboardBackground';

const TeacherDashboard = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    isSigningOut,
    handleSignOut,
  } = useTeacherDashboard();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <TeacherDashboardHeader 
        onSignOut={handleSignOut}
        isSigningOut={isSigningOut}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-12 relative z-10">
        <TeacherDashboardTabProvider setTab={setActiveTab}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TeacherDashboardTabs />
            <TeacherDashboardContent />
          </Tabs>
        </TeacherDashboardTabProvider>
      </div>

      <TeacherDashboardBackground />
    </div>
  );
};

export default TeacherDashboard;
