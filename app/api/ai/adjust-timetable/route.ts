import { NextRequest, NextResponse } from 'next/server';
import { timetableAdjustmentAgent } from '@/lib/ai/timetable-adjustment-agent';

export async function POST(request: NextRequest) {
  try {
    const { sessions, prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Adjustment prompt is required' },
        { status: 400 }
      );
    }

    if (!sessions || !Array.isArray(sessions)) {
      return NextResponse.json(
        { error: 'Current sessions are required' },
        { status: 400 }
      );
    }

    // Format current sessions for the agent
    const currentSchedule = sessions.map((session: any) => ({
      id: session.id,
      subject: session.subject,
      topic: session.topic,
      startTime:
        session.startTime instanceof Date
          ? session.startTime.toISOString()
          : session.startTime,
      endTime:
        session.endTime instanceof Date
          ? session.endTime.toISOString()
          : session.endTime,
      type: session.type,
      difficulty: session.difficulty,
      notes: session.notes,
    }));

    // Default availability if not provided
    const defaultAvailability = {
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
    const defaultPreferences = {
      sessionLength: 45,
      breakLength: 15,
      maxSessionsPerDay: 4,
      studyStyle: 'balanced',
      preferredTimes: ['afternoon', 'evening'],
      includeWeekends: true,
    };

    const adjustmentPrompt = `Adjust the following timetable based on the user's request:

USER REQUEST: "${prompt.trim()}"

CURRENT TIMETABLE:
${JSON.stringify(currentSchedule, null, 2)}

Available study times:
${JSON.stringify(defaultAvailability, null, 2)}

Study preferences:
${JSON.stringify(defaultPreferences, null, 2)}

Please analyze the user's request and make the appropriate adjustments to the timetable. Consider:
1. The specific changes requested by the user
2. Maintaining educational effectiveness and spaced repetition
3. Resolving any time conflicts that may arise
4. Preserving the overall balance of subjects and session types
5. Keeping changes minimal while achieving the desired outcome

Provide the adjusted timetable with a clear explanation of what changes were made and why.`;

    const result = await timetableAdjustmentAgent.generate({
      prompt: adjustmentPrompt,
    });

    return NextResponse.json(result.experimental_output);
  } catch (error) {
    console.error('Error adjusting timetable:', error);
    return NextResponse.json(
      { error: 'Failed to adjust timetable' },
      { status: 500 }
    );
  }
}
