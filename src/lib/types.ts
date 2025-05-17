export interface User {
  id: string;
  email?: string; // For custom login
  name?: string; // For custom login or Google
  // For simple local auth, we might not have a full profile picture URL
  // but keeping it for potential future extension or simple initials avatar
  avatarUrl?: string; 
}

export interface SM2Parameters {
  interval: number; // in days
  repetition: number; // n: number of times card has been successfully recalled
  efactor: number; // E-Factor: easiness factor
  dueDate: string; // ISO string date
}

export interface Flashcard extends SM2Parameters {
  id: string;
  userId: string; // To associate card with a user
  question: string;
  answer: string;
  createdAt: string; // ISO string date
  lastReviewedAt?: string; // ISO string date
  isMastered?: boolean; // Optional: if efactor and interval are high enough
}

export type Rating = 0 | 1 | 2 | 3 | 4 | 5; // SM-2 quality assessment (0-2: incorrect, 3-5: correct)
// For "Know" / "Don't Know", we'll map:
// "Don't Know" -> 0-2 (e.g., 1)
// "Know" -> 3-5 (e.g., 4)

export interface DailyReviewSummary {
  date: string; // YYYY-MM-DD
  cardsReviewed: number;
}
