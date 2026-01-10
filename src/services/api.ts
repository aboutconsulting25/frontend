/**
 * API 서비스
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
  MOCK_SAENGGIBU_ANALYSIS,
  MOCK_GRADE_ANALYSIS,
  MOCK_COMPREHENSIVE_ANALYSIS,
} from '@/data/mockAnalysis';

// ============================================
// Configuration
// ============================================

const { useMock, baseUrl, mockDelay } = config.api;

// ============================================
// Helper Functions
// ============================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    await delay(mockDelay);
    // 서버에서 인증 비활성화 상태이므로 Mock 로그인만 지원
    return {
      success: true,
      user: {
        id: 'consultant-1',
        name: '김대표',
        email,
        role: 'consultant',
      },
      token: 'mock_token_' + Date.now(),
    };
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
  /**
   * 생기부 등록 원포인트 API
   * POST /api/v1/mvp/register-saenggibu/
   */
  async registerSaenggibu(
    data: MvpRegisterRequest,
    onProgress?: (progress: number, message: string) => void
  ): Promise<MvpRegisterResponse> {
    if (useMock) {
      return this._mockRegister(data, onProgress);
    }

    onProgress?.(10, '서버에 요청 중...');

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('major_track', data.major_track);
    formData.append('desired_universities', JSON.stringify(data.desired_universities));
    formData.append('file', data.file);
    formData.append('use_mock', String(data.use_mock ?? true));

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

  async _mockRegister(
    data: MvpRegisterRequest,
    onProgress?: (progress: number, message: string) => void
  ): Promise<MvpRegisterResponse> {
    const steps = [
      { progress: 10, message: '학생 정보 등록 중...' },
      { progress: 25, message: '희망 대학 저장 중...' },
      { progress: 40, message: 'PDF 업로드 중...' },
      { progress: 55, message: 'AI 분석 시작...' },
      { progress: 70, message: '생기부 텍스트 추출 중...' },
      { progress: 80, message: '학업 역량 분석 중...' },
      { progress: 90, message: '종합 리포트 생성 중...' },
      { progress: 100, message: '분석 완료!' },
    ];

    for (const step of steps) {
      await delay(400);
      onProgress?.(step.progress, step.message);
    }

    const timestamp = Date.now();
    return {
      success: true,
      message: '생기부 등록 및 분석이 완료되었습니다.',
      data: {
        student_id: `student-${timestamp}`,
        student_name: data.name,
        student_code: `STU-${timestamp}`,
        major_track: data.major_track,
        desired_universities: data.desired_universities,
        document_id: `doc-${timestamp}`,
        analysis_id: `analysis-${timestamp}`,
        report_id: `report-${timestamp}`,
        next_steps: {
          생기부_분석: `/api/v1/documents/doc-${timestamp}/latest-analysis/`,
          성적_분석: `/api/v1/grades/student-grade-analysis/?student_id=student-${timestamp}`,
          종합_분석: `/api/v1/reports/report-${timestamp}/comprehensive-analysis/`,
        },
      },
    };
  },
};

// ============================================
// Analysis Service
// ============================================

export const analysisService = {
  /**
   * 생기부 분석 결과 조회
   */
  async getSaenggibuAnalysis(documentId: string): Promise<SaenggibuAnalysisResponse> {
    if (useMock) {
      await delay(mockDelay);
      return {
        success: true,
        data: {
          analysis_id: 'analysis-mock',
          analysis_version: 1,
          completed_at: new Date().toISOString(),
          생기부_분석: MOCK_SAENGGIBU_ANALYSIS,
        },
      };
    }

    return apiRequest(`/documents/documents/${documentId}/latest-analysis/`);
  },

  /**
   * 성적 분석 결과 조회
   */
  async getGradeAnalysis(studentId: string): Promise<GradeAnalysisResponse> {
    if (useMock) {
      await delay(mockDelay);
      return {
        success: true,
        data: {
          student_id: studentId,
          report_id: 'report-mock',
          created_at: new Date().toISOString(),
          성적분석: MOCK_GRADE_ANALYSIS,
        },
      };
    }

    return apiRequest(`/grades/student-grade-analysis/?student_id=${studentId}`);
  },

  /**
   * 종합 분석 결과 조회
   */
  async getComprehensiveAnalysis(reportId: string): Promise<ComprehensiveAnalysisResponse> {
    if (useMock) {
      await delay(mockDelay);
      return {
        success: true,
        data: {
          report_id: reportId,
          student_id: 'student-mock',
          created_at: new Date().toISOString(),
          종합분석: MOCK_COMPREHENSIVE_ANALYSIS,
        },
      };
    }

    return apiRequest(`/reports/consultation-reports/${reportId}/comprehensive-analysis/`);
  },

  /**
   * 전체 분석 결과 조회 (병렬 요청)
   */
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
      student_name: '김시연',
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
      await delay(mockDelay);
      return { success: true, message: '수정 완료' };
    }

    return apiRequest(`/documents/documents/${documentId}/update-analysis/`, {
      method: 'PATCH',
      body: JSON.stringify({ 생기부_분석: data }),
    });
  },

  async updateGradeAnalysis(reportId: string, data: Partial<성적분석>) {
    if (useMock) {
      await delay(mockDelay);
      return { success: true, message: '수정 완료' };
    }

    return apiRequest(`/reports/consultation-reports/${reportId}/update-grade-analysis/`, {
      method: 'PATCH',
      body: JSON.stringify({ 성적분석: data }),
    });
  },

  async updateComprehensiveAnalysis(reportId: string, data: Partial<종합분석>) {
    if (useMock) {
      await delay(mockDelay);
      return { success: true, message: '수정 완료' };
    }

    return apiRequest(`/reports/consultation-reports/${reportId}/update-comprehensive-analysis/`, {
      method: 'PATCH',
      body: JSON.stringify({ 종합분석: data }),
    });
  },
};

// ============================================
// Re-export mock data for components
// ============================================

export { MOCK_SAENGGIBU_ANALYSIS, MOCK_GRADE_ANALYSIS, MOCK_COMPREHENSIVE_ANALYSIS };
