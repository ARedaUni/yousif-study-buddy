Tech Stack

    - Next.js 15.5 with App Router & Turbopack
    - Google AI SDK (@ai-sdk/google) for AI
    scheduling with Gemini Pro
    - shadcn/ui components with premium
    components for beautiful, mobile-first UI
    - Framer Motion for smooth animations
    - Zustand 5.0 for state management with
    persist middleware
    - date-fns 4.1 for date manipulation
    - Zod for runtime validation
    - TypeScript 5 for type safety

    Mobile-First Design System

    Core UI Components (from shadcn):

    1. message-dock - AI Assistant Interface
      - Floating expandable chat dock
      - Multiple AI characters/personas
      - Natural language commands
      - Beautiful gradient animations
      - Mobile-optimized interactions

    2. dock - Bottom Navigation
      - iOS-style magnetic dock
      - Main app navigation
      - Smooth hover animations
      - Icon-based navigation
      - Fixed at bottom for thumb reach

    3. animated-modal - Full-Screen Forms
      - 3D transform animations
      - Full-screen on mobile
      - Backdrop blur effects
      - Touch-friendly close gestures
      - Perfect for topic/preference inputs

    4. 3d-card - Interactive Session Cards
      - Tilt on hover/touch
      - Depth perception effects
      - Swipeable actions
      - Visual hierarchy through depth
      - Engaging micro-interactions

    5. sparkles - AI Generation Effects
      - Particle animations
      - Visual feedback for AI actions
      - Magic feel for generated content
      - Performance optimized
      - Customizable colors/density

    Mobile-First View System

    1. Vertical Timeline (Mobile Default)
      - Single column card layout
      - Swipe between days
      - Pull-to-refresh
      - Infinite scroll
      - Touch-optimized interactions

    2. Mini Calendar View
      - Compact month view
      - Tap to see day details
      - Color-coded session dots
      - Quick date navigation
      - Bottom sheet for session details

    3. AI Chat View
      - Full-screen chat interface
      - Voice input support (future)
      - Smart suggestions
      - Context-aware responses
      - Session management via chat

    Updated Implementation Phases

    Phase 1: Mobile-First Foundation

    1. Install Premium shadcn Components:
      - message-dock (AI assistant interface)
      - dock (bottom navigation)
      - animated-modal (full-screen forms)
      - 3d-card (interactive sessions)
      - sparkles (AI generation effects)
      - mini-calendar (compact date picker)
    2. Install Framer Motion for animations
    3. Set up mobile-first responsive system
    4. Configure touch gesture handling

    Phase 2: Enhanced Data Models

    // Core types (in lib/types.ts)
    interface RevisionSession {
      id: string
      subject: string
      topic: string
      startTime: Date
      endTime: Date
      type: 'new-learning' | 'revision' |
    'practice-test'
      difficulty: 1 | 2 | 3 | 4 | 5
      completed: boolean
      notes?: string
      color?: string
      examDate?: Date
    }

    interface WeeklyAvailability {
      monday: TimeSlot[]
      tuesday: TimeSlot[]
      wednesday: TimeSlot[]
      thursday: TimeSlot[]
      friday: TimeSlot[]
      saturday: TimeSlot[]
      sunday: TimeSlot[]
      schoolHours: { start: string, end: string }
      examDates?: { subject: string, date: Date }[]
    }

    interface StudyPreferences {
      sessionLength: 25 | 45 | 60 | 90
      breakLength: 5 | 10 | 15 | 20
      maxSessionsPerDay: number
      studyStyle: 'intensive' | 'relaxed' | 'balanced'
      preferredTimes: ('morning' | 'afternoon' | 'evening')[]
      includeWeekends: boolean
    }

    Phase 3: Mobile-First UI Components

    1. AI Assistant (message-dock)
      // Floating AI chat interface
      <MessageDock
        characters={[
          { emoji: "🧙‍♂️", name: "AI Tutor", online: true },
          { emoji: "📚", name: "Study Buddy", online: true },
          { emoji: "🎯", name: "Quiz Master", online: false }
        ]}
        onMessageSend={handleAICommand}
        position="bottom"
        showSparkleButton={true}
      />

    2. Bottom Navigation (dock)
      // Main app navigation
      <Dock className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <DockItem><DockIcon>🏠</DockIcon><DockLabel>Home</DockLabel></DockItem>
        <DockItem><DockIcon>📖</DockIcon><DockLabel>Topics</DockLabel></DockItem>
        <DockItem><DockIcon>📅</DockIcon><DockLabel>Schedule</DockLabel></DockItem>
        <DockItem><DockIcon>⚙️</DockIcon><DockLabel>Settings</DockLabel></DockItem>
      </Dock>

    3. Interactive Session Cards (3d-card)
      // Touch-friendly session display
      <CardContainer>
        <CardBody>
          <CardItem translateZ={20}>
            <SessionCard session={session} />
          </CardItem>
        </CardBody>
      </CardContainer>

    4. Full-Screen Modals (animated-modal)
      // Topic input and preferences
      <Modal>
        <ModalTrigger>Add Topic</ModalTrigger>
        <ModalBody>
          <ModalContent>
            <TopicInputForm />
          </ModalContent>
        </ModalBody>
      </Modal>

    5. AI Generation Effects (sparkles)
      // Visual feedback for AI operations
      <SparklesCore
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="w-full h-full"
        particleColor="#3B82F6"
      />

    Phase 4: Google AI Integration

    // AI prompts for schedule generation
    const generateSchedule = async (topics,
    availability, preferences) => {
      const prompt = `
        Create an optimal revision timetable:
        Topics: ${JSON.stringify(topics)}
        Available times:
    ${JSON.stringify(availability)}
        Preferences: ${preferences}

        Consider:
        - Spaced repetition for better
    retention
        - Mix subjects to avoid fatigue
        - UK Year 10 student (GCSE preparation)
        - Include breaks using Pomodoro
    technique
      `;

      return await gemini.generate(prompt);
    }

    Phase 5: Mobile-First Core Features

    1. Touch-First Interactions
      - Swipe gestures for navigation
      - Long press for context menus
      - Pull-to-refresh for data updates
      - Pinch to zoom on timeline views
      - Haptic feedback simulation
      - Touch-friendly hit targets (44px+)

    2. Mobile Navigation Patterns
      - Bottom sheet for quick actions
      - Floating action buttons (FAB)
      - Gesture-based view switching
      - Thumb-reachable primary actions
      - One-handed operation support

    3. AI-Powered Mobile Features
      - Voice commands (future)
      - Smart suggestions based on context
      - Automatic mobile-optimized layouts
      - Intelligent notification timing
      - Quick AI chat shortcuts

    4. Progressive Web App (PWA)
      - Offline functionality
      - Push notifications
      - Install prompt
      - Native app-like experience
      - Background sync for AI updates

    Phase 6: Zustand Store Architecture

    // Main revision store (store/revision-store.ts)
    const useRevisionStore = create(
      persist(
        (set, get) => ({
          // State
          sessions: [] as RevisionSession[],
          topics: [] as Topic[],
          availability: null as WeeklyAvailability | null,
          preferences: defaultPreferences,
          isGenerating: false,
          error: null as string | null,

          // Session actions
          addSession: (session: RevisionSession) =>
            set(state => ({
              sessions: [...state.sessions, session]
            })),

          updateSession: (id: string, updates: Partial<RevisionSession>) =>
            set(state => ({
              sessions: state.sessions.map(s =>
                s.id === id ? { ...s, ...updates } : s
              )
            })),

          deleteSession: (id: string) =>
            set(state => ({
              sessions: state.sessions.filter(s => s.id !== id)
            })),

          // Availability actions
          updateAvailability: (availability: WeeklyAvailability) =>
            set({ availability }),

          // AI generation
          generateTimetable: async () => {
            set({ isGenerating: true, error: null });
            try {
              const response = await generateSchedule(
                get().topics,
                get().availability,
                get().preferences
              );
              set({ sessions: response.sessions, isGenerating: false });
            } catch (error) {
              set({ error: error.message, isGenerating: false });
            }
          }
        }),
        { name: 'revision-store' }
      )
    );

    // Mobile-optimized UI store
    const useUIStore = create((set) => ({
      currentView: 'timeline' as 'timeline' | 'calendar' | 'chat',
      selectedSession: null as string | null,
      bottomSheetOpen: false,
      aiChatOpen: false,
      isAIGenerating: false,

      // Mobile-first actions
      setCurrentView: (view) => set({ currentView: view }),
      setSelectedSession: (id) => set({ selectedSession: id }),
      toggleBottomSheet: () => set(state => ({
        bottomSheetOpen: !state.bottomSheetOpen
      })),
      toggleAIChat: () => set(state => ({
        aiChatOpen: !state.aiChatOpen
      })),
      setAIGenerating: (generating) => set({ isAIGenerating: generating })
    }));

    Enhanced Mobile-First File Structure

    /app
      /dashboard
        /page.tsx (mobile-first dashboard)
      /api
        /ai
          /generate-schedule/route.ts
          /analyze-topics/route.ts
          /chat/route.ts (AI chat endpoint)
      /globals.css (mobile-first Tailwind)

    /components
      /ui (shadcn base components)
        /button.tsx, /card.tsx, etc.
      /ui/shadcn-io (premium components)
        /message-dock/ (AI assistant)
        /dock/ (bottom navigation)
        /animated-modal/ (full-screen modals)
        /3d-card/ (interactive cards)
        /sparkles/ (AI effects)
        /mini-calendar/ (compact calendar)
      /mobile
        /bottom-navigation.tsx (main dock)
        /ai-assistant.tsx (message dock wrapper)
        /timeline-view.tsx (vertical mobile timeline)
        /session-card-3d.tsx (interactive session display)
        /pull-to-refresh.tsx (mobile refresh)
        /bottom-sheet.tsx (mobile actions sheet)
      /forms
        /topic-input-modal.tsx (full-screen topic form)
        /availability-mobile.tsx (touch-friendly time picker)
        /preferences-modal.tsx (full-screen preferences)
      /session
        /session-card-mobile.tsx (touch-optimized)
        /session-details-sheet.tsx (bottom sheet details)

    /lib
      /ai
        /gemini-client.ts (Google AI SDK config)
        /prompts.ts (structured prompts)
      /utils
        /dates.ts (date-fns helpers)
        /colors.ts (subject color mapping)
        /schedule.ts (validation & optimization)
      /hooks
        /use-debounce.ts
        /use-local-storage.ts
      /types.ts (enhanced TypeScript definitions)
      /constants.ts (subjects, colors, defaults)

    /store
      /revision-store.ts (main data store)
      /ui-store.ts (view state)

    /styles
      /globals.css

    Engineering Best Practices

    1. Type Safety
      - Full TypeScript coverage with strict mode
      - Zod schemas for runtime validation
      - Proper generic types for reusable components
      - Type-safe Zustand store with immer

    2. Performance Optimization
      - React.memo for expensive components
      - useMemo for complex calculations
      - Lazy loading for calendar views
      - Debounced search and input handlers

    3. State Management
      - Zustand with persist middleware
      - Separate stores for data vs UI state
      - Optimistic updates with rollback
      - Local state for form handling

    4. Error Handling
      - Error boundaries for component failures
      - Proper error states in UI
      - Validation feedback for forms
      - API error handling with retries

    5. Accessibility
      - Proper ARIA labels
      - Keyboard navigation support
      - Focus management in modals
      - Screen reader friendly

    6. Testing Strategy
      - Unit tests for utilities
      - Component testing with React Testing Library
      - E2E tests for critical user flows
      - Storybook for component documentation

    Mobile-First Design Philosophy

    1. Glass Morphism Visual Design
      - Frosted glass effect with backdrop-blur
      - Subtle gradients and depth
      - Primary: Blue-500/600 for AI features
      - Vibrant accent colors for interactions
      - Clean typography with perfect mobile sizing

    2. Touch-First Interaction Design
      - 44px+ touch targets for accessibility
      - Swipe gestures for primary navigation
      - Long press for contextual actions
      - Pull-to-refresh for data updates
      - Haptic feedback for important actions

    3. AI-Centered Mobile Experience
      - Always-accessible AI assistant dock
      - Natural language commands via chat
      - Visual AI feedback with sparkles/particles
      - Smart suggestions contextual to current view
      - Voice input support (future enhancement)

    4. Performance-Optimized Mobile Features
      - Lazy loading for smooth scrolling
      - Optimistic UI updates
      - Smooth 60fps animations
      - Efficient bundle splitting
      - Progressive enhancement approach

    5. Mobile-Native Patterns
      - Bottom sheet modals for quick actions
      - Floating action buttons for primary tasks
      - Thumb-reachable navigation areas
      - One-handed operation support
      - Progressive disclosure of complexity

    This mobile-first architecture creates an
    intuitive, beautiful, and powerful AI revision
    assistant that feels native on mobile while
    providing excellent desktop fallbacks.
