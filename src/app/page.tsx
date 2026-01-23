'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store';

// 랜딩 페이지 네비게이션 아이템
const navItems = [
  { label: '기능', href: '#features' },
  { label: '리포트 예시', href: '#report' },
  { label: '후기', href: '#reviews' },
  { label: '도입/가격', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: '문의', href: '#contact' },
];

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // 로그인 상태일 때 사용자 role에 따라 리다이렉트
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      switch (user.role) {
        case 'admin':
        case 'sales_manager':
          router.replace(`/admin/${user.id}`);
          break;
        case 'head_consultant':
        case 'consultant':
          router.replace(`/consultant/${user.id}`);
          break;
        case 'student':
          router.replace(`/student/${user.id}`);
          break;
        default:
          break;
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-neutral-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인 시 리다이렉트 중 로딩 표시
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-neutral-500">페이지 이동 중...</p>
        </div>
      </div>
    );
  }

  // 비로그인 시 랜딩 페이지 표시
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-20">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[#242424] hover:text-gray-900 font-bold transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <Link
            href="/login"
            className="px-5 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            생기부와 전형을
            <br />
            <span className="text-gray-900">'감'이 아니라 </span>
            <span className="text-primary-500">'근거'</span>
            <span className="text-gray-900">로 결정하세요.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            생기부/성적/희망진로를 입력하면 전형 적합도·보완 포인트·3년 로드맵을 자동 생성합니다.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              무료 진단 시작
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              기관 데모 요청
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative bg-gray-900 rounded-t-2xl p-2 pt-6">
              {/* Browser dots */}
              <div className="absolute top-2 left-4 flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              {/* Screenshot placeholder */}
              <div className="bg-white rounded-lg overflow-hidden">
                <Image
                  src="/images/dashboard-preview.png"
                  alt="대시보드 미리보기"
                  width={900}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Stand */}
            <div className="relative mx-auto w-32 h-8 bg-gray-300 rounded-b-lg" />
            <div className="relative mx-auto w-48 h-2 bg-gray-400 rounded-b-lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
