// Quick test for schema validation
import { 
  sessionSchema, 
  topicSchema, 
  weeklyAvailabilitySchema,
  scheduleRequestSchema 
} from './lib/schema.ts';

console.log('Testing schema validation...');

// Test session schema
const testSession = {
  id: 'session-1',
  subject: 'Mathematics',
  topic: 'Algebra',
  startTime: '2024-01-15T09:00:00.000Z',
  endTime: '2024-01-15T10:00:00.000Z',
  type: 'new-learning',
  difficulty: 3,
  completed: false
};

const sessionResult = sessionSchema.safeParse(testSession);
console.log('Session validation:', sessionResult.success ? '✅ PASS' : '❌ FAIL');
if (!sessionResult.success) {
  console.log('Session errors:', sessionResult.error.issues);
}

// Test weekly availability schema
const testAvailability = {
  monday: [{ start: '09:00', end: '10:00' }],
  tuesday: [],
  wednesday: [{ start: '14:00', end: '16:00' }],
  thursday: [],
  friday: [{ start: '10:00', end: '12:00' }],
  saturday: [{ start: '09:00', end: '17:00' }],
  sunday: [],
  schoolHours: { start: '08:30', end: '15:30' },
  examDates: [{
    subject: 'Mathematics',
    date: '2024-06-15T09:00:00.000Z'
  }]
};

const availabilityResult = weeklyAvailabilitySchema.safeParse(testAvailability);
console.log('Weekly availability validation:', availabilityResult.success ? '✅ PASS' : '❌ FAIL');
if (!availabilityResult.success) {
  console.log('Availability errors:', availabilityResult.error.issues);
}

// Test invalid time slot (end before start)
const invalidSession = {
  ...testSession,
  startTime: '2024-01-15T10:00:00.000Z',
  endTime: '2024-01-15T09:00:00.000Z', // Invalid: end before start
};

const invalidResult = sessionSchema.safeParse(invalidSession);
console.log('Invalid session validation:', invalidResult.success ? '❌ SHOULD FAIL' : '✅ CORRECTLY FAILED');
if (!invalidResult.success) {
  console.log('Expected validation error:', invalidResult.error.issues[0].message);
}

console.log('Schema testing complete!');