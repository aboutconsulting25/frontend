'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analysisService, MOCK_ANALYSIS_RESULT } from '@/services/api';
import type { AnalysisResult } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type TabType = 'original' | 'analysis' | 'grades' | 'comprehensive';
type GradeSubTab = '내신' | '모의고사';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('grades');
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await analysisService.getResult(params.id as string);
        setResult(data);
      } catch {
        setResult(MOCK_ANALYSIS_RESULT);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [params.id]);

  const handleExportPDF = async () => {
    if (!reportRef.current || !result) return;
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    const pageHeight = 295;
    while (position < imgHeight) {
      if (position > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, -position, imgWidth, imgHeight);
      position += pageHeight;
    }
    pdf.save(`${result.student_name}_분석리포트.pdf`);
  };

  const handleEditField = (key: string, value: string) => {
    setEditedData(prev => ({ ...prev, [key]: value }));
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
          <div className="text-center">
            <div className="w-10 h-10 mx-auto border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-[14px] text-gray-500">분석 결과를 불러오는 중...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!result) {
    return (
      <DashboardLayout>
        <div className="text-center py-32">
          <p className="text-[16px] text-gray-500">분석 결과를 찾을 수 없습니다.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto">
        {/* Back & Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-[22px] font-semibold text-gray-900">{result.student_name}</h1>
              <p className="text-[13px] text-gray-500">
                {result.school} · 컴퓨터소프트웨어 진로희망
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleExportPDF}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs - Pill Style */}
        <div className="flex items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1B7F9E] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={reportRef}>
          {activeTab === 'original' && <OriginalTab />}
          {activeTab === 'analysis' && (
            <AnalysisTab result={result} isEditMode={isEditMode} editedData={editedData} onEdit={handleEditField} />
          )}
          {activeTab === 'grades' && (
            <GradesTab result={result} isEditMode={isEditMode} editedData={editedData} onEdit={handleEditField} />
          )}
          {activeTab === 'comprehensive' && (
            <ComprehensiveTab result={result} isEditMode={isEditMode} editedData={editedData} onEdit={handleEditField} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ============================================
// 생기부 원본 탭 (Empty State)
// ============================================
function OriginalTab() {
  return (
    <div className="py-20 text-center">
      <p className="text-[15px] text-gray-500 mb-2">생기부 원본 파일이 표시됩니다.</p>
      <p className="text-[13px] text-gray-400">PDF 뷰어가 여기에 렌더링됩니다.</p>
    </div>
  );
}

// ============================================
// 성적 분석 탭
// ============================================
interface TabProps {
  result: AnalysisResult;
  isEditMode: boolean;
  editedData: Record<string, string>;
  onEdit: (key: string, value: string) => void;
}

function GradesTab({ result, isEditMode, editedData, onEdit }: TabProps) {
  const [subTab, setSubTab] = useState<GradeSubTab>('내신');
  const grades = result.성적분석;

  // 차트 데이터 생성
  const createChartData = (subjectGrades: (number | null)[]) => {
    const semesters = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];
    return semesters.map((sem, idx) => ({
      name: sem,
      등급: subjectGrades[idx] ?? null,
    }));
  };

  // 그룹별 평균 계산
  const groupAverages = {
    '인문계': [4.25, 4.08, 3.78, 2, 3.98],
    '수리/영어/사과': [1, 1.5, 2, 4, 2.5, 1],
    '제2외국어': [1, 2, 3, 4, 2.5, 1],
    '예술/체육': [1, 1, 2, 4, 2.5, 1],
  };

  const subjectCharts = [
    { name: '국어', data: grades.과목별성적.find(s => s.과목 === '국어')?.등급 || [] },
    { name: '영어', data: grades.과목별성적.find(s => s.과목 === '영어')?.등급 || [] },
    { name: '수학', data: grades.과목별성적.find(s => s.과목 === '수학')?.등급 || [] },
    { name: '사회', data: grades.과목별성적.find(s => s.과목 === '사회')?.등급 || [] },
    { name: '과학', data: grades.과목별성적.find(s => s.과목 === '물리학')?.등급 || [] },
  ];

  return (
    <div className="space-y-8">
      {/* Sub Tabs - 내신 / 모의고사 */}
      <div className="flex border-b border-gray-200">
        {(['내신', '모의고사'] as GradeSubTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`px-8 py-3 text-[14px] font-medium border-b-2 transition-colors ${
              subTab === tab
                ? 'text-[#1B7F9E] border-[#1B7F9E]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* 성적 요약 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-[12px] text-gray-500 mb-1">성적 요약</div>
          <div className="text-[32px] font-bold text-gray-900 mb-3">4.04</div>
          <div className="text-[11px] text-gray-400 mb-3">전과목 전체 학기 평균</div>
          <div className="space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span className="text-gray-500">성적 추이</span>
              <span className="text-amber-500 font-medium">하락 ↘</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">산출 과목</span>
              <span className="text-gray-900">전 과목</span>
            </div>
          </div>
          <button className="w-full mt-4 py-2.5 bg-[#1B7F9E] text-white text-[13px] font-medium rounded-lg hover:bg-[#166b85] transition-colors">
            대학별 환산 내신 보기
          </button>
        </div>

        {/* 등급 변화 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-[12px] text-gray-500 mb-1">등급 변화</div>
          <div className="text-[32px] font-bold text-red-500 mb-3">-0.43</div>
          <button className="w-full py-2.5 border border-gray-300 text-gray-600 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
            소폭 하락했어 주의가 필요합니다.
          </button>
        </div>

        {/* 목표 */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <div>
            <div className="text-[12px] text-gray-500 mb-1">단기 목표</div>
            <EditableText
              value={editedData['단기목표'] || '평균 3.04등급 달성'}
              fieldKey="단기목표"
              isEditMode={isEditMode}
              onEdit={onEdit}
              className="text-[15px] font-semibold text-gray-900"
            />
          </div>
          <div>
            <div className="text-[12px] text-gray-500 mb-1">장기 목표</div>
            <EditableText
              value={editedData['장기목표'] || '평균 2.54등급 달성'}
              fieldKey="장기목표"
              isEditMode={isEditMode}
              onEdit={onEdit}
              className="text-[15px] font-semibold text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* 그룹별 성적 추이 */}
      <div>
        <h3 className="text-[16px] font-semibold text-gray-900 mb-4">그룹별 성적 추이</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(groupAverages).map(([name, data]) => (
            <div key={name} className="bg-white border border-gray-200 rounded-lg p-4">
              <GradeChart title={name} data={createChartData(data)} color="#F5A623" />
            </div>
          ))}
        </div>
      </div>

      {/* 과목별 성적 추이 */}
      <div>
        <h3 className="text-[16px] font-semibold text-gray-900 mb-4">과목별 성적 추이</h3>
        <div className="grid grid-cols-2 gap-4">
          {subjectCharts.map((subject) => (
            <div key={subject.name} className="bg-white border border-gray-200 rounded-lg p-4">
              <GradeChart title={subject.name} data={createChartData(subject.data)} color="#F5A623" />
            </div>
          ))}
        </div>
      </div>

      {/* 평균 등급표 */}
      <div>
        <h3 className="text-[16px] font-semibold text-gray-900 mb-4">평균 등급표</h3>
        
        {/* 요약 테이블 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-[12px] text-gray-500 mb-3 text-center">학기별 평균 등급</div>
            <div className="flex justify-around text-center">
              {['1-1', '1-2', '2-1', '2-2', '3-1'].map((sem, idx) => (
                <div key={sem}>
                  <div className="text-[11px] text-gray-400 mb-1">{sem}</div>
                  <div className="text-[15px] font-semibold text-gray-900">
                    {[4.25, 4.08, 3.78, 2, 3.98][idx]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-[12px] text-gray-500 mb-3 text-center">그룹별 평균 등급</div>
            <div className="flex justify-around text-center">
              {['문리계', '수리/영어/사', '제2외국어'].map((group, idx) => (
                <div key={group}>
                  <div className="text-[11px] text-gray-400 mb-1">{group}</div>
                  <div className="text-[15px] font-semibold text-gray-900">
                    {[4.25, 4.08, 3.78][idx]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 상세 성적표 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-[#1B7F9E] text-white">
                <th className="px-4 py-3 text-left font-medium">과목</th>
                <th className="px-4 py-3 text-center font-medium">1-1</th>
                <th className="px-4 py-3 text-center font-medium">1-2</th>
                <th className="px-4 py-3 text-center font-medium">2-1</th>
                <th className="px-4 py-3 text-center font-medium">2-2</th>
                <th className="px-4 py-3 text-center font-medium">3-1</th>
                <th className="px-4 py-3 text-center font-medium">3-2</th>
                <th className="px-4 py-3 text-center font-medium text-amber-300">과목평균</th>
              </tr>
            </thead>
            <tbody>
              {grades.과목별성적.map((subject, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{subject.과목}</td>
                  {subject.등급.map((grade, gIdx) => (
                    <td key={gIdx} className="px-4 py-3 text-center text-gray-600">
                      {grade ?? '-'}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center font-medium text-amber-600">
                    {(subject.등급.filter(g => g !== null).reduce((a, b) => a! + b!, 0)! / subject.등급.filter(g => g !== null).length).toFixed(1)}
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

// ============================================
// 생기부 분석 탭
// ============================================
function AnalysisTab({ result, isEditMode, editedData, onEdit }: TabProps) {
  const analysis = result.생기부분석;
  
  return (
    <div className="space-y-6">
      {/* 진단 개요 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-3">생기부 진단 개요</h3>
        <EditableTextArea
          value={editedData['생기부_진단개요'] || analysis.생기부_진단개요}
          fieldKey="생기부_진단개요"
          isEditMode={isEditMode}
          onEdit={onEdit}
          className="text-[13px] text-gray-600 leading-relaxed"
        />
      </div>

      {/* 강점 / 약점 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[15px] font-semibold text-green-600 mb-4">강점 요약</h3>
          <div className="space-y-4">
            {analysis.강점요약.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white text-[12px] font-medium rounded-full flex items-center justify-center">
                  {idx + 1}
                </span>
                <EditableTextArea
                  value={editedData[`강점_${idx}`] || item}
                  fieldKey={`강점_${idx}`}
                  isEditMode={isEditMode}
                  onEdit={onEdit}
                  className="text-[13px] text-gray-600 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[15px] font-semibold text-red-600 mb-4">약점 요약</h3>
          <div className="space-y-4">
            {analysis.약점요약.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white text-[12px] font-medium rounded-full flex items-center justify-center">
                  {idx + 1}
                </span>
                <EditableTextArea
                  value={editedData[`약점_${idx}`] || item}
                  fieldKey={`약점_${idx}`}
                  isEditMode={isEditMode}
                  onEdit={onEdit}
                  className="text-[13px] text-gray-600 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 강화 방안 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-4">진로적합성 강화 방안</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-[13px] font-medium text-[#1B7F9E] mb-2">
            {analysis.진로적합성_강화방안.강화방안.한줄요약}
          </div>
          <EditableTextArea
            value={editedData['강화방안_설명'] || analysis.진로적합성_강화방안.강화방안.설명}
            fieldKey="강화방안_설명"
            isEditMode={isEditMode}
            onEdit={onEdit}
            className="text-[13px] text-gray-600 leading-relaxed"
          />
        </div>
        <div className="space-y-2">
          {analysis.진로적합성_강화방안.강화방안.단계별_방안.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1B7F9E] text-white text-[11px] font-medium rounded-full flex items-center justify-center">
                {idx + 1}
              </span>
              <EditableText
                value={editedData[`단계_${idx}`] || step}
                fieldKey={`단계_${idx}`}
                isEditMode={isEditMode}
                onEdit={onEdit}
                className="text-[13px] text-gray-700"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 프로젝트 추천 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-4">추천 프로젝트</h3>
        <div className="grid grid-cols-3 gap-4">
          {analysis.진로적합성_강화방안.비교과_지도필요_영역.프로젝트_추천.map((project, idx) => (
            <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-[13px] font-medium text-amber-700 mb-2">{project.제목}</h4>
              <EditableTextArea
                value={editedData[`프로젝트_${idx}`] || project.내용}
                fieldKey={`프로젝트_${idx}`}
                isEditMode={isEditMode}
                onEdit={onEdit}
                className="text-[12px] text-amber-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 도서 추천 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-4">추천 도서</h3>
        <div className="grid grid-cols-2 gap-4">
          {analysis.진로적합성_강화방안.전공_관련_탐구_및_독서활동.책_추천.map((book, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-[13px] font-medium text-gray-900 mb-1">{book.제목}</h4>
              <p className="text-[12px] text-gray-500 mb-2">{book.저자}</p>
              <EditableTextArea
                value={editedData[`도서_${idx}`] || book.이유}
                fieldKey={`도서_${idx}`}
                isEditMode={isEditMode}
                onEdit={onEdit}
                className="text-[12px] text-gray-600"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 종합 분석 탭
// ============================================
function ComprehensiveTab({ result, isEditMode, editedData, onEdit }: TabProps) {
  const comp = result.종합분석;
  
  return (
    <div className="space-y-6">
      {/* 종합 점수 & 의견 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <div className="w-28 h-28 rounded-full bg-[#1B7F9E] flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-[36px] font-bold">{comp.종합점수}</div>
                <div className="text-[11px] opacity-80">종합점수</div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-gray-900 mb-2">종합 의견</h3>
            <EditableTextArea
              value={editedData['종합의견'] || comp.종합의견}
              fieldKey="종합의견"
              isEditMode={isEditMode}
              onEdit={onEdit}
              className="text-[13px] text-gray-600 leading-relaxed"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* 수시카드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#1B7F9E] text-white font-medium text-[13px]">경로 A</div>
          <table className="w-full text-[12px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600">대학</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">학과</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">전형</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">판단</th>
              </tr>
            </thead>
            <tbody>
              {comp.수시카드.경로A.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="px-3 py-2 text-gray-900">{item.대학}</td>
                  <td className="px-3 py-2 text-gray-600">{item.학과}</td>
                  <td className="px-3 py-2 text-gray-600">{item.전형}</td>
                  <td className="px-3 py-2 text-center">
                    <JudgmentBadge judgment={item.판단} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-amber-500 text-white font-medium text-[13px]">경로 B</div>
          <table className="w-full text-[12px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600">대학</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">학과</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">전형</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">판단</th>
              </tr>
            </thead>
            <tbody>
              {comp.수시카드.경로B.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="px-3 py-2 text-gray-900">{item.대학}</td>
                  <td className="px-3 py-2 text-gray-600">{item.학과}</td>
                  <td className="px-3 py-2 text-gray-600">{item.전형}</td>
                  <td className="px-3 py-2 text-center">
                    <JudgmentBadge judgment={item.판단} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 긍정적 요소 / 개선 필요 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[15px] font-semibold text-green-600 mb-4">긍정적 요소</h3>
          <ul className="space-y-2">
            {comp.긍정적요소.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <EditableText
                  value={editedData[`긍정_${idx}`] || item}
                  fieldKey={`긍정_${idx}`}
                  isEditMode={isEditMode}
                  onEdit={onEdit}
                  className="text-[13px] text-gray-600"
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[15px] font-semibold text-red-600 mb-4">개선 필요 사항</h3>
          <ul className="space-y-2">
            {comp.개선필요사항.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <EditableText
                  value={editedData[`개선_${idx}`] || item}
                  fieldKey={`개선_${idx}`}
                  isEditMode={isEditMode}
                  onEdit={onEdit}
                  className="text-[13px] text-gray-600"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 조언 섹션들 */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-3">학부모님께 드리는 조언</h3>
          <EditableTextArea
            value={editedData['학부모조언'] || comp.학부모님께드리는조언}
            fieldKey="학부모조언"
            isEditMode={isEditMode}
            onEdit={onEdit}
            className="text-[13px] text-gray-600 leading-relaxed"
          />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-3">학생에게 드리는 응원</h3>
          <EditableTextArea
            value={editedData['학생응원'] || comp.학생에게드리는응원}
            fieldKey="학생응원"
            isEditMode={isEditMode}
            onEdit={onEdit}
            className="text-[13px] text-gray-600 leading-relaxed"
          />
        </div>
      </div>

      {/* 방학 계획 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-semibold text-gray-900 mb-4">추천 방학 계획</h3>
        <div className="grid grid-cols-2 gap-4">
          {comp.추천방학계획.map((plan, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <span className="inline-block px-3 py-1 mb-3 bg-[#1B7F9E] text-white text-[11px] font-medium rounded-full">
                {plan.시기}
              </span>
              <ul className="space-y-1">
                {plan.활동.map((activity, aIdx) => (
                  <li key={aIdx} className="text-[12px] text-gray-600 flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <EditableText
                      value={editedData[`활동_${idx}_${aIdx}`] || activity}
                      fieldKey={`활동_${idx}_${aIdx}`}
                      isEditMode={isEditMode}
                      onEdit={onEdit}
                      className="text-[12px] text-gray-600"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Helper Components
// ============================================
function JudgmentBadge({ judgment }: { judgment: string }) {
  const colors: Record<string, string> = {
    '안정': 'bg-blue-100 text-blue-700',
    '적정': 'bg-green-100 text-green-700',
    '소신': 'bg-amber-100 text-amber-700',
    '상향': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${colors[judgment] || 'bg-gray-100 text-gray-600'}`}>
      {judgment}
    </span>
  );
}

interface EditableProps {
  value: string;
  fieldKey: string;
  isEditMode: boolean;
  onEdit: (key: string, value: string) => void;
  className?: string;
  rows?: number;
}

function EditableText({ value, fieldKey, isEditMode, onEdit, className = '' }: EditableProps) {
  if (isEditMode) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onEdit(fieldKey, e.target.value)}
        className={`w-full px-2 py-1 border border-blue-300 rounded bg-blue-50 focus:outline-none focus:border-blue-500 ${className}`}
      />
    );
  }
  return <span className={className}>{value}</span>;
}

function EditableTextArea({ value, fieldKey, isEditMode, onEdit, className = '', rows = 3 }: EditableProps) {
  if (isEditMode) {
    return (
      <textarea
        value={value}
        onChange={(e) => onEdit(fieldKey, e.target.value)}
        rows={rows}
        className={`w-full px-3 py-2 border border-blue-300 rounded bg-blue-50 focus:outline-none focus:border-blue-500 resize-none ${className}`}
      />
    );
  }
  return <p className={className}>{value}</p>;
}

interface ChartProps {
  title: string;
  data: Array<{ name: string; 등급: number | null }>;
  color: string;
}

function GradeChart({ title, data, color }: ChartProps) {
  return (
    <div>
      <div className="text-[12px] text-gray-500 mb-2 text-center">→ {title}</div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 9]} reversed tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="등급"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
