'use client';

import { ReactNode, useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Language } from '@/types';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useKeyboardShortcuts, useFocusMode, useAccessibility } from '@/hooks/useKeyboardShortcuts';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [language, setLanguage] = useState<Language>('korean');
  const router = useRouter();
  
  const { 
    isMobile, 
    isTablet, 
    isFoldable, 
    hasVirtualKeyboard, 
    screenSize, 
    orientation, 
    keyboardHeight 
  } = useMobileDetection();

  const { isFocusMode, toggleFocusMode } = useFocusMode();
  const { announce } = useAccessibility();

  // Keyboard shortcuts
  const { shortcuts } = useKeyboardShortcuts({
    onLanguageToggle: (newLanguage) => {
      setLanguage(newLanguage);
      announce(`언어가 ${newLanguage === 'korean' ? '한글' : '영어'}로 변경되었습니다.`);
    },
    onSettings: () => router.push('/settings'),
    onStats: () => router.push('/stats'),
    onThemes: () => router.push('/themes'),
    onFocusMode: toggleFocusMode,
    disabled: hasVirtualKeyboard // Disable shortcuts when virtual keyboard is active
  });

  // Store current language for shortcuts
  useEffect(() => {
    document.documentElement.setAttribute('data-current-lang', language);
  }, [language]);

  return (
    <div 
      className={`min-h-screen bg-gray-50 flex flex-col transition-all duration-300 ${
        hasVirtualKeyboard ? 'pb-0' : ''
      } ${isFocusMode ? 'focus-mode' : ''}`}
      style={{
        minHeight: hasVirtualKeyboard ? 'var(--available-height)' : '100vh'
      }}
    >
      {/* Keyboard Shortcuts Help */}
      {!isMobile && !isFocusMode && (
        <div className="fixed bottom-4 right-4 z-40">
          <details className="group">
            <summary className="list-none cursor-pointer bg-white shadow-lg rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
              ⌨️ 단축키
            </summary>
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white shadow-xl rounded-lg border border-gray-200 p-4 group-open:block hidden">
              <h4 className="font-semibold text-gray-900 mb-3">키보드 단축키</h4>
              <div className="space-y-2">
                {shortcuts.slice(0, 8).map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <div className="flex space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd key={keyIndex} className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                          {key}
                        </kbd>
                      ))}
                    </div>
                    <span className="text-gray-600">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      )}

      <Header 
        language={language} 
        onLanguageChange={setLanguage}
      />
      
      <main 
        className={`flex-1 relative transition-all duration-300 ${
          hasVirtualKeyboard ? 'overflow-hidden' : ''
        }`}
        style={{
          paddingBottom: hasVirtualKeyboard ? `${Math.max(keyboardHeight - 50, 0)}px` : '0'
        }}
      >
        <div className={`max-w-7xl mx-auto transition-all duration-300 ${
          screenSize === 'mobile' ? 'px-4 py-4' :
          screenSize === 'tablet-sm' ? 'px-6 py-6' :
          screenSize === 'tablet' ? 'px-6 py-6' :
          screenSize === 'tablet-lg' ? 'px-8 py-6' :
          'px-4 sm:px-6 lg:px-8 py-8'
        } ${hasVirtualKeyboard ? 'py-2' : ''}`}>
          {children}
        </div>
      </main>

      {/* Show footer only on desktop or when no virtual keyboard is active */}
      {!isMobile && !hasVirtualKeyboard && <Footer />}

      {/* Mobile adaptive indicators */}
      {process.env.NODE_ENV === 'development' && (isMobile || isTablet) && (
        <div className="fixed bottom-0 left-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded-tr-lg z-50">
          {screenSize} | {orientation} | {hasVirtualKeyboard ? `KB: ${keyboardHeight}px` : 'No KB'}
          {isFoldable && ' | Foldable'}
        </div>
      )}
    </div>
  );
}