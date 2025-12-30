import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find user by email (mock authentication)
        const user = mockUsers.find(u => u.email === email);
        
        if (user && password === 'password123') {
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } else {
          set({ 
            error: '이메일 또는 비밀번호가 올바르지 않습니다.', 
            isLoading: false 
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Helper function to get dashboard route based on role
export function getDashboardRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    admin: '/admin',
    sales_manager: '/sales-manager',
    head_consultant: '/representative',
    consultant: '/consultant',
    student: '/student',
  };
  return routes[role];
}

// Helper function to check if user has access to a route
export function hasAccess(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}
