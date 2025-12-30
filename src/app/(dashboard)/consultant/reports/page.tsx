'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Search,
  Eye,
  Download,
  Edit,
  Send,

  Plus,
} from 'lucide-react';
import { mockReports, mockStudents, fetchMockData } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

export default function ConsultantReportsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'draft' | 'review' | 'approved' | 'published'>('all');

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Mock more reports
  const allReports = [
    ...mockReports,
    {
      id: 'report-2',
      studentId: 'student-2',
      studentName: '김학생',
      consultantId: 'consultant-1',
      consultantName: '박컨설턴트',
      title: '2024학년도 생활기록부 분석 리포트',
      content: '분석 내용...',
      status: 'draft' as const,
      createdAt: '2024-07-01',
      updatedAt: '2024-07-05',
    },
    {
      id: 'report-3',
      studentId: 'student-3',
      studentName: '이학생',
      consultantId: 'consultant-1',
      consultantName: '박컨설턴트',
      title: '2024학년도 생활기록부 분석 리포트',
      content: '분석 내용...',
      status: 'review' as const,
      createdAt: '2024-07-10',
      updatedAt: '2024-07-12',
    },
  ];

  const filteredReports = allReports.filter(report => {
    const matchesSearch = report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'studentName',
      title: '학생',
      render: (value: unknown, row: typeof allReports[0]) => {
        const student = mockStudents.find(s => s.id === row.studentId);
        return (
          <div>
            <p className="font-medium text-gray-900">{value as string}</p>
            <p className="text-sm text-gray-500">{student?.school || '-'}</p>
          </div>
        );
      },
    },
    {
      key: 'title',
      title: '리포트 제목',
    },
    {
      key: 'status',
      title: '상태',
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
    {
      key: 'createdAt',
      title: '생성일',
      render: (value: unknown) => formatDate(value as string),
    },
    {
      key: 'updatedAt',
      title: '수정일',
      render: (value: unknown) => formatDate(value as string),
    },
    {
      key: 'actions',
      title: '작업',
      align: 'center' as const,
      render: (_value: unknown, row: typeof allReports[0]) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/consultant/${row.studentId}?tab=report`)}
            title="보기"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status !== 'published' && (
            <Button variant="ghost" size="sm" title="수정">
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" title="다운로드">
            <Download className="h-4 w-4" />
          </Button>
          {row.status === 'approved' && (
            <Button variant="ghost" size="sm" className="text-green-600" title="발행">
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const statusCounts = {
    all: allReports.length,
    draft: allReports.filter(r => r.status === 'draft').length,
    review: allReports.filter(r => r.status === 'review').length,
    approved: allReports.filter(r => r.status === 'approved').length,
    published: allReports.filter(r => r.status === 'published').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">리포트 관리</h1>
            <p className="text-gray-500 mt-1">학생 분석 리포트를 관리합니다</p>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            새 리포트 작성
          </Button>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: '전체' },
            { value: 'draft', label: '초안' },
            { value: 'review', label: '검토중' },
            { value: 'approved', label: '승인됨' },
            { value: 'published', label: '발행됨' },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value as typeof filterStatus)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label} ({statusCounts[status.value as keyof typeof statusCounts]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="학생 이름 또는 리포트 제목으로 검색..."
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
            data={filteredReports}
            isLoading={isLoading}
            emptyMessage="리포트가 없습니다."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
