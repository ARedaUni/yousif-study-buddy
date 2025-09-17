GCSE Revision Timetable AI - Implementation │ │
│ │ Plan │ │
│ │ │ │
│ │ Core Concept: Student-Centered AI Scheduling │ │
│ │ │ │
│ │ The AI assistant will build a student │ │
│ │ profile over time and create personalized │ │
│ │ revision timetables that respect school │ │
│ │ hours and optimize for GCSE success. │ │
│ │ │ │
│ │ Phase 1: Student Profile System │ │
│ │ │ │
│ │ 1. Create Student Profile Store │ │
│ │ (store/student-profile-store.ts) │ │
│ │ - Year level (Year 10) │ │
│ │ - School schedule (8:30 AM - 3:30 PM │ │
│ │ weekdays) │ │
│ │ - Available study windows (after school, │ │
│ │ evenings, weekends) │ │
│ │ - Learning style preferences │ │
│ │ - Energy patterns (morning person vs │ │
│ │ evening person) │ │
│ │ - Exam dates for each subject │ │
│ │ 2. Topic Knowledge Graph │ │
│ │ (lib/ai/topic-knowledge.ts) │ │
│ │ - Each topic has dependencies and │ │
│ │ difficulty levels │ │
│ │ - Track which topics need more time based │ │
│ │ on student's self-assessment │ │
│ │ - Implement modular understanding (e.g., │ │
│ │ "Quadratic equations" requires "Basic │ │
│ │ algebra") │ │
│ │ - GCSE specification mapping for each │ │
│ │ subject │ │
│ │ │ │
│ │ Phase 2: AI Backend Setup │ │
│ │ │ │
│ │ 1. Gemini AI Configuration │ │
│ │ (lib/ai/gemini-client.ts) │ │
│ │ - Initialize Google Generative AI with │ │
│ │ Gemini Pro │ │
│ │ - Configure for educational content │ │
│ │ generation │ │
│ │ - Set up context about GCSE requirements │ │
│ │ 2. AI API Routes │ │
│ │ - /api/ai/chat/route.ts - Natural language │ │
│ │ topic input │ │
│ │ - /api/ai/generate-schedule/route.ts - │ │
│ │ Intelligent timetable generation │ │
│ │ - /api/ai/analyze-progress/route.ts - │ │
│ │ Track revision effectiveness │ │
│ │ │ │
│ │ Phase 3: Smart Scheduling Algorithm │ │
│ │ │ │
│ │ 1. Availability Constraints │ │
│ │ - Weekdays: Only after 4 PM (accounting │ │
│ │ for travel time) │ │
│ │ - Mornings: Not before 7 AM │ │
│ │ - Evenings: Not after 10 PM (healthy sleep │ │
│ │ schedule) │ │
│ │ - Weekends: Flexible but respect family │ │
│ │ time │ │
│ │ 2. GCSE-Specific Logic │ │
│ │ - Spaced Repetition: Review topics at │ │
│ │ increasing intervals │ │
│ │ - Subject Rotation: Avoid fatigue by │ │
│ │ alternating subjects │ │
│ │ - Exam Proximity: Increase frequency as │ │
│ │ exams approach │ │
│ │ - Difficulty Distribution: Mix easy and │ │
│ │ hard topics │ │
│ │ - Peak Hours: Schedule harder topics when │ │
│ │ student is most alert │ │
│ │ │ │
│ │ Phase 4: Enhanced AI Assistant UI │ │
│ │ │ │
│ │ 1. Conversational Topic Input │ │
│ │ Student: "I need to revise Macbeth, │ │
│ │ quadratic equations, and photosynthesis" │ │
│ │ AI: "Got it! I see you have English Lit, │ │
│ │ Maths, and Biology. │ │
│ │ What's your current confidence level in │ │
│ │ each?" │ │
│ │ 2. Interactive Refinement │ │
│ │ - AI asks clarifying questions │ │
│ │ - Suggests related topics based on GCSE │ │
│ │ syllabus │ │
│ │ - Remembers previous conversations │ │
│ │ 3. Visual Timetable Generation │ │
│ │ - Shows the schedule with beautiful 3D │ │
│ │ cards │ │
│ │ - Color-coded by subject and difficulty │ │
│ │ - Sparkle animations during generation │ │
│ │ │ │
│ │ Phase 5: Implementation Steps │ │
│ │ │ │
│ │ 1. Set up Gemini AI client with GCSE context │ │
│ │ 2. Create student profile system with │ │
│ │ availability tracking │ │
│ │ 3. Build topic input flow with AI │ │
│ │ understanding │ │
│ │ 4. Implement smart scheduling algorithm │ │
│ │ 5. Connect MessageDock to actual AI │ │
│ │ responses │ │
│ │ 6. Add visual feedback and animations │ │
│ │ │ │
│ │ Starting Point: │ │
│ │ │ │
│ │ Begin with setting up the Gemini AI client │ │
│ │ and creating a simple chat endpoint that │ │
│ │ understands GCSE topics. This will let you │ │
│ │ test the AI's understanding of student needs │ │
│ │ immediately while building out the │ │
│ │ scheduling logic. │ │
│ │ │ │
│ │ Key Features: │ │
│ │ │ │
│ │ - Modular topic understanding (dependencies │ │
│ │ between topics) │ │
│ │ - Student profile building (learns │ │
│ │ preferences over time) │ │
│ │ - GCSE-specific scheduling (exam dates, │ │
│ │ syllabus coverage) │ │
│ │ - Availability awareness (school hours, │ │
│ │ family time) │ │
│ │ - Beautiful, simple UI with the existing │ │
│ │ MessageDock component
