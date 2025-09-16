'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRevisionStore } from '@/store/revision-store';
import { useUIStore } from '@/store/ui-store';
import { 
  BookOpen,
  BarChart3,
  Target,
  Clock,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { format, isToday, addDays } from 'date-fns';

interface DashboardSidebarProps {
  onGenerateTimetable?: () => void;
}

export function DashboardSidebar({ onGenerateTimetable }: DashboardSidebarProps) {
  const { sessions, topics, isGenerating, error, generateTimetable } = useRevisionStore();
  const { sidebarOpen } = useUIStore();

  const completedSessions = sessions.filter(s => s.completed);
  const totalSessions = sessions.length;
  const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0;

  // Get upcoming sessions (next 7 days)
  const upcomingSessions = sessions
    .filter(s => !s.completed && new Date(s.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  // Calculate study streak (consecutive days with completed sessions)
  const calculateStreak = () => {
    let streak = 0;
    let currentDate = new Date();
    
    while (streak < 30) { // Max 30 days back
      const hasSessionToday = completedSessions.some(s => 
        format(new Date(s.endTime), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
      );
      
      if (hasSessionToday) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const studyStreak = calculateStreak();

  const handleGenerate = async () => {
    if (onGenerateTimetable) {
      onGenerateTimetable();
    } else {
      await generateTimetable();
    }
  };

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Study Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Study Overview</h3>
              <Tooltip>
                <TooltipTrigger>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  Your study progress and statistics
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
                    </div>
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{completedSessions.length}</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Subjects</p>
                      <p className="text-2xl font-bold text-purple-600">{topics.length}</p>
                    </div>
                    <BookOpen className="h-4 w-4 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Streak</p>
                      <p className="text-2xl font-bold text-orange-600">{studyStreak}</p>
                    </div>
                    <Flame className="h-4 w-4 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold text-gray-900">{Math.round(completionRate)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </div>

          <Separator />

          {/* Topics Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Current Topics</h3>
              <Badge variant="secondary" className="text-xs">
                {topics.length}
              </Badge>
            </div>

            {topics.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No topics added yet</p>
                <p className="text-xs text-gray-400 mt-1">Add your first topic to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.slice(0, 4).map((topic, index) => {
                  const topicSessions = sessions.filter(s => s.subject === topic.subject);
                  const completedTopicSessions = topicSessions.filter(s => s.completed);
                  const topicProgress = topicSessions.length > 0 
                    ? (completedTopicSessions.length / topicSessions.length) * 100 
                    : 0;

                  return (
                    <Card key={index} className="border border-gray-100 hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {topic.subject}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {topic.topics.join(', ')}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              topic.priority === 'high' ? 'destructive' : 
                              topic.priority === 'medium' ? 'default' : 'secondary'
                            }
                            className="text-xs ml-2"
                          >
                            {topic.priority}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium">{Math.round(topicProgress)}%</span>
                          </div>
                          <Progress value={topicProgress} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {topics.length > 4 && (
                  <div className="text-center">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View all {topics.length} topics
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Upcoming Sessions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
            
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming sessions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingSessions.map((session) => (
                  <Card key={session.id} className="border border-gray-100">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">
                            {session.subject}
                          </p>
                          <p className="text-xs text-gray-500">{session.topic}</p>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {isToday(new Date(session.startTime)) ? 'Today' : format(new Date(session.startTime), 'MMM d')} at{' '}
                            {format(new Date(session.startTime), 'HH:mm')}
                          </div>
                        </div>
                        {session.difficulty && (
                          <Badge variant="outline" className="text-xs">
                            Level {session.difficulty}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* AI Timetable Generator */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center">
                <Target className="h-4 w-4 mr-2" />
                AI Timetable Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-gray-600">
                Create an optimized study schedule based on your topics and availability
              </p>
              
              <Button 
                className="w-full" 
                disabled={isGenerating || topics.length === 0}
                onClick={handleGenerate}
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
                <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </aside>
  );
}