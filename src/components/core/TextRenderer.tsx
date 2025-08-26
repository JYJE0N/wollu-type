'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Language, TypingStats } from '@/types';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import GhostModeOverlay from '@/components/ui/GhostModeOverlay';

interface TextRendererProps {
  text: string;
  currentIndex: number;
  errors: number[];
  language: Language;
  isActive: boolean;
  onComplete: () => void;
  typingEffect?: boolean;
  ghostMode?: boolean;
  currentStats?: Partial<TypingStats>;
}

export default function TextRenderer({
  text,
  currentIndex,
  errors,
  language,
  isActive,
  onComplete,
  typingEffect = true,
  ghostMode = false,
  currentStats = {}
}: TextRendererProps) {
  const [composition, setComposition] = useState('');
  const [showIME, setShowIME] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const { isMobile, hasVirtualKeyboard, screenSize } = useMobileDetection();

  // Auto-scroll to keep current character centered
  useEffect(() => {
    if (cursorRef.current && textRef.current) {
      const cursor = cursorRef.current;
      const container = textRef.current;
      
      const cursorRect = cursor.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const shouldScroll = cursorRect.top < containerRect.top + 100 || 
                          cursorRect.bottom > containerRect.bottom - 100;
      
      if (shouldScroll) {
        cursor.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentIndex]);

  // Handle IME composition for Korean
  const handleCompositionStart = useCallback(() => {
    if (language === 'korean') {
      setShowIME(true);
    }
  }, [language]);

  const handleCompositionUpdate = useCallback((e: React.CompositionEvent<HTMLDivElement>) => {
    if (language === 'korean') {
      setComposition(e.data);
    }
  }, [language]);

  const handleCompositionEnd = useCallback(() => {
    if (language === 'korean') {
      setShowIME(false);
      setComposition('');
    }
  }, [language]);

  useEffect(() => {
    if (currentIndex >= text.length && isActive) {
      onComplete();
    }
  }, [currentIndex, text.length, isActive, onComplete]);

  const renderCharacter = (char: string, index: number) => {
    const isCurrent = index === currentIndex;
    const isCompleted = index < currentIndex;
    const hasError = errors.includes(index);

    let className = 'relative transition-colors duration-150 ';
    
    if (isCurrent) {
      className += 'bg-blue-100 ';
    } else if (isCompleted) {
      className += hasError ? 'text-red-500 bg-red-50 ' : 'text-green-600 ';
    } else {
      className += 'text-gray-400 ';
    }

    if (char === ' ') {
      className += 'border-b-2 border-current mx-1 ';
    }

    return (
      <span key={index} className={className}>
        {char === ' ' ? '\u00A0' : char}
        {isCurrent && (
          <motion.span
            ref={cursorRef}
            className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        {isCurrent && typingEffect && (
          <motion.div
            className="absolute inset-0 bg-blue-200 rounded"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </span>
    );
  };

  // Dynamic text size and spacing based on screen size
  const getTextClasses = () => {
    if (screenSize === 'mobile') {
      return 'text-lg leading-relaxed';
    } else if (screenSize === 'tablet-sm' || screenSize === 'tablet') {
      return 'text-xl leading-relaxed';
    } else {
      return 'text-2xl leading-relaxed';
    }
  };

  const getPaddingClasses = () => {
    if (hasVirtualKeyboard) return 'p-3';
    if (screenSize === 'mobile') return 'p-4';
    return 'p-6';
  };

  return (
    <div className="relative">
      {/* Ghost Mode Overlay */}
      {ghostMode && (
        <GhostModeOverlay
          currentIndex={currentIndex}
          totalLength={text.length}
          currentStats={currentStats}
          isActive={isActive}
        />
      )}
      
      <div
        ref={textRef}
        className={`${getTextClasses()} font-mono tracking-wide overflow-hidden ${getPaddingClasses()} bg-white rounded-lg shadow-sm border border-gray-200 ${
          hasVirtualKeyboard ? 'max-h-48' : 'max-h-96'
        } ${isMobile ? 'touch-manipulation' : ''} ${ghostMode ? 'pt-24' : ''}`}
        onCompositionStart={handleCompositionStart}
        onCompositionUpdate={handleCompositionUpdate}
        onCompositionEnd={handleCompositionEnd}
        style={{
          // Prevent zoom on mobile when focused
          fontSize: isMobile ? '16px' : undefined,
          lineHeight: isMobile ? '1.4' : undefined,
        }}
      >
        {text.split('').map((char, index) => renderCharacter(char, index))}
      </div>

      {/* Korean IME Preview Panel */}
      {showIME && composition && language === 'korean' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-800 text-white rounded-lg shadow-lg border"
        >
          <div className="text-sm font-medium">조합 중</div>
          <div className="text-lg font-mono">{composition}</div>
          <motion.div
            className="absolute inset-0 bg-blue-400 rounded-lg -z-10"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      )}
    </div>
  );
}