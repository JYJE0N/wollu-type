'use client';

import { useState, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import TypingEngine from '@/components/core/TypingEngine';
import TierDisplay from '@/components/ui/TierDisplay';
import { TypingStats, TypingSettings, Language, TextType } from '@/types';
import { useUserStore } from '@/stores/userStore';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('korean');
  const [textType, setTextType] = useState<TextType>('sentence');
  const [settings, setSettings] = useState<TypingSettings>({
    wordCount: 5,
    sentenceCount: 3,
    sentenceLength: 'medium',
    sentenceStyle: 'normal',
    ghostMode: false,
    typingEffect: true,
    countdown: true
  });

  const { updateStats, currentTier } = useUserStore();

  const handleTestComplete = useCallback((stats: TypingStats) => {
    console.log('Test completed:', stats);
    updateStats(stats);
    // Show completion modal or navigate to results
  }, [updateStats]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Wollu Life 타자연습
          </h1>
          <p className="text-lg text-gray-600">
            재미있고 효과적인 한글/영문 타이핑 연습으로 실력을 향상시켜보세요
          </p>
        </div>

        {/* Language and Type Toggle */}
        <div className="flex justify-center space-x-4">
          {/* Language Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setLanguage('korean')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                language === 'korean'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              한글
            </button>
            <button
              onClick={() => setLanguage('english')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                language === 'english'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              ENG
            </button>
          </div>

          {/* Text Type Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTextType('word')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                textType === 'word'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              단어
            </button>
            <button
              onClick={() => setTextType('sentence')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                textType === 'sentence'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              문장
            </button>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 설정</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Word/Sentence Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {textType === 'word' ? '단어' : '문장'} 개수
              </label>
              <div className="flex space-x-1">
                {[1, 3, 5, 10].map(count => (
                  <button
                    key={count}
                    onClick={() => textType === 'word' 
                      ? setSettings(prev => ({ ...prev, wordCount: count as 1 | 3 | 5 | 10 }))
                      : setSettings(prev => ({ ...prev, sentenceCount: count as 1 | 3 | 5 | 10 }))
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      (textType === 'word' ? settings.wordCount : settings.sentenceCount) === count
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    {count}개
                  </button>
                ))}
              </div>
            </div>

            {/* Sentence Length (only for sentences) */}
            {textType === 'sentence' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">문장 길이</label>
                <div className="flex space-x-1">
                  {[
                    { value: 'short', label: '단문' },
                    { value: 'medium', label: '중문' },
                    { value: 'long', label: '장문' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setSettings(prev => ({ ...prev, sentenceLength: value as 'short' | 'medium' | 'long' }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.sentenceLength === value
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing Effect Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">타이핑 효과</label>
              <button
                onClick={() => setSettings(prev => ({ ...prev, typingEffect: !prev.typingEffect }))}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.typingEffect
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                }`}
              >
                {settings.typingEffect ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Countdown Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">카운트다운</label>
              <button
                onClick={() => setSettings(prev => ({ ...prev, countdown: !prev.countdown }))}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.countdown
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                }`}
              >
                {settings.countdown ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Tier Display */}
        {currentTier && (
          <TierDisplay language={language} />
        )}

        {/* Typing Engine */}
        <TypingEngine
          key={`${language}-${textType}-${JSON.stringify(settings)}`}
          language={language}
          settings={settings}
          textType={textType}
          onComplete={handleTestComplete}
        />

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">티어</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">티어 시스템</h3>
            <p className="text-sm text-gray-600">
              브론즈부터 마스터까지, 실력에 따른 승급제로 동기부여
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">AI</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">맞춤 조언</h3>
            <p className="text-sm text-gray-600">
              AI가 분석한 약점을 바탕으로 개인화된 연습 가이드 제공
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">테마</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">다양한 테마</h3>
            <p className="text-sm text-gray-600">
              업무용 은밀모드부터 개성있는 커스텀 테마까지
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
