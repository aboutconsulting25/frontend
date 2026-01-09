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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

// ============================================
// Student Types
// ============================================

export type StudentStatus = 'pending' | 'analyzing' | 'completed' | 'reviewed';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: number;
  consultantId: string;
  status: StudentStatus;
  createdAt: string;
  targetUniversity?: string;
  targetMajor?: string;
}

export interface StudentCreateRequest {
  name: string;
  school: string;
  grade: string;
  phone?: string;
  email?: string;
}

export interface UniversityRequest {
  university: string;
  major: string;
  priority: number;
  admissionType?: string;
}

// ============================================
// Analysis Result Types (Exact API Structure)
// ============================================

export interface AnalysisResult {
  // 메타 정보
  student_name: string;
  school: string;
  consultant_name: string;
  analysis_date: string;

  // 종합 분석
  종합분석: {
    종합점수: number;
    종합의견: string;
    수시카드: {
      경로A: Array<{
        대학: string;
        학과: string;
        전형: string;
        판단: '안정' | '적정' | '소신' | '상향';
      }>;
      경로B: Array<{
        대학: string;
        학과: string;
        전형: string;
        판단: '안정' | '적정' | '소신' | '상향';
      }>;
    };
    진로적합도: Array<{
      대학: string;
      적합도: number;
    }>;
    긍정적요소: string[];
    개선필요사항: string[];
    학부모님께드리는조언: string;
    학생에게드리는응원: string;
    목표대학종합의견: string;
    추천방학계획: Array<{
      시기: string;
      활동: string[];
    }>;
  };

  // 성적 분석
  성적분석: {
    성적요약: {
      최고등급: string;
      성적추이: string;
      반영과목: number;
      등급변화: string;
    };
    단기목표: string;
    장기목표: string;
    과목별성적: Array<{
      과목: string;
      등급: (number | null)[];
    }>;
    성적강점: string[];
    성적약점: string[];
    성적보완방안: {
      한줄요약: string;
      본문: string;
    };
  };

  // 생기부 분석
  생기부분석: {
    생기부_진단개요: string;
    강점요약: string[];
    약점요약: string[];
    진로적합성_강화방안: {
      강화방안: {
        한줄요약: string;
        설명: string;
        단계별_방안: string[];
      };
      비교과_지도필요_영역: {
        한줄요약: string;
        설명: string;
        프로젝트_추천: Array<{
          제목: string;
          내용: string;
        }>;
      };
      전공_관련_탐구_및_독서활동: {
        설명: string;
        책_추천: Array<{
          제목: string;
          저자: string;
          이유: string;
        }>;
      };
    };
  };
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
