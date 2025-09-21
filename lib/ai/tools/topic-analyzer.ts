import { tool } from 'ai';
import { z } from 'zod';

const topicAnalysisInputSchema = z.object({
  topics: z.array(
    z.object({
      id: z.string(),
      subject: z.string(),
      name: z.string(),
      difficulty: z.number().min(1).max(5).optional(),
    })
  ),
});

const topicAnalysisOutputSchema = z.object({
  analyses: z.array(
    z.object({
      topicId: z.string(),
      estimatedDifficulty: z.number().min(1).max(5),
      requiredHours: z.number(),
      optimalSessionType: z.enum(['intensive', 'distributed']),
      prerequisiteTopics: z.array(z.string()).optional(),
      reasoning: z.string(),
    })
  ),
});

export const analyzeTopicDifficulty = tool({
  description:
    'Analyzes topic complexity based on subject and name, estimates required study time, and suggests optimal session types for GCSE-level content',
  inputSchema: topicAnalysisInputSchema,
  outputSchema: topicAnalysisOutputSchema,
  execute: async ({ topics }) => {
    const subjectDifficultyMap: Record<string, number> = {
      Mathematics: 4,
      'Science (Physics)': 4,
      'Science (Chemistry)': 4,
      'Science (Biology)': 3,
      'English Literature': 3,
      'English Language': 3,
      'Computer Science': 4,
      History: 3,
      Geography: 3,
      French: 3,
      Spanish: 3,
      'Art & Design': 2,
      Music: 2,
      PE: 2,
      'Religious Studies': 2,
    };

    const complexTopicKeywords = [
      'calculus',
      'algebra',
      'trigonometry',
      'quantum',
      'organic chemistry',
      'genetics',
      'shakespeare',
      'poetry',
      'essay',
      'programming',
      'algorithms',
    ];

    const analyses = topics.map((topic) => {
      const baseDifficulty = subjectDifficultyMap[topic.subject] || 3;
      const isComplexTopic = complexTopicKeywords.some((keyword) =>
        topic.name.toLowerCase().includes(keyword)
      );

      let estimatedDifficulty = topic.difficulty || baseDifficulty;
      if (isComplexTopic) {
        estimatedDifficulty = Math.min(5, estimatedDifficulty + 1);
      }

      const requiredHours =
        estimatedDifficulty * 2 + Math.floor(Math.random() * 3);

      const optimalSessionType =
        estimatedDifficulty >= 4 ? 'distributed' : 'intensive';

      const reasoning = `Based on ${topic.subject} complexity (base: ${baseDifficulty}) and topic analysis. ${
        isComplexTopic ? 'Complex topic detected, increased difficulty. ' : ''
      }Estimated ${requiredHours} hours needed across ${optimalSessionType} sessions.`;

      return {
        topicId: topic.id,
        estimatedDifficulty,
        requiredHours,
        optimalSessionType,
        reasoning,
      };
    });

    return { analyses };
  },
});
