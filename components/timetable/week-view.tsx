'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRevisionStore } from '@/store/revision-store';
import { SESSION_TYPE_COLORS, DIFFICULTY_COLORS } from '@/lib/schema';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { Clock, BookOpen, Plus, Sparkles, Calendar, ArrowRight } from 'lucide-react';

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeekView() {
  const { sessions } = useRevisionStore();
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start

  const getSessionsForDayAndHour = (dayIndex: number, hour: number) => {
    const day = addDays(weekStart, dayIndex);
    return sessions.filter(session => {
      const sessionStart = new Date(session.startTime);
      return isSameDay(sessionStart, day) && sessionStart.getHours() === hour;
    });
  };

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Week of {format(weekStart, 'MMM d, yyyy')}
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>New Learning</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span>Revision</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
            <span>Practice Test</span>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b">
            {/* Time column header */}
            <div className="p-4 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Time
            </div>
            {/* Day headers */}
            {DAYS.map((day, index) => {
              const date = addDays(weekStart, index);
              const isToday = isSameDay(date, today);
              return (
                <div 
                  key={day} 
                  className={`p-4 text-center border-r border-gray-200 ${
                    isToday ? 'bg-blue-50 text-blue-900 font-semibold' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium">{day}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(date, 'd MMM')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time rows */}
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-100 min-h-[4rem]">
              {/* Time column */}
              <div className="p-3 border-r border-gray-200 bg-gray-50 text-xs text-gray-600 font-medium">
                {formatTime(hour)}
              </div>
              
              {/* Day columns */}
              {DAYS.map((_, dayIndex) => {
                const daySessions = getSessionsForDayAndHour(dayIndex, hour);
                return (
                  <div key={dayIndex} className="p-1 border-r border-gray-200 min-h-[4rem]">
                    {daySessions.map(session => (
                      <div
                        key={session.id}
                        className={`p-2 rounded-md mb-1 text-xs cursor-pointer hover:shadow-sm transition-shadow ${
                          SESSION_TYPE_COLORS[session.type]
                        } ${session.completed ? 'opacity-60' : ''}`}
                      >
                        <div className="font-medium truncate" title={session.subject}>
                          {session.subject}
                        </div>
                        <div className="text-xs opacity-80 truncate" title={session.topic}>
                          {session.topic}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs">
                            {format(new Date(session.startTime), 'HH:mm')} - 
                            {format(new Date(session.endTime), 'HH:mm')}
                          </span>
                          {session.difficulty && (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs px-1 py-0 ${DIFFICULTY_COLORS[session.difficulty]}`}
                            >
                              {session.difficulty}
                            </Badge>
                          )}
                        </div>
                        {session.completed && (
                          <div className="text-xs text-green-600 mt-1 flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                            Completed
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      {sessions.length === 0 && (
        <EmptyWeekState />
      )}
    </div>
  );
}

function EmptyWeekState() {
  const { topics } = useRevisionStore();
  
  return (
    <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="text-center py-16 px-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full opacity-20"></div>
            </div>
            <Calendar className="h-16 w-16 mx-auto text-blue-500 relative z-10" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">
              Your weekly timetable awaits
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {topics.length === 0 
                ? "Start by adding your study topics, then generate an AI-powered timetable tailored to your schedule."
                : `Great! You have ${topics.length} topic${topics.length > 1 ? 's' : ''} ready. Generate your timetable to see your weekly schedule.`
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {topics.length === 0 ? (
              <>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Topic
                </Button>
                <Button variant="outline" size="lg">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Timetable
                </Button>
                <Button variant="outline" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Topics
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span>New Learning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Revision</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
              <span>Practice Test</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}