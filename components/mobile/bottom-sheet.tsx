'use client';

import { useUIStore } from '@/store/ui-store';
import { useRevisionStore } from '@/store/revision-store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Palette,
  Calendar,
  BookOpen,
  Target,
  Clock,
  BarChart3,
  Download,
  Share,
  Moon,
  Sun,
} from 'lucide-react';
import { useState } from 'react';

interface BottomActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BottomActionSheet({
  open,
  onOpenChange,
}: BottomActionSheetProps) {
  const {
    setAvailabilityModalOpen,
    setPreferencesModalOpen,
    currentView,
    setCurrentView,
  } = useUIStore();
  const { sessions, generateTimetable, isGenerating } = useRevisionStore();
  const [darkMode, setDarkMode] = useState(false);

  const settingsItems = [
    {
      icon: User,
      label: 'Profile',
      description: 'Manage your account',
      action: () => console.log('Profile'),
    },
    {
      icon: Calendar,
      label: 'Availability',
      description: 'Set your study times',
      action: () => {
        setAvailabilityModalOpen(true);
        onOpenChange(false);
      },
    },
    {
      icon: Settings,
      label: 'Preferences',
      description: 'Study settings & goals',
      action: () => {
        setPreferencesModalOpen(true);
        onOpenChange(false);
      },
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Study reminders',
      action: () => console.log('Notifications'),
    },
    {
      icon: darkMode ? Sun : Moon,
      label: darkMode ? 'Light Mode' : 'Dark Mode',
      description: 'Change appearance',
      action: () => setDarkMode(!darkMode),
    },
  ];

  const studyActions = [
    {
      icon: Target,
      label: 'Generate Schedule',
      description: 'Create AI study plan',
      action: () => {
        generateTimetable();
        onOpenChange(false);
      },
      disabled: isGenerating,
    },
    {
      icon: BookOpen,
      label: 'View Timeline',
      description: 'See study sessions',
      action: () => {
        setCurrentView('timeline');
        onOpenChange(false);
      },
    },
    {
      icon: Calendar,
      label: 'View Calendar',
      description: 'Monthly overview',
      action: () => {
        setCurrentView('calendar');
        onOpenChange(false);
      },
    },
    {
      icon: BarChart3,
      label: 'Progress Stats',
      description: 'Study analytics',
      action: () => console.log('Stats'),
    },
  ];

  const utilityActions = [
    {
      icon: Download,
      label: 'Export Schedule',
      description: 'Download as PDF',
      action: () => console.log('Export'),
    },
    {
      icon: Share,
      label: 'Share Progress',
      description: 'Share with friends',
      action: () => console.log('Share'),
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="bg-white/95 backdrop-blur-md border-t border-white/20 rounded-t-2xl p-0 max-h-[80vh]"
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-left text-slate-800">
            Quick Actions
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 pb-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Study Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Study Management
            </h3>
            <div className="space-y-2">
              {studyActions.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 text-left hover:bg-white/80 transition-all disabled:opacity-50"
                  onClick={item.action}
                  disabled={item.disabled}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-600">{item.description}</p>
                  </div>
                  {item.disabled && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <Separator className="bg-slate-200/50" />

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </h3>
            <div className="space-y-2">
              {settingsItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 text-left hover:bg-white/80 transition-all"
                  onClick={item.action}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-600">{item.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <Separator className="bg-slate-200/50" />

          {/* Utility Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Share className="h-4 w-4" />
              Export & Share
            </h3>
            <div className="space-y-2">
              {utilityActions.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 text-left hover:bg-white/80 transition-all"
                  onClick={item.action}
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-600">{item.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50"
          >
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {sessions.length}
                </p>
                <p className="text-xs text-slate-600">Total Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {sessions.filter((s) => s.completed).length}
                </p>
                <p className="text-xs text-slate-600">Completed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
