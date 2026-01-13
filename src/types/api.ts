/**
 * API 타입 정의
 * 
 * 서버 응답 구조와 정확히 매칭되는 타입들입니다.
 * 서버: backend/apps/reports/ai_module.py 참조
 */

// ============================================
// User & Auth Types
// ============================================

export type UserRole = 'admin' | 'sales_manager' | 'head_consultant' | 'consultant' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

// ============================================
// Student Types
// ============================================

export type StudentStatus = 'pending' | 'analyzing' | 'completed' | 'reviewed';
export type MajorTrack = 'HUMANITIES' | 'SCIENCE' | 'ART';

export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  school: string;
  grade: number;
  majorTrack: MajorTrack;
  consultantId?: string;
  status: StudentStatus;
  createdAt: string;
  targetUniversity?: string;
  targetMajor?: string;
}

export interface DesiredUniversity {
  university: string;
  department: string;
}

// ============================================
// MVP API Types
// ============================================

export interface MvpRegisterRequest {
  name: string;
  major_track: MajorTrack;
  desired_universities: DesiredUniversity[];
  file: File;
  use_mock?: boolean;
}

export interface MvpRegisterResponse {
  success: boolean;
  message: string;
  data: {
    student_id: string;
    student_name: string;
    student_code: string;
    major_track: string;
    desired_universities: DesiredUniversity[];
    document_id: string;
    analysis_id: string;
    report_id: string;
    next_steps: {
      생기부_분석: string;
      성적_분석: string;
      종합_분석: string;
    };
  };
}

// ============================================
// 생기부 분석 Types
// ============================================

export interface 생기부분석 {
  강점요약: {
    첫번째_강점: string;
    두번째_강점: string;
    세번째_강점: string;
  };
  약점요약: {
    첫번째_약점: string;
    두번째_약점: string;
    세번째_약점: string;
  };
  생기부_진단개요: {
    '한줄 요약': string;
    본문: string;
  };
  진로적합성_강화방안: {
    강화방안: {
      한줄요약: string;
      설명: string;
      단계별_방안: {
        '1단계': string;
        '2단계': string;
        '3단계': string;
      };
    };
    비교과_지도필요_영역: {
      한줄요약: string;
      설명: string;
      프로젝트_및_심화활동_추천: Array<{
        프로젝트_번호: number;
        제목: string;
        내용: string;
      }>;
    };
    전공_관련_탐구_및_독서활동: {
      설명: string;
      책_추천: Array<{
        책_번호: number;
        제목: string;
        내용: string;
      }>;
    };
  };
}

export interface SaenggibuAnalysisResponse {
  success: boolean;
  data: {
    analysis_id: string;
    analysis_version: number;
    completed_at: string;
    생기부_분석: 생기부분석;
  };
}

// ============================================
// 성적 분석 Types
// ============================================

export interface 내신분석 {
  성적요약: {
    최고등급: string;
    성적추이: string;
    반영과목: string;
  };
  등급변화값: string;
  단기목표: string;
  장기목표: string;
  학기별성적추이그래프: {
    [key: string]: Record<string, string> | undefined;
  };
  학기별등급표: {
    학기별전교과평균등급: Record<string, string>;
    반영과목별평균등급: Record<string, string>;
    성적표: Record<string, Record<string, string>>;
    성적강점: Record<string, string>;
    성적약점: Record<string, string>;
    성적심층분석?: Record<string, {
      과목명: string;
      알파벳: string;
      '5등급제': string;
      '9등급제': string;
      분석내용: string;
    }>;
    성적보완방안: {
      한줄요약설명: string;
      본문설명: string;
    };
  };
}

export interface 모의고사분석 {
  성적요약: {
    최근등급: string;
    성적추이: string;
    전국백분위: string;
    전국석차: string;
  };
  등급변화값: string;
  그룹별성적추이그래프: {
    전과목평균: Record<string, { 등급: string; 백분위: string }>;
    국수영사과평균: Record<string, { 등급: string; 백분위: string }>;
    국수영사평균: Record<string, { 등급: string; 백분위: string }>;
    국수영과평균: Record<string, { 등급: string; 백분위: string }>;
  };
  과목별성적추이그래프: {
    국어: Record<string, { 등급: string; 백분위: string }>;
    영어: Record<string, { 등급: string; 백분위: string }>;
    수학: Record<string, { 등급: string; 백분위: string }>;
    사회: Record<string, { 등급: string; 백분위: string }>;
    과학: Record<string, { 등급: string; 백분위: string }>;
  };
  평균등급표: {
    월별평균등급: Record<string, string>;
    월별평균백분위: Record<string, string>;
    과목별성적표: Record<string, Record<string, string>>;
  };
}

export interface 성적분석 {
  내신: 내신분석;
  모의고사?: 모의고사분석;
}

export interface GradeAnalysisResponse {
  success: boolean;
  data: {
    student_id: string;
    report_id: string;
    created_at: string;
    성적분석: 성적분석;
  };
}

// ============================================
// 종합 분석 Types
// ============================================

export interface 수시카드항목 {
  학교이름: string;
  과이름: string;
  종합판단: string;
}

export interface 종합분석 {
  종합점수: { 값: string };
  종합의견: { 값: string };
  수시카드: {
    경로A: Record<string, 수시카드항목>;
    경로B: Record<string, 수시카드항목>;
  };
  진로적합도: Record<string, { 과이름: string; 적합도: string }>;
  긍정적요소: Record<string, string>;
  개선필요사항: Record<string, string>;
  학부모님께드리는조언: string;
  학생에게드리는응원의메세지: string;
  목표대학에대한종합의견: string;
  수시카드추천종합의견: string;
  추천방학계획: string;
}

export interface ComprehensiveAnalysisResponse {
  success: boolean;
  data: {
    report_id: string;
    student_id: string;
    created_at: string;
    종합분석: 종합분석;
  };
}

// ============================================
// 통합 분석 결과 Type
// ============================================

export interface FullAnalysisResult {
  student_id: string;
  student_name: string;
  document_id: string;
  report_id: string;
  생기부_분석: 생기부분석;
  성적분석: 성적분석;
  종합분석: 종합분석;
}

// ============================================
// API Response Type
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
