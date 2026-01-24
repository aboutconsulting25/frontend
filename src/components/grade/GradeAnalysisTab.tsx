'use client';

import { useState } from 'react';
import GradeTypeTabs, { GradeType } from './GradeTypeTabs';
import GradeSummaryCard from './GradeSummaryCard';
import GradeChangeCard from './GradeChangeCard';
import GoalCard from './GoalCard';
import GradeTrendSection from './GradeTrendSection';
import SubjectTrendSection from './SubjectTrendSection';
import GradeAverageSection from './GradeAverageSection';
import GradeDeepAnalysisSection from './GradeDeepAnalysisSection';
import GradeImprovementSection from './GradeImprovementSection';
import MockExamSummaryCard from './MockExamSummaryCard';
import MockExamTrendSection from './MockExamTrendSection';
import MockExamSubjectTrendSection from './MockExamSubjectTrendSection';
import MockExamAverageSection from './MockExamAverageSection';

export default function GradeAnalysisTab() {
  const [gradeType, setGradeType] = useState<GradeType>('internal');

  return (
    <div className="space-y-6">
      <GradeTypeTabs activeType={gradeType} onTypeChange={setGradeType} />

      {gradeType === 'internal' && (
        <>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
            <GradeSummaryCard
              averageGrade={4.04}
              trend="down"
              subjectType="전과목"
              onViewStudents={() => {}}
            />
            <GradeChangeCard
              change={-0.43}
              message="소폭 하락하여 주의가 필요합니다."
            />
            <div className="flex flex-col gap-4 w-[200px]">
              <GoalCard title="단기 목표" goal="평균 3.04등급 달성" />
              <GoalCard title="장기 목표" goal="평균 2.54등급 달성" />
            </div>
          </div>
          <GradeTrendSection />
          <SubjectTrendSection />
          <GradeAverageSection />
          <GradeDeepAnalysisSection />
          <GradeImprovementSection />
        </>
      )}

      {gradeType === 'mock' && (
        <>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
            <MockExamSummaryCard
              title="최근 응시 모의고사"
              mainValue="2.3"
              items={[
                { label: '성적 추이', value: '하락', trend: 'down', color: 'primary' },
                { label: '전국 백분위', value: '상위 15%', color: 'primary' },
              ]}
            />
            <MockExamSummaryCard
              title="전회차 대비 변동"
              mainValue="+3.2%"
              items={[
                { label: '백분위', value: '상승', trend: 'up', color: 'primary' },
                { label: '전국 석차', value: '18,500명', color: 'primary' },
              ]}
            />
            <div className="flex flex-col gap-4 w-[200px]">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-500 mb-2">정시 목표</p>
                <p className="text-2xl font-bold text-gray-900">중앙대</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-500 mb-2">현재 지원 가능</p>
                <p className="text-2xl font-bold text-gray-900">건국대~경희대</p>
              </div>
            </div>
          </div>
          <MockExamTrendSection />
          <MockExamSubjectTrendSection />
          <MockExamAverageSection />
        </>
      )}
    </div>
  );
}
