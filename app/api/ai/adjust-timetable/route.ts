import { NextRequest, NextResponse } from 'next/server';
import {
  timetableAdjusterAgent,
  TimetableAdjusterResponse,
} from '@/lib/ai/timetable-adjuster-agent';
import { Session } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    const { message, currentSessions, currentTime } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Provide current sessions context if available
    const sessionsContext =
      currentSessions && currentSessions.length > 0
        ? `\n\nCURRENT SCHEDULE:\n${currentSessions
            .map(
              (session: Session, index: number) =>
                `${index + 1}. ${session.subject} - ${session.topic} (${session.startTime} to ${session.endTime}) [ID: ${session.id}]`
            )
            .join('\n')}`
        : '\n\nNo current schedule found.';

    const currentTimeContext = currentTime
      ? `\n\nCurrent time: ${currentTime}`
      : `\n\nCurrent time: ${new Date().toISOString()}`;

    const prompt = `Student request: "${message}"${sessionsContext}${currentTimeContext}

Please analyze this request and provide appropriate timetable adjustments. Consider:

1. What type of adjustment is needed?
2. Which sessions are affected?
3. How to maintain educational effectiveness?
4. What alternatives might work better?
5. How to minimize disruption to the overall schedule?

Provide specific modifications with clear reasoning. If you need to reschedule sessions, suggest realistic alternative times. If adjusting difficulty or duration, explain why this helps the student's learning.`;

    const result = await timetableAdjusterAgent.generate({
      prompt,
    });

    const response = result.experimental_output as TimetableAdjusterResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in Timetable Adjuster API:', error);
    return NextResponse.json(
      { error: 'Failed to generate timetable adjustments' },
      { status: 500 }
    );
  }
}
