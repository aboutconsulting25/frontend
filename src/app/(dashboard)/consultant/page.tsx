'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  GraduationCap,
  Clock,
  CheckCircle,
  Eye,
  Upload,
  BarChart3,
} from 'lucide-react';
import { mockStudents, fetchMockData } from '@/data/mockData';
import { formatDate } from '@/lib/utils';
import type { Student } from '@/types';

export default function ConsultantDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  // Filter students for current consultant (consultant-1)
  const myStudents = mockStudents.filter(s => s.consultantId === 'consultant-1');

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const stats = [
    {
      title: '담당 학생',
      value: myStudents.length,
      icon: GraduationCap,
    },
    {
      title: '분석 대기',
      value: myStudents.filter(s => s.status === 'pending').length,
      icon: Clock,
    },
    {
      title: '분석 중',
      value: myStudents.filter(s => s.status === 'analyzing').length,
      icon: BarChart3,
    },
    {
      title: '완료',
      value: myStudents.filter(s => s.status === 'completed' || s.status === 'reviewed').length,
      icon: CheckCircle,
    },
  ];

  const studentColumns = [
    {
      key: 'name',
      title: '이름',
      render: (value: unknown, row: Student) => (
        <div>
          <p className="font-medium text-gray-900">{value as string}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'school', title: '학교' },
    {
      key: 'grade',
      title: '학년',
      align: 'center' as const,
      render: (value: unknown) => `${value}학년`,
    },
    { key: 'targetUniversity', title: '목표 대학' },
    { key: 'targetMajor', title: '목표 학과' },
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
      render: (_: unknown, row: Student) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/consultant/${row.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/consultant/${row.id}?tab=upload`)}
            >
              <Upload className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">컨설턴트 대시보드</h1>
            <p className="text-gray-500 mt-1">담당 학생의 분석 현황을 확인하세요</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">담당 학생 목록</h2>
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">전체 상태</option>
                <option value="pending">대기중</option>
                <option value="analyzing">분석중</option>
                <option value="completed">완료</option>
                <option value="reviewed">검토완료</option>
              </select>
            </div>
          </div>
          <DataTable
            columns={studentColumns}
            data={myStudents}
            isLoading={isLoading}
            onRowClick={(row) => router.push(`/consultant/${row.id}`)}
            emptyMessage="담당 학생이 없습니다."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
