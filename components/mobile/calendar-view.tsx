'use client';

import { useRevisionStore } from '@/store/revision-store';
import { useUIStore } from '@/store/ui-store';
import { MiniCalendar } from '@/components/ui/shadcn-io/mini-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfDay, isSameDay } from 'date-fns';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { Session } from '@/lib/schema';
import { useState } from 'react';

export function MobileCalendarView() {
  const { sessions } = useRevisionStore();
  const { setSelectedSession, setBottomSheetOpen } = useUIStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get sessions for selected date
  const selectedDateSessions = sessions.filter((session) =>
    isSameDay(new Date(session.startTime), selectedDate)
  );

  // Get session dots for calendar
  const getSessionDots = (date: Date) => {
    const dateSessions = sessions.filter((session) =>
      isSameDay(new Date(session.startTime), date)
    );

    return dateSessions.map((session) => ({
      color:
        session.type === 'new-learning'
          ? '#3B82F6'
          : session.type === 'revision'
            ? '#10B981'
            : '#F59E0B',
      completed: session.completed,
    }));
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session.id);
    setBottomSheetOpen(true);
  };

  const getSessionTypeColors = (type: Session['type']) => {
    switch (type) {
      case 'new-learning':
        return 'from-blue-500/20 to-blue-600/30 border-blue-200 text-blue-800';
      case 'revision':
        return 'from-green-500/20 to-green-600/30 border-green-200 text-green-800';
      case 'practice-test':
        return 'from-orange-500/20 to-orange-600/30 border-orange-200 text-orange-800';
      default:
        return 'from-gray-500/20 to-gray-600/30 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-800">
            Study Calendar
          </h2>
        </div>

        <p className="text-sm text-slate-600">
          Tap any date to see your study sessions
        </p>
      </motion.div>

      {/* Mini Calendar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg"
      >
        <MiniCalendar
          value={selectedDate}
          onValueChange={(date) => date && setSelectedDate(date)}
          className="w-full"
        />
      </motion.div>

      {/* Selected Date Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
        </div>

        <AnimatePresence mode="wait">
          {selectedDateSessions.length > 0 ? (
            <motion.div
              key={selectedDate.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {selectedDateSessions
                .sort(
                  (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime()
                )
                .map((session, index) => {
                  const startTime = new Date(session.startTime);
                  const endTime = new Date(session.endTime);
                  const typeColors = getSessionTypeColors(session.type);

                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${typeColors} backdrop-blur-sm border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg`}
                      onClick={() => handleSessionClick(session)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              session.type === 'new-learning'
                                ? 'bg-blue-500'
                                : session.type === 'revision'
                                  ? 'bg-green-500'
                                  : 'bg-orange-500'
                            }`}
                          />
                          <span className="text-sm font-medium capitalize">
                            {session.type.replace('-', ' ')}
                          </span>
                        </div>
                        <span className="text-xs opacity-70">
                          {format(startTime, 'HH:mm')} -{' '}
                          {format(endTime, 'HH:mm')}
                        </span>
                      </div>

                      <h4 className="font-semibold mb-1">{session.subject}</h4>
                      <p className="text-sm opacity-80">{session.topic}</p>

                      {session.completed && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span>Completed</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${selectedDate.toISOString()}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-50/50 backdrop-blur-sm border border-slate-200 rounded-xl p-8 text-center"
            >
              <div className="text-slate-400 mb-3">
                <BookOpen className="h-12 w-12 mx-auto" />
              </div>
              <h4 className="font-medium text-slate-700 mb-1">
                No sessions planned
              </h4>
              <p className="text-sm text-slate-500">
                This day is free for additional study or rest
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Calendar Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg"
      >
        <h4 className="font-medium text-slate-800 mb-3">Session Types</h4>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-600">New Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-600">Revision</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-slate-600">Practice Test</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
