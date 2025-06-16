
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { MyCourses } from '@/components/dashboard/MyCourses';
import { MyLessons } from '@/components/dashboard/MyLessons';
import { MyProgress } from '@/components/dashboard/MyProgress';
import { MyAssessments } from '@/components/dashboard/MyAssessments';
import { MyBadges } from '@/components/dashboard/MyBadges';
import { DailyMissions } from '@/components/dashboard/DailyMissions';
import { Notifications } from '@/components/dashboard/Notifications';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { 
  LayoutDashboard, 
  BookOpen, 
  Play, 
  TrendingUp, 
  FileText, 
  Award, 
  Target, 
  Bell, 
  MessageCircle 
} from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, setActiveTab }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-9 lg:w-auto lg:grid-cols-9 glass border-white/30 backdrop-blur-xl animate-fade-in animation-delay-200">
        <TabsTrigger 
          value="overview" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Accueil</span>
        </TabsTrigger>
        <TabsTrigger 
          value="courses" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Cours</span>
        </TabsTrigger>
        <TabsTrigger 
          value="lessons" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
        >
          <Play className="h-4 w-4" />
          <span className="hidden sm:inline">Leçons</span>
        </TabsTrigger>
        <TabsTrigger 
          value="progress" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
        >
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Progrès</span>
        </TabsTrigger>
        <TabsTrigger 
          value="assessments" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Évaluations</span>
        </TabsTrigger>
        <TabsTrigger 
          value="badges" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
        >
          <Award className="h-4 w-4" />
          <span className="hidden sm:inline">Badges</span>
        </TabsTrigger>
        <TabsTrigger 
          value="missions" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
        >
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">Missions</span>
        </TabsTrigger>
        <TabsTrigger 
          value="notifications" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger 
          value="chat" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Messages</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-8">
        <TabsContent value="overview" className="animate-fade-in">
          <DashboardOverview />
        </TabsContent>

        <TabsContent value="courses" className="animate-fade-in">
          <MyCourses />
        </TabsContent>

        <TabsContent value="lessons" className="animate-fade-in">
          <MyLessons />
        </TabsContent>

        <TabsContent value="progress" className="animate-fade-in">
          <MyProgress />
        </TabsContent>

        <TabsContent value="assessments" className="animate-fade-in">
          <MyAssessments />
        </TabsContent>

        <TabsContent value="badges" className="animate-fade-in">
          <MyBadges />
        </TabsContent>

        <TabsContent value="missions" className="animate-fade-in">
          <DailyMissions />
        </TabsContent>

        <TabsContent value="notifications" className="animate-fade-in">
          <Notifications />
        </TabsContent>

        <TabsContent value="chat" className="animate-fade-in">
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/20 backdrop-blur-xl">
              <h2 className="text-2xl font-bold gradient-text mb-2">Messages</h2>
              <p className="text-slate-600">
                Communiquez avec vos enseignants en temps réel
              </p>
            </div>
            <ChatInterface />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};
