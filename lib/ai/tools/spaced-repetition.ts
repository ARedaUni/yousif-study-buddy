import { tool } from 'ai';
import { z } from 'zod';

const spacedRepetitionInputSchema = z.object({
  topicAnalyses: z.array(
    z.object({
      topicId: z.string(),
      estimatedDifficulty: z.number().min(1).max(5),
      requiredHours: z.number(),
    })
  ),
  startDate: z.string().datetime(),
});

const revisionCycleSchema = z.object({
  topicId: z.string(),
  cycles: z.array(
    z.object({
      dayOffset: z.number(),
      sessionType: z.enum(['new-learning', 'revision', 'practice-test']),
      duration: z.number(),
      intervalReasoning: z.string(),
    })
  ),
});

const spacedRepetitionOutputSchema = z.object({
  revisionCycles: z.array(revisionCycleSchema),
  totalScheduleSpan: z.number(),
});

export const calculateSpacedRepetition = tool({
  description:
    'Implements Ebbinghaus forgetting curve to calculate optimal revision intervals, adjusting based on topic difficulty for maximum retention',
  inputSchema: spacedRepetitionInputSchema,
  outputSchema: spacedRepetitionOutputSchema,
  execute: async ({ topicAnalyses, startDate }) => {
    const revisionCycles: z.infer<typeof revisionCycleSchema>[] =
      topicAnalyses.map((analysis) => {
        const { topicId, estimatedDifficulty, requiredHours } = analysis;

        // Ebbinghaus curve intervals (days): 1, 3, 7, 14, 30
        // Adjust based on difficulty - harder topics need more frequent review
        const baseIntervals = [1, 3, 7, 14];
        const difficultyMultiplier = 1 + (5 - estimatedDifficulty) * 0.2;

        const adjustedIntervals = baseIntervals.map((interval) =>
          Math.round(interval * difficultyMultiplier)
        );

        const cycles = [
          {
            dayOffset: 0,
            sessionType: 'new-learning' as const,
            duration: Math.max(45, Math.round((requiredHours * 60) / 3)),
            intervalReasoning:
              'Initial learning session - comprehensive coverage',
          },
          ...adjustedIntervals.map((interval, index) => {
            const sessionType =
              index === adjustedIntervals.length - 1
                ? 'practice-test'
                : 'revision';
            return {
              dayOffset: interval,
              sessionType: sessionType as 'revision' | 'practice-test',
              duration: Math.max(
                25,
                Math.round((requiredHours * 60) / (4 + index))
              ),
              intervalReasoning: `Spaced repetition interval ${interval} days - ${
                index === 0
                  ? 'quick review'
                  : index === 1
                    ? 'reinforcement'
                    : index === 2
                      ? 'consolidation'
                      : 'mastery test'
              }`,
            };
          }),
        ];

        return {
          topicId,
          cycles,
        };
      });

    const maxOffset = Math.max(
      ...revisionCycles.flatMap((cycle) => cycle.cycles.map((c) => c.dayOffset))
    );

    return {
      revisionCycles,
      totalScheduleSpan: maxOffset + 1,
    };
  },
});
