/**
 * React Query Hooks
 * 데이터 페칭을 위한 커스텀 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  studentService,
  consultantService,
  analysisService,
  reportService,
  documentService,
} from '@/services/api';
import { QueryParams, Student, Consultant, AnalysisResult, Report } from '@/types';

// ============================================
// Query Keys
// ============================================
export const queryKeys = {
  students: {
    all: ['students'] as const,
    list: (params?: QueryParams) => ['students', 'list', params] as const,
    detail: (id: string) => ['students', 'detail', id] as const,
    byConsultant: (consultantId: string, params?: QueryParams) => 
      ['students', 'byConsultant', consultantId, params] as const,
  },
  consultants: {
    all: ['consultants'] as const,
    list: (params?: QueryParams) => ['consultants', 'list', params] as const,
    detail: (id: string) => ['consultants', 'detail', id] as const,
  },
  analysis: {
    byStudent: (studentId: string) => ['analysis', 'byStudent', studentId] as const,
    byDocument: (documentId: string) => ['analysis', 'byDocument', documentId] as const,
  },
  reports: {
    all: ['reports'] as const,
    list: (params?: QueryParams) => ['reports', 'list', params] as const,
    detail: (id: string) => ['reports', 'detail', id] as const,
    byStudent: (studentId: string) => ['reports', 'byStudent', studentId] as const,
  },
  documents: {
    byStudent: (studentId: string) => ['documents', 'byStudent', studentId] as const,
  },
};

// ============================================
// Student Hooks
// ============================================
export function useStudents(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.students.list(params),
    queryFn: () => studentService.getAll(params),
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => studentService.getById(id),
    enabled: !!id,
  });
}

export function useStudentsByConsultant(consultantId: string, params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.students.byConsultant(consultantId, params),
    queryFn: () => studentService.getByConsultant(consultantId, params),
    enabled: !!consultantId,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Student>) => studentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) => 
      studentService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
    },
  });
}

export function useAssignStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ studentId, consultantId }: { studentId: string; consultantId: string }) =>
      studentService.assignConsultant(studentId, consultantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultants.all });
    },
  });
}

// ============================================
// Consultant Hooks
// ============================================
export function useConsultants(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.consultants.list(params),
    queryFn: () => consultantService.getAll(params),
  });
}

export function useConsultant(id: string) {
  return useQuery({
    queryKey: queryKeys.consultants.detail(id),
    queryFn: () => consultantService.getById(id),
    enabled: !!id,
  });
}

export function useCreateConsultant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Consultant>) => consultantService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultants.all });
    },
  });
}

export function useUpdateConsultant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Consultant> }) =>
      consultantService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultants.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultants.all });
    },
  });
}

// ============================================
// Analysis Hooks
// ============================================
export function useAnalysisByStudent(studentId: string) {
  return useQuery({
    queryKey: queryKeys.analysis.byStudent(studentId),
    queryFn: () => analysisService.getByStudent(studentId),
    enabled: !!studentId,
  });
}

export function useUpdateAnalysis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AnalysisResult> }) =>
      analysisService.update(id, data),
    onSuccess: (result) => {
      if (result.data?.studentId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.analysis.byStudent(result.data.studentId) 
        });
      }
    },
  });
}

// ============================================
// Report Hooks
// ============================================
export function useReports(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.reports.list(params),
    queryFn: () => reportService.getAll(params),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: queryKeys.reports.detail(id),
    queryFn: () => reportService.getById(id),
    enabled: !!id,
  });
}

export function useReportsByStudent(studentId: string) {
  return useQuery({
    queryKey: queryKeys.reports.byStudent(studentId),
    queryFn: () => reportService.getByStudent(studentId),
    enabled: !!studentId,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Report>) => reportService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
    },
  });
}

export function usePublishReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reportService.publish(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
    },
  });
}

// ============================================
// Document Hooks
// ============================================
export function useDocumentsByStudent(studentId: string) {
  return useQuery({
    queryKey: queryKeys.documents.byStudent(studentId),
    queryFn: () => documentService.getByStudent(studentId),
    enabled: !!studentId,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ studentId, file }: { studentId: string; file: File }) =>
      documentService.upload(studentId, file),
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.byStudent(studentId) });
    },
  });
}

export function useStartAnalysis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (documentId: string) => documentService.startAnalysis(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['analysis'] });
    },
  });
}
