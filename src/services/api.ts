/**
 * API 서비스 (Wrapper)
 *
 * useMock 설정에 따라 Mock API 또는 실제 API 호출
 * 
 * 서버 엔드포인트:
 * - MVP: POST /api/v1/mvp/register-saenggibu/
 * - 생기부: GET /api/v1/documents/{id}/latest-analysis/
 * - 성적: GET /api/v1/grades/student-grade-analysis/?student_id=xxx
 * - 종합: GET /api/v1/reports/{id}/comprehensive-analysis/
 */

import { config } from '@/config';
import type {
  AuthResponse,
  MvpRegisterRequest,
  MvpRegisterResponse,
  SaenggibuAnalysisResponse,
  GradeAnalysisResponse,
  ComprehensiveAnalysisResponse,
  FullAnalysisResult,
  생기부분석,
  성적분석,
  종합분석,
} from '@/types';
import {
  mockAuthService,
  mockMvpService,
  mockAnalysisService,
  mockUpdateService,
} from './mockApi';

// ============================================
// Configuration
// ============================================

const { useMock, baseUrl } = config.api;

// ============================================
// Helper Functions
// ============================================

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// Auth Service
// ============================================

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    // 서버 인증 비활성화 상태이므로 항상 Mock 사용
    return mockAuthService.login(email);
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },
};

// ============================================
// MVP Service (원포인트 API)
// ============================================

export const mvpService = {
  async registerSaenggibu(
    data: MvpRegisterRequest,
    onProgress?: (progress: number, message: string) => void
  ): Promise<MvpRegisterResponse> {
    if (useMock) {
      return mockMvpService.registerSaenggibu(data, onProgress);
    }

    // 실제 API 호출
    onProgress?.(10, '서버에 요청 중...');

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('major_track', data.major_track);
    formData.append('desired_universities', JSON.stringify(data.desired_universities));
    formData.append('file', data.file);
    formData.append('use_mock', String(data.use_mock ?? false));

    const response = await fetch(`${baseUrl}/mvp/register-saenggibu/`, {
      method: 'POST',
      body: formData,
    });

    onProgress?.(90, '응답 처리 중...');

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(error.error || 'Registration failed');
    }

    onProgress?.(100, '완료!');
    return response.json();
  },
};

// ============================================
// Analysis Service
// ============================================

export const analysisService = {
  async getSaenggibuAnalysis(documentId: string): Promise<SaenggibuAnalysisResponse> {
    if (useMock) {
      return mockAnalysisService.getSaenggibuAnalysis(documentId);
    }
    return apiRequest(`/documents/${documentId}/latest-analysis/`);
  },

  async getGradeAnalysis(studentId: string): Promise<GradeAnalysisResponse> {
    if (useMock) {
      return mockAnalysisService.getGradeAnalysis(studentId);
    }
    return apiRequest(`/grades/student-grade-analysis/?student_id=${studentId}`);
  },

  async getComprehensiveAnalysis(reportId: string): Promise<ComprehensiveAnalysisResponse> {
    if (useMock) {
      return mockAnalysisService.getComprehensiveAnalysis(reportId);
    }
    return apiRequest(`/reports/${reportId}/comprehensive-analysis/`);
  },

  async getFullAnalysis(
    studentId: string,
    documentId: string,
    reportId: string
  ): Promise<FullAnalysisResult> {
    const [saenggibu, grades, comprehensive] = await Promise.all([
      this.getSaenggibuAnalysis(documentId),
      this.getGradeAnalysis(studentId),
      this.getComprehensiveAnalysis(reportId),
    ]);

    return {
      student_id: studentId,
      student_name: '김학생',
      document_id: documentId,
      report_id: reportId,
      생기부_분석: saenggibu.data.생기부_분석,
      성적분석: grades.data.성적분석,
      종합분석: comprehensive.data.종합분석,
    };
  },
};

// ============================================
// Update Service
// ============================================

export const updateService = {
  async updateSaenggibuAnalysis(documentId: string, data: Partial<생기부분석>) {
    if (useMock) {
      return mockUpdateService.updateSaenggibuAnalysis(documentId, data);
    }
    return apiRequest(`/documents/${documentId}/update-analysis/`, {
      method: 'PATCH',
      body: JSON.stringify({ 생기부_분석: data }),
    });
  },

  async updateGradeAnalysis(reportId: string, data: Partial<성적분석>) {
    if (useMock) {
      return mockUpdateService.updateGradeAnalysis(reportId, data);
    }
    return apiRequest(`/reports/${reportId}/update-grade-analysis/`, {
      method: 'PATCH',
      body: JSON.stringify({ 성적분석: data }),
    });
  },

  async updateComprehensiveAnalysis(reportId: string, data: Partial<종합분석>) {
    if (useMock) {
      return mockUpdateService.updateComprehensiveAnalysis(reportId, data);
    }
    return apiRequest(`/reports/${reportId}/update-comprehensive-analysis/`, {
      method: 'PATCH',
      body: JSON.stringify({ 종합분석: data }),
    });
  },
};

// ============================================
// Re-export for components
// ============================================

export { 
  MOCK_SAENGGIBU_ANALYSIS, 
  MOCK_GRADE_ANALYSIS, 
  MOCK_COMPREHENSIVE_ANALYSIS 
} from '@/data/mockAnalysis';
