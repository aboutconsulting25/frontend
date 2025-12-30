'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Users,
  GraduationCap,
  BarChart3,
  Target,
  Eye,
  Plus,
} from 'lucide-react';
import { mockConsultants, mockStudents, fetchMockData } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

export default function SalesManagerDashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'consultants' | 'students'>('consultants');

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const stats = [
    {
      title: '담당 컨설턴트',
      value: mockConsultants.length,
      icon: Users,
      description: '활성: ' + mockConsultants.filter(c => c.status === 'active').length,
    },
    {
      title: '전체 학생',
      value: mockStudents.length,
      icon: GraduationCap,
      trend: { value: 8, isPositive: true },
    },
    {
      title: '이번 달 실적',
      value: '85%',
      icon: BarChart3,
      trend: { value: 12, isPositive: true },
    },
    {
      title: '목표 달성률',
      value: '92%',
      icon: Target,
      trend: { value: 5, isPositive: true },
    },
  ];

  const consultantColumns = [
    { key: 'name', title: '이름' },
    { key: 'email', title: '이메일' },
    { key: 'phone', title: '연락처' },
    { key: 'specialty', title: '전문 분야' },
    {
      key: 'studentCount',
      title: '담당 학생',
      align: 'center' as const,
      render: (value: unknown) => `${value}명`,
    },
    {
      key: 'status',
      title: '상태',
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
    {
      key: 'actions',
      title: '관리',
      align: 'center' as const,
      render: () => (
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const studentColumns = [
    { key: 'name', title: '이름' },
    { key: 'school', title: '학교' },
    {
      key: 'grade',
      title: '학년',
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
      render: () => (
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">영업 관리자 대시보드</h1>
            <p className="text-gray-500 mt-1">컨설턴트와 학생 현황을 관리하세요</p>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            컨설턴트 배정
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Tabs and Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tab buttons */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('consultants')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'consultants'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              컨설턴트 목록
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'students'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              학생 현황
            </button>
          </div>

          {/* Table content */}
          <div className="p-6">
            {activeTab === 'consultants' ? (
              <DataTable
                columns={consultantColumns}
                data={mockConsultants}
                isLoading={isLoading}
                emptyMessage="등록된 컨설턴트가 없습니다."
              />
            ) : (
              <DataTable
                columns={studentColumns}
                data={mockStudents}
                isLoading={isLoading}
                emptyMessage="등록된 학생이 없습니다."
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
