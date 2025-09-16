import { create } from 'zustand';

export type ViewType = 'timeline' | 'calendar' | 'chat';

interface UIState {
  // Mobile-first view state
  currentView: ViewType;
  selectedSession: string | null;

  // Mobile UI states
  bottomSheetOpen: boolean;
  aiChatOpen: boolean;
  isAIGenerating: boolean;

  // Modal states (now mobile-first animated modals)
  sessionModalOpen: boolean;
  topicModalOpen: boolean;
  availabilityModalOpen: boolean;
  preferencesModalOpen: boolean;

  // Mobile-first actions
  setCurrentView: (view: ViewType) => void;
  setSelectedSession: (id: string | null) => void;
  toggleBottomSheet: () => void;
  setBottomSheetOpen: (open: boolean) => void;
  toggleAIChat: () => void;
  setAIChatOpen: (open: boolean) => void;
  setAIGenerating: (generating: boolean) => void;

  // Mobile modal actions
  setSessionModalOpen: (open: boolean) => void;
  setTopicModalOpen: (open: boolean) => void;
  setAvailabilityModalOpen: (open: boolean) => void;
  setPreferencesModalOpen: (open: boolean) => void;

  // Utility
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state - timeline as mobile default
  currentView: 'timeline',
  selectedSession: null,
  bottomSheetOpen: false,
  aiChatOpen: false,
  isAIGenerating: false,
  sessionModalOpen: false,
  topicModalOpen: false,
  availabilityModalOpen: false,
  preferencesModalOpen: false,

  // Mobile-first actions
  setCurrentView: (view: ViewType) => set({ currentView: view }),
  setSelectedSession: (id: string | null) => set({ selectedSession: id }),
  toggleBottomSheet: () =>
    set((state) => ({ bottomSheetOpen: !state.bottomSheetOpen })),
  setBottomSheetOpen: (open: boolean) => set({ bottomSheetOpen: open }),
  toggleAIChat: () => set((state) => ({ aiChatOpen: !state.aiChatOpen })),
  setAIChatOpen: (open: boolean) => set({ aiChatOpen: open }),
  setAIGenerating: (generating: boolean) => set({ isAIGenerating: generating }),

  // Mobile modal actions
  setSessionModalOpen: (open: boolean) => set({ sessionModalOpen: open }),
  setTopicModalOpen: (open: boolean) => set({ topicModalOpen: open }),
  setAvailabilityModalOpen: (open: boolean) =>
    set({ availabilityModalOpen: open }),
  setPreferencesModalOpen: (open: boolean) =>
    set({ preferencesModalOpen: open }),

  // Utility
  closeAllModals: () =>
    set({
      sessionModalOpen: false,
      topicModalOpen: false,
      availabilityModalOpen: false,
      preferencesModalOpen: false,
      bottomSheetOpen: false,
    }),
}));
