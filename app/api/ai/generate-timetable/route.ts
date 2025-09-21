import { NextRequest, NextResponse } from 'next/server';
import { timetableAgent } from '@/lib/ai/timetable-agent';

export async function POST(request: NextRequest) {
  try {
    const { topics, availability, preferences } = await request.json();

    if (!topics || topics.length === 0) {
      return NextResponse.json(
        { error: 'Topics are required' },
        { status: 400 }
      );
    }

    // Default availability if not provided
    const defaultAvailability = availability || {
      monday: [{ start: '16:00', end: '20:00' }],
      tuesday: [{ start: '16:00', end: '20:00' }],
      wednesday: [{ start: '16:00', end: '20:00' }],
      thursday: [{ start: '16:00', end: '20:00' }],
      friday: [{ start: '16:00', end: '20:00' }],
      saturday: [{ start: '10:00', end: '18:00' }],
      sunday: [{ start: '10:00', end: '18:00' }],
      schoolHours: { start: '09:00', end: '15:30' },
    };

    // Default preferences if not provided
    const defaultPreferences = preferences || {
      sessionLength: 45,
      breakLength: 15,
      maxSessionsPerDay: 4,
      studyStyle: 'balanced',
      preferredTimes: ['afternoon', 'evening'],
      includeWeekends: true,
    };

    // Format topics for the agent
    const topicsList = topics
      .map((t: any) => `${t.subject}: ${t.name}`)
      .join('\n');

    const prompt = `Create an intelligent revision timetable for a UK Year 10 student preparing for GCSEs.

Topics to study:
${topicsList}

Available study times:
${JSON.stringify(defaultAvailability, null, 2)}

Study preferences:
${JSON.stringify(defaultPreferences, null, 2)}

Use your tools to:
1. Analyze each topic's difficulty and time requirements
2. Calculate optimal spaced repetition schedules
3. Distribute sessions across available time slots
4. Resolve any time conflicts
5. Generate appropriate break schedules
6. Optimize for cognitive load and variety

Create a 2-week timetable starting from today (${new Date().toISOString()}) that maximizes learning effectiveness while being realistic for a teenager to follow.

Provide a complete schedule with sessions, timing, and educational rationale.`;

    const result = await timetableAgent.generate({
      prompt,
    });

    return NextResponse.json(result.experimental_output);
  } catch (error) {
    console.error('Error generating timetable:', error);
    return NextResponse.json(
      { error: 'Failed to generate timetable' },
      { status: 500 }
    );
  }
}
