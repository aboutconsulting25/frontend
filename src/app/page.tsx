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
    <div className="min-h-screen bg-[#F6F8FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
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
      <section className="py-20 bg-[#F6F8FA]">
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
            <Image
              src="/images/dashboard-preview.png"
              alt="대시보드 미리보기"
              width={900}
              height={600}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-[#F6F8FA]">
        <div className="max-w-[1200px] mx-auto px-6 relative min-h-[500px]">
          {/* Quote 1 - Top Left */}
          <div className="absolute left-[10%] top-[10%]">
            <div className="flex flex-col items-start">
              <svg className="w-12 h-12 text-blue-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <div className="bg-white rounded-lg px-6 py-4 shadow-sm max-w-sm">
                <p className="text-gray-700 font-medium">
                  "자료 정리에 시간을 쓰느라 판단에 따른 코칭에 집중하기 어려워요"
                </p>
              </div>
            </div>
          </div>

          {/* Quote 2 - Top Right */}
          <div className="absolute right-[10%] top-[25%]">
            <div className="flex flex-col items-end">
              <svg className="w-12 h-12 text-blue-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <div className="bg-white rounded-lg px-6 py-4 shadow-sm max-w-xs">
                <p className="text-gray-700 font-medium">
                  "컨설턴트마다 말이 다 달라요."
                </p>
              </div>
            </div>
          </div>

          {/* Quote 3 - Bottom Left */}
          <div className="absolute left-[15%] top-[55%]">
            <div className="flex flex-col items-start">
              <svg className="w-12 h-12 text-blue-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <div className="bg-white rounded-lg px-6 py-4 shadow-sm max-w-sm">
                <p className="text-gray-700 font-medium">
                  "자료 정리에 시간을 쓰느라 판단에 따른 코칭에 집중하기 어려워요"
                </p>
              </div>
            </div>
          </div>

          {/* Quote 4 - Bottom Right */}
          <div className="absolute right-[10%] top-[70%]">
            <div className="flex flex-col items-end">
              <svg className="w-12 h-12 text-blue-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M19 21V11l-6-4" />
                <path d="M9 9v.01" />
                <path d="M9 12v.01" />
                <path d="M9 15v.01" />
                <path d="M9 18v.01" />
              </svg>
              <div className="bg-white rounded-lg px-6 py-4 shadow-sm max-w-xs">
                <p className="text-gray-700 font-medium">
                  "수업도 하고 전략도 설계해야 해요."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Quote Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            "그래서 필요한 건 <span className="text-primary-500">기준</span>과 <span className="text-primary-500">액션</span>"
          </h2>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            <span className="text-gray-900 font-extrabold">어바웃컨설팅</span>과 함께하는 기관
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <Image
              src="/images/galois_consulting_logo.png"
              alt="갈루아컨설팅"
              width={280}
              height={262}
              className="w-auto h-auto max-w-[200px]"
            />
            <Image
              src="/images/galois_consulting_logo.png"
              alt="갈루아컨설팅"
              width={280}
              height={262}
              className="w-auto h-auto max-w-[200px]"
            />
            <Image
              src="/images/galois_consulting_logo.png"
              alt="갈루아컨설팅"
              width={280}
              height={262}
              className="w-auto h-auto max-w-[200px]"
            />
            <Image
              src="/images/galois_consulting_logo.png"
              alt="갈루아컨설팅"
              width={280}
              height={262}
              className="w-auto h-auto max-w-[200px]"
            />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-[#F6F8FA]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            실제 사용자들의 생생한 후기로 증명합니다
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Review 1 */}
            <div className="bg-[#FFFFFF80] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h3 className="font-bold text-gray-900 mb-4">김** (학부모)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                이거 써봤는데 꽤 괜찮아요. 스크립트는 정리할 때나 뒷부분 들다가 앞 내용이 기억 안 날 때 유용해요. 특히, 중간중간 퀴즈로 내용을 점검할 수 있는 기능이 정말 좋아요. 제일 만족스러웠던 건 챗봇인데, 일반 챗봇은 구글에서 정보를 긁어오는 느낌이라면, 빌리브 챗봇은 강의 내용을 기반으로 답변해 주고, 참고해야 할 시간까지 알려줘서 강의 이해에 훨씬 도움이 돼요.
              </p>
            </div>
            {/* Review 2 */}
            <div className="bg-[#FFFFFF80] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h3 className="font-bold text-gray-900 mb-4">김** (학생)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                이거 써봤는데 꽤 괜찮아요. 스크립트는 정리할 때나 뒷부분 들다가 앞 내용이 기억 안 날 때 유용해요. 특히, 중간중간 퀴즈로 내용을 점검할 수 있는 기능이 정말 좋아요. 제일 만족스러웠던 건 챗봇인데, 일반 챗봇은 구글에서 정보를 긁어오는 느낌이라면, 빌리브 챗봇은 강의 내용을 기반으로 답변해 주고, 참고해야 할 시간까지 알려줘서 강의 이해에 훨씬 도움이 돼요.
              </p>
            </div>
            {/* Review 3 */}
            <div className="bg-[#FFFFFF80] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h3 className="font-bold text-gray-900 mb-4">김** (컨설턴트)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                이거 써봤는데 꽤 괜찮아요. 스크립트는 정리할 때나 뒷부분 들다가 앞 내용이 기억 안 날 때 유용해요. 특히, 중간중간 퀴즈로 내용을 점검할 수 있는 기능이 정말 좋아요. 제일 만족스러웠던 건 챗봇인데, 일반 챗봇은 구글에서 정보를 긁어오는 느낌이라면, 빌리브 챗봇은 강의 내용을 기반으로 답변해 주고, 참고해야 할 시간까지 알려줘서 강의 이해에 훨씬 도움이 돼요.
              </p>
            </div>
            {/* Review 4 */}
            <div className="bg-[#FFFFFF80] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h3 className="font-bold text-gray-900 mb-4">김** (학원 원장)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                이거 써봤는데 꽤 괜찮아요. 스크립트는 정리할 때나 뒷부분 들다가 앞 내용이 기억 안 날 때 유용해요. 특히, 중간중간 퀴즈로 내용을 점검할 수 있는 기능이 정말 좋아요. 제일 만족스러웠던 건 챗봇인데, 일반 챗봇은 구글에서 정보를 긁어오는 느낌이라면, 빌리브 챗봇은 강의 내용을 기반으로 답변해 주고, 참고해야 할 시간까지 알려줘서 강의 이해에 훨씬 도움이 돼요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnosis Feature Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Section Label */}
          <p className="text-primary-500 font-semibold text-center mb-4">진단</p>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            생기부를 업로드하면 AI가 강점과 리스트 등을 정리해줘요
          </h2>

          {/* University Recommendation Table */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-medium text-gray-600 text-center">학교/학과</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600 text-center">학교/학과 전형 판단</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600 text-center">판단</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">성균관대/글로벌리더학부</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">종합전형</td>
                    <td className="px-4 py-3 text-sm text-primary-500 font-medium text-center">적정</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">한양대/정치외교학과</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">교과전형</td>
                    <td className="px-4 py-3 text-sm text-primary-500 font-medium text-center">적정</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">경희대/사학과</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">정시</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">소신</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">이화여자대학교/정치외교학과</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">종합전형</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">소신</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">고려대/정치외교학과</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">교과전형</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">상향</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">중앙대/정치국제학과</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">종합전형</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">상향</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-gray-500 text-center mb-16">
            대학/학과를 적정, 소신, 상향이라는 판단 기준에 맞춘 추천
          </p>

          {/* Strength & Weakness Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">
            {/* 강점 요약 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">강점 요약</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>1. 국어 과목 1등급으로 강점 확인하였으며 유지하길 바람.</li>
                <li>2. 사회 과목 2등급으로 강점 확인하였으나 앞으로 1등급으로 상승하길 바람.</li>
                <li>3. 이과임에도 불구하고 수학 4등급으로 다음학기 3등급대 진입 필수</li>
              </ul>
            </div>
            {/* 약점 요약 */}
            <div className="bg-sky-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">약점 요약</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>1. 이과임에도 불구하고 수학 4등급으로 다음학기 3등급대 진입 필수</li>
                <li>2. 진로관련 심화학습 및 활동 필요</li>
                <li>3. 이과임에도 불구하고 수학 4등급으로 다음학기 3등급대 진입 필수</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-500 text-center">
            현재 학생의 강점과 약점을 한눈에 파악하도록 요약 카드 제공
          </p>
        </div>
      </section>

      {/* 총평 Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* 총평 Card */}
          <div className="max-w-4xl mx-auto bg-[#F6F8FA] rounded-2xl p-8 shadow-sm border border-[#BCD0DC">
            <h3 className="text-xl font-bold text-gray-900 mb-4">총평</h3>
            <div className="border-t border-[#D8D8D8] pt-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                민채 학생이 제시한 목표 대학과 학과 6개를 토대로 현재까지의 학업 성취도와 입시 데이터를 종합적으로 분석해본 결과입니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                우선 이화여대 뇌인지과학과, 한양대 생명공학과, 서강대 심리학과, 중앙대 생명공학대학은 민채 학생의 현재 성적과 비교했을 때 상향 지원으로 분류됩니다. 이는 합격 가능성이 아예 없다는 뜻이 아니라, 추가적인 성적 향상이나 비교과 활동, 면접 준비 등에 있어 전략적인 접근과 더 많은 노력이 필요한 대학이라는 의미입니다. 민채 학생이 충분히 성장 가능성이 있는 만큼, 이 목표를 계속 유지하는 것은 아주 좋습니다. 다만, 이 네 곳은 일정 수준의 리스크를 동반한다는 점을 염두에 두고 지원 전략을 짜는 것이 중요합니다.
              </p>
            </div>
          </div>

          {/* 총평 작성 버튼 */}
          <div className="text-center mt-12">
            <h4 className="text-xl font-bold text-gray-900">
              학생의 모든 학업 데이터를 기준으로 총평 작성
            </h4>
          </div>
        </div>
      </section>

      {/* 전략 Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Section Label */}
          <div className="flex justify-center mb-4">
            <span className="px-4 py-2 bg-blue-50 text-primary-500 font-semibold rounded-full text-sm">
              전략
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            전형·학과 적합도와 시나리오를 제시해요
          </h2>

          {/* 수학 역량 강화 Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
            {/* 체크마크와 제목 */}
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-lg font-medium text-gray-900">수학 역량 강화 방안이 필요합니다.</span>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-200 mb-6" />

            {/* 설명 텍스트 */}
            <p className="text-gray-600 leading-relaxed mb-8">
              2028 수능 체제에서도 컴퓨터공학과는 수학역량을 필수로 요구합니다. 고등학교 2학년 1학기까지 3등급대 도달을 목표로 단계적 학습이 중요합니다. 현재 정성현 학생이 속한 성적대의 성적향상 방안은 아래와 같습니다.
            </p>
          </div>
            {/* 3개 버튼 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="py-4 px-6 border border-primary-500 text-primary-500 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                중학교 과정부터 개념 구멍 매우기
              </button>
              <button className="py-4 px-6 border border-primary-500 text-primary-500 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                문제 유형별 반복 학습
              </button>
              <button className="py-4 px-6 border border-primary-500 text-primary-500 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                주 3회 이상 꾸준한 수학 학습시간 확보
              </button>
            </div>
          {/* 설명 텍스트 */}
          <p className="text-center mt-10 text-gray-900 font-bold text-lg mb-16">
            희망 전공에 맞춘 성적 강화 방안 제시
          </p>

          {/* 프로젝트 추천 Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
            {/* 체크마크와 제목 */}
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-lg font-medium text-gray-900">정보, 코딩 실력을 심화시키는 프로젝트를 추천합니다.</span>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-200 mb-6" />

            {/* 설명 텍스트 */}
            <p className="text-gray-600 leading-relaxed mb-4">
              정성현 학생은 정보 과목에서 A등급을 받으며 프로그래밍 기초 소양과 알고리즘 이해도에서 강점을 보이고 있습니다. 이러한 강점을 학생부종합전형에서 더욱 효과적으로 드러내기 위해서는 세부능력 및 특기사항(이하 세특)에 구체적이고 전문적인 성장 과정을 기록하는 것이 매우 중요합니다. 이를 위해 심화 학습 및 심화 활동을 진행하고, 그 과정에서의 탐구 내용·문제 해결 과정·기술적 적용을 세특에 녹여내는 전략이 필요합니다. 특히 최근 대학에서는 단순히 컴퓨터 기술을 사용할 줄 아는 학생을 넘어서, 사회적 문제를 기술적으로 분석 및 해결할 수 있는 융합형 인재를 선호합니다. 따라서 심화활동으로 실제 사회문제를 데이터 기반으로 분석하고, 프로그래밍 및 알고리즘을 활용해 해결 방안을 제시하는 프로젝트를 수행하여 전공적합성은 물론 융합적 사고역량도 함께 갖출 수 있습니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              이러한 관점에서 정성현 학생의 강점과 진로 방향에 모두 부합하는 심화 프로젝트 활동을 다음과 같이 추천합니다.
            </p>

            {/* 3개 프로젝트 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 카드 1 */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-primary-500 font-bold mb-4">학교 급식 만족도 조사 데이터 분석</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  반 또는 학년 대상 급식 만족도 설문조사를 진행하고 해당 데이터를 Python의 Pandas 라이브러리를 이용하여 분석하고 시각화합니다. 평균, 최댓값, 그래프를 만들어보고 의미있는 인사이트를 도출해 내며 데이터 사이언스의 기초를 경험합니다.
                </p>
              </div>
              {/* 카드 2 */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-primary-500 font-bold mb-4">학교폭력 감지 대시보드 텍스트 데이터 분석</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  반 또는 학년 대상 급식 만족도 설문조사를 진행하고 해당 데이터를 Python의 Pandas 라이브러리를 이용하여 분석하고 시각화합니다. 평균, 최댓값, 그래프를 만들어보고 의미있는 인사이트를 도출해 내며 데이터 사이언스의 기초를 경험합니다.
                </p>
              </div>
              {/* 카드 3 */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-primary-500 font-bold mb-4">교내 에너지 낭비 감지 시스템 회귀 모델 기반 예측</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  반 또는 학년 대상 급식 만족도 설문조사를 진행하고 해당 데이터를 Python의 Pandas 라이브러리를 이용하여 분석하고 시각화합니다. 평균, 최댓값, 그래프를 만들어보고 의미있는 인사이트를 도출해 내며 데이터 사이언스의 기초를 경험합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 하단 설명 텍스트 */}
          <p className="text-center text-gray-900 font-bold text-lg">
            희망 전공에 맞춘 생기부 강화 방안 제시 → 활동 추천
          </p>
        </div>
      </section>

      {/* 실행 Section */}
      <section className="py-20 bg-[#F6F8FA00]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Section Label */}
          <div className="flex justify-center mb-4">
            <span className="px-4 py-2 bg-blue-50 text-primary-500 font-semibold rounded-full text-sm">
              전략
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            학기별 로드맵을 제공해요
          </h2>

          {/* 학습 전략 Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
            {/* 체크마크와 제목 */}
            <div className="flex items-center gap-3 mb-8">
              <svg className="w-6 h-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-lg font-medium text-gray-900">중학교 3학년 겨울방학은 고등학교 첫 내신 성적을 결정짓는 가장 중요한 준비 기간입니다.</span>
            </div>
            
            {/* 구분선 */}
            <div className="border-t border-gray-200 mb-6" />

            {/* 4개 학습 전략 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 국어 학습 전략 */}
              <div className="bg-[#FCFCFC] rounded-xl border border-[#E9E9E9] p-7">
                <h2 className="text-xl text-primary-500 font-medium mb-3">국어 학습 전략</h2>
                <p className="text-[#242424] text-regular mb-4">
                  비문학 독해 구조 잡기가 핵심입니다. 하루 2지문, 주 10지문을 목표로 꾸준히 풀면서 지문 분석 능력을 키웁니다.
                </p>
                <ul className="text-[#242424] text-regular space-y-1">
                  <li>• 문단 요약 훈련: 각 문단의 핵심 문장 찾기</li>
                  <li>• 구조 파악: 주장-근거, 문제-해결, 비교-대조</li>
                  <li>• 보건·과학 관련 책 읽기로 배경지식 쌓기</li>
                  <li>• 추천 도서: 아픔이 길이 되려면, 우리 몸 연대기</li>
                </ul>
              </div>

              {/* 영어 학습 전략 */}
              <div className="bg-[#FCFCFC] rounded-xl border border-[#E9E9E9] p-7">
                <h2 className="text-xl text-primary-500 font-meduim mb-3">영어 학습 전략</h2>
                <p className="text-[#242424] text-regular mb-4">
                  단어와 문장 해석 습관을 만드는 것이 목표입니다. 하루 20단어 + 짧은 문장 5개를 꾸준히 학습합니다.
                </p>
                <ul className="text-[#242424] text-regular space-y-1">
                  <li>• 중학 영문법 완전 정리(시제, 수동태, 관계사)</li>
                  <li>• 고1 문법 예습(준동사, 접속사, 비교급)</li>
                  <li>• 단어장: 수능 기본 어휘 3000개 목표</li>
                  <li>• 매일 짧은 영어 기사 1개 읽고 해석하기</li>
                </ul>
              </div>

              {/* 수학 학습 전략 */}
              <div className="bg-[#FCFCFC] rounded-xl border border-[#E9E9E9] p-7">
                <h4 className="text-xl text-primary-500 font-medium mb-3">수학 학습 전략</h4>
                <p className="text-[#242424] text-regular mb-4">
                  수포 여부를 결정하는 가장 중요한 2개월입니다. 중학 전 범위를 빠르게 복습하고, 고1 수학 첫 단원인 지수와 로그를 예습합니다.
                </p>
                <ul className="text-[#242424] text-regular space-y-1">
                  <li>• 중학 수학 개념 총정리(특히 방정식, 함수)</li>
                  <li>• 고1 수학 상: 지수법칙, 로그 기본 개념</li>
                  <li>• 학원 또는 인강 필수(혼자서는 어려움)</li>
                  <li>• 이 시기에 수학이 전혀 잡히지 않을 시, 플랜 B 검토 시작</li>
                </ul>
              </div>

              {/* 과학 학습 전략 */}
              <div className="bg-[#FCFCFC] rounded-xl border border-[#E9E9E9] p-7">
                <h4 className="text-xl text-primary-500 font-medium mb-3">과학 학습 전략</h4>
                <p className="text-[#242424] text-regular mb-4">
                  생명과학 중심으로 기초 다지기를 시작합니다. 세포, 유전, 생명 시스템 등 기본 개념을 익힙니다.
                </p>
                <ul className="text-[#242424] text-regular space-y-1">
                  <li>• 세포의 구조와 기능 이해</li>
                  <li>• 유전의 기본 원리 학습</li>
                  <li>• 생명과학 용어 정리 노트 만들기</li>
                  <li>• 과학 다큐멘터리 시청으로 흥미 유발</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 체크리스트 설명 */}
          <p className="text-center text-gray-900 font-bold text-xl mt-12 mb-16">
            [ 이번 달 / 이번 학기 / 방학 ] 단위로 체크리스트 작성
          </p>

          {/* 책 추천 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 책 1 */}
            <div className="bg-[#FCFCFC] rounded-xl p-6 border border-gray-200">
              <h4 className="text-primary-500 font-bold mb-4">
                &apos;코드: 하드웨어와 소프트웨어의 언어&apos;(찰스 펫졸드)
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                해당 도서는 컴퓨터가 어떻게 0과 1이라는 단순한 신호로 정보를 처리하는지, 근본적으로 어떻게 전기 신호만으로 복잡한 작업을 할 수 있는지 등 전공 기초와 관련해 탐구할 수 있는 내용이 실려 있습니다. 또한 전공 이해도와 전공에 대한 흥미를 나타내는 데 좋은 책입니다.
              </p>
            </div>

            {/* 책 2 */}
            <div className="bg-[#FCFCFC] rounded-xl p-6 border border-gray-200">
              <h4 className="text-primary-500 font-bold mb-4">
                &apos;메타버스&apos;(김상균)
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                기술의 발전이 사람에게 어떤 영향을 미치는지를 고민해 볼 수 있는 책입니다.
              </p>
            </div>

            {/* 책 3 */}
            <div className="bg-[#FCFCFC] rounded-xl p-6 border border-gray-200">
              <h4 className="text-primary-500 font-bold mb-4">
                &apos;슈퍼 인텔리전스&apos;(닉 보스트롬)
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                미래 사회에 필요한 역량과 태도를 나타내는 데 도움이 되는 책입니다.
              </p>
            </div>
          </div>

          {/* 하단 설명 */}
          <p className="text-center mt-10 text-gray-900 font-bold text-2xl">
            수행평가·탐구·독서·동아리 연결 가이드
          </p>
        </div>
      </section>

      {/* 리포트 Section */}
      <section id="report" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Section Label */}
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1 bg-blue-50 text-primary-500 font-semibold rounded-full text-sm">
              리포트
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            상세 리포트가 발행돼요
          </h2>

          {/* 아이콘 영역 */}
          <div className="flex justify-center items-center gap-8 mb-12">
            {/* 편집/외부 링크 아이콘 */}
            <div className="w-40 h-40 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white">
              <svg className="w-16 h-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>

            {/* 업로드 아이콘 */}
            <div className="w-40 h-40 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white shadow-lg">
              <svg className="w-16 h-16 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
          </div>

          {/* 설명 텍스트 */}
          <p className="text-center text-gray-900 font-medium text-lg">
            상담 전 공유용 1페이지 요약 + 상담용 상세 리포트
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            지금 어바웃컨설팅을 시작하세요
          </h2>

          {/* CTA 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 개인용 카드 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-primary-500 font-medium text-center mb-2">개인용</p>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
                지금 바로 내 로드맵을 받아보세요!
              </h3>
              <Link
                href="/login"
                className="block w-full py-4 bg-primary-500 text-white font-medium rounded-lg text-center hover:bg-primary-600 transition-colors"
              >
                신청하기
              </Link>
            </div>

            {/* 기관용 카드 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-primary-500 font-medium text-center mb-2">기관용</p>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
                상담 시간을 설명이 아닌 전략에 쓰세요!
              </h3>
              <Link
                href="/contact"
                className="block w-full py-4 bg-primary-500 text-white font-medium rounded-lg text-center hover:bg-primary-600 transition-colors"
              >
                도입 상담
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 회사 정보 Section */}
      <section className="py-12 bg-gray-200">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* 링크 메뉴 */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-6">
            <a href="#" className="hover:text-gray-900">회사 정보</a>
            <span className="text-gray-400">|</span>
            <a href="#" className="hover:text-gray-900">문의</a>
            <span className="text-gray-400">|</span>
            <a href="#" className="hover:text-gray-900">약관</a>
            <span className="text-gray-400">|</span>
            <a href="#" className="hover:text-gray-900">개인정보처리방침</a>
            <span className="text-gray-400">|</span>
            <a href="#" className="hover:text-gray-900">데이터 정책</a>
          </div>

          {/* 회사 정보 */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>대표 오정민</p>
            <p>010-6366-0415</p>
            <p>aboutconsulting25@gmail.com</p>
          </div>
        </div>
      </section>

    </div>
  );
}
