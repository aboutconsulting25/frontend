'use client';

import { ThumbsUp, Info, Check } from 'lucide-react';

export default function ComprehensiveAnalysisTab() {
  const positiveFactors = [
    '체계적인 시간 관리 능력',
    '사회 문제에 대한 깊은 관심',
    '실질적인 리더십 경험',
  ];

  const improvements = [
    '활동 결과의 구체성 부족',
    '개별 활동 간 연계성 미흡',
    '정량적 성과 지표 부재',
  ];

  const careerFits = [
    { name: '정치외교학', percentage: 85 },
    { name: '행정학', percentage: 78 },
    { name: '사회학', percentage: 72 },
  ];

  const universityPredictions = [
    { university: '성균관대/글로벌리더학부', status: '적정' },
    { university: '한양대/정치외교학과', status: '적정' },
    { university: '경희대/사회학과', status: '소신' },
    { university: '이화여자대학교/정치외교학과', status: '소신' },
    { university: '고려대/정치외교학과', status: '상향' },
    { university: '중앙대/정치국제학과', status: '상향' },
  ];

  const recommendedUniversities = [
    { university: '성균관대/글로벌리더학부', status: '적정' },
    { university: '한양대/정치외교학과', status: '적정' },
    { university: '경희대/사회학과', status: '소신' },
    { university: '이화여자대학교/정치외교학과', status: '소신' },
    { university: '고려대/정치외교학과', status: '상향' },
    { university: '중앙대/정치국제학과', status: '상향' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '적정':
        return 'bg-amber-400 text-white';
      case '소신':
        return 'bg-blue-100 text-blue-700';
      case '상향':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[1fr_300px] gap-4">
        {/* 왼쪽: 종합 점수 및 의견 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* 종합 점수 */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-bold text-primary-500">78점</span>
            <span className="text-sm text-gray-500">종합 점수</span>
          </div>

        {/* 종합 의견 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">종합 의견</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            이 학생은 자기주도적 학습 능력과 사회 문제에 대한 관심이 뛰어난 학생입니다. 특히 제한된 시간을 효율적으로 활용하는 능력과 리더십 경험은 큰 강점입니다.
          </p>

          <ol className="space-y-3 text-gray-700 leading-relaxed mb-6">
            <li className="flex gap-2">
              <span className="font-medium">1.</span>
              <span>이연 학생의 내신 성적, 생기부, 모의고사 성적을 종합적으로 본 결과, 이연 학생에게는 수시전형이 유리합니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">2.</span>
              <span>이연 학생은 현재 성적으로 학생부종합전형 지원이 가능합니다. → 건동홍숙 라인</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">3.</span>
              <span>수능최저기준 충족 여부에 대한 서술(학생의 모의고사 성적을 기준으로)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">4.</span>
              <span>전형 전략 및 대학 지원 방향: 이연 학생의 내신 성적, 생기부 활동, 모의고사 성적을 종합적으로 분석한 결과, 수시 전형, 특히 학생부종합전형이 보다 유리한 전략으로 판단됩니다. 현재 성적 기준으로는 광명상가 등 주요 대학의 학생부종합전형 및 학생부교과전형(지역균형, 학교장추천 등) 지원이 가능합니다.</span>
            </li>
          </ol>

          <p className="text-gray-700 leading-relaxed mb-6">
            또한, 학생부종합전형을 고려할 경우 학생이 지원하려는 모집단위에 따라 교과이수과목과 활동 연계성을 살펴야 하는데, 2학년 교과 이수 내용이 명확히 제시되지 않아 전공 적합성 측면에서의 구체적 조언은 다소 어려운 상태입니다.
          </p>

          <div className="space-y-2">
            <p className="font-medium text-gray-900">5. 향후 보완 과제:</p>
            <p className="text-gray-700 leading-relaxed pl-4">
              내신 성적, 특히 수학 교과의 성취도를 더 높일 필요가 있으며, 이를 통해 학업역량을 강화할 수 있습니다. 또한 모의고사 성적 향상을 통해 수능 최저기준 충족 가능성을 안정적으로 확보해야 합니다. 생기부 활동 중 진로 관련 활동의 실증적 연계, 심화성과 구체성을 추가하여 진로역량의 현실성과 깊이를 강화하는 노력이 요구됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 오른쪽: 카드들 */}
      <div className="space-y-4">
        {/* 긍정적 요소 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-bold text-gray-900">긍정적 요소</h3>
          </div>
          <ul className="space-y-3">
            {positiveFactors.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 개선 필요사항 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-gray-900">개선 필요사항</h3>
          </div>
          <ul className="space-y-3">
            {improvements.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 진로적합도 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">진로적합도</h3>
          <ul className="space-y-3">
            {careerFits.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{item.name}</span>
                <span className="text-primary-500 font-bold">{item.percentage}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>

      {/* 희망 대학 예측 */}
      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">희망 대학 예측</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-primary-500 text-white">
                  <th className="py-4 px-6 text-sm font-medium text-center">학교/학과</th>
                  <th className="py-4 px-6 text-sm font-medium text-center">종합 판단</th>
                </tr>
              </thead>
              <tbody>
                {universityPredictions.map((item, index) => (
                  <tr
                    key={index}
                    className={index !== universityPredictions.length - 1 ? 'border-b border-gray-100' : ''}
                  >
                    <td className="py-4 px-6 text-sm text-gray-700 text-center">
                      {item.university}
                    </td>
                    <td className={`py-4 px-6 text-sm text-center ${getStatusColor(item.status)}`}>
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 종합 판단 기준 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">종합 판단 기준</h3>

          <div className="flex gap-6">
            {/* 그라데이션 바 */}
            <div className="flex flex-col items-end text-xs text-gray-500 gap-0">
              <span className="mb-1">100%</span>
              <div className="w-16 h-12 bg-blue-200 rounded-t-sm" />
              <span className="my-1">70%</span>
              <div className="w-16 h-12 bg-blue-400" />
              <span className="my-1">50%</span>
              <div className="w-16 h-12 bg-blue-500" />
              <span className="my-1">30%</span>
              <div className="w-16 h-12 bg-blue-700 rounded-b-sm" />
              <span className="mt-1">0%</span>
            </div>

            {/* 범례 */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-blue-200 rounded-sm mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">안정(70%이상)</p>
                  <p className="text-sm text-gray-500">합격 가능성이 높은 구간</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded-sm mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">적정(50~70%)</p>
                  <p className="text-sm text-gray-500">현실적 목표 대학</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-sm mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">소신(30~50%)</p>
                  <p className="text-sm text-gray-500">도전 가능한 구간</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-blue-700 rounded-sm mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">상향(30%미만)</p>
                  <p className="text-sm text-gray-500">상위 목표 대학</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 종합 전형 추천 대학/학과 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">종합 전형 추천 대학/학과</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-[calc(100%-336px)]">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-500 text-white">
                <th className="py-4 px-6 text-sm font-medium text-center">학교/학과</th>
                <th className="py-4 px-6 text-sm font-medium text-center">종합 판단</th>
              </tr>
            </thead>
            <tbody>
              {recommendedUniversities.map((item, index) => (
                <tr
                  key={index}
                  className={index !== recommendedUniversities.length - 1 ? 'border-b border-gray-100' : ''}
                >
                  <td className="py-4 px-6 text-sm text-gray-700 text-center">
                    {item.university}
                  </td>
                  <td className={`py-4 px-6 text-sm text-center ${getStatusColor(item.status)}`}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
