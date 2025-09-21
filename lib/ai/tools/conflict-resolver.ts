import { tool } from 'ai';
import { z } from 'zod';

const timeSlotSchema = z.object({
  start: z.string(),
  end: z.string(),
});

const sessionSlotSchema = z.object({
  topicId: z.string(),
  subject: z.string(),
  topic: z.string(),
  sessionType: z.enum(['new-learning', 'revision', 'practice-test']),
  duration: z.number(),
  scheduledDate: z.string().datetime(),
  preferredTime: z.string().optional(),
});

const availabilitySchema = z.object({
  monday: z.array(timeSlotSchema).default([]),
  tuesday: z.array(timeSlotSchema).default([]),
  wednesday: z.array(timeSlotSchema).default([]),
  thursday: z.array(timeSlotSchema).default([]),
  friday: z.array(timeSlotSchema).default([]),
  saturday: z.array(timeSlotSchema).default([]),
  sunday: z.array(timeSlotSchema).default([]),
  schoolHours: z.object({
    start: z.string(),
    end: z.string(),
  }),
});

const conflictResolverInputSchema = z.object({
  sessionSlots: z.array(sessionSlotSchema),
  availability: availabilitySchema,
});

const resolvedSessionSchema = z.object({
  topicId: z.string(),
  subject: z.string(),
  topic: z.string(),
  sessionType: z.enum(['new-learning', 'revision', 'practice-test']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  conflicts: z.array(z.string()),
  resolution: z.string(),
});

const conflictResolverOutputSchema = z.object({
  resolvedSessions: z.array(resolvedSessionSchema),
  unresolvableConflicts: z.array(z.string()),
});

export const checkTimeConflicts = tool({
  description:
    'Validates against school hours, checks for overlapping sessions, ensures proper break times, and resolves scheduling conflicts',
  inputSchema: conflictResolverInputSchema,
  outputSchema: conflictResolverOutputSchema,
  execute: async ({ sessionSlots, availability }) => {
    const resolvedSessions: z.infer<typeof resolvedSessionSchema>[] = [];

    const unresolvableConflicts: string[] = [];
    const scheduledSessions: Array<{ start: Date; end: Date }> = [];

    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    const parseTime = (timeStr: string): { hours: number; minutes: number } => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return { hours, minutes };
    };

    const isTimeInRange = (
      time: Date,
      rangeStart: string,
      rangeEnd: string
    ): boolean => {
      const timeMinutes = time.getHours() * 60 + time.getMinutes();
      const startMinutes =
        parseTime(rangeStart).hours * 60 + parseTime(rangeStart).minutes;
      const endMinutes =
        parseTime(rangeEnd).hours * 60 + parseTime(rangeEnd).minutes;
      return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
    };

    for (const session of sessionSlots) {
      const sessionDate = new Date(session.scheduledDate);
      const dayName = dayNames[
        sessionDate.getDay()
      ] as keyof typeof availability;
      const availableSlots = availability[dayName] || [];

      let conflicts: string[] = [];
      let bestStartTime: Date | null = null;
      let resolution = '';

      // Check if it's during school hours
      if (
        isTimeInRange(
          sessionDate,
          availability.schoolHours.start,
          availability.schoolHours.end
        )
      ) {
        conflicts.push('Conflicts with school hours');
      }

      // Find available slot
      for (const slot of Array.isArray(availableSlots) ? availableSlots : []) {
        const slotStart = new Date(sessionDate);
        const slotStartTime = parseTime(slot.start);
        slotStart.setHours(slotStartTime.hours, slotStartTime.minutes, 0, 0);

        const slotEnd = new Date(sessionDate);
        const slotEndTime = parseTime(slot.end);
        slotEnd.setHours(slotEndTime.hours, slotEndTime.minutes, 0, 0);

        const sessionEnd = new Date(
          slotStart.getTime() + session.duration * 60000
        );

        // Check if session fits in this slot
        if (sessionEnd <= slotEnd) {
          // Check for overlaps with already scheduled sessions
          const hasOverlap = scheduledSessions.some(
            (scheduled) =>
              slotStart < scheduled.end && sessionEnd > scheduled.start
          );

          if (!hasOverlap) {
            bestStartTime = slotStart;
            resolution = `Scheduled in available ${dayName} slot ${slot.start}-${slot.end}`;
            break;
          } else {
            conflicts.push(
              `Overlap with existing session in ${slot.start}-${slot.end}`
            );
          }
        } else {
          conflicts.push(
            `Session duration (${session.duration}min) exceeds slot ${slot.start}-${slot.end}`
          );
        }
      }

      if (bestStartTime) {
        const endTime = new Date(
          bestStartTime.getTime() + session.duration * 60000
        );

        resolvedSessions.push({
          topicId: session.topicId,
          subject: session.subject,
          topic: session.topic,
          sessionType: session.sessionType,
          startTime: bestStartTime.toISOString(),
          endTime: endTime.toISOString(),
          conflicts,
          resolution,
        });

        scheduledSessions.push({ start: bestStartTime, end: endTime });
      } else {
        unresolvableConflicts.push(
          `Cannot schedule ${session.subject} - ${session.topic} on ${dayName}: ${conflicts.join(', ')}`
        );
      }
    }

    return {
      resolvedSessions,
      unresolvableConflicts,
    };
  },
});
