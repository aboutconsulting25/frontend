'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';

interface GradeSummaryCardProps {
  averageGrade: number;
  trend: 'up' | 'down' | 'stable';
  subjectType: string;
  onViewStudents?: () => void;
}

export default function GradeSummaryCard({
  averageGrade,
  trend,
  subjectType,
  onViewStudents,
}: GradeSummaryCardProps) {
  const trendLabel = trend === 'up' ? '상승' : trend === 'down' ? '하락' : '유지';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-base font-medium text-gray-900 mb-4">성적 요약</h3>

      <div className="flex items-start justify-between mb-4">
        <span className="text-5xl font-bold text-gray-900">{averageGrade.toFixed(2)}</span>
        <span className="text-sm text-gray-500">반영 과목 최고 등급</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">성적 추이</span>
          <span className="flex items-center gap-1 text-sm text-primary-500">
            {trendLabel}
            <TrendIcon className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">반영 과목</span>
          <span className="text-sm text-primary-500">{subjectType}</span>
        </div>
      </div>

      {onViewStudents && (
        <button
          onClick={onViewStudents}
          className="w-full py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          담당 학생 보기
        </button>
      )}
    </div>
  );
}
