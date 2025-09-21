import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Topic, Session } from '@/lib/schema';

interface RevisionState {
  topics: Topic[];
  sessions: Session[];
  isGenerating: boolean;
  error: string | null;

  addTopic: (topic: Topic) => void;
  removeTopic: (id: string) => void;
  clearTopics: () => void;

  setSessions: (sessions: Session[]) => void;
  clearSessions: () => void;

  generateTimetable: () => Promise<void>;
  setGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
}

const SUBJECT_COLORS = {
  Mathematics: '#3B82F6',
  'English Literature': '#EF4444',
  'English Language': '#DC2626',
  'Science (Biology)': '#10B981',
  'Science (Chemistry)': '#059669',
  'Science (Physics)': '#0D9488',
  History: '#F59E0B',
  Geography: '#84CC16',
  French: '#8B5CF6',
  Spanish: '#A855F7',
  'Art & Design': '#EC4899',
  Music: '#F97316',
  PE: '#06B6D4',
  'Computer Science': '#6366F1',
  'Religious Studies': '#64748B',
};

export const useRevisionStore = create<RevisionState>()(
  persist(
    (set, get) => ({
      topics: [],
      sessions: [],
      isGenerating: false,
      error: null,

      addTopic: (topic: Topic) => {
        set((state) => ({
          topics: [...state.topics, topic],
        }));
      },

      removeTopic: (id: string) => {
        set((state) => ({
          topics: state.topics.filter((topic) => topic.id !== id),
        }));
      },

      clearTopics: () => {
        set({ topics: [] });
      },

      setSessions: (sessions: Session[]) => {
        set({ sessions });
      },

      clearSessions: () => {
        set({ sessions: [] });
      },

      generateTimetable: async () => {
        const { topics } = get();

        if (topics.length === 0) {
          set({ error: 'Please add some topics first' });
          return;
        }

        set({ isGenerating: true, error: null });

        try {
          const response = await fetch('/api/ai/generate-timetable', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topics }),
          });

          if (!response.ok) {
            throw new Error(
              `Failed to generate timetable: ${response.statusText}`
            );
          }

          const data = await response.json();

          // Convert the response to our Session format
          const sessions: Session[] = data.sessions.map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: new Date(session.endTime),
            color:
              SUBJECT_COLORS[session.subject as keyof typeof SUBJECT_COLORS] ||
              '#6B7280',
          }));

          set({
            sessions,
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

      setGenerating: (generating: boolean) => {
        set({ isGenerating: generating });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'revision-store',
      partialize: (state) => ({
        topics: state.topics,
        sessions: state.sessions,
      }),
    }
  )
);
