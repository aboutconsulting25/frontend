/**
 * Mock API 서비스
 * 
 * 개발/테스트용 Mock 데이터 반환 로직
 * 실제 API 연동 시에는 사용되지 않음
 */

import type {
  AuthResponse,
  MvpRegisterRequest,
  MvpRegisterResponse,
  SaenggibuAnalysisResponse,
  GradeAnalysisResponse,
  ComprehensiveAnalysisResponse,
  생기부분석,
  성적분석,
  종합분석,
} from '@/types';
import {
  MOCK_SAENGGIBU_ANALYSIS,
  MOCK_GRADE_ANALYSIS,
  MOCK_COMPREHENSIVE_ANALYSIS,
} from '@/data/mockAnalysis';
import { config } from '@/config';

// ============================================
// Helper
// ============================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const { mockDelay } = config.api;

// ============================================
// Mock Auth Service
// ============================================

export const mockAuthService = {
  async login(email: string): Promise<AuthResponse> {
    await delay(mockDelay);
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
};

// ============================================
// Mock MVP Service
// ============================================

export const mockMvpService = {
  async registerSaenggibu(
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
// Mock Analysis Service
// ============================================

export const mockAnalysisService = {
  async getSaenggibuAnalysis(documentId: string): Promise<SaenggibuAnalysisResponse> {
    await delay(mockDelay);
    return {
      success: true,
      data: {
        analysis_id: `analysis-${documentId}`,
        analysis_version: 1,
        completed_at: new Date().toISOString(),
        생기부_분석: MOCK_SAENGGIBU_ANALYSIS,
      },
    };
  },

  async getGradeAnalysis(studentId: string): Promise<GradeAnalysisResponse> {
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
  },

  async getComprehensiveAnalysis(reportId: string): Promise<ComprehensiveAnalysisResponse> {
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
  },
};

// ============================================
// Mock Update Service
// ============================================

export const mockUpdateService = {
  async updateSaenggibuAnalysis(_documentId: string, _data: Partial<생기부분석>) {
    await delay(mockDelay);
    return { success: true, message: '수정 완료 (Mock)' };
  },

  async updateGradeAnalysis(_reportId: string, _data: Partial<성적분석>) {
    await delay(mockDelay);
    return { success: true, message: '수정 완료 (Mock)' };
  },

  async updateComprehensiveAnalysis(_reportId: string, _data: Partial<종합분석>) {
    await delay(mockDelay);
    return { success: true, message: '수정 완료 (Mock)' };
  },
};
