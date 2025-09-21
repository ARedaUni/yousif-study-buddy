import { Experimental_Agent as Agent, stepCountIs, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import {
  analyzeTopicDifficulty,
  calculateSpacedRepetition,
  checkTimeConflicts,
  optimizeSessionDistribution,
  generateBreakSchedule,
} from './tools';

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

Always prioritize educational effectiveness while creating realistic, achievable schedules that students can actually follow.`,

  tools: {
    analyzeTopicDifficulty,
    calculateSpacedRepetition,
    checkTimeConflicts,
    optimizeSessionDistribution,
    generateBreakSchedule,
  },

  experimental_output: Output.object({
    schema: timetableOutputSchema,
  }),

  stopWhen: stepCountIs(10),
});
