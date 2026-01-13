'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analysisService, updateService } from '@/services/api';
import { MOCK_SAENGGIBU_ANALYSIS, MOCK_GRADE_ANALYSIS, MOCK_COMPREHENSIVE_ANALYSIS } from '@/data/mockAnalysis';
import type { 생기부분석, 성적분석, 종합분석 } from '@/types';

type TabType = 'original' | 'saenggibu' | 'grades' | 'comprehensive';

interface StudentInfo {
  id: string; name: string; school?: string; targetUniversity?: string; targetMajor?: string;
  status: string; documentId?: string; reportId?: string;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const studentId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<TabType>('comprehensive');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saenggibu, setSaenggibu] = useState<생기부분석 | null>(null);
  const [grades, setGrades] = useState<성적분석 | null>(null);
  const [comprehensive, setComprehensive] = useState<종합분석 | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedStudents = localStorage.getItem('registered_students');
        let student: StudentInfo | null = null;
        if (savedStudents) {
          const students = JSON.parse(savedStudents);
          student = students.find((s: StudentInfo) => s.id === studentId);
        }
        if (student) {
          setStudentInfo(student);
          if (student.documentId && student.reportId) {
            try {
              const [saenggibuRes, gradesRes, comprehensiveRes] = await Promise.all([
                analysisService.getSaenggibuAnalysis(student.documentId),
                analysisService.getGradeAnalysis(studentId),
                analysisService.getComprehensiveAnalysis(student.reportId),
              ]);
              if (saenggibuRes.success) setSaenggibu(saenggibuRes.data.생기부_분석);
              if (gradesRes.success) setGrades(gradesRes.data.성적분석);
              if (comprehensiveRes.success) setComprehensive(comprehensiveRes.data.종합분석);
            } catch { setSaenggibu(MOCK_SAENGGIBU_ANALYSIS); setGrades(MOCK_GRADE_ANALYSIS); setComprehensive(MOCK_COMPREHENSIVE_ANALYSIS); }
          } else { setSaenggibu(MOCK_SAENGGIBU_ANALYSIS); setGrades(MOCK_GRADE_ANALYSIS); setComprehensive(MOCK_COMPREHENSIVE_ANALYSIS); }
        } else {
          setStudentInfo({ id: studentId, name: '김학생', school: '현대고등학교', targetMajor: '컴퓨터소프트웨어', status: 'completed' });
          setSaenggibu(MOCK_SAENGGIBU_ANALYSIS); setGrades(MOCK_GRADE_ANALYSIS); setComprehensive(MOCK_COMPREHENSIVE_ANALYSIS);
        }
      } catch { setError('데이터를 불러오는데 실패했습니다.'); setSaenggibu(MOCK_SAENGGIBU_ANALYSIS); setGrades(MOCK_GRADE_ANALYSIS); setComprehensive(MOCK_COMPREHENSIVE_ANALYSIS); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [studentId]);

  const handleSave = async () => {
    if (!studentInfo) return;
    setIsSaving(true);
    try {
      if (studentInfo.documentId && saenggibu) await updateService.updateSaenggibuAnalysis(studentInfo.documentId, saenggibu);
      if (studentInfo.reportId && grades) await updateService.updateGradeAnalysis(studentInfo.reportId, grades);
      if (studentInfo.reportId && comprehensive) await updateService.updateComprehensiveAnalysis(studentInfo.reportId, comprehensive);
      setIsEditMode(false); alert('저장되었습니다.');
    } catch { alert('저장에 실패했습니다.'); }
    finally { setIsSaving(false); }
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const currentTab = activeTab;
    const tabsToCapture: TabType[] = ['saenggibu', 'grades', 'comprehensive'];
    for (let i = 0; i < tabsToCapture.length; i++) {
      setActiveTab(tabsToCapture[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgHeight = (canvas.height * 190) / canvas.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, imgHeight);
    }
    setActiveTab(currentTab);
    pdf.save(`${studentInfo?.name || '학생'}_분석리포트.pdf`);
  };

  const tabs = [
    { id: 'original' as TabType, label: '생기부 원본' },
    { id: 'saenggibu' as TabType, label: '생기부 분석' },
    { id: 'grades' as TabType, label: '성적 분석' },
    { id: 'comprehensive' as TabType, label: '종합 분석' },
  ];

  if (isLoading) return <DashboardLayout><div className="flex items-center justify-center py-32"><div className="w-10 h-10 border-3 border-[#1B7F9E] border-t-transparent rounded-full animate-spin" /></div></DashboardLayout>;

  const displayName = studentInfo?.name || '김학생';
  const displaySchool = studentInfo?.school || '현대고등학교';
  const displayMajor = studentInfo?.targetMajor || '컴퓨터소프트웨어';
  const canViewAnalysis = studentInfo?.status === 'completed' || studentInfo?.status === 'reviewed';

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div><h1 className="text-[22px] font-bold text-gray-900">{displayName}</h1><p className="text-[13px] text-gray-500">{displaySchool} ｜ {displayMajor}</p></div>
          </div>
          {canViewAnalysis && (
            <div className="flex items-center gap-2">
              {isEditMode ? (
                <><button onClick={() => setIsEditMode(false)} className="px-3 py-1.5 text-[12px] text-gray-600">취소</button>
                <button onClick={handleSave} disabled={isSaving} className="px-4 py-1.5 bg-[#1B7F9E] text-white text-[12px] rounded-lg disabled:bg-gray-400">{isSaving ? '저장 중...' : '저장'}</button></>
              ) : (
                <><button onClick={() => setIsEditMode(true)} className="p-2 text-gray-400 hover:text-gray-600" title="수정"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                <button onClick={handleExportPDF} className="p-2 text-gray-400 hover:text-gray-600" title="PDF"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button></>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mb-6">
          {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all ${activeTab === tab.id ? 'bg-[#1B7F9E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{tab.label}</button>))}
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"><p className="text-[13px] text-red-700">{error}</p></div>}
        {!canViewAnalysis && <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center"><svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><h3 className="text-[14px] font-semibold text-amber-800">분석 진행 중</h3><p className="text-[13px] text-amber-700">AI가 분석하고 있습니다.</p></div></div></div>}
        <div ref={printRef} className={`relative ${!canViewAnalysis ? 'select-none' : ''}`}>
          {!canViewAnalysis && <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg min-h-[400px]"><div className="text-center"><div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"><svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div><h3 className="text-[16px] font-semibold text-gray-700 mb-2">분석 결과 대기 중</h3></div></div>}
          <div className={!canViewAnalysis ? 'filter blur-md pointer-events-none' : ''}>
            {activeTab === 'original' && <OriginalTab />}
            {activeTab === 'saenggibu' && saenggibu && <SaenggibuTab data={saenggibu} isEditMode={isEditMode} onUpdate={setSaenggibu} />}
            {activeTab === 'grades' && grades && <GradesTab data={grades} isEditMode={isEditMode} onUpdate={setGrades} />}
            {activeTab === 'comprehensive' && comprehensive && <ComprehensiveTab data={comprehensive} studentName={displayName} isEditMode={isEditMode} onUpdate={setComprehensive} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function EditableText({ value, onChange, isEditMode, multiline = false, className = '' }: { value: string; onChange: (v: string) => void; isEditMode: boolean; multiline?: boolean; className?: string }) {
  if (!isEditMode) return <span className={className}>{value}</span>;
  if (multiline) return <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`w-full p-2 border border-blue-300 rounded-lg focus:border-[#1B7F9E] focus:outline-none resize-none ${className}`} rows={4} />;
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full p-2 border border-blue-300 rounded-lg focus:border-[#1B7F9E] focus:outline-none ${className}`} />;
}

function LineChart({ data, color = '#1B7F9E' }: { data: Record<string, string> | undefined; color?: string }) {
  if (!data) return <div className="h-32 flex items-center justify-center text-gray-400 text-[12px]">데이터 없음</div>;
  const entries = Object.entries(data);
  // 고정 범위: 0~9 (피그마 기준)
  const minVal = 0;
  const maxVal = 9;
  const range = maxVal - minVal;
  // viewBox를 가로로 넓은 비율로 설정 (피그마 박스 비율에 맞춤)
  const width = 300; 
  const height = 120;
  const padding = { top: 25, bottom: 20, left: 25, right: 15 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const points = entries.map(([, v], i) => {
    const val = parseFloat(v) || 0;
    const x = padding.left + (i / (entries.length - 1 || 1)) * chartWidth;
    const y = padding.top + (val / range) * chartHeight;
    return { x, y, val };
  });
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const yLabels = [0, 3, 6, 9];
  
  return (
    <div className="w-full" style={{ aspectRatio: '300 / 120' }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* 그리드 라인 */}
        {yLabels.map((label) => {
          const y = padding.top + (label / range) * chartHeight;
          return <line key={label} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#E5E7EB" strokeWidth="1" />;
        })}
        {/* Y축 라벨 */}
        {yLabels.map((label) => {
          const y = padding.top + (label / range) * chartHeight;
          return <text key={label} x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">{label}</text>;
        })}
        {/* 라인 */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* 포인트 & 값 라벨 */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="11" fill="#374151" fontWeight="500">{p.val.toFixed(1)}</text>
          </g>
        ))}
        {/* X축 라벨 */}
        {entries.map(([label], i) => {
          const x = padding.left + (i / (entries.length - 1 || 1)) * chartWidth;
          return <text key={label} x={x} y={height - 5} textAnchor="middle" fontSize="11" fill="#6B7280">{label}</text>;
        })}
      </svg>
    </div>
  );
}

function OriginalTab() {
  return <div className="bg-white border border-gray-200 rounded-lg p-8"><div className="py-20 text-center text-gray-500"><svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><p>생기부 원본 PDF 뷰어</p></div></div>;
}

function SaenggibuTab({ data, isEditMode, onUpdate }: { data: 생기부분석; isEditMode: boolean; onUpdate: (d: 생기부분석) => void }) {
  const updateField = (path: string[], value: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    let current: Record<string, unknown> = newData;
    for (let i = 0; i < path.length - 1; i++) current = current[path[i]] as Record<string, unknown>;
    current[path[path.length - 1]] = value;
    onUpdate(newData);
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[16px] font-bold text-gray-900 mb-4">강점 요약</h3>
          <ol className="space-y-3 text-[13px] text-gray-700">
            <li className="flex gap-2"><span>1.</span><EditableText value={data.강점요약.첫번째_강점} onChange={(v) => updateField(['강점요약', '첫번째_강점'], v)} isEditMode={isEditMode} className="flex-1" /></li>
            <li className="flex gap-2"><span>2.</span><EditableText value={data.강점요약.두번째_강점} onChange={(v) => updateField(['강점요약', '두번째_강점'], v)} isEditMode={isEditMode} className="flex-1" /></li>
            <li className="flex gap-2"><span>3.</span><EditableText value={data.강점요약.세번째_강점} onChange={(v) => updateField(['강점요약', '세번째_강점'], v)} isEditMode={isEditMode} className="flex-1" /></li>
          </ol>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[16px] font-bold text-gray-900 mb-4">약점 요약</h3>
          <ol className="space-y-3 text-[13px] text-gray-700">
            <li className="flex gap-2"><span>1.</span><EditableText value={data.약점요약.첫번째_약점} onChange={(v) => updateField(['약점요약', '첫번째_약점'], v)} isEditMode={isEditMode} className="flex-1" /></li>
            <li className="flex gap-2"><span>2.</span><EditableText value={data.약점요약.두번째_약점} onChange={(v) => updateField(['약점요약', '두번째_약점'], v)} isEditMode={isEditMode} className="flex-1" /></li>
            <li className="flex gap-2"><span>3.</span><EditableText value={data.약점요약.세번째_약점} onChange={(v) => updateField(['약점요약', '세번째_약점'], v)} isEditMode={isEditMode} className="flex-1" /></li>
          </ol>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[16px] font-bold text-gray-900 mb-4">생활기록부 진단 개요</h3>
        <div className="flex items-start gap-2 mb-3">
          <svg className="w-5 h-5 text-[#1B7F9E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          <EditableText value={data.생기부_진단개요['한줄 요약']} onChange={(v) => updateField(['생기부_진단개요', '한줄 요약'], v)} isEditMode={isEditMode} className="text-[13px] text-gray-900 font-medium flex-1" />
        </div>
        <EditableText value={data.생기부_진단개요.본문} onChange={(v) => updateField(['생기부_진단개요', '본문'], v)} isEditMode={isEditMode} multiline className="text-[13px] text-gray-600 leading-relaxed" />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[16px] font-bold text-gray-900 mb-4">진로적합성 강화 방안</h3>
        <div className="mb-6">
          <div className="flex items-start gap-2 mb-3">
            <svg className="w-5 h-5 text-[#1B7F9E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            <EditableText value={data.진로적합성_강화방안.강화방안.한줄요약} onChange={(v) => updateField(['진로적합성_강화방안', '강화방안', '한줄요약'], v)} isEditMode={isEditMode} className="text-[13px] text-gray-900 font-medium flex-1" />
          </div>
          <EditableText value={data.진로적합성_강화방안.강화방안.설명} onChange={(v) => updateField(['진로적합성_강화방안', '강화방안', '설명'], v)} isEditMode={isEditMode} multiline className="text-[13px] text-gray-600 mb-4" />
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(data.진로적합성_강화방안.강화방안.단계별_방안).map(([step, content]) => (
              <div key={step} className="bg-[#FDF6E3] rounded-lg p-4 text-center">
                <EditableText value={content} onChange={(v) => updateField(['진로적합성_강화방안', '강화방안', '단계별_방안', step], v)} isEditMode={isEditMode} className="text-[12px] font-medium text-[#B8860B]" />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-start gap-2 mb-3">
            <svg className="w-5 h-5 text-[#1B7F9E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            <EditableText value={data.진로적합성_강화방안.비교과_지도필요_영역.한줄요약} onChange={(v) => updateField(['진로적합성_강화방안', '비교과_지도필요_영역', '한줄요약'], v)} isEditMode={isEditMode} className="text-[13px] text-gray-900 font-medium flex-1" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {data.진로적합성_강화방안.비교과_지도필요_영역.프로젝트_및_심화활동_추천.map((proj, idx) => (
              <div key={proj.프로젝트_번호} className="border border-gray-200 rounded-lg p-4">
                <EditableText value={proj.제목} onChange={(v) => { const n = JSON.parse(JSON.stringify(data)); n.진로적합성_강화방안.비교과_지도필요_영역.프로젝트_및_심화활동_추천[idx].제목 = v; onUpdate(n); }} isEditMode={isEditMode} className="text-[13px] font-semibold text-[#1B7F9E] mb-2 block" />
                <EditableText value={proj.내용} onChange={(v) => { const n = JSON.parse(JSON.stringify(data)); n.진로적합성_강화방안.비교과_지도필요_영역.프로젝트_및_심화활동_추천[idx].내용 = v; onUpdate(n); }} isEditMode={isEditMode} multiline className="text-[12px] text-gray-600 leading-relaxed" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[16px] font-bold text-gray-900 mb-4">진로 관련 도서 추천</h3>
        <div className="grid grid-cols-3 gap-4">
          {data.진로적합성_강화방안.전공_관련_탐구_및_독서활동.책_추천.map((book, idx) => (
            <div key={book.책_번호} className="border border-gray-200 rounded-lg p-4">
              <EditableText value={book.제목} onChange={(v) => { const n = JSON.parse(JSON.stringify(data)); n.진로적합성_강화방안.전공_관련_탐구_및_독서활동.책_추천[idx].제목 = v; onUpdate(n); }} isEditMode={isEditMode} className="text-[13px] font-semibold text-[#1B7F9E] mb-2 block" />
              <EditableText value={book.내용} onChange={(v) => { const n = JSON.parse(JSON.stringify(data)); n.진로적합성_강화방안.전공_관련_탐구_및_독서활동.책_추천[idx].내용 = v; onUpdate(n); }} isEditMode={isEditMode} multiline className="text-[12px] text-gray-600 leading-relaxed" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GradesTab({ data, isEditMode, onUpdate }: { data: 성적분석; isEditMode: boolean; onUpdate: (d: 성적분석) => void }) {
  const [subTab, setSubTab] = useState<'naesin' | 'mock'>('naesin');
  const g = data.내신;
  const m = data.모의고사;
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-1 inline-flex">
        <button onClick={() => setSubTab('naesin')} className={`px-8 py-2 text-[13px] font-medium rounded-md transition ${subTab === 'naesin' ? 'bg-[#1B7F9E] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>내신</button>
        <button onClick={() => setSubTab('mock')} className={`px-8 py-2 text-[13px] font-medium rounded-md transition ${subTab === 'mock' ? 'bg-[#1B7F9E] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>모의고사</button>
      </div>
      {subTab === 'naesin' ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-[12px] text-gray-500 mb-1">성적 요약</p>
              <p className="text-[42px] font-bold text-gray-900">{g.성적요약.최고등급}</p>
              <p className="text-[12px] text-gray-400">현재 학생 점수 (등급)</p>
              <button className="mt-3 w-full py-2 bg-[#1B7F9E] text-white text-[12px] rounded-lg">자세한 분석 성적 보기 ↗</button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-[12px] text-gray-500 mb-1">등급 변화</p>
              <p className="text-[42px] font-bold text-red-500">{g.등급변화값}</p>
              <p className="text-[12px] text-[#1B7F9E]">소폭 하락(원인규명이 중요합니다!)</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-[12px] text-gray-500 mb-1">단기 목표</p>
              {isEditMode ? <input type="text" value={g.단기목표} onChange={(e) => onUpdate({ ...data, 내신: { ...g, 단기목표: e.target.value } })} className="w-full p-1 border border-blue-300 rounded text-[14px] font-semibold" /> : <p className="text-[14px] font-semibold text-gray-900 mb-2">{g.단기목표}</p>}
              <p className="text-[12px] text-gray-500 mb-1 mt-2">장기 목표</p>
              {isEditMode ? <input type="text" value={g.장기목표} onChange={(e) => onUpdate({ ...data, 내신: { ...g, 장기목표: e.target.value } })} className="w-full p-1 border border-blue-300 rounded text-[14px] font-semibold" /> : <p className="text-[14px] font-semibold text-gray-900">{g.장기목표}</p>}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">그룹별 성적 추이</h3>
            <div className="grid grid-cols-2 gap-6">
              {['전과목평균', '국수영사과평균', '국수영사평균', '국수영과평균'].map((key) => {
                const graphData = g.학기별성적추이그래프[key] || g.학기별성적추이그래프['전과목'];
                return <div key={key} className="border border-gray-100 rounded-lg p-4"><p className="text-[13px] font-medium text-gray-700 mb-3">{key.replace('평균', ' 평균')}</p><LineChart data={graphData} color="#1B7F9E" /></div>;
              })}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">과목별 성적 추이</h3>
            <div className="grid grid-cols-2 gap-6">
              {['국어과목', '영어과목', '수학과목', '사회과목', '과학과목'].map((key) => {
                const graphData = g.학기별성적추이그래프[key];
                if (!graphData) return null;
                return <div key={key} className="border border-gray-100 rounded-lg p-4"><p className="text-[13px] font-medium text-gray-700 mb-3">{key.replace('과목', '')}</p><LineChart data={graphData} color="#F59E0B" /></div>;
              })}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">평균 등급표</h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-4"><p className="text-[12px] text-gray-500 mb-3">학기별 평균 등급</p><div className="flex gap-4 flex-wrap">{Object.entries(g.학기별등급표.학기별전교과평균등급).map(([sem, val]) => <div key={sem} className="text-center min-w-[40px]"><p className="text-[11px] text-[#1B7F9E]">{sem}</p><p className="text-[14px] font-semibold">{val}</p></div>)}</div></div>
              <div className="border border-gray-200 rounded-lg p-4"><p className="text-[12px] text-gray-500 mb-3">그룹별 평균 등급</p><div className="flex gap-4 flex-wrap">{Object.entries(g.학기별등급표.반영과목별평균등급).map(([k, val]) => <div key={k} className="text-center min-w-[50px]"><p className="text-[11px] text-[#1B7F9E]">{k}</p><p className="text-[14px] font-semibold">{val}</p></div>)}</div></div>
            </div>
            <table className="w-full text-[12px] table-fixed">
              <colgroup>
                <col className="w-[14%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[14%]" />
              </colgroup>
              <thead><tr className="bg-[#1B7F9E] text-white"><th className="px-2 py-2 text-left rounded-tl-lg truncate">과목</th><th className="px-2 py-2 text-center">1-1</th><th className="px-2 py-2 text-center">1-2</th><th className="px-2 py-2 text-center">2-1</th><th className="px-2 py-2 text-center">2-2</th><th className="px-2 py-2 text-center">3-1</th><th className="px-2 py-2 text-center">3-2</th><th className="px-2 py-2 text-center text-amber-300 rounded-tr-lg">과목평균</th></tr></thead>
              <tbody>{Object.entries(g.학기별등급표.성적표).map(([subj, scores]) => <tr key={subj} className="border-b border-gray-100"><td className="px-2 py-2 font-medium truncate" title={subj}>{subj}</td><td className="px-2 py-2 text-center">{scores['1-1'] || '-'}</td><td className="px-2 py-2 text-center">{scores['1-2'] || '-'}</td><td className="px-2 py-2 text-center">{scores['2-1'] || '-'}</td><td className="px-2 py-2 text-center">{scores['2-2'] || '-'}</td><td className="px-2 py-2 text-center">{scores['3-1'] || '-'}</td><td className="px-2 py-2 text-center">{scores['3-2'] || '-'}</td><td className="px-2 py-2 text-center font-semibold text-[#1B7F9E]">{scores['과목평균'] || '-'}</td></tr>)}</tbody>
            </table>
          </div>
          {g.학기별등급표.성적심층분석 && <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-[15px] font-bold text-gray-900 mb-1">성적 심층 분석</h3>
            <p className="text-[12px] text-gray-400 mb-4">9등급제 환산 기준</p>
            <div className="space-y-4">{Object.entries(g.학기별등급표.성적심층분석).map(([subj, info]) => (
              <div key={subj} className="border border-gray-200 rounded-lg p-5">
                <h4 className="text-[14px] font-semibold text-[#1B7F9E] mb-2">{subj}: {info.과목명} ({info.알파벳}등급)</h4>
                <p className="text-[13px] font-medium text-gray-900 mb-3">9등급제 환산 시: {info['5등급제']}등급 → {info['9등급제']}등급</p>
                {isEditMode ? <textarea value={info.분석내용} onChange={(e) => { const n = JSON.parse(JSON.stringify(data)); n.내신.학기별등급표.성적심층분석[subj].분석내용 = e.target.value; onUpdate(n); }} className="w-full p-2 border border-blue-300 rounded text-[13px]" rows={2} /> : <p className="text-[13px] text-gray-600 leading-relaxed">{info.분석내용}</p>}
              </div>
            ))}</div>
          </div>}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">성적 보완 방안</h3>
            <div className="border border-gray-200 rounded-lg p-5">
              <h4 className="text-[14px] font-semibold text-[#1B7F9E] mb-4">보완 전략 요약</h4>
              {g.학기별등급표.성적보완방안.과목별전략 ? (
                <div className="space-y-3">
                  {Object.entries(g.학기별등급표.성적보완방안.과목별전략).map(([subj, strategy]) => (
                    <div key={subj} className="flex items-start gap-3">
                      <span className="px-3 py-1 bg-[#1B7F9E] text-white text-[12px] font-medium rounded-full flex-shrink-0">{subj}</span>
                      {isEditMode ? (
                        <input type="text" value={strategy} onChange={(e) => { const n = JSON.parse(JSON.stringify(data)); n.내신.학기별등급표.성적보완방안.과목별전략[subj] = e.target.value; onUpdate(n); }} className="flex-1 p-1 border border-blue-300 rounded text-[13px]" />
                      ) : (
                        <p className="text-[13px] text-gray-700 leading-relaxed">{strategy}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                isEditMode ? <textarea value={g.학기별등급표.성적보완방안.본문설명} onChange={(e) => { const n = JSON.parse(JSON.stringify(data)); n.내신.학기별등급표.성적보완방안.본문설명 = e.target.value; onUpdate(n); }} className="w-full p-2 border border-blue-300 rounded text-[13px]" rows={6} /> : <div className="space-y-2 text-[13px] text-gray-600">{g.학기별등급표.성적보완방안.본문설명.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
              )}
            </div>
          </div>
        </>
      ) : m && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-[12px] text-gray-500 mb-1">최근 응시 모의고사</p>
              <p className="text-[42px] font-bold text-gray-900">{m.성적요약.최근등급}</p>
              <div className="flex justify-between text-[12px] mt-2">
                <span className="text-gray-500">성적 추이</span>
                <span className="text-[#1B7F9E]">{m.성적요약.성적추이}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">전국 백분위</span>
                <span className="text-[#1B7F9E]">{m.성적요약.전국백분위}</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-[12px] text-gray-500 mb-1">전회차 대비 변동</p>
              <p className="text-[42px] font-bold text-green-500">{m.등급변화값}</p>
              <div className="flex justify-between text-[12px] mt-2">
                <span className="text-gray-500">백분위</span>
                <span className="text-green-500">상승 ↗</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">전국 석차</span>
                <span className="text-[#1B7F9E]">{m.성적요약.전국석차}</span>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-baseline gap-3 mb-4">
              <h3 className="text-[15px] font-bold text-gray-900">그룹별 성적 추이</h3>
              <p className="text-[12px] text-gray-400">최근 모의고사 3회 성적을 기준으로 그래프를 작성하였습니다.</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(m.그룹별성적추이그래프).map(([label, graphData]) => (
                <div key={label} className="border border-gray-100 rounded-lg p-4">
                  <p className="text-[13px] font-medium text-gray-700 mb-3 text-center">{label.replace('평균', ' 평균')}</p>
                  <MockLineChart data={graphData} />
                </div>
              ))}
            </div>
          </div>
          {m.과목별성적추이그래프 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-baseline gap-3 mb-4">
                <h3 className="text-[15px] font-bold text-gray-900">과목별 성적 추이</h3>
                <p className="text-[12px] text-gray-400">최근 모의고사 3회 성적을 기준으로 그래프를 작성하였습니다.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(m.과목별성적추이그래프).map(([label, graphData]) => (
                  <div key={label} className="border border-gray-100 rounded-lg p-4">
                    <p className="text-[13px] font-medium text-gray-700 mb-3 text-center">{label}</p>
                    <MockLineChart data={graphData} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-[15px] font-bold text-gray-900 mb-4">평균 등급표</h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-[12px] text-gray-500 mb-3">평균 등급</p>
                <div className="flex gap-6 justify-center">
                  {['3월', '5월', '6월'].map((month) => (
                    <div key={month} className="text-center">
                      <p className="text-[11px] text-[#1B7F9E]">{month}</p>
                      <p className="text-[14px] font-semibold">{m.평균등급표.월별평균?.[month] || '4.25'}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-[12px] text-gray-500 mb-3">평균 백분위</p>
                <div className="flex gap-6 justify-center">
                  {Object.entries(m.평균등급표.그룹별평균 || { 전과목: '4.25', 국수영사과: '4.08', 국수영과: '3.78' }).map(([group, val]) => (
                    <div key={group} className="text-center">
                      <p className="text-[11px] text-[#1B7F9E]">{group}</p>
                      <p className="text-[14px] font-semibold">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <table className="w-full text-[12px] table-fixed">
              <colgroup>
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead><tr className="bg-[#1B7F9E] text-white"><th className="px-3 py-2 text-left rounded-tl-lg">과목</th><th className="px-3 py-2 text-center">3월</th><th className="px-3 py-2 text-center">5월</th><th className="px-3 py-2 text-center">6월</th><th className="px-3 py-2 text-center text-amber-300 rounded-tr-lg">과목평균</th></tr></thead>
              <tbody>{Object.entries(m.평균등급표.과목별성적표).map(([subj, scores]) => <tr key={subj} className="border-b border-gray-100"><td className="px-3 py-2 font-medium">{subj}</td><td className="px-3 py-2 text-center">{scores['3월'] || '-'}</td><td className="px-3 py-2 text-center">{scores['5월'] || '-'}</td><td className="px-3 py-2 text-center">{scores['6월'] || '-'}</td><td className="px-3 py-2 text-center font-semibold text-[#1B7F9E]">{scores['과목평균'] || '-'}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function MockLineChart({ data }: { data: Record<string, { 등급: string; 백분위: string }> }) {
  const entries = Object.entries(data);
  // 피그마 비율에 맞춘 viewBox
  const width = 400;
  const height = 200;
  const padding = { top: 35, bottom: 45, left: 35, right: 55 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // 바 차트 설정
  const barWidth = 45;
  const totalBarsWidth = barWidth * entries.length;
  const totalGaps = chartWidth - totalBarsWidth;
  const barGap = totalGaps / (entries.length + 1);
  
  // Y축 등급 (좌측): 0~9
  const maxGrade = 9;
  // Y축 백분위 (우측): 0~100%
  const maxPercentile = 100;
  
  const yLabelsGrade = [0, 3, 6, 9];
  const yLabelsPercentile = [100, 80, 40, 0];

  return (
    <div className="w-full" style={{ aspectRatio: '400 / 200' }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* 그리드 라인 */}
        {yLabelsGrade.map((label) => {
          const y = padding.top + (label / maxGrade) * chartHeight;
          return <line key={label} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#E5E7EB" strokeWidth="1" />;
        })}
        
        {/* Y축 라벨 - 등급 (좌측) */}
        {yLabelsGrade.map((label) => {
          const y = padding.top + (label / maxGrade) * chartHeight;
          return <text key={`g-${label}`} x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#9CA3AF">{label}</text>;
        })}
        
        {/* Y축 라벨 - 백분위 (우측) */}
        {yLabelsPercentile.map((label, i) => {
          const y = padding.top + (i / 3) * chartHeight;
          return <text key={`p-${label}`} x={width - padding.right + 8} y={y + 4} textAnchor="start" fontSize="12" fill="#9CA3AF">{label}%</text>;
        })}
        
        {/* 바 차트 (백분위) */}
        {entries.map(([, info], i) => {
          const percentile = parseInt(info.백분위) || 0;
          const barHeight = (percentile / maxPercentile) * chartHeight;
          const x = padding.left + barGap + i * (barWidth + barGap);
          const y = padding.top + chartHeight - barHeight;
          return (
            <rect key={`bar-${i}`} x={x} y={y} width={barWidth} height={barHeight} fill="#93C5E8" rx="3" />
          );
        })}
        
        {/* 꺾은선 (등급) - 전체 path로 그리기 */}
        <path
          d={entries.map(([, info], i) => {
            const grade = parseFloat(info.등급) || 0;
            const x = padding.left + barGap + i * (barWidth + barGap) + barWidth / 2;
            const y = padding.top + (grade / maxGrade) * chartHeight;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* 등급 포인트 + 라벨 (바 위에 표시) */}
        {entries.map(([, info], i) => {
          const grade = parseFloat(info.등급) || 0;
          const x = padding.left + barGap + i * (barWidth + barGap) + barWidth / 2;
          const y = padding.top + (grade / maxGrade) * chartHeight;
          return (
            <g key={`point-${i}`}>
              <circle cx={x} cy={y} r="5" fill="white" stroke="#F59E0B" strokeWidth="2" />
              <text x={x} y={y - 10} textAnchor="middle" fontSize="11" fill="#F59E0B" fontWeight="600">{grade.toFixed(2)}</text>
            </g>
          );
        })}
        
        {/* X축 라벨 */}
        {entries.map(([label], i) => {
          const x = padding.left + barGap + i * (barWidth + barGap) + barWidth / 2;
          return <text key={label} x={x} y={height - padding.bottom + 20} textAnchor="middle" fontSize="12" fill="#6B7280">{label}</text>;
        })}
        
        {/* 범례 */}
        <g transform={`translate(${width / 2 - 50}, ${height - 12})`}>
          <line x1="0" y1="0" x2="12" y2="0" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="6" cy="0" r="3" fill="#F59E0B" />
          <text x="18" y="4" fontSize="11" fill="#6B7280">등급</text>
          <rect x="55" y="-5" width="12" height="10" fill="#93C5E8" rx="1" />
          <text x="72" y="4" fontSize="11" fill="#6B7280">백분위</text>
        </g>
      </svg>
    </div>
  );
}

function ComprehensiveTab({ data, studentName, isEditMode, onUpdate }: { data: 종합분석; studentName: string; isEditMode: boolean; onUpdate: (d: 종합분석) => void }) {
  const updateField = (path: string[], value: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    let current: Record<string, unknown> = newData;
    for (let i = 0; i < path.length - 1; i++) current = current[path[i]] as Record<string, unknown>;
    current[path[path.length - 1]] = value;
    onUpdate(newData);
  };
  
  // 판단 기준 색상
  const getJudgmentStyle = (judgment: string) => {
    if (judgment.includes('적정')) return 'bg-[#D4A84B] text-white';
    if (judgment.includes('소신')) return 'bg-[#1B7F9E] text-white';
    if (judgment.includes('상향')) return 'bg-[#2D5A7B] text-white';
    if (judgment.includes('안전')) return 'bg-[#93C5E8] text-gray-800';
    return 'bg-gray-200 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* 상단: 종합점수 + 의견 + 긍정적요소/개선필요/진로적합도 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 좌측: 종합점수 + 의견 */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-baseline gap-4 mb-4">
            <p className="text-[48px] font-bold text-[#1B7F9E]">{data.종합점수.값}</p>
            <p className="text-[14px] text-gray-400">종합 점수</p>
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-3">의견</h3>
          <EditableText value={data.종합의견.값} onChange={(v) => updateField(['종합의견', '값'], v)} isEditMode={isEditMode} multiline className="text-[13px] text-gray-600 leading-relaxed" />
        </div>
        
        {/* 우측: 긍정적 요소 + 개선 필요사항 + 진로적합도 */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1B7F9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
              긍정적 요소
            </h4>
            {Object.entries(data.긍정적요소).map(([k, v]) => (
              <div key={k} className="flex items-start gap-2 mb-2">
                <svg className="w-4 h-4 text-[#1B7F9E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <EditableText value={v} onChange={(val) => updateField(['긍정적요소', k], val)} isEditMode={isEditMode} className="text-[12px] text-gray-600 flex-1" />
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              개선 필요사항
            </h4>
            {Object.entries(data.개선필요사항).map(([k, v]) => (
              <div key={k} className="flex items-start gap-2 mb-2">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <EditableText value={v} onChange={(val) => updateField(['개선필요사항', k], val)} isEditMode={isEditMode} className="text-[12px] text-gray-600 flex-1" />
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3">진로적합도</h4>
            <div className="space-y-2">
              {['정치외교학', '정치외교학', '정치외교학'].map((major, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[12px] text-gray-600">{major}</span>
                  <span className="text-[12px] font-semibold text-[#1B7F9E]">85%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 희망 대학/학과 예측 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-[15px] font-bold text-gray-900 mb-4">희망 대학/학과 예측</h3>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#1B7F9E] text-white">
                <th className="px-4 py-3 text-left rounded-tl-lg">학교/학과</th>
                <th className="px-4 py-3 text-center rounded-tr-lg">판단</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(data.수시카드.경로A).map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3">{item.학교이름}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded text-[12px] ${getJudgmentStyle(item.종합판단)}`}>{item.종합판단}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 판단 기준 차트 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-[13px] font-semibold text-gray-900 mb-4">판단 기준</h4>
          <div className="relative h-48 flex flex-col justify-end">
            <div className="absolute right-0 top-0 text-[11px] text-gray-400">100%</div>
            <div className="absolute right-0 top-1/4 text-[11px] text-gray-400">70%</div>
            <div className="absolute right-0 top-1/2 text-[11px] text-gray-400">50%</div>
            <div className="absolute right-0 top-3/4 text-[11px] text-gray-400">30%</div>
            <div className="absolute right-0 bottom-0 text-[11px] text-gray-400">0%</div>
            <div className="flex-1 flex flex-col mr-10">
              <div className="bg-[#93C5E8] flex-[30]"></div>
              <div className="bg-[#D4A84B] flex-[20]"></div>
              <div className="bg-[#1B7F9E] flex-[20]"></div>
              <div className="bg-[#2D5A7B] flex-[30]"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-[11px]">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#93C5E8] rounded"></span><span>안전(70%이상)</span><span className="text-gray-400 ml-1">합격 가능성이 높은 구간</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#D4A84B] rounded"></span><span>적정(50~70%)</span><span className="text-gray-400 ml-1">현실적 목표 대학</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#1B7F9E] rounded"></span><span>소신(30~50%)</span><span className="text-gray-400 ml-1">도전 가능한 구간</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#2D5A7B] rounded"></span><span>상향(30%미만)</span><span className="text-gray-400 ml-1">상위 목표 대학</span></div>
          </div>
        </div>
      </div>

      {/* 최종 대학/학과 추천 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">최종 대학/학과 추천</h3>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[#1B7F9E] text-white">
              <th className="px-4 py-3 text-left rounded-tl-lg">학교/학과</th>
              <th className="px-4 py-3 text-center">학교/학과 전형 판단</th>
              <th className="px-4 py-3 text-center rounded-tr-lg">판단</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(data.수시카드.경로B).map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-3">{item.학교이름}</td>
                <td className="px-4 py-3 text-center">{item.과이름}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded text-[12px] ${getJudgmentStyle(item.종합판단)}`}>{item.종합판단}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 수시카드 최종 의견 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">수시카드 최종 의견</h3>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#1B7F9E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          <EditableText value={data.수시카드추천종합의견} onChange={(v) => updateField(['수시카드추천종합의견'], v)} isEditMode={isEditMode} multiline className="text-[13px] text-gray-700 leading-relaxed flex-1" />
        </div>
      </div>

      {/* 학부모님께 드리는 말씀 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">학부모님께 드리는 말씀</h3>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#1B7F9E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          <EditableText value={data.학부모님께드리는조언} onChange={(v) => updateField(['학부모님께드리는조언'], v)} isEditMode={isEditMode} multiline className="text-[13px] text-gray-700 leading-relaxed flex-1" />
        </div>
      </div>

      {/* 추천 방학 계획 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">추천 방학 계획</h3>
        <div className="flex items-start gap-3 mb-6">
          <svg className="w-5 h-5 text-[#1B7F9E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          <EditableText value={data.추천방학계획} onChange={(v) => updateField(['추천방학계획'], v)} isEditMode={isEditMode} multiline className="text-[13px] text-gray-700 leading-relaxed flex-1" />
        </div>
        {/* 과목별 학습 전략 카드 */}
        <div className="grid grid-cols-2 gap-4">
          {['국어 학습 전략', '영어 학습 전략', '수학 학습 전략', '과학 학습 전략'].map((subject, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-[13px] font-semibold text-[#1B7F9E] mb-2">{subject}</h4>
              <p className="text-[12px] text-gray-600 mb-3">비문학 독해 구조 잡기가 핵심입니다. 하루 2지문, 주 10지문을 목표로 꾸준히 품면서 지문 분석 능력을 기릅니다.</p>
              <ul className="text-[11px] text-gray-500 space-y-1">
                <li>• 문단 요약 훈련: 각 문단의 핵심 문장 찾기</li>
                <li>• 구조 파악: 주장-근거, 문제-해결, 비교-대조</li>
                <li>• 보건과학 관련 책 읽기로 배경지식 쌓기</li>
                <li>• 추천 도서: 아플이 길이 되려면, 우리 몸 연대기</li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 학생에게 드리는 조언 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">학생에게 드리는 조언</h3>
        <div className="flex items-start gap-3 mb-4">
          <svg className="w-5 h-5 text-[#1B7F9E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          <EditableText value={data.학생에게드리는응원의메세지} onChange={(v) => updateField(['학생에게드리는응원의메세지'], v)} isEditMode={isEditMode} multiline className="text-[13px] text-gray-700 leading-relaxed flex-1" />
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-[12px] font-medium text-gray-700 mb-2">실천 TIP</p>
          <ol className="text-[12px] text-gray-600 space-y-1">
            <li>1. 매일 조금씩 - 하루 1시간 수학 공부, 매일 코드 한 줄이라도 쓰기</li>
            <li>2. 실수를 두려워하지 말기 - 모답은 실력을 키우는 가장 빠른 길입니다</li>
            <li>3. 과정을 즐기기 - 결과보다 배우는 과정 자체를 소중히 여기세요</li>
          </ol>
        </div>
      </div>

      {/* 총평 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">총평</h3>
        <p className="text-[13px] text-gray-700 leading-relaxed">
          {studentName} 학생의 제시한 목표 대학과 학과 6개를 토대로 현재까지의 학업 성취도와 입시 데이터를 종합적으로 분석한 결과입니다.
          우선 이화여대 뇌인지과학과, 한양대 생명공학과, 서강대 심리학과, 중앙대 생명공학대학은 현재 학생의 현재 성적과 비교했을 때 상향 지원으로 분류됩니다. 
          이는 현 성적으로는 합격이 어렵다는 뜻이 아니라, 추가적인 성적 향상이나 비교과 활동 등의 노력이 더 필요한 대학이라는 의미입니다.
        </p>
      </div>

      {/* 앞으로의 생기부 방향성을 위해 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">앞으로의 생기부 방향성을 위해</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-[13px] font-semibold text-[#1B7F9E] mb-2">1. 우수한 선행연구자료 및 최신 연구동향을 알고 싶다</h4>
            <ul className="text-[12px] text-gray-600 space-y-1 ml-4">
              <li>- DBPia (www.dbpia.co.kr)</li>
              <li>- 학술연구정보서비스 (www.riss.kr)</li>
              <li>- SCIENCEON (scienceon.kisti.re.kr)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-[#1B7F9E] mb-2">2. 국가 공공자료를 활용하고 싶다</h4>
            <ul className="text-[12px] text-gray-600 space-y-1 ml-4">
              <li>- 국가통계포털 (kosis.kr)</li>
              <li>- 공공데이터포털 (www.data.go.kr)</li>
              <li>- 기상자료개방포털 (data.kma.go.kr)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-[#1B7F9E] mb-2">3. 과학일반 분야의 연구주제를 파악하고 싶다</h4>
            <ul className="text-[12px] text-gray-600 space-y-1 ml-4">
              <li>- 국립중앙과학관 (www.science.go.kr)</li>
              <li>- 카오스재단 (kaos.org)</li>
              <li>- 사이언스타임즈 (www.sciencetimes.co.kr)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
