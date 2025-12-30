'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { mockUsers, mockStudents, mockConsultants, fetchMockData } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

type UserType = 'all' | 'admin' | 'sales_manager' | 'consultant' | 'student';

export default function AdminUsersPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRole, setFilterRole] = React.useState<UserType>('all');
  const [showAddModal, setShowAddModal] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Combine all users
  const allUsers = [
    ...mockUsers.map(u => ({ ...u, type: 'user' as const })),
    ...mockStudents.map(s => ({ 
      id: s.id, 
      name: s.name, 
      email: s.email, 
      role: 'student' as const,
      phone: s.phone,
      createdAt: s.createdAt,
      status: s.status,
      type: 'student' as const 
    })),
  ];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: '관리자',
      sales_manager: '영업관리자',
      consultant: '컨설턴트',
      student: '학생',
    };
    return labels[role] || role;
  };

  const columns = [
    {
      key: 'name',
      title: '이름',
      render: (value: unknown, row: typeof allUsers[0]) => (
        <div>
          <p className="font-medium text-gray-900">{value as string}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      title: '역할',
      render: (value: unknown) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
          {getRoleLabel(value as string)}
        </span>
      ),
    },
    { 
      key: 'phone', 
      title: '연락처',
      render: (value: unknown) => (value as string) || '-',
    },
    {
      key: 'createdAt',
      title: '가입일',
      render: (value: unknown) => formatDate(value as string),
    },
    {
      key: 'status',
      title: '상태',
      render: (value: unknown) => value ? <StatusBadge status={value as string} /> : <StatusBadge status="active" />,
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
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
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
            <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
            <p className="text-gray-500 mt-1">전체 회원을 관리합니다</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
              내보내기
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
              회원 추가
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="이름 또는 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as UserType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체 역할</option>
                <option value="admin">관리자</option>
                <option value="sales_manager">영업관리자</option>
                <option value="consultant">컨설턴트</option>
                <option value="student">학생</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '전체', count: allUsers.length, color: 'bg-gray-100' },
            { label: '관리자', count: allUsers.filter(u => u.role === 'admin').length, color: 'bg-purple-100' },
            { label: '컨설턴트', count: mockConsultants.length, color: 'bg-blue-100' },
            { label: '학생', count: mockStudents.length, color: 'bg-green-100' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-lg p-4`}>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.count}명</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <DataTable
            columns={columns}
            data={filteredUsers}
            isLoading={isLoading}
            emptyMessage="검색 결과가 없습니다."
          />
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">회원 추가</h2>
                <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form className="space-y-4">
                <Input label="이름" placeholder="이름을 입력하세요" />
                <Input label="이메일" type="email" placeholder="이메일을 입력하세요" />
                <Input label="연락처" placeholder="연락처를 입력하세요" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">역할</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="student">학생</option>
                    <option value="consultant">컨설턴트</option>
                    <option value="sales_manager">영업관리자</option>
                    <option value="admin">관리자</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>
                    취소
                  </Button>
                  <Button type="submit">추가</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
