
import { useMyProgressData } from "@/hooks/useMyProgressData";
import { MyProgressLoading } from "./MyProgressLoading";
import { MyProgressHeader } from "./MyProgressHeader";
import { ProgressStatsCards } from "./ProgressStatsCards";
import { CourseProgressList } from "./CourseProgressList";
import { RecentBadges } from "./RecentBadges";

export const MyProgress = () => {
  const { data: progressData, isLoading } = useMyProgressData();

  if (isLoading) {
    return <MyProgressLoading />;
  }

  return (
    <div className="space-y-6">
      <MyProgressHeader />
      {/* Statistiques générales */}
      <ProgressStatsCards
        overallProgress={progressData?.overallProgress}
        completedLessonsCount={progressData?.completedLessonsCount}
        totalLessons={progressData?.totalLessons}
        completedMissionsThisWeek={progressData?.completedMissionsThisWeek}
        totalMissionsThisWeek={progressData?.totalMissionsThisWeek}
        weeklyProgress={progressData?.weeklyProgress}
        badgesCount={progressData?.badges?.length}
      />
      {/* Progression par cours */}
      <CourseProgressList enrollments={progressData?.enrollments || []} />
      {/* Badges récents */}
      {progressData?.badges?.length > 0 && (
        <RecentBadges badges={progressData.badges} />
      )}
    </div>
  );
};
