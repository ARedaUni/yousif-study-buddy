'use client';

import { useUIStore } from '@/store/ui-store';
import { useRevisionStore } from '@/store/revision-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WeekView } from '@/components/timetable/week-view';
import { Calendar, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { currentView, setCurrentView } = useUIStore();
  const handleViewChange = (view: string) => {
    setCurrentView(view as 'timeline' | 'calendar' | 'chat');
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Main Content */}
          <main className="flex-1 p-6">
            <Tabs
              value={currentView}
              onValueChange={handleViewChange}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 lg:inline-grid">
                <TabsTrigger
                  value="week"
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Week View</span>
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Month View</span>
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="flex items-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>Timeline</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="week" className="space-y-4">
                <WeekView />
              </TabsContent>

              <TabsContent value="month" className="space-y-4"></TabsContent>

              <TabsContent value="timeline" className="space-y-4"></TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
