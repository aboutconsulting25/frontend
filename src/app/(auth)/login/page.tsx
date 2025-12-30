'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore, getDashboardRoute } from '@/store/authStore';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, user, isAuthenticated } = useAuthStore();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated && user) {
      router.push(getDashboardRoute(user.role));
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login(email, password);
    if (success) {
      const { user } = useAuthStore.getState();
      if (user) {
        router.push(getDashboardRoute(user.role));
      }
    }
  };

  // Demo accounts for testing
  const demoAccounts = [
    { role: '관리자', email: 'admin@aboutconsulting.kr' },
    { role: '영업관리자', email: 'sales@aboutconsulting.kr' },
    { role: '컨설턴트', email: 'consultant@aboutconsulting.kr' },
    { role: '학생', email: 'jungmin@student.kr' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-white.png"
              alt="About Consulting"
              width={180}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            AI 기반 생활기록부<br />
            분석 서비스
          </h1>
          <p className="text-blue-100 text-lg">
            학생의 생활기록부를 AI가 분석하고,<br />
            전문 컨설턴트가 맞춤형 리포트를 제공합니다.
          </p>
        </div>
        <p className="text-blue-200 text-sm">
          © 2024 About Consulting. All rights reserved.
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Image
              src="/images/logo.png"
              alt="About Consulting"
              width={180}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
            <p className="mt-2 text-gray-500">
              계정에 로그인하여 서비스를 이용하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3"
              isLoading={isLoading}
            >
              로그인
            </Button>
          </form>

          {/* Demo accounts info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">
              테스트 계정 (비밀번호: password123)
            </p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('password123');
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-blue-600">{account.role}</span>
                  <span className="text-gray-500 ml-2">{account.email}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <a href="#" className="text-blue-600 hover:underline">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
