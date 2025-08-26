'use client';

import Link from 'next/link';
import { IoHeart, IoCode, IoGlobe } from 'react-icons/io5';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
              <span className="font-semibold text-gray-900">Wollu Life</span>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              사용자 중심의 타자연습 플랫폼. 재미있고 효과적인 타이핑 학습을 통해 
              여러분의 타자 실력을 향상시켜보세요.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">빠른 링크</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/stats" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  통계 및 분석
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  설정
                </Link>
              </li>
              <li>
                <Link href="/themes" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  테마 갤러리
                </Link>
              </li>
              <li>
                <Link href="/stealth" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  은밀 모드
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">주요 기능</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <IoGlobe className="w-4 h-4" />
                <span>한글/영문 타자연습</span>
              </li>
              <li className="flex items-center space-x-2">
                <IoCode className="w-4 h-4" />
                <span>티어 시스템</span>
              </li>
              <li className="flex items-center space-x-2">
                <IoHeart className="w-4 h-4" />
                <span>AI 맞춤 조언</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>© 2024 Wollu Life. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">
                Made with <IoHeart className="w-3 h-3 inline text-red-500" /> for typing enthusiasts
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}