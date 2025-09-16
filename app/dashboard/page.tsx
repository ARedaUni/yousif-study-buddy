'use client';

import { useUIStore } from '@/store/ui-store';
import { useRevisionStore } from '@/store/revision-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BarChart3, Settings, Plus, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { currentView, setCurrentView, toggleSidebar, sidebarOpen } = useUIStore();
  const { sessions, topics, isGenerating, error } = useRevisionStore();

  const handleViewChange = (view: string) => {
    setCurrentView(view as 'week' | 'month' | 'timeline');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Revision Timetable</h1>
              <p className="text-sm text-gray-500">AI-powered study planning for GCSE success</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
          <div className="p-6">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sessions.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {sessions.filter(s => s.completed).length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Topics List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Topics</h3>
                <div className="space-y-2">
                  {topics.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-8 w-8 mx-auto mb-2" />
                      <p>No topics added yet</p>
                      <Button variant="link" size="sm" className="mt-2">
                        Add your first topic
                      </Button>
                    </div>
                  ) : (
                    topics.map((topic, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{topic.subject}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {topic.topics.join(', ')}
                            </p>
                          </div>
                          <Badge variant={topic.priority === 'high' ? 'destructive' : 
                                        topic.priority === 'medium' ? 'default' : 'secondary'}>
                            {topic.priority}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Generate Timetable */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">AI Timetable Generator</CardTitle>
                  <CardDescription className="text-xs">
                    Create an optimized study schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    disabled={isGenerating || topics.length === 0}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Timetable
                      </>
                    )}
                  </Button>
                  {error && (
                    <p className="text-xs text-red-600 mt-2">{error}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>

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
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Timetable</CardTitle>
                  <CardDescription>
                    Your study sessions organized by day and time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4" />
                    <p>Week view component will be implemented here</p>
                  </div>
                </CardContent>
              </Card>
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
  );
}