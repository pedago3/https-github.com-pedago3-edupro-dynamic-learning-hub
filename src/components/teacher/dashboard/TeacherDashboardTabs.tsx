
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap, 
  FileText, 
  FolderOpen, 
  Calendar, 
  MessageCircle 
} from 'lucide-react';

export const TeacherDashboardTabs = () => {
  return (
    <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-8 glass border-white/30 backdrop-blur-xl animate-fade-in animation-delay-200 mt-4">
      <TabsTrigger 
        value="overview" 
        className="font-bold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden sm:inline">Accueil</span>
      </TabsTrigger>
      <TabsTrigger 
        value="courses" 
        className="font-bold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
      >
        <BookOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Cours</span>
      </TabsTrigger>
      <TabsTrigger 
        value="classes" 
        className="font-bold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Classes</span>
      </TabsTrigger>
      <TabsTrigger 
        value="students" 
        className="font-bold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
      >
        <GraduationCap className="h-4 w-4" />
        <span className="hidden sm:inline">Élèves</span>
      </TabsTrigger>
      <TabsTrigger 
        value="assessments" 
        className="font-bold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Évaluations</span>
      </TabsTrigger>
      <TabsTrigger 
        value="resources" 
        className="font-bold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
      >
        <FolderOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Ressources</span>
      </TabsTrigger>
      <TabsTrigger 
        value="calendar" 
        className="font-bold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Agenda</span>
      </TabsTrigger>
      <TabsTrigger 
        value="chat" 
        className="font-bold flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300 hover-lift"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Messages</span>
      </TabsTrigger>
    </TabsList>
  );
};

