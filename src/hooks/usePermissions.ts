/**
 * RBAC (Role-Based Access Control) Hook
 * 사용자 권한 관리를 위한 커스텀 훅
 */

import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { UserRole, ROLE_PERMISSIONS, RolePermissions } from '@/types';

// ============================================
// usePermissions Hook
// ============================================
export function usePermissions(): RolePermissions & { role: UserRole | null } {
  const { user } = useAuthStore();
  
  const permissions = useMemo(() => {
    if (!user) {
      return {
        role: null,
        canManageUsers: false,
        canManageConsultants: false,
        canAssignStudents: false,
        canViewAllStudents: false,
        canEditAnalysis: false,
        canPublishReports: false,
        canManagePayments: false,
        canAccessSettings: false,
      };
    }
    
    return {
      role: user.role,
      ...ROLE_PERMISSIONS[user.role],
    };
  }, [user]);
  
  return permissions;
}

// ============================================
// useHasPermission Hook
// ============================================
export function useHasPermission(permission: keyof RolePermissions): boolean {
  const permissions = usePermissions();
  return permissions[permission] ?? false;
}

// ============================================
// useHasRole Hook
// ============================================
export function useHasRole(roles: UserRole | UserRole[]): boolean {
  const { user } = useAuthStore();
  
  if (!user) return false;
  
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
}

// ============================================
// useCanAccess Hook (페이지 접근 권한)
// ============================================
export function useCanAccess(allowedRoles: UserRole[]): boolean {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated || !user) return false;
  
  return allowedRoles.includes(user.role);
}

// ============================================
// Permission Check Functions (SSR용)
// ============================================
export function checkPermission(
  role: UserRole | undefined,
  permission: keyof RolePermissions
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}

export function checkRole(
  userRole: UserRole | undefined,
  allowedRoles: UserRole[]
): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

// ============================================
// Role Hierarchy
// ============================================
const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 100,
  sales_manager: 80,
  head_consultant: 60,
  consultant: 40,
  student: 20,
};

export function hasHigherOrEqualRole(
  userRole: UserRole | undefined,
  requiredRole: UserRole
): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// ============================================
// Role Labels
// ============================================
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: '관리자',
  sales_manager: '영업관리자',
  head_consultant: '대표컨설턴트',
  consultant: '컨설턴트',
  student: '학생',
};

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] || role;
}
