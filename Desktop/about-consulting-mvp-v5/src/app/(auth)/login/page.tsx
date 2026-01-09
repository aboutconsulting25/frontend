'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store';
import { authService } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      setToken(response.access_token);
      setUser(response.user || { id: '1', name: '김수현', email, role: 'consultant' });
      router.push('/consultant');
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[360px] px-6">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/images/logo-signature.png"
            alt="About Consulting"
            width={200}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[12px] text-gray-600 mb-1.5">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full h-10 px-3 text-[13px] border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[12px] text-gray-600 mb-1.5">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full h-10 px-3 text-[13px] border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-[12px] text-error">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white text-[13px] font-medium rounded transition-colors"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* Helper Text */}
        <p className="mt-6 text-center text-[12px] text-gray-500">
          테스트: 아무 이메일/비밀번호로 로그인 가능
        </p>
      </div>
    </div>
  );
}
