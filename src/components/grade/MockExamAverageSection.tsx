'use client';

interface MonthGrade {
  month: string;
  grade: number;
}

interface GroupPercentile {
  group: string;
  percentile: number;
}

interface SubjectGrades {
  subject: string;
  grades: number[];
  average: number;
}

const monthAverages: MonthGrade[] = [
  { month: '3월', grade: 4.25 },
  { month: '5월', grade: 4.08 },
  { month: '6월', grade: 3.78 },
];

const groupPercentiles: GroupPercentile[] = [
  { group: '전과목', percentile: 4.25 },
  { group: '국수영사과', percentile: 4.08 },
  { group: '국수영과', percentile: 3.78 },
];

const subjectGrades: SubjectGrades[] = [
  { subject: '국어', grades: [4, 5, 4], average: 3 },
  { subject: '영어', grades: [4, 5, 4], average: 3 },
  { subject: '수학', grades: [4, 5, 4], average: 3 },
  { subject: '사회', grades: [4, 5, 4], average: 3 },
  { subject: '과학', grades: [4, 5, 4], average: 3 },
];

const months = ['3월', '5월', '6월'];

export default function MockExamAverageSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">평균 등급표</h2>

      {/* 상단 카드 영역 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 평균 등급 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 text-center mb-6">
            평균 등급
          </h3>
          <div className="flex justify-around">
            {monthAverages.map((item) => (
              <div key={item.month} className="text-center">
                <p className="text-sm text-primary-500 mb-1">{item.month}</p>
                <p className="text-lg font-bold text-gray-900">{item.grade}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 평균 백분위 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 text-center mb-6">
            평균 백분위
          </h3>
          <div className="flex justify-around">
            {groupPercentiles.map((item) => (
              <div key={item.group} className="text-center">
                <p className="text-sm text-primary-500 mb-1">{item.group}</p>
                <p className="text-lg font-bold text-gray-900">{item.percentile}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 과목별 성적 테이블 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-500 text-white">
              <th className="py-4 px-6 text-sm font-medium text-left">과목</th>
              {months.map((month) => (
                <th key={month} className="py-4 px-6 text-sm font-medium text-center">
                  {month}
                </th>
              ))}
              <th className="py-4 px-6 text-sm font-medium text-center">과목평균</th>
            </tr>
          </thead>
          <tbody>
            {subjectGrades.map((subject, index) => (
              <tr
                key={subject.subject}
                className={index !== subjectGrades.length - 1 ? 'border-b border-gray-100' : ''}
              >
                <td className="py-5 px-6 text-sm font-medium text-gray-900">
                  {subject.subject}
                </td>
                {subject.grades.map((grade, gradeIndex) => (
                  <td key={gradeIndex} className="py-5 px-6 text-sm text-gray-600 text-center">
                    {grade}
                  </td>
                ))}
                <td className="py-5 px-6 text-sm font-medium text-primary-500 text-center">
                  {subject.average}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
