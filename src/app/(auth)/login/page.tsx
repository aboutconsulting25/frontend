'use client';

import { useState, useEffect } from 'react';
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
  const [mode, setMode] = useState<'login' | 'findCode' | 'codeResult'>('login');
  const [foundCode, setFoundCode] = useState('');
  const [academyName, setAcademyName] = useState('');
  const [academyEmail, setAcademyEmail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendCode = () => {
    setIsCodeSent(true);
    setTimer(180);
  };

  const handleVerify = () => {
    setFoundCode('어바003');
    setMode('codeResult');
  };

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
            {mode === 'login' && (
              <>
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
                    <button
                      type="button"
                      onClick={() => setMode('findCode')}
                      className="text-sm text-gray-600 underline hover:text-gray-900"
                    >
                      코드 찾기
                    </button>
                  </div>
                </form>
              </>
            )}
            {mode === 'findCode' && (
              <>
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
                  코드 찾기
                </h1>

                {/* Subtitle */}
                <p className="text-gray-500 text-center mb-10">
                  발급된 코드를 찾기 위해 인증이 필요합니다.
                </p>

                {/* Find Code Form */}
                <div className="space-y-6">
                  {/* Academy Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      학원 이름
                    </label>
                    <input
                      type="text"
                      value={academyName}
                      onChange={(e) => setAcademyName(e.target.value)}
                      placeholder="학원 이름을 입력하세요"
                      className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Academy Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      학원 이메일
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={academyEmail}
                        onChange={(e) => setAcademyEmail(e.target.value)}
                        placeholder="학원 이메일을 입력하세요"
                        className="flex-1 px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={handleSendCode}
                        className="px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                      >
                        {isCodeSent ? '인증번호 재발송' : '인증번호 보내기'}
                      </button>
                    </div>
                  </div>

                  {/* Verification Code Input */}
                  {isCodeSent && (
                    <div className="relative">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="인증번호를 입력하세요"
                        className="w-full px-4 py-4 text-base border border-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900 font-medium">
                        {formatTime(timer)}
                      </span>
                    </div>
                  )}

                  {/* Verify Button */}
                  <button
                    type="button"
                    disabled={!isCodeSent}
                    onClick={handleVerify}
                    className={`w-full py-4 text-base font-medium rounded-lg transition-colors ${
                      isCodeSent
                        ? 'bg-primary-500 hover:bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    인증하기
                  </button>
                </div>
              </>
            )}
            {mode === 'codeResult' && (
              <>
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
                  코드 찾기
                </h1>

                {/* Subtitle */}
                <p className="text-gray-500 text-center mb-10">
                  버튼을 누르면 로그인 화면으로 돌아갑니다.
                </p>

                {/* Found Code */}
                <div className="text-center mb-10">
                  <span className="text-5xl font-bold text-primary-500">
                    {foundCode}
                  </span>
                </div>

                {/* Login Button */}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setIsCodeSent(false);
                    setVerificationCode('');
                    setAcademyName('');
                    setAcademyEmail('');
                  }}
                  className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white text-base font-medium rounded-lg transition-colors"
                >
                  로그인
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
