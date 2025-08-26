import { useEffect, useCallback, useState } from 'react';
import { Language } from '@/types';

interface KeyboardShortcutOptions {
  onLanguageToggle?: (language: Language) => void;
  onRestart?: () => void;
  onNextTest?: () => void;
  onPause?: () => void;
  onSettings?: () => void;
  onStats?: () => void;
  onThemes?: () => void;
  onFocusMode?: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts({
  onLanguageToggle,
  onRestart,
  onNextTest,
  onPause,
  onSettings,
  onStats,
  onThemes,
  onFocusMode,
  disabled = false
}: KeyboardShortcutOptions) {

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    // Don't trigger shortcuts if user is typing in input elements
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const { key, ctrlKey, altKey, shiftKey, metaKey } = event;
    const isModifierPressed = ctrlKey || altKey || shiftKey || metaKey;

    // Global shortcuts with modifiers
    if (ctrlKey && !altKey && !shiftKey && !metaKey) {
      switch (key.toLowerCase()) {
        case 'l':
          event.preventDefault();
          if (onLanguageToggle) {
            // Toggle between Korean and English
            const currentLang = document.documentElement.getAttribute('data-current-lang') as Language || 'korean';
            const newLang: Language = currentLang === 'korean' ? 'english' : 'korean';
            document.documentElement.setAttribute('data-current-lang', newLang);
            onLanguageToggle(newLang);
          }
          break;
        case 'r':
          event.preventDefault();
          onRestart?.();
          break;
        case ',':
          event.preventDefault();
          onSettings?.();
          break;
        case 's':
          event.preventDefault();
          onStats?.();
          break;
        case 't':
          event.preventDefault();
          onThemes?.();
          break;
        case 'f':
          event.preventDefault();
          onFocusMode?.();
          break;
      }
    }

    // Single key shortcuts (without modifiers)
    if (!isModifierPressed) {
      switch (key) {
        case 'Escape':
          event.preventDefault();
          onRestart?.();
          break;
        case 'Tab':
          event.preventDefault();
          onNextTest?.();
          break;
        case ' ':
          // Only if not actively typing
          if (target.tagName !== 'BODY') return;
          event.preventDefault();
          onPause?.();
          break;
        case 'F11':
          event.preventDefault();
          onFocusMode?.();
          break;
      }
    }

    // Alt + key combinations
    if (altKey && !ctrlKey && !shiftKey && !metaKey) {
      switch (key.toLowerCase()) {
        case '1':
          event.preventDefault();
          // Navigate to main page
          window.location.href = '/';
          break;
        case '2':
          event.preventDefault();
          // Navigate to stats
          window.location.href = '/stats';
          break;
        case '3':
          event.preventDefault();
          // Navigate to settings
          window.location.href = '/settings';
          break;
        case '4':
          event.preventDefault();
          // Navigate to themes
          window.location.href = '/themes';
          break;
      }
    }
  }, [disabled, onLanguageToggle, onRestart, onNextTest, onPause, onSettings, onStats, onThemes, onFocusMode]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Return available shortcuts for display
  return {
    shortcuts: [
      { keys: ['Ctrl', 'L'], description: '언어 전환 (한글 ↔ 영문)' },
      { keys: ['Ctrl', 'R'], description: '테스트 재시작' },
      { keys: ['Esc'], description: '테스트 재시작' },
      { keys: ['Tab'], description: '다음 테스트' },
      { keys: ['Ctrl', ','], description: '설정 열기' },
      { keys: ['Ctrl', 'S'], description: '통계 페이지' },
      { keys: ['Ctrl', 'T'], description: '테마 페이지' },
      { keys: ['Ctrl', 'F'], description: '집중 모드 전환' },
      { keys: ['F11'], description: '집중 모드 전환' },
      { keys: ['Alt', '1'], description: '메인 페이지' },
      { keys: ['Alt', '2'], description: '통계 페이지' },
      { keys: ['Alt', '3'], description: '설정 페이지' },
      { keys: ['Alt', '4'], description: '테마 페이지' },
      { keys: ['Space'], description: '일시정지/재개' }
    ]
  };
}

// Hook for focus mode
export function useFocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(prev => {
      const newMode = !prev;
      
      // Apply focus mode styles
      if (newMode) {
        document.body.classList.add('focus-mode');
        document.documentElement.classList.add('focus-mode');
      } else {
        document.body.classList.remove('focus-mode');
        document.documentElement.classList.remove('focus-mode');
      }
      
      return newMode;
    });
  }, []);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      document.body.classList.remove('focus-mode');
      document.documentElement.classList.remove('focus-mode');
    };
  }, []);

  return {
    isFocusMode,
    toggleFocusMode
  };
}

// Accessibility improvements
export function useAccessibility() {
  useEffect(() => {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = '메인 콘텐츠로 바로가기';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50';
    skipLink.setAttribute('data-skip-link', 'true');
    
    // Insert at the beginning of body
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID if not exists
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
    }

    // Clean up on unmount
    return () => {
      const existingSkipLink = document.querySelector('[data-skip-link]');
      if (existingSkipLink) {
        existingSkipLink.remove();
      }
    };
  }, []);

  // Screen reader announcements
  const announce = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return { announce };
}

