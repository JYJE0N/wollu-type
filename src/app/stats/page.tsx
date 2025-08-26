'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Layout from '@/components/layout/Layout';
import TierDisplay from '@/components/ui/TierDisplay';
import { useUserStore } from '@/stores/userStore';
import { getTierInsights } from '@/utils/tierSystem';
import { Language } from '@/types';
import { motion } from 'framer-motion';

export default function StatsPage() {
  const [language, setLanguage] = useState<Language>('korean');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const { stats, recentTests, currentTier } = useUserStore();

  // Prepare chart data
  const chartData = recentTests.slice(0, 20).reverse().map((test, index) => ({
    test: index + 1,
    wpm: Math.round(test.wpm),
    cpm: Math.round(test.cpm),
    accuracy: Math.round(test.accuracy),
    date: new Date(Date.now() - (19 - index) * 24 * 60 * 60 * 1000).toLocaleDateString()
  }));

  const insights = getTierInsights(stats, language);

  const statCards = [
    {
      title: '평균 타속',
      value: language === 'korean' 
        ? `${Math.round(stats.averageCpm)} CPM`
        : `${Math.round(stats.averageWpm)} WPM`,
      change: '+12%',
      color: 'bg-blue-500',
      icon: '⚡'
    },
    {
      title: '평균 정확도',
      value: `${Math.round(stats.averageAccuracy)}%`,
      change: '+5%',
      color: 'bg-green-500',
      icon: '🎯'
    },
    {
      title: '총 연습 시간',
      value: `${Math.round(stats.totalPracticeTime / 60)}시간`,
      change: `+${Math.round(stats.totalPracticeTime % 60)}분`,
      color: 'bg-purple-500',
      icon: '⏱️'
    },
    {
      title: '완료한 테스트',
      value: `${stats.totalTests}회`,
      change: 'this week',
      color: 'bg-orange-500',
      icon: '📊'
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">통계 및 분석</h1>
            <p className="text-gray-600 mt-2">타이핑 실력 향상을 한눈에 확인하세요</p>
          </div>
          
          <div className="flex space-x-4">
            {/* Language Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('korean')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  language === 'korean' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                한글
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  language === 'english' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                ENG
              </button>
            </div>

            {/* Time Range */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'all')}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">최근 1주일</option>
              <option value="month">최근 1개월</option>
              <option value="all">전체</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-green-600 mt-1">{card.change}</p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tier Display */}
        {currentTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <TierDisplay language={language} />
          </motion.div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">타이핑 속도 추이</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="test" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={language === 'korean' ? 'cpm' : 'wpm'} 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name={language === 'korean' ? 'CPM' : 'WPM'}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Accuracy Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">정확도 추이</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="test" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="accuracy" fill="#10b981" name="정확도 (%)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Insights and Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 맞춤 조언</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 테스트 기록</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">날짜</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">
                    {language === 'korean' ? 'CPM' : 'WPM'}
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">정확도</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">시간</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.slice(0, 10).map((test, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-gray-600">
                      {new Date(Date.now() - index * 60000).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 font-semibold">
                      {Math.round(language === 'korean' ? test.cpm : test.wpm)}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        test.accuracy >= 95 ? 'bg-green-100 text-green-800' :
                        test.accuracy >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Math.round(test.accuracy)}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {Math.round(test.duration)}초
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}