'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRevisionStore } from '@/store/revision-store';
import { SESSION_TYPE_COLORS, DIFFICULTY_COLORS } from '@/lib/schema';
import {
  format,
  differenceInDays,
  isToday,
  isTomorrow,
  isYesterday,
} from 'date-fns';
import { Clock, Sparkles, Plus, TrendingUp, Target, Zap } from 'lucide-react';

export function TimelineView() {
  const { sessions, topics } = useRevisionStore();

  if (sessions.length === 0) {
    return <EmptyTimelineState />;
  }

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const groupSessionsByDate = () => {
    const groups: { [key: string]: typeof sessions } = {};

    sortedSessions.forEach((session) => {
      const dateKey = format(new Date(session.startTime), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });

    return Object.entries(groups).map(([dateKey, sessions]) => ({
      date: new Date(dateKey),
      sessions,
    }));
  };

  const groupedSessions = groupSessionsByDate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Study Timeline
          </h2>
          <p className="text-sm text-gray-500">
            Your sessions organized chronologically
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Upcoming</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200"></div>

        <div className="space-y-8">
          {groupedSessions.map(({ date, sessions }, groupIndex) => (
            <div key={format(date, 'yyyy-MM-dd')} className="relative">
              {/* Date marker */}
              <div className="flex items-center mb-4">
                <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-4 border-blue-200 rounded-full">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">
                    {getDateLabel(date)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Sessions for this date */}
              <div className="ml-16 space-y-3">
                {sessions.map((session, sessionIndex) => {
                  const isPast = new Date(session.endTime) < new Date();
                  const isActive =
                    new Date(session.startTime) <= new Date() &&
                    new Date(session.endTime) > new Date();

                  return (
                    <Card
                      key={session.id}
                      className={`transition-all duration-200 hover:shadow-md ${
                        session.completed
                          ? 'bg-green-50 border-green-200'
                          : isActive
                            ? 'bg-blue-50 border-blue-300 shadow-md'
                            : isPast
                              ? 'bg-gray-50 border-gray-200'
                              : 'bg-white border-gray-200'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {session.subject}
                              </h4>
                              <Badge
                                variant="outline"
                                className={SESSION_TYPE_COLORS[session.type]}
                              >
                                {session.type.replace('-', ' ')}
                              </Badge>
                              {session.difficulty && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${DIFFICULTY_COLORS[session.difficulty as keyof typeof DIFFICULTY_COLORS]}`}
                                >
                                  Level {session.difficulty}
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                              {session.topic}
                            </p>

                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>
                                {format(new Date(session.startTime), 'HH:mm')} -
                                {format(new Date(session.endTime), 'HH:mm')}
                              </span>
                              <span>
                                {Math.round(
                                  (new Date(session.endTime).getTime() -
                                    new Date(session.startTime).getTime()) /
                                    (1000 * 60)
                                )}{' '}
                                min
                              </span>
                            </div>

                            {session.notes && (
                              <p className="text-xs text-gray-500 mt-2 italic">
                                &ldquo;{session.notes}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            {session.completed && (
                              <div className="flex items-center space-x-1 text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium">
                                  Completed
                                </span>
                              </div>
                            )}

                            {isActive && (
                              <div className="flex items-center space-x-1 text-blue-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium">
                                  Active
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyTimelineState() {
  const { topics } = useRevisionStore();

  return (
    <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-indigo-50 to-cyan-50">
      <CardContent className="text-center py-20 px-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 bg-indigo-100 rounded-full opacity-20"></div>
            </div>
            <TrendingUp className="h-20 w-20 mx-auto text-indigo-500 relative z-10" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">
              Your study journey starts here
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {topics.length === 0
                ? "Timeline view will show your study sessions chronologically, helping you track progress and see what's coming next."
                : 'Ready to see your study schedule as a timeline? Generate your timetable to visualize your learning journey.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {topics.length === 0 ? (
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Study Topics
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Timeline
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 text-sm text-gray-500">
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-indigo-400" />
              <p>Chronological</p>
            </div>
            <div className="text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-indigo-400" />
              <p>Track Progress</p>
            </div>
            <div className="text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-indigo-400" />
              <p>Stay Motivated</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
