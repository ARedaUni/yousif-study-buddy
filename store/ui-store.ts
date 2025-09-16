import { create } from 'zustand';

export type ViewType = 'week' | 'month' | 'timeline';

interface UIState {
  // View state
  currentView: ViewType;
  selectedSession: string | null;
  sidebarOpen: boolean;
  
  // Modal states
  sessionDialogOpen: boolean;
  topicDialogOpen: boolean;
  availabilityDialogOpen: boolean;
  preferencesDialogOpen: boolean;
  
  // UI actions
  setCurrentView: (view: ViewType) => void;
  setSelectedSession: (id: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Modal actions
  setSessionDialogOpen: (open: boolean) => void;
  setTopicDialogOpen: (open: boolean) => void;
  setAvailabilityDialogOpen: (open: boolean) => void;
  setPreferencesDialogOpen: (open: boolean) => void;
  
  // Utility
  closeAllDialogs: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  currentView: 'week',
  selectedSession: null,
  sidebarOpen: true,
  sessionDialogOpen: false,
  topicDialogOpen: false,
  availabilityDialogOpen: false,
  preferencesDialogOpen: false,
  
  // UI actions
  setCurrentView: (view: ViewType) => set({ currentView: view }),
  setSelectedSession: (id: string | null) => set({ selectedSession: id }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  
  // Modal actions
  setSessionDialogOpen: (open: boolean) => set({ sessionDialogOpen: open }),
  setTopicDialogOpen: (open: boolean) => set({ topicDialogOpen: open }),
  setAvailabilityDialogOpen: (open: boolean) => set({ availabilityDialogOpen: open }),
  setPreferencesDialogOpen: (open: boolean) => set({ preferencesDialogOpen: open }),
  
  // Utility
  closeAllDialogs: () => set({
    sessionDialogOpen: false,
    topicDialogOpen: false,
    availabilityDialogOpen: false,
    preferencesDialogOpen: false,
  }),
}));