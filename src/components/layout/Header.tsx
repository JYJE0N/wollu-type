'use client';

import { useState } from 'react';
import { IoStatsChart, IoSettings, IoColorPalette, IoLanguage } from 'react-icons/io5';
import Link from 'next/link';
import { Language } from '@/types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Wollu Life</span>
          </Link>

          {/* Center - Language Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onLanguageChange('korean')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === 'korean'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              한글
            </button>
            <button
              onClick={() => onLanguageChange('english')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === 'english'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              ENG
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              href="/stats"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              onMouseEnter={() => setActiveMenu('stats')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <IoStatsChart className="w-5 h-5" />
              <span className="text-sm font-medium">통계</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              onMouseEnter={() => setActiveMenu('settings')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <IoSettings className="w-5 h-5" />
              <span className="text-sm font-medium">설정</span>
            </Link>

            <Link
              href="/themes"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              onMouseEnter={() => setActiveMenu('themes')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <IoColorPalette className="w-5 h-5" />
              <span className="text-sm font-medium">테마</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-center space-x-6 text-xs text-gray-500">
          <span><kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">Tab</kbd> 다음 테스트</span>
          <span><kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">Esc</kbd> 재시작</span>
          <span><kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">Ctrl+L</kbd> 언어 변경</span>
        </div>
      </div>
    </header>
  );
}