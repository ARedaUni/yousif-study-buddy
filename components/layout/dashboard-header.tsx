'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRevisionStore } from '@/store/revision-store';
import { useUIStore } from '@/store/ui-store';
import { 
  Menu, 
  Settings, 
  Plus, 
  Bell, 
  User, 
  Calendar,
  Target,
  TrendingUp,
  Command 
} from 'lucide-react';

interface DashboardHeaderProps {
  onAddTopic?: () => void;
}

export function DashboardHeader({ onAddTopic }: DashboardHeaderProps) {
  const { sessions, topics } = useRevisionStore();
  const { toggleSidebar } = useUIStore();

  const completedSessions = sessions.filter(s => s.completed).length;
  const todaysSessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  }).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Toggle sidebar
            </TooltipContent>
          </Tooltip>

          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900">
              Revision Dashboard
            </h1>
            <p className="text-sm text-gray-500 hidden sm:block">
              {getGreeting()}! Ready to ace your studies?
            </p>
          </div>
        </div>

        {/* Middle Section - Quick Stats */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{completedSessions}</span> completed
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">{todaysSessions}</span> today
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-purple-600">{topics.length}</span> subjects
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Command Palette Trigger */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Command className="h-4 w-4 mr-2" />
                <span className="text-xs">⌘K</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Open command palette
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {todaysSessions > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {todaysSessions}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {todaysSessions > 0 
                ? `${todaysSessions} sessions scheduled today`
                : 'No notifications'
              }
            </TooltipContent>
          </Tooltip>

          {/* Add Topic Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" onClick={onAddTopic}>
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Add a new study topic
            </TooltipContent>
          </Tooltip>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Student</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    GCSE Year 10
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Progress</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <span>Reset Data</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}