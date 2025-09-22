import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  StudyBuddyMemory,
  StudyBuddyPersonality,
} from '@/lib/ai/study-buddy-agent';

interface AgentMemoryState {
  studyBuddyMemory: StudyBuddyMemory;

  // Study Buddy actions
  updateStudyBuddyPersonality: (traits: Partial<StudyBuddyPersonality>) => void;
  addStudyBuddyMemory: (
    type: 'preference' | 'achievement' | 'struggle' | 'goal' | 'learning_style',
    content: string
  ) => void;
  incrementInteractions: () => void;
  getStudyBuddyMemory: () => StudyBuddyMemory;

  // General actions
  resetAgentMemory: () => void;
}

// Default Study Buddy personality - balanced starting point
const defaultPersonality: StudyBuddyPersonality = {
  enthusiasm: 6,
  supportiveness: 7,
  casualness: 6,
  directness: 5,
};

// Default Study Buddy memory
const defaultStudyBuddyMemory: StudyBuddyMemory = {
  interactions: 0,
  lastSeen: new Date(),
  personalityTraits: defaultPersonality,
  knownPreferences: [],
  achievements: [],
  struggles: [],
  goals: [],
  learningStyle: [],
};

export const useAgentMemoryStore = create<AgentMemoryState>()(
  persist(
    (set, get) => ({
      studyBuddyMemory: defaultStudyBuddyMemory,

      updateStudyBuddyPersonality: (
        newTraits: Partial<StudyBuddyPersonality>
      ) => {
        set((state) => ({
          studyBuddyMemory: {
            ...state.studyBuddyMemory,
            personalityTraits: {
              ...state.studyBuddyMemory.personalityTraits,
              ...newTraits,
            },
            lastSeen: new Date(),
          },
        }));
      },

      addStudyBuddyMemory: (
        type:
          | 'preference'
          | 'achievement'
          | 'struggle'
          | 'goal'
          | 'learning_style',
        content: string
      ) => {
        set((state) => {
          const memory = { ...state.studyBuddyMemory };

          // Add to appropriate array, avoiding duplicates
          const targetArray =
            type === 'preference'
              ? memory.knownPreferences
              : type === 'achievement'
                ? memory.achievements
                : type === 'struggle'
                  ? memory.struggles
                  : type === 'goal'
                    ? memory.goals
                    : memory.learningStyle;

          if (!targetArray.includes(content)) {
            targetArray.push(content);

            // Keep arrays manageable (max 10 items each)
            if (targetArray.length > 10) {
              targetArray.shift(); // Remove oldest item
            }
          }

          return {
            studyBuddyMemory: {
              ...memory,
              lastSeen: new Date(),
            },
          };
        });
      },

      incrementInteractions: () => {
        set((state) => ({
          studyBuddyMemory: {
            ...state.studyBuddyMemory,
            interactions: state.studyBuddyMemory.interactions + 1,
            lastSeen: new Date(),
          },
        }));
      },

      getStudyBuddyMemory: () => {
        return get().studyBuddyMemory;
      },

      resetAgentMemory: () => {
        set({
          studyBuddyMemory: defaultStudyBuddyMemory,
        });
      },
    }),
    {
      name: 'agent-memory-store',
      partialize: (state) => ({
        studyBuddyMemory: state.studyBuddyMemory,
      }),
    }
  )
);

// Helper functions for personality evolution
export const evolvePersonalityBasedOnResponse = (
  currentTraits: StudyBuddyPersonality,
  responseType: 'positive' | 'needs_support' | 'wants_casual' | 'wants_direct'
): Partial<StudyBuddyPersonality> => {
  const evolution: Partial<StudyBuddyPersonality> = {};

  switch (responseType) {
    case 'positive':
      // Student is doing well, maybe increase enthusiasm slightly
      evolution.enthusiasm = Math.min(10, currentTraits.enthusiasm + 0.2);
      break;

    case 'needs_support':
      // Student is struggling, increase supportiveness
      evolution.supportiveness = Math.min(
        10,
        currentTraits.supportiveness + 0.3
      );
      evolution.directness = Math.max(1, currentTraits.directness - 0.2);
      break;

    case 'wants_casual':
      // Student responds well to casual conversation
      evolution.casualness = Math.min(10, currentTraits.casualness + 0.3);
      break;

    case 'wants_direct':
      // Student prefers direct communication
      evolution.directness = Math.min(10, currentTraits.directness + 0.3);
      evolution.casualness = Math.max(1, currentTraits.casualness - 0.2);
      break;
  }

  return evolution;
};
