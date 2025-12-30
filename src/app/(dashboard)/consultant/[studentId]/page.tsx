'use client';

import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { FileUpload } from '@/components/forms/FileUpload';
import {
  ArrowLeft,
  User,
  Target,
  FileText,
  Upload,
  BarChart3,
  Edit,
  Save,
  Download,
  Loader2,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { mockStudents, mockDocuments, mockAnalysisResults, fetchMockData, delay } from '@/data/mockData';
import { formatDate, formatFileSize } from '@/lib/utils';
import Link from 'next/link';

export default function StudentDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const studentId = params.studentId as string;
  const initialTab = searchParams.get('tab') || 'info';

  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Get student data
  const student = mockStudents.find(s => s.id === studentId);
  const studentDocument = mockDocuments.find(d => d.studentId === studentId);
  const analysisResult = mockAnalysisResults[0]; // Use first mock result

  // Editable content
  const [editedSummary, setEditedSummary] = React.useState(analysisResult?.summary || '');
  const [editedRecommendations, setEditedRecommendations] = React.useState(
    analysisResult?.recommendations.join('\n') || ''
  );

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleFileUpload = async (file: File) => {
    // Simulate upload
    await delay(1500);
    console.log('File uploaded:', file.name);
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate analysis process
    await delay(3000);
    setIsAnalyzing(false);
    setActiveTab('result');
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    await delay(1000);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleExportPDF = async () => {
    // Dynamic import for client-side only
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    const element = window.document.getElementById('report-content');
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${student?.name}_분석리포트.pdf`);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">학생을 찾을 수 없습니다.</p>
          <Link href="/consultant" className="text-blue-600 hover:underline mt-2 inline-block">
            목록으로 돌아가기
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'info', label: '기본 정보', icon: User },
    { id: 'upload', label: '생기부 업로드', icon: Upload },
    { id: 'result', label: '분석 결과', icon: BarChart3 },
    { id: 'report', label: '리포트', icon: FileText },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button and header */}
        <div className="flex items-center gap-4">
          <Link
            href="/consultant"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{student.name} 학생</h1>
            <p className="text-gray-500">{student.school} {student.grade}학년</p>
          </div>
          <StatusBadge status={student.status} />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    학생 정보
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">이름</span>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">이메일</span>
                      <span className="font-medium">{student.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">연락처</span>
                      <span className="font-medium">{student.phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">등록일</span>
                      <span className="font-medium">{formatDate(student.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    목표 정보
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">학교</span>
                      <span className="font-medium">{student.school}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">학년</span>
                      <span className="font-medium">{student.grade}학년</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">목표 대학</span>
                      <span className="font-medium">{student.targetUniversity || '-'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">목표 학과</span>
                      <span className="font-medium">{student.targetMajor || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">생활기록부 업로드</h3>
                  <FileUpload
                    onFileSelect={(file) => console.log('Selected:', file.name)}
                    onUpload={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                    maxSize={20 * 1024 * 1024}
                  />
                </div>

                {studentDocument && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">업로드된 파일</h3>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{studentDocument.fileName}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(studentDocument.fileSize)} • {formatDate(studentDocument.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={studentDocument.status} />
                        {studentDocument.status === 'uploaded' && (
                          <Button onClick={handleStartAnalysis} isLoading={isAnalyzing}>
                            {isAnalyzing ? '분석 중...' : '분석 시작'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Result Tab */}
            {activeTab === 'result' && analysisResult && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">종합 평가</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">종합 점수</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {analysisResult.overallScore}점
                      </span>
                    </div>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{editedSummary}</p>
                  )}
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      강점
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      개선 필요
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Subject Analysis */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">교과 분석</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">과목</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">등급</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">점수</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">추세</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">피드백</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {analysisResult.subjectAnalysis.map((subject, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {subject.subject}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {subject.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-center font-medium">
                              {subject.score}점
                            </td>
                            <td className="px-4 py-3 text-center">
                              {getTrendIcon(subject.trend)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {subject.feedback}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">추천 사항</h3>
                  {isEditing ? (
                    <textarea
                      value={editedRecommendations}
                      onChange={(e) => setEditedRecommendations(e.target.value)}
                      className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="각 추천 사항을 줄바꿈으로 구분하세요"
                    />
                  ) : (
                    <ul className="space-y-3">
                      {editedRecommendations.split('\n').filter(Boolean).map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        취소
                      </Button>
                      <Button onClick={handleSaveEdit} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                        저장
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)} leftIcon={<Edit className="h-4 w-4" />}>
                      수정하기
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Report Tab */}
            {activeTab === 'report' && analysisResult && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button onClick={handleExportPDF} leftIcon={<Download className="h-4 w-4" />}>
                    PDF 다운로드
                  </Button>
                </div>

                {/* Report content for PDF export */}
                <div id="report-content" className="bg-white p-8 border border-gray-200 rounded-lg">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">생활기록부 분석 리포트</h1>
                    <p className="text-gray-500 mt-2">{formatDate(new Date().toISOString())}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">학생 정보</h2>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">이름:</span>{' '}
                          <span className="font-medium">{student.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">학교:</span>{' '}
                          <span className="font-medium">{student.school}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">목표 대학:</span>{' '}
                          <span className="font-medium">{student.targetUniversity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">목표 학과:</span>{' '}
                          <span className="font-medium">{student.targetMajor}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">종합 평가</h2>
                      <p className="text-gray-700 leading-relaxed">{editedSummary}</p>
                      <p className="mt-4 text-right">
                        <span className="text-gray-500">종합 점수: </span>
                        <span className="text-2xl font-bold text-blue-600">{analysisResult.overallScore}점</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-green-700 mb-2">강점</h3>
                        <ul className="text-sm space-y-1">
                          {analysisResult.strengths.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-orange-700 mb-2">개선 필요</h3>
                        <ul className="text-sm space-y-1">
                          {analysisResult.weaknesses.map((w, i) => (
                            <li key={i}>• {w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">추천 사항</h2>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        {editedRecommendations.split('\n').filter(Boolean).map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t text-center text-sm text-gray-400">
                    About Consulting - AI 기반 생활기록부 분석 서비스
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
