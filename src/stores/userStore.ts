import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TypingStats } from '@/types';
import { calculateUserTier, UserTier, UserStats } from '@/utils/tierSystem';

interface UserState {
  userId: string | null;
  nickname: string | null;
  stats: UserStats;
  recentTests: TypingStats[];
  currentTier: UserTier | null;
  
  // Actions
  setUser: (userId: string, nickname?: string) => void;
  updateStats: (newTest: TypingStats) => void;
  resetStats: () => void;
  updateNickname: (nickname: string) => void;
}

const initialStats: UserStats = {
  totalTests: 0,
  totalPracticeTime: 0,
  averageWpm: 0,
  averageCpm: 0,
  averageAccuracy: 0,
  bestWpm: 0,
  bestCpm: 0,
  bestAccuracy: 0,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      nickname: null,
      stats: initialStats,
      recentTests: [],
      currentTier: null,

      setUser: (userId: string, nickname?: string) => {
        set({ userId, nickname });
      },

      updateStats: (newTest: TypingStats) => {
        const currentStats = get().stats;
        const recentTests = get().recentTests;
        
        // Keep only last 50 tests for performance
        const updatedRecentTests = [newTest, ...recentTests].slice(0, 50);
        
        const totalTests = currentStats.totalTests + 1;
        const totalPracticeTime = currentStats.totalPracticeTime + (newTest.duration / 60);
        
        // Calculate new averages
        const averageWpm = ((currentStats.averageWpm * currentStats.totalTests) + newTest.wpm) / totalTests;
        const averageCpm = ((currentStats.averageCpm * currentStats.totalTests) + newTest.cpm) / totalTests;
        const averageAccuracy = ((currentStats.averageAccuracy * currentStats.totalTests) + newTest.accuracy) / totalTests;
        
        // Update best scores
        const bestWpm = Math.max(currentStats.bestWpm, newTest.wpm);
        const bestCpm = Math.max(currentStats.bestCpm, newTest.cpm);
        const bestAccuracy = Math.max(currentStats.bestAccuracy, newTest.accuracy);
        
        const updatedStats: UserStats = {
          totalTests,
          totalPracticeTime,
          averageWpm,
          averageCpm,
          averageAccuracy,
          bestWpm,
          bestCpm,
          bestAccuracy,
        };
        
        // Calculate new tier (assuming Korean for now, should be based on current language)
        const newTier = calculateUserTier(updatedStats, 'korean');
        
        set({
          stats: updatedStats,
          recentTests: updatedRecentTests,
          currentTier: newTier,
        });
      },

      resetStats: () => {
        set({
          stats: initialStats,
          recentTests: [],
          currentTier: null,
        });
      },

      updateNickname: (nickname: string) => {
        set({ nickname });
      },
    }),
    {
      name: 'wollu-user-storage',
      version: 1,
    }
  )
);