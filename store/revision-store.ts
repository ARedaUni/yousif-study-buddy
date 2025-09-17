import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Session,
  Topic,
  WeeklyAvailability,
  Preferences,
  preferencesSchema,
} from '@/lib/schema';

interface RevisionState {
  // State
  sessions: Session[];
  topics: Topic[];
  availability: WeeklyAvailability | null;
  preferences: Preferences;
  isGenerating: boolean;
  error: string | null;

  // Session actions
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  toggleSessionComplete: (id: string) => void;

  // Topic actions
  addTopic: (topic: Topic) => void;
  updateTopic: (index: number, updates: Partial<Topic>) => void;
  deleteTopic: (index: number) => void;

  // Availability actions
  updateAvailability: (availability: WeeklyAvailability) => void;

  // Preferences actions
  updatePreferences: (preferences: Partial<Preferences>) => void;

  // AI generation
  generateTimetable: () => Promise<void>;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

const defaultPreferences: Preferences = preferencesSchema.parse({});

export const useRevisionStore = create<RevisionState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [
        {
          id: '1',
          subject: 'Mathematics',
          topic: 'Quadratic Equations',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          type: 'new-learning' as const,
          difficulty: 3,
          completed: false,
          notes: 'Focus on completing the square method',
        },
        {
          id: '2',
          subject: 'English Literature',
          topic: 'Romeo and Juliet Analysis',
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          type: 'revision' as const,
          difficulty: 2,
          completed: true,
          notes: 'Character development and themes',
        },
        {
          id: '3',
          subject: 'Science (Physics)',
          topic: 'Forces and Motion',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
          type: 'practice-test' as const,
          difficulty: 4,
          completed: false,
          notes: 'Practice calculations and diagrams',
        },
      ],
      topics: [
        {
          subject: 'Mathematics',
          topics: ['Quadratic Equations', 'Trigonometry', 'Statistics'],
          difficulty: 3,
          priority: 'high' as const,
        },
        {
          subject: 'English Literature',
          topics: ['Romeo and Juliet', 'Macbeth', 'Poetry Analysis'],
          difficulty: 2,
          priority: 'medium' as const,
        },
        {
          subject: 'Science (Physics)',
          topics: ['Forces and Motion', 'Energy', 'Waves'],
          difficulty: 4,
          priority: 'high' as const,
        },
        {
          subject: 'History',
          topics: ['World War I', 'Industrial Revolution', 'Cold War'],
          difficulty: 2,
          priority: 'low' as const,
        },
      ],
      availability: null,
      preferences: defaultPreferences,
      isGenerating: false,
      error: null,

      // Session actions
      addSession: (session: Session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),

      updateSession: (id: string, updates: Partial<Session>) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteSession: (id: string) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),

      toggleSessionComplete: (id: string) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, completed: !s.completed } : s
          ),
        })),

      // Topic actions
      addTopic: (topic: Topic) =>
        set((state) => ({
          topics: [...state.topics, topic],
        })),

      updateTopic: (index: number, updates: Partial<Topic>) =>
        set((state) => ({
          topics: state.topics.map((t, i) =>
            i === index ? { ...t, ...updates } : t
          ),
        })),

      deleteTopic: (index: number) =>
        set((state) => ({
          topics: state.topics.filter((_, i) => i !== index),
        })),

      // Availability actions
      updateAvailability: (availability: WeeklyAvailability) =>
        set({ availability }),

      // Preferences actions
      updatePreferences: (preferences: Partial<Preferences>) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),

      // AI generation
      generateTimetable: async () => {
        set({ isGenerating: true, error: null });
        try {
          const { topics, availability, preferences } = get();

          if (!availability) {
            throw new Error(
              'Availability must be set before generating timetable'
            );
          }

          if (topics.length === 0) {
            throw new Error(
              'At least one topic must be added before generating timetable'
            );
          }

          const response = await fetch('/api/ai/generate-schedule', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              topics,
              availability,
              preferences,
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Failed to generate timetable: ${response.statusText}`
            );
          }

          const data = await response.json();

          set({
            sessions: data.sessions,
            isGenerating: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'An unknown error occurred',
            isGenerating: false,
          });
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),

      reset: () =>
        set({
          sessions: [],
          topics: [],
          availability: null,
          preferences: defaultPreferences,
          isGenerating: false,
          error: null,
        }),
    }),
    {
      name: 'revision-store',
      partialize: (state) => ({
        sessions: state.sessions,
        topics: state.topics,
        availability: state.availability,
        preferences: state.preferences,
      }),
    }
  )
);
