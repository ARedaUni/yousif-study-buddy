'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useRevisionStore } from '@/store/revision-store';
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Plus,
  BookOpen,
  Target,
} from 'lucide-react';
import { useState } from 'react';

export function MonthView() {
  const { sessions, topics } = useRevisionStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const sessionsForSelectedDate = selectedDate
    ? sessions.filter((session) =>
        isSameDay(new Date(session.startTime), selectedDate)
      )
    : [];

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) =>
      isSameDay(new Date(session.startTime), date)
    );
  };

  const hasSessionsOnDate = (date: Date) => {
    return getSessionsForDate(date).length > 0;
  };

  if (sessions.length === 0) {
    return <EmptyMonthState />;
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
              modifiers={{
                hasSession: (date) => hasSessionsOnDate(date),
                completed: (date) => {
                  const dateSessions = getSessionsForDate(date);
                  return (
                    dateSessions.length > 0 &&
                    dateSessions.every((s) => s.completed)
                  );
                },
              }}
              modifiersStyles={{
                hasSession: {
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  fontWeight: 'bold',
                },
                completed: {
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  fontWeight: 'bold',
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedDate
                    ? format(selectedDate, 'MMMM d, yyyy')
                    : 'Select a date'}
                </h3>
                <p className="text-sm text-gray-500">
                  {sessionsForSelectedDate.length} session
                  {sessionsForSelectedDate.length !== 1 ? 's' : ''}
                </p>
              </div>

              {sessionsForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {sessionsForSelectedDate.map((session) => (
                    <div
                      key={session.id}
                      className="p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {session.subject}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {session.topic}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {format(new Date(session.startTime), 'HH:mm')} -
                            {format(new Date(session.endTime), 'HH:mm')}
                          </p>
                        </div>
                        {session.completed && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No sessions on this day</p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Has sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>All completed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyMonthState() {
  const { topics } = useRevisionStore();

  return (
    <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardContent className="text-center py-20 px-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 bg-purple-100 rounded-full opacity-20"></div>
            </div>
            <CalendarIcon className="h-20 w-20 mx-auto text-purple-500 relative z-10" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">
              Monthly overview coming soon
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {topics.length === 0
                ? 'Add your study topics first, then generate sessions to see them displayed in a beautiful monthly calendar view.'
                : 'Generate your timetable to see all your study sessions organized in a monthly calendar format.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {topics.length === 0 ? (
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Study Topics
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Schedule
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 text-sm text-gray-500">
            <div className="text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <p>Track Progress</p>
            </div>
            <div className="text-center">
              <CalendarIcon className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <p>Monthly View</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <p>Study Sessions</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
