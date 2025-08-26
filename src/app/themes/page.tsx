'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useSettingsStore } from '@/stores/settingsStore';

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'default' | 'stealth' | 'nature' | 'professional' | 'custom';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

const themes: Theme[] = [
  {
    id: 'default',
    name: '기본 테마',
    description: '깔끔하고 모던한 기본 디자인',
    preview: 'Clean and modern interface',
    category: 'default',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      background: '#ffffff',
      text: '#111827',
      accent: '#10b981'
    }
  },
  {
    id: 'stealth-slack',
    name: 'Slack 모드',
    description: '업무 중에도 자연스럽게 연습',
    preview: 'Looks like Slack workspace',
    category: 'stealth',
    colors: {
      primary: '#1a73e8',
      secondary: '#5f6368',
      background: '#ffffff',
      text: '#202124',
      accent: '#34a853'
    }
  },
  {
    id: 'stealth-notion',
    name: 'Notion 모드',
    description: '메모장처럼 자연스러운 디자인',
    preview: 'Clean document interface',
    category: 'stealth',
    colors: {
      primary: '#2ea043',
      secondary: '#656d76',
      background: '#ffffff',
      text: '#24292f',
      accent: '#0969da'
    }
  },
  {
    id: 'stealth-docs',
    name: 'Google Docs 모드',
    description: '문서 작업하는 것처럼 보이는 모드',
    preview: 'Document editing interface',
    category: 'stealth',
    colors: {
      primary: '#1a73e8',
      secondary: '#5f6368',
      background: '#ffffff',
      text: '#202124',
      accent: '#ea4335'
    }
  },
  {
    id: 'dark',
    name: '다크 모드',
    description: '눈의 피로를 줄이는 어두운 테마',
    preview: 'Dark comfortable theme',
    category: 'default',
    colors: {
      primary: '#60a5fa',
      secondary: '#9ca3af',
      background: '#111827',
      text: '#f9fafb',
      accent: '#34d399'
    }
  },
  {
    id: 'nature',
    name: '자연 테마',
    description: '자연의 색상으로 편안한 느낌',
    preview: 'Nature inspired colors',
    category: 'nature',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      background: '#f0fdf4',
      text: '#064e3b',
      accent: '#fbbf24'
    }
  },
  {
    id: 'sunset',
    name: '석양 테마',
    description: '따뜻한 석양 색감의 테마',
    preview: 'Warm sunset colors',
    category: 'nature',
    colors: {
      primary: '#ea580c',
      secondary: '#78716c',
      background: '#fff7ed',
      text: '#9a3412',
      accent: '#fbbf24'
    }
  },
  {
    id: 'ocean',
    name: '바다 테마',
    description: '시원한 바다 색감의 테마',
    preview: 'Cool ocean colors',
    category: 'nature',
    colors: {
      primary: '#0891b2',
      secondary: '#64748b',
      background: '#f0f9ff',
      text: '#0c4a6e',
      accent: '#06b6d4'
    }
  },
  {
    id: 'purple',
    name: '보라 테마',
    description: '고급스러운 보라색 테마',
    preview: 'Elegant purple theme',
    category: 'default',
    colors: {
      primary: '#8b5cf6',
      secondary: '#6b7280',
      background: '#faf5ff',
      text: '#581c87',
      accent: '#a855f7'
    }
  }
];

export default function ThemesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Theme['category']>('all');
  const { theme: currentTheme, updateSettings } = useSettingsStore();

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'default', name: '기본' },
    { id: 'stealth', name: '은밀 모드' },
    { id: 'nature', name: '자연' },
    { id: 'professional', name: '프로페셔널' },
    { id: 'custom', name: '커스텀' }
  ];

  const filteredThemes = selectedCategory === 'all' 
    ? themes 
    : themes.filter(theme => theme.category === selectedCategory);

  const applyTheme = (theme: Theme) => {
    updateSettings({ theme: theme.id });
    
    // Apply CSS variables for live preview
    const root = document.documentElement;
    root.style.setProperty('--primary-500', theme.colors.primary);
    root.style.setProperty('--secondary-500', theme.colors.secondary);
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--text-primary', theme.colors.text);
    root.style.setProperty('--accent-color', theme.colors.accent);

    // Apply additional theme-specific styles
    if (theme.category === 'stealth') {
      root.classList.add('stealth-mode');
    } else {
      root.classList.remove('stealth-mode');
    }

    // Store theme data for components to use
    root.setAttribute('data-theme', theme.id);
  };

  const StealthModePreview = ({ theme }: { theme: Theme }) => {
    if (theme.id === 'stealth-slack') {
      return (
        <div className="w-full h-24 rounded-lg p-3 text-xs" style={{ backgroundColor: theme.colors.background }}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span style={{ color: theme.colors.text }}>워크스페이스</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
              <span style={{ color: theme.colors.text }}>타이핑 연습 중...</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (theme.id === 'stealth-notion') {
      return (
        <div className="w-full h-24 rounded-lg p-3 text-xs" style={{ backgroundColor: theme.colors.background }}>
          <div className="border-b pb-2 mb-2" style={{ borderColor: theme.colors.secondary + '40' }}>
            <span style={{ color: theme.colors.text }}>📝 새 페이지</span>
          </div>
          <div className="space-y-1">
            <div style={{ color: theme.colors.text }}>타이핑 연습 노트</div>
            <div style={{ color: theme.colors.secondary }}>오늘의 연습...</div>
          </div>
        </div>
      );
    }

    if (theme.id === 'stealth-docs') {
      return (
        <div className="w-full h-24 rounded-lg p-3 text-xs" style={{ backgroundColor: theme.colors.background }}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3" style={{ backgroundColor: theme.colors.primary }}></div>
            <span style={{ color: theme.colors.text }}>문서 편집 중</span>
          </div>
          <div className="space-y-1">
            <div style={{ color: theme.colors.text }}>타이핑 연습하며 실력 향상...</div>
            <div style={{ color: theme.colors.secondary }}>꾸준한 연습이 중요하다</div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-24 rounded-lg flex items-center justify-center text-xs" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
        {theme.preview}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">테마 갤러리</h1>
          <p className="text-lg text-gray-600">
            다양한 테마로 개성있는 타이핑 환경을 만들어보세요
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center">
          <div className="flex space-x-2 bg-gray-100 rounded-xl p-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as 'all' | Theme['category'])}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stealth Mode Section */}
        {(selectedCategory === 'all' || selectedCategory === 'stealth') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🕵️ 은밀 모드</h2>
              <p className="text-gray-600">
                업무용 인터페이스로 위장하여 자연스럽게 타이핑 연습을 할 수 있습니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {themes.filter(t => t.category === 'stealth').map((theme) => (
                <motion.div
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer ${
                    currentTheme === theme.id ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => applyTheme(theme)}
                >
                  <div className="p-6">
                    <StealthModePreview theme={theme} />
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                    </div>
                    {currentTheme === theme.id && (
                      <div className="mt-3 flex items-center text-sm text-blue-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        현재 적용됨
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredThemes.filter(t => t.category !== 'stealth').map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer ${
                currentTheme === theme.id ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => applyTheme(theme)}
            >
              <div className="p-6">
                {/* Color Preview */}
                <div className="w-full h-24 rounded-lg mb-4 relative overflow-hidden">
                  <div 
                    className="w-full h-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">Wollu</div>
                      <div className="text-sm opacity-90">타자연습</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 flex">
                    <div className="flex-1" style={{ backgroundColor: theme.colors.secondary }}></div>
                    <div className="flex-1" style={{ backgroundColor: theme.colors.accent }}></div>
                    <div className="flex-1" style={{ backgroundColor: theme.colors.text }}></div>
                  </div>
                </div>

                {/* Theme Info */}
                <div>
                  <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                </div>

                {/* Color Palette */}
                <div className="flex space-x-2 mt-4">
                  {Object.values(theme.colors).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Active Indicator */}
                {currentTheme === theme.id && (
                  <div className="mt-3 flex items-center text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    현재 적용됨
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Theme Creator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">커스텀 테마 만들기</h3>
          <p className="text-gray-600 mb-4">
            자신만의 독특한 색상 조합으로 전용 테마를 만들어보세요
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            테마 제작하기
          </button>
        </motion.div>

        {/* Theme Tips */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 테마 활용 팁</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>은밀 모드:</strong> 업무 시간에도 자연스럽게 타이핑 연습을 할 수 있습니다.
            </div>
            <div>
              <strong>다크 모드:</strong> 장시간 연습 시 눈의 피로를 줄여줍니다.
            </div>
            <div>
              <strong>자연 테마:</strong> 편안한 색감으로 집중력을 높일 수 있습니다.
            </div>
            <div>
              <strong>커스텀 테마:</strong> 개성을 표현하고 더욱 즐겁게 연습할 수 있습니다.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}