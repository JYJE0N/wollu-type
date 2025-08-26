'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingStats } from '@/types';
import { useUserStore } from '@/stores/userStore';

interface GhostModeOverlayProps {
  currentIndex: number;
  totalLength: number;
  currentStats: Partial<TypingStats>;
  isActive: boolean;
}

export default function GhostModeOverlay({
  currentIndex,
  totalLength,
  currentStats,
  isActive
}: GhostModeOverlayProps) {
  const { recentTests } = useUserStore();
  const [ghostRecord, setGhostRecord] = useState<TypingStats | null>(null);
  const [ghostProgress, setGhostProgress] = useState(0);
  const [isAhead, setIsAhead] = useState(false);

  // Find best matching previous record for ghost comparison
  useEffect(() => {
    if (!isActive || recentTests.length === 0) return;

    // Find best record with similar text length for fair comparison
    const bestRecord = recentTests
      .filter(test => Math.abs(test.totalChars - totalLength) < totalLength * 0.2) // Within 20% of current text length
      .sort((a, b) => b.cpm - a.cpm)[0]; // Best CPM/WPM

    setGhostRecord(bestRecord || recentTests[0]);
  }, [isActive, recentTests, totalLength]);

  // Update ghost progress based on time
  useEffect(() => {
    if (!ghostRecord || !currentStats.duration) return;

    // Calculate where ghost would be at current time
    const currentTime = currentStats.duration;
    const ghostSpeed = ghostRecord.cpm / 60; // Characters per second
    const expectedProgress = Math.min(ghostSpeed * currentTime, totalLength);
    
    setGhostProgress(expectedProgress);
    setIsAhead(currentIndex > expectedProgress);
  }, [currentIndex, currentStats.duration, ghostRecord, totalLength]);

  if (!ghostRecord || !isActive) return null;

  const progressPercentage = (currentIndex / totalLength) * 100;
  const ghostProgressPercentage = (ghostProgress / totalLength) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-200 rounded-t-lg p-4 z-10"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-purple-800">
              👻 고스트 모드 - 이전 기록과 대결 중
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <div className={`flex items-center space-x-1 ${isAhead ? 'text-green-600' : 'text-red-600'}`}>
              <span>{isAhead ? '🚀' : '🐢'}</span>
              <span>{isAhead ? '앞서가는 중' : '따라잡는 중'}</span>
            </div>
            
            <div className="text-gray-600">
              목표: {Math.round(ghostRecord.cpm)} CPM
            </div>
          </div>
        </div>

        {/* Progress Race Visualization */}
        <div className="relative">
          {/* Background Track */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            {/* User Progress */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            
            {/* Ghost Progress */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-300 to-purple-500 rounded-full opacity-70"
              animate={{ width: `${ghostProgressPercentage}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* User Icon */}
          <motion.div
            className="absolute -top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
            animate={{ 
              left: `calc(${progressPercentage}% - 8px)`,
              scale: isAhead ? 1.2 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white text-xs">🏃</span>
          </motion.div>

          {/* Ghost Icon */}
          <motion.div
            className="absolute -top-1 w-4 h-4 bg-purple-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center opacity-80"
            animate={{ 
              left: `calc(${ghostProgressPercentage}% - 8px)`,
              scale: !isAhead ? 1.2 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white text-xs">👻</span>
          </motion.div>
        </div>

        {/* Stats Comparison */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
          <div className="text-center">
            <div className="text-blue-600 font-semibold">
              {Math.round(currentStats.cpm || 0)}
            </div>
            <div className="text-gray-500">현재 CPM</div>
          </div>
          
          <div className="text-center">
            <div className="text-purple-600 font-semibold">
              {Math.round(ghostRecord.cpm)}
            </div>
            <div className="text-gray-500">목표 CPM</div>
          </div>
          
          <div className="text-center">
            <div className={`font-semibold ${
              (currentStats.cpm || 0) > ghostRecord.cpm ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.round((currentStats.cpm || 0) - ghostRecord.cpm)}
            </div>
            <div className="text-gray-500">차이</div>
          </div>
        </div>

        {/* Motivational Messages */}
        <AnimatePresence mode="wait">
          {isAhead && (
            <motion.div
              key="ahead"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 text-center text-xs text-green-600 font-medium bg-green-50 rounded-lg py-2"
            >
              🎉 훌륭해요! 이전 기록을 넘어서고 있습니다!
            </motion.div>
          )}
          
          {!isAhead && Math.abs(currentIndex - ghostProgress) < 5 && (
            <motion.div
              key="close"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 text-center text-xs text-yellow-600 font-medium bg-yellow-50 rounded-lg py-2"
            >
              🔥 거의 다 따라잡았어요! 조금만 더!
            </motion.div>
          )}

          {!isAhead && Math.abs(currentIndex - ghostProgress) >= 5 && (
            <motion.div
              key="behind"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 text-center text-xs text-blue-600 font-medium bg-blue-50 rounded-lg py-2"
            >
              💪 집중하세요! 아직 따라잡을 수 있어요!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}