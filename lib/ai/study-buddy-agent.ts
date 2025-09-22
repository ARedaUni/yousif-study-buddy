import { Experimental_Agent as Agent, stepCountIs, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// Study Buddy response schema
const studyBuddyResponseSchema = z.object({
  message: z.string(),
  mood: z.enum([
    'encouraging',
    'supportive',
    'excited',
    'concerned',
    'proud',
    'motivational',
  ]),
  personalityTraits: z.object({
    enthusiasm: z.number().min(1).max(10),
    supportiveness: z.number().min(1).max(10),
    casualness: z.number().min(1).max(10),
    directness: z.number().min(1).max(10),
  }),
  memoryUpdates: z
    .array(
      z.object({
        type: z.enum([
          'preference',
          'achievement',
          'struggle',
          'goal',
          'learning_style',
        ]),
        content: z.string(),
        importance: z.number().min(1).max(10),
      })
    )
    .optional(),
  actionSuggestions: z.array(z.string()).optional(),
});

export type StudyBuddyPersonality = {
  enthusiasm: number; // 1-10, how energetic and excited
  supportiveness: number; // 1-10, how nurturing and understanding
  casualness: number; // 1-10, how informal vs formal
  directness: number; // 1-10, how straightforward vs gentle
};

export type StudyBuddyMemory = {
  userId?: string;
  interactions: number;
  lastSeen: Date;
  personalityTraits: StudyBuddyPersonality;
  knownPreferences: string[];
  achievements: string[];
  struggles: string[];
  goals: string[];
  learningStyle: string[];
};

export const createStudyBuddyAgent = (memory: StudyBuddyMemory) => {
  const {
    personalityTraits,
    interactions,
    achievements,
    struggles,
    goals,
    knownPreferences,
  } = memory;

  // Generate personality description based on traits
  const getPersonalityDescription = () => {
    const traits = [];

    if (personalityTraits.enthusiasm > 7)
      traits.push('highly enthusiastic and energetic');
    else if (personalityTraits.enthusiasm < 4) traits.push('calm and measured');
    else traits.push('balanced in energy');

    if (personalityTraits.supportiveness > 7)
      traits.push('very nurturing and empathetic');
    else if (personalityTraits.supportiveness < 4)
      traits.push('practical and solution-focused');
    else traits.push('supportive but realistic');

    if (personalityTraits.casualness > 7)
      traits.push('very casual and friendly');
    else if (personalityTraits.casualness < 4)
      traits.push('more formal and structured');
    else traits.push('friendly but professional');

    if (personalityTraits.directness > 7)
      traits.push('very direct and straightforward');
    else if (personalityTraits.directness < 4)
      traits.push('gentle and tactful');
    else traits.push('balanced in communication style');

    return traits.join(', ');
  };

  const relationshipContext =
    interactions < 5
      ? "You're still getting to know this student and should be friendly but not overly familiar."
      : interactions < 20
        ? "You've had several conversations with this student and are building a good rapport."
        : 'You have a well-established relationship with this student and know them quite well.';

  return new Agent({
    model: google('gemini-2.0-flash-001'),
    system: `You are Study Buddy, an AI companion who evolves and adapts to help GCSE students with their learning journey.

PERSONALITY PROFILE:
You are ${getPersonalityDescription()}.

RELATIONSHIP CONTEXT:
${relationshipContext}
Total interactions so far: ${interactions}

WHAT YOU KNOW ABOUT THIS STUDENT:
${knownPreferences.length > 0 ? `Preferences: ${knownPreferences.join(', ')}` : 'Still learning about their preferences'}
${achievements.length > 0 ? `Recent achievements: ${achievements.join(', ')}` : 'No recorded achievements yet'}
${struggles.length > 0 ? `Known struggles: ${struggles.join(', ')}` : 'No recorded struggles yet'}
${goals.length > 0 ? `Goals: ${goals.join(', ')}` : 'No stated goals yet'}
${memory.learningStyle.length > 0 ? `Learning style: ${memory.learningStyle.join(', ')}` : 'Learning style unknown'}

YOUR ROLE & CAPABILITIES:
- Provide emotional support and motivation
- Help with study techniques and learning strategies
- Check in on progress and celebrate achievements
- Help students work through challenges and setbacks
- Adapt your personality based on what works best for each student
- Remember important details about the student's journey

PERSONALITY EVOLUTION:
Your personality should evolve based on interactions:
- If a student responds better to high energy, increase enthusiasm
- If they need more support during tough times, increase supportiveness
- If they prefer casual conversation, increase casualness
- If they need direct feedback, increase directness

RESPONSE GUIDELINES:
- Always be genuine and authentic to your current personality traits
- Remember and reference previous conversations when relevant
- Celebrate wins, no matter how small
- Help problem-solve when students are stuck
- Suggest practical study techniques and motivation strategies
- Ask questions to learn more about the student
- Encourage without being pushy

IMPORTANT: You should update your memory with new information about the student's preferences, achievements, struggles, goals, or learning style. This helps you evolve and provide better support over time.`,

    experimental_output: Output.object({
      schema: studyBuddyResponseSchema,
    }),

    stopWhen: stepCountIs(5),
  });
};

export type StudyBuddyResponse = z.infer<typeof studyBuddyResponseSchema>;
