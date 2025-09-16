──────────────────────────────────────────────────╮
│ Ready to code? │
│ │
│ Here is Claude's plan: │
│ ╭──────────────────────────────────────────────╮ │
│ │ Mobile-First AI Revision Assistant │ │
│ │ Implementation Plan │ │
│ │ │ │
│ │ Based on the CLAUDE.md specifications, I'll │ │
│ │ transform the current application into a │ │
│ │ mobile-first, AI-powered revision assistant. │ │
│ │ Here's the implementation plan: │ │
│ │ │ │
│ │ Phase 1: Enhanced Type System & Constants │ │
│ │ │ │
│ │ 1. Update lib/types.ts - Create │ │
│ │ comprehensive type definitions matching │ │
│ │ CLAUDE.md │ │
│ │ - RevisionSession interface with all │ │
│ │ required fields │ │
│ │ - StudyPreferences with session/break │ │
│ │ lengths │ │
│ │ - Enhanced Topic types with exam dates │ │
│ │ - Mobile-first UI types │ │
│ │ 2. Create lib/constants.ts - Centralize all │ │
│ │ app constants │ │
│ │ - Subject colors and mappings │ │
│ │ - Session type configurations │ │
│ │ - Time period definitions │ │
│ │ - Default preferences │ │
│ │ │ │
│ │ Phase 2: Mobile-First Dashboard │ │
│ │ Transformation │ │
│ │ │ │
│ │ 3. Redesign app/dashboard/page.tsx as │ │
│ │ mobile-first with: │ │
│ │ - Bottom navigation dock (iOS-style) │ │
│ │ - Vertical timeline view as default │ │
│ │ (single column cards) │ │
│ │ - AI assistant (message-dock) floating at │ │
│ │ bottom │ │
│ │ - Touch-optimized session cards with 3D │ │
│ │ effects │ │
│ │ - Swipe gestures and pull-to-refresh │ │
│ │ │ │
│ │ Phase 3: Core Mobile Components │ │
│ │ │ │
│ │ 4. Create │ │
│ │ components/mobile/timeline-view.tsx │ │
│ │ - Vertical scrolling session cards │ │
│ │ - Day separators with dates │ │
│ │ - Swipe between days functionality │ │
│ │ - Pull-to-refresh implementation │ │
│ │ 5. Create │ │
│ │ components/mobile/session-card-3d.tsx │ │
│ │ - Interactive 3D card with tilt effects │ │
│ │ - Touch-friendly 44px+ hit targets │ │
│ │ - Subject color coding │ │
│ │ - Quick actions on tap/hold │ │
│ │ 6. Create components/mobile/bottom-sheet.tsx │ │
│ │ - Session details view │ │
│ │ - Quick actions menu │ │
│ │ - Smooth animations │ │
│ │ │ │
│ │ Phase 4: AI Integration Components │ │
│ │ │ │
│ │ 7. Create components/mobile/ai-assistant.tsx │ │
│ │ - Wrapper for message-dock with AI │ │
│ │ characters │ │
│ │ - Natural language command processing │ │
│ │ - Context-aware suggestions │ │
│ │ 8. Create │ │
│ │ components/forms/topic-input-modal.tsx │ │
│ │ - Full-screen animated modal │ │
│ │ - Touch-friendly input fields │ │
│ │ - Subject/topic selection │ │
│ │ - Difficulty/priority settings │ │
│ │ 9. Create │ │
│ │ components/forms/availability-mobile.tsx │ │
│ │ - Weekly time slot picker │ │
│ │ - School hours configuration │ │
│ │ - Exam date inputs │ │
│ │ - Touch-optimized time selection │ │
│ │ │ │
│ │ Phase 5: Google AI Integration │ │
│ │ │ │
│ │ 10. Create lib/ai/gemini-client.ts │ │
│ │ - Configure Google AI SDK │ │
│ │ - Error handling and retries │ │
│ │ 11. Create lib/ai/prompts.ts │ │
│ │ - Structured prompts for schedule │ │
│ │ generation │ │
│ │ - Spaced repetition logic │ │
│ │ - Subject mixing strategies │ │
│ │ 12. Create │ │
│ │ app/api/ai/generate-schedule/route.ts │ │
│ │ - API endpoint for AI schedule generation │ │
│ │ - Validation with Zod schemas │ │
│ │ - Response formatting │ │
│ │ │ │
│ │ Phase 6: State Management Updates │ │
│ │ │ │
│ │ 13. Update store/revision-store.ts │ │
│ │ - Add missing actions from CLAUDE.md │ │
│ │ - Implement optimistic updates │ │
│ │ - Add rollback capabilities │ │
│ │ 14. Enhance store/ui-store.ts │ │
│ │ - Add mobile gesture states │ │
│ │ - Animation control flags │ │
│ │ - View transition management │ │
│ │ │ │
│ │ Phase 7: Mobile-First Styling │ │
│ │ │ │
│ │ 15. Update app/globals.css │ │
│ │ - Glass morphism effects │ │
│ │ - Mobile-first breakpoints │ │
│ │ - Touch-friendly spacing │ │
│ │ - Smooth animations │ │
│ │ │ │
│ │ Key Features to Implement: │ │
│ │ │ │
│ │ - Mobile Navigation: Bottom dock with │ │
│ │ magnetic hover effects │ │
│ │ - AI Assistant: Floating chat with multiple │ │
│ │ personas (AI Tutor, Study Buddy, Quiz │ │
│ │ Master) │ │
│ │ - 3D Session Cards: Interactive cards with │ │
│ │ depth perception │ │
│ │ - Full-Screen Modals: Beautiful animated │ │
│ │ modals for forms │ │
│ │ - Timeline View: Default mobile view with │ │
│ │ vertical scrolling │ │
│ │ - Touch Gestures: Swipe, pull-to-refresh, │ │
│ │ long press │ │
│ │ - Glass Morphism UI: Frosted glass effects │ │
│ │ with subtle gradients │ │
│ │ - Smart AI Features: Context-aware │ │
│ │ suggestions and natural language commands │ │
│ │ │ │
│ │ Benefits of This Approach: │ │
│ │ │ │
│ │ - Single responsive codebase (no separate │ │
│ │ mobile components) │ │
│ │ - Progressive enhancement from mobile to │ │
│ │ desktop │ │
│ │ - Optimized performance with lazy loading │ │
│ │ - Beautiful animations with Framer Motion │ │
│ │ - Touch-first interactions │ │
│ │ - AI-powered intelligent scheduling │ │
│ │ │ │
│ │ Ready to begin implementation following this │ │
│ │ mobile-first architecture?
