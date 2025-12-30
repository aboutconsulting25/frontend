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
  createdAt: string;
  phone?: string;
  organization?: string;
}

// Role-based permissions
export interface RolePermissions {
  canManageUsers: boolean;
  canManageConsultants: boolean;
  canAssignStudents: boolean;
  canViewAllStudents: boolean;
  canEditAnalysis: boolean;
  canPublishReports: boolean;
  canManagePayments: boolean;
  canAccessSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canManageUsers: true,
    canManageConsultants: true,
    canAssignStudents: true,
    canViewAllStudents: true,
    canEditAnalysis: true,
    canPublishReports: true,
    canManagePayments: true,
    canAccessSettings: true,
  },
  sales_manager: {
    canManageUsers: false,
    canManageConsultants: true,
    canAssignStudents: true,
    canViewAllStudents: true,
    canEditAnalysis: false,
    canPublishReports: false,
    canManagePayments: true,
    canAccessSettings: false,
  },
  head_consultant: {
    canManageUsers: false,
    canManageConsultants: true,
    canAssignStudents: true,
    canViewAllStudents: true,
    canEditAnalysis: true,
    canPublishReports: true,
    canManagePayments: false,
    canAccessSettings: false,
  },
  consultant: {
    canManageUsers: false,
    canManageConsultants: false,
    canAssignStudents: false,
    canViewAllStudents: false,
    canEditAnalysis: true,
    canPublishReports: true,
    canManagePayments: false,
    canAccessSettings: false,
  },
  student: {
    canManageUsers: false,
    canManageConsultants: false,
    canAssignStudents: false,
    canViewAllStudents: false,
    canEditAnalysis: false,
    canPublishReports: false,
    canManagePayments: false,
    canAccessSettings: false,
  },
};

// ============================================
// Student Types
// ============================================

export type StudentStatus = 'pending' | 'analyzing' | 'completed' | 'reviewed';

export type SchoolType = 
  | 'general'           // 일반고
  | 'gangnam_8'         // 강남 8학군
  | 'foreign_language'  // 외고
  | 'international'     // 국제고
  | 'science'           // 과학고
  | 'gifted'            // 영재학교
  | 'autonomous'        // 자사고
  | 'special_purpose';  // 특목고 기타

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  schoolType?: SchoolType;
  grade: number;
  consultantId: string;
  headConsultantId?: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt?: string;
  targetUniversity?: string;
  targetMajor?: string;
  attendance?: AttendanceRecord;
  grades?: GradeRecord[];
}

export interface AttendanceRecord {
  absenceUnexcused: number;
  absenceExcused: number;
  lateCount: number;
  earlyLeaveCount: number;
  classAbsenceCount: number;
}

export interface GradeRecord {
  semester: string;
  subject: string;
  grade: number;
  rawScore?: number;
  average?: number;
  stdDev?: number;
}

// ============================================
// Consultant Types
// ============================================

export type ConsultantStatus = 'active' | 'inactive' | 'pending';

export interface Consultant {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  studentCount: number;
  maxStudentCount?: number;
  salesManagerId?: string;
  headConsultantId?: string;
  isHeadConsultant?: boolean;
  status: ConsultantStatus;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// Sales Manager Types
// ============================================

export interface SalesManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  consultantCount: number;
  studentCount: number;
  monthlyTarget?: number;
  currentAchievement?: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

// ============================================
// Document Types
// ============================================

export type DocumentStatus = 'uploaded' | 'analyzing' | 'analyzed' | 'error';

export interface Document {
  id: string;
  studentId: string;
  fileName: string;
  fileSize: number;
  fileUrl?: string;
  uploadedAt: string;
  status: DocumentStatus;
  analysisResult?: AnalysisResult;
}

// ============================================
// Analysis Types
// ============================================

export interface AnalysisResult {
  id: string;
  studentId?: string;
  documentId: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  subjectAnalysis: SubjectAnalysis[];
  activityAnalysis: ActivityAnalysis[];
  scoreBreakdown?: ScoreBreakdown;
  overallScore: number;
  createdAt: string;
  modifiedAt?: string;
  modifiedBy?: string;
}

export interface SubjectAnalysis {
  subject: string;
  grade: string;
  score: number;
  feedback: string;
  trend: 'up' | 'down' | 'stable';
  keywords?: string[];
}

export interface ActivityAnalysis {
  category: string;
  title: string;
  description: string;
  evaluation: string;
  score: number;
  keywords?: string[];
}

export interface ScoreBreakdown {
  baseScore: number;
  schoolTypeBonus: number;
  attendanceDeduction: number;
  keywordBonus: number;
  gradeScore: number;
  activityScore: number;
  specialBonus: number;
  totalScore: number;
  details: ScoreDetail[];
}

export interface ScoreDetail {
  category: string;
  description: string;
  points: number;
  reason: string;
}

// ============================================
// Payment Types
// ============================================

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  studentId?: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  createdAt: string;
  completedAt?: string;
  description: string;
}

// ============================================
// Report Types
// ============================================

export type ReportStatus = 'draft' | 'review' | 'approved' | 'published';

export interface Report {
  id: string;
  studentId: string;
  studentName: string;
  consultantId: string;
  consultantName: string;
  title: string;
  content: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  pdfUrl?: string;
}

// ============================================
// UI Types
// ============================================

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  children?: NavItem[];
}

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

// ============================================
// API Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string | string[]>;
}
