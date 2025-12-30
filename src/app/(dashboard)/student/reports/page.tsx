'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  CheckCircle,
} from 'lucide-react';
import { mockReports, mockAnalysisResults } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

export default function StudentReportsPage() {
  const [selectedReport, setSelectedReport] = React.useState<string | null>(null);

  // Mock reports for this student
  const myReports = [
    {
      ...mockReports[0],
      studentId: 'student-1',
    },
  ];

  const analysisResult = mockAnalysisResults[0];

  const handleDownload = async (reportId: string) => {
    console.log('Downloading report:', reportId);
    alert('PDF 다운로드가 시작됩니다.');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">리포트 조회</h1>
          <p className="text-gray-500 mt-1">컨설턴트가 작성한 분석 리포트를 확인하세요</p>
        </div>

        {myReports.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">발행된 리포트가 없습니다</h3>
            <p className="text-gray-500">
              컨설턴트가 분석 리포트를 발행하면 여기에서 확인할 수 있습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="font-semibold text-gray-900">리포트 목록</h2>
              {myReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReport === report.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.title}</p>
                        <p className="text-sm text-gray-500">{formatDate(report.updatedAt)}</p>
                      </div>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>
                </div>
              ))}
            </div>

            {/* Report Detail */}
            <div className="lg:col-span-2">
              {selectedReport ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  {/* Report Header */}
                  <div className="flex items-center justify-between mb-6 pb-6 border-b">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {myReports.find(r => r.id === selectedReport)?.title}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {myReports.find(r => r.id === selectedReport)?.consultantName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(myReports.find(r => r.id === selectedReport)?.updatedAt || '')}
                        </span>
                      </div>
                    </div>
                    <Button
                      leftIcon={<Download className="h-4 w-4" />}
                      onClick={() => handleDownload(selectedReport)}
                    >
                      PDF 다운로드
                    </Button>
                  </div>

                  {/* Report Content Preview */}
                  <div className="space-y-6">
                    {/* Summary */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">종합 평가</h3>
                      <p className="text-gray-700 leading-relaxed">{analysisResult?.summary}</p>
                    </div>

                    {/* Score */}
                    <div className="flex items-center justify-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-blue-600 mb-1">종합 점수</p>
                        <p className="text-4xl font-bold text-blue-700">{analysisResult?.overallScore}점</p>
                      </div>
                    </div>

                    {/* Key Points */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          주요 강점
                        </h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          {analysisResult?.strengths.slice(0, 3).map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-medium text-orange-700 mb-2">개선 권장</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          {analysisResult?.weaknesses.slice(0, 3).map((w, i) => (
                            <li key={i}>• {w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* View Full Report */}
                    <div className="text-center pt-4 border-t">
                      <p className="text-gray-500 text-sm mb-2">
                        전체 리포트는 PDF로 다운로드하여 확인하세요
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(selectedReport)}
                      >
                        전체 리포트 보기
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">리포트를 선택하여 내용을 확인하세요</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
