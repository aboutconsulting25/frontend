'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { FileUpload } from '@/components/forms/FileUpload';
import {
  FileText,
  Upload,
  BarChart3,
  Clock,
  CheckCircle,
  Download,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { mockDocuments, mockAnalysisResults, fetchMockData, delay } from '@/data/mockData';
import { formatDate, formatFileSize } from '@/lib/utils';

export default function StudentDashboardPage() {
  const [, setIsLoading] = React.useState(true);

  // Mock data for current student (student-1)
  const document = mockDocuments.find(d => d.studentId === 'student-1');
  const analysisResult = mockAnalysisResults[0];

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleFileUpload = async (file: File) => {
    await delay(1500);
    console.log('File uploaded:', file.name);
  };

  const stats = [
    {
      title: '업로드 현황',
      value: document ? '완료' : '미완료',
      icon: Upload,
    },
    {
      title: '분석 상태',
      value: document?.status === 'analyzed' ? '완료' : '진행 중',
      icon: BarChart3,
    },
    {
      title: '리포트',
      value: analysisResult ? '열람 가능' : '준비 중',
      icon: FileText,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">마이 페이지</h1>
          <p className="text-gray-500 mt-1">생활기록부 분석 현황을 확인하세요</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Main content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              생활기록부 업로드
            </h2>

            {document ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{document.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(document.fileSize)} • {formatDate(document.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={document.status} />
                </div>

                {document.status === 'analyzed' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">분석이 완료되었습니다!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      아래에서 분석 결과를 확인하세요.
                    </p>
                  </div>
                )}

                {document.status === 'analyzing' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Clock className="h-5 w-5 animate-pulse" />
                      <span className="font-medium">분석이 진행 중입니다</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      분석이 완료되면 알림을 보내드립니다.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <FileUpload
                  onFileSelect={(file) => console.log('Selected:', file.name)}
                  onUpload={handleFileUpload}
                  accept=".pdf"
                  maxSize={20 * 1024 * 1024}
                />
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-700">업로드 안내</p>
                      <ul className="text-sm text-yellow-600 mt-1 space-y-1">
                        <li>• PDF 형식의 생활기록부만 업로드 가능합니다</li>
                        <li>• 파일 크기는 최대 20MB까지 가능합니다</li>
                        <li>• 업로드 후 분석에는 1~2일이 소요됩니다</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">진행 상황</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: '생기부 업로드', status: document ? 'completed' : 'pending' },
                { step: 2, title: 'AI 분석', status: document?.status === 'analyzed' ? 'completed' : document ? 'current' : 'pending' },
                { step: 3, title: '컨설턴트 검토', status: analysisResult ? 'completed' : 'pending' },
                { step: 4, title: '리포트 발행', status: analysisResult ? 'completed' : 'pending' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      item.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : item.status === 'current'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {item.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      item.step
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        item.status === 'completed'
                          ? 'text-green-600'
                          : item.status === 'current'
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.status === 'current' && (
                      <p className="text-xs text-blue-500">진행 중...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis Result Preview */}
        {analysisResult && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                분석 결과 요약
              </h2>
              <Button variant="outline" leftIcon={<Eye className="h-4 w-4" />}>
                상세 보기
              </Button>
            </div>

            <div className="space-y-4">
              {/* Overall Score */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">종합 점수</span>
                <span className="text-3xl font-bold text-blue-600">{analysisResult.overallScore}점</span>
              </div>

              {/* Summary */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">종합 평가</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {analysisResult.summary.slice(0, 200)}...
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">강점</p>
                  <p className="text-xl font-bold text-green-700">{analysisResult.strengths.length}개</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-600">개선 필요</p>
                  <p className="text-xl font-bold text-orange-700">{analysisResult.weaknesses.length}개</p>
                </div>
              </div>

              {/* Download Report */}
              <div className="pt-4 border-t">
                <Button className="w-full" leftIcon={<Download className="h-4 w-4" />}>
                  분석 리포트 다운로드 (PDF)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
