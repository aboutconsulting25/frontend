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
  Upload,
  FileText,
  BarChart3,
} from 'lucide-react';
import { mockStudents, fetchMockData } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

type StudentStatus = 'all' | 'pending' | 'analyzing' | 'completed' | 'reviewed';

export default function ConsultantStudentsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<StudentStatus>('all');

  // Filter students for current consultant (consultant-1)
  const myStudents = mockStudents.filter(s => s.consultantId === 'consultant-1');

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredStudents = myStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      title: '학생명',
      render: (value: unknown, row: typeof mockStudents[0]) => (
        <div>
          <p className="font-medium text-gray-900">{value as string}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'school',
      title: '학교',
      render: (value: unknown, row: typeof mockStudents[0]) => (
        <div>
          <p>{value as string}</p>
          <p className="text-sm text-gray-500">{row.grade}학년</p>
        </div>
      ),
    },
    {
      key: 'targetUniversity',
      title: '목표',
      render: (value: unknown, row: typeof mockStudents[0]) => (
        <div>
          <p>{value as string || '-'}</p>
          <p className="text-sm text-gray-500">{row.targetMajor || '-'}</p>
        </div>
      ),
    },
    {
      key: 'status',
      title: '상태',
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
    {
      key: 'createdAt',
      title: '등록일',
      render: (value: unknown) => formatDate(value as string),
    },
    {
      key: 'actions',
      title: '관리',
      align: 'center' as const,
      render: (_value: unknown, row: typeof mockStudents[0]) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/consultant/${row.id}`)}
            title="상세 보기"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/consultant/${row.id}?tab=upload`)}
              title="생기부 업로드"
            >
              <Upload className="h-4 w-4" />
            </Button>
          )}
          {(row.status === 'completed' || row.status === 'reviewed') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/consultant/${row.id}?tab=result`)}
              title="분석 결과"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          )}
          {row.status === 'reviewed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/consultant/${row.id}?tab=report`)}
              title="리포트"
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const statusCounts = {
    all: myStudents.length,
    pending: myStudents.filter(s => s.status === 'pending').length,
    analyzing: myStudents.filter(s => s.status === 'analyzing').length,
    completed: myStudents.filter(s => s.status === 'completed').length,
    reviewed: myStudents.filter(s => s.status === 'reviewed').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">학생 관리</h1>
          <p className="text-gray-500 mt-1">담당 학생 목록을 관리합니다</p>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: '전체' },
            { value: 'pending', label: '대기중' },
            { value: 'analyzing', label: '분석중' },
            { value: 'completed', label: '완료' },
            { value: 'reviewed', label: '검토완료' },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value as StudentStatus)}
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
            data={filteredStudents}
            isLoading={isLoading}
            onRowClick={(row) => router.push(`/consultant/${row.id}`)}
            emptyMessage="해당하는 학생이 없습니다."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
