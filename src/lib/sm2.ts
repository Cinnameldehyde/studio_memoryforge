import type { Flashcard, Rating, SM2Parameters } from './types';
import { addDays, formatISO, startOfDay } from 'date-fns';

const MIN_EFACTOR = 1.3;

export function calculateSrsParameters(
  oldParams: SM2Parameters,
  rating: Rating // 0-5, where 0-2 means failed, 3-5 means success
): SM2Parameters {
  const today = startOfDay(new Date());
  let newInterval = oldParams.interval;
  let newRepetition = oldParams.repetition;
  let newEfactor = oldParams.efactor;

  if (rating < 3) { // Failed (e.g., "Don't Know")
    newRepetition = 0;
    newInterval = 1; // Reset interval to 1 day
  } else { // Success (e.g., "Know")
    newRepetition += 1;
    if (newRepetition === 1) {
      newInterval = 1;
    } else if (newRepetition === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(newInterval * newEfactor);
    }

    // Update E-Factor
    newEfactor = newEfactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    if (newEfactor < MIN_EFACTOR) {
      newEfactor = MIN_EFACTOR;
    }
  }
  
  const newDueDate = addDays(today, newInterval);

  return {
    interval: newInterval,
    repetition: newRepetition,
    efactor: newEfactor,
    dueDate: formatISO(newDueDate),
  };
}

export function initializeSm2Parameters(): SM2Parameters {
  return {
    interval: 0, // Will become 1 on first correct review
    repetition: 0,
    efactor: 2.5,
    dueDate: formatISO(startOfDay(new Date())), // Due today by default
  };
}

// Helper to determine if a card is "mastered"
// This is a simple heuristic, can be adjusted
export function checkIsMastered(params: SM2Parameters): boolean {
  return params.repetition > 5 && params.interval > 30; // e.g., 5 successful reviews and interval over a month
}
