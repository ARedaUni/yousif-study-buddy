import { z } from 'zod';

// Constants for reuse
export const SESSION_TYPES = [
  'new-learning',
  'revision',
  'practice-test',
] as const;
export const PRIORITIES = ['high', 'medium', 'low'] as const;
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

// Core schemas - Updated to match revision-store types
export const sessionSchema = z.object({
  id: z.string(),
  subject: z.string().min(1),
  topic: z.string().min(1),
  startTime: z.date(),
  endTime: z.date(),
  type: z.enum(SESSION_TYPES),
  color: z.string(),
  difficulty: z.number().min(1).max(5).optional(),
  completed: z.boolean().optional(),
  notes: z.string().optional(),
});

export const topicSchema = z.object({
  id: z.string(),
  subject: z.string().min(1),
  name: z.string().min(1),
  addedAt: z.date(),
  difficulty: z.number().min(1).max(5).optional(),
  priority: z.enum(PRIORITIES).optional(),
});

export const timeSlotSchema = z
  .object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // "09:00" format
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // "10:00" format
  })
  .refine(
    (data) => {
      const [startHour, startMin] = data.start.split(':').map(Number);
      const [endHour, endMin] = data.end.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      return endMinutes > startMinutes;
    },
    {
      message: 'End time must be after start time',
      path: ['end'],
    }
  );

// Weekly availability schema matching CLAUDE.md structure
export const weeklyAvailabilitySchema = z.object({
  monday: z.array(timeSlotSchema).default([]),
  tuesday: z.array(timeSlotSchema).default([]),
  wednesday: z.array(timeSlotSchema).default([]),
  thursday: z.array(timeSlotSchema).default([]),
  friday: z.array(timeSlotSchema).default([]),
  saturday: z.array(timeSlotSchema).default([]),
  sunday: z.array(timeSlotSchema).default([]),
  schoolHours: z
    .object({
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    })
    .default({ start: '08:30', end: '15:30' }),
  examDates: z
    .array(
      z.object({
        subject: z.string(),
        date: z.string().datetime(),
      })
    )
    .optional(),
});

// Legacy availability schema for backward compatibility
// export const availabilitySchema = z.object({
//   slots: z.array(timeSlotSchema.extend({
//     day: z.enum(DAYS_OF_WEEK)
//   })),
//   schoolHours: z.object({
//     start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
//     end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
//   }).default({ start: "08:30", end: "15:30" }),
//   examDates: z.array(z.object({
//     subject: z.string(),
//     date: z.string().datetime()
//   })).optional()
// });

export const preferencesSchema = z.object({
  sessionLength: z.number().min(15).max(120).default(45), // minutes
  breakLength: z.number().min(5).max(30).default(10), // minutes
  maxSessionsPerDay: z.number().min(1).max(10).default(4),
  preferredTimes: z
    .array(z.enum(['morning', 'afternoon', 'evening']))
    .optional(),
  studyStyle: z.enum(['intensive', 'relaxed', 'balanced']).default('balanced'),
  includeWeekends: z.boolean().default(true),
});

export const scheduleRequestSchema = z.object({
  topics: z.array(topicSchema),
  availability: z.union([weeklyAvailabilitySchema, weeklyAvailabilitySchema]),
  preferences: preferencesSchema.optional(),
});

export const scheduleResponseSchema = z.object({
  sessions: z.array(sessionSchema),
  summary: z
    .object({
      totalSessions: z.number(),
      totalHours: z.number(),
      subjectDistribution: z.record(z.string(), z.number()),
    })
    .optional(),
});
export type Session = z.infer<typeof sessionSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type TimeSlot = z.infer<typeof timeSlotSchema>;
// export type Availability = z.infer<typeof availabilitySchema>;
export type WeeklyAvailability = z.infer<typeof weeklyAvailabilitySchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type ScheduleRequest = z.infer<typeof scheduleRequestSchema>;
export type ScheduleResponse = z.infer<typeof scheduleResponseSchema>;

// Additional utility types
export type SessionType = (typeof SESSION_TYPES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
export type StudyStyle = 'intensive' | 'relaxed' | 'balanced';
export type PreferredTime = 'morning' | 'afternoon' | 'evening';

// Common GCSE subjects for UK Year 10
export const COMMON_SUBJECTS = [
  'Mathematics',
  'English Literature',
  'English Language',
  'Science (Biology)',
  'Science (Chemistry)',
  'Science (Physics)',
  'History',
  'Geography',
  'French',
  'Spanish',
  'Art & Design',
  'Music',
  'PE',
  'Computer Science',
  'Religious Studies',
] as const;

// Subject type from constants
export type Subject = (typeof COMMON_SUBJECTS)[number];

// Session type colors for UI
export const SESSION_TYPE_COLORS = {
  'new-learning': 'bg-blue-100 border-blue-300 text-blue-800',
  revision: 'bg-green-100 border-green-300 text-green-800',
  'practice-test': 'bg-orange-100 border-orange-300 text-orange-800',
} as const;

// Difficulty colors
export const DIFFICULTY_COLORS = {
  1: 'bg-emerald-100 text-emerald-800',
  2: 'bg-lime-100 text-lime-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-orange-100 text-orange-800',
  5: 'bg-red-100 text-red-800',
} as const;

// Default session lengths for quick selection
export const DEFAULT_SESSION_LENGTHS = [25, 45, 60, 90] as const; // minutes

// Default break lengths
export const DEFAULT_BREAK_LENGTHS = [5, 10, 15, 20] as const; // minutes

// Time periods for scheduling
export const TIME_PERIODS = {
  morning: { start: '06:00', end: '12:00' },
  afternoon: { start: '12:00', end: '18:00' },
  evening: { start: '18:00', end: '22:00' },
} as const;

// Validation helper functions
export const isValidTimeSlot = (slot: { start: string; end: string }) => {
  return timeSlotSchema.safeParse(slot).success;
};

export const isValidSession = (session: Partial<Session>) => {
  return sessionSchema.safeParse(session).success;
};

// Type guards
export const isSessionType = (value: string): value is SessionType => {
  return SESSION_TYPES.includes(value as SessionType);
};

export const isPriority = (value: string): value is Priority => {
  return PRIORITIES.includes(value as Priority);
};

export const isDayOfWeek = (value: string): value is DayOfWeek => {
  return DAYS_OF_WEEK.includes(value as DayOfWeek);
};
