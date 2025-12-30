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
  UserPlus,
  BarChart3,
  Eye,
  Plus,
  Search,

} from 'lucide-react';
import { mockConsultants, mockStudents, fetchMockData } from '@/data/mockData';
import { formatDate } from '@/lib/utils';

export default function RepresentativeDashboardPage() {
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'consultants' | 'students' | 'assignment'>('consultants');
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const loadData = async () => {
      await fetchMockData(null, 500);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const stats = [
    {
      title: 'A 컨설턴트',
      value: mockConsultants.length,
      icon: Users,
    },
    {
      title: '전체 학생',
      value: mockStudents.length,
      icon: GraduationCap,
    },
    {
      title: '미배정 학생',
      value: 2,
      icon: UserPlus,
    },
    {
      title: '분석 완료율',
      value: '68%',
      icon: BarChart3,
    },
  ];

  const consultantColumns = [
    {
      key: 'name',
      title: '컨설턴트명',
      render: (value: unknown, row: typeof mockConsultants[0]) => (
        <div>
          <p className="font-medium text-gray-900">{value as string}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    },
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
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            학생 배정
          </Button>
        </div>
      ),
    },
  ];

  const studentColumns = [
    {
      key: 'name',
      title: '학생명',
      render: (value: unknown, row: typeof mockStudents[0]) => (
        <div>
          <p className="font-medium text-gray-900">{value as string}</p>
          <p className="text-sm text-gray-500">{row.school}</p>
        </div>
      ),
    },
    {
      key: 'grade',
      title: '학년',
      render: (value: unknown) => `${value}학년`,
    },
    {
      key: 'consultantId',
      title: '담당 컨설턴트',
      render: (value: unknown) => {
        const consultant = mockConsultants.find(c => c.id === value);
        return consultant?.name || '미배정';
      },
    },
    {
      key: 'status',
      title: '분석 상태',
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

  // Unassigned students (mock)
  const unassignedStudents = [
    { id: 'new-1', name: '신규학생1', school: '서울고등학교', grade: 2, email: 'new1@student.kr' },
    { id: 'new-2', name: '신규학생2', school: '한국고등학교', grade: 3, email: 'new2@student.kr' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">대표 컨설턴트 대시보드</h1>
            <p className="text-gray-500 mt-1">컨설턴트와 학생을 관리하고 배정합니다</p>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            신규 컨설턴트 등록
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'consultants', label: '컨설턴트 명단' },
              { id: 'students', label: '학생 명단' },
              { id: 'assignment', label: '학생 배정' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="mb-4 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {activeTab === 'consultants' && (
              <DataTable
                columns={consultantColumns}
                data={mockConsultants}
                isLoading={isLoading}
                emptyMessage="등록된 컨설턴트가 없습니다."
              />
            )}

            {activeTab === 'students' && (
              <DataTable
                columns={studentColumns}
                data={mockStudents}
                isLoading={isLoading}
                emptyMessage="등록된 학생이 없습니다."
              />
            )}

            {activeTab === 'assignment' && (
              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-medium text-yellow-800">
                    미배정 학생 {unassignedStudents.length}명
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    아래 학생들을 컨설턴트에게 배정해주세요.
                  </p>
                </div>

                <div className="space-y-4">
                  {unassignedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">
                          {student.school} {student.grade}학년
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">컨설턴트 선택</option>
                          {mockConsultants.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.specialty})
                            </option>
                          ))}
                        </select>
                        <Button size="sm">배정</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
