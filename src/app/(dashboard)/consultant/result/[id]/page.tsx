'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ChevronLeft, ExternalLink, Share } from 'lucide-react';

type TabType = 'original' | 'analysis' | 'grades' | 'comprehensive';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('analysis');

  const tabs = [
    { id: 'original' as TabType, label: '생기부 원본' },
    { id: 'analysis' as TabType, label: '생기부 분석' },
    { id: 'grades' as TabType, label: '성적 분석' },
    { id: 'comprehensive' as TabType, label: '종합 분석' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1000px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-1">
            <button onClick={() => router.back()} className="pt-0.5 text-gray-400 hover:text-gray-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">김학생</h1>
              <p className="text-sm text-gray-500">현대고등학교 | 컴퓨터소프트웨어 진로희망</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ExternalLink className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'original' && (
          <div className="bg-white border border-gray-200 rounded-lg p-20 text-center text-gray-500">
            생기부 원본 PDF가 표시됩니다.
          </div>
        )}

        {activeTab === 'analysis' && <SaenggibuAnalysisTab />}

        {activeTab === 'grades' && (
          <div className="bg-white border border-gray-200 rounded-lg p-20 text-center text-gray-500">
            성적 분석이 표시됩니다.
          </div>
        )}

        {activeTab === 'comprehensive' && (
          <div className="bg-white border border-gray-200 rounded-lg p-20 text-center text-gray-500">
            종합 분석이 표시됩니다.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// 생기부 분석 탭 컴포넌트
function SaenggibuAnalysisTab() {
  return (
    <div className="space-y-8">
      {/* 강점/약점 요약 카드 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 강점 요약 */}
        <div className="bg-[#F6F8FA] border border-[#BCD0DC] rounded-xl p-6">
          <h3 className="text-xl font-medium text-gray-900 mb-4">강점 요약</h3>
          <div className="my-4 border-t border-[#E9E9E9]" />
          <ul className="space-y-2 text-sm text-gray-700">
            <li>1. 국어 과목 1등급으로 강점 확인하였으며 유지하길 바람.</li>
            <li>2. 사회 과목 2등급으로 강점 확인했으나 앞으로 1등급으로 상승하길 바람.</li>
            <li>3. 이과임에도 불구하고 수학 4등급으로 다음학기 3등급대 진입 필수</li>
          </ul>
        </div>

        {/* 약점 요약 */}
        <div className="bg-[#FFFFFF] border border-[#BCD0DC] rounded-xl p-6">
          <h3 className="text-xl font-medium text-gray-900 mb-4">약점 요약</h3>
          <div className="my-4 border-t border-[#F7F7F7]" />
          <ul className="space-y-2 text-sm text-gray-700">
            <li>1. 이과임에도 불구하고 수학 4등급으로 다음학기 3등급대 진입 필수</li>
            <li>2. 진로관련 심화학습 및 활동 필요</li>
            <li>3. 이과임에도 불구하고 수학 4등급으로 다음학기 3등급대 진입 필수</li>
          </ul>
        </div>
      </div>

      {/* 생활기록부 진단 개요 */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-[#242424]">생활기록부 진단 개요</h2>

        <div className="bg-[#FFFFFF] border border-[#00000026] rounded-xl p-5">
          <div className="flex items-start gap-2">
            <span className="text-primary-500">✓</span>
            <p className="text-sm font-medium text-gray-900">
              수학과목의 성취도 향상과 정보 및 코딩 기반의 세특 보완을 통해 학생부종합전형 지원 전략을 추천합니다.
            </p>
          </div>
          <div className="my-4 border-t border-[#F7F7F7]" />
          <div className="text-sm text-gray-600 leading-relaxed space-y-4">
            <p>
              컴퓨터소프트웨어 계열은 수학적 논리력, 프로그래밍 경험, 문제해결 능력을 핵심 역량으로 요구하는 학문 분야입니다.
            </p>
            <p>
              현재 정성현 학생은 정보 과목에서 A등급을 받으며 기초적인 알고리즘 이해도와 컴퓨터 활용 능력을 이미 입증하고 있고, 국어와 통합사회 과목에서도 자료를 해석하고 논리를 구성하는 능력, 복잡한 정보를 읽고 이해하는 독해력에서도 강점을 보이고 있습니다. 이는 소프트웨어 개발 과정에서 요구되는 역량으로 긍정적인 요소입니다. 그러나 수학 성적이 4등급으로 다소 낮다는 점은 해당 계열 지원 시 가장 큰 리스크로 작용할 수 있습니다. 컴퓨터소프트웨어 전공은 수학적 사고력이 필수적이기 때문에, 향후 1년간 수학 성적 향상에 집중하는 전략이 매우 중요합니다. 이와 더불어, 컴퓨터 관련 프로젝트 경험, 프로그래밍 활동, 전공 관련 독서를 체계적으로 넓어나간다면 학생부종합전형 지원 전략에서 경쟁력을 확보할 수 있을 것으로 기대됩니다.
            </p>
        </div>
        </div>
      </div>

      {/* 진로적합성 강화 방안 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-[#242424]">진로적합성 강화 방안</h2>

        <div className="bg-[#FFFFFF] border border-[#00000026] rounded-xl p-5">
          <div className="flex items-start gap-2">
            <span className="text-primary-500">✓</span>
            <p className="text-sm font-medium text-gray-900">
              수학 역량 강화 방안이 필요합니다.
            </p>
          </div>
          <div className="my-4 border-t border-[#F7F7F7]" />
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">
              2028 수능 체제에서도 컴퓨터공학과는 수학역량을 필수로 요구합니다. 고등학교 2학년 1학기까지 3등급대 도달을 목표로 단계적 학습이 중요합니다. 현재 정성현 학생이 속한 성적대의 성적향상 방안은 아래와 같습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button className="py-5 px-4 bg-[#F59E0B] text-[#0080C4] font-medium rounded-lg text-sm hover:bg-amber-200 transition-colors">
            중학교 과정부터 개념 구멍 메우기
          </button>
          <button className="py-5 px-4 bg-[#F59E0B] text-[#0080C4] font-medium rounded-lg text-sm hover:bg-amber-200 transition-colors">
            문제 유형별 반복 학습
          </button>
          <button className="py-5 px-4 bg-[#F59E0B] text-[#0080C4] font-medium rounded-lg text-sm hover:bg-amber-200 transition-colors">
            주 3회 이상 꾸준한 수학 학습시간 확보
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#00000026] rounded-xl p-5">
          <div className="flex items-start gap-2">
            <span className="text-primary-500">✓</span>
            <p className="text-sm font-medium text-gray-900">
              정보, 코딩 실력을 심화시키는 프로젝트를 추천합니다.
            </p>
          </div>
          <div className="my-4 border-t border-[#F7F7F7]" />
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">
              정성현 학생은 정보 과목에서 A등급을 받으며 프로그래밍 기초 소양과 알고리즘 이해도에서 강점을 보이고 있습니다. 이러한 강점을 학생부종합전형에서 더욱 효과적으로 드러내기 위해서는 세부능력 및 특기사항(이하 세특)에 구체적이고 전문적인 성장 과정을 기록하는 것이 매우 중요합니다. 이를 위해 심화 학습 및 심화 활동을 진행하고, 그 과정에서의 탐구 내용·문제 해결 과정·기술적 적용을 세특에 녹여내는 전략이 필요합니다. 특히 최근 대학에서는 단순히 컴퓨터 기술을 사용할 줄 아는 학생을 넘어서, 사회적 문제를 기술적으로 분석 및 해결할 수 있는 융합형 인재를 선호합니다. 따라서 심화활동으로 실제 사회문제를 데이터 기반으로 분석하고, 프로그래밍 및 알고리즘을 활용해 해결 방안을 제시하는 프로젝트를 수행하여 전공적합성은 물론 융합적 사고역량도 함께 강조할 수 있습니다.
            </p>
          </div>
          <div>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              이러한 관점에서 정성현 학생의 강점과 진로 방향에 모두 부합하는 심화 프로젝트 활동을 다음과 같이 추천합니다.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-[#FCFCFC] border border-[#E9E9E9] rounded-xl p-5">
              <h4 className="text-sm font-bold text-primary-500 mb-3">학교 급식 만족도 조사 데이터 분석</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                반 또는 학년 대상 급식 만족도 설문조사를 진행하고 해당 데이터를 Python의 Pandas 라이브러리를 이용하여 분석하고 시각화합니다. 평균, 최댓값, 그래프를 만들어보고 의미있는 인사이트를 도출해 내며 데이터 사이언스의 기초를 경험합니다.
              </p>
            </div>
            <div className="bg-[#FCFCFC] border border-[#E9E9E9] rounded-xl p-5">
              <h4 className="text-sm font-bold text-primary-500 mb-3">학교폭력 감지 대시보드 텍스트 데이터 분석</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                반 또는 학년 대상 급식 만족도 설문조사를 진행하고 해당 데이터를 Python의 Pandas 라이브러리를 이용하여 분석하고 시각화합니다. 평균, 최댓값, 그래프를 만들어보고 의미있는 인사이트를 도출해 내며 데이터 사이언스의 기초를 경험합니다.
              </p>
            </div>
            <div className="bg-[#FCFCFC] border border-[#E9E9E9] rounded-xl p-5">
              <h4 className="text-sm font-bold text-primary-500 mb-3">교내 에너지 낭비 감지 시스템 취리 모델 기반 예측</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                반 또는 학년 대상 급식 만족도 설문조사를 진행하고 해당 데이터를 Python의 Pandas 라이브러리를 이용하여 분석하고 시각화합니다. 평균, 최댓값, 그래프를 만들어보고 의미있는 인사이트를 도출해 내며 데이터 사이언스의 기초를 경험합니다.
              </p>
            </div>
        </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-gray-900">진로 관련 도서 추천</h2>

        <div className="bg-[#FFFFFF] border border-[#00000026] rounded-xl p-5">
          <div className="flex items-start gap-2">
            <span className="text-primary-500">✓</span>
            <p className="text-sm font-medium text-gray-900">
              컴퓨터소프트웨어학과 도서를 추천합니다.
            </p>
          </div>
          <div className="my-4 border-t border-[#F7F7F7]" />
          {/* 도서 추천 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#FCFCFC] border border-[#E9E9E9] rounded-xl p-5">
              <p className="text-sm font-medium text-primary-500 hover:text-primary-600">
                '코드: 하드웨어와 소프트웨어의 언어'(찰스 펫졸드)
              </p>
              <p className="mt-5 text-xs text-gray-600 leading-relaxed">
                해당 도서는 컴퓨터가 어떻게 0과 1이라는 단순한 신호로 정보를 처리하는지, 근본적으로 어떻게 전기 신호만으로 복잡한 작업을 할 수 있는지 등 전공 기초와 관련해 탐구할 수 있는 내용이 실려 있습니다. 또한 전공 이해도와 전공에 대한 흥미를 나타내는 데 좋은 책입니다.
              </p>
            </div>
            <div className="bg-[#FCFCFC] border border-[#E9E9E9] rounded-xl p-5">
              <p className="text-sm font-medium text-primary-500 hover:text-primary-600">
                '메타버스'(김상균)
              </p>
              <p className="mt-5 text-xs text-gray-600 leading-relaxed">
                기술의 발전이 사람에게 어떤 영향을 미치는지를 고민해 볼 수 있는 책입니다.
              </p>
            </div>
            <div className="bg-[#FCFCFC] border border-[#E9E9E9] rounded-xl p-5">
              <p className="text-sm font-medium text-primary-500 hover:text-primary-600">
                '슈퍼 인텔리전스'(닉 보스트롬)
              </p>
              <p className="mt-5 text-xs text-gray-600 leading-relaxed">
                미래 사회에 필요한 역량과 태도를 나타내는 데 도움이 되는 책입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
