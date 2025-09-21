import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const sessionSchema = z.object({
  id: z.string(),
  subject: z.string(),
  topic: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  type: z.enum(['new-learning', 'revision', 'practice-test']),
});

const timetableSchema = z.object({
  sessions: z.array(sessionSchema),
  message: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const { topics } = await request.json();

    if (!topics || topics.length === 0) {
      return NextResponse.json(
        { error: 'Topics are required' },
        { status: 400 }
      );
    }

    // Format topics for the prompt
    const topicsList = topics
      .map((t: any) => `${t.subject}: ${t.name}`)
      .join('\n');

    const prompt = `You are an AI tutor creating a revision timetable for a UK Year 10 student (age 15-16) preparing for GCSEs.

Student's topics to study:
${topicsList}

Create a balanced 2-week revision timetable with the following requirements:
- Sessions between 4:00 PM - 8:00 PM on weekdays (after school)
- Weekend sessions between 10:00 AM - 6:00 PM 
- Each session should be 45 minutes long
- Include 15-minute breaks between sessions
- Use spaced repetition: review topics again after 1 day, 3 days, and 1 week
- Mix different subjects to avoid fatigue
- Include different session types: new-learning, revision, practice-test
- Sessions should be scheduled for the next 2 weeks starting from today
- Generate realistic study times that a teenager can follow

For each session, provide:
- A unique ID
- Subject name (exactly as provided)
- Specific topic name
- Start time (ISO format)
- End time (ISO format) 
- Session type (new-learning, revision, or practice-test)

Also provide a brief encouraging message about the timetable.

Current date: ${new Date().toISOString()}`;

    const { object } = await generateObject({
      model: google('gemini-2.0-flash-001'),
      prompt,
      schema: timetableSchema,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error('Error generating timetable:', error);
    return NextResponse.json(
      { error: 'Failed to generate timetable' },
      { status: 500 }
    );
  }
}
