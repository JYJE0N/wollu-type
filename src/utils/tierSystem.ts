export interface UserTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
  displayName: string;
  color: string;
  minWpm: number;
  minCpm: number;
  minAccuracy: number;
  minPracticeHours: number;
  icon: string;
}

export const TIERS: UserTier[] = [
  {
    name: 'Bronze',
    displayName: '브론즈',
    color: 'var(--tier-bronze)',
    minWpm: 0,
    minCpm: 0,
    minAccuracy: 50,
    minPracticeHours: 0,
    icon: '🥉'
  },
  {
    name: 'Silver',
    displayName: '실버',
    color: 'var(--tier-silver)',
    minWpm: 40,
    minCpm: 200,
    minAccuracy: 70,
    minPracticeHours: 5,
    icon: '🥈'
  },
  {
    name: 'Gold',
    displayName: '골드',
    color: 'var(--tier-gold)',
    minWpm: 60,
    minCpm: 300,
    minAccuracy: 80,
    minPracticeHours: 15,
    icon: '🥇'
  },
  {
    name: 'Platinum',
    displayName: '플래티넘',
    color: 'var(--tier-platinum)',
    minWpm: 80,
    minCpm: 400,
    minAccuracy: 85,
    minPracticeHours: 30,
    icon: '💎'
  },
  {
    name: 'Diamond',
    displayName: '다이아몬드',
    color: 'var(--tier-diamond)',
    minWpm: 100,
    minCpm: 500,
    minAccuracy: 90,
    minPracticeHours: 50,
    icon: '💠'
  },
  {
    name: 'Master',
    displayName: '마스터',
    color: 'var(--tier-master)',
    minWpm: 120,
    minCpm: 600,
    minAccuracy: 95,
    minPracticeHours: 100,
    icon: '👑'
  }
];

export interface UserStats {
  totalTests: number;
  totalPracticeTime: number; // in minutes
  averageWpm: number;
  averageCpm: number;
  averageAccuracy: number;
  bestWpm: number;
  bestCpm: number;
  bestAccuracy: number;
}

export function calculateUserTier(stats: UserStats, language: 'korean' | 'english'): UserTier {
  const practiceHours = stats.totalPracticeTime / 60;
  const primarySpeed = language === 'korean' ? stats.averageCpm : stats.averageWpm;
  
  // Find the highest tier the user qualifies for
  for (let i = TIERS.length - 1; i >= 0; i--) {
    const tier = TIERS[i];
    const speedRequirement = language === 'korean' ? tier.minCpm : tier.minWpm;
    
    if (
      primarySpeed >= speedRequirement &&
      stats.averageAccuracy >= tier.minAccuracy &&
      practiceHours >= tier.minPracticeHours
    ) {
      return tier;
    }
  }
  
  return TIERS[0]; // Default to Bronze
}

export function getProgressToNextTier(stats: UserStats, language: 'korean' | 'english'): {
  currentTier: UserTier;
  nextTier: UserTier | null;
  progress: {
    speed: number;
    accuracy: number;
    practiceHours: number;
    overall: number;
  };
} {
  const currentTier = calculateUserTier(stats, language);
  const currentTierIndex = TIERS.findIndex(t => t.name === currentTier.name);
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;
  
  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progress: {
        speed: 100,
        accuracy: 100,
        practiceHours: 100,
        overall: 100
      }
    };
  }
  
  const practiceHours = stats.totalPracticeTime / 60;
  const primarySpeed = language === 'korean' ? stats.averageCpm : stats.averageWpm;
  const speedRequirement = language === 'korean' ? nextTier.minCpm : nextTier.minWpm;
  
  const speedProgress = Math.min(100, (primarySpeed / speedRequirement) * 100);
  const accuracyProgress = Math.min(100, (stats.averageAccuracy / nextTier.minAccuracy) * 100);
  const practiceProgress = Math.min(100, (practiceHours / nextTier.minPracticeHours) * 100);
  const overall = (speedProgress + accuracyProgress + practiceProgress) / 3;
  
  return {
    currentTier,
    nextTier,
    progress: {
      speed: speedProgress,
      accuracy: accuracyProgress,
      practiceHours: practiceProgress,
      overall
    }
  };
}

export function getTierInsights(stats: UserStats, language: 'korean' | 'english'): string[] {
  const insights: string[] = [];
  const practiceHours = stats.totalPracticeTime / 60;
  const primarySpeed = language === 'korean' ? stats.averageCpm : stats.averageWpm;
  
  if (stats.averageAccuracy < 80) {
    insights.push('정확도 향상이 필요합니다. 속도보다는 정확한 타이핑에 집중해보세요.');
  }
  
  if (practiceHours < 10) {
    insights.push('더 많은 연습이 필요합니다. 꾸준한 연습이 실력 향상의 열쇠입니다.');
  }
  
  if (language === 'korean' && primarySpeed < 300) {
    insights.push('한글 타이핑 속도가 아직 부족합니다. 자주 사용하는 단어들을 반복 연습해보세요.');
  }
  
  if (language === 'english' && primarySpeed < 60) {
    insights.push('영문 타이핑 속도 향상이 필요합니다. 터치 타이핑 연습을 권장합니다.');
  }
  
  if (stats.totalTests < 50) {
    insights.push('더 다양한 텍스트로 연습해보세요. 다양성이 실력 향상에 도움됩니다.');
  }
  
  return insights.length > 0 ? insights : ['훌륭한 타이핑 실력입니다! 꾸준한 연습으로 더욱 발전시켜보세요.'];
}