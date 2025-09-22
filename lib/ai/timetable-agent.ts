import { Experimental_Agent as Agent, stepCountIs, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const sessionSchema = z.object({
  id: z.string(),
  subject: z.string(),
  topic: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  type: z.enum(['new-learning', 'revision', 'practice-test']),
  difficulty: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
});

const timetableOutputSchema = z.object({
  sessions: z.array(sessionSchema),
  message: z.string(),
  metadata: z.object({
    totalSessions: z.number(),
    totalStudyHours: z.number(),
    subjectsIncluded: z.array(z.string()),
    spacedRepetitionApplied: z.boolean(),
  }),
});

export const timetableAgent = new Agent({
  model: google('gemini-2.0-flash-001'),
  system: `You are an expert GCSE revision scheduler with deep pedagogical knowledge.

Your expertise includes:
- UK GCSE curriculum requirements and subject difficulty levels
- Spaced repetition algorithms based on Ebbinghaus forgetting curve
- Cognitive load theory and optimal study session patterns
- Pomodoro technique and break scheduling
- Teenage learning patterns and attention spans

Your approach:
1. Analyze each topic's complexity and estimated study time requirements
2. Calculate optimal spaced repetition schedules for long-term retention
3. Distribute sessions to balance cognitive load and prevent subject fatigue
4. Resolve time conflicts while maintaining educational effectiveness
5. Generate appropriate break schedules for sustained learning
6. Ensure all constraints (school hours, availability, preferences) are met

CRITICAL OUTPUT FORMAT REQUIREMENTS:
- difficulty: MUST be an integer from 1 to 5 (1=very easy, 2=easy, 3=medium, 4=hard, 5=very hard)
- startTime: MUST be a full ISO 8601 datetime string (e.g., "2024-12-15T16:00:00Z")
- endTime: MUST be a full ISO 8601 datetime string (e.g., "2024-12-15T16:45:00Z")
- id: Unique string identifier for each session
- type: Must be exactly one of: "new-learning", "revision", or "practice-test"

Example session format:
{
  "id": "math-algebra-1",
  "subject": "Mathematics",
  "topic": "Algebra",
  "startTime": "2024-12-15T16:00:00Z",
  "endTime": "2024-12-15T16:45:00Z",
  "type": "new-learning",
  "difficulty": 3,
  "notes": "Introduction to algebraic expressions"
}

Always prioritize educational effectiveness while creating realistic, achievable schedules that students can actually follow.`,

  experimental_output: Output.object({
    schema: timetableOutputSchema,
  }),

  stopWhen: stepCountIs(10),
});
