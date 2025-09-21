import { tool } from 'ai';
import { z } from 'zod';

const breakGeneratorInputSchema = z.object({
  optimizedSessions: z.array(
    z.object({
      topicId: z.string(),
      subject: z.string(),
      topic: z.string(),
      sessionType: z.enum(['new-learning', 'revision', 'practice-test']),
      startTime: z.string().datetime(),
      endTime: z.string().datetime(),
      cognitiveLoad: z.number().min(1).max(5),
    })
  ),
  preferences: z
    .object({
      breakLength: z.number().default(10),
      sessionLength: z.number().default(45),
    })
    .optional(),
});

const finalSessionSchema = z.object({
  id: z.string(),
  subject: z.string(),
  topic: z.string(),
  sessionType: z.enum(['new-learning', 'revision', 'practice-test']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  hasBreakAfter: z.boolean(),
  breakDuration: z.number().optional(),
  breakType: z.enum(['short', 'meal', 'long']).optional(),
  breakReason: z.string().optional(),
});

const breakGeneratorOutputSchema = z.object({
  finalSessions: z.array(finalSessionSchema),
  scheduleMetadata: z.object({
    totalStudyTime: z.number(),
    totalBreakTime: z.number(),
    sessionCount: z.number(),
    breakCount: z.number(),
  }),
});

export const generateBreakSchedule = tool({
  description:
    'Inserts appropriate breaks based on session intensity, considers time of day, adds meal breaks, and implements Pomodoro-style rest periods',
  inputSchema: breakGeneratorInputSchema,
  outputSchema: breakGeneratorOutputSchema,
  execute: async ({ optimizedSessions, preferences = {} }) => {
    const defaultBreakLength = preferences.breakLength || 10;
    const sessionLength = preferences.sessionLength || 45;

    // Sort sessions chronologically
    const sortedSessions = [...optimizedSessions].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const finalSessions: z.infer<typeof finalSessionSchema>[] = [];
    let totalBreakTime = 0;
    let breakCount = 0;

    sortedSessions.forEach((session, index) => {
      const sessionStart = new Date(session.startTime);
      const sessionEnd = new Date(session.endTime);
      const nextSession = sortedSessions[index + 1];

      let hasBreakAfter = false;
      let breakDuration: number | undefined;
      let breakType: 'short' | 'meal' | 'long' | undefined;
      let breakReason: string | undefined;

      if (nextSession) {
        const nextSessionStart = new Date(nextSession.startTime);
        const timeBetween =
          (nextSessionStart.getTime() - sessionEnd.getTime()) / (1000 * 60); // minutes

        // Determine break type based on various factors
        const sessionHour = sessionEnd.getHours();
        const isHighCognitiveLoad = session.cognitiveLoad >= 4;
        const isLongSession =
          (sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60) >= 60;

        // Meal break times
        const isMealTime =
          (sessionHour >= 12 && sessionHour <= 13) || // Lunch
          (sessionHour >= 17 && sessionHour <= 19); // Dinner

        if (isMealTime && timeBetween >= 30) {
          hasBreakAfter = true;
          breakDuration = Math.min(60, timeBetween);
          breakType = 'meal';
          breakReason = `Meal break during ${sessionHour >= 17 ? 'dinner' : 'lunch'} time`;
        } else if (isHighCognitiveLoad || isLongSession) {
          hasBreakAfter = true;
          breakDuration = Math.min(20, timeBetween);
          breakType = 'long';
          breakReason = `Extended break after ${isHighCognitiveLoad ? 'high cognitive load' : 'long'} session`;
        } else if (timeBetween >= defaultBreakLength) {
          hasBreakAfter = true;
          breakDuration = Math.min(defaultBreakLength, timeBetween);
          breakType = 'short';
          breakReason = 'Standard inter-session break for mental reset';
        }

        if (hasBreakAfter && breakDuration) {
          totalBreakTime += breakDuration;
          breakCount++;
        }
      }

      finalSessions.push({
        id: session.topicId,
        subject: session.subject,
        topic: session.topic,
        sessionType: session.sessionType,
        startTime: session.startTime,
        endTime: session.endTime,
        hasBreakAfter,
        breakDuration,
        breakType,
        breakReason,
      });
    });

    const totalStudyTime = finalSessions.reduce((total, session) => {
      const duration =
        (new Date(session.endTime).getTime() -
          new Date(session.startTime).getTime()) /
        (1000 * 60);
      return total + duration;
    }, 0);

    return {
      finalSessions,
      scheduleMetadata: {
        totalStudyTime: Math.round(totalStudyTime),
        totalBreakTime,
        sessionCount: finalSessions.length,
        breakCount,
      },
    };
  },
});
