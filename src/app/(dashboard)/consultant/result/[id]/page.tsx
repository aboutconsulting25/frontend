'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  analysisService, 
  MOCK_SAENGGIBU_ANALYSIS, 
  MOCK_GRADE_ANALYSIS, 
  MOCK_COMPREHENSIVE_ANALYSIS,
} from '@/services/api';
import type { 생기부분석, 성적분석, 종합분석 } from '@/types';

type TabType = 'original' | 'analysis' | 'grades' | 'comprehensive';

export default function ResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const documentId = params.id as string;
  const studentId = searchParams.get('student_id') || 'mock';
  const reportId = searchParams.get('report_id') || 'mock';
  
  const [activeTab, setActiveTab] = useState<TabType>('grades');
  const [isLoading, setIsLoading] = useState(true);
  const [saenggibu, setSaenggibu] = useState<생기부분석 | null>(null);
  const [grades, setGrades] = useState<성적분석 | null>(null);
  const [comprehensive, setComprehensive] = useState<종합분석 | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await analysisService.getFullAnalysis(studentId, documentId, reportId);
        setSaenggibu(result.생기부_분석);
        setGrades(result.성적분석);
        setComprehensive(result.종합분석);
      } catch {
        setSaenggibu(MOCK_SAENGGIBU_ANALYSIS);
        setGrades(MOCK_GRADE_ANALYSIS);
        setComprehensive(MOCK_COMPREHENSIVE_ANALYSIS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [documentId, studentId, reportId]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`분석리포트.pdf`);
  };

  const tabs = [
    { id: 'original' as TabType, label: '생기부 원본' },
    { id: 'analysis' as TabType, label: '생기부 분석' },
    { id: 'grades' as TabType, label: '성적 분석' },
    { id: 'comprehensive' as TabType, label: '종합 분석' },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-3 border-[#1B7F9E] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-[22px] font-semibold text-gray-900">김학생</h1>
              <p className="text-[13px] text-gray-500">한국고등학교 · 컴퓨터소프트웨어</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 text-[13px] rounded-lg transition ${isEditMode ? 'bg-[#1B7F9E] text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
            >
              {isEditMode ? '수정 완료' : '수정'}
            </button>
            <button onClick={handleExportPDF} className="px-4 py-2 text-[13px] border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
              PDF 다운로드
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all ${
                activeTab === tab.id ? 'bg-[#1B7F9E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={reportRef} className="bg-white border border-gray-200 rounded-lg p-6">
          {activeTab === 'original' && (
            <div className="py-20 text-center text-gray-500">생기부 원본 PDF</div>
          )}
          
          {activeTab === 'analysis' && saenggibu && (
            <SaenggibuTab data={saenggibu} isEditMode={isEditMode} />
          )}
          
          {activeTab === 'grades' && grades && (
            <GradesTab data={grades} isEditMode={isEditMode} />
          )}
          
          {activeTab === 'comprehensive' && comprehensive && (
            <ComprehensiveTab data={comprehensive} isEditMode={isEditMode} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ============================================
// 생기부 분석 탭
// ============================================
function SaenggibuTab({ data, isEditMode }: { data: 생기부분석; isEditMode: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-2">진단 개요</h3>
        <p className="text-[14px] font-medium text-[#1B7F9E] mb-2">{data.생기부_진단개요["한줄 요약"]}</p>
        <p className="text-[13px] text-gray-600">{data.생기부_진단개요.본문}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <h4 className="text-[14px] font-semibold text-green-700 mb-3">강점</h4>
          {Object.entries(data.강점요약).map(([key, val], i) => (
            <div key={key} className="flex gap-2 mb-2">
              <span className="w-5 h-5 bg-green-500 text-white text-[11px] rounded-full flex items-center justify-center flex-shrink-0">{i+1}</span>
              <p className="text-[12px] text-green-700">{val}</p>
            </div>
          ))}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <h4 className="text-[14px] font-semibold text-red-700 mb-3">약점</h4>
          {Object.entries(data.약점요약).map(([key, val], i) => (
            <div key={key} className="flex gap-2 mb-2">
              <span className="w-5 h-5 bg-red-500 text-white text-[11px] rounded-full flex items-center justify-center flex-shrink-0">{i+1}</span>
              <p className="text-[12px] text-red-700">{val}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3">강화 방안</h3>
        <div className="bg-[#1B7F9E]/10 rounded-lg p-4">
          <p className="text-[13px] font-medium text-[#1B7F9E] mb-2">{data.진로적합성_강화방안.강화방안.한줄요약}</p>
          <p className="text-[12px] text-gray-600">{data.진로적합성_강화방안.강화방안.설명}</p>
        </div>
      </div>

      <div>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3">추천 프로젝트</h3>
        <div className="grid grid-cols-3 gap-3">
          {data.진로적합성_강화방안.비교과_지도필요_영역.프로젝트_및_심화활동_추천.map((p) => (
            <div key={p.프로젝트_번호} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <h5 className="text-[12px] font-medium text-amber-700 mb-1">{p.제목}</h5>
              <p className="text-[11px] text-amber-600">{p.내용}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 성적 분석 탭
// ============================================
function GradesTab({ data, isEditMode }: { data: 성적분석; isEditMode: boolean }) {
  const g = data.내신;
  
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-[11px] text-gray-500 mb-1">성적 요약</div>
          <div className="text-[24px] font-bold text-gray-900">{g.성적요약.최고등급}</div>
          <div className="text-[11px] text-gray-400">{g.성적요약.반영과목}</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-[11px] text-gray-500 mb-1">등급 변화</div>
          <div className="text-[24px] font-bold text-green-500">{g.등급변화값}</div>
          <div className="text-[11px] text-gray-400">{g.성적요약.성적추이}</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-[11px] text-gray-500 mb-1">목표</div>
          <div className="text-[13px] font-medium text-gray-900 mb-1">{g.단기목표}</div>
          <div className="text-[12px] text-gray-500">{g.장기목표}</div>
        </div>
      </div>

      {/* Grade Table */}
      <div>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3">과목별 등급표</h3>
        <table className="w-full text-[12px] border border-gray-200">
          <thead>
            <tr className="bg-[#1B7F9E] text-white">
              <th className="px-3 py-2 text-left">과목</th>
              <th className="px-3 py-2 text-center">1-1</th>
              <th className="px-3 py-2 text-center">1-2</th>
              <th className="px-3 py-2 text-center">2-1</th>
              <th className="px-3 py-2 text-center">2-2</th>
              <th className="px-3 py-2 text-center">3-1</th>
              <th className="px-3 py-2 text-center text-amber-300">평균</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(g.학기별등급표.성적표).map(([subj, scores]) => (
              <tr key={subj} className="border-b border-gray-100">
                <td className="px-3 py-2 font-medium">{subj}</td>
                <td className="px-3 py-2 text-center">{scores['1-1'] || '-'}</td>
                <td className="px-3 py-2 text-center">{scores['1-2'] || '-'}</td>
                <td className="px-3 py-2 text-center">{scores['2-1'] || '-'}</td>
                <td className="px-3 py-2 text-center">{scores['2-2'] || '-'}</td>
                <td className="px-3 py-2 text-center">{scores['3-1'] || '-'}</td>
                <td className="px-3 py-2 text-center font-medium text-amber-600">{scores['과목평균'] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Strengths/Weaknesses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-[13px] font-semibold text-green-700 mb-2">성적 강점</h4>
          {Object.values(g.학기별등급표.성적강점).map((s, i) => (
            <p key={i} className="text-[12px] text-green-600 mb-1">• {s}</p>
          ))}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-[13px] font-semibold text-red-700 mb-2">성적 약점</h4>
          {Object.values(g.학기별등급표.성적약점).map((s, i) => (
            <p key={i} className="text-[12px] text-red-600 mb-1">• {s}</p>
          ))}
        </div>
      </div>

      {/* Improvement */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-[14px] font-semibold text-gray-900 mb-2">성적 보완 방안</h3>
        <p className="text-[13px] font-medium text-[#1B7F9E] mb-2">{g.학기별등급표.성적보완방안.한줄요약설명}</p>
        <p className="text-[12px] text-gray-600">{g.학기별등급표.성적보완방안.본문설명}</p>
      </div>
    </div>
  );
}

// ============================================
// 종합 분석 탭
// ============================================
function ComprehensiveTab({ data, isEditMode }: { data: 종합분석; isEditMode: boolean }) {
  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="flex gap-6">
        <div className="w-24 h-24 rounded-full bg-[#1B7F9E] flex items-center justify-center flex-shrink-0">
          <div className="text-center text-white">
            <div className="text-[28px] font-bold">{data.종합점수.값.replace('점', '')}</div>
            <div className="text-[10px]">종합점수</div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-2">종합 의견</h3>
          <p className="text-[13px] text-gray-600">{data.종합의견.값}</p>
        </div>
      </div>

      {/* 수시카드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-[#1B7F9E] text-white text-[13px] font-medium">경로 A</div>
          <div className="divide-y divide-gray-100">
            {Object.values(data.수시카드.경로A).map((item, i) => (
              <div key={i} className="px-4 py-2 flex justify-between items-center">
                <div>
                  <span className="text-[12px] font-medium text-gray-900">{item.학교이름}</span>
                  <span className="text-[11px] text-gray-500 ml-2">{item.과이름}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  item.종합판단.includes('상향') ? 'bg-red-100 text-red-600' :
                  item.종합판단.includes('적정') ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {item.종합판단.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-amber-500 text-white text-[13px] font-medium">경로 B</div>
          <div className="divide-y divide-gray-100">
            {Object.values(data.수시카드.경로B).map((item, i) => (
              <div key={i} className="px-4 py-2 flex justify-between items-center">
                <div>
                  <span className="text-[12px] font-medium text-gray-900">{item.학교이름}</span>
                  <span className="text-[11px] text-gray-500 ml-2">{item.과이름}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  item.종합판단.includes('상향') ? 'bg-red-100 text-red-600' :
                  item.종합판단.includes('적정') ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {item.종합판단.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 긍정/개선 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-[13px] font-semibold text-green-700 mb-2">긍정적 요소</h4>
          {Object.values(data.긍정적요소).map((s, i) => (
            <p key={i} className="text-[12px] text-green-600 mb-1">• {s}</p>
          ))}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-[13px] font-semibold text-red-700 mb-2">개선 필요</h4>
          {Object.values(data.개선필요사항).map((s, i) => (
            <p key={i} className="text-[12px] text-red-600 mb-1">• {s}</p>
          ))}
        </div>
      </div>

      {/* Advice */}
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-[13px] font-semibold text-gray-900 mb-2">학부모님께</h4>
          <p className="text-[12px] text-gray-600">{data.학부모님께드리는조언}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-[13px] font-semibold text-gray-900 mb-2">학생에게</h4>
          <p className="text-[12px] text-gray-600">{data.학생에게드리는응원의메세지}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-[13px] font-semibold text-gray-900 mb-2">방학 계획</h4>
          <p className="text-[12px] text-gray-600">{data.추천방학계획}</p>
        </div>
      </div>
    </div>
  );
}
