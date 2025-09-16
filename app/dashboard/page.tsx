'use client';

import { useUIStore } from '@/store/ui-store';
import { useRevisionStore } from '@/store/revision-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { WeekView } from '@/components/timetable/week-view';
import { Calendar, Clock, BarChart3, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { currentView, setCurrentView, toggleSidebar, sidebarOpen } = useUIStore();
  const { sessions, topics, isGenerating, error } = useRevisionStore();

  const handleViewChange = (view: string) => {
    setCurrentView(view as 'week' | 'month' | 'timeline');
  };

  const handleAddTopic = () => {
    // TODO: Open topic creation modal
    console.log('Add topic clicked');
  };

  const handleGenerateTimetable = async () => {
    // TODO: Add any pre-generation logic here
    await useRevisionStore.getState().generateTimetable();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader onAddTopic={handleAddTopic} />

      <div className="flex">
        <DashboardSidebar onGenerateTimetable={handleGenerateTimetable} />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={currentView} onValueChange={handleViewChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 lg:inline-grid">
              <TabsTrigger value="week" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Week View</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Month View</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Timeline</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="week" className="space-y-4">
              <WeekView />
            </TabsContent>

            <TabsContent value="month" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Overview</CardTitle>
                  <CardDescription>
                    See all your revision sessions in a calendar view
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4" />
                    <p>Month view component will be implemented here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline View</CardTitle>
                  <CardDescription>
                    Visualize your study schedule as a timeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4" />
                    <p>Timeline view component will be implemented here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
    </TooltipProvider>
  );
}