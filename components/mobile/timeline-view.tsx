'use client';

import { useRevisionStore } from '@/store/revision-store';
import { useUIStore } from '@/store/ui-store';
import {
  CardContainer,
  CardBody,
  CardItem,
} from '@/components/ui/shadcn-io/3d-card';
import { SparklesCore } from '@/components/ui/shadcn-io/sparkles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  addDays,
  startOfDay,
} from 'date-fns';
import {
  Clock,
  CheckCircle2,
  Circle,
  BookOpen,
  Brain,
  Target,
  Calendar,
} from 'lucide-react';
import { Session } from '@/lib/schema';
import { useState, useRef } from 'react';

const getSessionIcon = (type: Session['type']) => {
  switch (type) {
    case 'new-learning':
      return <BookOpen className="h-4 w-4" />;
    case 'revision':
      return <Brain className="h-4 w-4" />;
    case 'practice-test':
      return <Target className="h-4 w-4" />;
    default:
      return <Circle className="h-4 w-4" />;
  }
};

const getSessionTypeColors = (type: Session['type']) => {
  switch (type) {
    case 'new-learning':
      return 'from-blue-500/20 to-blue-600/30 border-blue-200';
    case 'revision':
      return 'from-green-500/20 to-green-600/30 border-green-200';
    case 'practice-test':
      return 'from-orange-500/20 to-orange-600/30 border-orange-200';
    default:
      return 'from-gray-500/20 to-gray-600/30 border-gray-200';
  }
};

const getDayLabel = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMM d');
};

interface SessionCardProps {
  session: Session;
  onToggleComplete: (id: string) => void;
  onSessionClick: (session: Session) => void;
}

function SessionCard({
  session,
  onToggleComplete,
  onSessionClick,
}: SessionCardProps) {
  const typeColors = getSessionTypeColors(session.type);
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);

  return (
    <CardContainer className="w-full">
      <CardBody className="relative">
        <motion.div
          className={`bg-gradient-to-br ${typeColors} backdrop-blur-sm border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg`}
          onClick={() => onSessionClick(session)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <CardItem translateZ={20} className="w-full">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getSessionIcon(session.type)}
                <span className="font-medium text-slate-800 capitalize">
                  {session.type.replace('-', ' ')}
                </span>
              </div>
              <motion.button
                className="flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(session.id);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {session.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-400" />
                )}
              </motion.button>
            </div>

            <CardItem translateZ={30}>
              <h3 className="font-semibold text-slate-900 mb-1">
                {session.subject}
              </h3>
              <p className="text-sm text-slate-700 mb-3">{session.topic}</p>
            </CardItem>

            <CardItem
              translateZ={10}
              className="flex items-center justify-between text-xs text-slate-600"
            >
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                </span>
              </div>
              {session.difficulty && (
                <div className="flex items-center gap-1">
                  <span>Difficulty:</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < session.difficulty!
                            ? 'bg-yellow-400'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardItem>

            {session.completed && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-green-500/10 backdrop-blur-sm rounded-xl flex items-center justify-center"
              >
                <div className="absolute inset-0">
                  <SparklesCore
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.2}
                    particleDensity={50}
                    className="w-full h-full"
                    particleColor="#10b981"
                  />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-10 bg-green-100 rounded-full p-2"
                >
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </motion.div>
              </motion.div>
            )}
          </CardItem>
        </motion.div>
      </CardBody>
    </CardContainer>
  );
}

export function MobileTimelineView() {
  const { sessions, toggleSessionComplete } = useRevisionStore();
  const { setSelectedSession, setBottomSheetOpen } = useUIStore();
  const [pullToRefreshOffset, setPullToRefreshOffset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session.id);
    setBottomSheetOpen(true);
  };

  // Group sessions by day
  const groupedSessions = sessions.reduce(
    (groups, session) => {
      const day = startOfDay(new Date(session.startTime));
      const dayKey = day.toISOString();

      if (!groups[dayKey]) {
        groups[dayKey] = {
          date: day,
          sessions: [],
        };
      }

      groups[dayKey].sessions.push(session);
      return groups;
    },
    {} as Record<string, { date: Date; sessions: Session[] }>
  );

  // Sort by date and get next 7 days if no sessions
  const sortedDays = Object.values(groupedSessions).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // If no sessions, show next 7 days
  const daysToShow =
    sortedDays.length > 0
      ? sortedDays
      : Array.from({ length: 7 }, (_, i) => ({
          date: addDays(new Date(), i),
          sessions: [],
        }));

  const completedCount = sessions.filter((s) => s.completed).length;
  const progressPercentage =
    sessions.length > 0 ? (completedCount / sessions.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">
            Study Progress
          </h2>
          <span className="text-2xl font-bold text-blue-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <p className="text-sm text-slate-600">
          {completedCount} of {sessions.length} sessions completed
        </p>
      </motion.div>

      {/* Timeline */}
      <div ref={scrollRef} className="space-y-6">
        <AnimatePresence>
          {daysToShow.map((day, dayIndex) => (
            <motion.div
              key={day.date.toISOString()}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="space-y-3"
            >
              {/* Day Header */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {getDayLabel(day.date)}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
              </div>

              {/* Sessions for this day */}
              <div className="space-y-3 pl-5">
                {day.sessions.length > 0 ? (
                  day.sessions.map((session, sessionIndex) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: dayIndex * 0.1 + sessionIndex * 0.05,
                      }}
                    >
                      <SessionCard
                        session={session}
                        onToggleComplete={toggleSessionComplete}
                        onSessionClick={handleSessionClick}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: dayIndex * 0.1 }}
                    className="bg-slate-50/50 backdrop-blur-sm border border-slate-200 rounded-xl p-6 text-center"
                  >
                    <div className="text-slate-400 mb-2">
                      <Calendar className="h-8 w-8 mx-auto" />
                    </div>
                    <p className="text-slate-600 text-sm">
                      No sessions planned
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      Tap the + button to add topics and generate your schedule
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {sessions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0">
              <SparklesCore
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={30}
                className="w-full h-full"
                particleColor="#3B82F6"
              />
            </div>
            <BookOpen className="h-16 w-16 mx-auto text-blue-500 relative z-10" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Ready to start studying?
          </h3>
          <p className="text-slate-600 mb-6 max-w-sm mx-auto">
            Add your topics and let our AI create the perfect study schedule for
            you.
          </p>
          <motion.button
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {}}
          >
            Get Started
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
