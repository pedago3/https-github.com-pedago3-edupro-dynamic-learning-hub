
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { TeacherOverview } from '@/components/teacher/TeacherOverview';
import { TeacherCoursesManager } from '@/components/teacher/TeacherCoursesManager';
import { TeacherClassesManager } from '@/components/teacher/TeacherClassesManager';
import { TeacherStudents } from '@/components/teacher/TeacherStudents';
import { CreateAssessment } from '@/components/teacher/CreateAssessment';
import { ResourceManager } from '@/components/teacher/ResourceManager';
import { CalendarEventView } from '@/components/teacher/CalendarEventView';
import { ChatInterface } from '@/components/chat/ChatInterface';

export const TeacherDashboardContent = () => {
  return (
    <div className="mt-8">
      <TabsContent value="overview" className="animate-fade-in">
        <TeacherOverview />
      </TabsContent>

      <TabsContent value="courses" className="animate-fade-in">
        <TeacherCoursesManager />
      </TabsContent>

      <TabsContent value="classes" className="animate-fade-in">
        <TeacherClassesManager />
      </TabsContent>

      <TabsContent value="students" className="animate-fade-in">
        <TeacherStudents />
      </TabsContent>

      <TabsContent value="assessments" className="animate-fade-in">
        <CreateAssessment />
      </TabsContent>

      <TabsContent value="resources" className="animate-fade-in">
        <ResourceManager />
      </TabsContent>

      <TabsContent value="calendar" className="animate-fade-in">
        <CalendarEventView />
      </TabsContent>

      <TabsContent value="chat" className="animate-fade-in">
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-white/20 backdrop-blur-xl">
            <h2 className="text-2xl font-bold gradient-text mb-2">Messages</h2>
            <p className="text-slate-600">
              Communiquez avec vos élèves en temps réel
            </p>
          </div>
          <ChatInterface />
        </div>
      </TabsContent>
    </div>
  );
};
