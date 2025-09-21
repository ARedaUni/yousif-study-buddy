import { tool } from 'ai';
import { z } from 'zod';

const sessionDistributionInputSchema = z.object({
  resolvedSessions: z.array(
    z.object({
      topicId: z.string(),
      subject: z.string(),
      topic: z.string(),
      sessionType: z.enum(['new-learning', 'revision', 'practice-test']),
      startTime: z.string().datetime(),
      endTime: z.string().datetime(),
      duration: z.number(),
    })
  ),
  preferences: z
    .object({
      maxSessionsPerDay: z.number().default(4),
      studyStyle: z
        .enum(['intensive', 'relaxed', 'balanced'])
        .default('balanced'),
    })
    .optional(),
});

const optimizedSessionSchema = z.object({
  topicId: z.string(),
  subject: z.string(),
  topic: z.string(),
  sessionType: z.enum(['new-learning', 'revision', 'practice-test']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  optimizationReason: z.string(),
  cognitiveLoad: z.number().min(1).max(5),
});

const sessionDistributionOutputSchema = z.object({
  optimizedSessions: z.array(optimizedSessionSchema),
  distributionMetrics: z.object({
    subjectBalance: z.record(z.string(), z.number()),
    dailyLoad: z.record(z.string(), z.number()),
    cognitiveVariety: z.number(),
  }),
});

export const optimizeSessionDistribution = tool({
  description:
    'Balances subjects across days, prevents cognitive overload, mixes difficult/easy topics, and implements optimal study patterns',
  inputSchema: sessionDistributionInputSchema,
  outputSchema: sessionDistributionOutputSchema,
  execute: async ({ resolvedSessions, preferences = {} }) => {
    const maxSessionsPerDay = preferences.maxSessionsPerDay || 4;
    const studyStyle = preferences.studyStyle || 'balanced';

    // Group sessions by day
    const sessionsByDay: Record<string, typeof resolvedSessions> = {};

    resolvedSessions.forEach((session) => {
      const day = new Date(session.startTime).toDateString();
      if (!sessionsByDay[day]) {
        sessionsByDay[day] = [];
      }
      sessionsByDay[day].push(session);
    });

    // Subject difficulty mapping
    const subjectDifficulty: Record<string, number> = {
      Mathematics: 5,
      'Science (Physics)': 5,
      'Science (Chemistry)': 4,
      'Science (Biology)': 3,
      'English Literature': 3,
      'Computer Science': 4,
      History: 3,
      Geography: 3,
      French: 3,
      Spanish: 3,
      'Art & Design': 2,
      Music: 2,
      PE: 1,
      'Religious Studies': 2,
    };

    const optimizedSessions: z.infer<typeof optimizedSessionSchema>[] = [];
    const subjectBalance: Record<string, number> = {};
    const dailyLoad: Record<string, number> = {};

    // Optimize each day's sessions
    Object.entries(sessionsByDay).forEach(([day, sessions]) => {
      if (sessions.length > maxSessionsPerDay) {
        // Prioritize by session type and difficulty
        sessions.sort((a, b) => {
          const aWeight =
            (subjectDifficulty[a.subject] || 3) +
            (a.sessionType === 'new-learning'
              ? 2
              : a.sessionType === 'practice-test'
                ? 1
                : 0);
          const bWeight =
            (subjectDifficulty[b.subject] || 3) +
            (b.sessionType === 'new-learning'
              ? 2
              : b.sessionType === 'practice-test'
                ? 1
                : 0);
          return bWeight - aWeight;
        });
        sessions = sessions.slice(0, maxSessionsPerDay);
      }

      // Alternate difficulty levels
      const sortedByDifficulty = [...sessions].sort(
        (a, b) =>
          (subjectDifficulty[b.subject] || 3) -
          (subjectDifficulty[a.subject] || 3)
      );

      const reorderedSessions = [];
      const hard = sortedByDifficulty.filter((_, i) => i % 2 === 0);
      const easy = sortedByDifficulty.filter((_, i) => i % 2 === 1);

      for (let i = 0; i < Math.max(hard.length, easy.length); i++) {
        if (hard[i]) reorderedSessions.push(hard[i]);
        if (easy[i]) reorderedSessions.push(easy[i]);
      }

      let totalDayLoad = 0;

      reorderedSessions.forEach((session, index) => {
        const cognitiveLoad = subjectDifficulty[session.subject] || 3;
        totalDayLoad += cognitiveLoad;

        subjectBalance[session.subject] =
          (subjectBalance[session.subject] || 0) + 1;

        const optimizationReason =
          `Optimized for ${studyStyle} study style. ` +
          `Position ${index + 1}/${reorderedSessions.length} balances cognitive load. ` +
          `${index % 2 === 0 ? 'Higher' : 'Lower'} difficulty session for variety.`;

        optimizedSessions.push({
          topicId: session.topicId,
          subject: session.subject,
          topic: session.topic,
          sessionType: session.sessionType,
          startTime: session.startTime,
          endTime: session.endTime,
          optimizationReason,
          cognitiveLoad,
        });
      });

      dailyLoad[day] = totalDayLoad;
    });

    // Calculate cognitive variety score
    const cognitiveLoads = optimizedSessions.map((s) => s.cognitiveLoad);
    const avgLoad =
      cognitiveLoads.reduce((sum, load) => sum + load, 0) /
      cognitiveLoads.length;
    const variance =
      cognitiveLoads.reduce(
        (sum, load) => sum + Math.pow(load - avgLoad, 2),
        0
      ) / cognitiveLoads.length;
    const cognitiveVariety = Math.round((variance / 2) * 100) / 100; // Normalized variety score

    return {
      optimizedSessions,
      distributionMetrics: {
        subjectBalance,
        dailyLoad,
        cognitiveVariety,
      },
    };
  },
});
