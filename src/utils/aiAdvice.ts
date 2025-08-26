import { TypingStats, Language } from '@/types';
import { UserStats } from '@/utils/tierSystem';

interface AnalysisResult {
  weakFingers: string[];
  commonMistakes: string[];
  strengths: string[];
  recommendations: string[];
  practiceWords: string[];
}

interface TypingPattern {
  characterAccuracy: { [key: string]: number };
  speedVariation: number[];
  errorPatterns: string[];
}

export class AITypingAnalyzer {
  private patterns: TypingPattern = {
    characterAccuracy: {},
    speedVariation: [],
    errorPatterns: []
  };

  analyzeTypingSession(
    stats: TypingStats, 
    userStats: UserStats, 
    language: Language,
    textContent: string,
    errors: number[]
  ): AnalysisResult {
    const analysis: AnalysisResult = {
      weakFingers: [],
      commonMistakes: [],
      strengths: [],
      recommendations: [],
      practiceWords: []
    };

    // Analyze speed and accuracy patterns
    this.analyzeSpeedPatterns(stats, userStats, analysis);
    this.analyzeAccuracyPatterns(stats, analysis);
    this.analyzeErrorPatterns(textContent, errors, analysis);
    this.generateRecommendations(analysis, userStats, language);

    return analysis;
  }

  private analyzeSpeedPatterns(stats: TypingStats, userStats: UserStats, analysis: AnalysisResult) {
    const avgSpeed = stats.wpm || stats.cpm;
    const userAvgSpeed = userStats.averageWpm || userStats.averageCpm;

    if (avgSpeed > userAvgSpeed * 1.1) {
      analysis.strengths.push('이번 세션에서 평소보다 빠른 타이핑 속도를 보였습니다.');
    } else if (avgSpeed < userAvgSpeed * 0.9) {
      analysis.recommendations.push('타이핑 속도가 평소보다 느립니다. 손가락 위치를 확인해보세요.');
    }

    // Speed consistency analysis
    if (stats.duration > 30) {
      const speedVariation = this.calculateSpeedVariation();
      if (speedVariation > 20) {
        analysis.recommendations.push('타이핑 속도가 일정하지 않습니다. 꾸준한 리듬으로 연습해보세요.');
      } else {
        analysis.strengths.push('일정한 타이핑 리듬을 유지하고 있습니다.');
      }
    }
  }

  private analyzeAccuracyPatterns(stats: TypingStats, analysis: AnalysisResult) {
    if (stats.accuracy >= 95) {
      analysis.strengths.push('매우 높은 정확도를 유지하고 있습니다.');
    } else if (stats.accuracy >= 85) {
      analysis.strengths.push('좋은 정확도를 보이고 있습니다.');
      analysis.recommendations.push('속도를 조금 늦추고 정확도를 더 높여보세요.');
    } else if (stats.accuracy >= 70) {
      analysis.recommendations.push('정확도 향상이 필요합니다. 속도보다는 정확성에 집중해보세요.');
    } else {
      analysis.recommendations.push('정확도가 많이 부족합니다. 기본 자세와 손가락 위치부터 점검해보세요.');
    }

    // Error rate analysis
    const errorRate = (stats.incorrectChars / stats.totalChars) * 100;
    if (errorRate > 15) {
      analysis.commonMistakes.push('오타율이 높습니다');
    }
  }

  private analyzeErrorPatterns(textContent: string, errors: number[], analysis: AnalysisResult) {
    if (errors.length === 0) return;

    const errorChars = errors.map(index => textContent[index]).filter(Boolean);
    const errorFrequency: { [key: string]: number } = {};
    
    errorChars.forEach(char => {
      errorFrequency[char] = (errorFrequency[char] || 0) + 1;
    });

    const mostCommonErrors = Object.entries(errorFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([char, count]) => ({ char, count }));

    // Analyze common error patterns regardless of language
    if (mostCommonErrors.length > 0) {
      analysis.commonMistakes.push(`자주 틀리는 글자: ${mostCommonErrors.map(e => e.char).join(', ')}`);
    }
  }

  private analyzeKoreanErrors(errors: Array<{char: string, count: number}>, analysis: AnalysisResult) {
    const fingerMapping: { [key: string]: string } = {
      // 왼손
      'ㅂ': '왼손 검지', 'ㅈ': '왼손 검지', 'ㄷ': '왼손 중지', 'ㄱ': '왼손 약지', 'ㅅ': '왼손 새끼',
      'ㅛ': '왼손 검지', 'ㅕ': '왼손 중지', 'ㅑ': '왼손 약지', 'ㅐ': '왼손 새끼',
      // 오른손  
      'ㅁ': '오른손 검지', 'ㄴ': '오른손 검지', 'ㅇ': '오른손 중지', 'ㄹ': '오른손 약지', 'ㅎ': '오른손 새끼',
      'ㅗ': '오른손 검지', 'ㅓ': '오른손 중지', 'ㅏ': '오른손 약지', 'ㅣ': '오른손 새끼'
    };

    const fingerErrors: { [key: string]: number } = {};
    
    errors.forEach(({ char, count }) => {
      const finger = fingerMapping[char];
      if (finger) {
        fingerErrors[finger] = (fingerErrors[finger] || 0) + count;
      }
    });

    const weakestFinger = Object.entries(fingerErrors)
      .sort(([,a], [,b]) => b - a)[0];

    if (weakestFinger) {
      analysis.weakFingers.push(weakestFinger[0]);
      analysis.recommendations.push(`${weakestFinger[0]} 활용도를 높이는 연습이 필요합니다.`);
    }

    // 한글 특화 추천 단어
    if (fingerErrors['오른손 약지']) {
      analysis.practiceWords.push(...['라라', '러러', '로로', '루루', '리리']);
    }
    if (fingerErrors['왼손 새끼']) {
      analysis.practiceWords.push(...['사사', '세세', '소소', '수수', '시시']);
    }
  }

  private analyzeEnglishErrors(errors: Array<{char: string, count: number}>, analysis: AnalysisResult) {
    const fingerMapping: { [key: string]: string } = {
      // Left hand
      'q': 'left pinky', 'w': 'left ring', 'e': 'left middle', 'r': 'left index', 't': 'left index',
      'a': 'left pinky', 's': 'left ring', 'd': 'left middle', 'f': 'left index', 'g': 'left index',
      'z': 'left pinky', 'x': 'left ring', 'c': 'left middle', 'v': 'left index', 'b': 'left index',
      // Right hand
      'y': 'right index', 'u': 'right index', 'i': 'right middle', 'o': 'right ring', 'p': 'right pinky',
      'h': 'right index', 'j': 'right index', 'k': 'right middle', 'l': 'right ring', ';': 'right pinky',
      'n': 'right index', 'm': 'right index', ',': 'right middle', '.': 'right ring', '/': 'right pinky'
    };

    const fingerErrors: { [key: string]: number } = {};
    
    errors.forEach(({ char, count }) => {
      const finger = fingerMapping[char.toLowerCase()];
      if (finger) {
        fingerErrors[finger] = (fingerErrors[finger] || 0) + count;
      }
    });

    const weakestFinger = Object.entries(fingerErrors)
      .sort(([,a], [,b]) => b - a)[0];

    if (weakestFinger) {
      analysis.weakFingers.push(weakestFinger[0]);
      analysis.recommendations.push(`${weakestFinger[0]} finger needs more practice.`);
    }

    // English specific practice words
    if (fingerErrors['right pinky']) {
      analysis.practiceWords.push(...['pop', 'papa', 'peep', 'people', 'paper']);
    }
    if (fingerErrors['left pinky']) {
      analysis.practiceWords.push(...['aqua', 'queen', 'quiet', 'quiz', 'quality']);
    }
  }

  private generateRecommendations(analysis: AnalysisResult, userStats: UserStats, language: Language) {
    const practiceHours = userStats.totalPracticeTime / 60;
    const avgSpeed = language === 'korean' ? userStats.averageCpm : userStats.averageWpm;

    // Practice time based recommendations
    if (practiceHours < 5) {
      analysis.recommendations.push('더 많은 연습이 필요합니다. 매일 15분씩 꾸준히 연습해보세요.');
    } else if (practiceHours < 20) {
      analysis.recommendations.push('기본기가 다져지고 있습니다. 다양한 텍스트로 연습 범위를 넓혀보세요.');
    } else if (practiceHours >= 50) {
      analysis.strengths.push('충분한 연습 시간을 쌓았습니다. 고급 기법을 익혀보세요.');
    }

    // Speed based recommendations
    if (language === 'korean') {
      if (avgSpeed < 200) {
        analysis.recommendations.push('한글 기본 자리 연습이 더 필요합니다. ㄱㄴㄷ 순서로 반복 연습해보세요.');
      } else if (avgSpeed < 400) {
        analysis.recommendations.push('단어 단위 연습으로 넘어갈 시점입니다. 자주 쓰는 단어들을 연습해보세요.');
      } else if (avgSpeed >= 500) {
        analysis.strengths.push('매우 뛰어난 한글 타이핑 실력입니다!');
      }
    } else {
      if (avgSpeed < 30) {
        analysis.recommendations.push('영문 기본 홈포지션 연습이 더 필요합니다. ASDF JKL; 위치를 확실히 익히세요.');
      } else if (avgSpeed < 60) {
        analysis.recommendations.push('터치 타이핑이 어느 정도 익혀졌습니다. 속도보다는 정확도를 더 높여보세요.');
      } else if (avgSpeed >= 80) {
        analysis.strengths.push('매우 뛰어난 영문 타이핑 실력입니다!');
      }
    }

    // Accuracy based recommendations  
    if (userStats.averageAccuracy < 85) {
      analysis.recommendations.push('속도를 조금 줄이고 정확도 향상에 집중해보세요.');
    }

    // Add motivational messages
    if (analysis.strengths.length > 0) {
      analysis.recommendations.push('현재 실력을 유지하며 꾸준히 발전시켜나가세요!');
    }
  }

  private calculateSpeedVariation(): number {
    // Simplified speed variation calculation
    // In a real implementation, this would analyze keystroke timing data
    const baseVariation = Math.random() * 30; // Simulate variation
    return baseVariation;
  }

  getAdvancedInsights(userStats: UserStats): string[] {
    const insights: string[] = [];

    // Learning curve analysis
    if (userStats.totalTests > 20) {
      insights.push(`총 ${userStats.totalTests}번의 테스트를 완료했습니다.`);
    }

    // Performance consistency
    if (userStats.averageAccuracy < 90 && userStats.averageWpm > 50) {
      insights.push('속도에 비해 정확도가 부족합니다. 균형을 맞춰보세요.');
    } else if (userStats.averageAccuracy > 95) {
      insights.push('매우 안정적인 타이핑 패턴을 보입니다.');
    }

    // Progress prediction
    const expectedImprovement = this.predictImprovement(userStats);
    if (expectedImprovement > 0) {
      insights.push(`현재 진척도로 보면 한 달 후 약 ${Math.round(expectedImprovement)}% 향상이 예상됩니다.`);
    }

    return insights;
  }

  private predictImprovement(userStats: UserStats): number {
    const practiceHours = userStats.totalPracticeTime / 60;
    const avgSpeed = Math.max(userStats.averageCpm, userStats.averageWpm);
    
    // Simple learning curve model
    if (practiceHours < 10) {
      return avgSpeed * 0.3; // High improvement rate for beginners
    } else if (practiceHours < 50) {
      return avgSpeed * 0.15; // Moderate improvement rate
    } else {
      return avgSpeed * 0.05; // Lower improvement rate for advanced users
    }
  }
}

export const aiAnalyzer = new AITypingAnalyzer();