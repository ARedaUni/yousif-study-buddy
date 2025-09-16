'use client';

import { useRevisionStore } from '@/store/revision-store';
import { useUIStore } from '@/store/ui-store';
import { SparklesCore } from '@/components/ui/shadcn-io/sparkles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Brain,
  Target,
  BookOpen,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  character?: string;
}

const aiSuggestions = [
  'Create a study schedule for next week',
  'How should I prepare for my Math exam?',
  'Generate practice questions for Biology',
  "What's the best way to revise History?",
  'Help me prioritize my subjects',
  'Create a revision timetable',
];

export function AIChatView() {
  const { generateTimetable, isGenerating, sessions, topics } =
    useRevisionStore();
  const { setCurrentView } = useUIStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        "Hello! I'm your AI study assistant. I can help you create schedules, generate practice questions, and optimize your revision. What would you like to work on today?",
      timestamp: new Date(),
      character: 'AI Tutor',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        character: 'AI Tutor',
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('schedule') || input.includes('timetable')) {
      return "I'd be happy to help you create a study schedule! Based on your current topics and availability, I can generate an optimized timetable. Would you like me to create one now?";
    }

    if (input.includes('exam') || input.includes('test')) {
      return "Exam preparation is crucial! I recommend using spaced repetition and practice tests. Which subject's exam are you preparing for? I can create a focused revision plan.";
    }

    if (input.includes('math') || input.includes('mathematics')) {
      return 'Mathematics requires consistent practice! I suggest breaking topics into smaller chunks and practicing daily. Would you like me to generate some practice problems?';
    }

    return "That's a great question! I can help you with study planning, schedule creation, and revision strategies. Feel free to ask me about any specific subjects or topics you'd like to work on.";
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-md rounded-t-xl p-4 border border-white/20 border-b-0 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -inset-1">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={0.8}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#3B82F6"
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">AI Study Assistant</h3>
            <p className="text-sm text-slate-600">Online • Ready to help</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 bg-white/40 backdrop-blur-sm border-x border-white/20 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[75%] ${message.type === 'user' ? 'order-last' : ''}`}
              >
                <div
                  className={`p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-white/60 backdrop-blur-sm border border-white/20 text-slate-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1 px-3">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  AI is thinking...
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-sm border-x border-white/20 p-4"
        >
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Quick suggestions:
          </h4>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.slice(0, 4).map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-xs bg-white/60 backdrop-blur-sm border border-white/20 text-slate-700 px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-md rounded-b-xl p-4 border border-white/20 border-t-0 shadow-lg"
      >
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about studying..."
              className="w-full bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              disabled={isGenerating}
            />
          </div>
          <motion.button
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isGenerating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
