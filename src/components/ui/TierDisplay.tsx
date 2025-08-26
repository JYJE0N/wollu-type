'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { getProgressToNextTier, TIERS } from '@/utils/tierSystem';
import { Language } from '@/types';

interface TierDisplayProps {
  language: Language;
  compact?: boolean;
}

export default function TierDisplay({ language, compact = false }: TierDisplayProps) {
  const { stats, currentTier } = useUserStore();
  
  const progressData = getProgressToNextTier(stats, language);
  
  if (!currentTier) return null;

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: currentTier.color }}
        >
          {currentTier.icon}
        </div>
        <span className="font-semibold text-gray-900">{currentTier.displayName}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
            style={{ backgroundColor: currentTier.color }}
          >
            {currentTier.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentTier.displayName}</h2>
            <p className="text-gray-600">현재 티어</p>
          </div>
        </div>
        
        {progressData.nextTier && (
          <div className="text-right">
            <div className="text-sm text-gray-600">다음 티어</div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="font-semibold text-gray-900">{progressData.nextTier.displayName}</span>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: progressData.nextTier.color }}
              >
                {progressData.nextTier.icon}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress to next tier */}
      {progressData.nextTier && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">승급 진행도</span>
            <span className="text-sm font-semibold text-blue-600">
              {Math.round(progressData.progress.overall)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressData.progress.overall}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Detailed progress */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">
                {language === 'korean' ? '타속 (CPM)' : '타속 (WPM)'}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <motion.div
                  className="bg-green-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, progressData.progress.speed)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <div className="text-xs font-semibold text-gray-900 mt-1">
                {Math.round(progressData.progress.speed)}%
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">정확도</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <motion.div
                  className="bg-blue-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, progressData.progress.accuracy)}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
              <div className="text-xs font-semibold text-gray-900 mt-1">
                {Math.round(progressData.progress.accuracy)}%
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">연습시간</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <motion.div
                  className="bg-purple-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, progressData.progress.practiceHours)}%` }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </div>
              <div className="text-xs font-semibold text-gray-900 mt-1">
                {Math.round(progressData.progress.practiceHours)}%
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">승급 조건</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
              <div>
                {language === 'korean' ? 'CPM' : 'WPM'}: {
                  language === 'korean' ? progressData.nextTier.minCpm : progressData.nextTier.minWpm
                }+
              </div>
              <div>정확도: {progressData.nextTier.minAccuracy}%+</div>
              <div>연습시간: {progressData.nextTier.minPracticeHours}시간+</div>
            </div>
          </div>
        </div>
      )}

      {/* All tiers overview */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-3">전체 티어</div>
        <div className="flex justify-between items-center">
          {TIERS.map((tier) => (
            <div key={tier.name} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                  currentTier.name === tier.name
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : 'opacity-50'
                }`}
                style={{ backgroundColor: tier.color }}
              >
                {tier.icon}
              </div>
              <div className="text-xs text-gray-600 mt-1">{tier.displayName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}