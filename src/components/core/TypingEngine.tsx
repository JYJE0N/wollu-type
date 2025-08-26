'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import TextRenderer from './TextRenderer';
import { TypingStats, TypingSettings, Language, TextType } from '@/types';
import { getRandomKoreanSentences } from '@/data/sentences/korean';
import { getRandomEnglishSentences } from '@/data/sentences/english';
import { getRandomKoreanWords } from '@/data/words/korean';
import { getRandomEnglishWords } from '@/data/words/english';
import { aiAnalyzer } from '@/utils/aiAdvice';
import { useUserStore } from '@/stores/userStore';
import { useSettingsStore } from '@/stores/settingsStore';

interface TypingEngineProps {
  language: Language;
  settings: TypingSettings;
  onComplete: (stats: TypingStats) => void;
  textType?: TextType;
}

export default function TypingEngine({ language, settings, onComplete, textType = 'sentence' }: TypingEngineProps) {
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(settings.countdown ? 3 : 0);
  const [showCountdown, setShowCountdown] = useState(settings.countdown);
  
  const { stats: userStats } = useUserStore();
  const { ghostMode } = useSettingsStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate text based on settings and type
  const generateText = useCallback(() => {
    if (textType === 'word') {
      // Generate words
      if (language === 'korean') {
        const words = getRandomKoreanWords(settings.wordCount);
        return words.map(w => w.content).join(' ');
      } else {
        const words = getRandomEnglishWords(settings.wordCount);
        return words.map(w => w.content).join(' ');
      }
    } else {
      // Generate sentences
      if (language === 'korean') {
        const sentences = getRandomKoreanSentences(settings.sentenceCount, settings.sentenceLength);
        return sentences.map(s => s.content).join(' ');
      } else {
        const sentences = getRandomEnglishSentences(settings.sentenceCount, settings.sentenceLength);
        return sentences.map(s => s.content).join(' ');
      }
    }
  }, [language, settings, textType]);

  // Initialize text
  useEffect(() => {
    const newText = generateText();
    setText(newText);
    setCurrentIndex(0);
    setErrors([]);
    setIsActive(false);
    setStartTime(null);
    
    if (settings.countdown) {
      setCountdown(3);
      setShowCountdown(true);
    }
  }, [generateText, settings.countdown]);

  // Countdown timer
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      setIsActive(true);
      inputRef.current?.focus();
    }
  }, [countdown, showCountdown]);

  // Calculate stats
  const calculateStats = useCallback((): TypingStats => {
    const endTime = Date.now();
    const duration = startTime ? (endTime - startTime) / 1000 : 0;
    const totalChars = currentIndex;
    const correctChars = totalChars - errors.length;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
    
    let wpm = 0;
    let cpm = 0;
    
    if (duration > 0) {
      if (language === 'korean') {
        cpm = (correctChars / duration) * 60;
      } else {
        wpm = (correctChars / 5) / (duration / 60); // Standard 5 characters = 1 word
        cpm = (correctChars / duration) * 60;
      }
    }
    
    return {
      wpm,
      cpm,
      accuracy,
      duration,
      totalChars,
      correctChars,
      incorrectChars: errors.length
    };
  }, [startTime, currentIndex, errors.length, language]);

  // Handle keypress
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isActive || showCountdown) return;
    
    // Start timer on first keypress
    if (!startTime) {
      setStartTime(Date.now());
    }

    const key = event.key;
    const targetChar = text[currentIndex];

    // Handle special keys
    if (key === 'Escape') {
      // Restart
      const newText = generateText();
      setText(newText);
      setCurrentIndex(0);
      setErrors([]);
      setStartTime(null);
      setIsActive(false);
      if (settings.countdown) {
        setCountdown(3);
        setShowCountdown(true);
      } else {
        setIsActive(true);
      }
      return;
    }

    if (key === 'Tab') {
      event.preventDefault();
      // Next test
      const newText = generateText();
      setText(newText);
      setCurrentIndex(0);
      setErrors([]);
      setStartTime(null);
      setIsActive(false);
      if (settings.countdown) {
        setCountdown(3);
        setShowCountdown(true);
      } else {
        setIsActive(true);
      }
      return;
    }

    // Handle backspace
    if (key === 'Backspace') {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        // Remove error if backing up
        setErrors(prev => prev.filter(errorIndex => errorIndex !== currentIndex - 1));
      }
      return;
    }

    // Skip non-printable keys
    if (key.length > 1) return;

    // Check if character matches
    if (key === targetChar) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setErrors(prev => [...prev, currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }
  }, [isActive, showCountdown, startTime, text, currentIndex, generateText, settings.countdown]);

  // Handle test completion
  const handleComplete = useCallback(async () => {
    setIsActive(false);
    const stats = calculateStats();
    
    // Generate AI analysis
    const analysis = aiAnalyzer.analyzeTypingSession(
      stats, 
      userStats, 
      language, 
      text, 
      errors
    );
    
    // Save to database with analysis
    try {
      await fetch('/api/typing-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          textType,
          textContent: text,
          stats,
          analysis, // Include AI analysis
        }),
      });
    } catch (error) {
      console.error('Failed to save typing record:', error);
    }
    
    onComplete(stats);
  }, [calculateStats, onComplete, language, text, textType, userStats, errors]);

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Focus management
  useEffect(() => {
    if (isActive && !showCountdown) {
      inputRef.current?.focus();
    }
  }, [isActive, showCountdown]);

  return (
    <div className="space-y-6">
      {/* Hidden input for mobile */}
      <input
        ref={inputRef}
        className="sr-only"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Countdown */}
      {showCountdown && countdown > 0 && (
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
          <div className="text-8xl font-bold text-white">
            {countdown}
          </div>
        </motion.div>
      )}

      {/* Stats Display */}
      {startTime && isActive && (
        <div className="flex justify-center space-x-8 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
          <div className="text-center">
            <div className="font-semibold text-lg text-blue-600">
              {language === 'korean' ? Math.round(calculateStats().cpm) : Math.round(calculateStats().wpm)}
            </div>
            <div className="text-xs">{language === 'korean' ? 'CPM' : 'WPM'}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-green-600">
              {Math.round(calculateStats().accuracy)}%
            </div>
            <div className="text-xs">정확도</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-purple-600">
              {Math.round(calculateStats().duration)}s
            </div>
            <div className="text-xs">시간</div>
          </div>
        </div>
      )}

      {/* Text Renderer */}
      <TextRenderer
        text={text}
        currentIndex={currentIndex}
        errors={errors}
        language={language}
        isActive={isActive}
        onComplete={handleComplete}
        typingEffect={settings.typingEffect}
        ghostMode={ghostMode}
        currentStats={calculateStats()}
      />

      {/* Instructions */}
      {!isActive && !showCountdown && (
        <div className="text-center text-gray-500 text-sm space-y-2">
          <p>타이핑을 시작하려면 아무 키나 누르세요</p>
          <div className="flex justify-center space-x-4 text-xs">
            <span><kbd className="px-2 py-1 bg-gray-200 rounded">Tab</kbd> 다음 테스트</span>
            <span><kbd className="px-2 py-1 bg-gray-200 rounded">Esc</kbd> 재시작</span>
          </div>
        </div>
      )}
    </div>
  );
}