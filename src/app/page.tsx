'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SummaryCard from '@/components/card/SummaryCard';
import ConsultCard from '@/components/card/ConsultCard';
import { Search, X, ChevronDown, Plus } from 'lucide-react';

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
  const { isAuthenticated, isLoading } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  // 학생 등록 모달 상태
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentGender, setStudentGender] = useState('');
  const [studentSchool, setStudentSchool] = useState('');
  const [studentGrade, setStudentGrade] = useState('');

  // 컨설턴트 등록 모달 상태
  const [isConsultantModalOpen, setIsConsultantModalOpen] = useState(false);
  const [consultantName, setConsultantName] = useState('');
  const [consultantRole, setConsultantRole] = useState('');
  const [consultantPhone, setConsultantPhone] = useState('');
  const [consultantEmail, setConsultantEmail] = useState('');

  // 샘플 컨설턴트 데이터
  const consultants = [
    { id: 1, name: '김선생', role: '수석 컨설턴트', students: 20, rating: 4.8 },
    { id: 2, name: '이선생', role: '선임 컨설턴트', students: 18, rating: 4.6 },
    { id: 3, name: '박선생', role: '컨설턴트', students: 15, rating: 4.5 },
    { id: 4, name: '최선생', role: '주임 컨설턴트', students: 22, rating: 4.9 },
    { id: 5, name: '정선생', role: '컨설턴트', students: 17, rating: 4.7 },
    { id: 6, name: '강선생', role: '선임 컨설턴트', students: 19, rating: 4.8 },
    { id: 7, name: '조선생', role: '컨설턴트', students: 16, rating: 4.4 },
    { id: 8, name: '윤선생', role: '수석 컨설턴트', students: 21, rating: 4.9 },
    { id: 9, name: '장선생', role: '선임 컨설턴트', students: 18, rating: 4.7 },
  ];

  // 검색어로 컨설턴트 필터링
  const filteredConsultants = consultants.filter((consultant) =>
    consultant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // 비로그인 시 랜딩 페이지 표시
  if (!isAuthenticated) {
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

  // 로그인 시 대시보드 표시
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-50 flex justify-center overflow-y-auto" style={{ scrollBehavior: 'auto' }}>
        <div className="max-w-[1200px] w-full px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">대치입시학원</h1>
            <h3 className="text-lg text-gray-600">입시연구소 소속 컨설턴트와 담당 학생을 관리합니다.</h3>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <SummaryCard title="전체 컨설턴트" count={8}/>
            <SummaryCard title="전체 학생" detail="평균 19.5명/컨설턴트" count={156}/>
            <SummaryCard title="미배정 학생" count={12}/>
            <SummaryCard title="이번 달 컨설팅" count={89} detail="전월 대비 +12%" unit="건"/>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-[400px]">
              <input
                type="text"
                placeholder="컨설턴트 이름을 입력하세요."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsConsultantModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                신규 컨설턴트 등록
              </button>
              <button
                onClick={() => setIsStudentModalOpen(true)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                학생 등록
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {filteredConsultants.map((consultant) => (
              <ConsultCard
                key={consultant.id}
                consultantName={consultant.name}
                consultantRole={consultant.role}
                numAssignedStudent={consultant.students}
                starRatio={consultant.rating}
                onViewStudents={() => router.push(`/consultant/${consultant.id}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 학생 등록 모달 */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsStudentModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-8 pb-0">
              <h2 className="text-2xl font-bold text-gray-900">학생 등록하기</h2>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  placeholder="김학생"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* 성별 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                <div className="relative">
                  <select
                    value={studentGender}
                    onChange={(e) => setStudentGender(e.target.value)}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">선택하세요</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 학교 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">학교</label>
                <input
                  type="text"
                  placeholder="소속 학교를 입력하세요"
                  value={studentSchool}
                  onChange={(e) => setStudentSchool(e.target.value)}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* 학년 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">학년</label>
                <div className="relative">
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">선택하세요</option>
                    <option value="1">고1</option>
                    <option value="2">고2</option>
                    <option value="3">고3</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 등록하기 버튼 */}
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="w-full py-4 bg-gray-200 text-gray-500 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 컨설턴트 등록 모달 */}
      {isConsultantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsConsultantModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-8 pb-0">
              <h2 className="text-2xl font-bold text-gray-900">신규 컨설턴트 등록</h2>
              <button
                onClick={() => setIsConsultantModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  placeholder="컨설턴트 이름을 입력하세요"
                  value={consultantName}
                  onChange={(e) => setConsultantName(e.target.value)}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* 직급 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">직급</label>
                <div className="relative">
                  <select
                    value={consultantRole}
                    onChange={(e) => setConsultantRole(e.target.value)}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">선택하세요</option>
                    <option value="senior">수석 컨설턴트</option>
                    <option value="lead">선임 컨설턴트</option>
                    <option value="chief">주임 컨설턴트</option>
                    <option value="consultant">컨설턴트</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 연락처 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={consultantPhone}
                  onChange={(e) => setConsultantPhone(e.target.value)}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={consultantEmail}
                  onChange={(e) => setConsultantEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* 등록하기 버튼 */}
              <button
                onClick={() => setIsConsultantModalOpen(false)}
                className="w-full py-4 bg-gray-200 text-gray-500 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>

  );
}
