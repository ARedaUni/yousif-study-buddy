'use client';

import { useRevisionStore } from '@/store/revision-store';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from '@/components/ui/shadcn-io/animated-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SparklesCore } from '@/components/ui/shadcn-io/sparkles';
import { motion, AnimatePresence } from 'framer-motion';
import { COMMON_SUBJECTS, Topic } from '@/lib/schema';
import { Plus, X, BookOpen, Target, Brain } from 'lucide-react';
import { useState } from 'react';

export function TopicInputModal() {
  const { topics, addTopic, generateTimetable, isGenerating } =
    useRevisionStore();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [newTopic, setNewTopic] = useState('');
  const [difficulty, setDifficulty] = useState<number>(3);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [topicList, setTopicList] = useState<string[]>([]);

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;

    setTopicList((prev) => [...prev, newTopic.trim()]);
    setNewTopic('');
  };

  const handleRemoveTopic = (index: number) => {
    setTopicList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveTopics = () => {
    if (!selectedSubject || topicList.length === 0) return;

    const newTopicEntry: Topic = {
      subject: selectedSubject,
      topics: topicList,
      difficulty,
      priority,
    };

    addTopic(newTopicEntry);

    // Reset form
    setSelectedSubject('');
    setTopicList([]);
    setNewTopic('');
    setDifficulty(3);
    setPriority('medium');
  };

  const handleGenerateSchedule = async () => {
    await generateTimetable();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < level ? 'bg-yellow-400' : 'bg-gray-200'
        }`}
      />
    ));
  };

  return (
    <Modal>
      <ModalTrigger className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
        <Plus className="h-5 w-5" />
        Add Topics
      </ModalTrigger>
      <ModalBody>
        <ModalContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header with sparkles */}
          <div className="relative p-6 border-b border-slate-200">
            <div className="absolute inset-0">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={50}
                className="w-full h-full"
                particleColor="#3B82F6"
              />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Add Study Topics
                </h2>
              </div>
              <p className="text-slate-600">
                Add topics you want to study and I'll create an optimized
                schedule for you.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Subject Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-slate-700">
                Subject
              </label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="bg-white/60 backdrop-blur-sm border-white/20">
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Topic Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-slate-700">
                Topics
              </label>
              <div className="flex gap-2">
                <Input
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                  placeholder="Enter a topic (e.g., Quadratic Equations)"
                  className="flex-1 bg-white/60 backdrop-blur-sm border-white/20"
                />
                <Button
                  onClick={handleAddTopic}
                  disabled={!newTopic.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Topic List */}
            <AnimatePresence>
              {topicList.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-slate-700">
                    Added Topics
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {topicList.map((topic, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 pr-1">
                          {topic}
                          <button
                            onClick={() => handleRemoveTopic(index)}
                            className="ml-2 hover:bg-blue-300 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Difficulty and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-slate-700">
                  Difficulty
                </label>
                <Select
                  value={difficulty.toString()}
                  onValueChange={(value) => setDifficulty(Number(value))}
                >
                  <SelectTrigger className="bg-white/60 backdrop-blur-sm border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        <div className="flex items-center gap-2">
                          <span>Level {level}</span>
                          <div className="flex gap-0.5">
                            {getDifficultyStars(level)}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-slate-700">
                  Priority
                </label>
                <Select
                  value={priority}
                  onValueChange={(value) =>
                    setPriority(value as 'high' | 'medium' | 'low')
                  }
                >
                  <SelectTrigger className="bg-white/60 backdrop-blur-sm border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            {/* Existing Topics */}
            {topics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <label className="text-sm font-medium text-slate-700">
                  Your Study Subjects
                </label>
                <div className="space-y-2">
                  {topics.map((topic, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-800">
                          {topic.subject}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(topic.priority)}>
                            {topic.priority}
                          </Badge>
                          {topic.difficulty && (
                            <div className="flex gap-0.5">
                              {getDifficultyStars(topic.difficulty)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {topic.topics.map((t, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <ModalFooter className="flex gap-3 p-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => {
                // Reset form when canceling
                setSelectedSubject('');
                setTopicList([]);
                setNewTopic('');
                setDifficulty(3);
                setPriority('medium');
              }}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSaveTopics}
              disabled={!selectedSubject || topicList.length === 0}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              Add Topics
            </Button>

            {topics.length > 0 && (
              <Button
                onClick={handleGenerateSchedule}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Generate Schedule
                  </div>
                )}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
