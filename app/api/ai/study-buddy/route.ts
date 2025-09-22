import { NextRequest, NextResponse } from 'next/server';
import {
  createStudyBuddyAgent,
  StudyBuddyMemory,
  StudyBuddyResponse,
} from '@/lib/ai/study-buddy-agent';

export async function POST(request: NextRequest) {
  try {
    const { message, memory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Use provided memory or create default
    const studyBuddyMemory: StudyBuddyMemory = memory || {
      interactions: 0,
      lastSeen: new Date(),
      personalityTraits: {
        enthusiasm: 6,
        supportiveness: 7,
        casualness: 6,
        directness: 5,
      },
      knownPreferences: [],
      achievements: [],
      struggles: [],
      goals: [],
      learningStyle: [],
    };

    // Create agent with current memory/personality
    const studyBuddyAgent = createStudyBuddyAgent(studyBuddyMemory);

    // Generate response
    const result = await studyBuddyAgent.generate({
      prompt: `Student message: "${message}"
      
Please respond as Study Buddy, keeping in mind your personality traits and what you know about this student. 

Consider:
- Your current personality: enthusiasm (${studyBuddyMemory.personalityTraits.enthusiasm}/10), supportiveness (${studyBuddyMemory.personalityTraits.supportiveness}/10), casualness (${studyBuddyMemory.personalityTraits.casualness}/10), directness (${studyBuddyMemory.personalityTraits.directness}/10)
- This is interaction #${studyBuddyMemory.interactions + 1}
- Their known preferences: ${studyBuddyMemory.knownPreferences.join(', ') || 'none yet'}
- Recent achievements: ${studyBuddyMemory.achievements.join(', ') || 'none recorded'}
- Known struggles: ${studyBuddyMemory.struggles.join(', ') || 'none recorded'}

Respond naturally and helpfully. If you learn something new about the student from their message, include it in memoryUpdates.`,
    });

    const response = result.experimental_output as StudyBuddyResponse;

    return NextResponse.json({
      ...response,
      updatedMemory: {
        ...studyBuddyMemory,
        interactions: studyBuddyMemory.interactions + 1,
        lastSeen: new Date(),
        personalityTraits: response.personalityTraits,
      },
    });
  } catch (error) {
    console.error('Error in Study Buddy API:', error);
    return NextResponse.json(
      { error: 'Failed to generate Study Buddy response' },
      { status: 500 }
    );
  }
}
