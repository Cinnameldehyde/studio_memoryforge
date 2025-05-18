
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Flashcard, Rating, DailyReviewSummary } from '@/lib/types';
import { calculateSrsParameters, initializeSm2Parameters, checkIsMastered } from '@/lib/sm2';
import { useLocalStorage } from './use-local-storage';
import { useAuth } from './use-auth';
import { formatISO, parseISO, startOfDay, isBefore, isEqual, format, addDays } from 'date-fns';
import { useToast } from './use-toast';

const FLASHCARDS_STORAGE_KEY_PREFIX = 'memoryforge-flashcards-';
const DAILY_SUMMARY_STORAGE_KEY_PREFIX = 'memoryforge-daily-summary-';


export interface FlashcardStats {
  totalCards: number;
  cardsMastered: number;
  dueToday: number;
  upcomingReviews: number; // e.g., due in next 7 days, not including today
  reviewedTodayCount: number;
}

interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  addFlashcard: (question: string, answer: string) => void;
  updateFlashcardContent: (id: string, question: string, answer: string) => void;
  deleteFlashcard: (id: string) => void;
  rateFlashcard: (id: string, rating: Rating) => void;
  getNextDueCard: () => Flashcard | undefined;
  getFlashcardById: (id: string) => Flashcard | undefined;
  stats: FlashcardStats;
  isLoading: boolean;
  dailySummaries: DailyReviewSummary[];
  resetCardProgress: (id: string) => void;
}

export function useFlashcards(): UseFlashcardsReturn {
  const { user } = useAuth();
  const userId = user?.id;

  const [allFlashcards, setAllFlashcards] = useLocalStorage<Record<string, Flashcard[]>>(FLASHCARDS_STORAGE_KEY_PREFIX, {});
  const [allDailySummaries, setAllDailySummaries] = useLocalStorage<Record<string, DailyReviewSummary[]>>(DAILY_SUMMARY_STORAGE_KEY_PREFIX, {});
  
  const [userFlashcards, setUserFlashcards] = useState<Flashcard[]>([]);
  const [userDailySummaries, setUserDailySummaries] = useState<DailyReviewSummary[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      setUserFlashcards(allFlashcards[userId] || []);
      setUserDailySummaries(allDailySummaries[userId] || []);
    } else {
      setUserFlashcards([]);
      setUserDailySummaries([]);
    }
    setIsLoading(false);
  }, [userId, allFlashcards, allDailySummaries]);

  const saveUserFlashcards = useCallback((updatedFlashcards: Flashcard[]) => {
    if (userId) {
      setAllFlashcards(prev => ({ ...prev, [userId]: updatedFlashcards }));
    }
  }, [userId, setAllFlashcards]);

  const saveUserDailySummaries = useCallback((updatedSummaries: DailyReviewSummary[]) => {
    if (userId) {
      setAllDailySummaries(prev => ({ ...prev, [userId]: updatedSummaries }));
    }
  }, [userId, setAllDailySummaries]);


  const addFlashcard = useCallback((question: string, answer: string) => {
    if (!userId) return;
    const newCard: Flashcard = {
      id: Date.now().toString(),
      userId,
      question,
      answer,
      ...initializeSm2Parameters(),
      createdAt: formatISO(new Date()),
      isMastered: false,
    };
    const updatedFlashcards = [...userFlashcards, newCard];
    saveUserFlashcards(updatedFlashcards);
    toast({ title: "Flashcard Added", description: `"${question}" has been added.` });
  }, [userId, userFlashcards, saveUserFlashcards, toast]);

  const updateFlashcardContent = useCallback((id: string, question: string, answer: string) => {
    const updatedFlashcards = userFlashcards.map(card =>
      card.id === id ? { ...card, question, answer } : card
    );
    saveUserFlashcards(updatedFlashcards);
    toast({ title: "Flashcard Updated", description: "Changes saved successfully." });
  }, [userFlashcards, saveUserFlashcards, toast]);
  
  const deleteFlashcard = useCallback((id: string) => {
    const cardToDelete = userFlashcards.find(c => c.id === id);
    const updatedFlashcards = userFlashcards.filter(card => card.id !== id);
    saveUserFlashcards(updatedFlashcards);
    if (cardToDelete) {
       toast({ title: "Flashcard Deleted", description: `"${cardToDelete.question}" has been deleted.`, variant: "destructive" });
    }
  }, [userFlashcards, saveUserFlashcards, toast]);

  const rateFlashcard = useCallback((id: string, rating: Rating) => {
    const card = userFlashcards.find(c => c.id === id);
    if (!card) return;

    const newSrsParams = calculateSrsParameters(card, rating);
    const updatedCard: Flashcard = {
      ...card,
      ...newSrsParams,
      lastReviewedAt: formatISO(new Date()),
      isMastered: checkIsMastered(newSrsParams),
    };
    
    const updatedFlashcards = userFlashcards.map(c => (c.id === id ? updatedCard : c));
    saveUserFlashcards(updatedFlashcards);

    // Update daily summary
    const todayStr = format(startOfDay(new Date()), 'yyyy-MM-dd');
    let summaryExists = false;
    const updatedSummaries = userDailySummaries.map(summary => {
      if (summary.date === todayStr) {
        summaryExists = true;
        return { ...summary, cardsReviewed: summary.cardsReviewed + 1 };
      }
      return summary;
    });

    if (!summaryExists) {
      updatedSummaries.push({ date: todayStr, cardsReviewed: 1 });
    }
    saveUserDailySummaries(updatedSummaries.sort((a, b) => b.date.localeCompare(a.date))); 

    const message = rating >= 3 ? "Good job! Keep it up." : "No worries, you'll get it next time!";
    toast({ title: "Card Rated", description: message });
  }, [userFlashcards, userDailySummaries, saveUserFlashcards, saveUserDailySummaries, toast]);

  const getNextDueCard = useCallback((): Flashcard | undefined => {
    const today = startOfDay(new Date());
    const dueCards = userFlashcards
      .filter(card => {
        const dueDate = startOfDay(parseISO(card.dueDate));
        return isBefore(dueDate, today) || isEqual(dueDate, today);
      })
      .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime() || (a.lastReviewedAt ? parseISO(a.lastReviewedAt).getTime() : 0) - (b.lastReviewedAt ? parseISO(b.lastReviewedAt).getTime() : 0) );
    return dueCards[0];
  }, [userFlashcards]);

  const getFlashcardById = useCallback((id: string): Flashcard | undefined => {
    return userFlashcards.find(card => card.id === id);
  }, [userFlashcards]);

  const resetCardProgress = useCallback((id: string) => {
    const updatedFlashcards = userFlashcards.map(card =>
      card.id === id ? { 
        ...card, 
        ...initializeSm2Parameters(), 
        lastReviewedAt: undefined, 
        isMastered: false 
      } : card
    );
    saveUserFlashcards(updatedFlashcards);
    toast({ title: "Card Progress Reset", description: "The card is now due for review again." });
  }, [userFlashcards, saveUserFlashcards, toast]);

  const calculateStats = useCallback((): FlashcardStats => {
    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);
    
    let dueTodayCount = 0;
    let upcomingReviewsCount = 0;
    
    userFlashcards.forEach(card => {
      const dueDate = startOfDay(parseISO(card.dueDate));
      if (isBefore(dueDate, today) || isEqual(dueDate, today)) {
        dueTodayCount++;
      } else if (isBefore(dueDate, nextWeek)) {
        upcomingReviewsCount++;
      }
    });

    const reviewedTodaySummary = userDailySummaries.find(s => s.date === format(today, 'yyyy-MM-dd'));

    return {
      totalCards: userFlashcards.length,
      cardsMastered: userFlashcards.filter(card => card.isMastered).length,
      dueToday: dueTodayCount,
      upcomingReviews: upcomingReviewsCount,
      reviewedTodayCount: reviewedTodaySummary?.cardsReviewed || 0,
    };
  }, [userFlashcards, userDailySummaries]);

  const [stats, setStats] = useState<FlashcardStats>(calculateStats());

  useEffect(() => {
    setStats(calculateStats());
  }, [userFlashcards, userDailySummaries, calculateStats]);

  return {
    flashcards: userFlashcards,
    addFlashcard,
    updateFlashcardContent,
    deleteFlashcard,
    rateFlashcard,
    getNextDueCard,
    getFlashcardById,
    stats,
    isLoading,
    dailySummaries: userDailySummaries,
    resetCardProgress,
  };
}
