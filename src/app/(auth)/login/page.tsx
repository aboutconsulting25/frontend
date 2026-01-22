'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [code, setCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 아무 코드나 입력해도 로그인 가능
    setTimeout(() => {
      setToken('demo-token');
      setUser({
        id: '1',
        name: '김대표',
        email: 'demo@example.com',
        role: 'admin',
        isAuthenticated: true,
      });
      router.push('/');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-black.png"
              alt="About Consulting"
              width={100}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">로그인</span>
            <div className="w-10 h-10 rounded-full bg-gray-200" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center py-20">
        <div className="w-full max-w-[600px] mx-4">
          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-sm p-12">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              로그인
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 text-center mb-10">
              어바웃컨설팅의 서비스를 이용하시려면 발급된 코드가 필요합니다.
            </p>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code Input */}
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="코드를 입력하세요"
                className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white text-base font-medium rounded-lg transition-colors"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>

              {/* Options Row */}
              <div className="flex items-center justify-between pt-2">
                {/* Remember Me */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border-gray-300 rounded text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">로그인 유지</span>
                </label>

                {/* Find Code Link */}
                <Link
                  href="#"
                  className="text-sm text-gray-600 underline hover:text-gray-900"
                >
                  코드 찾기
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
