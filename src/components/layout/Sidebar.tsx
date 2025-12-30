'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  FileText,
  Upload,
  BarChart3,
  UserCheck,
  GraduationCap,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { UserRole } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

// Extended roles to include representative
type ExtendedRole = UserRole | 'representative';

interface ExtendedNavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: ExtendedRole[];
}

const navItems: ExtendedNavItem[] = [
  // Admin items
  {
    title: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['admin'],
  },
  {
    title: '회원 관리',
    href: '/admin/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    title: '결제 관리',
    href: '/admin/payments',
    icon: CreditCard,
    roles: ['admin'],
  },
  {
    title: '시스템 설정',
    href: '/admin/settings',
    icon: Settings,
    roles: ['admin'],
  },

  // Representative Consultant items
  {
    title: '대시보드',
    href: '/representative',
    icon: LayoutDashboard,
    roles: ['representative'],
  },
  {
    title: '컨설턴트 관리',
    href: '/representative',
    icon: UserCheck,
    roles: ['representative'],
  },
  {
    title: '학생 배정',
    href: '/representative',
    icon: GraduationCap,
    roles: ['representative'],
  },

  // Sales Manager items
  {
    title: '대시보드',
    href: '/sales-manager',
    icon: LayoutDashboard,
    roles: ['sales_manager'],
  },
  {
    title: '컨설턴트 관리',
    href: '/sales-manager/consultants',
    icon: UserCheck,
    roles: ['sales_manager'],
  },
  {
    title: '학생 현황',
    href: '/sales-manager/students',
    icon: GraduationCap,
    roles: ['sales_manager'],
  },
  {
    title: '실적 현황',
    href: '/sales-manager/performance',
    icon: BarChart3,
    roles: ['sales_manager'],
  },

  // Consultant items
  {
    title: '대시보드',
    href: '/consultant',
    icon: LayoutDashboard,
    roles: ['consultant'],
  },
  {
    title: '학생 관리',
    href: '/consultant/students',
    icon: GraduationCap,
    roles: ['consultant'],
  },
  {
    title: '분석 관리',
    href: '/consultant/analysis',
    icon: BarChart3,
    roles: ['consultant'],
  },
  {
    title: '리포트 관리',
    href: '/consultant/reports',
    icon: ClipboardList,
    roles: ['consultant'],
  },

  // Student items
  {
    title: '대시보드',
    href: '/student',
    icon: LayoutDashboard,
    roles: ['student'],
  },
  {
    title: '생기부 업로드',
    href: '/student/upload',
    icon: Upload,
    roles: ['student'],
  },
  {
    title: '분석 결과',
    href: '/student/results',
    icon: BarChart3,
    roles: ['student'],
  },
  {
    title: '리포트 조회',
    href: '/student/reports',
    icon: FileText,
    roles: ['student'],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            {!isCollapsed && (
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="About Consulting"
                  width={150}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            )}
            {isCollapsed && (
              <Link href="/" className="flex items-center justify-center w-full">
                <Image
                  src="/images/logo-black.png"
                  alt="AX"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                  priority
                />
              </Link>
            )}
            <button
              className="hidden lg:block p-1.5 rounded-md hover:bg-gray-100"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-blue-600')} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            {user && !isCollapsed && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors',
                isCollapsed && 'justify-center'
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>로그아웃</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
