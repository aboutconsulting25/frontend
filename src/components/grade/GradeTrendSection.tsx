'use client';

import GradeTrendChart from './GradeTrendChart';

const defaultData = [
  { semester: '1-1', grade: 4.25 },
  { semester: '1-2', grade: 4.08 },
  { semester: '2-1', grade: 3.78 },
  { semester: '2-2', grade: 2.5 },
  { semester: '3-1', grade: 2 },
  { semester: '3-2', grade: 3.98 },
];

export default function GradeTrendSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">그룹별 성적 추이</h2>
      <div className="grid grid-cols-2 gap-4">
        <GradeTrendChart title="전과목 평균" data={defaultData} />
        <GradeTrendChart title="국수영사과 평균" data={defaultData} />
        <GradeTrendChart title="국수영사 평균" data={defaultData} />
        <GradeTrendChart title="국수영과 평균" data={defaultData} />
      </div>
    </div>
  );
}
