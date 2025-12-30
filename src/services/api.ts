/**
 * API Service Layer
 * 백엔드 API와 통신하는 서비스 레이어
 */

import {
  Student,
  Consultant,
  User,
  Document,
  AnalysisResult,
  Report,
  Payment,
  ApiResponse,
  PaginatedResponse,
  QueryParams,
} from '@/types';

// ============================================
// Base API Configuration
// ============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = config;
  
  // 토큰 가져오기 (localStorage 또는 cookie)
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth-token') 
    : null;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'API request failed',
      };
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// Query Params Builder
// ============================================
function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
  
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    });
  }
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// ============================================
// Auth Service
// ============================================
export const authService = {
  login: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },
  
  logout: async () => {
    return apiRequest('/auth/logout', { method: 'POST' });
  },
  
  getCurrentUser: async () => {
    return apiRequest<User>('/auth/me');
  },
  
  refreshToken: async () => {
    return apiRequest<{ token: string }>('/auth/refresh', { method: 'POST' });
  },
};

// ============================================
// User Service
// ============================================
export const userService = {
  getAll: async (params?: QueryParams) => {
    const query = params ? buildQueryString(params) : '';
    return apiRequest<PaginatedResponse<User>>(`/users${query}`);
  },
  
  getById: async (id: string) => {
    return apiRequest<User>(`/users/${id}`);
  },
  
  create: async (data: Partial<User> & { password?: string }) => {
    return apiRequest<User>('/users', {
      method: 'POST',
      body: data,
    });
  },
  
  update: async (id: string, data: Partial<User>) => {
    return apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/users/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// Student Service
// ============================================
export const studentService = {
  getAll: async (params?: QueryParams) => {
    const query = params ? buildQueryString(params) : '';
    return apiRequest<PaginatedResponse<Student>>(`/students${query}`);
  },
  
  getById: async (id: string) => {
    return apiRequest<Student>(`/students/${id}`);
  },
  
  getByConsultant: async (consultantId: string, params?: QueryParams) => {
    const query = params ? buildQueryString(params) : '';
    return apiRequest<PaginatedResponse<Student>>(
      `/consultants/${consultantId}/students${query}`
    );
  },
  
  create: async (data: Partial<Student>) => {
    return apiRequest<Student>('/students', {
      method: 'POST',
      body: data,
    });
  },
  
  update: async (id: string, data: Partial<Student>) => {
    return apiRequest<Student>(`/students/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/students/${id}`, { method: 'DELETE' });
  },
  
  assignConsultant: async (studentId: string, consultantId: string) => {
    return apiRequest<Student>(`/students/${studentId}/assign`, {
      method: 'POST',
      body: { consultantId },
    });
  },
};

// ============================================
// Consultant Service
// ============================================
export const consultantService = {
  getAll: async (params?: QueryParams) => {
    const query = params ? buildQueryString(params) : '';
    return apiRequest<PaginatedResponse<Consultant>>(`/consultants${query}`);
  },
  
  getById: async (id: string) => {
    return apiRequest<Consultant>(`/consultants/${id}`);
  },
  
  create: async (data: Partial<Consultant>) => {
    return apiRequest<Consultant>('/consultants', {
      method: 'POST',
      body: data,
    });
  },
  
  update: async (id: string, data: Partial<Consultant>) => {
    return apiRequest<Consultant>(`/consultants/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/consultants/${id}`, { method: 'DELETE' });
  },
  
  // 초기 비밀번호 = ID 설정
  resetPassword: async (id: string) => {
    return apiRequest(`/consultants/${id}/reset-password`, {
      method: 'POST',
    });
  },
};

// ============================================
// Document Service
// ============================================
export const documentService = {
  getByStudent: async (studentId: string) => {
    return apiRequest<Document[]>(`/students/${studentId}/documents`);
  },
  
  upload: async (studentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // FormData는 Content-Type 자동 설정
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/documents`, {
      method: 'POST',
      body: formData,
    });
    
    return response.json() as Promise<ApiResponse<Document>>;
  },
  
  delete: async (id: string) => {
    return apiRequest(`/documents/${id}`, { method: 'DELETE' });
  },
  
  startAnalysis: async (documentId: string) => {
    return apiRequest<Document>(`/documents/${documentId}/analyze`, {
      method: 'POST',
    });
  },
};

// ============================================
// Analysis Service
// ============================================
export const analysisService = {
  getByStudent: async (studentId: string) => {
    return apiRequest<AnalysisResult>(`/students/${studentId}/analysis`);
  },
  
  getByDocument: async (documentId: string) => {
    return apiRequest<AnalysisResult>(`/documents/${documentId}/analysis`);
  },
  
  update: async (id: string, data: Partial<AnalysisResult>) => {
    return apiRequest<AnalysisResult>(`/analysis/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
};

// ============================================
// Report Service
// ============================================
export const reportService = {
  getAll: async (params?: QueryParams) => {
    const query = params ? buildQueryString(params) : '';
    return apiRequest<PaginatedResponse<Report>>(`/reports${query}`);
  },
  
  getById: async (id: string) => {
    return apiRequest<Report>(`/reports/${id}`);
  },
  
  getByStudent: async (studentId: string) => {
    return apiRequest<Report[]>(`/students/${studentId}/reports`);
  },
  
  create: async (data: Partial<Report>) => {
    return apiRequest<Report>('/reports', {
      method: 'POST',
      body: data,
    });
  },
  
  update: async (id: string, data: Partial<Report>) => {
    return apiRequest<Report>(`/reports/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  
  publish: async (id: string) => {
    return apiRequest<Report>(`/reports/${id}/publish`, {
      method: 'POST',
    });
  },
  
  generatePdf: async (id: string) => {
    return apiRequest<{ pdfUrl: string }>(`/reports/${id}/pdf`, {
      method: 'POST',
    });
  },
};

// ============================================
// Payment Service
// ============================================
export const paymentService = {
  getAll: async (params?: QueryParams) => {
    const query = params ? buildQueryString(params) : '';
    return apiRequest<PaginatedResponse<Payment>>(`/payments${query}`);
  },
  
  getById: async (id: string) => {
    return apiRequest<Payment>(`/payments/${id}`);
  },
  
  refund: async (id: string, reason: string) => {
    return apiRequest<Payment>(`/payments/${id}/refund`, {
      method: 'POST',
      body: { reason },
    });
  },
};
