'use client';

import { useRevisionStore } from '@/store/revision-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { Clock, BookOpen, Target, Brain, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const sessionTypeIcons = {
  'new-learning': BookOpen,
  revision: Brain,
  'practice-test': Target,
};

const sessionTypeColors = {
  'new-learning': 'bg-blue-100 text-blue-800 border-blue-200',
  revision: 'bg-green-100 text-green-800 border-green-200',
  'practice-test': 'bg-orange-100 text-orange-800 border-orange-200',
};

export function TimetableDisplay() {
  const { sessions } = useRevisionStore();

  if (sessions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No timetable generated yet</p>
            <p className="text-sm">
              Add some topics and generate your schedule
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group sessions by date
  const sessionsByDate = sessions.reduce(
    (acc, session) => {
      const dateKey = format(session.startTime, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(session);
      return acc;
    },
    {} as Record<string, typeof sessions>
  );

  // Get dates for the next 14 days
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
  const dates = Array.from({ length: 14 }, (_, i) => addDays(startDate, i));

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Your Revision Timetable
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dates.map((date) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const daySessions = sessionsByDate[dateKey] || [];
          const isCurrentDay = isToday(date);

          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`h-full ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {format(date, 'EEEE')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(date, 'MMM d')}
                      </p>
                    </div>
                    {isCurrentDay && (
                      <Badge variant="default" className="bg-blue-500">
                        Today
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {daySessions.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No sessions scheduled</p>
                    </div>
                  ) : (
                    daySessions
                      .sort(
                        (a, b) => a.startTime.getTime() - b.startTime.getTime()
                      )
                      .map((session) => {
                        const IconComponent = sessionTypeIcons[session.type];
                        return (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="group"
                          >
                            <div
                              className="p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer"
                              style={{
                                borderLeftColor: session.color,
                                borderLeftWidth: '4px',
                              }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <IconComponent
                                    className="h-4 w-4"
                                    style={{ color: session.color }}
                                  />
                                  <h4 className="font-medium text-sm">
                                    {session.subject}
                                  </h4>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${sessionTypeColors[session.type]}`}
                                >
                                  {session.type.replace('-', ' ')}
                                </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">
                                {session.topic}
                              </p>

                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {format(session.startTime, 'HH:mm')} -{' '}
                                  {format(session.endTime, 'HH:mm')}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
