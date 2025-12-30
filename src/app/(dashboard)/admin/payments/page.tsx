'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  CreditCard,

  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { mockPayments, fetchMockData } from '@/data/mockData';
import { formatDate, formatCurrency } from '@/lib/utils';

type PaymentStatus = 'all' | 'completed' | 'pending' | 'failed' | 'refunded';

export default function AdminPaymentsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<PaymentStatus>('all');
  const [dateRange, setDateRange] = React.useState({ start: '', end: '' });

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = mockPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedAmount = mockPayments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  const columns = [
    {
      key: 'id',
      title: '결제 ID',
      render: (value: unknown) => (
        <span className="font-mono text-sm text-gray-600">{value as string}</span>
      ),
    },
    {
      key: 'userName',
      title: '고객명',
    },
    {
      key: 'description',
      title: '상품',
    },
    {
      key: 'amount',
      title: '금액',
      align: 'right' as const,
      render: (value: unknown) => (
        <span className="font-medium">{formatCurrency(value as number)}</span>
      ),
    },
    {
      key: 'method',
      title: '결제 수단',
    },
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
      render: (_value: unknown, row: typeof mockPayments[0]) => (
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'completed' && (
            <Button variant="ghost" size="sm" className="text-orange-600">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">결제 관리</h1>
            <p className="text-gray-500 mt-1">결제 내역을 조회하고 관리합니다</p>
          </div>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            내보내기
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="총 매출"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="이번 달 결제"
            value={mockPayments.filter(p => p.status === 'completed').length + '건'}
            icon={CreditCard}
          />
          <StatCard
            title="대기 중"
            value={formatCurrency(pendingAmount)}
            icon={AlertCircle}
          />
          <StatCard
            title="환불"
            value={formatCurrency(refundedAmount)}
            icon={RefreshCw}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="결제 ID 또는 고객명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as PaymentStatus)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체 상태</option>
                <option value="completed">완료</option>
                <option value="pending">대기중</option>
                <option value="failed">실패</option>
                <option value="refunded">환불</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400">~</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <DataTable
            columns={columns}
            data={filteredPayments}
            isLoading={isLoading}
            emptyMessage="결제 내역이 없습니다."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
