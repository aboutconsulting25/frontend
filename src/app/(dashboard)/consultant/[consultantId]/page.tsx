'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Search, ChevronDown, X } from 'lucide-react';

// 샘플 컨설턴트 데이터
const consultantsData: Record<string, { name: string; role: string }> = {
  '1': { name: '김선생', role: '수석 컨설턴트' },
  '2': { name: '이선생', role: '선임 컨설턴트' },
  '3': { name: '박선생', role: '컨설턴트' },
  '4': { name: '최선생', role: '주임 컨설턴트' },
  '5': { name: '정선생', role: '컨설턴트' },
  '6': { name: '강선생', role: '선임 컨설턴트' },
  '7': { name: '조선생', role: '컨설턴트' },
  '8': { name: '윤선생', role: '수석 컨설턴트' },
  '9': { name: '장선생', role: '선임 컨설턴트' },
};

// 샘플 학생 데이터
const sampleStudents = [
  { id: 1, name: '오정민', date: '2022.10.07', grade: '고3', track: '인문', gpa: 4.04, mockExam: '2등급', region: '서울 강남구', image: '/images/student1.jpg' },
  { id: 2, name: '오정민', date: '2022.10.07', grade: '고3', track: '인문', gpa: 4.04, mockExam: '2등급', region: '서울 강남구', image: '/images/student2.jpg' },
  { id: 3, name: '오정민', date: '2022.10.07', grade: '고3', track: '인문', gpa: 4.04, mockExam: '2등급', region: '서울 강남구', image: '/images/student3.jpg' },
  { id: 4, name: '오정민', date: '2022.10.07', grade: '고3', track: '인문', gpa: 4.04, mockExam: '2등급', region: '서울 강남구', image: '' },
  { id: 5, name: '오정민', date: '2022.10.07', grade: '고3', track: '인문', gpa: 4.04, mockExam: '2등급', region: '서울 강남구', image: '' },
  { id: 6, name: '오정민', date: '2022.10.07', grade: '고3', track: '인문', gpa: 4.04, mockExam: '2등급', region: '서울 강남구', image: '' },
  { id: 7, name: '오정민', date: '2022.10.07', grade: '고3', track: '인문', gpa: 4.04, mockExam: '2등급', region: '서울 강남구', image: '' },
  { id: 8, name: '오정민', date: '2022.10.07', grade: '고3', track: '인문', gpa: 4.04, mockExam: '2등급', region: '서울 강남구', image: '' },
];

const consultingTabs = [
  { id: 'goip', label: '고입컨설팅' },
  { id: 'general', label: '일반컨설팅' },
  { id: 'susi', label: '수시컨설팅' },
  { id: 'jeongsi', label: '정시컨설팅' },
  { id: 'allcare', label: '올케어컨설팅' },
];

const gradeTabs = ['고1', '고2', '고3'];

export default function ConsultantDetailPage() {
  const params = useParams();
  const consultantId = params.consultantId as string;
  const consultant = consultantsData[consultantId] || { name: '컨설턴트', role: '컨설턴트' };

  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [trackFilter, setTrackFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'pdf' | 'image'>('pdf');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [university1, setUniversity1] = useState('');
  const [major1, setMajor1] = useState('');
  const [university2, setUniversity2] = useState('');
  const [major2, setMajor2] = useState('');
  const [university3, setUniversity3] = useState('');
  const [major3, setMajor3] = useState('');

  // 필터링된 학생 목록
  const filteredStudents = sampleStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = !gradeFilter || student.grade === gradeFilter;
    const matchesTrack = !trackFilter || student.track === trackFilter;
    return matchesSearch && matchesGrade && matchesTrack;
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-50 flex justify-center overflow-y-auto">
        <div className="max-w-[1100px] w-full px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{consultant.name} 담당 학생</h1>
            <p className="text-base text-gray-500">컨설턴트의 담당 학생을 관리합니다.</p>
          </div>

          {/* Consulting Type Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {consultingTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              생기부 등록하기
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-[380px]">
              <input
                type="text"
                placeholder="컨설턴트 이름을 입력하세요."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Dropdown Filters */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="latest">최신 순</option>
                <option value="name">이름 순</option>
                <option value="gpa">성적 순</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">계열</option>
                <option value="인문">인문</option>
                <option value="자연">자연</option>
                <option value="예체능">예체능</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">학교</option>
                <option value="school1">휘문고</option>
                <option value="school2">서울고</option>
                <option value="school3">단대부고</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Grade Tabs */}
            <div className="flex items-center ml-auto">
              {gradeTabs.map((grade, index) => (
                <button
                  key={grade}
                  onClick={() => setGradeFilter(gradeFilter === grade ? '' : grade)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    gradeFilter === grade
                      ? 'text-primary-500'
                      : 'text-gray-500 hover:text-gray-700'
                  } ${index < gradeTabs.length - 1 ? 'border-r border-gray-300' : ''}`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">학생명</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">학년</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">계열</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">평균 내신 성적</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">최근 모의고사</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">지역</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {student.image ? (
                            <Image
                              src={student.image}
                              alt={student.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-400">{student.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-primary-500 font-medium">{student.grade}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">{student.track}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{student.gpa}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{student.mockExam}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{student.region}</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/consultant/${consultantId}/student/${student.id}`}
                        className="text-primary-500 hover:text-primary-600 font-medium text-sm"
                      >
                        관리하기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 생기부 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-2xl font-bold text-gray-900">생활기록부 등록하기</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mt-6">
              <button
                onClick={() => setModalTab('pdf')}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  modalTab === 'pdf'
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                PDF
              </button>
              <button
                onClick={() => setModalTab('image')}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  modalTab === 'image'
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                이미지
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <div className="relative">
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">선택하세요</option>
                    <option value="김학생">김학생</option>
                    <option value="이학생">이학생</option>
                    <option value="박학생">박학생</option>
                    <option value="최학생">최학생</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 계열 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">계열</label>
                <div className="relative">
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">선택하세요</option>
                    <option value="인문">인문</option>
                    <option value="자연">자연</option>
                    <option value="예체능">예체능</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 첫 번째 희망 대학/학과 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">첫 번째 희망 대학/학과</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="대학을 입력하세요"
                    value={university1}
                    onChange={(e) => setUniversity1(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="학과를 입력하세요"
                    value={major1}
                    onChange={(e) => setMajor1(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 두 번째 희망 대학/학과 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">두 번째 희망 대학/학과</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="대학을 입력하세요"
                    value={university2}
                    onChange={(e) => setUniversity2(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="학과를 입력하세요"
                    value={major2}
                    onChange={(e) => setMajor2(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 세 번째 희망 대학/학과 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">세 번째 희망 대학/학과</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="대학을 입력하세요"
                    value={university3}
                    onChange={(e) => setUniversity3(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="학과를 입력하세요"
                    value={major3}
                    onChange={(e) => setMajor3(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
