'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/common/Button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  Download,
  FileText,
} from 'lucide-react';
import { mockAnalysisResults } from '@/data/mockData';

export default function StudentResultsPage() {
  const analysisResult = mockAnalysisResults[0];

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

  if (!analysisResult) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">분석 결과</h1>
            <p className="text-gray-500 mt-1">생활기록부 AI 분석 결과를 확인하세요</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">분석 결과가 없습니다</h3>
            <p className="text-gray-500 mb-4">
              생활기록부를 업로드하고 분석이 완료되면 결과를 확인할 수 있습니다.
            </p>
            <Button onClick={() => window.location.href = '/student/upload'}>
              생기부 업로드하기
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">분석 결과</h1>
            <p className="text-gray-500 mt-1">생활기록부 AI 분석 결과입니다</p>
          </div>
          <Button leftIcon={<Download className="h-4 w-4" />}>
            PDF 다운로드
          </Button>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium opacity-90">종합 점수</h2>
              <p className="text-4xl font-bold mt-2">{analysisResult.overallScore}점</p>
            </div>
            <div className="text-right">
              <BarChart3 className="h-16 w-16 opacity-50" />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">종합 평가</h2>
          <p className="text-gray-700 leading-relaxed">{analysisResult.summary}</p>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-green-200 p-6">
            <h2 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              강점
            </h2>
            <ul className="space-y-3">
              {analysisResult.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-orange-200 p-6">
            <h2 className="text-lg font-semibold text-orange-700 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              개선 필요
            </h2>
            <ul className="space-y-3">
              {analysisResult.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-orange-500 mt-1">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Subject Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">교과 분석</h2>
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
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {subject.subject}
                    </td>
                    <td className="px-4 py-4 text-sm text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {subject.grade}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-center font-medium">
                      {subject.score}점
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getTrendIcon(subject.trend)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {subject.feedback}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">비교과 활동 분석</h2>
          <div className="space-y-4">
            {analysisResult.activityAnalysis.map((activity, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                      {activity.category}
                    </span>
                    <h3 className="font-medium text-gray-900 mt-2">{activity.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{activity.score}</p>
                    <p className="text-xs text-gray-500">점</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700 border-t pt-3">
                  <span className="font-medium">평가:</span> {activity.evaluation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">추천 사항</h2>
          <div className="space-y-3">
            {analysisResult.recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <p className="text-gray-700 pt-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
