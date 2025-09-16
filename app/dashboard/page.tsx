'use client';

import { useUIStore } from '@/store/ui-store';
import { useRevisionStore } from '@/store/revision-store';
import { MessageDock } from '@/components/ui/shadcn-io/message-dock';
import {
  Dock,
  DockItem,
  DockIcon,
  DockLabel,
} from '@/components/ui/shadcn-io/dock';
import { MobileTimelineView } from '@/components/mobile/timeline-view';
import { MobileCalendarView } from '@/components/mobile/calendar-view';
import { AIChatView } from '@/components/mobile/ai-chat-view';
import { BottomActionSheet } from '@/components/mobile/bottom-sheet';
import { TopicInputModal } from '@/components/forms/topic-input-modal';
import { Home, BookOpen, Calendar, Settings, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function DashboardPage() {
  const {
    currentView,
    setCurrentView,
    aiChatOpen,
    setAIChatOpen,
    bottomSheetOpen,
    setBottomSheetOpen,
  } = useUIStore();

  const { sessions, generateTimetable, isGenerating } = useRevisionStore();
  const [selectedDockItem, setSelectedDockItem] = useState<string>('home');

  const aiCharacters = [
    { emoji: '🧙‍♂️', name: 'AI Tutor', online: true },
    { emoji: '📚', name: 'Study Buddy', online: true },
    { emoji: '🎯', name: 'Quiz Master', online: false },
  ];

  const handleAIMessage = (
    message: string,
    character: any,
    characterIndex: number
  ) => {
    console.log('AI Message:', message, character);
  };

  const handleDockNavigation = (view: string) => {
    setSelectedDockItem(view);
    if (view === 'home') setCurrentView('timeline');
    else if (view === 'schedule') setCurrentView('calendar');
    else if (view === 'settings') setBottomSheetOpen(true);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'timeline':
        return <MobileTimelineView />;
      case 'calendar':
        return <MobileCalendarView />;
      case 'chat':
        return <AIChatView />;
      default:
        return <MobileTimelineView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Glass morphism background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-white/5 to-transparent"></div>

      {/* Mobile-first main content */}
      <main className="relative z-10 pb-24 min-h-screen">
        {/* Header - Mobile optimized */}
        <motion.header
          className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-white/20 px-4 py-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Study Planner
              </h1>
              <p className="text-sm text-slate-600">
                {sessions.length > 0
                  ? `${sessions.length} sessions planned`
                  : 'Ready to plan your studies'}
              </p>
            </div>
          </div>
        </motion.header>

        {/* Dynamic view content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-6"
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Dock - Mobile-first */}
      <Dock className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <DockItem onClick={() => handleDockNavigation('home')}>
          <DockIcon>
            <Home
              className={`h-6 w-6 ${selectedDockItem === 'home' ? 'text-blue-600' : 'text-slate-600'}`}
            />
          </DockIcon>
          <DockLabel>Home</DockLabel>
        </DockItem>

        <DockItem onClick={() => handleDockNavigation('topics')}>
          <DockIcon>
            <BookOpen
              className={`h-6 w-6 ${selectedDockItem === 'topics' ? 'text-blue-600' : 'text-slate-600'}`}
            />
          </DockIcon>
          <DockLabel>Topics</DockLabel>
        </DockItem>

        <DockItem onClick={() => handleDockNavigation('schedule')}>
          <DockIcon>
            <Calendar
              className={`h-6 w-6 ${selectedDockItem === 'schedule' ? 'text-blue-600' : 'text-slate-600'}`}
            />
          </DockIcon>
          <DockLabel>Schedule</DockLabel>
        </DockItem>

        <DockItem onClick={() => handleDockNavigation('settings')}>
          <DockIcon>
            <Settings
              className={`h-6 w-6 ${selectedDockItem === 'settings' ? 'text-blue-600' : 'text-slate-600'}`}
            />
          </DockIcon>
          <DockLabel>Settings</DockLabel>
        </DockItem>
      </Dock>

      {/* AI Assistant - Floating message dock */}
      <MessageDock
        characters={aiCharacters}
        onMessageSend={handleAIMessage}
        position="bottom"
        showSparkleButton={true}
        className="fixed bottom-20 right-4 z-40"
        placeholder={(name) => `Ask ${name}...`}
        onDockToggle={(isExpanded) => setAIChatOpen(isExpanded)}
      />

      {/* Mobile Modals and Sheets */}
      <div className="fixed top-4 left-4 z-50">
        <TopicInputModal />
      </div>

      <BottomActionSheet
        open={bottomSheetOpen}
        onOpenChange={setBottomSheetOpen}
      />

      {/* Loading overlay for AI generation */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                <p className="text-slate-700 font-medium">
                  Generating your study plan...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
