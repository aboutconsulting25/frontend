'use client';

import SubjectAnalysisCard from './SubjectAnalysisCard';

const analysisData = [
  {
    subject: '국어',
    courseName: '공통국어',
    grade: 'A등급',
    conversionFrom: 1,
    conversionTo: 2,
    description:
      '국어 A등급/2등급 반 내 상위권이며 학년 기준 2등급 구간으로 추정됨. 언어 이해력과 텍스트 해석 능력이 우수하며, 비문학 독해와 문학 작품 분석에서 강점을 보입니다. 이는 모든 교과의 기초가 되는 역량으로 대입에서 매우 중요한 자산입니다.',
  },
  {
    subject: '영어',
    courseName: '공통영어',
    grade: 'A등급',
    conversionFrom: 1,
    conversionTo: 3,
    description:
      '중상위권에 안착해 있으며, 학년 기준 3등급대 초반대로 추정됩니다. 독해 능력은 양호하니 어휘력 강화와 빠른 독해 훈련이 필요합니다. 상승 여력이 충분히 있는 과목입니다.',
  },
  {
    subject: '수학',
    courseName: '공통수학',
    grade: 'B등급',
    conversionFrom: 2,
    conversionTo: 4,
    description:
      '현재 가장 큰 약점으로, 기본 개념에 구멍이 있으며 난도가 상승할 경우 위험도가 매우 높습니다. 그러나 이는 단순히 학습량과 방법의 문제이므로, 체계적인 보완으로 충분히 개선 가능합니다.',
  },
  {
    subject: '사회',
    courseName: '통합사회',
    grade: 'A등급',
    conversionFrom: 2,
    conversionTo: 2,
    description:
      '명확한 강점 과목으로, 사회 현상에 대한 이해력과 분석력이 뛰어납니다. 이는 학생의 학업적 기반이 되는 영역으로, 인문사회계열 진학 시 핵심 자산이 됩니다.',
  },
  {
    subject: '과학',
    courseName: '통합과학',
    grade: 'A등급',
    conversionFrom: 2,
    conversionTo: 3,
    description:
      '중상위권으로 안정적입니다. 컴퓨터 소프트웨어학과 진학 시, 고난도의 과학을 요구하지 않으므로 현재 수준만 유지해도 충분합니다.',
  },
  {
    subject: '정보',
    description:
      '수행평가와 프로젝트 형태 평가에서 강점을 보이며, 소프트웨어 진로와 자연스럽게 연결됩니다. 실습 시간 학습에서 높은 성취도를 나타냅니다.',
  },
];

export default function GradeDeepAnalysisSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3">
        <h2 className="text-xl font-bold text-gray-900">성적 심층 분석</h2>
        <span className="text-sm text-gray-500">9등급제 환산 기준</span>
      </div>

      <div className="space-y-3">
        {analysisData.map((item) => (
          <SubjectAnalysisCard
            key={item.subject}
            subject={item.subject}
            courseName={item.courseName}
            grade={item.grade}
            conversionFrom={item.conversionFrom}
            conversionTo={item.conversionTo}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}
