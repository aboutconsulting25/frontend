'use client';

interface SemesterGrade {
  semester: string;
  grade: number;
}

interface GroupGrade {
  group: string;
  grade: number;
}

interface SubjectGrades {
  subject: string;
  grades: number[];
  average: number;
}

const semesterAverages: SemesterGrade[] = [
  { semester: '1-1', grade: 4.25 },
  { semester: '1-2', grade: 4.08 },
  { semester: '2-1', grade: 3.78 },
  { semester: '2-2', grade: 2 },
  { semester: '3-1', grade: 3.98 },
];

const groupAverages: GroupGrade[] = [
  { group: '전과목', grade: 4.25 },
  { group: '국수영사과', grade: 4.08 },
  { group: '국수영과', grade: 3.78 },
];

const subjectGrades: SubjectGrades[] = [
  { subject: '국어', grades: [4, 5, 4, 2, 3, 3], average: 3.5 },
  { subject: '영어', grades: [4, 5, 4, 2, 3, 3], average: 3.5 },
  { subject: '수학', grades: [4, 5, 4, 2, 3, 3], average: 3.5 },
  { subject: '사회', grades: [4, 5, 4, 2, 3, 3], average: 3.5 },
  { subject: '과학', grades: [4, 5, 4, 2, 3, 3], average: 3.5 },
];

const semesters = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];

export default function GradeAverageSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">평균 등급표</h2>

      {/* 상단 카드 영역 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 학기별 평균 등급 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 text-center mb-6">
            학기별 평균 등급
          </h3>
          <div className="flex justify-between">
            {semesterAverages.map((item) => (
              <div key={item.semester} className="text-center">
                <p className="text-sm text-primary-500 mb-1">{item.semester}</p>
                <p className="text-lg font-bold text-gray-900">{item.grade}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 그룹별 평균 등급 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 text-center mb-6">
            그룹별 평균 등급
          </h3>
          <div className="flex justify-around">
            {groupAverages.map((item) => (
              <div key={item.group} className="text-center">
                <p className="text-sm text-primary-500 mb-1">{item.group}</p>
                <p className="text-lg font-bold text-gray-900">{item.grade}</p>
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
              {semesters.map((semester) => (
                <th key={semester} className="py-4 px-6 text-sm font-medium text-center">
                  {semester}
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
