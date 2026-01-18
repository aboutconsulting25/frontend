'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SummaryCard from '@/components/card/SummaryCard';
import ConsultCard from '@/components/card/ConsultCard';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, userRole } = useAuthStore();

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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-50 flex justify-center">
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
          <div className="grid grid-cols-3 gap-5">
            {consultants.map((consultant) => (
              <ConsultCard
                key={consultant.id}
                consultantName={consultant.name}
                consultantRole={consultant.role}
                numAssignedStudent={consultant.students}
                starRatio={consultant.rating}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>

  );
}
