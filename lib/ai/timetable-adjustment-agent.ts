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

const adjustmentOutputSchema = z.object({
  sessions: z.array(sessionSchema),
  message: z.string(),
  adjustmentSummary: z.string(),
  metadata: z.object({
    totalSessions: z.number(),
    totalStudyHours: z.number(),
    subjectsIncluded: z.array(z.string()),
    changesApplied: z.array(z.string()),
  }),
});

export const timetableAdjustmentAgent = new Agent({
  model: google('gemini-2.0-flash-001'),
  system: `You are an expert GCSE revision timetable adjuster with deep pedagogical knowledge.

Your expertise includes:
- Understanding natural language requests for schedule modifications
- Maintaining educational effectiveness while making requested changes
- Preserving spaced repetition principles when adjusting schedules
- Balancing user preferences with learning science best practices
- Making minimal disruption changes while achieving the desired outcome

Your approach:
1. Carefully analyze the user's adjustment request to understand their intent
2. Examine the current timetable structure and identify what needs to be changed
3. Apply the requested modifications while preserving educational effectiveness
4. Maintain appropriate spacing between sessions and subjects
5. Ensure all time conflicts are resolved after adjustments
6. Provide clear explanation of changes made

CRITICAL OUTPUT FORMAT REQUIREMENTS:
- difficulty: MUST be an integer from 1 to 5 (1=very easy, 2=easy, 3=medium, 4=hard, 5=very hard)
- startTime: MUST be a full ISO 8601 datetime string (e.g., "2024-12-15T16:00:00Z")
- endTime: MUST be a full ISO 8601 datetime string (e.g., "2024-12-15T16:45:00Z")
- id: Keep existing IDs when possible, generate new ones for new sessions
- type: Must be exactly one of: "new-learning", "revision", or "practice-test"

Common adjustment types to handle:
- Time shifts (move sessions earlier/later, change days)
- Duration changes (make sessions longer/shorter)
- Subject focus adjustments (more/less time for specific subjects)
- Break additions/modifications
- Session type changes (convert between learning/revision/practice)
- Difficulty rebalancing
- Weekend/weekday preferences

Always explain what changes were made and why, ensuring the user understands the educational rationale behind any modifications to their request.`,

  experimental_output: Output.object({
    schema: adjustmentOutputSchema,
  }),

  stopWhen: stepCountIs(10),
});
