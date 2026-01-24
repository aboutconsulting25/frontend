'use client';

interface ImprovementItem {
  subject: string;
  description: string;
}

const improvementData: ImprovementItem[] = [
  {
    subject: '국어',
    description: '현재 수준을 꾸준히 유지하면서 고난도 문제 해결 능력을 키워 1등급 진입을 목표로 합니다.',
  },
  {
    subject: '영어',
    description: '체계적인 어휘 학습과 듣기 훈련으로 고등학교 2학년 때 2등급 진입을 목표로 합니다.',
  },
  {
    subject: '수학',
    description: '개념의 재정립과 반복 학습을 통해 고등학교 2학년 1학기까지 3등급 진입이 필수입니다.',
  },
  {
    subject: '과학',
    description: '부담 없이 현재 수준을 유지하며, 여유 시간은 수학과 정보에 투자합니다.',
  },
];

export default function GradeImprovementSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">성적 보완 방안</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-primary-500 mb-6">보완 전략 요약</h3>

        <div className="space-y-4">
          {improvementData.map((item) => (
            <div key={item.subject} className="flex items-start gap-4">
              <span className="inline-flex items-center justify-center px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-full whitespace-nowrap">
                {item.subject}
              </span>
              <p className="text-gray-700 leading-relaxed pt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
