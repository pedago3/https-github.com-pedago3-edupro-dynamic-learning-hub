
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentCourses } from './StudentCourses';
import { AvailableCourses } from './AvailableCourses';

export const StudentCoursesManager = () => {
  const [activeTab, setActiveTab] = useState('my-courses');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-courses">Mes cours</TabsTrigger>
          <TabsTrigger value="available-courses">Cours disponibles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-courses" className="space-y-6">
          <StudentCourses />
        </TabsContent>
        
        <TabsContent value="available-courses" className="space-y-6">
          <AvailableCourses />
        </TabsContent>
      </Tabs>
    </div>
  );
};
