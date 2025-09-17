'use client';

import { useUIStore } from '@/store/ui-store';
import { useRevisionStore } from '@/store/revision-store';
import { MessageDock } from '@/components/ui/shadcn-io/message-dock';
import { useState } from 'react';

export default function DashboardPage() {
  const { sessions, generateTimetable, isGenerating, topics } =
    useRevisionStore();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

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
    if (
      message.toLowerCase().includes('generate') ||
      message.toLowerCase().includes('schedule')
    ) {
      generateTimetable();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <MessageDock
        characters={aiCharacters}
        onMessageSend={handleAIMessage}
        position="bottom"
        showSparkleButton={true}
      />
    </div>
  );
}
