'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  Search,
  Eye,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { mockStudents, mockDocuments, fetchMockData } from '@/data/mockData';
import { formatDate, formatFileSize } from '@/lib/utils';

export default function ConsultantAnalysisPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter for current consultant
  const myStudents = mockStudents.filter(s => s.consultantId === 'consultant-1');

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Get documents with student info
  const analysisData = myStudents.map(student => {
    const doc = mockDocuments.find(d => d.studentId === student.id);
    return {
      ...student,
      document: doc,
      documentStatus: doc?.status || 'no_document',
    };
  });

  const filteredData = analysisData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: analysisData.length,
    noDocument: analysisData.filter(d => !d.document).length,
    uploaded: analysisData.filter(d => d.document?.status === 'uploaded').length,
    analyzing: analysisData.filter(d => d.document?.status === 'analyzing').length,
    analyzed: analysisData.filter(d => d.document?.status === 'analyzed').length,
  };

  const columns = [
    {
      key: 'name',
      title: '학생',
      render: (value: unknown, row: typeof analysisData[0]) => (
        <div>
          <p className="font-medium text-gray-900">{value as string}</p>
          <p className="text-sm text-gray-500">{row.school} {row.grade}학년</p>
        </div>
      ),
    },
    {
      key: 'document',
      title: '생기부 파일',
      render: (value: unknown) => {
        const doc = value as typeof mockDocuments[0] | undefined;
        if (!doc) {
          return <span className="text-gray-400">업로드 필요</span>;
        }
        return (
          <div>
            <p className="text-sm">{doc.fileName}</p>
            <p className="text-xs text-gray-500">{formatFileSize(doc.fileSize)}</p>
          </div>
        );
      },
    },
    {
      key: 'documentStatus',
      title: '분석 상태',
      render: (value: unknown) => {
        const status = value as string;
        if (status === 'no_document') {
          return <StatusBadge status="pending" />;
        }
        return <StatusBadge status={status} />;
      },
    },
    {
      key: 'document',
      title: '업로드일',
      render: (value: unknown) => {
        const doc = value as typeof mockDocuments[0] | undefined;
        return doc ? formatDate(doc.uploadedAt) : '-';
      },
    },
    {
      key: 'actions',
      title: '작업',
      align: 'center' as const,
      render: (_value: unknown, row: typeof analysisData[0]) => {
        if (!row.document) {
          return (
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/consultant/${row.id}?tab=upload`)}
            >
              업로드
            </Button>
          );
        }
        if (row.document.status === 'uploaded') {
          return (
            <Button size="sm" leftIcon={<Play className="h-4 w-4" />}>
              분석 시작
            </Button>
          );
        }
        if (row.document.status === 'analyzing') {
          return (
            <Button size="sm" variant="outline" disabled>
              <RefreshCw className="h-4 w-4 animate-spin mr-1" />
              분석중
            </Button>
          );
        }
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/consultant/${row.id}?tab=result`)}
            leftIcon={<Eye className="h-4 w-4" />}
          >
            결과 보기
          </Button>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">분석 관리</h1>
          <p className="text-gray-500 mt-1">학생 생기부 분석 현황을 관리합니다</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            title="전체 학생"
            value={stats.total}
            icon={BarChart3}
          />
          <StatCard
            title="파일 없음"
            value={stats.noDocument}
            icon={AlertCircle}
          />
          <StatCard
            title="업로드됨"
            value={stats.uploaded}
            icon={Clock}
          />
          <StatCard
            title="분석중"
            value={stats.analyzing}
            icon={RefreshCw}
          />
          <StatCard
            title="분석완료"
            value={stats.analyzed}
            icon={CheckCircle}
          />
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="학생 이름 또는 학교로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            emptyMessage="분석할 학생이 없습니다."
          />
        </div>

        {/* Batch Actions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">일괄 분석</p>
              <p className="text-sm text-blue-600">업로드된 모든 파일의 분석을 시작합니다</p>
            </div>
            <Button leftIcon={<Play className="h-4 w-4" />} disabled={stats.uploaded === 0}>
              {stats.uploaded}개 파일 일괄 분석
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
