'use client';

import MockExamTrendChart from './MockExamTrendChart';

const defaultData = [
  { month: '3월', grade: 2.04, percentile: 25 },
  { month: '5월', grade: 3.48, percentile: 45 },
  { month: '6월', grade: 4.01, percentile: 48 },
];

export default function MockExamTrendSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3">
        <h2 className="text-xl font-bold text-gray-900">그룹별 성적 추이</h2>
        <span className="text-sm text-gray-500">
          최근 모의고사 성적을 기준으로 그래프를 작성하였습니다.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MockExamTrendChart title="전과목 평균" data={defaultData} />
        <MockExamTrendChart title="국수영사과 평균" data={defaultData} />
        <MockExamTrendChart title="국수영사 평균" data={defaultData} />
        <MockExamTrendChart title="국수영과 평균" data={defaultData} />
      </div>
    </div>
  );
}
