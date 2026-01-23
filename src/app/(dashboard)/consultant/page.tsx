'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InfoBox from '@/components/common/InfoBox';
import { useAuthStore } from '@/store';
import { mockStudents } from '@/data/mockData';
import type { Student } from '@/types';

export default function ConsultantDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // For demo, show empty state first
      // setStudents(mockStudents);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleRowClick = (student: Student) => {
    if (student.status === 'completed' || student.status === 'reviewed') {
      const consultantId = user?.id || 'unknown';
      router.push(`/consultant/${consultantId}/student/${student.id}`);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-[#1B7F9E] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-gray-900 mb-2">김선생 담당 학생</h1>
          <p className="text-[15px] text-gray-500">컨설턴트의 담당 학생을 관리합니다.</p>
        </div>

        {showEmptyState ? (
          <div className="py-16">
            {/* Empty State */}
            <div className="text-center mb-12">
              <h2 className="text-[22px] font-semibold text-[#1B7F9E] mb-3">
                등록된 생활기록부가 없습니다.
              </h2>
              <p className="text-[15px] text-gray-500 mb-8">
                학생의 생활기록부를 등록하여 합격 예상 대학을 확인하세요.
              </p>
              <Link
                href="/consultant/register"
                className="inline-block px-12 py-4 bg-[#1B7F9E] hover:bg-[#166b85] text-white text-[15px] font-medium rounded-lg transition-colors"
              >
                생활기록부 등록하기
              </Link>
            </div>

            <InfoBox
              title="학생 배정 안내"
              items={[
                '학생 배정은 학원 관리자가 진행합니다.',
                '학생이 배정되면 알림을 받으실 수 있습니다.',
                '문의사항은 관리자에게 문의하세요.',
              ]}
            />

            {/* Demo: Show student list button */}
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setShowEmptyState(false);
                  setStudents(mockStudents);
                }}
                className="text-[13px] text-gray-400 hover:text-gray-600 underline"
              >
                (데모) 학생 목록 보기
              </button>
            </div>
          </div>
        ) : (
          <div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1B7F9E] text-white text-[13px]">
                    <th className="px-4 py-3 text-left font-medium">이름</th>
                    <th className="px-4 py-3 text-left font-medium">학교</th>
                    <th className="px-4 py-3 text-left font-medium">학년</th>
                    <th className="px-4 py-3 text-left font-medium">목표대학</th>
                    <th className="px-4 py-3 text-left font-medium">상태</th>
                    <th className="px-4 py-3 text-left font-medium">등록일</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      onClick={() => handleRowClick(student)}
                      className={`border-b border-gray-100 ${
                        student.status === 'completed' || student.status === 'reviewed'
                          ? 'cursor-pointer hover:bg-gray-50'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                      <td className="px-4 py-3 text-gray-600">{student.school}</td>
                      <td className="px-4 py-3 text-gray-600">{student.grade}학년</td>
                      <td className="px-4 py-3 text-gray-600">{student.targetUniversity || '-'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={student.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500">{student.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-right">
              <Link
                href="/consultant/register"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B7F9E] hover:bg-[#166b85] text-white text-[13px] font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                신규 학생 등록
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    analyzing: 'bg-blue-100 text-blue-600',
    completed: 'bg-green-100 text-green-600',
    reviewed: 'bg-amber-100 text-amber-600',
  };
  const labels: Record<string, string> = {
    pending: '대기',
    analyzing: '분석중',
    completed: '완료',
    reviewed: '검토완료',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
