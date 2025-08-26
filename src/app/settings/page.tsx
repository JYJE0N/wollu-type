'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoRefresh, IoDownload, IoCloudUpload, IoVolumeHigh, IoEye, IoKeypad, IoBulb } from 'react-icons/io5';
import Layout from '@/components/layout/Layout';
import { useSettingsStore } from '@/stores/settingsStore';

export default function SettingsPage() {
  const {
    // Basic settings
    wordCount, sentenceCount, sentenceLength, sentenceStyle,
    // Advanced settings
    ghostMode, typingEffect, countdown,
    // Additional settings
    theme, soundEnabled, keyPressSound, completionSound, visualFeedback,
    showKeyboard, showLiveStats, autoAdvance, focusMode,
    // Actions
    updateSettings, resetToDefaults, exportSettings, importSettings
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'appearance' | 'sound'>('basic');
  const [importText, setImportText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const handleExportSettings = () => {
    const settingsJson = exportSettings();
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wollu-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = () => {
    if (importSettings(importText)) {
      setShowImportModal(false);
      setImportText('');
    } else {
      alert('설정 파일이 올바르지 않습니다.');
    }
  };

  const tabs = [
    { id: 'basic', name: '기본 설정', icon: IoKeypad },
    { id: 'advanced', name: '고급 설정', icon: IoBulb },
    { id: 'appearance', name: '화면 설정', icon: IoEye },
    { id: 'sound', name: '소리 설정', icon: IoVolumeHigh },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">설정</h1>
            <p className="text-gray-600 mt-2">타이핑 환경을 개인화하세요</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleExportSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <IoDownload className="w-4 h-4" />
              <span>내보내기</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <IoCloudUpload className="w-4 h-4" />
              <span>가져오기</span>
            </button>
            <button
              onClick={resetToDefaults}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <IoRefresh className="w-4 h-4" />
              <span>초기화</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'basic' | 'advanced' | 'appearance' | 'sound')}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* Basic Settings */}
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">단어 설정</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">단어 개수</label>
                      <div className="flex space-x-2">
                        {[1, 3, 5, 10].map(count => (
                          <button
                            key={count}
                            onClick={() => updateSettings({ wordCount: count as 1 | 3 | 5 | 10 })}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              wordCount === count
                                ? 'bg-blue-100 text-blue-600 border-2 border-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                            }`}
                          >
                            {count}개
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">문장 설정</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">문장 개수</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 3, 5, 10].map(count => (
                          <button
                            key={count}
                            onClick={() => updateSettings({ sentenceCount: count as 1 | 3 | 5 | 10 })}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              sentenceCount === count
                                ? 'bg-blue-100 text-blue-600 border-2 border-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                            }`}
                          >
                            {count}개
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">문장 길이</label>
                      <div className="space-y-2">
                        {[
                          { value: 'short', label: '단문' },
                          { value: 'medium', label: '중문' },
                          { value: 'long', label: '장문' }
                        ].map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => updateSettings({ sentenceLength: value as 'short' | 'medium' | 'long' })}
                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                              sentenceLength === value
                                ? 'bg-blue-100 text-blue-600 border-2 border-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">문장 스타일</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: 'normal', label: '일반' },
                      { value: 'punctuation', label: '구두점' },
                      { value: 'numbers', label: '숫자' },
                      { value: 'mixed', label: '혼합' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => updateSettings({ sentenceStyle: value as 'normal' | 'punctuation' | 'numbers' | 'mixed' })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          sentenceStyle === value
                            ? 'bg-blue-100 text-blue-600 border-2 border-blue-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">고스트 모드</h4>
                        <p className="text-sm text-gray-600">이전 기록과 대결하며 연습</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ ghostMode: !ghostMode })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          ghostMode ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            ghostMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">타이핑 효과</h4>
                        <p className="text-sm text-gray-600">키 입력 시 글로우 효과</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ typingEffect: !typingEffect })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          typingEffect ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            typingEffect ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">카운트다운</h4>
                        <p className="text-sm text-gray-600">시작 전 3초 카운트다운</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ countdown: !countdown })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          countdown ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            countdown ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">자동 진행</h4>
                        <p className="text-sm text-gray-600">테스트 완료 후 자동으로 다음</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ autoAdvance: !autoAdvance })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          autoAdvance ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            autoAdvance ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">집중 모드</h4>
                        <p className="text-sm text-gray-600">불필요한 UI 요소 숨김</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ focusMode: !focusMode })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          focusMode ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            focusMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">실시간 통계</h4>
                        <p className="text-sm text-gray-600">타이핑 중 WPM/CPM 표시</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ showLiveStats: !showLiveStats })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          showLiveStats ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            showLiveStats ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">가상 키보드</h4>
                        <p className="text-sm text-gray-600">화면 키보드 표시</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ showKeyboard: !showKeyboard })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          showKeyboard ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            showKeyboard ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">시각적 피드백</h4>
                        <p className="text-sm text-gray-600">정답/오답 색상 표시</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ visualFeedback: !visualFeedback })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          visualFeedback ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            visualFeedback ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">테마 선택</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'default', label: '기본', color: 'bg-blue-500' },
                        { value: 'dark', label: '다크', color: 'bg-gray-800' },
                        { value: 'nature', label: '자연', color: 'bg-green-500' },
                        { value: 'sunset', label: '석양', color: 'bg-orange-500' },
                        { value: 'ocean', label: '바다', color: 'bg-cyan-500' },
                        { value: 'purple', label: '보라', color: 'bg-purple-500' },
                      ].map(({ value, label, color }) => (
                        <button
                          key={value}
                          onClick={() => updateSettings({ theme: value })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            theme === value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-full h-8 ${color} rounded mb-2`} />
                          <div className="text-sm font-medium">{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sound Settings */}
            {activeTab === 'sound' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">소리 활성화</h4>
                        <p className="text-sm text-gray-600">모든 사운드 효과</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ soundEnabled: !soundEnabled })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            soundEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">키 입력 소리</h4>
                        <p className="text-sm text-gray-600">타이핑 시 키보드 소리</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ keyPressSound: !keyPressSound })}
                        disabled={!soundEnabled}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          keyPressSound && soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        } ${!soundEnabled ? 'opacity-50' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            keyPressSound && soundEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">완료 소리</h4>
                        <p className="text-sm text-gray-600">테스트 완료 시 알림음</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ completionSound: !completionSound })}
                        disabled={!soundEnabled}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          completionSound && soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        } ${!soundEnabled ? 'opacity-50' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            completionSound && soundEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-3">소리 미리보기</h4>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        키 입력 소리 테스트
                      </button>
                      <button className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        완료 소리 테스트
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">설정 가져오기</h3>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="설정 JSON을 붙여넣으세요..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleImportSettings}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  가져오기
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}