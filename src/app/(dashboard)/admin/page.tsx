'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Users,
  CreditCard,
  FileText,
  TrendingUp,
  Eye,
  Download,
  Plus,
} from 'lucide-react';
import { mockUsers, mockPayments, mockStudents, fetchMockData } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const stats = [
    {
      title: '전체 회원',
      value: mockUsers.length,
      icon: Users,
      trend: { value: 12, isPositive: true },
    },
    {
      title: '이번 달 결제',
      value: formatCurrency(2100000),
      icon: CreditCard,
      trend: { value: 8, isPositive: true },
    },
    {
      title: '분석 완료',
      value: mockStudents.filter(s => s.status === 'completed').length,
      icon: FileText,
      trend: { value: 15, isPositive: true },
    },
    {
      title: '전환율',
      value: '24%',
      icon: TrendingUp,
      trend: { value: 5, isPositive: true },
    },
  ];

  const paymentColumns = [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'userName', title: '고객명' },
    {
      key: 'amount',
      title: '금액',
      align: 'right' as const,
      render: (value: unknown) => formatCurrency(value as number),
    },
    { key: 'method', title: '결제 방법' },
    {
      key: 'status',
      title: '상태',
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
    {
      key: 'createdAt',
      title: '결제일',
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

  const userColumns = [
    { key: 'name', title: '이름' },
    { key: 'email', title: '이메일' },
    {
      key: 'role',
      title: '역할',
      render: (value: unknown) => {
        const roleLabels: Record<string, string> = {
          admin: '관리자',
          sales_manager: '영업관리자',
          consultant: '컨설턴트',
          student: '학생',
        };
        return roleLabels[value as string] || String(value);
      },
    },
    {
      key: 'createdAt',
      title: '가입일',
      render: (value: unknown) => formatDate(value as string),
    },
    {
      key: 'actions',
      title: '관리',
      align: 'center' as const,
      render: () => (
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
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
            <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-500 mt-1">전체 현황을 한눈에 확인하세요</p>
          </div>
          <Button leftIcon={<Download className="h-4 w-4" />}>
            리포트 다운로드
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
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Tables section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">최근 결제</h2>
              <Button variant="ghost" size="sm">
                전체 보기
              </Button>
            </div>
            <DataTable
              columns={paymentColumns}
              data={mockPayments.slice(0, 5)}
              isLoading={isLoading}
            />
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">회원 목록</h2>
              <Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                회원 추가
              </Button>
            </div>
            <DataTable
              columns={userColumns}
              data={mockUsers}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
