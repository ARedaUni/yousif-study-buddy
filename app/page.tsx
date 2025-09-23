'use client';

import { useUIStore } from '@/store/ui-store';
import { useRevisionStore } from '@/store/revision-store';
import { useAgentMemoryStore } from '@/store/agent-memory-store';
import { MessageDock } from '@/components/ui/shadcn-io/message-dock';
import { TimetableDisplay } from '@/components/timetable/timetable-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

const COMMON_SUBJECTS = [
  'Mathematics',
  'English Literature',
  'English Language',
  'Science (Biology)',
  'Science (Chemistry)',
  'Science (Physics)',
  'History',
  'Geography',
  'French',
  'Spanish',
  'Art & Design',
  'Music',
  'PE',
  'Computer Science',
  'Religious Studies',
];

export default function DashboardPage() {
  const {
    topics,
    sessions,
    addTopic,
    removeTopic,
    generateTimetable,
    adjustTimetable,
    isGenerating,
    isAdjusting,
    error,
  } = useRevisionStore();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topicName, setTopicName] = useState('');
  const [adjustmentPrompt, setAdjustmentPrompt] = useState('');

  const aiCharacters = [
    { emoji: '🧙‍♂️', name: 'AI Tutor', online: true },
    { emoji: '📚', name: 'Study Buddy', online: true },
    { emoji: '🎯', name: 'Quiz Master', online: false },
  ];

  const handleAddTopic = () => {
    if (!selectedSubject || !topicName.trim()) return;

    const newTopic = {
      id: crypto.randomUUID(),
      subject: selectedSubject,
      name: topicName.trim(),
      addedAt: new Date(),
    };
    addTopic(newTopic);
    setTopicName('');
    setSelectedSubject('');
  };

  const handleAdjustTimetable = async (message: string) => {
    if (!message.trim()) return;

    await adjustTimetable(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Revision Timetable Maker
          </h1>
          <p className="text-lg text-gray-600">
            Add your topics and let AI create the perfect study schedule for you
          </p>
        </div>

        {/* Topic Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Study Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="Enter topic name (e.g., Quadratic Equations)"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
              />

              <Button
                onClick={handleAddTopic}
                disabled={!selectedSubject || !topicName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </div>

            {/* Added Topics */}
            {topics.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Your Topics:</h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <Badge
                      key={topic.id}
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1"
                    >
                      <span className="font-medium">{topic.subject}:</span>
                      <span>{topic.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTopic(topic.id)}
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            {topics.length > 0 && (
              <div className="pt-4 border-t">
                <Button
                  onClick={generateTimetable}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-2"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Generating Your Timetable...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate AI Timetable
                    </div>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Timetable Display */}
        <TimetableDisplay />

        {/* AI Message Dock / Loading State */}
        <div className="fixed bottom-6 right-6 z-50">
          {isAdjusting ? (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl shadow-lg border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">
                  🧙‍♂️ Adjusting your timetable...
                </span>
              </div>
            </div>
          ) : (
            <MessageDock
              characters={aiCharacters}
              onMessageSend={handleAdjustTimetable}
              position="bottom"
              showSparkleButton={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
