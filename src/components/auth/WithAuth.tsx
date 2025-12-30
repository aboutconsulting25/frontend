'use client';

/**
 * WithAuth HOC
 * 인증 및 권한 검사를 위한 Higher Order Component
 */

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, getDashboardRoute } from '@/store/authStore';
import { UserRole, ROLE_PERMISSIONS, RolePermissions } from '@/types';

interface WithAuthOptions {
  allowedRoles?: UserRole[];
  requiredPermissions?: (keyof RolePermissions)[];
  redirectTo?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { allowedRoles, requiredPermissions, redirectTo = '/login' } = options;

  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
      // 미인증 사용자
      if (!isAuthenticated || !user) {
        router.push(redirectTo);
        return;
      }

      // 역할 검사
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          // 권한 없음 - 자신의 대시보드로 리다이렉트
          router.push(getDashboardRoute(user.role));
          return;
        }
      }

      // 권한 검사
      if (requiredPermissions && requiredPermissions.length > 0) {
        const userPermissions = ROLE_PERMISSIONS[user.role];
        const hasAllPermissions = requiredPermissions.every(
          (permission) => userPermissions[permission]
        );
        
        if (!hasAllPermissions) {
          router.push(getDashboardRoute(user.role));
          return;
        }
      }
    }, [isAuthenticated, user, router]);

    // 로딩 또는 리다이렉트 중
    if (!isAuthenticated || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-gray-500">인증 확인 중...</p>
          </div>
        </div>
      );
    }

    // 역할 체크
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// ============================================
// ProtectedRoute Component
// ============================================
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: (keyof RolePermissions)[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requiredPermissions,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // 역할 검사
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">접근 권한이 없습니다</h2>
          <p className="text-gray-500">이 페이지에 접근할 수 없습니다.</p>
        </div>
      </div>
    );
  }

  // 권한 검사
  if (requiredPermissions) {
    const userPermissions = ROLE_PERMISSIONS[user.role];
    const hasAllPermissions = requiredPermissions.every(
      (permission) => userPermissions[permission]
    );
    
    if (!hasAllPermissions) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">권한이 부족합니다</h2>
            <p className="text-gray-500">이 기능을 사용할 수 없습니다.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// ============================================
// Permission Gate Component
// ============================================
interface PermissionGateProps {
  children: React.ReactNode;
  permission: keyof RolePermissions;
  fallback?: React.ReactNode;
}

export function PermissionGate({ children, permission, fallback = null }: PermissionGateProps) {
  const { user } = useAuthStore();

  if (!user) return null;

  const hasPermission = ROLE_PERMISSIONS[user.role]?.[permission] ?? false;

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

// ============================================
// RoleGate Component
// ============================================
interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
