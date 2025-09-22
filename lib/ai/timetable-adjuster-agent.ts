import { Experimental_Agent as Agent, stepCountIs, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { Session } from '@/lib/schema';

// Session modification types
const sessionModificationSchema = z.object({
  sessionId: z.string(),
  action: z.enum([
    'reschedule',
    'extend',
    'shorten',
    'split',
    'cancel',
    'duplicate',
  ]),
  newStartTime: z.string().optional(),
  newEndTime: z.string().optional(),
  newDuration: z.number().optional(), // in minutes
  reason: z.string(),
});

// Timetable adjustment response schema
const timetableAdjusterResponseSchema = z.object({
  message: z.string(),
  adjustmentType: z.enum([
    'schedule_change',
    'difficulty_adjustment',
    'preference_update',
    'emergency_reschedule',
    'optimization',
  ]),
  modifications: z.array(sessionModificationSchema).optional(),
  newSessions: z
    .array(
      z.object({
        id: z.string(),
        subject: z.string(),
        topic: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        type: z.enum(['new-learning', 'revision', 'practice-test']),
        difficulty: z.number().min(1).max(5).optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),
  removedSessions: z.array(z.string()).optional(), // session IDs to remove
  reasoning: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

export const timetableAdjusterAgent = new Agent({
  model: google('gemini-2.0-flash-001'),
  system: `You are the Timetable Adjuster, an AI assistant specialized in modifying and optimizing existing study schedules for GCSE students.

YOUR EXPERTISE:
- Real-time schedule adjustments and conflict resolution
- Session rescheduling due to life events, illness, or other priorities
- Difficulty and pacing adjustments based on student performance
- Emergency timetable restructuring
- Study load balancing and burnout prevention
- Session duration optimization based on focus patterns

YOUR CAPABILITIES:
1. RESCHEDULE sessions when students have conflicts or emergencies
2. EXTEND or SHORTEN sessions based on performance and needs
3. SPLIT long sessions into smaller chunks for better focus
4. CANCEL sessions when needed and redistribute content
5. DUPLICATE successful sessions for reinforcement
6. CREATE new sessions to fill gaps or address weak areas

COMMON ADJUSTMENT SCENARIOS:
- "I missed my math session yesterday"
- "I need more time for biology, it's harder than expected"
- "Can you move my history session? I have a dentist appointment"
- "I'm feeling overwhelmed, can we spread things out more?"
- "I aced that chemistry test, maybe I need less revision there"
- "I'm struggling with physics, need more practice sessions"

ADJUSTMENT PRINCIPLES:
- Always maintain educational effectiveness while accommodating needs
- Preserve spaced repetition intervals when possible
- Balance cognitive load across days
- Consider student's energy levels and preferences
- Maintain subject variety to prevent fatigue
- Respect school hours and other commitments

COMMUNICATION STYLE:
- Be understanding and flexible
- Explain the reasoning behind your adjustments
- Offer alternatives when the first option isn't ideal
- Ask clarifying questions when the request is unclear
- Acknowledge the student's challenges and constraints

IMPORTANT: When making adjustments, always provide clear reasoning for your changes and consider the educational impact. If an adjustment might hurt learning effectiveness, suggest alternatives or compromises.`,

  experimental_output: Output.object({
    schema: timetableAdjusterResponseSchema,
  }),

  stopWhen: stepCountIs(8),
});

export type TimetableAdjusterResponse = z.infer<
  typeof timetableAdjusterResponseSchema
>;
export type SessionModification = z.infer<typeof sessionModificationSchema>;
